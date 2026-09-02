import { defineField, defineType } from "sanity";
import { sectionSettingsFields } from "./shared";

// A single short line, always in the site's script display face, centred,
// framed by hairlines top and bottom — for a brief trust/authenticity
// statement (e.g. "Real patients, real results. No filter, no edit." on
// /before-after). Not a generic content block: no tone or alignment
// options, because this is one specific typographic treatment, not a
// flexible one.
export const taglineSection = defineType({
  name: "taglineSection",
  title: "Tagline statement",
  type: "object",
  description:
    "One short line set in the script display face, centred — for a brief statement like an authenticity or trust claim.",
  fields: [
    defineField({
      name: "text",
      title: "Text",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    ...sectionSettingsFields,
  ],
  preview: {
    select: { title: "text" },
    prepare: ({ title }) => ({
      title: title || "Tagline statement",
      subtitle: "Script tagline",
    }),
  },
});
