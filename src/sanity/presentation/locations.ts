import { defineLocations } from "sanity/presentation";

export const presentationLocations = {
  page: defineLocations({
    select: { title: "title", path: "path" },
    resolve: (document) => ({
      locations: document?.path
        ? [{ title: document.title || "Page", href: document.path }]
        : [],
    }),
  }),
  post: defineLocations({
    select: { title: "title", slug: "slug.current" },
    resolve: (document) => ({
      locations: document?.slug
        ? [{ title: document.title || "Blog post", href: `/${document.slug}` }]
        : [],
    }),
  }),
  treatment: defineLocations({
    select: { title: "name", slug: "slug.current", path: "path" },
    resolve: (document) => ({
      locations: document?.slug
        ? [
            {
              title: document.title || "Treatment",
              href: document.path || `/ubud-bali/${document.slug}`,
            },
          ]
        : [],
    }),
  }),
};
