import type { Metadata } from "next";
import Link from "next/link";
import { isDatabaseConfigured } from "@/lib/db";
import LoginForm from "./LoginForm";

export const metadata: Metadata = {
  title: "Sign in",
  // The admin area must never be indexed, and `noindex` in metadata is
  // not enough on its own for a route that also sits behind middleware —
  // but it is the part crawlers that do reach it will honour.
  robots: { index: false, follow: false },
};

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;
  const configured = isDatabaseConfigured();

  return (
    <main className="flex min-h-svh items-center justify-center bg-background px-gutter py-16">
      <div className="w-full max-w-sm">
        <Link
          href="/"
          className="font-sans text-caption uppercase tracking-caps text-muted transition-colors hover:text-primary"
        >
          Healthy Look Aesthetic
        </Link>

        <h1 className="mt-6 font-script text-h2 leading-heading text-primary">
          Content dashboard
        </h1>

        {configured ? (
          <>
            <p className="mt-4 font-sans text-label leading-relaxed text-text-secondary">
              Sign in to edit the site&rsquo;s pages, treatments and articles.
            </p>
            <div className="mt-10">
              <LoginForm next={next ?? "/admin"} />
            </div>
          </>
        ) : (
          /* Saying exactly what is missing, rather than throwing a
             connection error, because the person who sees this screen is
             the one who has to fix it. */
          <div className="mt-8 border-l-2 border-primary bg-wash py-5 pl-5 pr-4">
            <h2 className="font-sans text-copy-lg font-medium text-ink">
              The database is not connected yet
            </h2>
            <p className="mt-3 font-sans text-label leading-relaxed text-text-secondary">
              The public site is unaffected and still serving normally. To turn
              the dashboard on:
            </p>
            <ol className="mt-4 flex list-decimal flex-col gap-2 pl-4 font-sans text-label leading-relaxed text-text-secondary">
              <li>
                Create a free Postgres database at neon.tech and copy its{" "}
                <strong className="text-ink">pooled</strong> connection string.
              </li>
              <li>
                Put it in <code className="text-ink">.env.local</code> as{" "}
                <code className="text-ink">DATABASE_URL</code>.
              </li>
              <li>
                Run <code className="text-ink">npm run db:migrate</code>, then{" "}
                <code className="text-ink">npm run db:admin</code> to create the
                first account.
              </li>
            </ol>
          </div>
        )}
      </div>
    </main>
  );
}
