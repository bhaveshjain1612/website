import Image from "next/image";
import Link from "next/link";
import { formatMonthYear, type SiteContent } from "@/lib/site-data";

type GalleryPageProps = {
  content: SiteContent;
};

export function GalleryPage({ content }: GalleryPageProps) {
  return (
    <div className="page-fade page-padded">
      <section className="section shell">
        <div className="section-kicker">Photography</div>
        <h1 className="page-title">Galleries</h1>
        <div className="gallery-grid">
          {content.galleries.map((gallery) => (
            <Link
              key={gallery.slug}
              className={`gallery-grid-card ${gallery.cover ? "protected-media" : "no-image"}`}
              href={`/gallery/${gallery.slug}`}
            >
              {gallery.cover ? (
                <Image src={gallery.cover} alt={gallery.title} fill sizes="260px" draggable={false} />
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
      </section>
    </div>
  );
}
