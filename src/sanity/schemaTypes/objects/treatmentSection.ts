import { defineArrayMember, defineField, defineType } from "sanity";

export const treatmentContentBlock = defineType({
  name: "treatmentContentBlock",
  title: "Prose block",
  type: "object",
  fields: [
    defineField({ name: "heading", title: "Subheading", type: "string" }),
    defineField({
      name: "paragraphs",
      title: "Paragraphs",
      type: "array",
      of: [defineArrayMember({ type: "text", rows: 4 })],
      validation: (Rule) => Rule.required().min(1),
    }),
  ],
  preview: {
    select: { title: "heading", paragraphs: "paragraphs" },
    prepare: ({ title, paragraphs }) => ({
      title: title || "Paragraphs",
      subtitle: Array.isArray(paragraphs) ? paragraphs[0] : undefined,
    }),
  },
});

export const treatmentSection = defineType({
  name: "treatmentSection",
  title: "Treatment content section",
  type: "object",
  fields: [
    defineField({
      name: "title",
      title: "Heading",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "blocks",
      title: "Prose",
      type: "array",
      of: [defineArrayMember({ type: "treatmentContentBlock" })],
    }),
    defineField({
      name: "points",
      title: "Short bullet points",
      type: "array",
      of: [defineArrayMember({ type: "string" })],
    }),
  ],
  validation: (Rule) =>
    Rule.custom((value) => {
      if (!value) return true;
      const candidate = value as { blocks?: unknown[]; points?: unknown[] };
      return candidate.blocks?.length || candidate.points?.length
        ? true
        : "Add prose or at least one bullet point.";
    }),
  preview: {
    select: { title: "title", blocks: "blocks", points: "points" },
    prepare: ({ title, blocks, points }) => ({
      title,
      subtitle: `${Array.isArray(blocks) ? blocks.length : 0} prose blocks · ${Array.isArray(points) ? points.length : 0} points`,
    }),
  },
});
