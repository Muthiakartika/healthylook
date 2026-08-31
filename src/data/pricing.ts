import type { PriceGroup, TreatmentCategoryId } from "./treatments";

// Price-list sections from the live site's /pricing page that don't map
// onto a single treatment in the nav — eye treatments, mesotherapy, and
// intimate care.
//
// They're kept here rather than dropped so /pricing can reproduce the
// clinic's published price list in full. Every row is verbatim: same
// wording, same IDR figure, same order as the live page.
//
// ── CLIENT REVISION — GROUPED BY CATEGORY, NOT LUMPED TOGETHER ─────────
// "Eye treatments should be in the skin treatment. Intimate care should be
// in body treatment. Mesotherapy should be in skin treatments." These three
// used to render together in their own "More treatments" catch-all at the
// bottom of /pricing, disconnected from the four category sections above
// it. `category` below is what PricingPage now groups them by, so each
// renders under the same heading as the rest of its category — which also
// matches where the live page itself positions them (Eye Treatment sits
// between Skin Booster and Profhilo's Adipose Tissue Restoration;
// Personalized Mesotherapy between Salmon DNA and Sylfirm X; Intimate Care
// between Body Peeling and Carboxy Therapy — skin, skin, and body).
export type PricingSection = {
  id: string;
  title: string;
  category: TreatmentCategoryId;
  groups: PriceGroup[];
};

export const extraPricingSections: PricingSection[] = [
  {
    id: "eye-treatment",
    title: "Eye Treatment",
    category: "skin-treatments",
    groups: [
      {
        rows: [
          { label: "Vitaran Polynucleotide (1 ml)", price: 2900000 },
          { label: "Under Eye's Collagen Stimulator", price: 2900000 },
          { label: "Rejuran I Polynucleotide (1 ml)", price: 3500000 },
          { label: "Under Eye Filler with Teosyal Redensity II", price: 4200000 },
          { label: "Plinest Fast (2 ml)", price: 4900000 },
        ],
      },
    ],
  },
  {
    id: "personalized-mesotherapy",
    title: "Personalized Mesotherapy",
    category: "skin-treatments",
    groups: [
      {
        rows: [
          { label: "Redness", price: 1250000 },
          { label: "Acne & Blemishes Control", price: 1250000 },
          { label: "Scar Subcision with Salmon DNA", price: 2290000 },
          { label: "Stem Cell Derivatives", price: 3500000 },
          { label: "Bioremodelling Lip Booster", price: 3900000 },
        ],
      },
    ],
  },
  {
    id: "intimate-care",
    title: "Intimate Care",
    category: "body-treatments",
    groups: [
      {
        rows: [
          { label: "Intimate Peeling", price: 690000 },
          { label: "Intimate Peeling Pro", price: 950000 },
          { label: "Intimate Shine", price: 1790000 },
          { label: "Intimate Luxe", price: 2290000 },
          { label: "Intimate Renew", price: 3290000 },
        ],
      },
    ],
  },
];

/**
 * Verbatim footnotes from the bottom of the live price list.
 *
 * This was one condensed sentence that paraphrased the live wording and lost
 * the accepted payment methods entirely — a genuinely useful detail for
 * someone travelling to Bali deciding whether to bring cash.
 */
/**
 * ── CLIENT REVISION (Pricing 1) ───────────────────────────────────────
 * Their brief, verbatim: "You can change the words, but please don't
 * remove the ideas of transparency, the price is nett inclusive of tax
 * without service charge."
 *
 * So all three ideas are here and only the phrasing is tightened. The one
 * substantive edit is the last clause: their draft ended "...because
 * helping you look and feel your best is our passion", which explains a
 * pricing policy with a feeling. "It is already in the price" explains it
 * with the fact, which is what a reader checking a price list wants — and
 * the passion line already exists on the site, in the brand story, where
 * it is not standing between someone and a number.
 *
 * ── Why this is not in PRICING_NOTE ───────────────────────────────────
 * PRICING_NOTE is small print at the foot of a 236-row table, and it
 * already carries "all prices are nett and inclusive of all fees and
 * surcharges" — the same fact, positioned as a disclaimer. This is the
 * same fact positioned as a promise, at the top of the page, before the
 * numbers. On a price list that distinction is the entire point of the
 * client's note: a reader who has already scrolled past 236 rows does not
 * need reassuring, and a reader who has just arrived does.
 *
 * ── WHY IT IS SPLIT INTO PARTS ────────────────────────────────────────
 * It shipped first as one 223-character string, centred, and it looked
 * like what it was: a paragraph floating in a band. Four centred lines
 * ending on the orphan "price.", no heading, nothing to scan.
 *
 * The sentence has two jobs inside it and they want different typography.
 * "We believe in transparency" is a claim and belongs at display size in
 * the script face, like every other section statement on this site. The
 * three commitments after it are facts, and facts want to be counted, not
 * read — three short lines beat one long clause that buries them.
 *
 * The client's three required ideas all survive the split: transparency,
 * nett and inclusive of tax, and no service charge.
 */
export const PRICING_PROMISE = {
  /** Script display line — the client's own opening clause. */
  title: "We believe in transparency",
  /** Their own continuation, now a sentence of its own. */
  description:
    "So you can plan your journey to confidence, and know the full cost before anything begins.",
  /**
   * The three commitments, one per line. Each is a restatement of the
   * client's own clause, not a new claim: "All prices are nett and
   * inclusive of tax. We don't charge a service fee."
   */
  points: [
    { label: "Nett prices", detail: "The figure you see is the figure you pay." },
    { label: "Tax included", detail: "Already inside every price on this page." },
    { label: "No service fee", detail: "We don't add one, ever." },
  ],
};

export const PRICING_NOTE =
  "Prices are subject to change without prior notice. All prices are nett and inclusive of all fees and surcharges.";

export const PRICING_PAYMENT_NOTE =
  "We accept payments in cash (IDR) and by card (VISA, MasterCard, Union Pay, JCB, and AMEX).";
