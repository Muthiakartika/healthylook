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

export const termsConditions: LegalDocument = {
  title: "Terms & Conditions",
  sections: [
    {
      id: "booking-appointments",
      title: "Booking & Appointments",
      blocks: [
        {
          kind: "list",
          items: [
            { text: "Bookings available through website, WhatsApp, or email." },
            { text: "Appointments required due to high demand." },
            { text: "Cancellations must be made at least 24 hours in advance." },
            { text: "No shows will not be allowed to book future appointments." },
            { text: "Maximum 2 rescheduling allowed; deposit required beyond that." },
            {
              text: "Arrive on time for scheduled appointments — being 10 minutes late does not mean you'll wait 10 minutes.",
            },
          ],
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
            { text: "All treatments are elective and require informed consent." },
            { text: "Results vary individually; expectations explained beforehand." },
            { text: "Disclose medical history, allergies, and medications." },
            { text: "Clients with chronic disease should consult primary physician first." },
            { text: "Clinic reserves right to refuse unsafe treatments." },
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
            { text: "Accepted: cash (IDR only), credit cards, bank transfers." },
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
          kind: "paragraph",
          text: "Personal information used for bookings, treatments, and communication only. See Privacy Policy for details.",
        },
      ],
    },
    {
      id: "liability",
      title: "Liability",
      blocks: [
        {
          kind: "paragraph",
          text: "All aesthetic procedures carry risk. Clinic not responsible for complications from undisclosed conditions or failure to follow aftercare.",
        },
      ],
    },
    {
      id: "governing-law",
      title: "Governing Law",
      blocks: [
        {
          kind: "paragraph",
          text: "Terms follow Indonesian law; disputes handled in Denpasar, Bali courts.",
        },
      ],
    },
    {
      id: "terms-updates",
      title: "Updates",
      blocks: [
        {
          kind: "paragraph",
          text: "Terms may be updated; changes posted on website.",
        },
      ],
    },
  ],
};
