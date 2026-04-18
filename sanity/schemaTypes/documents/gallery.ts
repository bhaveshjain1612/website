import { defineField, defineType } from "sanity";

export const gallery = defineType({
  name: "gallery",
  title: "Gallery",
  type: "document",
  fields: [
    defineField({ name: "title", title: "Title", type: "string" }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: (rule) => rule.required()
    }),
    defineField({ name: "location", title: "Location", type: "string" }),
    defineField({ name: "date", title: "Date", type: "date" }),
    defineField({ name: "description", title: "Description", type: "text" }),
    defineField({
      name: "lightroomShareUrl",
      title: "Lightroom Share URL",
      type: "url",
      description:
        "Optional. Paste the full Lightroom share URL (lightroom.adobe.com/shares/...) for slideshow embed + external album button."
    }),
    defineField({
      name: "coverImage",
      title: "Cover Image",
      type: "image",
      options: { hotspot: true }
    }),
    defineField({
      name: "images",
      title: "Gallery Images",
      type: "array",
      of: [
        {
          name: "galleryImage",
          type: "image",
          options: { hotspot: true },
          fields: [defineField({ name: "caption", title: "Caption", type: "string" })]
        }
      ]
    }),
    defineField({
      name: "tags",
      title: "Tags",
      type: "array",
      of: [{ type: "string" }]
    })
  ]
});
