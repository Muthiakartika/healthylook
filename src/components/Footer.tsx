import Link from "next/link";
import Image from "next/image";
import Container from "@/components/ui/Container";
import { TREATMENT_CATEGORIES, treatments } from "@/data/treatments";
import {
  SITE_NAME,
  EMAIL,
  PHONE_DISPLAY,
  PHONE_E164,
  ADDRESS,
  OPENING_HOURS,
  SOCIAL_LINKS,
  MAPS_HREF,
} from "@/lib/constants";
import { CLINIC_LICENCE_NUMBER } from "@/data/clinic";
import { InstagramIcon, FacebookIcon, WhatsAppIcon } from "@/components/ui/icons";

const socialIcons = {
  instagram: InstagramIcon,
  facebook: FacebookIcon,
  whatsapp: WhatsAppIcon,
};

// Every one of these now resolves to a real page — as of this pass the
// site has no internal link that 404s.
const COMPANY_LINKS = [
  { label: "About / Our Doctors", href: "/our-doctor" },
  { label: "Before & After", href: "/before-after" },
  { label: "Pricing", href: "/pricing" },
  { label: "Special Offers", href: "/special-offers" },
  { label: "Gift Card", href: "/gift-card" },
  { label: "Our Blog", href: "/our-blog" },
  { label: "Book Now", href: "/book-now" },
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Terms & Conditions", href: "/terms-conditions" },
];

/**
 * ── COMPACTED ──────────────────────────────────────────────────────────
 * The previous footer was close to a full screen tall. Four things were
 * making it that way, and all four are fixed here:
 *
 *  1. It listed all 12 treatments AND a second list of 12 unlinked names.
 *     Now it lists the four *categories* and links each to its section on
 *     the treatments page — 4 rows instead of 24, and it scales when the
 *     catalogue grows to 27 treatments rather than collapsing under it.
 *  2. It had its own oversized CTA strip duplicating the page's own final
 *     CTA. Removed — every page already ends with the booking section.
 *  3. Padding was section-scale (`py-16` + `py-14` + `py-7`). Now one
 *     tighter band.
 *  4. Type and row gaps were body-scale. Footer text is reference
 *     material, so it's set smaller and tighter, which is also what makes
 *     it read as a footer rather than as another section.
 *
 * Nothing was removed from the *content*: every company link, both legal
 * links, the full address, phone, email, hours, all three socials, the
 * Maps link, and the licence number are all still here. Treatments are one
 * click away by category instead of being enumerated.
 */
export default function Footer() {
  return (
    <footer className="bg-ink text-white/65">
      <Container className="grid gap-x-10 gap-y-9 py-11 lg:grid-cols-12">
        {/* Brand + contact */}
        <div className="lg:col-span-5">
          <Image
            src="/images/brand/logo.png"
            alt={SITE_NAME}
            width={300}
            height={116}
            // The logo is dark artwork on a transparent background, so it
            // needs inverting to sit on the ink band. `brightness-0
            // invert` is the reliable way to force any single-colour mark
            // to pure white without a second asset.
            className="h-10 w-auto brightness-0 invert"
          />

          <ul className="mt-5 flex flex-col gap-1.5 font-sans text-[0.8125rem] leading-relaxed">
            <li>
              <a
                href={MAPS_HREF}
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors hover:text-white"
              >
                {ADDRESS}
              </a>
            </li>
            <li className="flex flex-wrap gap-x-4 gap-y-1">
              <a href={`tel:${PHONE_E164}`} className="transition-colors hover:text-white">
                {PHONE_DISPLAY}
              </a>
              <a href={`mailto:${EMAIL}`} className="transition-colors hover:text-white">
                {EMAIL}
              </a>
            </li>
            <li className="text-white/45">{OPENING_HOURS}</li>
          </ul>

          <div className="mt-5 flex items-center gap-2.5">
            {SOCIAL_LINKS.map((social) => {
              const Icon = socialIcons[social.icon];
              return (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="rounded-full border border-white/15 p-2 text-white/60 transition-colors duration-300 hover:border-gold-soft hover:text-gold-soft"
                >
                  <Icon className="h-3.5 w-3.5" />
                </a>
              );
            })}
          </div>
        </div>

        {/* The two link columns share a row even on the narrowest screens.
            Stacked, they were what pushed the mobile footer past a full
            viewport height; side by side they cost one column of width
            each and roughly half the vertical space. */}
        <div className="grid grid-cols-2 gap-x-8 gap-y-9 lg:col-span-7 lg:grid-cols-[1fr_1.4fr]">
        {/* Treatments, by category rather than one row per treatment */}
        <div>
          <h2 className="eyebrow text-gold-soft">Treatments</h2>
          <ul className="mt-4 flex flex-col gap-1.5 font-sans text-[0.8125rem]">
            {TREATMENT_CATEGORIES.map((category) => (
              <li key={category.id}>
                <Link
                  href={`/ubud-bali#${category.id}`}
                  className="transition-colors hover:text-white"
                >
                  {category.label}
                </Link>
                <span className="ml-2 text-[0.6875rem] text-white/30">
                  {treatments.filter((t) => t.category === category.id).length}
                </span>
              </li>
            ))}
            <li className="pt-1">
              <Link
                href="/ubud-bali"
                className="text-white/45 transition-colors hover:text-white"
              >
                View all {treatments.length} treatments →
              </Link>
            </li>
          </ul>
        </div>

        {/* Company */}
        <div>
          <h2 className="eyebrow text-gold-soft">Company</h2>
          {/* One column inside a half-width cell on phones, two once
              there's room — eight links in four rows rather than eight. */}
          <ul className="mt-4 grid gap-x-6 gap-y-1.5 font-sans text-[0.8125rem] sm:grid-cols-2">
            {COMPANY_LINKS.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="transition-colors hover:text-white">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        </div>
      </Container>

      {/* One tight legal line. Both statements are still here — they're
          just set on a single wrapping row at 11px instead of two stacked
          blocks, which was costing ~125px of the mobile footer for four
          lines of text. */}
      <Container className="flex flex-col gap-1.5 border-t border-white/10 py-4 lg:flex-row lg:items-center lg:justify-between">
        <p className="font-sans text-[0.6875rem] leading-relaxed text-white/40">
          © {new Date().getFullYear()} {SITE_NAME} · {CLINIC_LICENCE_NUMBER}
        </p>
        <p className="font-sans text-[0.6875rem] leading-relaxed text-white/30">
          Individual results vary. Information here is general, not medical advice.
        </p>
      </Container>
    </footer>
  );
}
