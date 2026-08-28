import { defineArrayMember, defineField, defineType } from "sanity";
import { sectionSettingsFields, toneField } from "./shared";

export const gallerySection = defineType({
  name: "gallerySection",
  title: "Image gallery",
  type: "object",
  fields: [
    defineField({ name: "eyebrow", title: "Eyebrow", type: "string" }),
    defineField({
      name: "title",
      title: "Heading",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({ name: "description", title: "Description", type: "text", rows: 3 }),
    defineField({
      name: "images",
      title: "Images",
      type: "array",
      of: [defineArrayMember({ type: "imageWithAlt" })],
      validation: (Rule) => Rule.required().min(2).max(12),
      options: { layout: "grid" },
    }),
    toneField,
    ...sectionSettingsFields,
  ],
  preview: {
    select: { title: "title", images: "images", media: "images.0" },
    prepare: ({ title, images, media }) => ({
      title: title || "Gallery",
      subtitle: `${Array.isArray(images) ? images.length : 0} images`,
      media,
    }),
  },
});
