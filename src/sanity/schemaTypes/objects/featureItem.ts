import { defineField, defineType } from "sanity";

export const featureItem = defineType({
  name: "featureItem",
  title: "Feature",
  type: "object",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (Rule) => Rule.required().max(100),
    }),
    defineField({ name: "text", title: "Text", type: "text", rows: 3 }),
    defineField({ name: "image", title: "Image", type: "imageWithAlt" }),
    defineField({ name: "action", title: "Optional link", type: "link" }),
  ],
  preview: {
    select: { title: "title", subtitle: "text", media: "image" },
  },
});
