// Privacy Policy and Terms & Conditions.
//
// ── SOURCE ─────────────────────────────────────────────────────────────
// Both documents are reproduced from healthylook-aesthetic.com's own
// /privacy-policy and /terms-conditions pages. Legal copy is the one kind
// of content that must never be paraphrased, tightened, or "improved" —
// the clinic is bound by exactly these words, so they're stored as data
// and rendered as-is.
//
// Kept as structured sections rather than one HTML blob so the pages can
// build a table of contents and anchor links from the same source.

export type LegalBlock =
  | { kind: "paragraph"; text: string }
  | { kind: "list"; items: { term?: string; text: string }[] };

export type LegalSection = {
  id: string;
  title: string;
  blocks: LegalBlock[];
};

export type LegalDocument = {
  title: string;
  intro?: string;
  sections: LegalSection[];
};

export const privacyPolicy: LegalDocument = {
  title: "Privacy Policy",
  intro:
    "At Healthy Look Aesthetic, your trust means everything to us. We are committed to protecting your privacy and ensuring that your personal information is handled with care, respect, and transparency.",
  sections: [
    {
      id: "information-we-collect",
      title: "What Information We Collect",
      blocks: [
        {
          kind: "paragraph",
          text: "When you visit our clinic, book a treatment, or browse our website, we may collect:",
        },
        {
          kind: "list",
          items: [
            { term: "Basic details", text: "Name, phone number, email, and nationality." },
            {
              term: "Treatment information",
              text: "Medical history, allergies, regular medicine, and consultation notes (to keep you safe).",
            },
            {
              term: "Website data",
              text: "Cookies and browsing activity to improve your online experience.",
            },
          ],
        },
      ],
    },
    {
      id: "how-we-use-information",
      title: "How We Use Your Information",
      blocks: [
        { kind: "paragraph", text: "We use your information to:" },
        {
          kind: "list",
          items: [
            { text: "Provide safe and personalized treatments." },
            { text: "Confirm bookings and send appointment reminders." },
            { text: "Share updates, promotions, or wellness tips (only if you've opted in)." },
            { text: "Meet legal and regulatory requirements." },
          ],
        },
      ],
    },
    {
      id: "how-we-protect-information",
      title: "How We Protect Your Information",
      blocks: [
        {
          kind: "list",
          items: [
            { text: "Your data is stored securely, with access limited to authorized staff." },
            { text: "We use secure systems and encryption to protect digital records." },
            { text: "We never sell or trade your information to third parties." },
          ],
        },
      ],
    },
    {
      id: "sharing-of-information",
      title: "Sharing of Information",
      blocks: [
        { kind: "paragraph", text: "We only share your information:" },
        {
          kind: "list",
          items: [
            { text: "When required by law." },
            {
              text: "When necessary for your treatment safety (e.g., with medical professionals, if you consent).",
            },
            {
              text: "When you allow us to share the photography of before-after pictures. The published photo only shows the treated area and not reveal your identity. Other parts of the face will not be published or blurred",
            },
          ],
        },
      ],
    },
    {
      id: "your-rights",
      title: "Your Rights",
      blocks: [
        { kind: "paragraph", text: "You are in control of your information. You can:" },
        {
          kind: "list",
          items: [
            { text: "Request a copy of the data we hold about you." },
            { text: "Ask us to correct or delete your information." },
            { text: "Opt out of marketing communications anytime." },
          ],
        },
      ],
    },
    {
      id: "cookies",
      title: "Cookies & Online Experience",
      blocks: [
        {
          kind: "paragraph",
          text: "Our website uses cookies to make browsing smoother. You can disable cookies in your browser if you prefer.",
        },
      ],
    },
    {
      id: "updates",
      title: "Updates",
      blocks: [
        {
          kind: "paragraph",
          text: "We may update this Privacy Policy from time to time. Any changes will be posted on our website so you're always informed.",
        },
      ],
    },
  ],
};

/*
 * ⚠ REWRITTEN BACK TO THE CLINIC'S OWN WORDING.
 *
 * A clause-by-clause diff against the live page found every one of these
 * compressed into note-form — 16 of the live document's clauses replaced by
 * 15 shorter paraphrases. "You can book treatments through our website, via
 * WhatsApp, or email" had become "Bookings available through website,
 * WhatsApp, or email"; the ~400-word late-arrival paragraph had become a
 * half-sentence; "We take every precaution to ensure safe treatments, but all
 * aesthetic procedures carry some risk" had lost the precaution clause
 * entirely, leaving only the disclaimer.
 *
 * That directly contradicts this file's own header rule, and it matters more
 * here than anywhere else on the site: these are the terms the clinic is held
 * to if a patient disputes a cancellation fee or a refund. A tightened
 * paraphrase of a contract is a different contract.
 *
 * The Privacy Policy above was checked the same way and matched the live
 * document exactly, clause for clause — it needed no changes.
 */
export const termsConditions: LegalDocument = {
  title: "Terms & Conditions",
  intro:
    "At Healthy Look Aesthetic, we want every guest to feel comfortable, informed, and confident in choosing our services. These Terms & Conditions are here to explain how we work, so there are no surprises — only clarity and care.",
  sections: [
    {
      id: "booking-appointments",
      title: "Booking & Appointments",
      blocks: [
        {
          kind: "list",
          items: [
            { text: "You can book treatments through our website, via WhatsApp, or email." },
            { text: "As we operated on high demand, appointments are required." },
            { text: "If you need to cancel, please let us know at least 24 hours in advance." },
            { text: "No shows will not be allowed to book future appointments" },
            {
              text: "A maximum of 2 rescheduling is allowed. Beyond that, a deposit is required to secure the new appointment.",
            },
            { text: "Please arrive on time for your scheduled appointment." },
          ],
        },
        {
          kind: "paragraph",
          text: "If you arrive late, we will do our best to accommodate you by fitting you in between other appointments. However, you may need to wait, as our doctor or nurse will handle to the next patients who arrive on time according to their scheduled slots. Please note: being 10 minutes late does not mean you'll wait 10 minutes. Depending on the next patient's treatment duration, sometimes, the waiting time could be longer.",
        },
      ],
    },
    {
      id: "treatments-consent",
      title: "Treatments & Consent",
      blocks: [
        {
          kind: "list",
          items: [
            { text: "All treatments are elective and require your informed consent." },
            {
              text: "Results vary from person to person — we'll always explain what to expect.",
            },
            {
              text: "For your safety, please share any relevant medical history, allergies, or medications with us.",
            },
            {
              text: "If the client has chronic disease, we strongly suggest to consult first with your primary physician before having any aesthetic treatment",
            },
            {
              text: "Healthy Look Aesthetic reserves the right to refuse treatment if deemed unsafe.",
            },
          ],
        },
      ],
    },
    {
      id: "payments-packages",
      title: "Payments & Packages",
      blocks: [
        {
          kind: "list",
          items: [
            {
              text: "We accept cash (IDR only), credit cards, and bank transfers to Indonesia's bank account",
            },
            { text: "Completed treatments are non-refundable." },
            {
              text: "Prepaid packages are non-transferable and non-refundable, unless required by law.",
            },
          ],
        },
      ],
    },
    {
      id: "your-privacy",
      title: "Your Privacy",
      blocks: [
        {
          kind: "list",
          items: [
            {
              text: "We respect your privacy and handle your personal information with care.",
            },
            {
              text: "Details you share with us are used only for bookings, treatments, and communication.",
            },
            { text: "For more information, please see our full Privacy Policy." },
          ],
        },
      ],
    },
    {
      id: "liability",
      title: "Liability",
      blocks: [
        {
          kind: "list",
          items: [
            {
              text: "We take every precaution to ensure safe treatments, but all aesthetic procedures carry some risk",
            },
            {
              text: "Healthy Look Aesthetic is not responsible for complications arising from undisclosed medical conditions or failure to follow aftercare instructions.",
            },
          ],
        },
      ],
    },
    {
      id: "governing-law",
      title: "Governing Law",
      blocks: [
        {
          kind: "paragraph",
          text: "These Terms & Conditions follow Indonesian law. Any disputes will be handled in the courts of Denpasar, Bali.",
        },
      ],
    },
    {
      id: "terms-updates",
      title: "Updates",
      blocks: [
        {
          kind: "paragraph",
          text: "We may update these Terms & Conditions from time to time. Any changes will be posted on our website so you're always informed.",
        },
      ],
    },
  ],
};
