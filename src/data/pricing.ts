import type { PriceGroup } from "./treatments";

// Price-list sections from the live site's /pricing page that don't map
// onto a single treatment in the nav — eye treatments, mesotherapy,
// intimate care, and the IV booster menu.
//
// They're kept here rather than dropped so /pricing can reproduce the
// clinic's published price list in full. Every row is verbatim: same
// wording, same IDR figure, same order as the live page.

export type PricingSection = {
  id: string;
  title: string;
  groups: PriceGroup[];
};

export const extraPricingSections: PricingSection[] = [
  {
    id: "eye-treatment",
    title: "Eye Treatment",
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

/** Verbatim footnote from the bottom of the live price list. */
export const PRICING_NOTE =
  "All prices are nett and inclusive of tax. No service fee charged. Prices subject to change without prior notice.";
