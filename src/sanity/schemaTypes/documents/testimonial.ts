import { defineField, defineType } from "sanity";

export const testimonial = defineType({
  name: "testimonial",
  title: "Testimonial",
  type: "document",
  fields: [
    defineField({ name: "name", title: "Reviewer name", type: "string", validation: (Rule) => Rule.required() }),
    defineField({ name: "quote", title: "Review", type: "text", rows: 7, validation: (Rule) => Rule.required().min(20) }),
    defineField({ name: "source", title: "Source", type: "string", options: { list: ["Google", "Fresha", "Other"] }, validation: (Rule) => Rule.required() }),
    defineField({ name: "featured", title: "Feature on homepage", type: "boolean", initialValue: false }),
    defineField({ name: "treatments", title: "Related treatments", type: "array", of: [{ type: "reference", to: [{ type: "treatment" }] }], validation: (Rule) => Rule.unique() }),
    defineField({ name: "order", title: "Display order", type: "number", initialValue: 0, validation: (Rule) => Rule.required().integer().min(0) }),
  ],
  preview: {
    select: { title: "name", subtitle: "quote" },
    prepare: ({ title, subtitle }) => ({ title, subtitle: subtitle ? `${subtitle.slice(0, 100)}…` : undefined }),
  },
  orderings: [{ title: "Display order", name: "orderAsc", by: [{ field: "order", direction: "asc" }] }],
});
