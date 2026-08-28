import { defineField, defineType } from "sanity";

export const priceRow = defineType({
  name: "priceRow",
  title: "Price",
  type: "object",
  fields: [
    defineField({
      name: "label",
      title: "Treatment or option",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "price",
      title: "Price in IDR",
      type: "number",
      description: "Leave empty for by consultation.",
      validation: (Rule) => Rule.integer().positive(),
    }),
    defineField({ name: "unit", title: "Unit", type: "string", description: "For example /unit or /ml." }),
  ],
  preview: {
    select: { title: "label", price: "price", unit: "unit" },
    prepare: ({ title, price, unit }) => ({
      title,
      subtitle: typeof price === "number" ? `IDR ${price.toLocaleString("id-ID")}${unit || ""}` : "By consultation",
    }),
  },
});
