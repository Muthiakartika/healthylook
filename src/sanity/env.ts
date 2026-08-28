/**
 * Sanity environment values live in one module so the Studio, fetch layer,
 * image builder, and API routes cannot quietly disagree about dataset or API
 * version. Public values are safe to expose; tokens are read only in server
 * modules and route handlers.
 */
export const sanityProjectId =
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID?.trim() || "";

export const sanityDataset =
  process.env.NEXT_PUBLIC_SANITY_DATASET?.trim() || "production";

export const sanityApiVersion =
  process.env.NEXT_PUBLIC_SANITY_API_VERSION?.trim() || "2025-02-19";

export const sanityStudioUrl =
  process.env.NEXT_PUBLIC_SANITY_STUDIO_URL?.trim() || "/studio";

export const sanityPreviewOrigin =
  process.env.SANITY_STUDIO_PREVIEW_ORIGIN?.trim() || "http://localhost:3006";

export const isSanityConfigured = Boolean(sanityProjectId && sanityDataset);

/** Sanity clients require a syntactically valid project id at construction. */
export const resolvedSanityProjectId = sanityProjectId || "notconfigured";
