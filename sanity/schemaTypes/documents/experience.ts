import { defineField, defineType } from "sanity";

export const experience = defineType({
  name: "experience",
  title: "Experience",
  type: "document",
  fields: [
    defineField({ name: "company", title: "Company", type: "string" }),
    defineField({ name: "role", title: "Role", type: "string" }),
    defineField({ name: "period", title: "Period", type: "string" }),
    defineField({ name: "location", title: "Location", type: "string" }),
    defineField({
      name: "highlights",
      title: "Highlights",
      type: "array",
      of: [{ type: "string" }]
    }),
    defineField({ name: "priority", title: "Priority", type: "boolean" }),
    defineField({ name: "order", title: "Order", type: "number" })
  ]
});
