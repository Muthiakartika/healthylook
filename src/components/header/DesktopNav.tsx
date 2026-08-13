"use client";

import { useEffect, useId, useRef, useState } from "react";
import type { FocusEvent, PointerEvent } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_ITEMS } from "./navItems";
import MegaPanel from "./MegaPanel";
import { ChevronDownIcon } from "@/components/ui/icons";

/**
 * How long an open panel survives after the pointer leaves it. Long enough to
 * cross the gap between a trigger and its panel on a diagonal, short enough
 * that a menu you have genuinely left does not linger.
 */
const HOVER_CLOSE_DELAY = 260;

/**
 * Desktop-only horizontal nav (hidden below `lg`, where MobileDrawer takes
 * over).
 *
 * ── WHY THIS OWNS OPEN/CLOSE STATE ────────────────────────────────────
 *
 * The mega-menu used to be pure CSS: the wrapper was a `group` and the
 * panel opened on `group-hover` / `group-focus-within`, with no JavaScript
 * involved. That is a tidy pattern and it had one bug that made the menu
 * feel broken: it could not close on navigation.
 *
 * <Header> is rendered from the root layout, so a next/link click is a
 * client-side transition — the header is never unmounted or re-created.
 * CSS `:hover` matches the pointer's real position, and the pointer does
 * not move when the page changes underneath it. So clicking a submenu link
 * left the panel hanging over the page the user had just landed on, until
 * they happened to move the mouse away. There was no hook to close it from,
 * because none of the open state lived in React.
 *
 * Making `openLabel` real state fixes that and costs nothing else: the
 * panel now closes on the link click itself, on every route change, on
 * Escape, when the pointer leaves, and when focus leaves the item. After a
 * click the pointer is still inside the wrapper, and `pointerenter` does
 * not fire again for a pointer that never left — so the menu stays shut
 * until the user genuinely re-enters it, which is what people expect from
 * every other menu they use.
 *
 * Pointer handlers are filtered to `pointerType === "mouse"` so a touch tap
 * on a hybrid laptop doesn't open the panel on `pointerenter` and then
 * immediately close it again on `click`.
 *
 * REDESIGN NOTE: the link treatment is an underline that wipes in from the
 * left rather than a colour swap. A moving rule reads as considered where a
 * colour change reads as a default link state, and it is the same gesture
 * used on the editorial text links further down the page — one hover
 * language for the whole site.
 */
export default function DesktopNav({ tone = "light" }: { tone?: "light" | "dark" }) {
  const dark = tone === "dark";
  const linkColor = dark ? "text-white/90 hover:text-white" : "text-text hover:text-primary";
  const ruleColor = dark ? "bg-white" : "bg-primary";

  const pathname = usePathname();
  const panelIdPrefix = useId();
  const [openLabel, setOpenLabel] = useState<string | null>(null);

  /*
   * ── WHY CLOSING IS DELAYED ────────────────────────────────────────────
   *
   * The Treatments panel is `inset-x-0` on a `static` wrapper, so it is
   * positioned against the <header>, not against its own trigger — that is
   * what lets it span the full header width. The consequence is a strip of
   * header padding between the bottom of the trigger and the top of the
   * panel that belongs to neither: crossing it fires `pointerleave` on the
   * item, and the panel vanished before the pointer ever reached it. That
   * is the "disappears too fast" behaviour.
   *
   * A close delay is the fix rather than a taller hit area, because the gap
   * is real geometry and papering over it with an invisible bridge breaks
   * clicks on whatever sits underneath. Re-entering the item (including
   * entering the panel, which is a descendant) cancels the pending close,
   * so a diagonal sweep toward the panel now keeps it open.
   *
   * Only *hover* closing is delayed. Escape, a link click, a route change,
   * and tabbing out all still close instantly — a deliberate dismissal
   * should never feel laggy.
   */
  const closeTimer = useRef<number | null>(null);

  const cancelPendingClose = () => {
    if (closeTimer.current !== null) {
      window.clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  };

  const closeNow = () => {
    cancelPendingClose();
    setOpenLabel(null);
  };

  // Opening anything must also cancel a close that is still pending from the
  // item you just left. Without this, hovering off Treatments and then
  // opening More within the grace period let the old timer fire and shut More
  // a quarter-second after it appeared.
  const openNow = (label: string) => {
    cancelPendingClose();
    setOpenLabel(label);
  };

  // Clear the timer on unmount so it can't fire against a gone component.
  useEffect(() => cancelPendingClose, []);

  // Any completed navigation closes the menu. This covers the paths a click
  // handler can't: keyboard Enter on a link, browser back/forward, and a
  // link followed from inside the panel by assistive tech.
  useEffect(() => {
    cancelPendingClose();
    setOpenLabel(null);
  }, [pathname]);

  // Escape is the expected way out of an open menu, and the only way out
  // for a keyboard user who opened it and then thought better of it.
  useEffect(() => {
    if (!openLabel) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        cancelPendingClose();
        setOpenLabel(null);
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [openLabel]);

  const openOnHover = (label: string) => (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== "mouse") return;
    openNow(label);
  };

  const closeOnHoverOut = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== "mouse") return;
    cancelPendingClose();
    closeTimer.current = window.setTimeout(() => setOpenLabel(null), HOVER_CLOSE_DELAY);
  };

  // Tabbing past the last link in a panel should close it, but moving focus
  // *within* the item (trigger → first link) must not.
  const closeOnFocusOut = (event: FocusEvent<HTMLDivElement>) => {
    if (!event.currentTarget.contains(event.relatedTarget)) closeNow();
  };

  return (
    /*
     * `self-stretch` on the nav and on every item, so each nav item's box
     * is the full height of the header row rather than just the height of
     * its own text.
     *
     * ── WHY THAT MATTERS ──────────────────────────────────────────────
     * The panels are `absolute top-full`. For the wide Treatments menu
     * that resolves against the <header> — the item is `static` — so it
     * lands flush under the bar. Every other panel resolves against its
     * own item, and a text-height item ends roughly 35px above the bottom
     * of a 96px row: the More panel opened from the middle of the header
     * instead of from its edge, which is the odd gap.
     *
     * Stretching the item makes `top-full` mean the same thing for both:
     * the bottom of the header. No offsets to keep in sync with the row
     * height, and it fixes a second thing for free — the whole row is now
     * the hover target, so the diagonal sweep from a trigger down into its
     * panel no longer crosses dead space (see HOVER_CLOSE_DELAY above).
     */
    <nav aria-label="Main" className="hidden items-center gap-9 self-stretch lg:flex">
      {NAV_ITEMS.map((item, index) => {
        const open = openLabel === item.label;
        const panelId = `${panelIdPrefix}-nav-${index}`;

        const inner = (
          <>
            <span className="relative">
              {item.label}
              <span
                className={`absolute -bottom-1.5 left-0 h-px transition-[width] duration-400 ease-brand group-hover:w-full ${ruleColor} ${
                  open ? "w-full" : "w-0"
                }`}
                aria-hidden="true"
              />
            </span>
            {item.columns && (
              <ChevronDownIcon
                className={`h-3 w-3 transition-transform duration-300 ease-brand ${
                  open ? "rotate-180" : ""
                }`}
              />
            )}
          </>
        );

        const triggerClass = `flex items-center gap-1.5 whitespace-nowrap font-sans text-label font-medium tracking-wide transition-colors duration-300 ${linkColor}`;

        return (
          // `static` on the wide (Treatments) item only: it drops the
          // positioning context down to the fixed <header>, which is what
          // lets that one panel span the full header width. Every other
          // item stays `relative` so its panel hangs directly beneath it.
          <div
            key={item.label}
            className={`group flex items-center self-stretch ${
              item.wide ? "static" : "relative"
            }`}
            onPointerEnter={item.columns ? openOnHover(item.label) : undefined}
            onPointerLeave={item.columns ? closeOnHoverOut : undefined}
            onBlur={item.columns ? closeOnFocusOut : undefined}
          >
            {item.columns ? (
              <button
                type="button"
                aria-haspopup="true"
                aria-expanded={open}
                aria-controls={panelId}
                onClick={() => (open ? closeNow() : openNow(item.label))}
                className={triggerClass}
              >
                {inner}
              </button>
            ) : (
              <Link href={item.href} className={triggerClass}>
                {inner}
              </Link>
            )}
            {item.columns && (
              <MegaPanel
                id={panelId}
                columns={item.columns}
                wide={item.wide}
                open={open}
                onNavigate={closeNow}
                onPointerEnter={openOnHover(item.label)}
                onPointerLeave={closeOnHoverOut}
              />
            )}
          </div>
        );
      })}
    </nav>
  );
}
