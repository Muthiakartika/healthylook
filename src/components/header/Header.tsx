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
// Every page now opens with a hero the header can sit over. Listed
// explicitly rather than defaulting to `true` so anything unlisted — a
// 404, or a page added later without a hero — gets the always-legible
// solid header instead of white-on-white.
const HERO_ROUTES = [
  /^\/$/,
  /^\/our-doctor$/,
  /^\/ubud-bali/,
  /^\/pricing$/,
  /^\/before-after$/,
  /^\/special-offers$/,
  /^\/gift-card$/,
  /^\/our-blog$/,
  /^\/book-now$/,
  /^\/privacy-policy$/,
  /^\/terms-conditions$/,
];

export default function Header() {
  const pathname = usePathname();
  const overHero = HERO_ROUTES.some((pattern) => pattern.test(pathname));

  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    // Prevent the page behind the (fixed-position) drawer from scrolling
    // while it's open. Reset on unmount too, so navigating away never
    // leaves scroll permanently locked.
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

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
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-500 ease-[var(--ease)] ${
        solid
          ? "border-b border-hairline bg-paper/92 backdrop-blur-md"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <Container className="flex h-20 items-center justify-between gap-6 lg:h-24">
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

          <Button
            href={BOOKING_HREF}
            variant={solid ? "primary" : "outlineLight"}
            size="sm"
            className="hidden sm:inline-flex"
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
      </Container>

      <MobileDrawer open={mobileOpen} onClose={() => setMobileOpen(false)} />
    </header>
  );
}
