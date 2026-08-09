// Special offers and the gift card, from the live site's own
// /special-offers and /gift-card pages.
//
// Every figure here — discount percentages, unit thresholds, minimum
// spend bands, gift card denominations, validity period — is the
// clinic's own published commercial term, copied rather than restated.
// These are the numbers a patient will hold them to at the counter, so
// paraphrasing any of them would be a real-world problem, not a
// stylistic one.

export type Offer = {
  id: string;
  name: string;
  intro?: string;
  points: string[];
  note?: string;
};

export const specialOffers: Offer[] = [
  {
    id: "botox-promotion",
    name: "Botox Promotion",
    intro:
      "Revitalize your look and smooth away wrinkles with our exclusive Botox promotion",
    points: ["15% off for minimum 40 units", "10% off for minimum 30 units"],
    note: "Limited slots available.",
  },
  {
    id: "complimentary-transfer",
    name: "Complimentary Transfer Service",
    intro: "Free transportation to and from your accommodation, with conditions:",
    points: [
      "Book minimum 3 days in advance",
      "No same-day transfers",
      "Upon request; subject to availability",
      "Minimum purchase requirements vary by location (IDR 3,000,000 – IDR 10,000,000)",
    ],
    note: "Additional charges apply if the minimum is not met.",
  },
  {
    id: "airline-staff-discount",
    name: "Airline Staff Discount",
    points: [
      "15% for muscle sculpting (CM Slim & HIPEX)",
      "10% for non-injectable treatments & Medi Facial",
      "5% for injectable treatments",
    ],
    note: "Present airline ID. Cannot be combined with other promotions.",
  },
];

// ---- Gift card ----
export const GIFT_CARD_HEADING = "Give the Gift of Confidence";
export const GIFT_CARD_TAGLINE = "Healthy Look Aesthetic Gift Voucher";

export const GIFT_CARD_INTRO =
  "Surprise someone special with the gift of self-care, confidence & rejuvenation.";

export const GIFT_CARD_BODY = [
  "Our personalised eGift Cards let your loved ones choose their ideal experience from our full range of premium aesthetic treatments in Bali.",
  "Whether it's a facial, a body contouring session, or a rejuvenating injectable treatment, they'll have the freedom to select what makes them feel their very best.",
];

/** `null` is the "Custom Amount" option on the live site. */
export const GIFT_CARD_VALUES: (number | null)[] = [
  1500000, 2000000, 3000000, 4000000, 5000000, null,
];

export const GIFT_CARD_TERMS = [
  "Gift Cards are non-refundable, non-transferable, and cannot be redeemed for cash.",
  "Gift Cards will be sent to the recipient's email by noon (Bali local time) on your selected delivery date—or to your own email within 24 hours after payment confirmation.",
  "Gift Cards can be used for any treatments or services listed in our menu.",
  "Healthy Look Gift Cards are valid for 24 months from the date of purchase.",
];
