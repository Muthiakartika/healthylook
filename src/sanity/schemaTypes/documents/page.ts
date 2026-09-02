import { defineArrayMember, defineField, defineType } from "sanity";

async function isUniquePath(
  path: string | undefined,
  context: { document?: { _id?: string }; getClient: (options: { apiVersion: string }) => { fetch: <T>(query: string, params: Record<string, string>) => Promise<T> } },
) {
  if (!path) return true;
  const id = context.document?._id?.replace(/^drafts\./, "") || "";
  const duplicate = await context.getClient({ apiVersion: "2025-02-19" }).fetch<string | null>(
    `*[_type == "page" && path == $path && !(_id in [$id, $draftId])][0]._id`,
    { path, id, draftId: `drafts.${id}` },
  );
  return duplicate ? "Another page already uses this website path." : true;
}

const sectionMembers = [
  "heroSection",
  "richTextSection",
  "splitContentSection",
  "featureGridSection",
  "gallerySection",
  "faqSection",
  "ctaSection",
  "collectionSection",
  "curatedSection",
  "pricingPromiseSection",
  "categoryNavSection",
  "taglineSection",
  "disclaimerSection",
  "resultsNavSection",
].map((type) => defineArrayMember({ type }));

export const page = defineType({
  name: "page",
  title: "Page",
  type: "document",
  groups: [
    { name: "content", title: "Content", default: true },
    { name: "seo", title: "SEO" },
  ],
  fields: [
    defineField({
      name: "title",
      title: "Internal page name",
      type: "string",
      group: "content",
      validation: (Rule) => Rule.required().max(100),
    }),
    defineField({
      name: "path",
      title: "Website path",
      type: "string",
      group: "content",
      description: "Use / for the homepage or a complete path such as /gift-card.",
      validation: (Rule) =>
        Rule.required().custom(async (value, context) => {
          if (!value) return true;
          if (!value.startsWith("/")) return "The path must begin with /.";
          if (value.length > 1 && value.endsWith("/")) return "Remove the trailing /.";
          if (value.includes("?") || value.includes("#")) return "Do not include query strings or anchors.";
          return isUniquePath(value, context);
        }),
    }),
    defineField({
      name: "sections",
      title: "Page sections",
      type: "array",
      group: "content",
      of: sectionMembers,
      validation: (Rule) => Rule.required().min(1),
      options: { insertMenu: { views: [{ name: "grid" }, { name: "list" }] } },
    }),
    defineField({ name: "seo", title: "Search and social", type: "seo", group: "seo" }),
  ],
  preview: {
    select: { title: "title", subtitle: "path" },
  },
  orderings: [
    {
      title: "Website path",
      name: "pathAsc",
      by: [{ field: "path", direction: "asc" }],
    },
  ],
});
