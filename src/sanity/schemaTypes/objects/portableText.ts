import { defineArrayMember, defineField, defineType } from "sanity";

export const portableText = defineType({
  name: "portableText",
  title: "Rich text",
  type: "array",
  of: [
    defineArrayMember({
      type: "block",
      styles: [
        { title: "Paragraph", value: "normal" },
        { title: "Heading 2", value: "h2" },
        { title: "Heading 3", value: "h3" },
        { title: "Quote", value: "blockquote" },
      ],
      lists: [
        { title: "Bullet list", value: "bullet" },
        { title: "Numbered list", value: "number" },
      ],
      marks: {
        decorators: [
          { title: "Strong", value: "strong" },
          { title: "Emphasis", value: "em" },
        ],
        annotations: [
          defineField({
            name: "textLink",
            title: "Link",
            type: "object",
            fields: [
              defineField({
                name: "href",
                title: "Destination",
                type: "url",
                validation: (Rule) =>
                  Rule.required().uri({
                    allowRelative: true,
                    scheme: ["http", "https", "mailto", "tel"],
                  }),
              }),
              defineField({
                name: "blank",
                title: "Open in a new tab",
                type: "boolean",
                initialValue: false,
              }),
            ],
          }),
        ],
      },
    }),
    defineArrayMember({ type: "imageWithAlt" }),
  ],
});
