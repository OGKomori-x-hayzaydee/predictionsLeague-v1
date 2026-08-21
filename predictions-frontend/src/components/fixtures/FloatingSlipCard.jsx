import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import TeamCrest from '../ui/TeamCrest';
import { buildLedgerRows, namedScorers, slipHeadline, slipSentence } from './predictionLedger';
import {
  FILE_PHASES,
  getCardTarget,
  isCelebrationPhase,
  CARD_TRANSITION,
  CARD_BOUNCE_TRANSITION,
} from './filingChoreography';

/**
 * Measures the live translate needed to move the card from its in-flow
 * right-rail box to sitting centered within `paneRef`, recomputed via
 * ResizeObserver. Dock position is the untransformed wrapper, so a scale
 * already applied by Framer Motion does not feed back into the math.
 */
function useMeasuredCenterOffset(paneRef, dockRef, cardRef) {
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const paneEl = paneRef?.current;
    const dockEl = dockRef.current;
    const cardEl = cardRef.current;
    if (!paneEl || !dockEl || !cardEl) return undefined;

    const recompute = () => {
      const paneRect = paneEl.getBoundingClientRect();
      const dockRect = dockEl.getBoundingClientRect();
      const cardW = cardEl.offsetWidth;
      const cardH = cardEl.offsetHeight;
      const dockCenterX = dockRect.left - paneRect.left + cardW / 2;
      const dockCenterY = dockRect.top - paneRect.top + cardH / 2;
      setOffset({
        x: paneRect.width / 2 - dockCenterX,
        y: paneRect.height / 2 - dockCenterY,
      });
    };

    recompute();
    const ro = new ResizeObserver(recompute);
    ro.observe(paneEl);
    ro.observe(dockEl);
    ro.observe(cardEl);
    return () => ro.disconnect();
  }, [paneRef, dockRef, cardRef]);

  return offset;
}

/**
 * In-flow live-preview slip that lifts to center on file, stamps, then
 * returns to the right rail as FILED. Backdrop dim lives on FixturesPage
 * so it can cover the whole pane while this card sits in the rail column.
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
  const dockRef = useRef(null);
  const cardRef = useRef(null);
  const centerOffset = useMeasuredCenterOffset(paneRef, dockRef, cardRef);

  if (!fixture) return null;
  const { homeTeam, awayTeam } = fixture;

  const shown = visible || phase !== FILE_PHASES.IDLE;
  const isCelebration = isCelebrationPhase(phase);
  const cardTransition =
    phase === FILE_PHASES.STAMP
      ? { ...CARD_TRANSITION, scale: CARD_BOUNCE_TRANSITION }
      : CARD_TRANSITION;
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
    <div ref={dockRef} className="relative w-full">
      <motion.div
        className="relative z-50 w-full"
        initial={{ opacity: 1, x: 0, y: 0, scale: 1 }}
        animate={getCardTarget(phase, shown, centerOffset)}
        transition={cardTransition}
        style={{ pointerEvents: shown ? 'auto' : 'none' }}
      >
        <div
          ref={cardRef}
          className={`relative flex flex-col gap-3 overflow-hidden rounded-2xl border bg-gradient-to-b from-[#0c1424] to-[#080e1a] p-[19px] pb-[21px] shadow-2xl transition-colors duration-500 ${
            showSlowHint ? 'ring-2 ring-[#fcd34d40] animate-pulse' : ''
          }`}
          style={{ borderColor: filed ? '#14b8a666' : '#22304a' }}
        >
          {phase === FILE_PHASES.STAMP && (
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 rounded-2xl"
              style={{ animation: 'cardShimmer .9s ease-out both' }}
            />
          )}

          {!isCelebration ? (
            <>
              <div className="flex items-baseline justify-between gap-2.5">
                <span className="font-outfit text-2xs tracking-wider text-[#66748c]">
                  THE SLIP · {gameweekLabel}
                </span>
                <span
                  className={`flex items-center gap-1.5 font-outfit text-2xs tracking-wide ${
                    filed ? 'text-[#5eead4]' : 'text-brand-amber-mid'
                  }`}
                >
                  {filed ? 'FILED' : 'UNFILED'}
                  {showSlowHint && <span className="text-[#fcd34d]">· still filing…</span>}
                </span>
              </div>

              <div className="flex items-center justify-center gap-3.5 py-1">
                <TeamCrest team={homeTeam} size={31} />
                <span className="font-dmSerif text-[2.75rem] leading-none text-white">{homeScore}</span>
                <span className="font-dmSerif text-[1.2375rem] text-[#2c3a53]">–</span>
                <span className="font-dmSerif text-[2.75rem] leading-none text-white">{awayScore}</span>
                <TeamCrest team={awayTeam} size={31} />
              </div>

              <p className="m-0 pr-20 font-outfit text-xs leading-relaxed text-[#c8d2e0]" style={{ textWrap: 'pretty' }}>
                {sentence}
              </p>

              <div className="h-px bg-[#16203a]" />

              <div className="flex flex-col gap-1.5">
                {ledger.map((row) => (
                  <div key={`${row.label}-${row.value}`} className="flex items-baseline justify-between gap-2.5 text-xs text-[#8fa0b8]">
                    <span>{row.label}</span>
                    <span className="font-outfit text-white">{row.value}</span>
                  </div>
                ))}
              </div>

              <div className="h-px bg-[#16203a]" />

              <div className="flex items-end justify-between">
                <span className="text-xs text-[#8fa0b8]">If it lands exactly</span>
                <span className="font-dmSerif text-[2.0625rem] leading-none text-[#fcd34d]">{ceiling}</span>
              </div>

              <span className="font-outfit text-2xs leading-relaxed text-[#4f5b70]">
                This slip is what gets filed. Review it, then sign it off.
              </span>
            </>
          ) : (
            <>
              <div className="relative">
                <div className="flex items-baseline justify-between gap-2.5">
                  <span className="font-outfit text-2xs tracking-wider text-[#66748c]">
                    THE SLIP · {gameweekLabel}
                  </span>
                  <span className="font-outfit text-2xs tracking-wide text-[#5eead4]">FILED</span>
                </div>
                <h2 className="m-0 mt-2.5 mr-[70px] font-dmSerif text-[1.65rem] leading-tight text-white" style={{ textWrap: 'pretty' }}>
                  {headline}
                </h2>
                <span
                  className="absolute right-0 top-0.5 rotate-[-8deg] rounded-md border-[3px] border-[#14b8a699] px-[11px] py-[5px] font-outfit text-2xs font-bold tracking-wider text-[#5eead4]"
                  style={{ animation: 'stampIn .42s cubic-bezier(.2,1.4,.4,1) both' }}
                >
                  FILED
                </span>
              </div>

              <div className="mt-1.5 flex items-center justify-center gap-3.5">
                <TeamCrest team={homeTeam} size={31} />
                <span className="font-dmSerif text-[2.75rem] leading-none text-white">
                  {homeScore}–{awayScore}
                </span>
                <TeamCrest team={awayTeam} size={31} />
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
                  <span className="font-outfit text-2xs text-[#4f5b70]">no scorers named</span>
                )}
              </div>

              <div className="mt-1.5 h-px bg-[#16203a]" />

              <div className="mt-1.5 flex items-end justify-between">
                <span className="text-xs text-[#8fa0b8]">If it lands exactly</span>
                <span className="font-dmSerif text-[2.0625rem] leading-none text-[#fcd34d]">{ceiling}</span>
              </div>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
}
