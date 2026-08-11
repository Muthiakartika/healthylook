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
      "/images/results/botox/10.webp",
      "/images/results/botox/11.webp",
      "/images/results/botox/12.webp",
      "/images/results/botox/13.webp",
      "/images/results/botox/14.webp",
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
      "/images/results/dermal-filler/09.jpg",
      "/images/results/dermal-filler/10.jpg",
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
];

export const totalResults = resultGroups.reduce((n, g) => n + g.images.length, 0);
