// General clinic FAQ — the homepage set.
//
// ── WHY THIS FILE EXISTS ───────────────────────────────────────────────
// Client revision note 12: "I think FAQ botox in homepage is not necessary,
// how do you think?" — and the decision was to keep an FAQ section but make
// it about the CLINIC rather than about one treatment.
//
// The homepage used to render the first six of Botox's nine questions from
// src/data/treatmentFaqs.ts. Those are real and they are good, but they
// answer "should I have Botox", which is a question for someone who has
// already chosen both the clinic and the treatment. On a homepage the
// unanswered questions are earlier than that: who is holding the needle,
// are the products real, can you understand me, and where is this place.
// All 184 treatment FAQs are untouched and still render on their own
// treatment pages.
//
// ── ⚠ SOURCING RULE — READ BEFORE ADDING TO THIS FILE ─────────────────
// The live site has no general FAQ, so unlike treatmentFaqs.ts there is no
// verbatim source to extract from. Every answer below is therefore
// assembled from facts the clinic has ALREADY published elsewhere, and each
// one records where its facts come from. Nothing here states a policy,
// price, timeframe, or clinical outcome that is not already asserted
// somewhere the clinic controls.
//
// That constraint is not pedantry. An FAQ is read as the clinic speaking in
// its own voice about its own rules, so an invented answer here is a
// commitment made on a medical business's behalf by someone who cannot make
// it — the worst place on the site to write plausible-sounding filler.
//
// If a question cannot be answered from published material, it does not go
// in this file until the clinic supplies the answer.

export type ClinicFaq = { question: string; answer: string };

export const clinicFaqs: ClinicFaq[] = [
  {
    question: "Who will actually perform my treatment?",
    // Source: CLINIC_SAFETY_PROTOCOLS[0] + doctors.ts (Dr. Irene's
    // congresses and brand training are named in her live bio).
    //
    // ── CLIENT REVISION — DOCTOR VS. NURSE/THERAPIST, STATED EXPLICITLY ──
    // The original answer was accurate but incomplete: it only described
    // injectables, and a reader could reasonably infer from it that a
    // doctor personally performs everything at the clinic. The client asked
    // for the distinction to be explicit rather than implied.
    //
    // ── FOLLOW-UP REVISION — WORDING SUPPLIED VERBATIM ────────────────
    // The client then gave the exact sentence to use for the non-injectable
    // half of this answer, replacing "trained therapists and nurses […]
    // with a doctor overseeing your treatment plan" with their own
    // "trained nurses and beautician" phrasing below — used as given.
    answer:
      "It depends on the treatment. All injectable treatments — Botox, dermal filler, skin boosters, and similar — are exclusively administered by our licensed doctors, never delegated to a therapist, and the same doctor handles your consultation, your treatment plan, and the injection itself. Certain non-injectable treatments, such as facials and some body-contouring devices, are performed by our trained nurses and beautician following the clinic's clear treatment standards. Our head doctor is internationally trained, with ongoing training at IMCAS Paris, AMWC, Korean Derma, and directly with the brands we use.",
  },
  /**
   * ── CLIENT REVISION — SAME-DAY TREATMENT ────────────────────────────
   * The client wants same-day treatment presented honestly: possible after
   * a consultation, but not guaranteed, since the clinic is often fully
   * booked. Source: INTERNATIONAL_PATIENT_POINTS in clinic.ts already
   * publishes "Same-Day Treatment available" as one of the clinic's own
   * commitments to international patients — this FAQ explains that
   * commitment in full rather than adding a new claim.
   */
  {
    question: "Can I get treated the same day I book?",
    answer:
      "Often, yes — same-day treatment can usually be arranged once a doctor has assessed you at consultation, and it's one of the ways we try to work around a short holiday schedule. That said, we recommend booking your appointment ahead of your visit where you can: the clinic is regularly fully booked, and we can't always accommodate a walk-in on the spot. Booking in advance is the best way to make sure a slot — and the treatment you actually want — is available when you arrive.",
  },
  {
    question: "What if I am not sure which treatment I need?",
    // Source: BRAND_STORY[1] ("honest medical consultation, personalized
    // treatment planning") and BRAND_STORY[2] ("only recommending what
    // truly benefits your skin health, facial harmony…").
    answer:
      "That is what the consultation is for, and you do not need to arrive with a treatment in mind. Tell the doctor what is bothering you and you will get an honest medical opinion — including when the honest answer is that a treatment will not achieve what you are hoping for. We only recommend what genuinely benefits your skin health, facial harmony, and long-term rejuvenation.",
  },
  {
    question: "Are the products and devices you use genuine?",
    // Source: CLINIC_SAFETY_PROTOCOLS[1] and [2], very nearly verbatim.
    answer:
      "Yes. We use only genuine, manufacturer-authorized medical devices and BPOM- and FDA-approved products, sourced through official distributors. The brands we carry include Allergan (USA), Juvéderm (USA), Restylane (Sweden), Sculptra (Switzerland), Teosyal (Switzerland), Profhilo (Italy), and ASCE+ Exosome (Korea).",
  },
  {
    question: "Is Healthy Look a licensed clinic?",
    // Source: CLINIC_LICENCE_STATEMENT, verbatim in substance including
    // the certificate number — the one claim on this page a sceptical
    // reader can independently check.
    answer:
      "Yes. Healthy Look is a fully licensed and authorized clinic in Bali, operating in compliance with all Indonesian regulations under Sertifikat Standar No. 16112100281550002. We are not a medical spa.",
  },
  {
    question: "Do you treat international patients?",
    // Source: INTERNATIONAL_PATIENT_POINTS (client revision note 16) —
    // their own five commitments, restated. The asterisked condition on
    // the transfer is carried across rather than dropped.
    answer:
      "Regularly. Our doctor and team are English-speaking, and we communicate in English on WhatsApp before and after your visit, so you can plan a treatment before you arrive in Bali. Complimentary private transfer is available (minimum purchase applies), several payment methods are accepted, and same-day treatment can often be arranged.",
  },
  {
    question: "Where is the clinic, and when are you open?",
    // Source: ADDRESS and OPENING_HOURS in src/lib/constants.ts, which are
    // the clinic's own published business details.
    answer:
      "We are on Raya Silungan Street, Lodtunduh, Ubud, inside Ubud Nyuh Bali Resort — a private, calm setting a short drive from central Ubud. The clinic is open every day from 10.00 to 18.00, with the last appointment slot at 17.00.",
  },
];
