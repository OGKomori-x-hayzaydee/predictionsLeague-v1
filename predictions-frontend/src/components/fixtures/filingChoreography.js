/**
 * Single source of truth for the prediction-filing animation sequence,
 * consumed by `FloatingSlipCard` (renders the targets) and `FixturesPage`
 * (drives the phase machine + layout/nav side-effects). The phase machine
 * and its timings match Spine.dc.html's `fileIt()` (script ~4139-4148) and
 * `buildReel()`'s `dimO`/`cardIsHome`/`cardIsSide` derivations (script
 * ~4389-4403) — see that file for the prototype reference. The *position*
 * math (`getCardTarget`) deliberately does not match `buildReel()`'s
 * `cardT` verbatim: the prototype hardcodes `translate(-480px,150px)`,
 * tuned for one fixed demo frame, and fades out in place on `return`
 * rather than sliding away — this version measures the real center offset
 * live and slides back out past the dock on exit, per product direction.
 *
 * Phase machine (exactly 4 values, advanced by `useFilingSequence`):
 *
 *   idle -----(review & file)-----> center --(520ms, API resolves)--> stamp
 *   idle <--(2200ms total)-- return <--------------(980ms)------------/
 *
 * `idle` is re-entered either from a fresh page (nothing ever filed) or at
 * the end of a successful run — both read identically here because the
 * *content* shown at idle (live-preview vs. nothing) is driven by the
 * `shown` flag, not by phase.
 */

export const FILE_PHASES = Object.freeze({
  IDLE: 'idle',
  CENTER: 'center',
  STAMP: 'stamp',
  RETURN: 'return',
});

// Mirrors fileIt()'s setTimeout chain: stamp at +520ms, return at +1500ms
// (520 + 980), idle at +2200ms (1500 + 700).
export const FILING_TIMINGS = Object.freeze({
  center: 520,
  stamp: 980,
  return: 700,
});

// How long *beyond* the 520ms center hold we tolerate before flagging the
// in-flight API call as "slow" so the card can show a still-working
// affordance instead of just sitting there looking frozen (confirmed bug
// #4 — the old code had no feedback path for a slow network at all).
export const SLOW_NETWORK_GRACE_MS = 650;

// Prototype's aiSlideAnimDesk/Mob delays (script ~4396-4397) were measured
// from fileIt()'s t=0 (phase -> "center"): .98s (980ms) desktop, 1.5s
// (1500ms) mobile. The AI panel only ever mounts once the resting/filed
// view first appears though — i.e. exactly at the "stamp" phase flip,
// t=520ms (FILING_TIMINGS.center) — so these are re-based to be relative
// to *that* mount instant instead: 980 - 520 = 460ms, 1500 - 520 = 980ms.
export const AI_PANEL_DELAY_MS = Object.freeze({
  desktop: 460,
  mobile: 980,
});

export function isFilingActive(phase) {
  return phase !== FILE_PHASES.IDLE;
}

// cardIsHome — content swaps to the FILED celebration layout.
export function isCelebrationPhase(phase) {
  return phase === FILE_PHASES.STAMP || phase === FILE_PHASES.RETURN;
}

// Card has drifted to (near) center, scaled up.
export function isCentredPhase(phase) {
  return (
    phase === FILE_PHASES.CENTER || phase === FILE_PHASES.STAMP || phase === FILE_PHASES.RETURN
  );
}

/**
 * Backdrop dim target for the current phase (buildReel()'s `dimO`).
 */
export function getBackdropTarget(phase) {
  if (phase === FILE_PHASES.CENTER) return { opacity: 0.66 };
  if (phase === FILE_PHASES.STAMP) return { opacity: 1 };
  return { opacity: 0 };
}

export const BACKDROP_TRANSITION = { duration: 0.6, ease: 'easeInOut' };

/**
 * Floating-card position/opacity target for the current phase, given
 * whether it should be visible at all outside the filing sequence
 * (`shown` — true whenever there's a live, unfiled preview to show) and
 * `centerOffset` — the *measured* `{ x, y }` pixel translate that lands the
 * card's own center on its pane's center, computed by `FloatingSlipCard`
 * from live `getBoundingClientRect()`/`offsetHeight` reads (see its
 * `useMeasuredCenterOffset` effect). This replaces a fixed vw/vh guess
 * (the prototype's own equivalent, `translate(-480px,150px)`, was hand-
 * tuned for one fixed demo frame and doesn't generalize): a static offset
 * is wrong for two reasons — it's relative to the *browser viewport*, not
 * the fixtures pane (which excludes the top nav/sub-nav bars), and it
 * can't react to the card's own height changing between the live-preview
 * content (`cardIsSide`, tall) and the FILED celebration content
 * (`cardIsHome`, shorter) — which is exactly why the card used to visibly
 * drift off-true-center right as it stamped.
 *
 *   - idle + shown:      docked top-right, fully visible
 *   - idle + !shown:     docked top-right, invisible, nudged out (26px)
 *   - center:            translated by `centerOffset`, scaled up 1.08x
 *   - stamp:             same position, a quick whole-card bounce
 *                        (`scale` as a 3-keyframe array — see
 *                        `CARD_BOUNCE_TRANSITION`) plays as it lands
 *   - return:            slides *back out* past the dock and off-frame —
 *                        `centerOffset * CARD_EXIT_FACTOR` (a negative
 *                        factor) reverses the arrival vector and
 *                        overshoots it, continuing the same line past the
 *                        dock and out of the visible pane, while fading —
 *                        instead of fading in place
 */
export function getCardTarget(phase, shown, centerOffset = { x: 0, y: 0 }) {
  const { x: cx, y: cy } = centerOffset;

  if (phase === FILE_PHASES.RETURN) {
    return { opacity: 0, x: cx * CARD_EXIT_FACTOR, y: cy * CARD_EXIT_FACTOR, scale: 1 };
  }
  if (phase === FILE_PHASES.STAMP) {
    // Keyframe array = Framer Motion plays a little scale sequence for
    // this one animate call — the whole-card "reaction" bounce, layered
    // on top of the already-centered position, timed alongside the
    // existing badge `stampIn` CSS bounce (FloatingSlipCard.jsx).
    return { opacity: 1, x: cx, y: cy, scale: [1.08, 1.16, 1.08] };
  }
  if (phase === FILE_PHASES.CENTER) {
    return { opacity: 1, x: cx, y: cy, scale: 1.08 };
  }
  if (shown) {
    return { opacity: 1, x: 0, y: 0, scale: 1 };
  }
  return { opacity: 0, x: 26, y: 0, scale: 1 };
}

// How far past the dock the return-phase exit overshoots, expressed as a
// multiple of the arrival offset (negative = reverse direction). -1 would
// land exactly back at the dock; anything beyond that continues past it
// and off the edge of the pane. See `getCardTarget`'s return-phase comment.
export const CARD_EXIT_FACTOR = -1.55;

// Split to match the CSS original: transform eases with a slight overshoot
// (cubic-bezier(.34,1.2,.5,1)) over .6s, opacity is a plain .34s ease-out —
// Framer Motion lets us key transitions per-animated-property directly.
export const CARD_TRANSITION = Object.freeze({
  x: { duration: 0.6, ease: [0.34, 1.2, 0.5, 1] },
  y: { duration: 0.6, ease: [0.34, 1.2, 0.5, 1] },
  scale: { duration: 0.6, ease: [0.34, 1.2, 0.5, 1] },
  opacity: { duration: 0.34, ease: 'easeOut' },
});

// Overrides just the `scale` leg of CARD_TRANSITION while `phase === stamp`
// — the 3-keyframe bounce array wants a snappier, evenly-spaced timing
// rather than the arrival easing's overshoot curve. Merge over
// CARD_TRANSITION so x/y/opacity keep their normal timing.
export const CARD_BOUNCE_TRANSITION = Object.freeze({
  duration: 0.42,
  ease: 'easeInOut',
});

// Desktop rail-reservation width (the docked card's ~418px + gutter) and
// the transition used to smooth its resize via Framer Motion's `layout`
// projection (FLIP: one reflow at each end, transform-interpolated in
// between) rather than a per-frame `padding-right` CSS transition, which
// forces a full layout recalculation on every animation frame. See
// FixturesPage.jsx for where this is applied — deliberately on the two
// inner panes whose own rect actually narrows (the scrollable content and
// the footer dock), not on their padded parent, since a `flex-1` element
// with `align-items: stretch` keeps its own outer rect constant regardless
// of its own padding value; it's only its children's available width that
// changes.
export const RAIL_WIDTH_PX = 403;
export const CONTENT_LAYOUT_TRANSITION = { duration: 0.46, ease: [0.4, 0, 0.2, 1] };

// AI panel entrance (replaces the old `slideFromBehind` CSS keyframe —
// this one *is* on the interrupt-critical path, since whether it plays at
// all depends on `phase`, so it's a proper Framer Motion variant rather
// than a hardcoded animation-delay string).
export const AI_PANEL_VARIANTS = Object.freeze({
  hidden: { opacity: 0, y: -24 },
  visible: { opacity: 1, y: 0 },
});
