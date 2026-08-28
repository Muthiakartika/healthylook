import { defineArrayMember, defineField, defineType } from "sanity";

const categoryOptions = [
  { title: "Facial Enhancement", value: "facial-enhancement" },
  { title: "Skin Treatments", value: "skin-treatments" },
  { title: "Body Treatments", value: "body-treatments" },
  { title: "Hair & Booster", value: "hair-booster" },
];

export const treatment = defineType({
  name: "treatment",
  title: "Treatment",
  type: "document",
  groups: [
    { name: "overview", title: "Overview", default: true },
    { name: "clinical", title: "At a glance" },
    { name: "pricing", title: "Pricing" },
    { name: "content", title: "Page content" },
    { name: "seo", title: "SEO" },
  ],
  fields: [
    defineField({ name: "name", title: "Catalogue name", type: "string", group: "overview", validation: (Rule) => Rule.required() }),
    defineField({ name: "h1", title: "Page heading", type: "string", group: "overview" }),
    defineField({ name: "slug", title: "URL slug", type: "slug", group: "overview", options: { source: "name", maxLength: 120 }, validation: (Rule) => Rule.required() }),
    defineField({ name: "path", title: "Custom full path", type: "string", group: "overview", description: "Normally empty. Use only when the real URL is outside /ubud-bali/." }),
    defineField({ name: "category", title: "Category", type: "string", group: "overview", options: { list: categoryOptions }, validation: (Rule) => Rule.required() }),
    defineField({ name: "shortDescription", title: "Catalogue description", type: "text", rows: 3, group: "overview", validation: (Rule) => Rule.required() }),
    defineField({ name: "intro", title: "Introduction", type: "text", rows: 6, group: "overview" }),
    defineField({ name: "image", title: "Hero image", type: "imageWithAlt", group: "overview" }),
    defineField({ name: "featuredOnHomepage", title: "Feature on homepage", type: "boolean", group: "overview", initialValue: false }),
    defineField({ name: "featuredOrder", title: "Homepage order", type: "number", group: "overview", hidden: ({ parent }) => !parent?.featuredOnHomepage, validation: (Rule) => Rule.integer().min(0) }),

    defineField({ name: "treatmentTime", title: "Treatment time", type: "string", group: "clinical" }),
    defineField({ name: "treatmentTimeShort", title: "Treatment time (card)", type: "string", group: "clinical" }),
    defineField({ name: "anaesthesia", title: "Anaesthesia", type: "string", group: "clinical" }),
    defineField({ name: "downtime", title: "Downtime", type: "string", group: "clinical" }),
    defineField({ name: "initialResult", title: "Initial result", type: "string", group: "clinical" }),
    defineField({ name: "fullResult", title: "Full result", type: "string", group: "clinical" }),
    defineField({ name: "performedBy", title: "Performed by", type: "string", group: "clinical" }),

    defineField({ name: "startingPrice", title: "From price (IDR)", type: "number", group: "pricing", validation: (Rule) => Rule.integer().positive() }),
    defineField({ name: "priceUnit", title: "Price unit", type: "string", group: "pricing" }),
    defineField({ name: "priceGroups", title: "Price tables", type: "array", group: "pricing", of: [defineArrayMember({ type: "priceGroup" })] }),

    defineField({ name: "popularAreasTitle", title: "Popular areas heading", type: "string", group: "content" }),
    defineField({ name: "popularAreas", title: "Popular areas", type: "array", group: "content", of: [defineArrayMember({ type: "string" })] }),
    defineField({ name: "sections", title: "Long-form sections", type: "array", group: "content", of: [defineArrayMember({ type: "treatmentSection" })] }),
    defineField({ name: "faqs", title: "FAQs", type: "array", group: "content", of: [defineArrayMember({ type: "faqItem" })] }),
    defineField({ name: "seo", title: "Search and social", type: "seo", group: "seo" }),
  ],
  preview: {
    select: { title: "name", subtitle: "category", media: "image" },
  },
  orderings: [
    { title: "Name", name: "nameAsc", by: [{ field: "name", direction: "asc" }] },
    { title: "Homepage order", name: "featuredOrderAsc", by: [{ field: "featuredOrder", direction: "asc" }] },
  ],
});
