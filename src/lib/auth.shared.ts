/**
 * The handful of auth values that both runtimes need.
 *
 * `auth.ts` imports `server-only` and `node:crypto`, neither of which
 * exists in the edge runtime that middleware runs in. Importing it from
 * middleware fails the build. This file holds only what is safe
 * everywhere — no crypto, no database, no Node built-ins — so the cookie
 * name has exactly one definition rather than being typed out twice and
 * drifting.
 */
export const SESSION_COOKIE = "hla_session";

export type Role = "admin" | "editor";
