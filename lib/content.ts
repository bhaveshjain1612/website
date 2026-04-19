import { cache } from "react";
import {
  buildSearchItems,
  FALLBACK_SITE_CONTENT,
  formatMonthYear,
  type BlogPost,
  type ExperienceItem,
  type GalleryItem,
  type RecentItem,
  type ProjectItem,
  type SiteContent
} from "@/lib/site-data";
import { isSanityConfigured } from "@/lib/sanity/env";
import { sanityClient } from "@/lib/sanity/client";
import {
  blogBySlugQuery,
  blogsQuery,
  educationQuery,
  experienceQuery,
  galleriesQuery,
  galleryBySlugQuery,
  nowItemsQuery,
  projectQuery,
  siteSettingsQuery
} from "@/lib/sanity/queries";

type SanitySettings = {
  siteName?: string;
  tagline?: string;
  bio?: string;
  heroImages?: string[];
  quotes?: string[];
  contactEmail?: string;
  contactFormEndpoint?: string;
  newsletterEndpoint?: string;
  textureOverlayLight?: string;
  textureOverlayDark?: string;
  socialLinks?: Array<{ platform?: string; url?: string; icon?: string }>;
};

type SanityNowItem = {
  label?: string;
  value?: string;
};

type SanityEducation = {
  school?: string;
  deg?: string;
  sub?: string;
  period?: string;
  startDate?: string;
  endDate?: string;
  gpa?: string;
  courses?: string[];
};

type SanityExperience = {
  co?: string;
  role?: string;
  period?: string;
  startDate?: string;
  endDate?: string;
  isCurrent?: boolean;
  where?: string;
  hl?: string[];
  priority?: boolean;
};

function formatPeriod(
  manualPeriod?: string,
  startDate?: string,
  endDate?: string,
  isCurrent?: boolean
): string {
  const trimmedManual = manualPeriod?.trim();
  if (trimmedManual) {
    return trimmedManual;
  }

  const start = startDate ? formatMonthYear(startDate) : "";
  const end = isCurrent ? "Present" : endDate ? formatMonthYear(endDate) : "";

  if (start && end) {
    return `${start} - ${end}`;
  }
  if (start) {
    return start;
  }
  if (end) {
    return end;
  }
  return "";
}

function buildRecentItems(blogs: BlogPost[], galleries: GalleryItem[]): SiteContent["recent"] {
  const fromBlogs: RecentItem[] = blogs.slice(0, 6).map((blog, index) => ({
    type:
      blog.cat === "travel"
        ? "travel"
        : blog.cat === "thoughts"
          ? "thoughts"
          : "tech",
    title: blog.title,
    date: blog.date,
    img: blog.coverImage || "",
    tall: index % 3 === 0,
    path: `/blog/${blog.slug}`
  }));

  const fromGalleries: RecentItem[] = galleries.slice(0, 4).map((gallery, index) => ({
    title: gallery.title,
    type: "gallery" as const,
    date: gallery.date,
    img: gallery.cover || "",
    tall: index % 2 === 0,
    path: `/gallery/${gallery.slug}`
  }));

  return [...fromBlogs, ...fromGalleries]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 10);
}

function sanitizeBlog(raw: Partial<BlogPost>): BlogPost | null {
  if (!raw.title || !raw.slug) {
    return null;
  }
  return {
    title: raw.title,
    slug: raw.slug,
    date: raw.date || new Date().toISOString(),
    cat: (raw.cat as BlogPost["cat"]) || "thoughts",
    ex: raw.ex || "",
    coverImage: raw.coverImage || "",
    body: raw.body || [],
    tags: raw.tags || []
  };
}

function sanitizeGallery(raw: Partial<GalleryItem>): GalleryItem | null {
  if (!raw.title || !raw.slug) {
    return null;
  }
  const tags = Array.isArray(raw.tags)
    ? raw.tags
        .filter((tag): tag is string => typeof tag === "string" && tag.trim().length > 0)
        .map((tag) => tag.trim())
    : [];
  const lightroomShareUrl =
    typeof raw.lightroomShareUrl === "string" && raw.lightroomShareUrl.trim().length > 0
      ? raw.lightroomShareUrl.trim()
      : undefined;

  return {
    title: raw.title,
    slug: raw.slug,
    location: raw.location || "",
    date: raw.date || new Date().toISOString(),
    cover: raw.cover || "",
    desc: raw.desc || "",
    photos:
      raw.photos
        ?.filter((photo) => typeof photo?.url === "string" && photo.url.trim().length > 0)
        .map((photo) => ({
          url: photo.url.trim(),
          caption: photo.caption
        })) || [],
    tags,
    lightroomShareUrl
  };
}

const fetchCmsContent = cache(async (): Promise<SiteContent | null> => {
  if (!isSanityConfigured) {
    return null;
  }

  try {
    const [settings, nowItems, blogsRaw, galleriesRaw, educationRaw, experienceRaw, projectRaw] =
      await Promise.all([
        sanityClient.fetch<SanitySettings | null>(siteSettingsQuery),
        sanityClient.fetch<SanityNowItem[]>(nowItemsQuery),
        sanityClient.fetch<Array<Partial<BlogPost>>>(blogsQuery),
        sanityClient.fetch<Array<Partial<GalleryItem>>>(galleriesQuery),
        sanityClient.fetch<SanityEducation[]>(educationQuery),
        sanityClient.fetch<SanityExperience[]>(experienceQuery),
        sanityClient.fetch<Partial<ProjectItem> | null>(projectQuery)
      ]);

    const blogs = blogsRaw.map(sanitizeBlog).filter((item): item is BlogPost => Boolean(item));
    const galleries = galleriesRaw
      .map(sanitizeGallery)
      .filter((item): item is GalleryItem => Boolean(item));
    const mappedSettings = {
      siteName: settings?.siteName || FALLBACK_SITE_CONTENT.settings.siteName,
      tagline: settings?.tagline || FALLBACK_SITE_CONTENT.settings.tagline,
      bio: settings?.bio || FALLBACK_SITE_CONTENT.settings.bio,
      heroImages:
        settings?.heroImages?.filter(Boolean).length
          ? settings.heroImages.filter(Boolean)
          : [],
      quotes:
        settings?.quotes?.filter(Boolean).length
          ? settings.quotes.filter(Boolean)
          : FALLBACK_SITE_CONTENT.settings.quotes,
      contactEmail: settings?.contactEmail || FALLBACK_SITE_CONTENT.settings.contactEmail,
      contactFormEndpoint:
        settings?.contactFormEndpoint || FALLBACK_SITE_CONTENT.settings.contactFormEndpoint,
      newsletterEndpoint:
        settings?.newsletterEndpoint || FALLBACK_SITE_CONTENT.settings.newsletterEndpoint,
      textureOverlayLight:
        settings?.textureOverlayLight || FALLBACK_SITE_CONTENT.settings.textureOverlayLight,
      textureOverlayDark:
        settings?.textureOverlayDark || FALLBACK_SITE_CONTENT.settings.textureOverlayDark,
      socialLinks:
        settings?.socialLinks?.length
          ? settings.socialLinks
              .filter((item) => item?.platform && item?.url)
              .map((item) => ({
                name: item.platform as string,
                url: item.url as string,
                ico: item.icon || (item.platform as string).slice(0, 2)
              }))
          : FALLBACK_SITE_CONTENT.settings.socialLinks
    };

    const mappedNowItems =
      nowItems.length > 0
        ? nowItems
            .filter((item) => item.label && item.value)
            .map((item) => ({ l: item.label as string, v: item.value as string }))
        : FALLBACK_SITE_CONTENT.nowItems;

    const mappedEducation =
      educationRaw.length > 0
        ? educationRaw
            .filter((item) => item.school)
            .map((item) => ({
              school: item.school as string,
              deg: item.deg || "",
              sub: item.sub || "",
              when: formatPeriod(item.period, item.startDate, item.endDate),
              gpa: item.gpa || "",
              tags: item.courses || []
            }))
        : FALLBACK_SITE_CONTENT.education;

    const mappedExperience: ExperienceItem[] =
      experienceRaw.length > 0
        ? experienceRaw
            .filter((item) => item.co)
            .map((item, index) => ({
              co: item.co as string,
              role: item.role || "",
              when: formatPeriod(item.period, item.startDate, item.endDate, item.isCurrent),
              where: item.where || "",
              hl: item.hl || [],
              side: index % 2 === 0 ? ("right" as const) : ("left" as const),
              pri: Boolean(item.priority)
            }))
        : FALLBACK_SITE_CONTENT.experience;

    const mappedProject =
      projectRaw?.title && projectRaw.description
        ? {
            title: projectRaw.title,
            subtitle: projectRaw.subtitle || "",
            description: projectRaw.description,
            techStack: projectRaw.techStack || [],
            stats: projectRaw.stats || []
          }
        : FALLBACK_SITE_CONTENT.project;

    const mergedBlogs = blogs.length ? blogs : FALLBACK_SITE_CONTENT.blogs;
    const mergedGalleries = galleries.length ? galleries : FALLBACK_SITE_CONTENT.galleries;
    const recent = buildRecentItems(mergedBlogs, mergedGalleries);

    const content: SiteContent = {
      settings: mappedSettings,
      nowItems: mappedNowItems,
      blogs: mergedBlogs,
      galleries: mergedGalleries,
      education: mappedEducation,
      experience: mappedExperience,
      skills: FALLBACK_SITE_CONTENT.skills,
      project: mappedProject,
      recent,
      searchItems: []
    };

    return {
      ...content,
      searchItems: buildSearchItems(content)
    };
  } catch {
    return null;
  }
});

export async function getSiteContent(): Promise<SiteContent> {
  const cmsContent = await fetchCmsContent();
  return cmsContent ?? FALLBACK_SITE_CONTENT;
}

export async function getBlogBySlug(slug: string): Promise<BlogPost | null> {
  if (!slug) {
    return null;
  }

  if (isSanityConfigured) {
    try {
      const raw = await sanityClient.fetch<Partial<BlogPost> | null>(blogBySlugQuery, { slug });
      if (raw) {
        const blog = sanitizeBlog(raw);
        if (blog) {
          return blog;
        }
      }
    } catch {
      // Fallback below.
    }
  }

  return FALLBACK_SITE_CONTENT.blogs.find((item) => item.slug === slug) ?? null;
}

export async function getGalleryBySlug(slug: string): Promise<GalleryItem | null> {
  if (!slug) {
    return null;
  }

  if (isSanityConfigured) {
    try {
      const raw = await sanityClient.fetch<Partial<GalleryItem> | null>(galleryBySlugQuery, {
        slug
      });
      if (raw) {
        const gallery = sanitizeGallery(raw);
        if (gallery) {
          return gallery;
        }
      }
    } catch {
      // Fallback below.
    }
  }

  return FALLBACK_SITE_CONTENT.galleries.find((item) => item.slug === slug) ?? null;
}
