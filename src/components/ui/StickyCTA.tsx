"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { WhatsAppIcon, ArrowRightIcon } from "@/components/ui/icons";
import { BOOKING_HREF, BOOKING_LABEL, whatsappHref } from "@/lib/constants";

/**
 * Mobile-only sticky action bar, pinned to the bottom of the viewport.
 *
 * The brief asks for a sticky mobile CTA, and this is the shape that
 * actually fits the clinic: two actions side by side rather than one.
 * WhatsApp is how this business really takes bookings, so forcing every
 * mobile visitor through an on-page form would be inventing a process the
 * clinic doesn't run — but the enquiry section still needs a route for
 * people who'd rather not open a chat.
 *
 * Two behaviours keep it from being intrusive:
 *
 *  - It stays hidden until the user has scrolled past the first viewport.
 *    Appearing over the hero would cover the one section the brief most
 *    wants to land, and a bar that's there from the first pixel reads as
 *    an ad.
 *  - It hides again near the very bottom of the page, where the footer's
 *    own CTA strip has already taken over — two competing CTAs stacked on
 *    top of each other is the usual failure of this pattern.
 *
 * It's `lg:hidden`: on desktop the header CTA is always visible, so a
 * second floating one would be pure noise.
 */
export default function StickyCTA() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      const nearBottom =
        y + window.innerHeight >= document.documentElement.scrollHeight - 620;
      setVisible(y > window.innerHeight * 0.9 && !nearBottom);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div
      // aria-hidden + inert while off-screen so it never appears in the
      // tab order or screen-reader flow when it isn't actually shown.
      aria-hidden={!visible}
      inert={!visible}
      className={`fixed inset-x-0 bottom-0 z-40 flex gap-2 border-t border-hairline bg-paper/95 p-3 backdrop-blur-md transition-transform duration-500 ease-[var(--ease)] lg:hidden ${
        visible ? "translate-y-0" : "translate-y-full"
      }`}
      style={{ paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))" }}
    >
      <a
        href={whatsappHref(
          "Hello Healthy Look Aesthetic, I'd like to ask about a treatment.",
        )}
        target="_blank"
        rel="noopener noreferrer"
        className="flex flex-1 items-center justify-center gap-2 rounded-[3px] border border-primary/40 py-3.5 font-sans text-[0.6875rem] font-semibold uppercase tracking-[0.16em] text-primary"
      >
        <WhatsAppIcon className="h-4 w-4" />
        WhatsApp
      </a>
      <Link
        href={BOOKING_HREF}
        className="flex flex-1 items-center justify-center gap-2 rounded-[3px] bg-primary py-3.5 font-sans text-[0.6875rem] font-semibold uppercase tracking-[0.16em] text-white"
      >
        {BOOKING_LABEL}
        <ArrowRightIcon className="h-3.5 w-3.5" />
      </Link>
    </div>
  );
}
