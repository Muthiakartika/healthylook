// Single source of truth for the header's nav — both the desktop mega-menu
// and the mobile accordion drawer read from this same NAV_ITEMS array.
//
// ── STRUCTURE MATCHES THE LIVE SITE ────────────────────────────────────
// Labels, grouping, and destinations are the live site's own: treatments
// live under /ubud-bali/, the about page is /our-doctor, and the four
// category groupings are exactly as the real mega-menu has them. The
// earlier version invented both the URL scheme (/treatments/...) and a
// shorter treatment list, which would have broken every existing inbound
// link and search ranking the clinic has.
import { TREATMENT_CATEGORIES, treatments, treatmentHref } from "@/data/treatments";

export type SubLink = { label: string; href: string; note?: string };
export type MegaColumn = { title: string; links: SubLink[] };
export type NavItem = {
  label: string;
  href: string;
  columns?: MegaColumn[];
  wide?: boolean;
};

// Generated from treatments.ts, one column per category — never
// hand-duplicated, so the menu can't list a treatment that doesn't exist.
const treatmentColumns: MegaColumn[] = TREATMENT_CATEGORIES.map((category) => ({
  title: category.label,
  links: treatments
    .filter((treatment) => treatment.category === category.id)
    .map((treatment) => ({ label: treatment.name, href: treatmentHref(treatment) })),
}));

export const NAV_ITEMS: NavItem[] = [
  { label: "Home", href: "/" },
  // href is "#" on purpose: this item never navigates on its own, it only
  // opens its mega-menu.
  { label: "Treatments", href: "#", columns: treatmentColumns, wide: true },
  { label: "About", href: "/our-doctor" },
  { label: "Before & After", href: "/before-after" },
  { label: "Pricing", href: "/pricing" },
  {
    label: "More",
    href: "#",
    columns: [
      {
        title: "More from Healthy Look",
        links: [
          { label: "Special Offers", href: "/special-offers", note: "Botox, transfers, airline staff" },
          { label: "Gift Card", href: "/gift-card", note: "From IDR 1.500.000" },
          { label: "Our Blog", href: "/our-blog" },
          { label: "Book Now", href: "/book-now" },
        ],
      },
    ],
  },
];
