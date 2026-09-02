import { defineField, defineType } from "sanity";
import { sectionSettingsFields } from "./shared";

// Same reasoning as categoryNavSection: the actual links, their labels,
// order and photo counts all come from the site's own results catalogue
// (src/data/results.ts), not from anything set per page. `label` exists
// only so this object always has one real, concrete field — an object
// with nothing but the inherited settings fields was found to be
// unreliable in Studio's array editor (see categoryNavSection's own
// comment for the incident this is avoiding a repeat of).
export const resultsNavSection = defineType({
  name: "resultsNavSection",
  title: "Results jump nav",
  type: "object",
  description:
    "A sticky row of pill links, one per result group, each showing its photo count — for jumping down the Before & After page. Nothing to fill in — groups come from the results catalogue.",
  fields: [
    defineField({
      name: "label",
      title: "Internal label",
      type: "string",
      description: "Shown only here in Studio, to identify this block in the section list.",
      initialValue: "Results jump nav",
      validation: (Rule) => Rule.required(),
    }),
    ...sectionSettingsFields,
  ],
  preview: {
    select: { title: "label" },
    prepare: ({ title }) => ({ title: title || "Results jump nav" }),
  },
});
