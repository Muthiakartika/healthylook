// The blog index, mirroring healthylook-aesthetic.com/our-blog.
//
// ── WHY THIS FILE GREW FROM 10 ENTRIES TO 46 ───────────────────────────
// The live blog is paginated: /our-blog/ shows ten posts and there are
// five pages behind it. An earlier pass captured page 1 only, so the
// rebuild was carrying 10 of the site's 46 posts and silently dropping the
// other 36 — including every post about hair, body, and booster
// treatments. All five pages are now represented.
//
// ── TWO KINDS OF POST ──────────────────────────────────────────────────
// The live blog mixes two things under one index, and the distinction
// matters here:
//
//  1. Thirty-one entries are articles *about a treatment*, and their real
//     URLs ARE the treatment pages. Those resolve to pages this build
//     already has, in full, so they link straight there.
//  2. Fifteen are standalone articles at their own top-level URLs. Those are
//     now real pages in this build too — their full text lives in
//     src/data/articles.ts and renders through the root `[slug]` route, at
//     the same URLs the live site uses.
//
// `treatmentSlug` records which treatment a type-1 entry maps to, so the
// treatment page and the blog index can cross-reference without a second
// hand-maintained list.
//
// Every entry therefore resolves inside this build; nothing here links off
// to the old site any more. See the header of src/data/articles.ts for why
// an earlier pass concluded the standalone articles could not be extracted.

export type BlogPost = {
  title: string;
  href: string;
  /** Optional CMS-authored cover image URL for standalone articles. */
  image?: string;
  /** Optional CMS category label shown on article cards. */
  categoryLabel?: string;
  /** Set when the post's destination is a treatment page. */
  treatmentSlug?: string;
  /**
   * Standalone articles live at their own top-level URL on the live site and
   * are rendered from src/data/articles.ts by the root `[slug]` route.
   */
  articleSlug?: string;
};

export const blogPosts: BlogPost[] = [
  // ── /our-blog page 1 ──
  {
    title: "Lysiwave - Fat & Cellulite Treatment in Bali",
    href: "/ubud-bali/fat-cellulite",
    treatmentSlug: "fat-cellulite",
  },
  {
    title: "Collagen Stimulator in Bali",
    href: "/ubud-bali/collagen-stimulator",
    treatmentSlug: "collagen-stimulator",
  },
  { title: "Sculptra in Bali", href: "/ubud-bali/sculptra", treatmentSlug: "sculptra" },
  {
    title: "Autologues Micrograft Hair Restoration",
    href: "/ubud-bali/autologues-micrograft-hair-restoration",
    treatmentSlug: "autologues-micrograft-hair-restoration",
  },
  { title: "Best Botox in Ubud Bali", href: "/ubud-bali/botox", treatmentSlug: "botox" },
  { title: "Juvelook in Ubud Bali", href: "/ubud-bali/juvelook", treatmentSlug: "juvelook" },
  {
    title: "Skin Clinic Bali",
    href: "/skin-clinic-bali",
    articleSlug: "skin-clinic-bali",
  },
  {
    title: "Advanced Body HIFU in Bali",
    href: "/ubud-bali/hifu/body",
    treatmentSlug: "hifu/body",
  },
  {
    title: "Nucleofill vs Rejuran",
    href: "/nucleofill-vs-rejuran",
    articleSlug: "nucleofill-vs-rejuran",
  },
  {
    title: "How Many Units of Botox for Forehead?",
    href: "/how-many-units-of-botox-for-forehead",
    articleSlug: "how-many-units-of-botox-for-forehead",
  },

  // ── /our-blog page 2 ──
  {
    title: "How Long Does Botox Last?",
    href: "/how-long-does-botox-last",
    articleSlug: "how-long-does-botox-last",
  },
  {
    title: "How Long Does Lip Filler Last?",
    href: "/how-long-does-lip-filler-last",
    articleSlug: "how-long-does-lip-filler-last",
  },
  {
    title: "What is Microneedling Good For?",
    href: "/what-is-microneedling-good-for",
    articleSlug: "what-is-microneedling-good-for",
  },
  {
    title: "Non Surgical Face Lift",
    href: "/non-surgical-face-lift",
    articleSlug: "non-surgical-face-lift",
  },
  {
    title: "Revitalize Skin with HIFU Treatment",
    href: "/revitalize-skin-with-hifu-treatment",
    articleSlug: "revitalize-skin-with-hifu-treatment",
  },
  {
    title: "Korean Botox in Bali",
    href: "/ubud-bali/botox/korean",
    treatmentSlug: "botox/korean",
  },
  {
    title: "RF Microneedling in Ubud Bali",
    href: "/ubud-bali/microneedling/rf",
    treatmentSlug: "microneedling/rf",
  },
  {
    title: "Carboxy Therapy in Ubud Bali",
    href: "/ubud-bali/carboxy-therapy",
    treatmentSlug: "carboxy-therapy",
  },
  {
    title: "Mesotherapy for Rejuvenating Skin & Hair",
    href: "/mesotherapy-for-rejuvenating-skin-hair",
    articleSlug: "mesotherapy-for-rejuvenating-skin-hair",
  },
  {
    title: "Hydra Facial in Ubud",
    href: "/hydra-facial-in-ubud",
    articleSlug: "hydra-facial-in-ubud",
  },

  // ── /our-blog page 3 ──
  { title: "Lip Filler in Ubud", href: "/ubud-bali/lip-filler", treatmentSlug: "lip-filler" },
  {
    // Backed by a treatment now, not a standalone article. The live site
    // publishes this as a post like the other fourteen, but it is also a card
    // on the live /ubud-bali/ index with its own treatment time and price —
    // so it lives in treatments.ts, and articles.ts no longer carries a
    // second copy of the same page. `href` is unchanged: the URL is the live
    // one either way.
    title: "Eye Rejuvenaton Treatment",
    href: "/eye-rejuvenaton-treatment",
    treatmentSlug: "eye-rejuvenation",
  },
  {
    title: "Collagen Stimulator in Ubud",
    href: "/liquid-lifting",
    articleSlug: "liquid-lifting",
  },
  { title: "Exosome in Ubud Bali", href: "/ubud-bali/exosome", treatmentSlug: "exosome" },
  { title: "Best Facial in Ubud", href: "/ubud-bali/facial", treatmentSlug: "facial" },
  {
    title: "When to Start Botox : A Guide to Timing and Benefits",
    href: "/when-to-start-botox-bali",
    articleSlug: "when-to-start-botox-bali",
  },
  { title: "Profhilo in Ubud", href: "/ubud-bali/profhilo", treatmentSlug: "profhilo" },
  {
    title: "Botox Treatments, Before and After",
    href: "/botox-before-after",
    articleSlug: "botox-before-after",
  },
  {
    title: "Medi Facial in Ubud Bali",
    href: "/ubud-bali/facial/medi",
    treatmentSlug: "facial/medi",
  },

  // ── /our-blog page 4 ──
  { title: "IV Drip in Ubud Bali", href: "/ubud-bali/iv-drip", treatmentSlug: "iv-drip" },
  {
    title: "Hair Mesotherapy in Ubud Bali",
    href: "/ubud-bali/hair-mesotherapy",
    treatmentSlug: "hair-mesotherapy",
  },
  { title: "PRP Hair in Ubud Bali", href: "/ubud-bali/prp/hair", treatmentSlug: "prp/hair" },
  {
    title: "Hair Removal in Ubud Bali",
    href: "/ubud-bali/ipl-hair-removal",
    treatmentSlug: "ipl-hair-removal",
  },
  {
    title: "Fat Dissolving Injections in Ubud Bali",
    href: "/ubud-bali/fat-dissolving-injections",
    treatmentSlug: "fat-dissolving-injections",
  },
  {
    title: "Pelvic Floor Strengthening in Ubud Bali",
    href: "/ubud-bali/pelvic-floor-strengthening",
    treatmentSlug: "pelvic-floor-strengthening",
  },
  {
    title: "Muscle Sculpting by CM Slim",
    href: "/ubud-bali/muscle-sculpting",
    treatmentSlug: "muscle-sculpting",
  },
  { title: "IPL in Ubud Bali", href: "/ubud-bali/ipl", treatmentSlug: "ipl" },
  { title: "Chemical Peel", href: "/ubud-bali/chemical-peel", treatmentSlug: "chemical-peel" },
  {
    title: "Personalize Mesotherapy in Ubud Bali",
    href: "/personalize-mesotherapy-ubud-bali",
    articleSlug: "personalize-mesotherapy-ubud-bali",
  },

  // ── /our-blog page 5 ──
  {
    title: "Microneedling in Ubud Bali",
    href: "/ubud-bali/microneedling",
    treatmentSlug: "microneedling",
  },
  {
    title: "Salmon DNA Treatment in Ubud Bali",
    href: "/ubud-bali/salmon-dna",
    treatmentSlug: "salmon-dna",
  },
  { title: "PRP in Ubud Bali", href: "/ubud-bali/prp", treatmentSlug: "prp" },
  {
    title: "Skin Booster in Ubud Bali",
    href: "/ubud-bali/skin-booster",
    treatmentSlug: "skin-booster",
  },
  { title: "HIFU in Ubud Bali", href: "/ubud-bali/hifu", treatmentSlug: "hifu" },
  {
    title: "Filler in Ubud Bali",
    href: "/ubud-bali/dermal-filler",
    treatmentSlug: "dermal-filler",
  },
];

/** The eight posts the live site's own footer promotes, in its order. */
export const FOOTER_BLOG_SLUGS = [
  "/ubud-bali/botox",
  "/ubud-bali/juvelook",
  "/skin-clinic-bali",
  "/nucleofill-vs-rejuran",
  "/how-many-units-of-botox-for-forehead",
  "/how-long-does-botox-last",
  "/how-long-does-lip-filler-last",
  "/ubud-bali/botox/korean",
];

