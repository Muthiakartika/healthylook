import { defineArrayMember, defineType } from "sanity";
import { textLinkAnnotation } from "./textLink";
import { pasteComponents } from "../../portableText/paste";

const textBlock = defineArrayMember({
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
    // Shared with the treatment page's prose so a link behaves the
    // same wherever it is written — including an in-page `#anchor`,
    // which the old url-typed field rejected. See textLink.ts.
    annotations: [textLinkAnnotation],
  },
});

export const portableText = defineType({
  name: "portableText",
  title: "Rich text",
  type: "array",
  of: [textBlock, defineArrayMember({ type: "imageWithAlt" })],
  // Links pasted from a Google Doc or a website stay links. See paste.tsx.
  components: pasteComponents,
});

/**
 * The blog article body: the rich text above plus a table.
 *
 * ── A SEPARATE TYPE, NOT A TABLE IN `portableText` ─────────────────────
 * `portableText` is also an FAQ answer, an offer's small print and a page
 * section's copy. A table belongs in an article and in none of those, and
 * offering it there means one turns up in a dark FAQ panel sooner or later.
 *
 * The table is the treatment pages' `treatmentTable`, not a second kind:
 * the same fields, the same Studio editor and the same component on the
 * site, including the phone layout that reflows it instead of making the
 * reader drag sideways. Its type name says "treatment" for history's sake;
 * Studio shows it as "Comparison table".
 */
export const articleBody = defineType({
  name: "articleBody",
  title: "Article body",
  type: "array",
  of: [
    textBlock,
    defineArrayMember({ type: "imageWithAlt" }),
    defineArrayMember({ type: "treatmentTable", title: "Table" }),
  ],
  components: pasteComponents,
});
