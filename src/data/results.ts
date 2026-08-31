// Before & after gallery — the clinic's own published result photographs.
//
// ── WHY THIS FILE EXISTS ───────────────────────────────────────────────
// /before-after used to carry a single image, under a code comment stating
// "the clinic has exactly one before/after asset in its media library".
// That was read off this repo's own /public folder, not off the live site.
// The live /before-after page publishes 56 photographs across six treatment
// categories. They are the clinic's own, already public, and each one is
// watermarked and labelled "Before"/"After" inside the image itself.
//
// ── WHAT IS STILL TRUE FROM THAT OLD NOTE ──────────────────────────────
// The caution was right even though the count was wrong: nothing here is
// captioned with a claim the clinic has not already made. There are no
// invented timescales, unit counts, or outcome descriptions — the category
// name is the only label, exactly as on the live site. Consent and clinical
// sign-off sit with the clinic, and are evidenced by these already being
// published; this build re-publishes them unchanged.

export type ResultGroup = {
  slug: string;
  label: string;
  /** Treatment page this category maps to, where one exists. */
  treatmentSlug: string | null;
  images: string[];
};

export const resultGroups: ResultGroup[] = [
  {
    slug: "botox",
    label: "Botox",
    treatmentSlug: "botox",
    images: [
      "/images/results/botox/01.webp",
      "/images/results/botox/02.webp",
      "/images/results/botox/03.webp",
      "/images/results/botox/04.webp",
      "/images/results/botox/05.webp",
      "/images/results/botox/06.webp",
      "/images/results/botox/07.webp",
      "/images/results/botox/08.webp",
      "/images/results/botox/09.webp",
      "/images/results/botox/13.webp",
      "/images/results/botox/14.webp",
      "/images/results/botox/15.webp",
      "/images/results/botox/16.webp",
      "/images/results/botox/17.webp",
      "/images/results/botox/18.webp",
      "/images/results/botox/19.webp",
      "/images/results/botox/20.webp",
      "/images/results/botox/21.webp",
      "/images/results/botox/22.webp",
      "/images/results/botox/23.webp",
      "/images/results/botox/24.webp",
      "/images/results/botox/29.webp",
      "/images/results/botox/30.webp",
      "/images/results/botox/31.webp",
    ],
  },
  {
    slug: "lip-filler",
    label: "Lip Filler",
    treatmentSlug: "lip-filler",
    images: [
      "/images/results/lip-filler/01.webp",
      "/images/results/lip-filler/02.webp",
      "/images/results/lip-filler/03.webp",
      "/images/results/lip-filler/04.webp",
      "/images/results/lip-filler/05.webp",
      "/images/results/lip-filler/06.webp",
      "/images/results/lip-filler/07.webp",
      "/images/results/lip-filler/08.webp",
      "/images/results/lip-filler/09.webp",
      "/images/results/lip-filler/10.webp",
      "/images/results/lip-filler/11.webp",
      "/images/results/lip-filler/12.webp",
      "/images/results/lip-filler/13.webp",
      "/images/results/lip-filler/14.webp",
      "/images/results/lip-filler/15.webp",
      "/images/results/lip-filler/16.webp",
      "/images/results/lip-filler/17.webp",
      "/images/results/lip-filler/18.webp",
      "/images/results/lip-filler/19.webp",
      "/images/results/lip-filler/20.webp",
      "/images/results/lip-filler/21.webp",
      "/images/results/lip-filler/22.webp",
      "/images/results/lip-filler/23.webp",
      "/images/results/lip-filler/24.webp",
      "/images/results/lip-filler/25.webp",
      "/images/results/lip-filler/26.webp",
      "/images/results/lip-filler/27.webp",
      "/images/results/lip-filler/28.webp",
      "/images/results/lip-filler/29.webp",
      "/images/results/lip-filler/30.webp",
      "/images/results/lip-filler/31.webp",
      "/images/results/lip-filler/32.webp",
      "/images/results/lip-filler/33.webp",
      "/images/results/lip-filler/34.webp",
      "/images/results/lip-filler/35.webp",
      "/images/results/lip-filler/36.webp",
      "/images/results/lip-filler/37.webp",
      "/images/results/lip-filler/38.webp",
      "/images/results/lip-filler/39.webp",
      "/images/results/lip-filler/40.webp",
      "/images/results/lip-filler/41.webp",
      "/images/results/lip-filler/42.webp",
      "/images/results/lip-filler/43.webp",
      "/images/results/lip-filler/44.webp",
      "/images/results/lip-filler/45.webp",
      "/images/results/lip-filler/46.webp",
      "/images/results/lip-filler/47.webp",
      "/images/results/lip-filler/48.webp",
      "/images/results/lip-filler/49.webp",
    ],
  },
  {
    slug: "dermal-filler",
    label: "Dermal Filler",
    treatmentSlug: "dermal-filler",
    images: [
      "/images/results/dermal-filler/01.webp",
      "/images/results/dermal-filler/02.webp",
      "/images/results/dermal-filler/03.webp",
      "/images/results/dermal-filler/04.webp",
      "/images/results/dermal-filler/05.webp",
      "/images/results/dermal-filler/06.jpg",
      "/images/results/dermal-filler/07.jpg",
      "/images/results/dermal-filler/08.jpg",
      "/images/results/dermal-filler/11.webp",
      "/images/results/dermal-filler/12.webp",
      "/images/results/dermal-filler/13.webp",
      "/images/results/dermal-filler/14.webp",
      "/images/results/dermal-filler/15.webp",
      "/images/results/dermal-filler/16.webp",
      "/images/results/dermal-filler/17.webp",
      "/images/results/dermal-filler/18.webp",
      "/images/results/dermal-filler/19.webp",
      "/images/results/dermal-filler/20.webp",
      "/images/results/dermal-filler/21.webp",
      "/images/results/dermal-filler/22.webp",
      "/images/results/dermal-filler/24.webp",
      "/images/results/dermal-filler/25.webp",
      "/images/results/dermal-filler/26.webp",
      "/images/results/dermal-filler/27.webp",
      "/images/results/dermal-filler/28.webp",
      "/images/results/dermal-filler/29.webp",
    ],
  },
  {
    slug: "premium-hifu-by-linear-z",
    label: "Premium HIFU by Linear Z",
    treatmentSlug: "hifu",
    images: [
      "/images/results/premium-hifu-by-linear-z/01.webp",
      "/images/results/premium-hifu-by-linear-z/02.webp",
      "/images/results/premium-hifu-by-linear-z/03.webp",
      "/images/results/premium-hifu-by-linear-z/04.webp",
      "/images/results/premium-hifu-by-linear-z/05.webp",
      "/images/results/premium-hifu-by-linear-z/06.webp",
      "/images/results/premium-hifu-by-linear-z/07.webp",
      "/images/results/premium-hifu-by-linear-z/08.webp",
      "/images/results/premium-hifu-by-linear-z/09.webp",
      "/images/results/premium-hifu-by-linear-z/10.webp",
      "/images/results/premium-hifu-by-linear-z/11.webp",
      "/images/results/premium-hifu-by-linear-z/12.webp",
      "/images/results/premium-hifu-by-linear-z/13.webp",
      "/images/results/premium-hifu-by-linear-z/14.webp",
      "/images/results/premium-hifu-by-linear-z/15.webp",
      "/images/results/premium-hifu-by-linear-z/16.webp",
    ],
  },
  {
    slug: "ce-certified-muscle-sculpting-by-cm-slim",
    label: "CE Certified Muscle Sculpting by CM Slim",
    treatmentSlug: "muscle-sculpting",
    images: [
      "/images/results/ce-certified-muscle-sculpting-by-cm-slim/01.jpg",
      "/images/results/ce-certified-muscle-sculpting-by-cm-slim/02.jpg",
      "/images/results/ce-certified-muscle-sculpting-by-cm-slim/03.jpg",
      "/images/results/ce-certified-muscle-sculpting-by-cm-slim/04.webp",
      "/images/results/ce-certified-muscle-sculpting-by-cm-slim/05.webp",
      "/images/results/ce-certified-muscle-sculpting-by-cm-slim/06.webp",
      "/images/results/ce-certified-muscle-sculpting-by-cm-slim/07.webp",
      "/images/results/ce-certified-muscle-sculpting-by-cm-slim/08.webp",
      "/images/results/ce-certified-muscle-sculpting-by-cm-slim/09.webp",
      "/images/results/ce-certified-muscle-sculpting-by-cm-slim/10.webp",
      "/images/results/ce-certified-muscle-sculpting-by-cm-slim/11.webp",
      "/images/results/ce-certified-muscle-sculpting-by-cm-slim/12.webp",
      "/images/results/ce-certified-muscle-sculpting-by-cm-slim/13.webp",
      "/images/results/ce-certified-muscle-sculpting-by-cm-slim/14.webp",
      "/images/results/ce-certified-muscle-sculpting-by-cm-slim/15.webp",
    ],
  },
  {
    slug: "hair-and-skin-treatment",
    label: "Hair & Skin Treatment",
    treatmentSlug: null,
    images: [
      "/images/results/hair-and-skin-treatment/01.webp",
      "/images/results/hair-and-skin-treatment/02.webp",
      "/images/results/hair-and-skin-treatment/03.webp",
    ],
  },
  /**
   * ── CLIENT-SUPPLIED — THREE NEW CATEGORIES FROM CANVA ─────────────────
   * "Ambil gambar-gambar di canva ini dan taruh di page before and after
   * sesuaikan dengan nama treatmentnya" — eight Canva boards, one per
   * category, each an Instagram-post design with one before/after
   * composite photo per page (already combined into a single image by the
   * client, not two separate photos). Five matched existing categories
   * above and are folded into them; these three (Lysiwave, Hair Treatment,
   * Skin Treatment) didn't exist yet.
   *
   * Every photo is watermarked and labelled "Before"/"After" the same way
   * as the rest of this file, to match — the source images from Canva
   * were plain, so the label text and the clinic's own logo (from
   * data/brand) are composited on at build time, not hand-drawn per photo.
   *
   * `treatmentSlug: null` for all three, same reasoning as
   * "hair-and-skin-treatment" above: the client named them by broad
   * category ("Lysiwave" is specific, but "Hair Treatment" and "Skin
   * Treatment" are not one single treatment), so none of the three claim
   * a specific treatment page's embedded gallery — see
   * `getResultsForTreatment`'s note below for why that match has to be
   * exact rather than approximate.
   *
   * ⚠ Lysiwave is worth flagging on its own: unlike the other two, it IS
   * a single named treatment (`fat-cellulite`), so it could reasonably
   * take `treatmentSlug: "fat-cellulite"` instead of `null` — that would
   * make it show inline on the Lysiwave treatment page itself, the way
   * botox/lip-filler/dermal-filler/hifu/muscle-sculpting already do.
   * Left as `null` (full-gallery-only, like the two genuinely general
   * categories) rather than assumed, since that's a real content
   * decision and no client note asked for it either way.
   */
  {
    slug: "lysiwave",
    label: "Lysiwave",
    treatmentSlug: null,
    images: [
      "/images/results/lysiwave/01.webp",
      "/images/results/lysiwave/02.webp",
      "/images/results/lysiwave/03.webp",
      "/images/results/lysiwave/04.webp",
      "/images/results/lysiwave/05.webp",
      "/images/results/lysiwave/06.webp",
      "/images/results/lysiwave/07.webp",
    ],
  },
  {
    slug: "hair-treatment",
    label: "Hair Treatment",
    treatmentSlug: null,
    images: [
      "/images/results/hair-treatment/01.webp",
      "/images/results/hair-treatment/02.webp",
      "/images/results/hair-treatment/03.webp",
    ],
  },
  {
    slug: "skin-treatment",
    label: "Skin Treatment",
    treatmentSlug: null,
    images: [
      "/images/results/skin-treatment/01.webp",
      "/images/results/skin-treatment/02.webp",
      "/images/results/skin-treatment/03.webp",
      "/images/results/skin-treatment/04.webp",
      "/images/results/skin-treatment/05.webp",
      "/images/results/skin-treatment/06.webp",
      "/images/results/skin-treatment/07.webp",
      "/images/results/skin-treatment/08.webp",
    ],
  },
];

export const totalResults = resultGroups.reduce((n, g) => n + g.images.length, 0);

/**
 * ── CLIENT REVISION — BEFORE/AFTER ON EVERY TREATMENT PAGE ────────────
 * "Add a before/after section to every treatment page, matched to that
 * page's own treatment."
 *
 * Only 5 of the clinic's 6 published result categories name a specific
 * treatment (see `treatmentSlug` above) — the sixth, "Hair & Skin
 * Treatment", is the clinic's own general bucket and isn't about any one
 * treatment. Returning `undefined` for every other slug is deliberate:
 * the same rule this file's `hair-and-skin-treatment` comment already
 * states applies here — showing one treatment's photos on a page for a
 * *different* treatment is the invented-result the brief prohibits, so a
 * treatment page with no matching category gets no embedded gallery,
 * only the existing link out to the full /before-after page.
 */
export function getResultsForTreatment(slug: string): ResultGroup | undefined {
  return resultGroups.find((group) => group.treatmentSlug === slug);
}
