import Link from "next/link";
import Image from "next/image";
import Container from "@/components/ui/Container";
import { POPULAR_TREATMENT_LINKS } from "@/data/treatments";
import { blogPosts, FOOTER_BLOG_SLUGS } from "@/data/blog";
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

// The eight posts the live site promotes in its own footer, resolved from
// the blog index so the labels can't drift out of sync with the articles.
const footerBlogPosts = FOOTER_BLOG_SLUGS.map((href) =>
  blogPosts.find((post) => post.href === href),
).filter((post): post is NonNullable<typeof post> => Boolean(post));

// `inline-block py-0.5` keeps each row a real touch target without opening the
// list up: 13px text is a ~19px box, and the padding sits inside the target so
// the visual rhythm stays tight.
// `py-1`, not `py-0.5`. At 13px type the half-step gave a 23.5px-tall row,
// and these rows sit flush against each other with no gap — so they were
// just under WCAG 2.5.8's 24px minimum with none of the spacing that would
// otherwise excuse it. Half a pixel, but it is the whole footer on a phone.
const linkClass =
  "inline-block py-1 text-white/70 transition-colors duration-300 hover:text-white";

const headingClass = "eyebrow text-gold-soft";
const listClass = "mt-4 flex flex-col font-sans text-label";

/**
 * ── COLOUR: BACK TO THE DARK BAND ──────────────────────────────────────
 *
 * This went dark → blush (matching the live site) → wash → dark again. The
 * round trip is worth recording so nobody repeats it: the live site's footer
 * really is blush #eed4b8, but at footer scale that value reads as a flat
 * slab of brown rather than as the warm accent it is on a small panel. Two
 * lighter variations were tried and rejected for the same reason. Dark is
 * what the client wants here, and it is also what makes the page end —
 * a light footer under a light booking band just trails off.
 *
 * Blush is still a real brand colour and still used, at the scale where it
 * works: the clinic section's surface, its address panel, and the inner-page
 * hero.
 *
 * ── SIZE: FOUR BALANCED COLUMNS ────────────────────────────────────────
 *
 * The footer was 733px tall with a large dead area under "Popular
 * Treatments". That was a balance problem, not a content problem: three
 * tracks meant Company and Our Blog were stacked in one narrow column that
 * ran twice as tall as its neighbours, and the grid is only as short as its
 * tallest cell.
 *
 * Four tracks make every column roughly nine rows, so nothing runs long and
 * no space is left over. Content is untouched — all 41 links are still here.
 */
export default function Footer() {
  return (
    <footer className="bg-ink text-white/70">
      <Container className="grid gap-x-10 gap-y-10 py-10 lg:grid-cols-[12fr_15fr_9fr_11fr]">
        {/* Brand + contact */}
        <div>
          <Image
            src="/images/brand/logo.png"
            alt={SITE_NAME}
            width={300}
            height={116}
            // Dark artwork on transparent: inverting is the reliable way to
            // force a single-colour mark to white without a second asset.
            className="h-8 w-auto brightness-0 invert"
          />

          <p className="mt-4 font-sans text-label font-semibold text-white">
            at Ubud Nyuh Bali Resort
          </p>

          <ul className="mt-2 flex flex-col font-sans text-label leading-relaxed">
            <li>
              <a
                href={MAPS_HREF}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block py-0.5 text-white/70 transition-colors hover:text-white"
              >
                {ADDRESS}
              </a>
            </li>
            <li>
              <a
                href={`mailto:${EMAIL}`}
                className="inline-block py-0.5 text-white/70 transition-colors hover:text-white"
              >
                {EMAIL}
              </a>
            </li>
            <li>
              <a
                href={`tel:${PHONE_E164}`}
                className="inline-block py-0.5 text-white/70 transition-colors hover:text-white"
              >
                {PHONE_DISPLAY}
              </a>
            </li>
            <li className="pt-1 font-medium text-white">{OPENING_HOURS}</li>
          </ul>

          <div className="mt-4 flex items-center gap-2">
            {SOCIAL_LINKS.map((social) => {
              const Icon = socialIcons[social.icon];
              return (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="rounded-full border border-white/20 p-2 text-white/70 transition-colors duration-300 hover:border-gold-soft hover:text-gold-soft"
                >
                  <Icon className="h-4 w-4" />
                </a>
              );
            })}
          </div>
        </div>

        {/* Popular Treatments — the clinic's own list, in its own order.
            Two sub-columns so eighteen rows read as nine. */}
        <div>
          <h2 className={headingClass}>Popular Treatments</h2>
          <ul className={`${listClass} grid grid-cols-2 gap-x-6`}>
            {POPULAR_TREATMENT_LINKS.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className={linkClass}>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className={headingClass}>Company</h2>
          <ul className={listClass}>
            {COMPANY_LINKS.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className={linkClass}>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className={headingClass}>Our Blog</h2>
          <ul className={listClass}>
            {footerBlogPosts.map((post) => (
              <li key={post.href}>
                <Link href={post.href} className={linkClass}>
                  {post.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </Container>

      <Container className="flex flex-col gap-1 border-t border-white/10 py-3.5 lg:flex-row lg:items-center lg:justify-between">
        <p className="font-sans text-micro leading-relaxed text-white/60">
          © {new Date().getFullYear()} {SITE_NAME} · {CLINIC_LICENCE_NUMBER}
        </p>
        <p className="font-sans text-micro leading-relaxed text-white/60">
          Individual results vary. Information here is general, not medical advice.
        </p>
      </Container>
    </footer>
  );
}
