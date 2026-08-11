import Link from "next/link";
import type { PointerEvent } from "react";
import type { MegaColumn } from "./navItems";
import { ArrowUpRightIcon } from "@/components/ui/icons";
import { BOOKING_HREF } from "@/lib/constants";

/**
 * Rendered by DesktopNav for any NAV_ITEMS entry that has `columns`.
 *
 * Visibility is driven by the `open` prop, not by `group-hover` — see the
 * long note in DesktopNav for why the CSS-only version could not close
 * itself after a client-side navigation.
 *
 * `inert` is what keeps a closed panel honest. `invisible` alone hides it
 * visually, but the two states have to agree: `inert` takes the links out
 * of the tab order and out of the accessibility tree together, so a
 * keyboard or screen-reader user can never land inside a panel that is not
 * on screen. It's the same mechanism MobileDrawer uses for the off-canvas
 * drawer, for the same reason.
 *
 * REDESIGN NOTE: the original was a small floating card with a drop
 * shadow. This version drops the shadow and the pill radius for the wide
 * menu, spans the header's full width, and separates columns with hairline
 * rules instead of gaps. A shadowed rounded card reads as a UI widget; a
 * full-width panel with rules reads as a page — which is the difference
 * between a template menu and an editorial one. The closing strip repeats
 * the primary CTA, because someone who opened the treatments menu is the
 * most likely person on the site to want to book.
 */
export default function MegaPanel({
  id,
  columns,
  open,
  onNavigate,
  onPointerEnter,
  onPointerLeave,
  wide = false,
}: {
  id: string;
  columns: MegaColumn[];
  open: boolean;
  onNavigate: () => void;
  /* The panel carries the hover handlers itself as well as inheriting them
     from the item wrapper. Relying on `pointerenter` bubbling up from a
     descendant is what let the panel close while the pointer was moving
     into it — entering the panel now cancels the pending close directly,
     with no dependence on how enter/leave are synthesised. */
  onPointerEnter?: (event: PointerEvent<HTMLDivElement>) => void;
  onPointerLeave?: (event: PointerEvent<HTMLDivElement>) => void;
  wide?: boolean;
}) {
  return (
    <div
      id={id}
      inert={!open}
      onPointerEnter={onPointerEnter}
      onPointerLeave={onPointerLeave}
      className={`absolute top-full z-40 pt-0 transition-[opacity,visibility,transform] duration-300 ease-brand ${
        open ? "visible translate-y-0 opacity-100" : "invisible translate-y-1 opacity-0"
      } ${wide ? "inset-x-0" : "left-1/2 w-max -translate-x-1/2"}`}
    >
      <div
        className={`border-t border-hairline bg-paper ${
          wide ? "border-b" : "rounded-b-edge border-x border-b shadow-panel"
        }`}
      >
        <div className={`mx-auto w-full px-gutter ${wide ? "max-w-page" : ""}`}>
          <div
            className={`grid gap-x-10 py-10 ${
              wide ? "grid-cols-4 divide-x divide-hairline" : "grid-cols-1"
            }`}
          >
            {columns.map((column) => (
              <div key={column.title} className={wide ? "px-6 first:pl-0 last:pr-0" : "min-w-60"}>
                {/* A <div>, not an <h3>: this is a nav group label, not a
                    document heading. As a heading it landed in the
                    outline *above* the page's own <h1> (the header
                    renders first), which reads as a broken hierarchy to
                    both screen readers and crawlers. */}
                <div className="eyebrow text-muted">{column.title}</div>
                <ul className="mt-5 flex flex-col gap-3.5">
                  {column.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        onClick={onNavigate}
                        className="group/link flex flex-col gap-0.5 font-sans text-sm leading-snug text-text transition-colors duration-300 hover:text-primary-strong"
                      >
                        <span className="flex items-center gap-1.5">
                          {link.label}
                          <ArrowUpRightIcon className="h-3 w-3 -translate-x-1 opacity-0 transition-all duration-300 group-hover/link:translate-x-0 group-hover/link:opacity-100" />
                        </span>
                        {link.note && (
                          <span className="font-sans text-micro text-muted">{link.note}</span>
                        )}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {wide && (
            <div className="flex items-center justify-between gap-8 border-t border-hairline py-5">
              <p className="font-sans text-label text-text-secondary">
                Not sure which treatment is right for you? Our doctors will tell you
                honestly.
              </p>
              <Link
                href={BOOKING_HREF}
                onClick={onNavigate}
                className="group/cta inline-flex shrink-0 items-center gap-2 font-sans text-caption font-semibold uppercase tracking-caps-wide text-primary-strong"
              >
                Book a consultation
                <ArrowUpRightIcon className="h-3.5 w-3.5 transition-transform duration-300 ease-brand group-hover/cta:translate-x-0.5 group-hover/cta:-translate-y-0.5" />
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
