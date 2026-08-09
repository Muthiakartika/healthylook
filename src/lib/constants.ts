// Small site-wide constants that don't belong to any one data file.
export const SITE_NAME = "Healthy Look Aesthetic";

export const SITE_TAGLINE = "Aesthetic Clinic in Bali";

export const SITE_DESCRIPTION =
  "Healthy Look Aesthetic is a doctor-led aesthetic clinic in Ubud, Bali, offering non-invasive facial enhancement, skin rejuvenation, and body treatments.";

// Verbatim from the live site's hero.
export const HERO_HEADLINE = "Helping You Look & Feel Your Best Without Surgery";
export const HERO_SUBHEADLINE =
  "Aesthetic Clinic in Bali for Non-Invasive Lifting, Natural Facial Enhancement, & Body Sculpting";

export const BRAND_INTRO =
  "Healthy Look Aesthetic is a luxury aesthetic clinic in Ubud, Bali, dedicated to bringing together science, aesthetics, and wellness.";

// The two-line philosophy from the live site's about section.
export const BRAND_PHILOSOPHY = ["Enhance, not change.", "Restore, not overcorrect."];

// ---- Contact channels ----
// The clinic's own published business details, from the live site.
export const PHONE_DISPLAY = "+62 822-2100-9191";
export const PHONE_E164 = "+6282221009191";
export const WHATSAPP_NUMBER = "6282221009191";
export const EMAIL = "info@healthylook-aesthetic.com";

export const ADDRESS = "Raya Silungan st Lodtunduh Ubud Bali at Ubud Nyuh Bali Resort";
export const OPENING_HOURS = "Opens Everyday 10.00 - 18.00";

// Read off the live site's own markup, not guessed — the handles differ
// between the two networks (underscore vs dot).
export const SOCIAL_LINKS = [
  { label: "Instagram", href: "https://www.instagram.com/healthylook_aesthetic", icon: "instagram" as const },
  { label: "Facebook", href: "https://www.facebook.com/healthylook.aesthetic", icon: "facebook" as const },
  { label: "WhatsApp", href: `https://wa.me/${WHATSAPP_NUMBER}`, icon: "whatsapp" as const },
];

export const MAPS_HREF = "https://maps.app.goo.gl/PQvW7nnn4WaDgyrw9?g_st=ic";

/**
 * Builds a WhatsApp deep link with a prefilled message.
 *
 * There is no booking backend in this build, and the brief forbids
 * inventing a new business process. WhatsApp is the process the clinic
 * already runs on — it's the number in their own header — so every
 * "Book Now" resolves here rather than to a dead link.
 */
export function whatsappHref(message?: string): string {
  const base = `https://wa.me/${WHATSAPP_NUMBER}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

// The live site has a real /book-now page. This build has no booking
// backend, so the primary CTA goes to the on-page enquiry section, which
// itself offers WhatsApp, phone, and email.
export const BOOKING_HREF = "/#book";

export const BOOKING_LABEL = "Book Now";
