"use client";

import { useState } from "react";
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
 * REDESIGN NOTE: rows are taller, and the expanded submenu now animates
 * open (via the shared useCollapse hook, same as the FAQ accordion)
 * instead of appearing instantly. The submenu also stays mounted while
 * collapsed rather than being conditionally rendered — the links stay in
 * the DOM, and `tabIndex={-1}` keeps them out of the tab order while the
 * row is closed.
 */
export default function MobileNavItem({
  item,
  onNavigate,
}: {
  item: NavItem;
  onNavigate: () => void;
}) {
  const [open, setOpen] = useState(false);
  const { wrapperProps, innerProps } = useCollapse(open);

  if (!item.columns) {
    return (
      <Link
        href={item.href}
        onClick={onNavigate}
        className="block border-b border-hairline py-5 font-sans text-[1.0625rem] text-ink transition-colors hover:text-primary"
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
        className="flex w-full items-center justify-between gap-4 py-5 text-left font-sans text-[1.0625rem] text-ink"
      >
        {item.label}
        <ChevronDownIcon
          className={`h-4 w-4 shrink-0 text-primary transition-transform duration-300 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      <div {...wrapperProps}>
        <div {...innerProps}>
          <div className="flex flex-col gap-6 pb-6">
            {item.columns.map((column) => (
              <div key={column.title}>
                <div className="eyebrow text-muted">{column.title}</div>
                <ul className="mt-3 flex flex-col gap-3 border-l border-hairline pl-4">
                  {column.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        onClick={onNavigate}
                        tabIndex={open ? undefined : -1}
                        className="font-sans text-[0.875rem] text-text-secondary transition-colors hover:text-primary"
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
