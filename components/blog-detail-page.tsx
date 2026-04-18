import Image from "next/image";
import { PortableText } from "@portabletext/react";
import type { TypedObject } from "sanity";
import { LiftedTitle } from "@/components/lifted-title";
import { urlFor } from "@/lib/sanity/image";
import { formatLongDate, type BlogPost } from "@/lib/site-data";

type BlogDetailPageProps = {
  post: BlogPost;
};

export function BlogDetailPage({ post }: BlogDetailPageProps) {
  const firstBodyItem = post.body[0];
  const isPortableText =
    post.body.length > 0 &&
    typeof firstBodyItem === "object" &&
    firstBodyItem !== null &&
    "_type" in firstBodyItem;

  return (
    <div className="page-fade page-padded">
      <article className="section shell blog-detail">
        <p className="blog-meta-top">
          {post.cat} - {formatLongDate(post.date)}
        </p>
        <LiftedTitle text={post.title} as="h1" className="page-title" />
        <p className="blog-excerpt">{post.ex}</p>
        {post.coverImage ? (
          <div className="blog-cover">
            <Image src={post.coverImage} alt={post.title} fill sizes="(max-width: 960px) 100vw, 920px" />
          </div>
        ) : null}
        <div className="blog-body">
          {isPortableText ? (
            <PortableText
              value={post.body as TypedObject[]}
              components={{
                block: {
                  normal: ({ children }) => <p>{children}</p>
                },
                types: {
                  image: ({ value }) => {
                    const hasImageAsset =
                      typeof value?.asset?._ref === "string" || typeof value?.asset?._id === "string";

                    if (!hasImageAsset) {
                      return null;
                    }

                    const imageUrl = urlFor(value).width(1200).quality(76).url();
                    if (!imageUrl || imageUrl.startsWith("data:image")) {
                      return null;
                    }

                    const fullImageUrl = urlFor(value).width(2400).quality(84).url();
                    const altText =
                      typeof value?.alt === "string" && value.alt.trim().length > 0
                        ? value.alt
                        : post.title;
                    const caption =
                      typeof value?.caption === "string" && value.caption.trim().length > 0
                        ? value.caption
                        : "";
                    return (
                      <figure className="blog-inline-image">
                        <a
                          href={fullImageUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="blog-inline-image-link"
                          aria-label={`Open full image: ${altText}`}
                        >
                          <Image
                            src={imageUrl}
                            alt={altText}
                            width={1200}
                            height={750}
                            sizes="(max-width: 840px) calc(100vw - 32px), 760px"
                          />
                        </a>
                        {caption ? <figcaption>{caption}</figcaption> : null}
                      </figure>
                    );
                  }
                }
              }}
            />
          ) : (
            (post.body as string[]).map((paragraph, index) => <p key={`${paragraph}-${index}`}>{paragraph}</p>)
          )}
        </div>
      </article>
    </div>
  );
}
