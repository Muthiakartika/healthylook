"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type NavItem = { href: string; label: string };

/**
 * A client component only so the current item can be highlighted —
 * `(dash)/layout.tsx` has to stay a server component for its auth
 * redirects, and `usePathname` is not available there.
 */
export default function AdminSidebarNav({ items }: { items: NavItem[] }) {
  const pathname = usePathname();

  return (
    <nav className="mt-2 flex flex-1 flex-col">
      {items.map((item) => {
        const active =
          item.href === "/admin"
            ? pathname === "/admin"
            : pathname === item.href || pathname.startsWith(`${item.href}/`);

        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={`border-l-[3px] py-2.5 pl-[calc(1.5rem-3px)] pr-6 font-sans text-label transition-colors ${
              active
                ? "border-[var(--color-admin-sidebar-active)] bg-[var(--color-admin-sidebar-hover)] text-white"
                : "border-transparent text-[var(--color-admin-sidebar-text)] hover:bg-[var(--color-admin-sidebar-hover)] hover:text-white"
            }`}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
