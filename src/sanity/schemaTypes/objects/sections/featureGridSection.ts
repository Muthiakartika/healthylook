import { defineArrayMember, defineField, defineType } from "sanity";
import { sectionSettingsFields, toneField } from "./shared";

export const featureGridSection = defineType({
  name: "featureGridSection",
  title: "Feature cards",
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
      name: "items",
      title: "Cards",
      type: "array",
      of: [defineArrayMember({ type: "featureItem" })],
      validation: (Rule) => Rule.required().min(2).max(12),
    }),
    defineField({
      name: "columns",
      title: "Desktop columns",
      type: "number",
      options: { layout: "radio", list: [2, 3, 4] },
      initialValue: 3,
    }),
    toneField,
    ...sectionSettingsFields,
  ],
  preview: {
    select: { title: "title", items: "items" },
    prepare: ({ title, items }) => ({
      title: title || "Feature cards",
      subtitle: `${Array.isArray(items) ? items.length : 0} cards`,
    }),
  },
});
