import Image from "next/image";
import Link from "next/link";
import { LiftedTitle } from "@/components/lifted-title";
import { formatMonthYear, type SiteContent } from "@/lib/site-data";

type LivingPageProps = {
  content: SiteContent;
};

export function LivingPage({ content }: LivingPageProps) {
  const posts = content.blogs.filter((blog) => blog.cat === "travel" || blog.cat === "thoughts");

  return (
    <div className="page-fade page-padded">
      <section className="section shell">
        <div className="section-kicker">Living</div>
        <h1 className="page-title">Beyond the screen</h1>
        <div className="lead-copy">
          <p>
            When I am not building quant models, I am chasing light across India's ghats,
            mountains, and street corners.
          </p>
        </div>

        <div className="subsection">
          <div className="section-kicker">Galleries</div>
          <div className="gallery-scroll">
            {content.galleries.map((gallery) => (
              <Link
                key={gallery.slug}
                href={`/gallery/${gallery.slug}`}
                className={`gallery-card ${gallery.cover ? "protected-media" : "no-image"}`}
              >
                {gallery.cover ? (
                  <Image src={gallery.cover} alt={gallery.title} fill sizes="220px" draggable={false} />
                ) : null}
                <div>
                  <strong>{gallery.title}</strong>
                  <span>
                    {gallery.location} - {formatMonthYear(gallery.date)}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div className="subsection">
          <div className="section-kicker">Blogs</div>
          {posts.map((blog) => (
            <Link key={blog.slug} href={`/blog/${blog.slug}`} className="blog-row">
              <small>{blog.cat}</small>
              <LiftedTitle text={blog.title} as="h3" />
              <p>{blog.ex}</p>
              <span>{formatMonthYear(blog.date)}</span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
