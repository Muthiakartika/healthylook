import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { default: "Dashboard", template: "%s · Dashboard" },
  robots: { index: false, follow: false },
};

/**
 * The only thing every /admin route shares: it is not for the public.
 *
 * ── WHY THE GUARD IS NOT HERE ─────────────────────────────────────────
 * Putting requireUser() in this layout looks right and is a redirect
 * loop. /admin/login lives under /admin, so a signed-out visitor would be
 * bounced from the login page to the login page forever. The same trap
 * catches /admin/account/password, which the guard redirects to when a
 * temporary password has to be changed — and which cannot itself sit
 * behind that check.
 *
 * So the guard lives in `(dash)/layout.tsx`, a route group that adds no
 * URL segment: /admin still resolves to (dash)/page.tsx. Login and the
 * password screen sit outside it and do their own, narrower checks.
 */
export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
