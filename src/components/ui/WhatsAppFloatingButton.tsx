import { WhatsAppIcon } from "@/components/ui/icons";
import { whatsappHref } from "@/lib/constants";

/**
 * The sitewide floating WhatsApp button.
 *
 * ── CLIENT REVISION — A PERSISTENT WHATSAPP BUTTON ON EVERY PAGE ───────
 * "Floating WhatsApp button... appears on ALL pages, fixed position, stays
 * visible while scrolling." Uses the clinic's own existing WhatsApp number
 * from `whatsappHref` — nothing new is hardcoded here.
 *
 * ── WHY THIS IS `lg:flex hidden`, NOT EVERY VIEWPORT ────────────────────
 * Mobile already has a persistent, scroll-visible WhatsApp entry point:
 * <StickyCTA>, the bottom action bar rendered from this same root layout.
 * Showing this bubble there too would be the exact duplicate CTA the brief
 * says to avoid. The breakpoints are deliberately mirror images of each
 * other — StickyCTA is `lg:hidden`, this is `hidden lg:flex` — so the two
 * can never both be on screen: one covers small screens, this covers
 * `lg` and up, and there is no width where neither or both apply.
 *
 * Desktop had no equivalent before this: the header's own WhatsApp icon
 * (see Header.tsx) sits inline in the nav row and behaves like ordinary nav
 * chrome — it scrolls out of the "utility strip" state and isn't the fixed,
 * always-reachable affordance the brief asks for. This bubble is that
 * affordance; the header icon is left as-is since it's a different, smaller
 * thing (inline nav utility) rather than a second copy of this one.
 */
export default function WhatsAppFloatingButton() {
  return (
    <a
      href={whatsappHref(
        "Hello Healthy Look Aesthetic, I'd like to ask about a treatment.",
      )}
      target="_blank"
      rel="noopener noreferrer"
      // Distinct from the header icon's own "Chat with us on WhatsApp"
      // label — both open the same chat, but two different controls on one
      // page sharing an accessible name is its own small accessibility
      // trap for anyone navigating by landmark or label.
      aria-label="Message us on WhatsApp"
      // ── CLIENT REVISION — WHATSAPP'S OWN COLOUR, BOTTOM-RIGHT ─────────
      // Was the clinic's brand colour, bottom-left — reasoned from every
      // other WhatsApp touchpoint on the site using the brand colour
      // instead of WhatsApp's own. The client asked for both explicitly:
      // "warna...seperti warna logo whatsapp yang asli" (WhatsApp's actual
      // colour) and "taruh disebelah kanan" (put it on the right) — the
      // client's own direct instruction outranks that earlier inference.
      // The right-side conflicts this was originally written to dodge
      // (StickyCTA, the footer CTA strip) don't apply here: StickyCTA is
      // mobile-only and this button is desktop-only, and nothing else on
      // this site anchors to the bottom-right corner as a fixed element.
      className="fixed bottom-6 right-6 z-40 hidden h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg shadow-ink/20 transition-transform duration-300 ease-brand hover:scale-105 lg:flex"
    >
      <WhatsAppIcon className="h-7 w-7" />
    </a>
  );
}
