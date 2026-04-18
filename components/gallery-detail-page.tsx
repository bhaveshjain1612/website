"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { formatLongDate, type GalleryItem } from "@/lib/site-data";

type GalleryDetailPageProps = {
  gallery: GalleryItem;
};

type LightroomLinks = {
  shareUrl: string;
  embedUrl: string | null;
};

function extractLightroomShareId(url: string): string | null {
  try {
    const parsed = new URL(url);
    if (!parsed.hostname.toLowerCase().includes("lightroom.adobe.com")) {
      return null;
    }
    const parts = parsed.pathname.split("/").filter(Boolean);
    const sharesIndex = parts.indexOf("shares");
    return sharesIndex >= 0 && parts[sharesIndex + 1] ? parts[sharesIndex + 1] : null;
  } catch {
    return null;
  }
}

function buildLightroomLinks(source?: string): LightroomLinks | null {
  if (!source) {
    return null;
  }

  const trimmed = source.trim();
  if (!trimmed) {
    return null;
  }

  const shareId = extractLightroomShareId(trimmed);
  if (!shareId) {
    return {
      shareUrl: trimmed,
      embedUrl: null
    };
  }

  return {
    shareUrl: `https://lightroom.adobe.com/shares/${shareId}`,
    embedUrl:
      `https://lightroom.adobe.com/embed/shares/${shareId}/slideshow` +
      "?background_color=%232D2D2D&color=%23999999"
  };
}

export function GalleryDetailPage({ gallery }: GalleryDetailPageProps) {
  const photos = useMemo(
    () =>
      gallery.photos
        .map((photo) => photo.url)
        .filter((url): url is string => typeof url === "string" && url.trim().length > 0)
        .map((url) => url.trim()),
    [gallery.photos]
  );
  const lightroom = useMemo(
    () => buildLightroomLinks(gallery.lightroomShareUrl),
    [gallery.lightroomShareUrl]
  );
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  useEffect(() => {
    if (openIndex === null) {
      return undefined;
    }

    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpenIndex(null);
      }
      if (event.key === "ArrowRight") {
        setOpenIndex((current) => (current === null ? null : (current + 1) % photos.length));
      }
      if (event.key === "ArrowLeft") {
        setOpenIndex((current) =>
          current === null ? null : (current - 1 + photos.length) % photos.length
        );
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKey);
    };
  }, [openIndex, photos.length]);

  return (
    <div className="page-fade page-padded">
      <section className="section shell">
        <Link href="/gallery" className="inline-btn-link">
          Back to galleries
        </Link>
        <h1 className="page-title">{gallery.title}</h1>
        <p className="gallery-meta">
          {gallery.location} - {formatLongDate(gallery.date)}
        </p>
        <p className="gallery-copy">{gallery.desc}</p>
        {lightroom ? (
          <div className="gallery-lightroom">
            <div className="gallery-lightroom-actions">
              <a href={lightroom.shareUrl} target="_blank" rel="noreferrer" className="inline-btn-link">
                Open Full Lightroom Album
              </a>
            </div>
            {lightroom.embedUrl ? (
              <div className="gallery-lightroom-embed">
                <iframe
                  title={`${gallery.title} Lightroom slideshow`}
                  src={lightroom.embedUrl}
                  frameBorder="0"
                  loading="lazy"
                  allowFullScreen
                />
              </div>
            ) : (
              <p className="gallery-meta">
                Lightroom embed preview unavailable for this link format. The external album button still works.
              </p>
            )}
          </div>
        ) : (
          <p className="gallery-meta">
            Add a Lightroom Share URL in this gallery document to enable slideshow embed + full album button.
          </p>
        )}
        {photos.length > 0 ? (
          <div className="detail-grid" onContextMenu={(event) => event.preventDefault()}>
            {photos.map((src, index) => (
              <button
                key={`${src}-${index}`}
                type="button"
                className="detail-item-btn protected-media"
                onClick={() => setOpenIndex(index)}
              >
                <figure className="detail-item">
                  <Image
                    src={src}
                    alt={gallery.title}
                    fill
                    sizes="(max-width: 900px) 50vw, 25vw"
                    draggable={false}
                  />
                </figure>
              </button>
            ))}
          </div>
        ) : (
          <p className="gallery-meta">No gallery images added yet.</p>
        )}
      </section>
      {openIndex !== null ? (
        <div className="lightbox-backdrop" onClick={() => setOpenIndex(null)}>
          <button
            type="button"
            className="lightbox-close"
            onClick={() => setOpenIndex(null)}
            aria-label="Close image"
          >
            X
          </button>
          <button
            type="button"
            className="lightbox-nav left"
            onClick={(event) => {
              event.stopPropagation();
              setOpenIndex((current) =>
                current === null ? null : (current - 1 + photos.length) % photos.length
              );
            }}
            aria-label="Previous image"
          >
            {"<"}
          </button>
          <button
            type="button"
            className="lightbox-nav right"
            onClick={(event) => {
              event.stopPropagation();
              setOpenIndex((current) => (current === null ? null : (current + 1) % photos.length));
            }}
            aria-label="Next image"
          >
            {">"}
          </button>
          <div
            className="lightbox-stage protected-media"
            onClick={(event) => event.stopPropagation()}
            onContextMenu={(event) => event.preventDefault()}
          >
            <Image
              src={photos[openIndex]}
              alt={`${gallery.title} ${openIndex + 1}`}
              fill
              sizes="100vw"
              className="lightbox-image"
              priority
              draggable={false}
            />
          </div>
        </div>
      ) : null}
    </div>
  );
}
