/**
 * Single source of truth for the prediction-filing animation sequence,
 * consumed by `FloatingSlipCard` (renders the targets) and `FixturesPage`
 * (drives the phase machine + layout/nav side-effects). Matches
 * Spine.dc.html's `fileIt()` (script ~4139-4148) and `buildReel()`'s
 * `dimO`/`cardO`/`cardT`/`cardIsHome`/`cardIsSide` derivations
 * (script ~4389-4403) — see that file for the prototype reference.
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
 * (`shown` — true whenever there's a live, unfiled preview to show).
 * Matches buildReel()'s `cardO`/`cardT`:
 *   - idle + shown:      docked top-right, fully visible
 *   - idle + !shown:     docked top-right, invisible, nudged out (26px)
 *   - center/stamp:      drifted toward center, scaled up 1.08x
 *   - return:            same position, faded to 0
 */
export function getCardTarget(phase, shown) {
  if (phase === FILE_PHASES.RETURN) {
    return { opacity: 0, x: '-34vw', y: '12vh', scale: 1.08 };
  }
  if (isCentredPhase(phase)) {
    return { opacity: 1, x: '-34vw', y: '12vh', scale: 1.08 };
  }
  if (shown) {
    return { opacity: 1, x: 0, y: 0, scale: 1 };
  }
  return { opacity: 0, x: 26, y: 0, scale: 1 };
}

// Split to match the CSS original: transform eases with a slight overshoot
// (cubic-bezier(.34,1.2,.5,1)) over .6s, opacity is a plain .34s ease-out —
// Framer Motion lets us key transitions per-animated-property directly.
export const CARD_TRANSITION = Object.freeze({
  x: { duration: 0.6, ease: [0.34, 1.2, 0.5, 1] },
  y: { duration: 0.6, ease: [0.34, 1.2, 0.5, 1] },
  scale: { duration: 0.6, ease: [0.34, 1.2, 0.5, 1] },
  opacity: { duration: 0.34, ease: 'easeOut' },
});

// Desktop rail-reservation width (the docked card's ~380px + gutter) and
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
export const RAIL_WIDTH_PX = 366;
export const CONTENT_LAYOUT_TRANSITION = { duration: 0.46, ease: [0.4, 0, 0.2, 1] };

// AI panel entrance (replaces the old `slideFromBehind` CSS keyframe —
// this one *is* on the interrupt-critical path, since whether it plays at
// all depends on `phase`, so it's a proper Framer Motion variant rather
// than a hardcoded animation-delay string).
export const AI_PANEL_VARIANTS = Object.freeze({
  hidden: { opacity: 0, y: -24 },
  visible: { opacity: 1, y: 0 },
});
