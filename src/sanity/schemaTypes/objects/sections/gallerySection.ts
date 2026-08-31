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
      // The cap was 12, which the clinic's own galleries already broke on the
      // first migration — Lip Filler alone publishes 49 before/after photos.
      // A limit the real content cannot meet just paints a red validation
      // error across every gallery in the Studio and teaches editors to
      // ignore validation. 60 leaves headroom over the largest real group.
      validation: (Rule) => Rule.required().min(2).max(60),
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
