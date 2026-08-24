import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE } from "@/lib/auth.shared";

/**
 * Keeps signed-out visitors out of /admin.
 *
 * ── WHAT THIS DELIBERATELY DOES NOT DO ────────────────────────────────
 * It does not check whether the session is VALID, and it does not read
 * the user's role. Middleware runs on the edge runtime, where there is no
 * TCP socket and therefore no `pg` — a database lookup here is not
 * possible without a second, HTTP-based driver.
 *
 * So this is a cheap first gate: no cookie at all means no reason to boot
 * a server component. Every page and every action under /admin still
 * calls requireUser() or requireAdmin(), which is where the real check
 * happens against the database. A forged or expired cookie gets past
 * middleware and is then rejected properly one layer in.
 *
 * Treating middleware as the only gate is the standard way this goes
 * wrong, so it is worth being explicit: it is a redirect for humans, not
 * a security boundary.
 */
export function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  const hasCookie = Boolean(request.cookies.get(SESSION_COOKIE)?.value);

  // The login page is the one place under /admin a guest belongs.
  if (pathname === "/admin/login") {
    if (hasCookie) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
    return NextResponse.next();
  }

  if (!hasCookie) {
    const url = new URL("/admin/login", request.url);
    // Come back to where they were headed once they are in.
    if (pathname !== "/admin") url.searchParams.set("next", pathname + search);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
