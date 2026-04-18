import Script from "next/script";
import { type SiteSettings } from "@/lib/site-data";

type ContactPageProps = {
  settings: SiteSettings;
};

const turnstileSiteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

export function ContactPage({ settings }: ContactPageProps) {
  const hasEndpoint = Boolean(settings.contactFormEndpoint);

  return (
    <div className="page-fade page-padded">
      <section className="section shell contact-page">
        <div className="section-kicker">Contact</div>
        <h1 className="page-title">Let&apos;s talk</h1>
        <p className="lead-contact">
          Use the form below for collaborations, projects, or speaking requests.
        </p>
        {hasEndpoint ? (
          <form className="contact-form" action={settings.contactFormEndpoint} method="post">
            <input type="hidden" name="_subject" value="New message from website" />
            <input type="text" name="name" placeholder="Your name" required />
            <input type="email" name="email" placeholder="Your email" required />
            <textarea name="message" placeholder="Your message" rows={8} required />
            {turnstileSiteKey ? (
              <>
                <div
                  className="cf-turnstile"
                  data-sitekey={turnstileSiteKey}
                  data-theme="auto"
                  data-size="flexible"
                />
                <Script
                  src="https://challenges.cloudflare.com/turnstile/v0/api.js"
                  strategy="afterInteractive"
                />
              </>
            ) : null}
            <button type="submit">Send message</button>
          </form>
        ) : (
          <div className="contact-fallback">
            <p>
              Add <code>contactFormEndpoint</code> in Site Settings to enable form submissions.
            </p>
            <a href={`mailto:${settings.contactEmail}`}>{settings.contactEmail}</a>
          </div>
        )}
      </section>
    </div>
  );
}
