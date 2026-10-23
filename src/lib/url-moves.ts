/** Permanent URL moves requested by the site owner. */
export const URL_MOVES: Record<string, string> = {
  "/when-to-start-botox-bali": "/when-to-start-botox",
  "/eye-rejuvenaton-treatment": "/ubud-bali/eye-rejuvenaton-treatment",
};

/**
 * Article URLs that still exist as content but now 301 to another page.
 * The rule itself is written by hand in next.config.ts's redirects(); this
 * list is only what keeps those URLs out of the sitemap and the blog lists,
 * which are built from the content and would otherwise keep offering a
 * page that bounces. Add a path here whenever such a redirect is added.
 *
 * This is not URL_MOVES: a move renames the article's slug through
 * canonicalPath(), whereas these stay what they are and are simply hidden.
 */
export const REDIRECTED_ARTICLE_PATHS: ReadonlySet<string> = new Set([
  "/personalize-mesotherapy-ubud-bali",
]);

export function isRedirectedAway(path: string): boolean {
  return REDIRECTED_ARTICLE_PATHS.has(path.trim().replace(/\/+$/, ""));
}

export function canonicalPath(path: string): string {
  return URL_MOVES[path] ?? path;
}

export function legacyPath(path: string): string | undefined {
  return Object.keys(URL_MOVES).find((source) => URL_MOVES[source] === path);
}
