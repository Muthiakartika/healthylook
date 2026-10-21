/** Permanent URL moves requested by the site owner. */
export const URL_MOVES: Record<string, string> = {
  "/when-to-start-botox-bali": "/when-to-start-botox",
  "/eye-rejuvenaton-treatment": "/ubud-bali/eye-rejuvenaton-treatment",
};

export function canonicalPath(path: string): string {
  return URL_MOVES[path] ?? path;
}

export function legacyPath(path: string): string | undefined {
  return Object.keys(URL_MOVES).find((source) => URL_MOVES[source] === path);
}
