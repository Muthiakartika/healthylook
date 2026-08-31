import { defineArrayMember, defineField, defineType } from "sanity";

// Kept literal, like treatment.ts's own copy: importing data/treatments.ts
// here would pull the whole 1,600-line catalogue into the Studio bundle for
// the sake of four labels.
const categoryOptions = [
  { title: "Facial Enhancement", value: "facial-enhancement" },
  { title: "Skin Treatments", value: "skin-treatments" },
  { title: "Body Treatments", value: "body-treatments" },
  { title: "Hair & Booster", value: "hair-booster" },
];

/**
 * A price table on /pricing that has no treatment page behind it — Eye
 * Treatment, Personalized Mesotherapy, Intimate Care.
 *
 * A document of its own rather than a treatment with the other fields left
 * blank: these three genuinely have no page, no hero, no FAQ and no
 * long-form copy, and modelling them as treatments would put three
 * permanently half-filled entries in the Treatments list and three dead
 * URLs in the catalogue.
 *
 * `category` is what puts each one under the right heading. The client's
 * note: "Eye treatments should be in the skin treatment. Intimate care
 * should be in body treatment. Mesotherapy should be in skin treatments" —
 * they used to sit together in a "More treatments" catch-all at the foot of
 * the page, disconnected from the categories above.
 */
export const pricingSection = defineType({
  name: "pricingSection",
  title: "Extra price table",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Heading",
      type: "string",
      validation: (Rule) => Rule.required().max(120),
    }),
    defineField({
      name: "category",
      title: "Show under category",
      type: "string",
      options: { list: categoryOptions },
      description: "Which of the four /pricing headings this table appears beneath.",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "order",
      title: "Order within the category",
      type: "number",
      description: "Lower numbers first. Tables sort after the category's treatments either way.",
      validation: (Rule) => Rule.integer().min(0),
    }),
    defineField({
      name: "groups",
      title: "Price tables",
      type: "array",
      of: [defineArrayMember({ type: "priceGroup" })],
      validation: (Rule) => Rule.required().min(1),
    }),
  ],
  orderings: [
    { title: "Order", name: "orderAsc", by: [{ field: "order", direction: "asc" }] },
  ],
  preview: {
    select: { title: "title", subtitle: "category" },
  },
});
