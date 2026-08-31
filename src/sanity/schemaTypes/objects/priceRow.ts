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
    defineField({
      name: "description",
      title: "What the package includes",
      type: "text",
      rows: 2,
      description:
        'The step-by-step rundown printed under a package on the live price list — "Deep Cleansing – Steam & Extraction – … – Moisturizer & Sunscreen". Leave empty for an ordinary row.',
    }),
  ],
  preview: {
    select: { title: "label", price: "price", unit: "unit" },
    prepare: ({ title, price, unit }) => ({
      title,
      subtitle: typeof price === "number" ? `IDR ${price.toLocaleString("id-ID")}${unit || ""}` : "By consultation",
    }),
  },
});
