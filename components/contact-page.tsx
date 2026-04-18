"use client";

import Script from "next/script";
import { type FormEvent, useMemo, useState } from "react";
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

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (submitState === "submitting") {
      return;
    }

    const form = event.currentTarget;
    const data = new FormData(form);
    data.set("_subject", "New message from website");

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
    } catch {
      setSubmitState("error");
      setStatusMessage("Could not send right now. Please try again or email directly.");
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
        <form className="contact-form" onSubmit={handleSubmit} noValidate>
          <input type="hidden" name="_subject" value="New message from website" />
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
              Set <code>contactFormEndpoint</code> in Site Settings to send directly from this form.
            </p>
            <a href={`mailto:${settings.contactEmail}`}>{settings.contactEmail}</a>
          </div>
        ) : null}
      </section>
    </div>
  );
}
