import "server-only";
import { publishedDocuments } from "@/lib/content";

import {
  treatments as sourceTreatments,
  TREATMENT_CATEGORIES,
  HOME_POPULAR_SLUGS,
  type Treatment,
  type TreatmentCategoryId,
} from "@/data/treatments";
import { articles as sourceArticles, type Article } from "@/data/articles";
import {
  treatmentSections as sourceSections,
  type TreatmentSection,
} from "@/data/treatmentSections";
import { treatmentFaqs as sourceFaqs, type TreatmentFaq } from "@/data/treatmentFaqs";
import { doctors as sourceDoctors, type Doctor } from "@/data/doctors";
import type { LegalDocument } from "@/data/legal";
import {
  testimonials as sourceTestimonials,
  generalTestimonials as sourceGeneralTestimonials,
  getTestimonialsForTreatment as sourceTestimonialsForTreatment,
  hasOwnTestimonials as sourceHasOwnTestimonials,
  type Testimonial,
} from "@/data/testimonials";

/**
 * What the PUBLIC site reads. One function per collection, each returning
 * the same type the pages already used, so a page changes by adding
 * `await` and nothing else.
 *
 * ── THE WHOLE POINT: THIS STAYS STATIC ────────────────────────────────
 * Neon suspends its compute after a few minutes of quiet and meters the
 * hours it is awake. A site that queries Postgres on every request would
 * therefore be slow for the first visitor after any lull, and would keep
 * the database awake around the clock for no benefit.
 *
 * So nothing here is read per request. `publishedDocuments` wraps every
 * query in `unstable_cache` with a per-collection tag, which means:
 *
 *   · at build, each collection is read once and baked into the pages
 *   · a visitor never touches Postgres at all
 *   · when an editor saves, `revalidateTag` drops that collection and the
 *     affected pages regenerate on the next request
 *
 * The database is asleep almost all of the time, which is exactly the
 * usage Neon's free tier is shaped for. If a page ever shows as `ƒ`
 * (dynamic) in the build output instead of `○`/`●`, something in it has
 * opted out of static generation and this property has been lost — that
 * is the thing to check after touching any of these callers.
 *
 * ── FALLBACK ──────────────────────────────────────────────────────────
 * Every getter falls back to the compiled content in src/data/. That
 * covers three real cases: the database is not configured, it is
 * unreachable at build time, or the collection has not been imported yet.
 * In all three the site serves what it served before rather than an empty
 * page — which for a clinic's price list matters more than freshness.
 */

export async function getTreatments(): Promise<Treatment[]> {
  const rows = await publishedDocuments<Treatment>("treatments");
  return rows ? rows.map((row) => row.data) : sourceTreatments;
}

export async function getTreatmentBySlug(slug: string): Promise<Treatment | undefined> {
  return (await getTreatments()).find((t) => t.slug === slug);
}

export async function getTreatmentsByCategory(
  category: TreatmentCategoryId,
): Promise<Treatment[]> {
  return (await getTreatments()).filter((t) => t.category === category);
}

export { TREATMENT_CATEGORIES };

/**
 * The homepage's curated shortlist, per category.
 *
 * The equivalent in treatments.ts reads the compiled array, so it would
 * keep returning source content on a page whose other data comes from the
 * database. Which treatments are shortlisted (HOME_POPULAR_SLUGS) stays in
 * code — it is editorial curation, not content — but the treatments
 * themselves are resolved through the database layer.
 */
export async function getPopularTreatments(
  category: TreatmentCategoryId,
): Promise<Treatment[]> {
  const all = await getTreatments();
  return HOME_POPULAR_SLUGS.map((slug) => all.find((t) => t.slug === slug)).filter(
    (t): t is Treatment => t !== undefined && t.category === category,
  );
}

/**
 * "30+" rather than an exact count — floored to the nearest ten so it
 * cannot quietly become a lie as the catalogue changes. Same rule as the
 * constant it replaces; the difference is that it counts what the site is
 * actually serving.
 */
export async function getTreatmentCountLabel(): Promise<string> {
  const all = await getTreatments();
  return `${Math.floor(all.length / 10) * 10}+`;
}

export async function getArticles(): Promise<Article[]> {
  const rows = await publishedDocuments<Article>("articles");
  return rows ? rows.map((row) => row.data) : sourceArticles;
}

export async function getArticleBySlug(slug: string): Promise<Article | undefined> {
  return (await getArticles()).find((a) => a.slug === slug);
}

/**
 * Sections and FAQs are keyed maps in source and one row per treatment in
 * the database, so both are rebuilt into the map shape their callers
 * already expect rather than changing every call site.
 */
export async function getTreatmentSections(
  slug: string,
): Promise<TreatmentSection[]> {
  const rows = await publishedDocuments<{ slug: string; sections: TreatmentSection[] }>(
    "treatment-sections",
  );
  if (!rows) return sourceSections[slug] ?? [];
  return rows.find((row) => row.slug === slug)?.data.sections ?? [];
}

export async function getTreatmentFaqs(slug: string): Promise<TreatmentFaq[]> {
  const rows = await publishedDocuments<{ slug: string; faqs: TreatmentFaq[] }>(
    "treatment-faqs",
  );
  if (!rows) return sourceFaqs[slug] ?? [];
  return rows.find((row) => row.slug === slug)?.data.faqs ?? [];
}

export async function getDoctors(): Promise<Doctor[]> {
  const rows = await publishedDocuments<Doctor>("doctors");
  return rows ? rows.map((row) => row.data) : sourceDoctors;
}

/**
 * Reviews.
 *
 * ── WHERE A REVIEW APPEARS IS NOW DATA ────────────────────────────────
 * The source file keeps two hand-maintained lists of ids: which reviews
 * run in the homepage carousel, and which run on each treatment page.
 * Those are carried onto each review as `featured` and `treatments` at
 * import, so adding a review to a page stopped being a code change.
 *
 * The source helpers stay as the fallback, and they still read the id
 * lists — which is correct, because that is the shape of the data they
 * are falling back to.
 */
type StoredTestimonial = Testimonial & {
  featured?: boolean;
  treatments?: string[];
};

export async function getTestimonials(): Promise<Testimonial[]> {
  const rows = await publishedDocuments<StoredTestimonial>("testimonials");
  return rows ? rows.map((row) => row.data) : sourceTestimonials;
}

/** The clinic-wide set, in the order the carousel shows them. */
export async function getFeaturedTestimonials(): Promise<Testimonial[]> {
  const rows = await publishedDocuments<StoredTestimonial>("testimonials");
  if (!rows) return sourceGeneralTestimonials;
  const featured = rows.filter((row) => row.data.featured).map((row) => row.data);
  // An editor could un-feature every review. Showing an empty carousel
  // would look broken, so fall back rather than render nothing.
  return featured.length > 0 ? featured : sourceGeneralTestimonials;
}

export async function getTestimonialsForTreatment(slug: string): Promise<Testimonial[]> {
  const rows = await publishedDocuments<StoredTestimonial>("testimonials");
  if (!rows) return sourceTestimonialsForTreatment(slug);
  const own = rows
    .filter((row) => row.data.treatments?.includes(slug))
    .map((row) => row.data);
  return own.length > 0 ? own : getFeaturedTestimonials();
}

/**
 * Whether this treatment's reviews actually name it, rather than being the
 * clinic-wide fallback. Pages use it to decide whether they may label the
 * section "<Treatment> reviews" — calling six general clinic reviews
 * "Profhilo reviews" would be a claim none of the reviewers made.
 */
export async function hasOwnTestimonials(slug: string): Promise<boolean> {
  const rows = await publishedDocuments<StoredTestimonial>("testimonials");
  if (!rows) return sourceHasOwnTestimonials(slug);
  return rows.some((row) => row.data.treatments?.includes(slug));
}

/**
 * Copy for a non-treatment, non-article page, as a flat map of named
 * pieces. Returns null when the page has not been imported, so a caller
 * can keep using its own constants.
 */
export async function getPageContent(
  slug: string,
): Promise<Record<string, unknown> | null> {
  const rows = await publishedDocuments<{ content?: Record<string, unknown> }>("pages");
  return rows?.find((row) => row.slug === slug)?.data.content ?? null;
}

/**
 * A page's copy, with the compiled constants underneath it.
 *
 * ── WHY IT MERGES RATHER THAN REPLACES ────────────────────────────────
 * The stored `content` is a free-form map, and an editor can rename or
 * delete a key in it. Replacing outright would then render `undefined`
 * where a paragraph used to be — an invisible failure that reaches the
 * public site. Merging over the constants means a missing or renamed key
 * falls back to what the page shipped with, so the worst case is stale
 * copy rather than a blank.
 *
 * The type comes from the fallback, so a page keeps its compile-time
 * guarantees about which pieces exist.
 */
export async function getPageCopy<T extends Record<string, unknown>>(
  slug: string,
  fallback: T,
): Promise<T> {
  const stored = await getPageContent(slug);
  if (!stored) return fallback;
  // Only keys the page actually knows about are taken; a stray key left in
  // the database cannot introduce anything the page does not render.
  const merged = { ...fallback };
  for (const key of Object.keys(fallback) as (keyof T)[]) {
    const value = stored[key as string];
    if (value !== undefined && value !== null && value !== "") {
      merged[key] = value as T[keyof T];
    }
  }
  return merged;
}

/**
 * A privacy policy or terms document.
 *
 * ── WHY THIS ONE VALIDATES AND THE OTHERS DO NOT ──────────────────────
 * Everywhere else a stored value is a string that renders as itself, so a
 * bad edit is visible and harmless. This is a nested structure the page
 * walks — sections, then typed blocks inside them — and an editor working
 * in the JSON field can produce something the walk throws on. A crash on a
 * legal page is worse than stale text on one, so the shape is checked and
 * a document that does not hold up falls back to the compiled version.
 *
 * The check is deliberately shallow: it establishes that the walk will not
 * throw, not that the content is correct. Validating every block would be
 * a schema library for one screen.
 */
export async function getLegalDocument(
  slug: string,
  fallback: LegalDocument,
): Promise<LegalDocument> {
  const stored = await getPageContent(slug);
  if (!stored) return fallback;

  const looksRight =
    typeof stored.title === "string" &&
    Array.isArray(stored.sections) &&
    stored.sections.every(
      (section: unknown) =>
        typeof section === "object" &&
        section !== null &&
        typeof (section as { title?: unknown }).title === "string" &&
        Array.isArray((section as { blocks?: unknown }).blocks),
    );

  return looksRight ? (stored as unknown as LegalDocument) : fallback;
}
