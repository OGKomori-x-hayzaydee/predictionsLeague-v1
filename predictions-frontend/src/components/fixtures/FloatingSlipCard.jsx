import TeamCrest from '../ui/TeamCrest';
import { buildLedgerRows, namedScorers, slipHeadline, slipSentence } from './predictionLedger';

/**
 * The corner-anchored live-preview slip that morphs into the "FILED" stamp
 * ceremony, matching Spine.dc.html desktop lines 684-751 / buildReel()'s
 * dimO/cardO/cardT/cardIsHome/cardIsSide (script ~4389-4403).
 *
 * Unlike a fixed centered modal, this is the *same* card the whole time:
 * it starts docked top-right as a compact live-preview ("rail"/cardIsSide),
 * then on file it grows + drifts toward the middle of the page while the
 * backdrop dims, its content swaps to the bigger "FILED" celebration
 * (cardIsHome) once the prediction is actually saved, holds briefly, then
 * fades out in place — revealing the resting slip underneath. It never
 * unmounts while `phase !== 'idle'`, so every step is a CSS transition
 * rather than a mount/unmount jump cut.
 */
export default function FloatingSlipCard({
  fixture,
  prediction,
  ceiling,
  filed,
  phase = 'idle',
  visible = false,
  gameweekLabel = 'GW24',
}) {
  if (!fixture) return null;
  const { homeTeam, awayTeam } = fixture;

  const centred = phase === 'center' || phase === 'stamp';
  const nearCenter = centred || phase === 'return';
  const shown = visible || phase !== 'idle';
  const isHome = phase === 'stamp' || phase === 'return';

  const dim = phase === 'center' ? 0.66 : phase === 'stamp' ? 1 : 0;
  const cardOpacity = phase === 'return' ? 0 : centred || shown ? 1 : 0;
  const cardTransform = nearCenter
    ? 'translate(-34vw, 12vh) scale(1.08)'
    : shown
      ? 'none'
      : 'translateX(26px)';

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
      <div
        className="pointer-events-none absolute inset-0 z-40 bg-[#01030a]"
        style={{ opacity: dim, transition: 'opacity .6s ease' }}
      />

      <div
        className="absolute right-6 top-5 z-50 w-[380px] max-w-[90vw]"
        style={{
          opacity: cardOpacity,
          transform: cardTransform,
          pointerEvents: shown ? 'auto' : 'none',
          transition: 'transform .6s cubic-bezier(.34,1.2,.5,1), opacity .34s ease',
        }}
      >
        <div
          className="relative flex flex-col gap-3 overflow-hidden rounded-2xl border bg-gradient-to-b from-[#0c1424] to-[#080e1a] p-[17px] pb-[19px] shadow-2xl transition-colors duration-500"
          style={{ borderColor: filed ? '#14b8a666' : '#22304a' }}
        >
          {!isHome ? (
            <>
              {/* Compact live-preview (cardIsSide) */}
              <div className="flex items-baseline justify-between gap-2.5">
                <span className="font-mono text-[0.625rem] tracking-wider text-[#66748c]">
                  THE SLIP · {gameweekLabel}
                </span>
                <span
                  className={`font-mono text-[0.625rem] tracking-wide ${
                    filed ? 'text-[#5eead4]' : 'text-brand-amber-mid'
                  }`}
                >
                  {filed ? 'FILED' : 'UNFILED'}
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
                    <span className="font-mono text-white">{row.value}</span>
                  </div>
                ))}
              </div>

              <div className="h-px bg-[#16203a]" />

              <div className="flex items-end justify-between">
                <span className="text-xs text-[#8fa0b8]">If it lands exactly</span>
                <span className="font-dmSerif text-3xl leading-none text-[#fcd34d]">{ceiling}</span>
              </div>

              <span className="font-mono text-[0.625rem] leading-relaxed text-[#4f5b70]">
                This slip is what gets filed. Review it, then sign it off.
              </span>
            </>
          ) : (
            <>
              {/* Celebration / FILED stamp (cardIsHome) */}
              <div className="relative">
                <div className="flex items-baseline justify-between gap-2.5">
                  <span className="font-mono text-[0.625rem] tracking-wider text-[#66748c]">
                    THE SLIP · {gameweekLabel}
                  </span>
                  <span className="font-mono text-[0.625rem] tracking-wide text-[#5eead4]">FILED</span>
                </div>
                <h2 className="m-0 mt-2.5 mr-[70px] font-dmSerif text-[22px] leading-tight text-white" style={{ textWrap: 'pretty' }}>
                  {headline}
                </h2>
                <span
                  className="absolute right-0 top-0.5 rotate-[-8deg] rounded-md border-[3px] border-[#14b8a699] px-[11px] py-[5px] font-mono text-[11.5px] font-bold tracking-wider text-[#5eead4]"
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
                  <span className="font-mono text-[0.625rem] text-[#4f5b70]">no scorers named</span>
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
      </div>
    </>
  );
}
