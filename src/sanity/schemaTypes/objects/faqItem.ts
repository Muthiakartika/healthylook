import { defineField, defineType } from "sanity";

export const faqItem = defineType({
  name: "faqItem",
  title: "Question and answer",
  type: "object",
  fields: [
    defineField({
      name: "question",
      title: "Question",
      type: "string",
      validation: (Rule) => Rule.required().max(180),
    }),
    defineField({
      name: "answer",
      title: "Answer",
      type: "portableText",
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: { select: { title: "question" } },
});
