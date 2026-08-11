// Special offers and the gift card, from the live site's own
// /special-offers and /gift-card pages.
//
// Every figure here — discount percentages, unit thresholds, minimum
// spend bands, gift card denominations, validity period — is the
// clinic's own published commercial term, copied rather than restated.
// These are the numbers a patient will hold them to at the counter, so
// paraphrasing any of them would be a real-world problem, not a
// stylistic one.

export type OfferTable = {
  title: string;
  rows: { label: string; value: string }[];
};

export type Offer = {
  id: string;
  name: string;
  intro?: string;
  points: string[];
  /**
   * Published rate tables. The transfer offer has two of them — the minimum
   * spend that earns a free transfer, and the charge if that minimum isn't
   * met — twelve figures in all, one per area the clinic serves.
   */
  tables?: OfferTable[];
  note?: string;
};

export const specialOffers: Offer[] = [
  {
    id: "botox-promotion",
    name: "Botox Promotion",
    intro:
      "Revitalize your look and smooth away wrinkles with our exclusive Botox promotion – embrace a more youthful you. Enjoy 15% off for effective wrinkle treatments for a minimum of 40 units or 10% off for purchasing a minimum of 30 units.",
    points: ["15% off for minimum 40 units", "10% off for minimum 30 units"],
    note: "The slot is limited, contact us for an appointment",
  },
  {
    id: "complimentary-transfer",
    name: "Enjoy the Complimentary Transfer*",
    intro:
      "Experience the ultimate convenience with free transfers from and to your home. Elevate your journey to beauty in Ubud as we remove the hassle of transportation. Book your appointment now to enjoy the luxury of a seamless transfer, ensuring your focus remains solely on the transformative experience that awaits you at Healthy Look Aesthetic Center in Ubud. Elevate your aesthetic journey with the added ease of complimentary transfers – because your beauty deserves a stress-free arrival!",
    points: [
      "The transfer service is subject to availability. Please make your booking at least three days in advance of your arrival. We apologize, but same-day transfers cannot be arranged.",
      "The service is available upon request. To ensure availability, please request the transfer when making your reservation.",
      "The free transportation service is not valid for package's purchase",
    ],
    // These twelve figures were previously collapsed into a single line
    // reading "Minimum purchase requirements vary by location (IDR 3,000,000
    // – IDR 10,000,000)". They are the numbers a patient is held to at the
    // counter — which is this file's own stated reason for copying rather
    // than restating — so a visitor in Canggu could not tell from the
    // rebuilt page that their threshold is IDR 7.500.000, not 3.000.000.
    tables: [
      {
        title:
          "Minimum purchase for the treatments will be applied for the free transfer as below:",
        rows: [
          { label: "Ubud Center, Mas, Sukawati", value: "IDR 3.000.000" },
          { label: "Kedewatan, Sayan", value: "IDR 3.500.000" },
          { label: "Tegalalang, Payangan", value: "IDR 4.500.000" },
          { label: "Denpasar, Sanur", value: "IDR 5.000.000" },
          { label: "Seminyak, Kuta, Canggu, Nusadua", value: "IDR 7.500.000" },
          { label: "Kintamani, Amed, Uluwatu", value: "IDR 10.000.000" },
        ],
      },
      {
        title:
          "In the case of the patient not meeting the minimum purchase requirement due to a change in the treatment taken or other reasons, an additional charge will be applied for transportation",
        rows: [
          { label: "Ubud, Mas, Lodtunduh, Sukawati", value: "IDR 300.000" },
          { label: "Kedewatan, Sayan", value: "IDR 400.000" },
          { label: "Tegalalang, Payangan", value: "IDR 500.000" },
          { label: "Denpasar, Sanur", value: "IDR 500.000" },
          { label: "Seminyak, Kuta, Canggu, Nusadua", value: "IDR 700.000" },
          { label: "Kintamani, Amed, Uluwatu", value: "IDR 1.200.000" },
        ],
      },
    ],
    note: "*) T & C Applied",
  },
  {
    id: "airline-staff-discount",
    name: "Special Discount for Airline Staffs",
    intro:
      "At Healthy Look Aesthetic Center in Ubud, we appreciate the dedication of airline professionals who keep the world connected, and now it's our turn to pamper you. Enjoy an exclusive discount on our range of aesthetic services in the tranquil atmosphere of Ubud while our skilled practitioners cater to your aesthetic needs.",
    points: [
      "15% for muscle sculpting by CM Slim & HIPEX",
      "10% for non injectable treatments & Medi Facial",
      "5% for injectable treatments",
    ],
    note: "Simply present your airline ID and treat yourself to a personalized experience that reflects the care and attention you deserve. *This offer may not be combined with any other promotions",
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
  // The live page's closing paragraph, previously dropped.
  "Perfect for birthdays, celebrations, or just because—delivered straight to their inbox. Let them indulge in a moment of self-care, and feel confident in their own skin—with a gift that truly makes a difference.",
];

/**
 * The six card designs the live gift-card form offers, in its order and with
 * its own labels. Previously absent entirely, so a buyer could pick a value
 * but not the occasion — which is most of what makes it a gift rather than a
 * voucher.
 *
 * No artwork ships with these: the live designs are images in the client's
 * media library that this repo does not have. They are presented as named
 * choices and passed through in the WhatsApp enquiry, which is how every
 * other selection on this site reaches the clinic.
 */
export const GIFT_CARD_DESIGNS = [
  "Christmas",
  "Thanks Giving",
  "Happy Birthday",
  "Happy Wedding",
  "Happy Honeymoon",
  "Healthy Look Signature",
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
