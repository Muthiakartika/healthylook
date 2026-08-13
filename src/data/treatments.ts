// Treatment catalogue for the whole site: this one file drives the header's
// mega-menu, the homepage's category tabs, the treatments index, and the
// treatment detail route.
//
// ── SOURCE OF TRUTH ────────────────────────────────────────────────────
// Every treatment below — its name, its slug, its category, and its
// description — was taken directly from healthylook-aesthetic.com's own
// navigation and treatment pages. Nothing here is invented.
//
// The earlier version of this file carried 12 treatments with descriptions
// written for the rebuild. That was wrong on both counts: the live site
// offers 30+ treatments, and its own copy already existed. This file now
// mirrors the real site.
//
// `slug` is the live site's real path segment under /ubud-bali/, including
// the nested ones (botox/korean, hifu/body, prp/hair, microneedling/rf,
// facial/medi). Keeping the real paths means the redesign doesn't break
// any existing inbound link or search ranking — the brief's SEO rule.

export type TreatmentCategoryId =
  | "facial-enhancement"
  | "skin-treatments"
  | "body-treatments"
  | "hair-booster";

export type TreatmentCategoryMeta = {
  id: TreatmentCategoryId;
  label: string;
  /** Real photo from the live site, or null where the site has none. */
  image: string | null;
};

export const TREATMENT_CATEGORIES: TreatmentCategoryMeta[] = [
  {
    id: "facial-enhancement",
    label: "Facial Enhancement",
    image: "/images/categories/facial-enhancement.jpg",
  },
  {
    id: "skin-treatments",
    label: "Skin Treatments",
    image: "/images/categories/skin-treatments.jpg",
  },
  {
    id: "body-treatments",
    label: "Body Treatments",
    image: "/images/categories/body-treatments.jpg",
  },
  // The live site has no dedicated photo for this category; rather than
  // substitute an unrelated stock-looking image, the category renders
  // without one and the layout adapts.
  { id: "hair-booster", label: "Hair & Booster", image: null },
];

export type PriceRow = {
  label: string;
  /** IDR, integer. `null` where the live site says "By Consultation". */
  price: number | null;
  unit?: string;
};

export type PriceGroup = {
  title?: string;
  rows: PriceRow[];
  note?: string;
};

// FAQs are NOT stored here — see src/data/treatmentFaqs.ts. They were
// originally four hand-written Botox questions; the live site actually
// carries 184 of them across 25 treatments, so they now live in their own
// generated file keyed by these slugs.

export type Treatment = {
  /** Real path segment under /ubud-bali/ on the live site. */
  slug: string;
  /**
   * Full live URL path, for the one treatment whose page is NOT under
   * /ubud-bali/. Eye Rejuvenation sits at the site root as
   * `/eye-rejuvenaton-treatment/` — misspelling and all — and that is the
   * URL the live site's own canonical tag points at, so it is the URL the
   * rebuild has to keep. Set this and `treatmentHref` uses it verbatim;
   * leave it off and the treatment resolves to /ubud-bali/<slug> as normal.
   */
  path?: string;
  /**
   * The catalogue name. Used everywhere the treatment is REFERRED to —
   * the mega-menu, the homepage tabs, the /ubud-bali index, related-
   * treatment cards, breadcrumbs. Kept short for exactly that reason.
   */
  name: string;
  /**
   * The live page's own <h1>, which is not the same string as `name` and
   * should not be.
   *
   * The clinic writes its headings for search — "Affordable Botox in Ubud
   * Bali", "Rediscover Radiance with Profhilo in Ubud", "Unlock the Power
   * of Stem Cell Exosome in Ubud Bali" — and those are the phrases the
   * pages currently rank on. The rebuild was rendering `name` as the h1,
   * which quietly dropped every one of them.
   *
   * They are a separate field rather than a replacement for `name`
   * because the live site separates them too: its nav says "Botox" while
   * its heading says "Affordable Botox in Ubud Bali". Collapsing the two
   * would put a 30-character SEO phrase into a nav column and a
   * breadcrumb.
   *
   * Falls back to `name` if unset — see TreatmentDetail.
   */
  h1?: string;
  category: TreatmentCategoryId;
  /** Verbatim from the live site's treatments page. */
  shortDescription: string;
  /**
   * How long the appointment takes, verbatim from the "Treatment Time" line
   * the live site prints on every card of its /ubud-bali/ index — including
   * its own phrasing ("45 Minutes/area", "Varied based on area").
   *
   * Undefined for the five treatments whose pages exist on the live site but
   * are missing from that index (collagen-stimulator, lip-filler,
   * botox/korean, facial, slimming-body-contouring). The clinic publishes no
   * time for those, so the rebuild states none rather than estimating one.
   */
  treatmentTime?: string;
  /**
   * ── CLIENT REVISION (Treatments 2) ──────────────────────────────────
   * "Please add these information in At Glance Section: Anasthesia,
   * Downtime, Initial result, Full result."
   *
   * ⚠ THESE ARE EMPTY ON PURPOSE, AND THE CLINIC HAS TO FILL THEM.
   *
   * The section renders each one only when it has a value, exactly like
   * `treatmentTime` above — so the four fields are live and the moment a
   * value lands here it appears on the page. What is NOT here is invented
   * values, and that is deliberate:
   *
   *  - The live site does not publish this as structured data. It was
   *    checked: /ubud-bali/botox has no At-a-Glance box, and the facts
   *    exist only scattered through FAQ prose on some treatments.
   *  - Anaesthesia and downtime are clinical statements. "Topical numbing
   *    cream" versus "no anaesthesia", or "no downtime" versus "24 hours
   *    of redness", is the difference between a patient planning their
   *    trip correctly and being caught out by it — and between the clinic
   *    keeping a promise and breaking one.
   *  - Deriving them from FAQ sentences would be my reading of the
   *    clinic's prose presented as the clinic's own specification. Some
   *    are unambiguous ("There is no downtime with HIFU"); most are not,
   *    and 32 treatments × 4 fields is a lot of places to be quietly
   *    wrong on a medical page.
   *
   * Ask the clinic for the four values per treatment and paste them in.
   * Free text, not enums — "None", "Topical numbing cream", "3–5 days",
   * "2 weeks", "Immediately" are all fine, and the clinic's own phrasing
   * is what should appear.
   */
  anaesthesia?: string;
  downtime?: string;
  initialResult?: string;
  fullResult?: string;
  /** Real photo where the live site has one for this treatment. */
  image?: string;
  /**
   * The headline "From" price, in IDR — taken from the live site's own
   * /ubud-bali/ index card for this treatment, because that card is the
   * same surface this field feeds (index cards, hero, related-treatment
   * strips).
   *
   * ⚠ This is NOT always the cheapest row in `priceGroups`. The live site
   * disagrees with itself on seven treatments — its HIFU card says "From
   * IDR 1.900 K" while its own HIFU table starts at 1.250.000; its PRP Hair
   * card says 2.400 K while the Hair Regeneration table starts at 2.500.000
   * (also ipl, chemical-peel, facial/medi, fat-cellulite, hair-mesotherapy).
   * The rebuild used to derive this from the table minimum, which is why
   * those seven read differently from the live site. They now match the
   * live cards. Where a card price sits BELOW everything in the table, that
   * is the clinic's published figure to correct, not a bug in this file.
   */
  startingPrice?: number;
  priceUnit?: string;
  priceGroups?: PriceGroup[];
  /** Longer authored copy — only where the live site actually has it. */
  intro?: string;
  popularAreas?: string[];
  /**
   * The live site's own heading for the `popularAreas` list, where it has
   * one — "Popular areas treated with botox", "Popular areas treated with
   * dermal filler in Ubud Bali". It differs per treatment because the
   * clinic writes it per treatment.
   *
   * Only Botox and Dermal Filler publish a heading for this list; the four
   * other treatments with `popularAreas` present theirs without one, so
   * they fall back to the detail page's generic label.
   */
  popularAreasTitle?: string;
};

export const treatments: Treatment[] = [
  // ──────────────── FACIAL ENHANCEMENT ────────────────
  {
    slug: "botox",
    name: "Botox",
    h1: "Affordable Botox in Ubud Bali",
    treatmentTime: "15 Minutes",
    category: "facial-enhancement",
    initialResult: "Within 3 days",
    fullResult: "After 2 weeks",
    shortDescription:
      "A quick and effective treatment to smooth the dynamic wrinkles, slim the face, treat bruxism, and contour the specific area of the body.",
    image: "/images/treatments/live-botox.jpg",
    startingPrice: 60000,
    priceUnit: "per unit",
    priceGroups: [
      {
        title: "Injectables — Botox",
        rows: [
          { label: "Botox by Allergan (USA)", price: 95000, unit: "/unit" },
          { label: "Xeomin (Germany)", price: 89000, unit: "/unit" },
          { label: "Nabota (Korea)", price: 60000, unit: "/unit" },
        ],
        note: "15% off min 40 units or 10% off min 30 units",
      },
    ],
    // Was 80 words of copy written for the rebuild ("one of the most
    // researched treatments in aesthetic medicine…") that appears nowhere on
    // the live site. This is the clinic's own "What is A Botox" paragraph.
    intro:
      "Botox is a purified neurotoxin derived from the Clostridium botulinum bacterium. During a Botox injection, the product is carefully administered into targeted muscles to temporarily reduce muscle activity, helping smooth dynamic wrinkles. It is also used to slim the face (V-shape), treat bruxism and excessive sweating, and contour specific areas of the body.",
    // All 13 entries, in the live site's order and its own wording. The
    // rebuild had 10, renamed ("Jaw slimming (V-line)" for "Botox Jaw
    // Reduction (V shaped face)") and with shoulder and calf slimming
    // collapsed into one line, dropping "More Define Jawline" and
    // "Cobblestoned chin" entirely.
    popularAreasTitle: "Popular areas treated with botox",
    popularAreas: [
      "Botox Frown lines",
      "Botox Forehead wrinkles",
      "Botox Crow's feet",
      "Botox Jaw Reduction (V shaped face)",
      "Botox Gummy Smile",
      "Botox Bunny Lines",
      "Botox for Lip Flip",
      "Botox for More Define Jawline",
      "Botox Shoulder Slimming",
      "Botox Hyperhidrosis (excessive sweating)",
      "Botox Calf Slimming",
      "Eyebrow lift",
      "Cobblestoned chin",
    ],
  },
  {
    slug: "dermal-filler",
    name: "Dermal Filler",
    h1: "Dermal Filler in Ubud Bali",
    treatmentTime: "60-90 Minutes",
    category: "facial-enhancement",
    anaesthesia: "Numbing cream, plus lidocaine in the product",
    downtime: "Bruising and swelling can occur",
    initialResult: "Instant",
    shortDescription:
      "A minimally invasive treatment to replace the volume loss due to aging or enhance your appearance. With instantly visible results, derma filler is a popular choice that will help you look and feel your best.",
    image: "/images/treatments/live-dermal-filler.jpg",
    startingPrice: 2500000,
    priceUnit: "per ml",
    priceGroups: [
      {
        title: "USA & Europe (per ml)",
        rows: [
          { label: "Teosyal Redensity II", price: 4500000 },
          { label: "Juvederm Ultra Plus", price: 4000000 },
          { label: "Juvederm Volbella", price: 4250000 },
          { label: "Juvederm Volift", price: 4350000 },
          { label: "Juvederm Voluma", price: 4500000 },
          { label: "Juvederm Volux", price: 4900000 },
          { label: "Restylane Kysse", price: 4500000 },
          { label: "Restylane Defyne", price: 4500000 },
          { label: "Restylane Volyme", price: 4700000 },
          { label: "Restylane Lyft", price: 4900000 },
        ],
      },
      {
        title: "Korea (per ml)",
        rows: [
          { label: "Premium Korean Filler (Soft)", price: 2500000 },
          { label: "Premium Korean Filler (Medium)", price: 2500000 },
          { label: "Premium Korean Filler (Hard)", price: 2950000 },
        ],
      },
    ],
    // "Popular areas treated with dermal filler in Ubud Bali" — the live
    // page carries this list and the rebuild had dropped it. Botox and
    // Dermal Filler are the only two treatments the live site gives an
    // explicit areas list to; the rest describe their areas in prose, which
    // is why no other entry has this field.
    popularAreasTitle: "Popular areas treated with dermal filler in Ubud Bali",
    popularAreas: [
      "Cheek",
      "Lip",
      "Tear trough, or undereye area",
      "Temples",
      "Nasolabial folds, or laugh lines",
      "Marionette lines",
      "Chin",
      "Jawline",
      "Hand",
    ],
  },
  {
    slug: "hifu",
    name: "HIFU",
    h1: "Advanced HIFU in Ubud Bali",
    treatmentTime: "30-45 Minutes",
    category: "facial-enhancement",
    downtime: "None",
    initialResult: "Immediately (partial)",
    fullResult: "After 4 weeks",
    shortDescription:
      "A non-surgical face lifting and neck tightening using HIFU waves that target different layers below the skin to stimulate collagen, remove excess fats, and contract the SMAS layer.",
    image: "/images/treatments/live-hifu.jpg",
    startingPrice: 1900000,
    priceGroups: [
      {
        title: "Non-Invasive — Linear HIFU",
        rows: [
          { label: "Brow Lifting", price: 1250000 },
          { label: "Upper face", price: 1500000 },
          { label: "Double Chin", price: 2000000 },
          { label: "Neck", price: 1900000 },
          { label: "Lower face", price: 3900000 },
          { label: "Middle & Lower face", price: 4500000 },
          { label: "Full Face", price: 5500000 },
          { label: "VShape Perfection (Lower Face + double chin)", price: 5500000 },
        ],
      },
    ],
  },
  {
    slug: "collagen-stimulator",
    name: "Collagen Stimulator",
    h1: "Collagen Stimulator in Bali",
    category: "facial-enhancement",
    downtime: "Minimal",
    initialResult: "Over the following weeks",
    fullResult: "After 1–2 months",
    image: "/images/treatments/collagen-stimulator.jpg",
    shortDescription:
      "Stimulate your skin's own collagen production for a gradual, natural lift that keeps improving over the weeks following treatment.",
    // No `image`: the only Sculptra asset in the client's library is a
    // 250×250 product logo, and stretching a logo into a 4:3 photo frame
    // looks broken. Falls back to the category photograph instead — see
    // the fallback chain in the treatment detail route.
    startingPrice: 5500000,
    priceGroups: [
      {
        title: "Collagen Stimulator",
        rows: [
          { label: "Gouri 1 ml for Liquid Lifting", price: 5500000 },
          { label: "Novuma 1.5 ml (Collagen Stimulating Dermal Filler)", price: 6900000 },
          { label: "Novuma 1.5 ml with 1 ml Skin Booster", price: 9800000 },
          { label: "Sculptra 1 vial", price: 7900000 },
          { label: "Sculptra 2 vials", price: 14900000 },
        ],
      },
    ],
  },
  {
    slug: "sculptra",
    name: "Sculptra",
    h1: "Sculptra in Bali",
    treatmentTime: "90-120 Minutes",
    category: "facial-enhancement",
    downtime: "Minimal, resolves within a few days to one week",
    initialResult: "Around 4 to 6 weeks",
    image: "/images/treatments/sculptra-treatment.jpg",
    shortDescription:
      "Stimulate natural collagen production with advanced Sculptra treatments in Bali. Achieve firmer, smoother, youthful-looking skin with long-lasting result",
    // See the Collagen Stimulator note above — the Sculptra asset is a
    // product logo, not a photograph.
    startingPrice: 7900000,
    priceGroups: [
      {
        rows: [
          { label: "Sculptra 1 vial", price: 7900000 },
          { label: "Sculptra 2 vials", price: 14900000 },
        ],
      },
    ],
  },
  // ── Lip Filler and Korean Botox are live pages that the live site's own
  //    mega-menu happens to omit, even though its footer lists both under
  //    "Popular Treatments". They are restored here in full: the URLs are
  //    the live ones, so nothing about existing links or rankings changes,
  //    and a visitor looking for lip filler now finds it in the nav instead
  //    of only in the footer.
  {
    slug: "lip-filler",
    name: "Lip Filler",
    h1: "Premium Lip Fillers in Ubud Bali",
    category: "facial-enhancement",
    anaesthesia: "Numbing cream",
    downtime: "Minimal",
    image: "/images/treatments/live-lip-filler.jpg",
    shortDescription:
      "Enhance your lips with premium lip fillers in Ubud, Bali. Achieve fuller, natural-looking lips with expert, safe treatments.",
    intro:
      "Luscious lips are a symbol of beauty and confidence, and at Healthy Look Aesthetic in Ubud, Bali, we specialize in enhancing your natural beauty with premium lip filler treatments. Using premium hyaluronic acid fillers such as Restylane Kysse, Juvederm Ultra Plus, Juvederm Volbella, Juvederm Volift, as well as premium Korean fillers, we offer safe and effective solutions for enhancing lip volume, shape, definition, and symmetry while maintaining natural-looking results.",
    popularAreas: [
      "Lip volume",
      "Lip shape and definition",
      "Lip symmetry",
      "Russian lip",
      "Lip hydration (lip booster)",
      "Fine lines around the lips",
    ],
  },
  {
    slug: "botox/korean",
    name: "Korean Botox",
    h1: "Korean Botox in Bali",
    category: "facial-enhancement",
    initialResult: "Within 3 to 5 days",
    fullResult: "After 10 to 14 days",
    image: "/images/treatments/korean-botox.jpg",
    shortDescription:
      "Trusted Korean Botox provider in Bali, offering safe and professional treatments with certified experts. Achieve natural, youthful results.",
    intro:
      "Korean Botox offers a range of benefits comparable to its American counterparts. It smooths dynamic wrinkles, contours the face, relieves teeth grinding, and reduces hyperhidrosis with more affordable price. Among the available Korean botulinum toxin brands, Nabota and Letybo are the legally approved options in Indonesia.",
    startingPrice: 60000,
    priceUnit: "per unit",
    priceGroups: [
      {
        title: "Korean botulinum toxin",
        rows: [{ label: "Nabota (Korea)", price: 60000, unit: "/unit" }],
        note: "Discount is available for purchasing more than 30 units",
      },
    ],
    popularAreas: [
      "Forehead lines",
      "Frown lines",
      "Crow's feet",
      "Jawline slimming",
      "Teeth grinding (bruxism)",
      "Excessive sweating (hyperhidrosis)",
    ],
  },

  // ──────────────── SKIN TREATMENTS ────────────────
  // ── CLIENT REVISION 7: "Eye Rejuvenation is not part of facial
  //    enhancement, it's part of the skin treatments."
  //
  //    Moved here from Facial Enhancement, which also settles a
  //    long-standing inconsistency in the source material: the live site
  //    files this treatment's price rows under "EYE TREATMENT" inside its
  //    skin pricing, and its own /ubud-bali index lists "Eye Treatment"
  //    among the Skin Treatments — so the clinic already categorised it
  //    this way everywhere except the page's own breadcrumb.
  //
  //    Only the CATEGORY changes. The URL does not: it stays at the site
  //    root as /eye-rejuvenaton-treatment (misspelling and all), because
  //    that is what the live site's canonical tag points at and moving it
  //    would break every inbound link and ranking the page has. See the
  //    `path` field's note.
  //
  //    Eye Rejuvenation was missing from the rebuild entirely at one point,
  //    even though the live site has a full page for it and lists it in the
  //    footer's "Popular Treatments".
  {
    slug: "eye-rejuvenation",
    path: "/eye-rejuvenaton-treatment",
    name: "Eye Rejuvenation",
    h1: "Eye Rejuvenation Treatment in Ubud Bali",
    treatmentTime: "60 Minutes",
    category: "skin-treatments",
    image: "/images/treatments/eye-rejuvenation.jpg",
    shortDescription:
      "Personalized treatments for the eye area, from dark circles and tired-looking eyes to fine lines and under-eye hollow.",
    startingPrice: 1900000,
    priceGroups: [
      {
        title: "Eye Treatment",
        rows: [
          { label: "Vitaran Polynucleotide (1 ml)", price: 2900000 },
          { label: "Under Eye's Collagen Stimulator", price: 2900000 },
          { label: "Rejuran I Polynucleotide (1 ml)", price: 3500000 },
          { label: "Under Eye Filler with Teosyal Redensity II", price: 4200000 },
          { label: "Plinest Fast (2 ml)", price: 4900000 },
        ],
      },
    ],
    intro:
      "The eyes are often regarded as the focal point of the face, being described as the window to the soul and the most expressive feature. However, they are also susceptible to showing the earliest signs of aging. At Healthy Look Aesthetic in Ubud Bali, we recognize the significance of rejuvenating the eye area, offering personalized treatments tailored to address a range of concerns, from dark circles and tired-looking eyes to fine lines and under-eye hollow.",
  },
  {
    slug: "facial",
    name: "Facial",
    h1: "Best Facial Experience in Ubud",
    category: "skin-treatments",
    image: "/images/treatments/facial.jpg",
    shortDescription:
      "Experience the best facial in Ubud with expert acne treatment and anti-aging facials for healthy, glowing skin.",
    intro:
      "Situated in the heart of Ubud, Bali, Healthy Look Aesthetic offers professional facial treatments for various skin concerns, including acne, dull skin, signs of aging, dryness, and loss of firmness. Beyond just pampering, our facial services focus on personalized methods to support healthier-looking skin. We use well-known skincare brands such as Dermalogica, Tegoder, and Casmara, combined with modern aesthetic technology and handled by trained therapist who follow clear treatment standards. Each facial session also includes signature massage techniques to enhance comfort and relaxation.",
    popularAreas: [
      "Acne-prone skin",
      "Dull skin",
      "Signs of aging",
      "Dryness",
      "Loss of firmness",
    ],
  },
  {
    slug: "microneedling/rf",
    name: "Sylfirm X - RF Microneedling",
    h1: "Sylfirm X in Bali",
    treatmentTime: "60-90 Minutes",
    category: "skin-treatments",
    anaesthesia: "Numbing cream available",
    downtime: "None to very mild",
    initialResult: "After one session",
    fullResult: "Within 4–6 weeks",
    shortDescription:
      "This procedure targets skin rejuvenation, vascular issues, pigmentation, sagging skin, and scars.",
    image: "/images/treatments/live-microneedling-rf.jpg",
    startingPrice: 4500000,
    priceGroups: [
      {
        title: "Sylfirm X (FDA Approved RF Microneedling)",
        rows: [
          { label: "Face", price: 4500000 },
          { label: "Neck & Decolettage", price: 4500000 },
          { label: "Face & Neck", price: 5500000 },
          { label: "Body", price: 5500000 },
          { label: "Face, Neck, & Decolettage", price: 6900000 },
          { label: "Face with Exosome", price: 6900000 },
          { label: "Face & Neck with Exosome", price: 7900000 },
          { label: "Face, Neck, & Decolettage with Exosome", price: 8900000 },
        ],
        note: "Includes free personalized serum according to skin condition",
      },
    ],
  },
  {
    slug: "skin-booster",
    name: "Skin Booster",
    h1: "Skin Booster in Ubud Bali",
    treatmentTime: "60 Minutes",
    category: "skin-treatments",
    anaesthesia: "Numbing cream, 30 minutes",
    fullResult: "Within 2 weeks",
    shortDescription:
      "An ideal solution to boost your skin hydration and give a youthful look by delivering a microinjection of hyaluronic acid that is naturally found in our skin.",
    image: "/images/treatments/live-skin-booster.jpg",
    startingPrice: 3200000,
    priceGroups: [
      {
        title: "Injectables — Skin Booster",
        rows: [
          { label: "Neauvia 2.5 ml", price: 3200000 },
          { label: "Channel Injection — NCTF 135 HA (3 ml)", price: 3500000 },
          { label: "Cell Booster Glow", price: 3500000 },
          { label: "Restylane Vital Light 1 ml", price: 3900000 },
          { label: "INNO Moist 3 ml", price: 3500000 },
          { label: "INNO Bidens 3 ml", price: 3900000 },
          { label: "Skinvive by Juvederm 1 ml", price: 3500000 },
          { label: "Revox 50 2 ml", price: 4900000 },
          { label: "Xelarederm 2 ml", price: 5500000 },
          { label: "Profhilo 2 ml/syr", price: 6900000 },
          { label: "Profhilo 2 ml/2 syr", price: 12900000 },
        ],
      },
    ],
  },
  {
    slug: "profhilo",
    name: "Profhilo",
    h1: "Rediscover Radiance with Profhilo in Ubud",
    treatmentTime: "60 Minutes",
    category: "skin-treatments",
    anaesthesia: "Painless",
    downtime: "Minimal",
    shortDescription:
      "A revolutionary treatment that contains the highest concentrations of hyaluronic acid on the market to deliver intense hydration and stimulates collagen and elastin production for a youthful appearance.",
    // Restored from the live page's opening paragraph.
    intro:
      "Profhilo is a revolutionary skin treatment that has taken the beauty world by storm, and now it's available in the enchanting town of Ubud! It contains the highest concentrations of hyaluronic acid on the market, making it superior to deliver intense hydration and stimulates collagen and elastin production for youthful appearance. It also helps to remodel aging and sagging tissue.",
    image: "/images/treatments/live-profhilo.jpg",
    startingPrice: 6900000,
    priceGroups: [
      {
        rows: [
          { label: "Profhilo 2 ml/syr", price: 6900000 },
          { label: "Profhilo 2 ml/2 syr", price: 12900000 },
        ],
      },
      {
        title: "Adipose Tissue Restoration",
        rows: [{ label: "Profhilo Structura 2 ml", price: 7900000 }],
      },
    ],
  },
  {
    slug: "prp",
    name: "PRP Vampire Facial",
    h1: "PRP in Ubud Bali",
    treatmentTime: "90 Minutes",
    category: "skin-treatments",
    anaesthesia: "Topical anaesthetic",
    downtime: "Under 24 hours with our signature PRP",
    shortDescription:
      "A natural treatment that utilizes your own body's healing abilities to stimulate collagen production. PRP secrete at least 7 different growth factors which is beneficial for tissue healing & repair.",
    image: "/images/treatments/live-prp.jpg",
    startingPrice: 2400000,
    priceGroups: [
      {
        title: "PRP (Vampire Facial)",
        rows: [
          { label: "Pure PRP (included under eyes)", price: 2400000 },
          { label: "PRP with Salmon DNA Serum", price: 2900000 },
          { label: "PRP with Stem Cell Derivative", price: 4500000 },
          { label: "PRP with Sylfirm X (more effective, less downtime)", price: 4900000 },
          { label: "Add on Pure PRP for Neck", price: 1000000 },
          { label: "Add on Pure PRP for Decolette", price: 1000000 },
        ],
        note: "Includes microneedling & injection",
      },
    ],
  },
  {
    slug: "juvelook",
    name: "Juvelook Collagen Stimulator",
    h1: "Juvelook Treatment in Bali",
    treatmentTime: "75 Minutes",
    category: "skin-treatments",
    anaesthesia: "Numbing cream",
    downtime: "Minimal, redness subsides within a few days",
    initialResult: "Within a week",
    shortDescription: "It targets acne scars, enlarged pores, wrinkles, & dullness",
    // Restored from the live page's opening paragraph.
    intro:
      "Looking for a revolutionary way to rejuvenate your skin and stimulate collagen production? Healthy Look Aesthetic in Bali proudly offers Juvelook treatment to achieve firmer, plumper, and more youthful skin. As one of the early adopters of Juvelook in Indonesia, Healthy Look Aesthetic ensures you receive world-class care and the latest in aesthetic technology. With doctors trained directly in South Korea, the clinic ensures precision and excellence in delivering this procedure.",
    image: "/images/treatments/live-juvelook.jpg",
    startingPrice: 4500000,
    priceGroups: [
      {
        rows: [
          { label: "Juvelook for Face", price: 4500000 },
          { label: "Juvelook for Neck", price: 4500000 },
          { label: "Juvelook for Face & Neck", price: 7900000 },
        ],
      },
    ],
  },
  {
    slug: "salmon-dna",
    name: "Salmon DNA",
    h1: "Salmon DNA Treatment in Ubud Bali",
    treatmentTime: "60 Minutes",
    category: "skin-treatments",
    anaesthesia: "Numbing cream, 30 minutes",
    downtime: "Minor marks or redness for 3–7 days",
    initialResult: "After the first session",
    image: "/images/treatments/salmon-dna.jpg",
    shortDescription:
      "Salmon DNA contains a Polynucleotide substance extracted from salmon DNA that is compatible with our human cells to repair damaged skin, reverse the signs of aging, and decrease inflammation",
    // plinest.png is a 250×250 product logo, not treatment photography —
    // falls back to the Skin Treatments category photograph.
    startingPrice: 3500000,
    priceGroups: [
      {
        title: "Premium Polynucleotide — Salmon DNA",
        rows: [
          { label: "Rejuran S for Scar 1 ml", price: 3500000 },
          { label: "Vitaran 2 ml", price: 3900000 },
          { label: "Rejuran HB Plus 1 ml (with lidocaine & HA)", price: 3900000 },
          { label: "Rejuran HB Plus 2 ml", price: 7500000 },
          { label: "Nucleofill strong 1.5 ml", price: 4500000 },
          { label: "Rejuran Healer", price: 5500000 },
        ],
      },
      {
        title: "Premium Polynucleotide — Trout DNA",
        rows: [
          { label: "Plinest Fast 2 ml", price: 4900000 },
          { label: "Plinest 2 ml", price: 6900000 },
          { label: "Newest 2 ml", price: 7500000 },
        ],
      },
    ],
  },
  {
    slug: "exosome",
    name: "Exosome - Stem Cell Derivative",
    h1: "Unlock the Power of Stem Cell Exosome in Ubud Bali",
    treatmentTime: "75 Minutes",
    category: "skin-treatments",
    initialResult: "2–3 days",
    fullResult: "After 3–5 sessions",
    shortDescription:
      "A new generation of skin boosters using the world's first pure, stem cell-derived exosome for skin rejuvenation, pore reducer, and anti-inflammation.",
    image: "/images/treatments/live-exosome.jpg",
    startingPrice: 4900000,
    priceGroups: [
      { rows: [{ label: "ASCE+ Derma Signal SRLV", price: 4900000 }] },
    ],
  },
  {
    slug: "microneedling",
    name: "Microneedling - Dermapen 4",
    h1: "Microneedling in Ubud Bali",
    treatmentTime: "75 Minutes",
    category: "skin-treatments",
    anaesthesia: "Topical anaesthetic cream, 30 minutes",
    initialResult: "After the first session",
    image: "/images/treatments/microneedling.jpg",
    shortDescription:
      "The most advanced micro-needling device that allows more effective channels to deliver up to 80% more active ingredients deeper into the skin.",
    startingPrice: 1900000,
    priceGroups: [
      {
        title: "Microneedling with Dermapen-4",
        rows: [
          { label: "Bright & Glow", price: 1900000 },
          { label: "Enlarged Pores & Scar", price: 1900000 },
          { label: "Anti Aging", price: 1900000 },
          { label: "Salmon DNA", price: 2500000 },
          { label: "Stretch Mark", price: null },
          { label: "Add on Neck", price: 800000 },
          { label: "Add on Decolettage", price: 800000 },
        ],
      },
    ],
  },
  {
    slug: "facial/medi",
    name: "Medi Facial",
    h1: "Medi Facial in Ubud Bali",
    treatmentTime: "45-120 Minutes",
    category: "skin-treatments",
    downtime: "None",
    shortDescription:
      "Our medi facial is a combination of advanced technology, and high-quality products with a pampering experience to leave you feeling refreshed and revitalized with healthier skin.",
    image: "/images/treatments/live-facial-medi.jpg",
    startingPrice: 490000,
    priceGroups: [
      {
        title: "By Dermalogica",
        rows: [
          { label: "Acne & Blemish Facial (75 mins)", price: 850000 },
          { label: "Triple Action Acne Care (90 mins)", price: 1290000 },
          { label: "Luminous Facial (75 mins)", price: 850000 },
          { label: "Firming & Resurfacing Facial (90 mins)", price: 1190000 },
          { label: "Collagen Booster Facial (90 mins)", price: 1290000 },
          { label: "Ageless Radiance Facial (90 mins)", price: 1490000 },
        ],
      },
      {
        title: "Healthy Look's Signature",
        rows: [
          { label: "Bright Eye Care – Add On (30 mins)", price: 390000 },
          { label: "Glow and Go Facial (45 mins)", price: 590000 },
          { label: "Skin Prep Facial (60 mins)", price: 690000 },
          { label: "Calming Oxygen Facial (75 mins)", price: 850000 },
          { label: "Hydra Glow Facial (75 mins)", price: 850000 },
          { label: "Red Carpet Hydra Glow (90 mins)", price: 1290000 },
          { label: "Red Carpet Hydra Glow (Face & Neck) (90 mins)", price: 1680000 },
        ],
      },
      {
        title: "Body Series",
        rows: [
          { label: "Bootylicious (75 mins)", price: 1050000 },
          { label: "Backne Care (90 mins)", price: 1290000 },
        ],
      },
      {
        title: "Not The Ordinary Facial",
        rows: [
          { label: "Ultimate Radiance (90 mins)", price: 2590000 },
          { label: "Advanced Tightening Facial (90 mins)", price: 2590000 },
          { label: "Power Lift Facial (90 mins)", price: 4500000 },
        ],
      },
    ],
  },
  {
    slug: "chemical-peel",
    name: "Chemical Peeling",
    h1: "Chemical Peels in Ubud Bali",
    treatmentTime: "30 Minutes",
    category: "skin-treatments",
    downtime: "None, with mild scaling for 3–7 days",
    initialResult: "After the first session",
    shortDescription:
      "An old but goldie treatment to various reduce skin imperfections. At Healthy Look Aesthetic, we have an impressive selection of world-class peels, each working in a different way to combat various skin conditions",
    image: "/images/treatments/live-chemical-peel.jpg",
    startingPrice: 650000,
    priceGroups: [
      {
        title: "Chemical Peeling (Face Peeling)",
        rows: [
          { label: "Acne Recovery", price: 650000 },
          { label: "Pigmentation Fighters", price: 650000 },
          { label: "Texture Smoothing", price: 650000 },
          { label: "Korean Glass Skin", price: 650000 },
          { label: "Advanced Biostimulating TCA Peel", price: 950000 },
          { label: "Non Acid CO2 Carboxy Peel", price: 950000 },
        ],
      },
      {
        title: "Body Peeling (by Neostrata USA)",
        rows: [
          { label: "Under Arm", price: 390000 },
          { label: "Bikini Line", price: 490000 },
          { label: "Half Arm", price: 490000 },
          { label: "Chest", price: 490000 },
          { label: "Half Back", price: 590000 },
          { label: "Half Leg", price: 590000 },
          { label: "Buttock", price: 690000 },
          { label: "Full Arm", price: 690000 },
          { label: "Full Back", price: 990000 },
          { label: "Full Leg", price: 990000 },
          { label: "Full Body", price: 1990000 },
        ],
      },
    ],
  },
  {
    slug: "ipl",
    name: "IPL (Intense Pulsed Light)",
    h1: "IPL in Ubud Bali",
    treatmentTime: "30 Minutes",
    category: "skin-treatments",
    downtime: "None",
    shortDescription:
      "A non-invasive treatment that uses broad wavelength light to break down the unwanted blood vessels and/or pigment, reduce acne and inflammation. IPL treatment is quick and has no downtime",
    // Was falling back to the category photo while a real IPL photograph sat
    // unused in the repo — nothing referenced it at all.
    image: "/images/treatments/live-ipl.jpg",
    startingPrice: 790000,
    priceGroups: [
      {
        title: "Non-Invasive — IPL Photo-Glow",
        rows: [
          { label: "Acne", price: 790000 },
          { label: "Skin Rejuvenation", price: 790000 },
          { label: "Redness", price: 790000 },
          { label: "Add on Neck", price: 490000 },
          { label: "Add on Decolettage", price: 490000 },
        ],
      },
      {
        title: "IPL Body Rejuvenation",
        rows: [
          { label: "Under Arm", price: 290000 },
          { label: "Bikini Line", price: 390000 },
          { label: "Half Arm", price: 390000 },
          { label: "Chest", price: 490000 },
          { label: "Half Back", price: 590000 },
          { label: "Half Leg", price: 590000 },
          { label: "Buttock", price: 590000 },
          { label: "Full Arm", price: 690000 },
          { label: "Full Back", price: 990000 },
          { label: "Full Leg", price: 990000 },
        ],
      },
    ],
  },

  // ──────────────── BODY TREATMENTS ────────────────
  {
    slug: "fat-cellulite",
    name: "Lysiwave - Fat & Cellulite Treatment",
    h1: "Lysiwave in Bali",
    treatmentTime: "30-60 Minutes",
    category: "body-treatments",
    downtime: "None",
    initialResult: "Within 2–4 weeks",
    shortDescription:
      "An advanced non-invasive body contouring treatment to reduce cellulite and stubborn fat while improving skin firmness.",
    image: "/images/treatments/live-fat-cellulite.jpg",
    startingPrice: 2900000,
    priceGroups: [
      {
        title: "Lysiwave — Fat & Cellulite Reduction",
        rows: [
          { label: "Upper Arms", price: 1900000 },
          { label: "Bra Bulge", price: 1900000 },
          { label: "Love Handles", price: 1900000 },
          { label: "Upper & Lower Abs", price: 2900000 },
          { label: "Sexy Abs (Love Handle + Abs)", price: 3900000 },
          { label: "Butt", price: 3500000 },
          { label: "Outer Thigh", price: 2900000 },
          { label: "Inner Thigh", price: 3500000 },
          { label: "Full Thigh", price: 4900000 },
        ],
      },
    ],
  },
  {
    slug: "hifu/body",
    name: "Body HIFU",
    h1: "Advanced HIFU Body in Bali",
    treatmentTime: "30-90 Minutes",
    category: "body-treatments",
    initialResult: "Immediately (partial)",
    fullResult: "After 6–8 weeks",
    shortDescription:
      "This treatment targets stubborn fat, tightens skin, and stimulates collagen production for a toned, sculpted appearance.",
    // The real HIFU photograph, which the repo already had. The note that
    // used to sit here said the only candidate was the Body Treatments
    // category photo — that was true of the category images, but this file
    // is a genuine HIFU treatment photo living in /images/clinic/. It is
    // also the /our-doctor hero; different page, so no image repeats itself
    // within one view, which was the actual constraint.
    image: "/images/treatments/live-hifu-body.jpg",
    startingPrice: 1900000,
    priceGroups: [
      {
        title: "Body HIFU",
        rows: [
          { label: "Armpit Fat", price: 1900000 },
          { label: "Above the Knees", price: 2500000 },
          { label: "Bra Bulge", price: 3900000 },
          { label: "Under Butt", price: 3900000 },
          { label: "Love Handle", price: 5500000 },
          { label: "Upper Arm", price: 5500000 },
          { label: "Inner Thigh", price: 6900000 },
          { label: "Tank Top Ready (Armpit Fat + Upper Arm)", price: 6900000 },
          { label: "Lower Abs", price: 7900000 },
          { label: "Sexy Abs (Love Handle + Lower Abs)", price: 12500000 },
        ],
      },
    ],
  },
  {
    slug: "muscle-sculpting",
    name: "Muscle Sculpting by CM Slim",
    h1: "Body Sculpting in Ubud Bali",
    treatmentTime: "45 Minutes/area",
    category: "body-treatments",
    downtime: "None",
    initialResult: "After one 30-minute session",
    image: "/images/treatments/muscle-sculpting.jpg",
    shortDescription:
      "CM Slim is a worldwide technology for non-invasive body contouring using a focused electromagnetic. It is a painless and safe treatment that can produce up to 30,000 squats or crunches in 30 minutes without any downtime.",
    startingPrice: 1900000,
    priceGroups: [
      {
        title: "Muscle Sculpting by CM Slim",
        rows: [
          { label: "One Session per Area (Belly/Arm/Thigh/Brazilian Butt lift)", price: 1900000 },
          { label: "Package of 4 Sessions", price: 5900000 },
          { label: "Package of 6 Sessions", price: 8500000 },
          { label: "Package of 8 Sessions", price: 10900000 },
          { label: "Package of 12 Sessions", price: 15000000 },
          { label: "Package of 16 Sessions", price: 20000000 },
          { label: "Couple single Session (Belly)", price: 2900000 },
          { label: "Couple Package of 4 Sessions", price: 8900000 },
          { label: "Couple Package of 6 Sessions", price: 12500000 },
          { label: "Couple Package of 8 Sessions", price: 15900000 },
          { label: "Couple Package of 12 Sessions", price: 22500000 },
          { label: "Six Month Free Pass in One Area", price: 29900000 },
          { label: "One Year Free Pass in One Area", price: 55000000 },
        ],
      },
    ],
  },
  {
    slug: "pelvic-floor-strengthening",
    name: "Pelvic Floor Strengthening",
    h1: "Pelvic Floor Strengthening in Ubud Bali",
    treatmentTime: "45 Minutes",
    category: "body-treatments",
    initialResult: "After one session",
    image: "/images/treatments/pelvic-floor.jpg",
    shortDescription:
      "Strong pelvic floor muscles can help with urinary incontinence, increase sexual sensation, and reduce the symptoms of erectile dysfunction.",
    startingPrice: 1250000,
    priceGroups: [
      {
        title: "Pelvic Strengthening with HIPEX Chair",
        rows: [
          { label: "Single Session", price: 1250000 },
          { label: "Package of 4 Sessions", price: 3900000 },
          { label: "Package of 6 Sessions", price: 5500000 },
          { label: "Package of 8 Sessions", price: 6900000 },
          { label: "Package of 12 Sessions", price: 9900000 },
        ],
      },
    ],
  },
  {
    slug: "ipl-hair-removal",
    name: "IPL Hair Removal",
    h1: "Hair Removal in Ubud Bali",
    treatmentTime: "Varied based on area",
    category: "body-treatments",
    anaesthesia: "Not needed — contact cooling instead",
    initialResult: "3 weeks after the first session",
    fullResult: "After 4–8 sessions",
    image: "/images/treatments/ipl-hair-removal.jpg",
    shortDescription:
      "Tired of painful waxing and ingrown hairs? IPL hair removal offers a gentler, more effective way to reduce hair growth while helping keep your skin smooth and rejuvenated.",
    startingPrice: 290000,
    priceGroups: [
      {
        title: "IPL Hair Removal",
        rows: [
          { label: "Upper Lip", price: 290000 },
          { label: "Cheek", price: 350000 },
          { label: "Forehead", price: 290000 },
          { label: "Underarm", price: 350000 },
          { label: "Half Arm", price: 490000 },
          { label: "Full Face", price: 490000 },
          { label: "Full Arm", price: 790000 },
          { label: "Chest", price: 790000 },
          { label: "Shoulder", price: 590000 },
          { label: "Belly", price: 790000 },
          { label: "Bikini line", price: 490000 },
          { label: "Brazilian", price: 690000 },
          { label: "Half Back", price: 790000 },
          { label: "Half leg", price: 790000 },
          { label: "Back", price: 1190000 },
          { label: "Full leg", price: 1490000 },
        ],
      },
      {
        title: "Feminine Package",
        rows: [
          { label: "Upper Lip, Under Arm, Bikini", price: 990000 },
          { label: "Upper Lip, Under Arm, Brazilian", price: 1150000 },
          { label: "Under Arm, Bikini, Half Leg", price: 1390000 },
          { label: "Under Arm, Bikini, Full Leg", price: 1950000 },
          { label: "Underarm, Brazilian, Half Leg", price: 1550000 },
          { label: "Underarm, Brazilian, Full Leg", price: 2150000 },
        ],
      },
      {
        title: "Masculine Package",
        rows: [
          { label: "Chest, Belly, Half Back", price: 1890000 },
          { label: "Chest, Belly, Full Back", price: 2290000 },
          { label: "Chest, Shoulder, Half Back", price: 1750000 },
          { label: "Chest, Shoulder, Full Back", price: 2150000 },
          { label: "Chest, Shoulder, Belly, Half Back", price: 2390000 },
          { label: "Chest, Shoulder, Belly, Full Back", price: 2790000 },
        ],
      },
    ],
  },
  {
    slug: "fat-dissolving-injections",
    name: "Fat Dissolving Injections",
    h1: "Fat Dissolving Injections in Ubud Bali",
    treatmentTime: "30 Minutes",
    category: "body-treatments",
    anaesthesia: "Numbing cream",
    image: "/images/treatments/fat-dissolving.jpg",
    shortDescription:
      "Fat-dissolving injection is a non-surgical option to reduce unwanted fat deposits on your face & body like the double chin, abdomen, and thighs",
    startingPrice: 990000,
    priceGroups: [
      {
        title: "Fat Dissolving Injection (Mesolipolysis)",
        rows: [
          { label: "Plant Mesolipolysis", price: 990000, unit: "/8 ml" },
          { label: "Healthy Look's Signature Cocktail", price: 990000, unit: "/8 ml" },
          { label: "Antioxidant Mesolipolysis", price: 1490000, unit: "/10 ml" },
          { label: "Face Mesolipolysis", price: 1090000, unit: "/5 ml" },
        ],
      },
    ],
  },
  {
    slug: "carboxy-therapy",
    name: "Carboxy Therapy",
    h1: "Carboxy Therapy in Ubud Bali",
    treatmentTime: "45 Minutes",
    category: "body-treatments",
    initialResult: "Immediate",
    image: "/images/treatments/carboxy-therapy.jpg",
    shortDescription:
      "It stimulates collagen and elastin, enhancing texture, reducing cellulite, fading stretch marks, and promoting even skin tone.",
    startingPrice: 390000,
    priceGroups: [
      {
        title: "Carboxy Therapy",
        rows: [
          { label: "Under Arm", price: 390000 },
          { label: "Elbow & Knees", price: 690000 },
          { label: "Upper Arm", price: 690000 },
          { label: "Belly", price: 890000 },
          { label: "Buttock", price: 890000 },
          { label: "Thigh", price: 890000 },
          { label: "Back", price: 990000 },
        ],
      },
    ],
  },
  {
    slug: "slimming-body-contouring",
    name: "Slimming & Body Contouring",
    h1: "Holistic Slimming & Body Contouring in Ubud",
    category: "body-treatments",
    downtime: "None",
    image: "/images/treatments/live-slimming-body-contouring.jpg",
    shortDescription:
      "Achieve your ideal shape with slimming and body contouring treatments in Ubud, Bali. Safe, effective, affordable and with proven results.",
    intro:
      "Embark on a journey to wellness and aesthetic excellence in the heart of Ubud, Bali, where beauty is redefined through a holistic approach to slimming and body contouring. As one of the leading aesthetic centers in the region, we take pride in offering evidence-based solutions for those seeking to lose weight or sculpt their bodies effectively. Whether you're looking for a healthy weight loss journey or effective body sculpting grounded in evidence-based medicine, Healthy Look Aesthetic is committed to delivering sustainable results with our comprehensive modalities.",
    popularAreas: [
      "Personalized nutrition (Nutrigenomic)",
      "Muscle Sculpting by CM Slim",
      "Fat Dissolving Injections",
      "Slimming Infusion",
      "Lymphatic Drainage Massage",
      "Radiofrequency skin tightening",
    ],
  },

  // ──────────────── HAIR & BOOSTER ────────────────
  {
    slug: "autologues-micrograft-hair-restoration",
    name: "Autologues Micrograft Hair Restoration",
    h1: "Autologous Micrograft Hair Restoration in Bali",
    treatmentTime: "90 Minutes",
    category: "hair-booster",
    anaesthesia: "Local anaesthetic",
    downtime: "None",
    shortDescription:
      "Regrow your hair naturally in Bali with Autologous Micrograft Therapy — a one-time, non-surgical treatment using your own stem cells for thicker hair, no scarring, and fast recovery.",
    // Restored from the live page's opening paragraph.
    intro:
      "Introducing Autologous Micrograft Transfer (AMT) by Dermomine — a minimally invasive, single-session hair restoration procedure that uses your own stem cells and growth factors to stimulate hair regrowth. AMT harnesses the body’s natural ability to rejuvenate weakened hair follicles using a cell therapy method, with no downtime or major side effects. It’s safe, quick, and long-lasting — ideal for men and women looking for non-surgical solutions.",
    image: "/images/treatments/micrograft.jpg",
    startingPrice: 19500000,
    priceGroups: [
      { rows: [{ label: "Autologues Micrograft Hair Restoration", price: 19500000 }] },
    ],
  },
  {
    slug: "prp/hair",
    name: "PRP Hair",
    h1: "PRP Hair in Ubud Bali",
    treatmentTime: "90 Minutes",
    category: "hair-booster",
    anaesthesia: "Topical anaesthetic",
    downtime: "Minimal",
    initialResult: "Within 8 weeks",
    image: "/images/treatments/prp-hair.jpg",
    shortDescription:
      "A natural treatment that utilizes your own body's healing abilities to stimulate hair growth.",
    startingPrice: 2400000,
    priceGroups: [
      {
        title: "Hair Regeneration",
        rows: [
          { label: "Growth Factor Therapy", price: 2500000 },
          { label: "Pure PRP for Hair", price: 2500000 },
          { label: "PRP with award-winning GF", price: 3500000 },
          { label: "Stem Cell Derivative", price: 3900000 },
          { label: "PRP with Stem Cell Derivative", price: 4500000 },
          { label: "Exosome for Hair", price: 4900000 },
          { label: "Sylfirm X for Scalp with Exosome Hair", price: 6900000 },
        ],
      },
    ],
  },
  {
    slug: "hair-mesotherapy",
    name: "Hair Mesotherapy",
    h1: "Hair Mesotherapy in Ubud Bali",
    treatmentTime: "75 Minutes",
    category: "hair-booster",
    anaesthesia: "Topical anaesthetic",
    downtime: "Very minimal",
    image: "/images/treatments/hair-mesotherapy.jpg",
    shortDescription:
      "It provides essential nutrients like vitamins and antioxidants to improve blood flow for hair growth in both men & women.",
    startingPrice: 1900000,
    priceGroups: [
      {
        rows: [
          { label: "Growth Factor Therapy", price: 2500000 },
          { label: "Stem Cell Derivative", price: 3900000 },
        ],
      },
    ],
  },
  {
    slug: "iv-drip",
    name: "IV Drip",
    h1: "IV Drip in Ubud Bali",
    treatmentTime: "45 Minutes",
    category: "hair-booster",
    image: "/images/treatments/iv-drip.jpg",
    shortDescription:
      "It is beneficial to boost your energy, improve your skin radiance, or speed up the bali belly's recovery.",
    startingPrice: 1100000,
    priceGroups: [
      {
        title: "Booster",
        rows: [
          { label: "Immune Booster", price: 1100000 },
          { label: "Jet Lag Recovery", price: 1250000 },
          { label: "Ultimate Glow", price: 1250000 },
          { label: "Bali Belly Cure", price: 1500000 },
          { label: "Anti Aging", price: 1750000 },
          { label: "Myer's Cocktail", price: 1750000 },
        ],
      },
    ],
  },
];

export function getTreatmentBySlug(slug: string): Treatment | undefined {
  return treatments.find((treatment) => treatment.slug === slug);
}

export function getTreatmentsByCategory(category: TreatmentCategoryId): Treatment[] {
  return treatments.filter((treatment) => treatment.category === category);
}

/**
 * ── CLIENT REVISION 5 — WHAT THE HOMEPAGE SHOWS ───────────────────────
 * "For home page, i think just highlight the most popular one. […] Then
 * have 'Explore Our Treatments'."
 *
 * The client named sixteen treatments, and this array is that list in
 * their order, grouped by their categories. The homepage renders only
 * these; /ubud-bali still renders all of them. That split is the point of
 * the note — the homepage's job is to show enough range to be credible and
 * then hand off, not to be the catalogue.
 *
 * ── Why a list of slugs rather than a `popular: true` field ──
 * Two reasons. It keeps the client's ORDER, which a per-object boolean
 * would lose to the array's own ordering — and their order is not
 * alphabetical or price-based, it is what the clinic actually gets asked
 * for. And it puts the whole editorial decision in one place the client
 * can be walked through, instead of sixteen flags scattered across 1,000
 * lines.
 *
 * ⚠ Slugs, not names. "Sylfirm X" is `microneedling/rf` and "Lysiwave" is
 * `fat-cellulite` on the live site — the marketing name and the URL segment
 * differ for several of these. `getPopularTreatments` drops anything that
 * does not resolve, so a typo here means a missing row, never a crash.
 */
export const HOME_POPULAR_SLUGS: string[] = [
  // Facial Enhancement
  "botox",
  "dermal-filler",
  "sculptra",
  "collagen-stimulator",
  "hifu",
  // Skin Treatments
  "microneedling/rf", // Sylfirm X
  "profhilo",
  "skin-booster",
  "juvelook",
  "exosome",
  "salmon-dna",
  // Body Treatments
  "fat-cellulite", // Lysiwave
  "hifu/body",
  "muscle-sculpting",
  // Hair & Booster
  "autologues-micrograft-hair-restoration",
  "prp/hair",
];

/**
 * The homepage's treatments for one category, in the client's order.
 *
 * Driven by HOME_POPULAR_SLUGS rather than by `treatments`, so the sequence
 * is theirs; `.filter(Boolean)` means an unresolved slug is silently
 * skipped instead of rendering an empty row.
 */
export function getPopularTreatments(
  category: TreatmentCategoryId,
): Treatment[] {
  return HOME_POPULAR_SLUGS.map((slug) => getTreatmentBySlug(slug)).filter(
    (treatment): treatment is Treatment =>
      treatment !== undefined && treatment.category === category,
  );
}

/**
 * ── CLIENT REVISION 4 ─────────────────────────────────────────────────
 * "30+ Treatments across facial enhancement, skin, body, and hair."
 *
 * The homepage printed the exact count (`${treatments.length} treatments`),
 * which is currently 32 and which the client wants expressed as the round
 * "30+" instead — a claim ages better than an inventory number, and it does
 * not visibly change every time one treatment is added or retired.
 *
 * Computed rather than hard-coded, so it cannot quietly become a lie: it
 * floors to the nearest ten, so 32 treatments reads "30+" and the day the
 * catalogue drops to 29 it reads "20+" rather than continuing to advertise
 * a number the site no longer has.
 */
export const TREATMENT_COUNT_LABEL = `${Math.floor(treatments.length / 10) * 10}+`;

/**
 * Live-site path for a treatment. Almost all live under /ubud-bali/; the one
 * that doesn't carries an explicit `path` — see the field's note.
 */
export function treatmentHref(treatment: Treatment): string {
  return treatment.path ?? `/ubud-bali/${treatment.slug}`;
}

/**
 * The "Popular Treatments" list the live site runs in its own footer, in its
 * order and with its own labels — which are not always the treatment's name
 * ("Facials", "Dermal Fillers", "Body Contouring"). Two entries point at
 * standalone articles rather than treatment pages; that is how the live site
 * has them.
 *
 * The live site spells one of these "Fat Disovling Injections". That is a
 * typo, not a name, so it is corrected here.
 */
export const POPULAR_TREATMENT_LINKS: { label: string; href: string }[] = [
  { label: "Profhilo", href: "/ubud-bali/profhilo" },
  { label: "Botox", href: "/ubud-bali/botox" },
  { label: "Korean Botox", href: "/ubud-bali/botox/korean" },
  { label: "Lip Filler", href: "/ubud-bali/lip-filler" },
  { label: "Dermal Fillers", href: "/ubud-bali/dermal-filler" },
  { label: "Facials", href: "/ubud-bali/facial" },
  { label: "Medi Facials", href: "/ubud-bali/facial/medi" },
  { label: "Salmon DNA Treatment", href: "/ubud-bali/salmon-dna" },
  { label: "PRP Hair Treatment", href: "/ubud-bali/prp/hair" },
  { label: "IV Drip Infusions", href: "/ubud-bali/iv-drip" },
  { label: "Microneedling", href: "/ubud-bali/microneedling" },
  { label: "RF Microneedling", href: "/ubud-bali/microneedling/rf" },
  { label: "Non Surgical Facelift", href: "/non-surgical-face-lift" },
  { label: "Fat Dissolving Injections", href: "/ubud-bali/fat-dissolving-injections" },
  { label: "IPL Hair Removal", href: "/ubud-bali/ipl-hair-removal" },
  { label: "Carboxy Therapy", href: "/ubud-bali/carboxy-therapy" },
  { label: "Body Contouring", href: "/ubud-bali/slimming-body-contouring" },
  { label: "Eye Rejuvenation", href: "/eye-rejuvenaton-treatment" },
];
