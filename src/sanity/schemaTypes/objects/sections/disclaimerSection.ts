import { defineField, defineType } from "sanity";
import { sectionSettingsFields } from "./shared";

// Deliberately not the generic richTextSection: that one carries a full
// SectionHeading and py-section padding, built for a real statement with
// its own heading. A disclaimer is a much smaller, plainer thing — one
// line at caption size — so it's cheaper and clearer as its own minimal
// type than as a special case bolted onto a block meant for something
// bigger. Split into `lead`/`text` (rather than one free-text field) so
// the bold lead-in phrase renders correctly without needing rich text.
export const disclaimerSection = defineType({
  name: "disclaimerSection",
  title: "Disclaimer note",
  type: "object",
  description:
    "A short, tightly-spaced note on a lime background (e.g. 'Individual results vary...') — smaller and plainer than a Rich text section.",
  fields: [
    defineField({
      name: "lead",
      title: "Bold lead-in",
      type: "string",
      description: "The bold opening phrase, e.g. \"Individual results vary.\"",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "text",
      title: "Text",
      type: "text",
      rows: 2,
      description: "The rest of the sentence, in regular weight, right after the lead-in.",
      validation: (Rule) => Rule.required(),
    }),
    ...sectionSettingsFields,
  ],
  preview: {
    select: { title: "lead" },
    prepare: ({ title }) => ({ title: title || "Disclaimer note" }),
  },
});
