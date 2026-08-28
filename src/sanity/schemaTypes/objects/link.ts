import { defineField, defineType } from "sanity";

export const link = defineType({
  name: "link",
  title: "Link",
  type: "object",
  fields: [
    defineField({
      name: "label",
      title: "Label",
      type: "string",
      validation: (Rule) => Rule.required().max(50),
    }),
    defineField({
      name: "href",
      title: "Destination",
      type: "string",
      description: "Use /book-now for an internal page or https://… for an external website.",
      validation: (Rule) =>
        Rule.required().custom((value) => {
          if (!value) return true;
          if (value.startsWith("/") || /^https?:\/\//.test(value)) return true;
          return "Use a site path beginning with / or a complete http(s) URL.";
        }),
    }),
    defineField({
      name: "external",
      title: "Open in a new tab",
      type: "boolean",
      initialValue: false,
    }),
  ],
  preview: {
    select: { title: "label", subtitle: "href" },
  },
});
