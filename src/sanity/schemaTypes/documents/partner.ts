import { defineField, defineType } from "sanity";

/**
 * A product or device brand shown in the partner strip.
 *
 * A document type rather than an array on siteSettings because each one
 * carries an uploaded logo: Sanity's asset picker, reuse across documents,
 * and "which brands do we list?" as a browsable list are all things editors
 * get for free from a document type and would lose inside a settings array.
 */
export const partner = defineType({
  name: "partner",
  title: "Partner brand",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Brand name",
      type: "string",
      validation: (Rule) => Rule.required().max(80),
    }),
    defineField({
      name: "logo",
      title: "Logo",
      type: "image",
      options: { hotspot: false },
      description: "Transparent PNG or WebP. The strip renders it at a uniform height.",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "order",
      title: "Order",
      type: "number",
      description: "Lower numbers first.",
      validation: (Rule) => Rule.integer().min(0),
    }),
  ],
  orderings: [
    { title: "Order", name: "orderAsc", by: [{ field: "order", direction: "asc" }] },
  ],
  preview: { select: { title: "name", media: "logo" } },
});
