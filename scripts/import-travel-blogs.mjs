import crypto from "node:crypto";
import path from "node:path";
import { createClient } from "@sanity/client";

const WORDPRESS_POSTS_URL = "https://public-api.wordpress.com/rest/v1.1/sites/bhaveshjain.in/posts/?number=100";
const NON_TRAVEL_SLUGS = new Set([
  "stockspectra-from-idea-to-impact",
  "my-writing-style-and-storybrand"
]);

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2025-01-01";
const token = process.env.SANITY_WRITE_TOKEN;

if (!projectId || !dataset || !token) {
  console.error(
    "Missing Sanity env vars. Required: NEXT_PUBLIC_SANITY_PROJECT_ID, NEXT_PUBLIC_SANITY_DATASET, SANITY_WRITE_TOKEN."
  );
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  apiVersion,
  token,
  useCdn: false,
  perspective: "published"
});

const imageAssetCache = new Map();

function makeKey() {
  return crypto.randomBytes(8).toString("hex");
}

function decodeEntities(value) {
  if (!value) {
    return "";
  }

  const named = {
    amp: "&",
    apos: "'",
    gt: ">",
    lt: "<",
    nbsp: " ",
    ndash: "–",
    mdash: "—",
    hellip: "…",
    rsquo: "’",
    lsquo: "‘",
    rdquo: "”",
    ldquo: "“",
    quot: "\""
  };

  return value.replace(/&(#x?[0-9a-fA-F]+|[a-zA-Z]+);/g, (_match, entity) => {
    const lower = entity.toLowerCase();
    if (lower.startsWith("#x")) {
      const code = Number.parseInt(lower.slice(2), 16);
      return Number.isFinite(code) ? String.fromCodePoint(code) : _match;
    }
    if (lower.startsWith("#")) {
      const code = Number.parseInt(lower.slice(1), 10);
      return Number.isFinite(code) ? String.fromCodePoint(code) : _match;
    }
    return named[lower] || _match;
  });
}

function stripHtmlToText(html) {
  if (!html) {
    return "";
  }

  return decodeEntities(
    html
      .replace(/<br\s*\/?>/gi, "\n")
      .replace(/<\/(p|div|h[1-6]|li|blockquote)>/gi, "\n\n")
      .replace(/<[^>]*>/g, " ")
  )
    .replace(/\r/g, "")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n[ \t]+/g, "\n")
    .replace(/[ \t]{2,}/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function getAttr(tag, attrName) {
  const regex = new RegExp(`${attrName}\\s*=\\s*(\"([^\"]*)\"|'([^']*)'|([^\\s>]+))`, "i");
  const match = tag.match(regex);
  if (!match) {
    return "";
  }
  return decodeEntities(match[2] || match[3] || match[4] || "").trim();
}

function normalizeImageUrl(rawUrl) {
  if (!rawUrl || rawUrl.startsWith("data:")) {
    return "";
  }

  try {
    const absoluteUrl = new URL(rawUrl, "https://bhaveshjain.in");
    ["w", "h", "crop", "resize", "fit", "quality", "ssl"].forEach((param) =>
      absoluteUrl.searchParams.delete(param)
    );
    return absoluteUrl.toString();
  } catch {
    return "";
  }
}

function extractImageFromToken(token) {
  const imageMatch = token.match(/<img[^>]*>/i);
  if (!imageMatch) {
    return null;
  }

  const imageTag = imageMatch[0];
  const src = normalizeImageUrl(getAttr(imageTag, "src"));
  if (!src) {
    return null;
  }

  const alt = getAttr(imageTag, "alt");
  const captionMatch = token.match(/<figcaption[^>]*>([\s\S]*?)<\/figcaption>/i);
  const caption = captionMatch ? stripHtmlToText(captionMatch[1]) : "";

  return {
    src,
    alt: alt || caption,
    caption
  };
}

function htmlToTokens(html) {
  const tokenRegex =
    /<figure[\s\S]*?<\/figure>|<img[^>]*>|<h[1-6][^>]*>[\s\S]*?<\/h[1-6]>|<p[^>]*>[\s\S]*?<\/p>|<blockquote[^>]*>[\s\S]*?<\/blockquote>|<li[^>]*>[\s\S]*?<\/li>/gi;

  return html.match(tokenRegex) || [];
}

function tokenToTextBlock(token) {
  const text = stripHtmlToText(token);
  if (!text) {
    return null;
  }

  let style = "normal";
  if (/^<h1/i.test(token)) style = "h1";
  if (/^<h2/i.test(token)) style = "h2";
  if (/^<h3/i.test(token)) style = "h3";
  if (/^<h4/i.test(token)) style = "h4";
  if (/^<h5/i.test(token)) style = "h5";
  if (/^<h6/i.test(token)) style = "h6";
  if (/^<blockquote/i.test(token)) style = "blockquote";

  const blockText = /^<li/i.test(token) ? `- ${text}` : text;
  return {
    _type: "block",
    _key: makeKey(),
    style,
    markDefs: [],
    children: [
      {
        _type: "span",
        _key: makeKey(),
        text: blockText,
        marks: []
      }
    ]
  };
}

function contentTypeToExtension(contentType) {
  const mapping = {
    "image/jpeg": ".jpg",
    "image/png": ".png",
    "image/webp": ".webp",
    "image/gif": ".gif",
    "image/avif": ".avif",
    "image/svg+xml": ".svg"
  };
  return mapping[contentType] || ".jpg";
}

function filenameFromUrl(imageUrl, contentType) {
  try {
    const parsed = new URL(imageUrl);
    const base = path.basename(parsed.pathname);
    if (base && base.includes(".")) {
      return base;
    }
  } catch {
    // fallback below
  }
  return `wp-${crypto.randomBytes(6).toString("hex")}${contentTypeToExtension(contentType)}`;
}

async function getOrUploadImageAssetId(imageUrl) {
  if (!imageUrl) {
    return null;
  }

  if (imageAssetCache.has(imageUrl)) {
    return imageAssetCache.get(imageUrl);
  }

  const existingAssetId = await client.fetch(
    '*[_type == "sanity.imageAsset" && source.url == $url][0]._id',
    { url: imageUrl }
  );

  if (existingAssetId) {
    imageAssetCache.set(imageUrl, existingAssetId);
    return existingAssetId;
  }

  const response = await fetchImageWithFallback(imageUrl);

  const contentType = (response.headers.get("content-type") || "image/jpeg").split(";")[0].trim();
  const buffer = Buffer.from(await response.arrayBuffer());

  if (!buffer.length) {
    throw new Error(`Empty image response for ${imageUrl}`);
  }

  const filename = filenameFromUrl(imageUrl, contentType);
  const sourceId = crypto.createHash("sha1").update(imageUrl).digest("hex");

  const assetDoc = await client.assets.upload("image", buffer, {
    filename,
    contentType,
    source: {
      id: sourceId,
      name: "bhaveshjain-wordpress-import",
      url: imageUrl
    }
  });

  imageAssetCache.set(imageUrl, assetDoc._id);
  return assetDoc._id;
}

async function fetchImageWithFallback(imageUrl) {
  const attempted = [];
  const candidates = [imageUrl];

  try {
    const parsed = new URL(imageUrl);
    if (parsed.hostname === "bhaveshjain.in") {
      candidates.push(`https://i0.wp.com${parsed.pathname}`);
    }
  } catch {
    // Keep original candidate only.
  }

  for (const candidate of candidates) {
    attempted.push(candidate);
    const response = await fetch(candidate, {
      headers: {
        "user-agent": "Mozilla/5.0 (Codex Travel Importer)"
      }
    });
    if (response.ok) {
      return response;
    }
  }

  throw new Error(`Failed to fetch image from: ${attempted.join(" | ")}`);
}

function isBlogCategoryPost(post) {
  const categories = Object.keys(post?.categories || {});
  return categories.includes("Blog");
}

function isTravelBlogPost(post) {
  if (!isBlogCategoryPost(post)) {
    return false;
  }
  return !NON_TRAVEL_SLUGS.has(post.slug);
}

function firstInlineImageUrl(html) {
  const firstImageMatch = html?.match(/<img[^>]*>/i);
  if (!firstImageMatch) {
    return "";
  }
  return normalizeImageUrl(getAttr(firstImageMatch[0], "src"));
}

async function convertHtmlToPortableBody(html, postTitle) {
  const tokens = htmlToTokens(html);
  const portable = [];

  for (const token of tokens) {
    if (/<img/i.test(token) || /^<figure/i.test(token)) {
      const image = extractImageFromToken(token);
      if (!image) {
        continue;
      }

      try {
        const assetId = await getOrUploadImageAssetId(image.src);
        if (!assetId) {
          continue;
        }
        portable.push({
          _type: "image",
          _key: makeKey(),
          asset: {
            _type: "reference",
            _ref: assetId
          },
          alt: image.alt || postTitle,
          caption: image.caption || undefined
        });
      } catch (error) {
        console.warn(`  - Skipped inline image: ${image.src}`);
        console.warn(`    ${error instanceof Error ? error.message : String(error)}`);
      }
      continue;
    }

    const textBlock = tokenToTextBlock(token);
    if (textBlock) {
      portable.push(textBlock);
    }
  }

  if (portable.length > 0) {
    return portable;
  }

  const fallbackText = stripHtmlToText(html);
  if (!fallbackText) {
    return [
      {
        _type: "block",
        _key: makeKey(),
        style: "normal",
        markDefs: [],
        children: [
          {
            _type: "span",
            _key: makeKey(),
            text: postTitle,
            marks: []
          }
        ]
      }
    ];
  }

  return fallbackText.split(/\n{2,}/).map((paragraph) => ({
    _type: "block",
    _key: makeKey(),
    style: "normal",
    markDefs: [],
    children: [
      {
        _type: "span",
        _key: makeKey(),
        text: paragraph.trim(),
        marks: []
      }
    ]
  }));
}

async function upsertTravelPost(post) {
  const title = stripHtmlToText(post.title) || post.slug;
  const excerpt = stripHtmlToText(post.excerpt || "");
  const body = await convertHtmlToPortableBody(post.content || "", title);

  const featured = normalizeImageUrl(post.featured_image || "");
  const fallbackImage = firstInlineImageUrl(post.content || "");
  const coverSourceUrl = featured || fallbackImage;
  let coverImageField;

  if (coverSourceUrl) {
    try {
      const assetId = await getOrUploadImageAssetId(coverSourceUrl);
      if (assetId) {
        coverImageField = {
          _type: "image",
          asset: {
            _type: "reference",
            _ref: assetId
          }
        };
      }
    } catch (error) {
      console.warn(`  - Skipped cover image: ${coverSourceUrl}`);
      console.warn(`    ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  const tags = Object.keys(post.tags || {});
  const slug = post.slug;
  const documentId = `blogPost.${slug}`;
  const existingIds = await client.fetch('*[_type == "blogPost" && slug.current == $slug]._id', {
    slug
  });

  const doc = {
    _id: documentId,
    _type: "blogPost",
    title,
    slug: { _type: "slug", current: slug },
    category: "travel",
    date: typeof post.date === "string" ? post.date.slice(0, 10) : new Date().toISOString().slice(0, 10),
    excerpt,
    body,
    tags,
    featured: false,
    ...(coverImageField ? { coverImage: coverImageField } : {})
  };

  const tx = client.transaction().createOrReplace(doc);
  for (const existingId of existingIds) {
    if (existingId !== documentId) {
      tx.delete(existingId);
    }
  }

  await tx.commit();
}

async function main() {
  console.log(`Fetching posts from ${WORDPRESS_POSTS_URL}`);
  const response = await fetch(WORDPRESS_POSTS_URL, {
    headers: {
      "user-agent": "Mozilla/5.0 (Codex Travel Importer)"
    }
  });

  if (!response.ok) {
    throw new Error(`WordPress fetch failed with status ${response.status}`);
  }

  const payload = await response.json();
  const posts = Array.isArray(payload.posts) ? payload.posts : [];
  const travelPosts = posts.filter(isTravelBlogPost);

  if (!travelPosts.length) {
    console.log("No travel blog posts found from source.");
    return;
  }

  console.log(`Importing ${travelPosts.length} travel blog posts...`);

  const imported = [];
  const failed = [];

  for (const post of travelPosts) {
    const title = stripHtmlToText(post.title) || post.slug;
    process.stdout.write(`- ${title} (${post.slug})\n`);
    try {
      await upsertTravelPost(post);
      imported.push(post.slug);
    } catch (error) {
      failed.push(post.slug);
      console.error(`  ! Failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  const sanityTravelCount = await client.fetch('count(*[_type == "blogPost" && category == "travel"])');

  console.log("");
  console.log(`Imported/updated: ${imported.length}`);
  if (failed.length) {
    console.log(`Failed: ${failed.length} (${failed.join(", ")})`);
  }
  console.log(`Total travel blog docs in Sanity now: ${sanityTravelCount}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
