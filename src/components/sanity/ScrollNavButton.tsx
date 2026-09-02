"use client";

/**
 * A working "scroll for more" button for a horizontally-scrolling row —
 * paired with ResultsNavBlock's fade, which is decorative only
 * (pointer-events-none) and can't itself respond to clicks. This is a
 * separate client component so the rest of ContentSections.tsx — mostly
 * server-rendered blocks — doesn't have to become client code just for
 * this one button.
 */
export default function ScrollNavButton({
  targetId,
  direction = "right",
}: {
  targetId: string;
  direction?: "left" | "right";
}) {
  const distance = direction === "left" ? -260 : 260;
  return (
    <button
      type="button"
      aria-label={direction === "left" ? "Scroll back" : "Scroll to see more categories"}
      onClick={() => {
        document.getElementById(targetId)?.scrollBy({ left: distance, behavior: "smooth" });
      }}
      className="pointer-events-auto flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-hairline bg-paper text-text-secondary shadow-sm transition-colors hover:border-primary/50 hover:text-primary-strong"
    >
      <svg
        width="14"
        height="14"
        viewBox="0 0 16 16"
        fill="none"
        aria-hidden="true"
        className={direction === "left" ? "rotate-180" : ""}
      >
        <path
          d="M6 3l5 5-5 5"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}
