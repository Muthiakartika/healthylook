import type { ElementType, ReactNode } from "react";

type Width = "default" | "wide" | "narrow";

// Shared width wrapper used by every section on every page (including the
// Footer). Centralizing "how wide is the page" here means every section's
// left/right edges line up automatically.
//
// REDESIGN NOTE: the original had a single 1280px width. Editorial layouts
// need more than one measure — a wide track for cinematic image bands, and
// a narrow one for long-form clinical copy that shouldn't run to 1280px —
// so `width` now picks between three, and the horizontal padding comes from
// the shared `--gutter` token so it scales with the section rhythm instead
// of stepping at breakpoints.
const widths: Record<Width, string> = {
  default: "max-w-page",
  wide: "max-w-wide",
  narrow: "max-w-narrow",
};

export default function Container({
  children,
  width = "default",
  as: Tag = "div",
  className = "",
  id,
}: {
  children: ReactNode;
  width?: Width;
  as?: ElementType;
  className?: string;
  id?: string;
}) {
  return (
    <Tag
      id={id}
      className={`mx-auto w-full ${widths[width]} px-gutter ${className}`}
    >
      {children}
    </Tag>
  );
}
