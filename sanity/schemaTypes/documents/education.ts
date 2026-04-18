import { defineField, defineType } from "sanity";

export const education = defineType({
  name: "education",
  title: "Education",
  type: "document",
  fields: [
    defineField({ name: "school", title: "School", type: "string" }),
    defineField({ name: "degree", title: "Degree", type: "string" }),
    defineField({ name: "subtitle", title: "Subtitle", type: "string" }),
    defineField({ name: "period", title: "Period", type: "string" }),
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
