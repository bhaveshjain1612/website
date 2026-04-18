import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { GalleryDetailPage } from "@/components/gallery-detail-page";
import { getGalleryBySlug } from "@/lib/content";

export const revalidate = 60;

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const gallery = await getGalleryBySlug(slug);

  if (!gallery) {
    return {
      title: "Gallery not found"
    };
  }

  return {
    title: gallery.title,
    description: gallery.desc,
    openGraph: {
      title: gallery.title,
      description: gallery.desc,
      images: gallery.cover ? [{ url: gallery.cover }] : undefined
    },
    twitter: {
      card: "summary_large_image",
      title: gallery.title,
      description: gallery.desc,
      images: gallery.cover ? [gallery.cover] : undefined
    }
  };
}

export default async function Page({ params }: PageProps) {
  const { slug } = await params;
  const gallery = await getGalleryBySlug(slug);

  if (!gallery) {
    notFound();
  }

  return <GalleryDetailPage gallery={gallery} />;
}
