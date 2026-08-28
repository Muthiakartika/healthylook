import { defineField, defineType } from "sanity";
import { sectionSettingsFields } from "./shared";

export const heroSection = defineType({
  name: "heroSection",
  title: "Hero",
  type: "object",
  fields: [
    defineField({
      name: "presentation",
      title: "Presentation",
      type: "string",
      options: {
        layout: "radio",
        list: [
          { title: "Homepage cinematic hero", value: "home" },
          { title: "Inner-page split hero", value: "inner" },
        ],
      },
      initialValue: "inner",
      validation: (Rule) => Rule.required(),
    }),
    defineField({ name: "eyebrow", title: "Eyebrow", type: "string" }),
    defineField({
      name: "title",
      title: "Heading",
      type: "string",
      validation: (Rule) => Rule.required().max(120),
    }),
    defineField({ name: "description", title: "Description", type: "text", rows: 4 }),
    defineField({
      name: "image",
      title: "Image",
      type: "imageWithAlt",
      validation: (Rule) => Rule.required(),
    }),
    defineField({ name: "primaryAction", title: "Primary action", type: "link" }),
    defineField({ name: "secondaryAction", title: "Secondary action", type: "link" }),
    ...sectionSettingsFields,
  ],
  preview: {
    select: { title: "title", subtitle: "presentation", media: "image" },
    prepare: ({ title, subtitle, media }) => ({
      title: title || "Untitled hero",
      subtitle: subtitle === "home" ? "Homepage hero" : "Inner-page hero",
      media,
    }),
  },
});
