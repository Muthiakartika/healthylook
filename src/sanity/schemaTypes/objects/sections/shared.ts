import type { FieldDefinition } from "sanity";
import { defineField } from "sanity";

export const sectionSettingsFields: FieldDefinition[] = [
  defineField({
    name: "anchor",
    title: "Section anchor",
    type: "string",
    description: "Optional ID for links such as /our-doctor#team. Letters, numbers, and hyphens only.",
    validation: (Rule) =>
      Rule.regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, { invert: false }).warning(
        "Use lowercase words separated by hyphens.",
      ),
  }),
  defineField({
    name: "isHidden",
    title: "Hide this section",
    type: "boolean",
    initialValue: false,
    description: "Keeps the content in the document without rendering it on the website.",
  }),
];

export const toneField = defineField({
  name: "tone",
  title: "Background",
  type: "string",
  options: {
    layout: "radio",
    list: [
      { title: "Paper", value: "paper" },
      { title: "White", value: "white" },
      { title: "Soft wash", value: "wash" },
      { title: "Blush", value: "blush" },
      { title: "Lime accent", value: "lime" },
      { title: "Dark brown", value: "brown" },
    ],
  },
  initialValue: "paper",
});
