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
    defineField({
      name: "summary",
      title: "Short description (homepage card)",
      type: "text",
      rows: 6,
      description:
        "The text under the doctor's name on the homepage. Leave empty to use the website's current wording. The full biography above is shown on the Our Doctor page. · ID: Teks di bawah nama dokter di beranda. Kosongkan untuk memakai teks yang sekarang. Biografi lengkap di atas tampil di halaman Our Doctor.",
    }),
    defineField({ name: "registrationNumber", title: "Registry number", type: "string", validation: (Rule) => Rule.required() }),
    defineField({ name: "registryUrl", title: "Registry URL", type: "url", validation: (Rule) => Rule.required().uri({ scheme: ["https"] }) }),
    defineField({ name: "order", title: "Display order", type: "number", initialValue: 0, validation: (Rule) => Rule.required().integer().min(0) }),
  ],
  preview: { select: { title: "name", subtitle: "title", media: "photo" } },
  orderings: [{ title: "Display order", name: "orderAsc", by: [{ field: "order", direction: "asc" }] }],
});
