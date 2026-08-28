import { defineField, defineType } from "sanity";

export const category = defineType({
  name: "category",
  title: "Blog category",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (Rule) => Rule.required().max(60),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title", maxLength: 60 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({ name: "description", title: "Description", type: "text", rows: 3 }),
  ],
  preview: { select: { title: "title", subtitle: "description" } },
});
