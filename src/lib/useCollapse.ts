"use client";

import type { CSSProperties } from "react";

/**
 * Animated collapse/expand for content that must stay mounted.
 *
 * Used by the FAQ accordion and the mobile nav submenus — both cases
 * where the brief requires the content to remain in the DOM (crawlable,
 * findable with Ctrl+F) rather than be unmounted when collapsed.
 *
 * ── Why `grid-template-rows: 0fr → 1fr`
 *
 * It animates to the content's real height without anyone having to
 * measure it or guess a cap. The two alternatives both have a failure
 * mode this doesn't:
 *
 *  - `max-height: 0 → <cap>` silently clips anything taller than the cap,
 *    and runs its easing over the cap rather than the real height, so
 *    short panels appear to snap open.
 *  - Measuring `scrollHeight` into React state and animating between
 *    pixel values needs a ResizeObserver to stay correct across viewport
 *    changes and late-loading webfonts, which is a lot of moving parts —
 *    and state that an observer writes to while a transition reads from
 *    it is easy to get subtly wrong.
 *
 * The `0fr`/`1fr` technique needs the child to establish its own
 * containing block with `overflow: hidden` — that's what `innerProps` is
 * for, and both parts have to be applied together for it to work.
 *
 * ── A note on verifying this
 *
 * The open/close *animation* could not be watched in the dev browser used
 * to build this: that pane doesn't composite frames (`document.hidden`
 * stays true, `requestAnimationFrame` never fires), so every CSS
 * transition on the page sits permanently at its start value. What was
 * verified is the end state — with the transition disabled, panels
 * resolve to their correct content height and collapse back to zero, and
 * `aria-expanded` tracks correctly. Worth knowing before anyone debugs a
 * "stuck" transition here: check whether the tab is actually rendering
 * before changing this file.
 */
export function useCollapse(isOpen: boolean): {
  wrapperProps: { style: CSSProperties };
  innerProps: { style: CSSProperties };
} {
  return {
    wrapperProps: {
      style: {
        display: "grid",
        gridTemplateRows: isOpen ? "1fr" : "0fr",
        transition: "grid-template-rows var(--dur) var(--ease)",
      },
    },
    innerProps: {
      // `min-height: 0` alongside `overflow: hidden` — without it a grid
      // item's automatic minimum size keeps the track from reaching zero,
      // and the panel never fully closes.
      style: { overflow: "hidden", minHeight: 0 },
    },
  };
}
