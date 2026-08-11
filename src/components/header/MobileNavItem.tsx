"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { NavItem } from "./navItems";
import { ChevronDownIcon } from "@/components/ui/icons";
import { useCollapse } from "@/lib/useCollapse";

/**
 * One row inside MobileDrawer. This needs its own "use client" + useState
 * (every component that calls a hook must declare the directive itself,
 * even though its parent — MobileDrawer — already renders inside a client
 * boundary) because each row's accordion state is independent.
 *
 * `drawerOpen` exists so a row can collapse itself when the drawer closes.
 * Without it, expanding Treatments, tapping a link, and reopening the menu
 * on the next page shows the accordion still expanded and the drawer
 * already scrolled — the menu remembers a state the user has finished
 * with, which reads as the drawer failing to reset rather than as a
 * feature.
 *
 * REDESIGN NOTE: rows are taller, and the expanded submenu animates open
 * (via the shared useCollapse hook, same as the FAQ accordion) instead of
 * appearing instantly. The submenu stays mounted while collapsed rather
 * than being conditionally rendered — the links stay in the DOM and remain
 * crawlable — and `inert` takes them out of the tab order and the
 * accessibility tree together while the row is closed. `tabIndex={-1}`
 * used to do half that job: it removed the links from the tab order but
 * left them exposed to screen readers inside a zero-height panel.
 */
export default function MobileNavItem({
  item,
  drawerOpen,
  onNavigate,
}: {
  item: NavItem;
  drawerOpen: boolean;
  onNavigate: () => void;
}) {
  const [open, setOpen] = useState(false);
  const { wrapperProps, innerProps } = useCollapse(open);

  useEffect(() => {
    if (!drawerOpen) setOpen(false);
  }, [drawerOpen]);

  if (!item.columns) {
    return (
      <Link
        href={item.href}
        onClick={onNavigate}
        className="block border-b border-hairline py-5 font-sans text-copy-lg text-ink transition-colors hover:text-primary"
      >
        {item.label}
      </Link>
    );
  }

  return (
    <div className="border-b border-hairline">
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-4 py-5 text-left font-sans text-copy-lg text-ink"
      >
        {item.label}
        <ChevronDownIcon
          className={`h-4 w-4 shrink-0 text-primary transition-transform duration-300 ease-brand ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      <div {...wrapperProps}>
        <div {...innerProps}>
          <div inert={!open} className="flex flex-col gap-6 pb-6">
            {item.columns.map((column) => (
              <div key={column.title}>
                <div className="eyebrow text-muted">{column.title}</div>
                {/* The spacing moved from the list's `gap` onto each link's
                    padding. Visually identical — same 40px pitch per row —
                    but the whole 40px is now tappable instead of a 20px
                    target with a 20px dead strip between. These are the
                    treatment links, the densest and most-used list on the
                    phone, and they were the only rows in the drawer without
                    padding: the top-level items already had py-5. */}
                <ul className="mt-1 flex flex-col border-l border-hairline pl-4">
                  {column.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        onClick={onNavigate}
                        className="block py-2.5 font-sans text-sm text-text-secondary transition-colors hover:text-primary-strong"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
