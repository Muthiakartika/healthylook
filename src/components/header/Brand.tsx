import Link from "next/link";
import Image from "next/image";
import { SITE_NAME } from "@/lib/constants";

/**
 * The clinic's real logo, taken from their own media library.
 *
 * The earlier build had no logo asset and used a text lockup as a
 * stand-in. That's now replaced by the actual mark — which matters more
 * than it sounds, because a wordmark set in a substitute typeface is a
 * quiet form of rebranding, and the brief rules that out explicitly.
 *
 * ── The colour handling ──
 * The source PNG is dark artwork on transparency, so it disappears against
 * the ink hero. `brightness-0 invert` forces any single-colour mark to
 * pure white without needing a second asset from the client. On the solid
 * header it renders untouched, in its real colours.
 *
 * `priority` because the logo is in the first viewport on every page, and
 * a logo that pops in late is the most visible possible loading artifact.
 */
export default function Brand({ tone = "light" }: { tone?: "light" | "dark" }) {
  return (
    <Link
      href="/"
      aria-label={`${SITE_NAME}, home`}
      className="flex shrink-0 items-center"
    >
      <Image
        src="/images/brand/logo.png"
        alt={SITE_NAME}
        width={300}
        height={116}
        priority
        sizes="(max-width: 1024px) 140px, 180px"
        className={`h-11 w-auto transition-[filter] duration-500 lg:h-14 ${
          tone === "dark" ? "brightness-0 invert" : ""
        }`}
      />
    </Link>
  );
}
