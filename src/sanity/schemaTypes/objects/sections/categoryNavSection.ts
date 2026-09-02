import { defineField, defineType } from "sanity";
import { sectionSettingsFields } from "./shared";

// The category labels/order on the actual website come from the site's
// treatment catalogue, not from this field — `label` exists only so this
// object always has one real, concrete piece of data. An object type with
// nothing but the generic inherited settings fields was found to be
// unreliable in Studio's array editor (it could silently disappear from
// the sections array after an edit elsewhere on the same document) —
// giving it an `initialValue` here means a freshly-inserted block is never
// truly empty underneath.
export const categoryNavSection = defineType({
  name: "categoryNavSection",
  title: "Treatment category jump nav",
  type: "object",
  description:
    "A sticky row of links to each treatment category, for jumping down a long page. Categories come from the treatment catalogue — the label below is only for this list, not shown on the website.",
  fields: [
    defineField({
      name: "label",
      title: "Internal label",
      type: "string",
      description: "Shown only here in Studio, to identify this block in the section list.",
      initialValue: "Treatment category jump nav",
      validation: (Rule) => Rule.required(),
    }),
    ...sectionSettingsFields,
  ],
  preview: {
    select: { title: "label" },
    prepare: ({ title }) => ({ title: title || "Treatment category jump nav" }),
  },
});
