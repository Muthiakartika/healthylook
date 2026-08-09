import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowRightIcon } from "./icons";

type Variant = "primary" | "dark" | "light" | "outline" | "outlineLight" | "quiet";
type Size = "sm" | "md" | "lg";

type ButtonProps = {
  children: ReactNode;
  href?: string;
  variant?: Variant;
  size?: Size;
  /** Append a small arrow that nudges right on hover. */
  withArrow?: boolean;
  className?: string;
  type?: "button" | "submit";
  onClick?: () => void;
  disabled?: boolean;
  /** For links that leave the site (WhatsApp, Google Maps, socials). */
  external?: boolean;
  "aria-label"?: string;
};

/*
 * REDESIGN NOTE — what changed and what didn't:
 *
 * The near-square 3px corner is KEPT. It was measured from the live site
 * and it's a real piece of the brand's character: it's what makes these
 * read as precise/clinical rather than as a soft consumer pill.
 *
 * What changed is everything around it. Buttons are now wider-tracked,
 * taller, and uppercase at the small end, which is what makes a plain
 * rectangle read as premium rather than as a default form control. There
 * are also light-on-dark variants now, because the redesign introduces
 * dark contrast bands that the original two-variant set couldn't sit on.
 */
const base =
  "group/btn inline-flex items-center justify-center gap-2.5 rounded-[3px] font-sans font-medium " +
  "transition-[background-color,color,border-color,transform] duration-300 ease-[var(--ease)] " +
  "disabled:cursor-not-allowed disabled:opacity-60";

const sizes: Record<Size, string> = {
  sm: "px-5 py-2.5 text-[0.6875rem] uppercase tracking-[0.16em]",
  md: "px-7 py-3.5 text-[0.75rem] uppercase tracking-[0.16em]",
  lg: "px-9 py-4.5 text-[0.8125rem] uppercase tracking-[0.18em]",
};

const variants: Record<Variant, string> = {
  primary: "bg-primary text-white hover:bg-primary-hover",
  dark: "bg-ink text-white hover:bg-primary",
  // Sits on the dark contrast bands — inverts to gold rather than to
  // another neutral, so the brand color still leads the interaction.
  light: "bg-white text-ink hover:bg-secondary hover:text-primary-hover",
  outline: "border border-primary/50 text-primary hover:border-primary hover:bg-primary hover:text-white",
  outlineLight: "border border-white/35 text-white hover:border-white hover:bg-white hover:text-ink",
  // Not a button at all visually — an editorial text link with a rule
  // under it. Used inside cards and lists where a filled button would
  // add too much weight.
  quiet:
    "!px-0 !py-1 border-b border-primary/35 text-primary rounded-none hover:border-primary",
};

export default function Button({
  children,
  href,
  variant = "primary",
  size = "md",
  withArrow = false,
  className = "",
  type = "button",
  onClick,
  disabled = false,
  external = false,
  "aria-label": ariaLabel,
}: ButtonProps) {
  const classes = `${base} ${sizes[size]} ${variants[variant]} ${className}`;

  const content = (
    <>
      {children}
      {withArrow && (
        <ArrowRightIcon className="h-3.5 w-3.5 transition-transform duration-300 ease-[var(--ease)] group-hover/btn:translate-x-1" />
      )}
    </>
  );

  if (href) {
    // External destinations (WhatsApp, Maps, Instagram) get a plain <a>:
    // next/link's client-side routing has nothing to prefetch or
    // intercept for an off-site URL, and `rel="noopener"` matters here.
    if (external) {
      return (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          onClick={onClick}
          aria-label={ariaLabel}
          className={classes}
        >
          {content}
        </a>
      );
    }

    return (
      <Link href={href} onClick={onClick} aria-label={ariaLabel} className={classes}>
        {content}
      </Link>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      className={classes}
    >
      {content}
    </button>
  );
}
