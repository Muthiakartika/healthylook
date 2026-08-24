"use client";

import { usePathname } from "next/navigation";

/**
 * Renders the public site's chrome everywhere except the dashboard.
 *
 * ── WHY NOT ROUTE GROUPS, WHICH IS THE TEXTBOOK ANSWER ────────────────
 * The idiomatic fix is a `(site)` group holding the public routes with the
 * chrome in its layout, and an `(admin)` group without it. That is the
 * better long-term shape and it is worth doing — but it means moving
 * thirteen route folders and the homepage, and it splits `not-found.tsx`:
 * a root-level 404 would lose the header, while a grouped one stops
 * catching URLs that match no group at all.
 *
 * That refactor touches every route in a build with 62 prerendered pages,
 * to solve a problem that has one route on the wrong side of it. This
 * keeps the single root layout and lets the dashboard opt out, which is a
 * change of four lines with nothing else in its blast radius.
 *
 * ── WHAT IT COSTS ─────────────────────────────────────────────────────
 * The wrapped components still render on the server for admin routes and
 * are serialised into the payload before being dropped here. That is a few
 * kilobytes on pages only staff see, behind a login. If /admin ever grows
 * past a handful of routes, do the route-group move and delete this file.
 */
export default function PublicChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  if (pathname?.startsWith("/admin")) return null;
  return <>{children}</>;
}
