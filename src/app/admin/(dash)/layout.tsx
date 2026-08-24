import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { isDatabaseConfigured } from "@/lib/db";
import SignOutButton from "../SignOutButton";

/**
 * Everything under /admin except the login page runs inside this.
 *
 * ── THIS IS THE REAL GATE ─────────────────────────────────────────────
 * `middleware.ts` only checks that a cookie exists — it runs on the edge
 * and cannot reach Postgres. The session is validated HERE, against the
 * database, on every request, and a layout is the right place for it
 * because a layout cannot be skipped by a nested route.
 *
 * Individual server actions still call requireUser()/requireAdmin() for
 * themselves. A layout guard protects what is rendered; it does nothing
 * for a POST aimed straight at an action.
 */
export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (!isDatabaseConfigured()) redirect("/admin/login");

  const user = await getCurrentUser();
  if (!user) redirect("/admin/login");

  // A handed-out temporary password must be replaced before anything else
  // is reachable, or it stays in use indefinitely.
  if (user.must_change_password) redirect("/admin/account/password");

  const nav: { href: string; label: string; adminOnly?: boolean }[] = [
    { href: "/admin", label: "Overview" },
    { href: "/admin/articles", label: "Blog articles" },
    { href: "/admin/treatments", label: "Treatments" },
    { href: "/admin/pages", label: "Pages" },
    { href: "/admin/media", label: "Images" },
    { href: "/admin/import", label: "Import", adminOnly: true },
    { href: "/admin/users", label: "Team", adminOnly: true },
  ];

  return (
    <div className="min-h-svh bg-background">
      <header className="border-b border-hairline bg-paper">
        <div className="mx-auto flex w-full max-w-page items-center gap-8 px-gutter py-4">
          <Link
            href="/admin"
            className="font-sans text-caption font-semibold uppercase tracking-caps-wide text-primary-strong"
          >
            Healthy Look
          </Link>

          <nav className="flex flex-1 flex-wrap items-center gap-x-6 gap-y-2">
            {nav
              .filter((item) => !item.adminOnly || user.role === "admin")
              .map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="font-sans text-label text-text-secondary transition-colors hover:text-primary-strong"
                >
                  {item.label}
                </Link>
              ))}
          </nav>

          <div className="flex items-center gap-5">
            <Link
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-sans text-caption uppercase tracking-caps text-muted transition-colors hover:text-primary"
            >
              View site
            </Link>
            <span className="hidden font-sans text-label text-text-secondary sm:inline">
              {user.name}
              <span className="ml-2 text-caption uppercase tracking-caps text-muted">
                {user.role}
              </span>
            </span>
            <SignOutButton />
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-page px-gutter py-10">{children}</main>
    </div>
  );
}
