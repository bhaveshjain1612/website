import { defineField, defineType } from "sanity";

export const experience = defineType({
  name: "experience",
  title: "Experience",
  type: "document",
  fields: [
    defineField({ name: "company", title: "Company", type: "string" }),
    defineField({ name: "role", title: "Role", type: "string" }),
    defineField({
      name: "startDate",
      title: "Start Date",
      type: "date",
      options: {
        dateFormat: "YYYY-MM-DD"
      }
    }),
    defineField({
      name: "endDate",
      title: "End Date",
      type: "date",
      options: {
        dateFormat: "YYYY-MM-DD"
      }
    }),
    defineField({
      name: "isCurrent",
      title: "Current Role",
      type: "boolean",
      initialValue: false
    }),
    defineField({
      name: "period",
      title: "Period (manual override)",
      type: "string",
      description:
        "Optional. Leave empty to auto-generate from Start Date/End Date."
    }),
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
