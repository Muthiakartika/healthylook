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
import {
  TREATMENT_CATEGORIES,
  treatments as sourceTreatments,
  treatmentHref,
  type Treatment,
} from "@/data/treatments";

export type SubLink = { label: string; href: string; note?: string };
export type MegaColumn = { title: string; links: SubLink[] };
export type NavItem = {
  label: string;
  href: string;
  columns?: MegaColumn[];
  wide?: boolean;
};

// One column per category, generated — never hand-duplicated, so the menu
// cannot list a treatment that does not exist.
//
// ── WHY THIS TAKES THE LIST AS AN ARGUMENT ────────────────────────────
// The menu is rendered by DesktopNav and MobileDrawer, both of which are
// client components, and a client component cannot read the database. So
// the treatment list is resolved on the server — in the root layout — and
// handed down as props. This function is the seam between the two.
//
// `buildNavItems()` with no argument falls back to the compiled list, which
// is what MobileNavItem and any other consumer that has no props available
// still uses.
export function buildNavItems(treatments: Treatment[] = sourceTreatments): NavItem[] {
  const treatmentColumns: MegaColumn[] = TREATMENT_CATEGORIES.map((category) => ({
    title: category.label,
    links: treatments
      .filter((treatment) => treatment.category === category.id)
      .map((treatment) => ({ label: treatment.name, href: treatmentHref(treatment) })),
  }));

  return [
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
}

/**
 * The menu built from the compiled treatment list.
 *
 * Kept so that anything rendering the nav without server-resolved props
 * still works, and so the shape has a value to fall back to when the
 * database has nothing imported yet.
 */
export const NAV_ITEMS: NavItem[] = buildNavItems();

