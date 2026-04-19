import { defineField, defineType } from "sanity";

export const education = defineType({
  name: "education",
  title: "Education",
  type: "document",
  fields: [
    defineField({ name: "school", title: "School", type: "string" }),
    defineField({ name: "degree", title: "Degree", type: "string" }),
    defineField({ name: "subtitle", title: "Subtitle", type: "string" }),
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
      name: "period",
      title: "Period (manual override)",
      type: "string",
      description:
        "Optional. Leave empty to auto-generate from Start Date/End Date."
    }),
    defineField({ name: "gpa", title: "GPA", type: "string" }),
    defineField({
      name: "courses",
      title: "Courses",
      type: "array",
      of: [{ type: "string" }]
    }),
    defineField({ name: "order", title: "Order", type: "number" })
  ]
});
