import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { BlogDetailPage } from "@/components/blog-detail-page";
import { getBlogBySlug } from "@/lib/content";

export const revalidate = 60;

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogBySlug(slug);

  if (!post) {
    return {
      title: "Post not found"
    };
  }

  return {
    title: post.title,
    description: post.ex,
    openGraph: {
      title: post.title,
      description: post.ex,
      images: post.coverImage ? [{ url: post.coverImage }] : undefined,
      type: "article"
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.ex,
      images: post.coverImage ? [post.coverImage] : undefined
    }
  };
}

export default async function Page({ params }: PageProps) {
  const { slug } = await params;
  const post = await getBlogBySlug(slug);

  if (!post) {
    notFound();
  }

  return <BlogDetailPage post={post} />;
}
