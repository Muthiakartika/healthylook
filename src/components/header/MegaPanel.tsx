import Link from "next/link";
import type { MegaColumn } from "./navItems";
import { ArrowUpRightIcon } from "@/components/ui/icons";
import { BOOKING_HREF } from "@/lib/constants";

/**
 * Rendered by DesktopNav for any NAV_ITEMS entry that has `columns`.
 *
 * Visibility is pure CSS: the parent in DesktopNav is `group`, and this
 * panel is `invisible opacity-0` by default, flipping to visible on
 * `group-hover` (mouse) or `group-focus-within` (keyboard) — so tabbing to
 * the trigger and then into the panel's links keeps it open with no
 * JavaScript open/close state.
 *
 * REDESIGN NOTE: the original was a small floating card with a drop
 * shadow. This version drops the shadow and the pill radius, spans the
 * header's full width for the treatments menu, and separates columns with
 * hairline rules instead of gaps. A shadowed rounded card reads as a UI
 * widget; a full-width panel with rules reads as a page — which is the
 * difference between a template menu and an editorial one. The closing
 * strip repeats the primary CTA, because a user who opened the treatments
 * menu is the most likely person on the site to want to book.
 */
export default function MegaPanel({
  columns,
  wide = false,
}: {
  columns: MegaColumn[];
  wide?: boolean;
}) {
  return (
    <div
      className={`invisible absolute top-full z-40 pt-0 opacity-0 transition-[opacity,visibility,transform] duration-300 ease-[var(--ease)] translate-y-1 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100 ${
        wide ? "inset-x-0" : "left-1/2 w-max -translate-x-1/2"
      }`}
    >
      <div
        className={`border-t border-hairline bg-paper ${
          wide ? "border-b" : "rounded-b-[2px] border-x border-b shadow-[0_18px_50px_-28px_rgba(42,34,26,0.35)]"
        }`}
      >
        <div
          className={`mx-auto w-full px-[var(--gutter)] ${wide ? "max-w-[1360px]" : ""}`}
        >
          <div
            className={`grid gap-x-10 py-10 ${
              wide ? "grid-cols-4 divide-x divide-hairline" : "grid-cols-1"
            }`}
          >
            {columns.map((column) => (
              <div key={column.title} className={wide ? "px-6 first:pl-0 last:pr-0" : "min-w-[240px]"}>
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
                        className="group/link flex flex-col gap-0.5 font-sans text-[0.875rem] leading-snug text-text transition-colors duration-300 hover:text-primary"
                      >
                        <span className="flex items-center gap-1.5">
                          {link.label}
                          <ArrowUpRightIcon className="h-3 w-3 -translate-x-1 opacity-0 transition-all duration-300 group-hover/link:translate-x-0 group-hover/link:opacity-100" />
                        </span>
                        {link.note && (
                          <span className="font-sans text-[0.6875rem] text-muted">
                            {link.note}
                          </span>
                        )}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {wide && (
            <div className="flex items-center justify-between border-t border-hairline py-5">
              <p className="font-sans text-[0.8125rem] text-text-secondary">
                Not sure which treatment is right for you? Our doctors will tell you
                honestly.
              </p>
              <Link
                href={BOOKING_HREF}
                className="group/cta inline-flex items-center gap-2 font-sans text-[0.75rem] font-semibold uppercase tracking-[0.16em] text-primary"
              >
                Book a consultation
                <ArrowUpRightIcon className="h-3.5 w-3.5 transition-transform duration-300 group-hover/cta:translate-x-0.5 group-hover/cta:-translate-y-0.5" />
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
