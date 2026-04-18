"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { formatMonthYear, type GalleryItem, type RecentItem, type SiteContent } from "@/lib/site-data";

type HomePageProps = {
  content: SiteContent;
};

function HeroSection({
  heroImages,
  quotes,
  siteName,
  tagline
}: {
  heroImages: string[];
  quotes: string[];
  siteName: string;
  tagline: string;
}) {
  const [imageIndex, setImageIndex] = useState(0);
  const [showQuote, setShowQuote] = useState(false);
  const [quoteIndex, setQuoteIndex] = useState(0);

  const safeImages = heroImages
    .filter((src): src is string => typeof src === "string" && src.trim().length > 0)
    .map((src) => src.trim());
  const currentImage = safeImages[imageIndex] ?? safeImages[0];
  const safeQuotes = quotes.length > 0 ? quotes : ["Explore. Experiment. Experience."];

  useEffect(() => {
    if (safeImages.length < 2) {
      return undefined;
    }
    const intervalId = window.setInterval(() => {
      setImageIndex((current) => (current + 1) % safeImages.length);
    }, 5500);

    return () => window.clearInterval(intervalId);
  }, [safeImages.length]);

  const handleToggle = () => {
    if (!showQuote) {
      setQuoteIndex((current) => (current + 1) % safeQuotes.length);
    }
    setShowQuote((current) => !current);
  };

  return (
    <section className="hero" onClick={handleToggle}>
      <div className="hero-bg">
        {currentImage ? (
          <Image
            key={`${currentImage}-${imageIndex}`}
            src={currentImage}
            alt=""
            fill
            sizes="100vw"
            priority={imageIndex === 0}
            className="show"
          />
        ) : null}
      </div>
      <div className="hero-overlay" />
      <div className="hero-content">
        <div className={`hero-main ${showQuote ? "hidden" : ""}`}>
          <div className="hero-frame">
            <div className="corner a" />
            <div className="corner b" />
            <div className="corner c" />
            <div className="corner d" />
            <h1 className="hero-script">{siteName}</h1>
            <div className="hero-rule" />
            <p className="hero-tagline">{tagline}</p>
            <p className="hero-meta">Storyteller</p>
          </div>
        </div>
        <div className={`hero-quote ${showQuote ? "show" : ""}`}>
          <div className="quote-box">
            <p>"{safeQuotes[quoteIndex]}"</p>
            <span>- {siteName.split(" ")[0]}</span>
          </div>
        </div>
      </div>
      <button
        className="hero-scroll"
        onClick={(event) => {
          event.stopPropagation();
          window.scrollTo({ top: window.innerHeight, behavior: "smooth" });
        }}
        type="button"
      >
        scroll
      </button>
    </section>
  );
}

function AboutSection({
  content
}: {
  content: Pick<SiteContent, "settings" | "nowItems">;
}) {
  return (
    <section className="about-section">
      <div className="about-card">
        <div className="about-mark">BJ</div>
        <div>
          <h2>{content.settings.siteName}</h2>
          <div className="about-subtitle">{content.settings.tagline}</div>
          <p>{content.settings.bio}</p>
          <div className="tags">
            {["Photographer", "Trader", "Traveller", "F1 Fan", "Chai-powered"].map((tag) => (
              <span key={tag}>{tag}</span>
            ))}
          </div>
        </div>
      </div>
      <div className="now-grid-wrap">
        <div className="section-kicker">Right now</div>
        <div className="now-grid">
          {content.nowItems.map((item) => (
            <div key={item.l} className="now-card">
              <small>{item.l}</small>
              <p>{item.v}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function LatestSection({ items }: { items: RecentItem[] }) {
  const columns = useMemo(() => {
    const grouped: RecentItem[][] = [];
    for (let index = 0; index < items.length; index += 2) {
      grouped.push(items.slice(index, index + 2));
    }
    return grouped;
  }, [items]);

  return (
    <section className="section shell">
      <div className="section-kicker">Latest</div>
      <h2>What I have been up to</h2>
      <div className="brick-scroll">
        {columns.map((column, index) => (
          <div className="brick-col" key={`column-${index}`}>
            {column.map((item) => (
              <Link
                href={item.path}
                className="brick-card"
                key={`${item.title}-${item.path}`}
                style={{ height: item.tall ? 212 : 148 }}
              >
                {item.img ? <Image src={item.img} alt={item.title} fill sizes="200px" /> : null}
                <div className="brick-content">
                  <small>{item.type}</small>
                  <strong>{item.title}</strong>
                  <span>{formatMonthYear(item.date)}</span>
                </div>
              </Link>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}

function SplitSection() {
  return (
    <section className="section shell split-grid">
      <Link href="/building" className="split-card no-image">
        <div className="split-overlay" />
        <div className="split-content">
          <h3>Building</h3>
          <p>Quant systems, career, projects</p>
          <span>explore -&gt;</span>
        </div>
      </Link>
      <Link href="/living" className="split-card no-image">
        <div className="split-overlay" />
        <div className="split-content">
          <h3>Living</h3>
          <p>Travel, photography, thoughts</p>
          <span>explore -&gt;</span>
        </div>
      </Link>
    </section>
  );
}

function SocialSection({ socials }: { socials: SiteContent["settings"]["socialLinks"] }) {
  return (
    <section className="section shell">
      <div className="section-kicker">Connect</div>
      <h2>Find me</h2>
      <div className="social-grid">
        {socials.map((social) => (
          <a key={`${social.name}-${social.url}`} href={social.url} target="_blank" rel="noopener noreferrer">
            <strong>{social.ico}</strong>
            <span>{social.name}</span>
          </a>
        ))}
      </div>
    </section>
  );
}

function MiniGalleryStrip({ galleries }: { galleries: GalleryItem[] }) {
  return (
    <section className="section shell top-tight">
      <div className="section-kicker">Photography Picks</div>
      <div className="gallery-strip">
        {galleries.slice(0, 4).map((gallery) => (
          <Link
            key={gallery.slug}
            href={`/gallery/${gallery.slug}`}
            className="gallery-strip-item protected-media"
          >
            {gallery.cover ? (
              <Image src={gallery.cover} alt={gallery.title} fill sizes="220px" draggable={false} />
            ) : null}
            <div>
              <strong>{gallery.title}</strong>
              <span>{gallery.location}</span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

export function HomePage({ content }: HomePageProps) {
  return (
    <div className="page-fade">
      <HeroSection
        heroImages={content.settings.heroImages}
        quotes={content.settings.quotes}
        siteName={content.settings.siteName}
        tagline={content.settings.tagline}
      />
      <AboutSection content={content} />
      <LatestSection items={content.recent} />
      <SplitSection />
      <MiniGalleryStrip galleries={content.galleries} />
      <SocialSection socials={content.settings.socialLinks} />
    </div>
  );
}
