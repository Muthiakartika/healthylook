import { defineField, defineType } from "sanity";

export const post = defineType({
  name: "post",
  title: "Blog post",
  type: "document",
  groups: [
    { name: "content", title: "Content", default: true },
    { name: "details", title: "Publishing" },
    { name: "seo", title: "SEO" },
  ],
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      group: "content",
      validation: (Rule) => Rule.required().max(120),
    }),
    defineField({
      name: "slug",
      title: "URL slug",
      type: "slug",
      group: "details",
      options: { source: "title", maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "excerpt",
      title: "Excerpt",
      type: "text",
      rows: 3,
      group: "content",
      validation: (Rule) => Rule.max(240),
    }),
    defineField({
      name: "coverImage",
      title: "Featured image",
      type: "imageWithAlt",
      group: "content",
    }),
    defineField({
      name: "body",
      title: "Article body",
      type: "portableText",
      group: "content",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "categories",
      title: "Categories",
      type: "array",
      group: "details",
      of: [{ type: "reference", to: [{ type: "category" }] }],
      validation: (Rule) => Rule.unique(),
    }),
    defineField({
      name: "publishedAt",
      title: "Published at",
      type: "datetime",
      group: "details",
      initialValue: () => new Date().toISOString(),
      validation: (Rule) => Rule.required(),
    }),
    defineField({ name: "seo", title: "Search and social", type: "seo", group: "seo" }),
  ],
  preview: {
    select: { title: "title", subtitle: "publishedAt", media: "coverImage" },
    prepare: ({ title, subtitle, media }) => ({
      title,
      subtitle: subtitle ? new Date(subtitle).toLocaleDateString("en-GB") : "Not dated",
      media,
    }),
  },
  orderings: [
    {
      title: "Publication date, newest",
      name: "publishedAtDesc",
      by: [{ field: "publishedAt", direction: "desc" }],
    },
  ],
});
