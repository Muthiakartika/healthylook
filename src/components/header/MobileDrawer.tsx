import { NAV_ITEMS } from "./navItems";
import MobileNavItem from "./MobileNavItem";
import Button from "@/components/ui/Button";
import { CloseIcon, WhatsAppIcon, PhoneIcon, MailIcon } from "@/components/ui/icons";
import {
  BOOKING_HREF,
  BOOKING_LABEL,
  EMAIL,
  PHONE_DISPLAY,
  PHONE_E164,
  OPENING_HOURS,
  whatsappHref,
} from "@/lib/constants";

/**
 * The slide-out mobile menu. Owns no state itself (`open`/`onClose` are
 * props from Header) — it stays a plain Server Component so only Header and
 * MobileNavItem need "use client".
 *
 * REDESIGN NOTE: the drawer now carries the clinic's contact block at the
 * bottom — WhatsApp, phone, email, opening hours. On mobile the nav drawer
 * is where people go looking for "how do I actually reach these people",
 * and making them close it, scroll to the footer, and find it there is the
 * single most common friction point on a clinic site. Nothing was removed
 * to make room; the panel simply scrolls.
 */
export default function MobileDrawer({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  return (
    <div className={`fixed inset-0 z-50 lg:hidden ${open ? "" : "pointer-events-none"}`}>
      {/* Backdrop: click to close, fades in/out with the panel. */}
      <div
        onClick={onClose}
        aria-hidden="true"
        className={`absolute inset-0 bg-ink-brown/50 backdrop-blur-[2px] transition-opacity duration-500 ${
          open ? "opacity-100" : "opacity-0"
        }`}
      />

      {/* Sliding panel. translate-x-full parks it off-screen to the right
          when closed, so it's still in the DOM (no layout thrash on open)
          but invisible and non-interactive. `inert` (native HTML attribute,
          supported directly as a React 19 prop) is what actually matters
          for accessibility here: without it, a keyboard user could still
          Tab into the links inside this panel while it's sitting off-screen
          and "closed" — a transform alone only affects what's visible, not
          what's focusable. */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation"
        inert={!open}
        className={`absolute right-0 top-0 flex h-full w-[88%] max-w-md flex-col overflow-y-auto bg-paper transition-transform duration-500 ease-brand ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-hairline px-6 py-5">
          <span className="eyebrow text-muted">Menu</span>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close navigation menu"
            className="-mr-2 p-2 text-ink"
          >
            <CloseIcon className="h-6 w-6" />
          </button>
        </div>

        <nav aria-label="Mobile" className="flex-1 px-6">
          {NAV_ITEMS.map((item) => (
            <MobileNavItem
              key={item.label}
              item={item}
              drawerOpen={open}
              onNavigate={onClose}
            />
          ))}
        </nav>

        <div className="mt-8 border-t border-hairline bg-wash px-6 py-7">
          <Button href={BOOKING_HREF} onClick={onClose} className="w-full" size="md">
            {BOOKING_LABEL}
          </Button>

          {/* Padding rather than gap, same reason as the treatment links in
              MobileNavItem: these were 20px-tall rows with 14px of dead space
              between them. Each row is a 40px tap target now and the list
              looks the same. */}
          <ul className="mt-4 flex flex-col font-sans text-label text-text-secondary">
            <li>
              <a
                href={whatsappHref("Hello Healthy Look Aesthetic, I'd like to ask about a treatment.")}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 py-2.5 hover:text-primary"
              >
                <WhatsAppIcon className="h-4 w-4 shrink-0 text-primary" />
                WhatsApp us
              </a>
            </li>
            <li>
              <a href={`tel:${PHONE_E164}`} className="flex items-center gap-3 py-2.5 hover:text-primary">
                <PhoneIcon className="h-4 w-4 shrink-0 text-primary" />
                {PHONE_DISPLAY}
              </a>
            </li>
            <li>
              <a href={`mailto:${EMAIL}`} className="flex items-center gap-3 py-2.5 hover:text-primary">
                <MailIcon className="h-4 w-4 shrink-0 text-primary" />
                {EMAIL}
              </a>
            </li>
          </ul>

          <p className="mt-5 font-sans text-caption text-muted">{OPENING_HOURS}</p>
        </div>
      </div>
    </div>
  );
}
