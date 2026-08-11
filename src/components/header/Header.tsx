"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
import { MenuIcon, WhatsAppIcon } from "@/components/ui/icons";
import { BOOKING_HREF, BOOKING_LABEL, whatsappHref } from "@/lib/constants";
import Brand from "./Brand";
import DesktopNav from "./DesktopNav";
import MobileDrawer from "./MobileDrawer";
import TopBar from "./TopBar";

/**
 * REDESIGN NOTE — the header now has two states.
 *
 * Over the hero it's transparent with white type, so the hero photograph
 * runs edge-to-edge and full-height behind it instead of starting below a
 * white bar. That single change is most of what separates a "premium
 * clinic" first impression from a template one — the brief's strongest
 * requirement is that the hero be the strongest section on the page, and a
 * hero that starts 80px down the screen never is.
 *
 * Once the user scrolls past the hero it solidifies into the paper
 * background with a hairline rule, because transparent-white type over
 * arbitrary page content is illegible and is the usual way this pattern
 * breaks.
 *
 * Which pages get the transparent treatment is decided here rather than by
 * a prop, because <Header> is rendered once from the root layout and a
 * layout can't read anything about the page below it. `usePathname` is the
 * standard way around that. The fallback is deliberately the *solid*
 * header: any route not listed — a 404, or a page added later — gets the
 * always-legible version rather than white-on-white.
 */
// Routes whose hero is dark enough for the header to sit over it in white.
//
// This used to list every page, because every page opened on the dark ink
// <PageHero>. That panel is blush now (see PageHero.tsx), and white nav type
// on blush is 1.6:1 — unreadable. So the list is down to the homepage, whose
// <Hero> is still a dark full-bleed photograph.
//
// Listed explicitly rather than defaulting to `true` so anything unlisted —
// a 404, an inner page, or a page added later — gets the always-legible
// solid header rather than white-on-light.
const HERO_ROUTES = [/^\/$/];

export default function Header() {
  const pathname = usePathname();
  const overHero = HERO_ROUTES.some((pattern) => pattern.test(pathname));

  const [mobileOpen, setMobileOpen] = useState(false);
  // Seeded from the route, not `false`. `usePathname` resolves during SSR, so
  // a page that will never show the transparent header renders solid on its
  // very first paint. Starting at `false` meant every inner page painted the
  // over-hero treatment once and then corrected itself in an effect — which
  // was a barely-visible blip when that treatment was "transparent", and is
  // an obvious flash now that it is a 45px utility strip plus a dark plate,
  // with a white logo that vanishes against a blush PageHero while it lasts.
  const [scrolled, setScrolled] = useState(!overHero);

  useEffect(() => {
    // Prevent the page behind the (fixed-position) drawer from scrolling
    // while it's open. Reset on unmount too, so navigating away never
    // leaves scroll permanently locked.
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  // The drawer's own links close it via `onNavigate`, but that only fires
  // for a click. This closes it for every *completed* navigation instead —
  // browser back/forward, a keyboard activation, or any link added later
  // that forgets to call the callback. The header is mounted once by the
  // root layout and survives route changes, so without this the drawer can
  // outlive the page it was opened on.
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!overHero) {
      setScrolled(true);
      return;
    }
    // 80vh, not a fixed pixel value: the hero is viewport-height, so the
    // handover point has to follow the viewport rather than assume a
    // desktop-sized screen.
    const onScroll = () => setScrolled(window.scrollY > window.innerHeight * 0.8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [overHero]);

  // The drawer being open also forces the solid treatment — otherwise the
  // white logo sits on the white drawer backdrop and disappears.
  const solid = scrolled || mobileOpen;

  return (
    /*
     * Two shapes, not just two colour schemes.
     *
     * Solid (scrolled, and every inner page) is the full-width bar it has
     * always been. Over the hero it is now a floating panel instead: a
     * utility strip, then the nav inset inside the container on a
     * translucent warm-dark plate. That is what stops a transparent header
     * from reading as "no header" — the nav needs its own surface to sit on
     * before it reads as a designed element rather than text dropped on a
     * photo.
     *
     * The plate keeps `rounded-brand` (3px). A pill would be the obvious
     * move here and it is the wrong one: the near-square corner is measured
     * from the live site and it runs through every button, input and card
     * on this site. One rounded exception would read as a component
     * borrowed from somewhere else.
     *
     * ── WHY THE PLATE HAS NO backdrop-blur ────────────────────────────
     * It did, and it broke the mega-menu. `backdrop-filter` makes an element
     * a containing block for absolutely-positioned descendants even at
     * `position: static` — so the Treatments panel, which is `absolute` and
     * relies on the `static` wrapper in DesktopNav dropping its positioning
     * context all the way to this fixed <header>, resolved against the plate
     * instead. The panel came out 1170px wide and inset on the homepage but
     * 1265px and full-bleed on every inner page, because the plate only
     * exists in the over-hero branch: the menu visibly changed width the
     * moment you scrolled past the hero.
     *
     * The translucent fill and the hairline border carry the glass read on
     * their own over a photograph. If the blur is ever wanted back, it has
     * to go somewhere that is not an ancestor of the panel — putting it on
     * this element will silently re-break the same thing.
     *
     * ── AND WHY <MobileDrawer> IS OUTSIDE THE <header> ────────────────
     * Same trap, worse symptom. The <header> keeps `backdrop-blur-md` in its
     * solid state, and a `backdrop-filter` is a containing block for
     * `position: fixed` descendants as well as absolute ones. The drawer is
     * `fixed inset-0` and used to render inside the header — so the moment it
     * opened, `solid` flipped true, the header gained the filter, and the
     * drawer's "full viewport" box collapsed to the header's own 80px. On a
     * phone that showed as the menu's title row and close button floating
     * over the hero with no navigation under it: the menu appeared to open
     * and be empty.
     *
     * It is a sibling of the header now, which is where a modal overlay
     * belongs anyway. Same z-50, later in the DOM, so it still paints above.
     */
    <>
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-500 ease-brand ${
        solid
          ? "border-b border-hairline bg-paper/92 backdrop-blur-md"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      {/* Collapses to nothing on scroll, so the solid state stays the
          compact bar it was rather than growing a second row. */}
      <div
        className={`overflow-hidden transition-[max-height,opacity] duration-500 ease-brand ${
          solid ? "max-h-0 opacity-0" : "max-h-16 opacity-100"
        }`}
        aria-hidden={solid}
      >
        <TopBar />
      </div>

      <Container className={solid ? "" : "pt-3"}>
        <div
          className={`flex h-20 items-center justify-between gap-6 transition-[background-color,border-color,padding] duration-500 ease-brand lg:h-24 ${
            solid
              ? ""
              : "rounded-brand border border-white/15 bg-ink-warm/45 px-6 lg:px-8"
          }`}
        >
          <Brand tone={solid ? "light" : "dark"} />

          <DesktopNav tone={solid ? "light" : "dark"} />

          <div className="flex items-center gap-2 sm:gap-4">
            {/* WhatsApp gets its own always-visible affordance next to the
                CTA: it's the clinic's real booking channel, and on mobile a
                tap-to-chat icon converts far better than routing everyone
                through a form. */}
            <a
              href={whatsappHref(
                "Hello Healthy Look Aesthetic, I'd like to ask about a treatment.",
              )}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Chat with us on WhatsApp"
              className={`hidden rounded-full p-2.5 transition-colors duration-300 sm:inline-flex ${
                solid
                  ? "text-primary hover:bg-primary/10"
                  : "text-white hover:bg-white/15"
              }`}
            >
              <WhatsAppIcon className="h-5 w-5" />
            </a>

            {/* `max-sm:hidden`, not `hidden sm:inline-flex`. <Button> carries
                `inline-flex` in its own base classes, and a plain `hidden`
                loses to it — same specificity, and `.inline-flex` is emitted
                later in the stylesheet — so this CTA was showing on phones
                alongside the hamburger, which is exactly the crowding the
                StickyCTA exists to avoid. A media-query variant always wins
                against an unconditional utility, so this one actually hides.

                Over the hero this is the bright gold fill, not the ghost
                outline it used to be. A transparent-bordered button on a
                photograph is the single biggest reason the old hero read as
                colourless — the one element on the screen whose whole job is
                to be clicked had no colour at all. */}
            <Button
              href={BOOKING_HREF}
              variant={solid ? "primary" : "accent"}
              size="sm"
              className="max-sm:hidden"
            >
              {BOOKING_LABEL}
            </Button>

            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              aria-label="Open navigation menu"
              aria-expanded={mobileOpen}
              className={`-mr-2 p-2 transition-colors duration-300 lg:hidden ${
                solid ? "text-ink" : "text-white"
              }`}
            >
              <MenuIcon className="h-6 w-6" />
            </button>
          </div>
        </div>
      </Container>
    </header>

    <MobileDrawer open={mobileOpen} onClose={() => setMobileOpen(false)} />
    </>
  );
}
