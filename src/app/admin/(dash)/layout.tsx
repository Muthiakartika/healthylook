import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { isDatabaseConfigured } from "@/lib/db";
import SignOutButton from "../SignOutButton";
import AdminSidebarNav from "./AdminSidebarNav";

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
  const visibleNav = nav.filter((item) => !item.adminOnly || user.role === "admin");

  return (
    <div className="flex min-h-svh bg-background">
      <aside className="flex w-60 shrink-0 flex-col bg-[var(--color-admin-sidebar)]">
        <Link
          href="/admin"
          className="flex h-16 shrink-0 items-center px-6 font-sans text-caption font-semibold uppercase tracking-caps-wide text-white"
        >
          Healthy Look
        </Link>

        <AdminSidebarNav items={visibleNav} />
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-16 shrink-0 items-center justify-end gap-5 border-b border-hairline bg-paper px-8">
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
        </header>

        <main className="mx-auto w-full max-w-page px-gutter py-10">{children}</main>
      </div>
    </div>
  );
}
