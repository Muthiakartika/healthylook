import { defineArrayMember, defineField, defineType } from "sanity";

export const doctor = defineType({
  name: "doctor",
  title: "Doctor",
  type: "document",
  fields: [
    defineField({ name: "name", title: "Full name", type: "string", validation: (Rule) => Rule.required() }),
    defineField({ name: "shortName", title: "Short name", type: "string", validation: (Rule) => Rule.required() }),
    defineField({ name: "title", title: "Role", type: "string", validation: (Rule) => Rule.required() }),
    defineField({ name: "photo", title: "Portrait", type: "imageWithAlt", validation: (Rule) => Rule.required() }),
    defineField({ name: "bio", title: "Biography", type: "array", of: [defineArrayMember({ type: "text", rows: 5 })], validation: (Rule) => Rule.required().min(1) }),
    defineField({ name: "registrationNumber", title: "Registry number", type: "string", validation: (Rule) => Rule.required() }),
    defineField({ name: "registryUrl", title: "Registry URL", type: "url", validation: (Rule) => Rule.required().uri({ scheme: ["https"] }) }),
    defineField({ name: "order", title: "Display order", type: "number", initialValue: 0, validation: (Rule) => Rule.required().integer().min(0) }),
  ],
  preview: { select: { title: "name", subtitle: "title", media: "photo" } },
  orderings: [{ title: "Display order", name: "orderAsc", by: [{ field: "order", direction: "asc" }] }],
});
