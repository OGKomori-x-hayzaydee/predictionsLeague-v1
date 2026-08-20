import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import TeamCrest from '../ui/TeamCrest';
import { buildLedgerRows, namedScorers, slipHeadline, slipSentence } from './predictionLedger';
import {
  FILE_PHASES,
  getBackdropTarget,
  getCardTarget,
  isCelebrationPhase,
  BACKDROP_TRANSITION,
  CARD_TRANSITION,
  CARD_BOUNCE_TRANSITION,
} from './filingChoreography';

// Card is docked `top-5 right-6` (20px/24px) — kept as named constants so
// the measurement math below and the className below can't drift apart.
const DOCK_TOP_PX = 20;
const DOCK_RIGHT_PX = 24;

/**
 * Measures the live translate needed to move the card from its docked
 * top-right slot to sitting centered (both axes) within `paneRef`'s box,
 * recomputed via ResizeObserver whenever either box's size changes —
 * including the card's own height changing as its content swaps between
 * the live-preview and FILED-celebration layouts. This is what replaces
 * the old fixed `-34vw/12vh` guess (see filingChoreography.js) and is the
 * fix for the card visibly drifting off-true-center right as it stamped.
 */
function useMeasuredCenterOffset(paneRef, cardRef) {
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const paneEl = paneRef?.current;
    const cardEl = cardRef.current;
    if (!paneEl || !cardEl) return undefined;

    const recompute = () => {
      const paneRect = paneEl.getBoundingClientRect();
      // offsetWidth/Height (not getBoundingClientRect) so a `scale`
      // transform already applied by Framer Motion doesn't feed back into
      // the measurement — these reflect the untransformed layout box.
      const cardW = cardEl.offsetWidth;
      const cardH = cardEl.offsetHeight;
      const dockCenterX = paneRect.width - DOCK_RIGHT_PX - cardW / 2;
      const dockCenterY = DOCK_TOP_PX + cardH / 2;
      setOffset({
        x: paneRect.width / 2 - dockCenterX,
        y: paneRect.height / 2 - dockCenterY,
      });
    };

    recompute();
    const ro = new ResizeObserver(recompute);
    ro.observe(paneEl);
    ro.observe(cardEl);
    return () => ro.disconnect();
  }, [paneRef, cardRef]);

  return offset;
}

/**
 * The corner-anchored live-preview slip that morphs into the "FILED"
 * celebration, matching Spine.dc.html desktop lines 684-751 / buildReel()'s
 * dimO/cardO/cardT/cardIsHome/cardIsSide (script ~4389-4403).
 *
 * This is the *same* card the whole time: it starts docked top-right as a
 * compact live-preview (cardIsSide), then on file it grows + drifts toward
 * the middle of the page while the backdrop dims, its content swaps to
 * the bigger "FILED" celebration (cardIsHome) once the prediction is
 * actually saved, holds briefly, then fades out in place — revealing the
 * resting slip underneath. It never unmounts, so every step is a Framer
 * Motion `animate` retarget rather than a mount/unmount jump cut; the
 * position/opacity targets themselves come from `filingChoreography.js`
 * so this component and `FixturesPage` can't drift out of sync with each
 * other about what a given `phase` means visually.
 *
 * Framer Motion note: because `animate` is a single object that always
 * reflects "where the card should be right now", changing `phase` (or
 * `shown`) mid-transition — e.g. an API error snapping `center` back to
 * `idle` — simply hands Motion a new target and it retargets the in-flight
 * animation from wherever it currently is. No manual interrupt handling
 * needed on this side; see `useFilingSequence` for the timer-side half of
 * interrupt-safety.
 */
export default function FloatingSlipCard({
  fixture,
  prediction,
  ceiling,
  filed,
  phase = FILE_PHASES.IDLE,
  visible = false,
  isSlow = false,
  gameweekLabel = 'GW24',
  paneRef,
}) {
  const cardRef = useRef(null);
  const centerOffset = useMeasuredCenterOffset(paneRef, cardRef);

  if (!fixture) return null;
  const { homeTeam, awayTeam } = fixture;

  const shown = visible || phase !== FILE_PHASES.IDLE;
  const isCelebration = isCelebrationPhase(phase);
  // Bounce only needs its own snappier timing for the `scale` keyframe
  // array — x/y/opacity keep CARD_TRANSITION's normal arrival easing.
  const cardTransition =
    phase === FILE_PHASES.STAMP
      ? { ...CARD_TRANSITION, scale: CARD_BOUNCE_TRANSITION }
      : CARD_TRANSITION;
  // Only meaningful mid-file, before the stamp lands — a slow `stamp`/
  // `return` phase isn't a thing (those are local timers, not network-bound).
  const showSlowHint = isSlow && phase === FILE_PHASES.CENTER;

  const homeScore = prediction?.homeScore ?? 0;
  const awayScore = prediction?.awayScore ?? 0;
  const scorers = namedScorers(prediction?.homeScorers, prediction?.awayScorers);
  const ledger = buildLedgerRows(prediction || {});
  const headline = slipHeadline(homeTeam, awayTeam, homeScore, awayScore);
  const sentence = slipSentence(
    homeTeam,
    awayTeam,
    homeScore,
    awayScore,
    prediction?.homeScorers,
    prediction?.awayScorers
  );

  return (
    <>
      {/* Backdrop dim — scoped to the fixtures body, not the whole viewport */}
      <motion.div
        className="pointer-events-none absolute inset-0 z-40 bg-[#01030a]"
        initial={false}
        animate={getBackdropTarget(phase)}
        transition={BACKDROP_TRANSITION}
      />

      <motion.div
        className="absolute right-6 top-5 z-50 w-[380px] max-w-[90vw]"
        initial={false}
        animate={getCardTarget(phase, shown, centerOffset)}
        transition={cardTransition}
        style={{ pointerEvents: shown ? 'auto' : 'none' }}
      >
        <div
          ref={cardRef}
          className={`relative flex flex-col gap-3 overflow-hidden rounded-2xl border bg-gradient-to-b from-[#0c1424] to-[#080e1a] p-[17px] pb-[19px] shadow-2xl transition-colors duration-500 ${
            showSlowHint ? 'ring-2 ring-[#fcd34d40] animate-pulse' : ''
          }`}
          style={{ borderColor: filed ? '#14b8a666' : '#22304a' }}
        >
          {/* One-shot light border shimmer as the stamp lands — only
              rendered during the `stamp` phase itself (not `return` too),
              same "remount restarts the CSS animation" trick the FILED
              badge below already relies on. */}
          {phase === FILE_PHASES.STAMP && (
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 rounded-2xl"
              style={{ animation: 'cardShimmer .9s ease-out both' }}
            />
          )}

          {!isCelebration ? (
            <>
              {/* Compact live-preview (cardIsSide) */}
              <div className="flex items-baseline justify-between gap-2.5">
                <span className="font-outfit text-[0.625rem] tracking-wider text-[#66748c]">
                  THE SLIP · {gameweekLabel}
                </span>
                <span
                  className={`flex items-center gap-1.5 font-outfit text-[0.625rem] tracking-wide ${
                    filed ? 'text-[#5eead4]' : 'text-brand-amber-mid'
                  }`}
                >
                  {filed ? 'FILED' : 'UNFILED'}
                  {showSlowHint && <span className="text-[#fcd34d]">· still filing…</span>}
                </span>
              </div>

              <div className="flex items-center justify-center gap-3.5 py-1">
                <TeamCrest team={homeTeam} size={28} />
                <span className="font-dmSerif text-4xl leading-none text-white">{homeScore}</span>
                <span className="font-dmSerif text-lg text-[#2c3a53]">–</span>
                <span className="font-dmSerif text-4xl leading-none text-white">{awayScore}</span>
                <TeamCrest team={awayTeam} size={28} />
              </div>

              <p className="m-0 pr-20 font-outfit text-xs leading-relaxed text-[#c8d2e0]" style={{ textWrap: 'pretty' }}>
                {sentence}
              </p>

              <div className="h-px bg-[#16203a]" />

              <div className="flex flex-col gap-1.5">
                {ledger.map((row) => (
                  <div key={row.label} className="flex items-baseline justify-between gap-2.5 text-xs text-[#8fa0b8]">
                    <span>{row.label}</span>
                    <span className="font-outfit text-white">{row.value}</span>
                  </div>
                ))}
              </div>

              <div className="h-px bg-[#16203a]" />

              <div className="flex items-end justify-between">
                <span className="text-xs text-[#8fa0b8]">If it lands exactly</span>
                <span className="font-dmSerif text-3xl leading-none text-[#fcd34d]">{ceiling}</span>
              </div>

              <span className="font-outfit text-[0.625rem] leading-relaxed text-[#4f5b70]">
                This slip is what gets filed. Review it, then sign it off.
              </span>
            </>
          ) : (
            <>
              {/* Celebration / FILED stamp (cardIsHome) */}
              <div className="relative">
                <div className="flex items-baseline justify-between gap-2.5">
                  <span className="font-outfit text-[0.625rem] tracking-wider text-[#66748c]">
                    THE SLIP · {gameweekLabel}
                  </span>
                  <span className="font-outfit text-[0.625rem] tracking-wide text-[#5eead4]">FILED</span>
                </div>
                <h2 className="m-0 mt-2.5 mr-[70px] font-dmSerif text-[22px] leading-tight text-white" style={{ textWrap: 'pretty' }}>
                  {headline}
                </h2>
                {/* Decorative-only bounce — kept as a plain CSS keyframe
                    (index.css `stampIn`) since it's a small one-shot entrance
                    detail, not on the interrupt-critical phase path. */}
                <span
                  className="absolute right-0 top-0.5 rotate-[-8deg] rounded-md border-[3px] border-[#14b8a699] px-[11px] py-[5px] font-outfit text-[11.5px] font-bold tracking-wider text-[#5eead4]"
                  style={{ animation: 'stampIn .42s cubic-bezier(.2,1.4,.4,1) both' }}
                >
                  FILED
                </span>
              </div>

              <div className="mt-1.5 flex items-center justify-center gap-3.5">
                <TeamCrest team={homeTeam} size={28} />
                <span className="font-dmSerif text-4xl leading-none text-white">
                  {homeScore}–{awayScore}
                </span>
                <TeamCrest team={awayTeam} size={28} />
              </div>

              <div className="mt-1.5 h-px bg-[#16203a]" />

              <div className="mt-1.5 flex flex-wrap justify-center gap-1.5">
                {scorers.length > 0 ? (
                  scorers.map((name, i) => (
                    <span
                      key={`${name}-${i}`}
                      className="flex items-center gap-1.5 rounded-full border border-[#1c2942] bg-[#0b1626] px-2.5 py-1 text-xs text-[#c8d2e0]"
                    >
                      <span className="h-1.5 w-1.5 shrink-0 rounded-full border-[1.5px] border-brand-teal" />
                      {name}
                    </span>
                  ))
                ) : (
                  <span className="font-outfit text-[0.625rem] text-[#4f5b70]">no scorers named</span>
                )}
              </div>

              <div className="mt-1.5 h-px bg-[#16203a]" />

              <div className="mt-1.5 flex items-end justify-between">
                <span className="text-xs text-[#8fa0b8]">If it lands exactly</span>
                <span className="font-dmSerif text-3xl leading-none text-[#fcd34d]">{ceiling}</span>
              </div>
            </>
          )}
        </div>
      </motion.div>
    </>
  );
}
