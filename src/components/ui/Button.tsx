import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowRightIcon } from "./icons";

type Variant =
  | "primary"
  | "accent"
  | "dark"
  | "light"
  | "outline"
  | "outlineLight"
  | "quiet";
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
// NOTE for callers: `inline-flex` here means a plain `hidden` passed via
// `className` will NOT hide the button — the two rules have equal
// specificity and `.inline-flex` wins on stylesheet order. Hide a button
// responsively with a media-query variant (`max-sm:hidden`, `max-lg:hidden`),
// which always beats an unconditional utility.
const base =
  "group/btn inline-flex items-center justify-center gap-2.5 rounded-brand font-sans font-medium " +
  "transition-[background-color,color,border-color,transform] duration-300 ease-brand " +
  "disabled:cursor-not-allowed disabled:opacity-60";

/*
 * `min-h-11` (44px) on every size, not just the small one.
 *
 * Button labels here are 11–13px, so `sm` came out 36–38px tall — fine
 * against WCAG 2.5.8's 24px floor, short of the 44×44 that Apple's HIG and
 * WCAG 2.5.5 ask for. `md` and `lg` already cleared 44 on their padding
 * alone; the floor is declared on all three anyway so that a future type
 * change can't quietly drop one of them back under the bar. `base` already
 * carries `inline-flex items-center justify-center`, so the label stays
 * centred when the minimum is what's setting the height.
 */
const sizes: Record<Size, string> = {
  sm: "min-h-11 px-5 py-2.5 text-micro uppercase tracking-caps-wide",
  md: "min-h-11 px-7 py-3.5 text-caption uppercase tracking-caps-wide",
  lg: "min-h-11 px-9 py-4.5 text-label uppercase tracking-caps-wide",
};

/*
 * Every button label on this site is 11–13px uppercase, which puts all of
 * them under WCAG's small-text bar of 4.5:1 — there is no "it's a button so
 * 3:1 is fine" exemption for the label itself. That one fact decides the
 * whole variant table:
 *
 *   white on --color-primary  (#9b7741)  4.1:1  ✗
 *   white on --color-primary-strong      5.7:1  ✓
 *   white on --color-primary-hover       7.3:1  ✓
 *
 * So the filled and outline variants resolve to the deeper golds. It is the
 * same hue — nobody looking at the page will read it as a different brand
 * colour — and --color-primary keeps its job on rules, icons, borders and
 * display type, where the bar is 3:1 and it clears it comfortably.
 */
const variants: Record<Variant, string> = {
  primary: "bg-primary-strong text-white hover:bg-primary-hover",
  /*
   * The bright warm fill, for the hero and the header CTA sitting over it.
   *
   * The filled variants above are all deep — they have to be, because white
   * on gold needs 4.5:1 and only the darkened golds clear it. That makes
   * them recede on a dark photograph, which is why the hero used to fall
   * back to a plain white button and read colourless. This inverts the
   * relationship instead: the brand's pale gold as the fill, ink as the
   * label. #2b2c27 on #d8c06d is 8.0:1, so it is the one gold button that
   * can be genuinely bright and still pass. Blush on hover keeps the shift
   * inside the warm family rather than jumping to a neutral.
   */
  accent: "bg-accent text-ink hover:bg-blush",
  dark: "bg-ink-brown text-white hover:bg-primary-strong",
  // Sits on the dark contrast bands — inverts to gold rather than to
  // another neutral, so the brand color still leads the interaction.
  light: "bg-white text-ink hover:bg-secondary hover:text-primary-hover",
  outline:
    "border border-primary/50 text-primary-strong hover:border-primary-strong hover:bg-primary-strong hover:text-white",
  outlineLight: "border border-white/35 text-white hover:border-white hover:bg-white hover:text-ink",
  // Not a button at all visually — an editorial text link with a rule
  // under it. Used inside cards and lists where a filled button would
  // add too much weight.
  //
  // The padding is asymmetric on purpose. At `!py-1` this variant measured
  // 22.4px tall, and at `!pt-2` it reached 26.4px — past WCAG 2.5.8's 24px
  // minimum but well under 44px. Symmetric padding is not an option: it
  // would push the bottom border away from the text, and that border IS the
  // design — it's the rule that makes this read as an editorial link rather
  // than a button. So the whole difference goes above the text. `!pt-6`
  // (24px) brings the box to ~45px with the underline sitting exactly where
  // it always did; padding is invisible, so the link looks untouched.
  //
  // `!min-h-0` cancels the `min-h-11` the size classes now set. Without it
  // the floor would win, the box would grow to 44px, and the border would
  // drop to the bottom of that box — precisely the thing this variant's
  // asymmetric padding exists to prevent.
  quiet:
    "!min-h-0 !px-0 !pt-6 !pb-1 border-b border-primary/35 text-primary-strong rounded-none hover:border-primary-strong",
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
        <ArrowRightIcon className="h-3.5 w-3.5 transition-transform duration-300 ease-brand group-hover/btn:translate-x-1" />
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
