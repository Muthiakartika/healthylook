import { defineField, defineType } from "sanity";

export const siteSettings = defineType({
  name: "siteSettings",
  title: "Site settings",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Site name",
      type: "string",
      readOnly: true,
      initialValue: "Healthy Look Aesthetic",
    }),
    defineField({
      name: "announcement",
      title: "Announcement bar",
      type: "string",
      validation: (Rule) => Rule.max(140),
    }),
    defineField({ name: "defaultSeo", title: "Default SEO", type: "seo" }),
  ],
  preview: {
    prepare: () => ({ title: "Site settings" }),
  },
});
