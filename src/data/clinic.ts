// Clinic positioning, philosophy, and safety commitments.
//
// ── SOURCE ─────────────────────────────────────────────────────────────
// All verbatim from healthylook-aesthetic.com (/our-doctor and the
// homepage). This file replaces the "five things we don't compromise on"
// list the earlier build used, which had been written for the rebuild
// rather than taken from the clinic.
//
// The difference matters: the real material is stronger. A licence number,
// a doctor-only injectable policy, and a one-patient-one-syringe rule are
// specific, checkable commitments. Invented copy about being
// "comfort-first" is not — and on a medical site, unverifiable
// reassurance is worth less than a certificate number.

/** Verbatim from /our-doctor. */
export const CLINIC_LICENCE_STATEMENT =
  "Not your ordinary medical spa in Bali, Healthy Look is a fully licensed and authorized clinic in Bali operating in compliance with all Indonesian regulations (Sertifikat Standar No. 16112100281550002).";

export const CLINIC_LICENCE_NUMBER = "Sertifikat Standar No. 16112100281550002";

export const CLINIC_PHILOSOPHY =
  "Our philosophy is centered on delivering natural-looking results that enhance your unique features and help you become the best version of yourself.";

export const CLINIC_SAFETY_STATEMENT =
  "Your safety is our highest priority. At Healthy Looks, every treatment is delivered in accordance with internationally recognized medical standards while embracing the warmth and personalized care of Balinese hospitality.";

/**
 * The clinic's own published safety protocols, verbatim.
 *
 * This list carried three of the live site's seven, and cut two of those
 * three short — "one patient, one syringe" lost "eliminating the risk of
 * cross-contamination and blood-borne disease transmission", and the
 * emergency line lost the hyaluronidase reversal and anaphylaxis detail.
 * Those clauses are the entire substance of the claim: a clinic saying it is
 * prepared for emergencies says nothing, a clinic naming the reversal agent
 * it stocks says something checkable. All seven are here in full now, in the
 * live page's order.
 */
export const CLINIC_SAFETY_PROTOCOLS: { title: string; description: string }[] = [
  {
    title: "Doctor-performed injectables",
    description:
      "All injectable treatments are exclusively administered by our licensed doctors.",
  },
  {
    title: "Authentic medical devices and products",
    description:
      "We use only genuine, manufacturer-authorized medical devices and BPOM- and FDA-approved products sourced through official distributors.",
  },
  {
    title: "Premium brands",
    description:
      "Including Allergan (USA), Juvéderm (USA), Restylane (Sweden), Sculptra (Switzerland), Teosyal (Switzerland), Profhilo (Italy), and ASCE+ Exosome (Korea).",
  },
  {
    title: "Advanced infection control",
    description:
      "Using aseptic injection techniques, sterile single-use equipment, and professional medical waste disposal.",
  },
  {
    title: "One patient, one syringe policy",
    description:
      "We never offer shared or half-syringe filler treatments, eliminating the risk of cross-contamination and blood-borne disease transmission.",
  },
  {
    title: "Comprehensive emergency preparedness",
    description:
      "For all injectable treatments, including hyaluronidase reversal for dermal fillers and emergency management of anaphylactic reactions.",
  },
  {
    title: "Strict cold-chain management",
    description:
      "For temperature-sensitive products and treatments, including botulinum toxin and exosome therapies.",
  },
];
