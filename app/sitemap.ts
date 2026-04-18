import type { MetadataRoute } from "next";
import { getSiteContent } from "@/lib/content";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const content = await getSiteContent();
  const staticRoutes = ["", "/building", "/living", "/gallery", "/contact"];

  const staticEntries: MetadataRoute.Sitemap = staticRoutes.map((path) => ({
    url: `${siteUrl}${path}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: path === "" ? 1 : 0.8
  }));

  const blogEntries: MetadataRoute.Sitemap = content.blogs.map((blog) => ({
    url: `${siteUrl}/blog/${blog.slug}`,
    lastModified: new Date(blog.date),
    changeFrequency: "monthly",
    priority: 0.7
  }));

  const galleryEntries: MetadataRoute.Sitemap = content.galleries.map((gallery) => ({
    url: `${siteUrl}/gallery/${gallery.slug}`,
    lastModified: new Date(gallery.date),
    changeFrequency: "monthly",
    priority: 0.7
  }));

  return [...staticEntries, ...blogEntries, ...galleryEntries];
}
