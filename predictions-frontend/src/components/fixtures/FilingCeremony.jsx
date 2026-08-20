import TeamCrest from '../ui/TeamCrest';
import { buildLedgerRows, namedScorers, slipHeadline, slipSentence } from './predictionLedger';

/**
 * The "sign & file" spotlight sequence (Picture 2 / prototype lines 684-751 & 3701-3767).
 * State machine: idle -> center -> stamp -> return -> idle.
 */
export default function FilingCeremony({ phase, fixture, prediction, ceiling, gameweekLabel = 'GW24' }) {
  if (phase === 'idle' || !fixture) return null;

  const { homeTeam, awayTeam } = fixture;
  const isStamped = phase === 'stamp' || phase === 'return';
  const dim = phase === 'center' ? 0.66 : phase === 'stamp' ? 0.92 : 0;
  const cardOpacity = phase === 'return' ? 0 : 1;
  const cardTransform =
    phase === 'center'
      ? 'translate(-50%, -46%) scale(0.98)'
      : phase === 'return'
        ? 'translate(-50%, -54%) scale(0.98)'
        : 'translate(-50%, -50%) scale(1)';

  const homeScore = prediction?.homeScore ?? 0;
  const awayScore = prediction?.awayScore ?? 0;
  const ledger = buildLedgerRows(prediction || {});
  const scorers = namedScorers(prediction?.homeScorers, prediction?.awayScorers);
  const headline = slipHeadline(homeTeam, awayTeam, homeScore, awayScore);
  const sentence = slipSentence(homeTeam, awayTeam, homeScore, awayScore, prediction?.homeScorers, prediction?.awayScorers);

  return (
    <>
      {/* Dark dimming backdrop */}
      <div
        className="fixed inset-0 z-[95] bg-[#01030a] pointer-events-none"
        style={{ opacity: dim, transition: 'opacity .5s ease' }}
      />

      {/* Floating Center Card */}
      <div
        className="fixed left-1/2 top-1/2 z-[96] w-[360px] pointer-events-none"
        style={{
          transform: cardTransform,
          opacity: cardOpacity,
          transition: 'transform .5s cubic-bezier(.34, 1.2, .5, 1), opacity .3s ease',
        }}
      >
        <div
          className={`relative flex flex-col gap-3.5 overflow-hidden rounded-[16px] border bg-gradient-to-b from-[#0c1424] to-[#080e1a] p-6 shadow-[0_34px_70px_-26px_#000e] ${
            isStamped ? 'border-[#14b8a699]' : 'border-[#1c2942]'
          }`}
        >
          <span className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-brand-teal-mid via-brand-indigo-mid to-brand-amber" />

          {!isStamped ? (
            <>
              {/* Center Pre-Stamp State */}
              <div className="flex items-baseline justify-between gap-2.5">
                <span className="font-mono text-[10px] tracking-[0.14em] text-[#66748c]">
                  THE SLIP · {gameweekLabel}
                </span>
                <span className="font-mono text-[10px] tracking-[0.12em] text-[#fcd34d]">FILING…</span>
              </div>

              <div className="flex items-center justify-center gap-3.5 py-1">
                <TeamCrest team={homeTeam} size={30} />
                <span className="font-dmSerif text-[42px] leading-none text-white">{homeScore}</span>
                <span className="font-dmSerif text-xl text-[#2c3a53]">–</span>
                <span className="font-dmSerif text-[42px] leading-none text-white">{awayScore}</span>
                <TeamCrest team={awayTeam} size={30} />
              </div>

              <p className="m-0 font-outfit text-xs leading-relaxed text-[#c8d2e0]" style={{ textWrap: 'pretty' }}>
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
                <span className="font-dmSerif text-[28px] leading-none text-[#fcd34d]">{ceiling}</span>
              </div>
            </>
          ) : (
            <>
              {/* Stamped State */}
              <div className="relative">
                <div className="flex items-baseline justify-between gap-2.5">
                  <span className="font-mono text-[10px] tracking-[0.14em] text-[#66748c]">
                    THE SLIP · {gameweekLabel}
                  </span>
                  <span className="font-mono text-[10px] tracking-[0.12em] text-[#5eead4]">FILED</span>
                </div>
                <h2 className="m-0 mt-2 max-w-[76%] font-dmSerif text-xl leading-tight text-white" style={{ textWrap: 'pretty' }}>
                  {headline}
                </h2>
                <span className="absolute right-0 top-0 rotate-[-8deg] rounded-md border-[3px] border-[#14b8a699] px-3 py-1 font-mono text-xs font-bold tracking-[0.08em] text-[#5eead4] animate-[stampIn_.42s_cubic-bezier(.2,1.4,.4,1)_both]">
                  FILED
                </span>
              </div>

              <div className="flex items-center justify-center gap-3.5 py-1">
                <TeamCrest team={homeTeam} size={30} />
                <span className="font-dmSerif text-[42px] leading-none text-white">
                  {homeScore}–{awayScore}
                </span>
                <TeamCrest team={awayTeam} size={30} />
              </div>

              <div className="h-px bg-[#16203a]" />

              <div className="flex flex-wrap justify-center gap-1.5">
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
                  <span className="font-mono text-[10.5px] text-[#4f5b70]">no scorers named</span>
                )}
              </div>

              <div className="h-px bg-[#16203a]" />

              <div className="flex items-end justify-between">
                <span className="text-xs text-[#8fa0b8]">If it lands exactly</span>
                <span className="font-dmSerif text-[28px] leading-none text-[#fcd34d]">{ceiling}</span>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
