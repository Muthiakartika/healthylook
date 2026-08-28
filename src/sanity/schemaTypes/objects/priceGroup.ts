import { defineArrayMember, defineField, defineType } from "sanity";

export const priceGroup = defineType({
  name: "priceGroup",
  title: "Price group",
  type: "object",
  fields: [
    defineField({ name: "title", title: "Group heading", type: "string" }),
    defineField({
      name: "rows",
      title: "Prices",
      type: "array",
      of: [defineArrayMember({ type: "priceRow" })],
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({ name: "note", title: "Note", type: "text", rows: 3 }),
  ],
  preview: {
    select: { title: "title", rows: "rows" },
    prepare: ({ title, rows }) => ({
      title: title || "Price group",
      subtitle: `${Array.isArray(rows) ? rows.length : 0} rows`,
    }),
  },
});
