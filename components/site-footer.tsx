import Link from "next/link";

type SiteFooterProps = {
  contactEmail: string;
  newsletterEndpoint: string;
};

export function SiteFooter({ contactEmail, newsletterEndpoint }: SiteFooterProps) {
  return (
    <footer className="footer">
      <div className="footer-newsletter">
        <p>Subscriber updates</p>
        {newsletterEndpoint ? (
          <form action={newsletterEndpoint} method="post" target="_blank">
            <input type="email" name="email" required placeholder="you@example.com" />
            <button type="submit">Subscribe</button>
          </form>
        ) : (
          <small>
            Add <code>newsletterEndpoint</code> in Site Settings to enable subscribe form.
          </small>
        )}
      </div>
      <div className="footer-links">
        <Link href="/">Home</Link>
        <Link href="/building">Building</Link>
        <Link href="/living">Living</Link>
        <Link href="/gallery">Gallery</Link>
        <Link href="/contact">Contact</Link>
      </div>
      <p>
        (c) 2026 Bhavesh Jain{" "}
        {contactEmail ? (
          <>
            {" - "} <a href={`mailto:${contactEmail}`}>{contactEmail}</a>
          </>
        ) : null}
      </p>
    </footer>
  );
}
