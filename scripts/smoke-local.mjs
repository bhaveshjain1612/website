const BASE_URL = process.env.SMOKE_BASE_URL || "http://localhost:3000";

const pageRoutes = [
  "/",
  "/building",
  "/living",
  "/gallery",
  "/contact",
  "/blog/ghat-banarasiya",
  "/gallery/wildlife-at-home"
];

const textRoutes = ["/robots.txt", "/sitemap.xml"];
const studioRoute = "/studio";

function toAbsoluteUrl(input) {
  if (!input) return null;
  const decoded = input.replaceAll("&amp;", "&");
  if (decoded.startsWith("http://") || decoded.startsWith("https://")) return decoded;
  if (decoded.startsWith("//")) return `http:${decoded}`;
  if (decoded.startsWith("/")) return `${BASE_URL}${decoded}`;
  return `${BASE_URL}/${decoded}`;
}

async function assertStatus(path, expected = 200) {
  const url = `${BASE_URL}${path}`;
  const response = await fetch(url, { redirect: "follow" });
  if (response.status !== expected) {
    throw new Error(`Expected ${expected} for ${path}, got ${response.status}`);
  }
  return response;
}

function collectAssetLinks(html) {
  const links = new Set();
  const regex = /(href|src)=["']([^"']+)["']/gi;
  for (const match of html.matchAll(regex)) {
    const raw = match[2];
    if (!raw) continue;
    if (!raw.includes("/_next/")) continue;
    const absolute = toAbsoluteUrl(raw);
    if (absolute) links.add(absolute);
  }
  return Array.from(links);
}

async function main() {
  const report = [];

  for (const route of pageRoutes) {
    const res = await assertStatus(route, 200);
    const html = await res.text();
    const assets = collectAssetLinks(html).slice(0, 8);

    if (assets.length === 0) {
      throw new Error(`No Next.js assets found in HTML for ${route}`);
    }

    for (const assetUrl of assets) {
      const assetRes = await fetch(assetUrl, { redirect: "follow" });
      if (assetRes.status !== 200) {
        throw new Error(`Asset ${assetUrl} returned ${assetRes.status} (route ${route})`);
      }
    }

    report.push(`OK ${route} (${assets.length} assets)`);
  }

  for (const route of textRoutes) {
    await assertStatus(route, 200);
    report.push(`OK ${route}`);
  }

  await assertStatus(studioRoute, 200);
  report.push(`OK ${studioRoute}`);

  console.log(`Smoke test passed for ${BASE_URL}`);
  for (const line of report) {
    console.log(line);
  }
}

main().catch((error) => {
  console.error("Smoke test failed:");
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
});

