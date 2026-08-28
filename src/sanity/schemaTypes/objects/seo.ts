import { defineField, defineType } from "sanity";

export const seo = defineType({
  name: "seo",
  title: "Search and social",
  type: "object",
  options: { collapsible: true, collapsed: true },
  fields: [
    defineField({
      name: "title",
      title: "SEO title",
      type: "string",
      description: "Usually 45–60 characters. The site name is appended automatically.",
      validation: (Rule) => Rule.max(70).warning("Long titles may be truncated in search."),
    }),
    defineField({
      name: "description",
      title: "Meta description",
      type: "text",
      rows: 3,
      validation: (Rule) =>
        Rule.max(170).warning("Long descriptions may be truncated in search."),
    }),
    defineField({
      name: "image",
      title: "Social sharing image",
      type: "imageWithAlt",
    }),
    defineField({
      name: "noIndex",
      title: "Hide from search engines",
      type: "boolean",
      initialValue: false,
      description: "Use only for temporary or intentionally private public pages.",
    }),
  ],
});
