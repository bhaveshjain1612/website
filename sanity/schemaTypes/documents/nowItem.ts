import { defineField, defineType } from "sanity";

export const nowItem = defineType({
  name: "nowItem",
  title: "Now Item",
  type: "document",
  fields: [
    defineField({ name: "label", title: "Label", type: "string" }),
    defineField({ name: "value", title: "Value", type: "string" }),
    defineField({ name: "order", title: "Order", type: "number" })
  ]
});
