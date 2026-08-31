import type { StructureResolver } from "sanity/structure";

const singletonTypes = new Set(["siteSettings"]);

export const structure: StructureResolver = (S) =>
  S.list()
    .title("Content")
    .items([
      S.listItem()
        .title("Pages")
        .schemaType("page")
        .child(S.documentTypeList("page").title("Pages")),
      S.divider(),
      S.listItem()
        .title("Blog posts")
        .schemaType("post")
        .child(S.documentTypeList("post").title("Blog posts")),
      S.listItem()
        .title("Blog categories")
        .schemaType("category")
        .child(S.documentTypeList("category").title("Blog categories")),
      S.divider(),
      S.listItem()
        .title("Treatments")
        .schemaType("treatment")
        .child(S.documentTypeList("treatment").title("Treatments")),
      S.listItem()
        .title("Extra price tables")
        .schemaType("pricingSection")
        .child(S.documentTypeList("pricingSection").title("Extra price tables")),
      S.listItem()
        .title("Doctors")
        .schemaType("doctor")
        .child(S.documentTypeList("doctor").title("Doctors")),
      S.listItem()
        .title("Testimonials")
        .schemaType("testimonial")
        .child(S.documentTypeList("testimonial").title("Testimonials")),
      S.divider(),
      S.listItem()
        .title("Site settings")
        .schemaType("siteSettings")
        .child(S.document().schemaType("siteSettings").documentId("siteSettings")),
    ]);

/** Prevent duplicate singleton documents in global create menus. */
export const newDocumentOptions = <T extends { templateId: string }>(items: T[]) =>
  items.filter((item) => !singletonTypes.has(item.templateId));
