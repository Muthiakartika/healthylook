import Link from "next/link";
import { NAV_ITEMS } from "./navItems";
import MegaPanel from "./MegaPanel";
import { ChevronDownIcon } from "@/components/ui/icons";

/**
 * Desktop-only horizontal nav (hidden below `lg`, where MobileDrawer takes
 * over). No hooks: hover/keyboard-focus reveal of MegaPanel is handled
 * entirely in CSS via the `group` class, so this stays a plain Server
 * Component even though it renders inside Header's client boundary.
 *
 * REDESIGN NOTE: the link treatment changed from a color-swap hover to an
 * underline that wipes in from the left. A moving rule reads as considered
 * where a color change reads as a default link state, and it's the same
 * gesture used on the editorial text links further down the page — one
 * hover language for the whole site.
 */
export default function DesktopNav({ tone = "light" }: { tone?: "light" | "dark" }) {
  const dark = tone === "dark";
  const linkColor = dark ? "text-white/90 hover:text-white" : "text-text hover:text-primary";
  const ruleColor = dark ? "bg-white" : "bg-primary";

  return (
    <nav aria-label="Main" className="hidden items-center gap-9 lg:flex">
      {NAV_ITEMS.map((item) => {
        const inner = (
          <>
            <span className="relative">
              {item.label}
              <span
                className={`absolute -bottom-1.5 left-0 h-px w-0 transition-[width] duration-400 ease-[var(--ease)] group-hover:w-full group-focus-within:w-full ${ruleColor}`}
                aria-hidden="true"
              />
            </span>
            {item.columns && (
              <ChevronDownIcon className="h-3 w-3 transition-transform duration-300 group-hover:rotate-180" />
            )}
          </>
        );

        return (
          // `static` on the wide (Treatments) item only: it drops the
          // positioning context down to the fixed <header>, which is what
          // lets that one panel span the full header width. Every other
          // item stays `relative` so its panel hangs directly beneath it.
          <div key={item.label} className={item.wide ? "group static" : "group relative"}>
            {item.columns ? (
              <button
                type="button"
                aria-haspopup="true"
                className={`flex items-center gap-1.5 whitespace-nowrap font-sans text-[0.8125rem] font-medium tracking-wide transition-colors duration-300 ${linkColor}`}
              >
                {inner}
              </button>
            ) : (
              <Link
                href={item.href}
                className={`flex items-center gap-1.5 whitespace-nowrap font-sans text-[0.8125rem] font-medium tracking-wide transition-colors duration-300 ${linkColor}`}
              >
                {inner}
              </Link>
            )}
            {item.columns && <MegaPanel columns={item.columns} wide={item.wide} />}
          </div>
        );
      })}
    </nav>
  );
}
