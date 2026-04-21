"use client";

import Script from "next/script";
import { type FormEvent, useMemo, useState } from "react";
import { useAccessibility } from "@/components/accessibility-provider";
import { useFontCombo } from "@/components/font-combo-provider";
import { useTheme } from "@/components/theme-provider";
import { trackEvent } from "@/lib/analytics";
import { type SiteSettings } from "@/lib/site-data";

type ContactPageProps = {
  settings: SiteSettings;
};

const turnstileSiteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

export function ContactPage({ settings }: ContactPageProps) {
  const [submitState, setSubmitState] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [statusMessage, setStatusMessage] = useState("");
  const hasEndpoint = Boolean(settings.contactFormEndpoint?.trim());
  const actionEndpoint = settings.contactFormEndpoint?.trim();
  const safeEmail = useMemo(() => settings.contactEmail?.trim() || "", [settings.contactEmail]);
  const { fontScale, reduceMotion, highContrast } = useAccessibility();
  const { combo } = useFontCombo();
  const { theme } = useTheme();
  const showAdminHint = process.env.NODE_ENV !== "production";

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (submitState === "submitting") {
      return;
    }

    const form = event.currentTarget;
    const data = new FormData(form);
    data.set("_subject", "New message from website");
    trackEvent("contact_submit_attempt");

    if (!hasEndpoint) {
      if (!safeEmail) {
        setSubmitState("error");
        setStatusMessage("Contact email is not configured yet.");
        return;
      }
      const name = String(data.get("name") || "").trim();
      const email = String(data.get("email") || "").trim();
      const message = String(data.get("message") || "").trim();
      const subject = encodeURIComponent(`Website inquiry from ${name || "visitor"}`);
      const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`);
      window.location.href = `mailto:${safeEmail}?subject=${subject}&body=${body}`;
      setSubmitState("success");
      setStatusMessage("Your email app has been opened with the drafted message.");
      trackEvent("contact_submit_mailto_fallback");
      return;
    }

    try {
      setSubmitState("submitting");
      setStatusMessage("Sending...");

      const response = await fetch(actionEndpoint as string, {
        method: "POST",
        body: data,
        headers: {
          Accept: "application/json"
        }
      });

      if (!response.ok) {
        throw new Error("Failed to submit form.");
      }

      form.reset();
      setSubmitState("success");
      setStatusMessage("Message sent. I will get back to you soon.");
      trackEvent("contact_submit_success");
    } catch {
      setSubmitState("error");
      setStatusMessage("Could not send right now. Please try again or email directly.");
      trackEvent("contact_submit_error");
    }
  };

  return (
    <div className="page-fade page-padded">
      <section className="section shell contact-page">
        <div className="section-kicker">Contact</div>
        <h1 className="page-title">Let&apos;s talk</h1>
        <p className="lead-contact">
          Use the form below for collaborations, projects, or speaking requests.
        </p>
        {settings.socialLinks?.length ? (
          <div className="contact-socials">
            <div className="section-kicker">Social</div>
            <div className="social-grid">
              {settings.socialLinks.map((item) => {
                const isExternal = /^https?:\/\//i.test(item.url);
                return (
                  <a
                    key={`${item.name}-${item.url}`}
                    href={item.url}
                    target={isExternal ? "_blank" : undefined}
                    rel={isExternal ? "noreferrer" : undefined}
                  >
                    <strong>{item.ico || item.name.slice(0, 2)}</strong>
                    <span>{item.name}</span>
                  </a>
                );
              })}
            </div>
          </div>
        ) : null}
        <p className="contact-settings-note">
          Active reading settings here: {theme} theme, text size {Math.round(fontScale * 100)}%,{" "}
          {combo.label}, {reduceMotion ? "reduce motion on" : "reduce motion off"},{" "}
          {highContrast ? "high contrast on" : "high contrast off"}.
        </p>
        <form className="contact-form" onSubmit={handleSubmit} noValidate>
          <input type="hidden" name="_subject" value="New message from website" />
          <input type="hidden" name="theme_preference" value={theme} />
          <input type="hidden" name="font_scale_preference" value={`${Math.round(fontScale * 100)}%`} />
          <input type="hidden" name="font_combo_preference" value={combo.label} />
          <input type="hidden" name="reduce_motion_preference" value={reduceMotion ? "on" : "off"} />
          <input type="hidden" name="high_contrast_preference" value={highContrast ? "on" : "off"} />
          <input type="text" name="name" placeholder="Your name" autoComplete="name" required />
          <input type="email" name="email" placeholder="Your email" autoComplete="email" required />
          <textarea name="message" placeholder="Your message" rows={8} required />
          {turnstileSiteKey && hasEndpoint ? (
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
              <p className="contact-captcha-note">
                Security check enabled: Cloudflare Turnstile helps prevent spam form submissions.
              </p>
            </>
          ) : null}
          <button type="submit" disabled={submitState === "submitting"}>
            {submitState === "submitting" ? "Sending..." : "Send message"}
          </button>
          {statusMessage ? (
            <p
              className={`contact-status ${submitState === "error" ? "error" : "success"}`}
              role="status"
              aria-live="polite"
            >
              {statusMessage}
            </p>
          ) : null}
        </form>
        {!hasEndpoint ? (
          <div className="contact-fallback">
            <p>
              Direct form delivery is being configured. You can still send a message using the button above,
              or email directly:
            </p>
            <a href={`mailto:${settings.contactEmail}`}>{settings.contactEmail}</a>
            {showAdminHint ? (
              <p className="contact-admin-note">
                Admin note: set <code>contactFormEndpoint</code> in Site Settings, or add{" "}
                <code>NEXT_PUBLIC_CONTACT_FORM_ENDPOINT</code> in your environment file.
              </p>
            ) : null}
          </div>
        ) : null}
      </section>
    </div>
  );
}
