import { defineField, defineType } from "sanity";

export const siteSettings = defineType({
  name: "siteSettings",
  title: "Site Settings",
  type: "document",
  fields: [
    defineField({ name: "siteName", title: "Site Name", type: "string" }),
    defineField({ name: "tagline", title: "Tagline", type: "string" }),
    defineField({ name: "bio", title: "Bio", type: "text", rows: 4 }),
    defineField({
      name: "heroImages",
      title: "Hero Images",
      type: "array",
      of: [{ type: "image" }]
    }),
    defineField({
      name: "quotes",
      title: "Quotes",
      type: "array",
      of: [{ type: "string" }]
    }),
    defineField({
      name: "socialLinks",
      title: "Social Links",
      type: "array",
      of: [
        defineField({
          name: "socialLink",
          title: "Social Link",
          type: "object",
          fields: [
            defineField({ name: "platform", type: "string", title: "Platform" }),
            defineField({ name: "url", type: "url", title: "URL" }),
            defineField({ name: "icon", type: "string", title: "Icon Label" })
          ]
        })
      ]
    }),
    defineField({ name: "contactEmail", title: "Contact Email", type: "string" }),
    defineField({
      name: "contactFormEndpoint",
      title: "Contact Form Endpoint",
      type: "string",
      description: "Use Formspree or other endpoint URL"
    }),
    defineField({
      name: "newsletterEndpoint",
      title: "Newsletter Endpoint",
      type: "string",
      description: "Use Beehiiv, MailerLite, Buttondown, etc"
    }),
    defineField({
      name: "textureOverlayLight",
      title: "Light Mode Texture Overlay",
      type: "image",
      options: { hotspot: true }
    }),
    defineField({
      name: "textureOverlayDark",
      title: "Dark Mode Texture Overlay",
      type: "image",
      options: { hotspot: true }
    }),
    defineField({ name: "darkModeDefault", title: "Dark Mode Default", type: "boolean" }),
    defineField({
      name: "headingFont",
      title: "Heading Font",
      type: "string",
      options: {
        list: ["Lora", "Playfair Display", "Old Standard TT", "Cormorant Garamond"]
      }
    }),
    defineField({
      name: "bodyFont",
      title: "Body Font",
      type: "string",
      options: {
        list: ["Crimson Pro", "Spectral", "Libre Baskerville", "Source Serif 4"]
      }
    }),
    defineField({ name: "colorPrimary", title: "Primary Color", type: "string" }),
    defineField({ name: "colorAccent", title: "Accent Color", type: "string" }),
    defineField({ name: "colorBackground", title: "Dark Background", type: "string" }),
    defineField({ name: "colorBackgroundLight", title: "Light Background", type: "string" })
  ]
});
