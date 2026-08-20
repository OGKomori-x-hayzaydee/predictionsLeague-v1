import TeamCrest from '../ui/TeamCrest';
import { buildLedgerRows, namedScorers, slipHeadline, slipSentence } from './predictionLedger';

/**
 * The "sign & file" spotlight sequence — Spine.dc.html's fileIt() state
 * machine (script ~line 4139-4147) and its file-overlay render block
 * (desktop lines 3701-3767): idle -> center -> stamp -> return -> idle.
 * A dimming scrim plus a floating card that settles to dead-center and
 * swaps its own content the instant the prediction actually lands (from a
 * ledger-breakdown preview to the stamped headline card), then drifts up
 * and fades, handing off to the resting FixtureSlip underneath.
 *
 * Every transform/opacity/duration/easing value here is literal from the
 * prototype. The one deliberate departure: the prototype runs this on a
 * fixed clock (a pure demo with no real network call); FixturesPage instead
 * advances center -> stamp only once the real API call actually succeeds,
 * so this never stamps a prediction that didn't land — see its handleSubmit.
 */
export default function FilingCeremony({ phase, fixture, prediction, ceiling, gameweekLabel }) {
  if (phase === 'idle' || !fixture) return null;

  const { homeTeam, awayTeam } = fixture;
  const isHome = phase === 'stamp' || phase === 'return';
  const dim = phase === 'center' ? 0.66 : phase === 'stamp' ? 1 : 0;
  const cardOpacity = phase === 'return' ? 0 : 1;
  const cardTransform =
    phase === 'center'
      ? 'translate(-50%,-44%) scale(0.96)'
      : phase === 'return'
        ? 'translate(-50%,-56%) scale(0.98)'
        : 'translate(-50%,-50%) scale(1)';

  const homeScore = prediction?.homeScore ?? 0;
  const awayScore = prediction?.awayScore ?? 0;
  const ledger = buildLedgerRows(prediction || {});
  const scorers = namedScorers(prediction?.homeScorers, prediction?.awayScorers);

  return (
    <>
      <div
        className="fixed inset-0 z-[95] bg-[#01030a] pointer-events-none"
        style={{ opacity: dim, transition: 'opacity .6s ease' }}
      />
      <div
        className="fixed left-1/2 top-[47%] z-[96] w-[308px] pointer-events-none"
        style={{
          transform: cardTransform,
          opacity: cardOpacity,
          transition: 'transform .6s cubic-bezier(.34,1.2,.5,1), opacity .34s ease',
        }}
      >
        <div
          className={`relative flex flex-col gap-3 overflow-hidden rounded-[14px] border bg-gradient-to-b from-[#0c1424] to-[#080e1a] p-4 shadow-[0_34px_70px_-26px_#000e] ${
            isHome ? 'border-brand-teal-mid/40' : 'border-border-card'
          }`}
        >
          <span className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-brand-teal-mid via-brand-indigo-mid to-brand-amber" />

          {!isHome ? (
            <>
              <div className="flex items-baseline justify-between gap-2.5">
                <span className="font-mono text-[10px] tracking-[0.14em] text-text-muted-3">
                  THE SLIP{gameweekLabel ? ` · ${gameweekLabel}` : ''}
                </span>
                <span className="font-mono text-[10px] tracking-[0.12em] text-brand-amber-mid">FILING…</span>
              </div>

              <div className="flex items-center justify-center gap-3">
                <TeamCrest team={homeTeam} size={25} />
                <span className="font-dmSerif text-[34px] leading-none text-text-primary">{homeScore}</span>
                <span className="font-dmSerif text-lg text-text-muted-4">–</span>
                <span className="font-dmSerif text-[34px] leading-none text-text-primary">{awayScore}</span>
                <TeamCrest team={awayTeam} size={25} />
              </div>

              <p className="text-xs leading-relaxed text-text-tertiary">
                {slipSentence(homeTeam, awayTeam, homeScore, awayScore, prediction?.homeScorers, prediction?.awayScorers)}
              </p>

              <div className="h-px bg-border-base" />

              <div className="flex flex-col gap-1.5">
                {ledger.map((row) => (
                  <span key={row.label} className="flex items-baseline justify-between gap-2.5 text-xs text-text-muted-1">
                    {row.label}
                    <span className="font-mono text-text-tertiary">{row.value}</span>
                  </span>
                ))}
              </div>

              <div className="h-px bg-border-base" />

              <div className="flex items-end justify-between">
                <span className="text-xs text-text-muted-1">If it lands exactly</span>
                <span className="font-dmSerif text-2xl leading-none text-brand-amber">{ceiling}</span>
              </div>
            </>
          ) : (
            <>
              <div className="relative">
                <div className="flex items-baseline justify-between gap-2.5">
                  <span className="font-mono text-[10px] tracking-[0.14em] text-text-muted-3">
                    THE SLIP{gameweekLabel ? ` · ${gameweekLabel}` : ''}
                  </span>
                  <span className="font-mono text-[10px] tracking-[0.12em] text-brand-teal">FILED</span>
                </div>
                <h2 className="m-0 mt-2 max-w-[78%] font-dmSerif text-lg leading-tight text-text-primary">
                  {slipHeadline(homeTeam, awayTeam, homeScore, awayScore)}
                </h2>
                <span className="absolute right-0 top-0.5 rotate-[-8deg] rounded-6 border-[3px] border-brand-teal-mid/60 px-2.5 py-1 font-mono text-[11px] font-bold tracking-[0.08em] text-brand-teal animate-[stampIn_.42s_cubic-bezier(.2,1.4,.4,1)_both]">
                  FILED
                </span>
              </div>

              <div className="flex items-center justify-center gap-3">
                <TeamCrest team={homeTeam} size={25} />
                <span className="font-dmSerif text-[34px] leading-none text-text-primary">
                  {homeScore}–{awayScore}
                </span>
                <TeamCrest team={awayTeam} size={25} />
              </div>

              <div className="h-px bg-border-base" />

              <div className="flex flex-wrap justify-center gap-1.5">
                {scorers.length > 0 ? (
                  scorers.map((name, i) => (
                    <span
                      key={`${name}-${i}`}
                      className="flex items-center gap-1.5 rounded-full border border-border-card bg-surface-card-3 px-2.5 py-1 text-xs text-text-tertiary"
                    >
                      <span className="h-1.5 w-1.5 shrink-0 rounded-full border-[1.5px] border-brand-teal" />
                      {name}
                    </span>
                  ))
                ) : (
                  <span className="font-mono text-[10.5px] text-text-muted-5">no scorers named</span>
                )}
              </div>

              <div className="h-px bg-border-base" />

              <div className="flex items-end justify-between">
                <span className="text-xs text-text-muted-1">If it lands exactly</span>
                <span className="font-dmSerif text-2xl leading-none text-brand-amber">{ceiling}</span>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
