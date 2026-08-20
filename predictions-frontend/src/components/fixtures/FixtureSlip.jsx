import TeamCrest from '../ui/TeamCrest';
import { buildLedgerRows, namedScorers, slipHeadline, slipSentence } from './predictionLedger';

/**
 * FixtureSlip — supports:
 * 1. `variant="rail"` (Picture 5): The live updating preview slip in the right sidebar.
 * 2. `variant="resting"` / `variant="main"` (Picture 3): The resting filed card with rubber-stamp and edit CTA.
 */
export default function FixtureSlip({
  fixture,
  prediction,
  filed,
  ceiling,
  variant = 'rail',
  onEdit,
  gameweekLabel = 'GW24',
}) {
  if (!fixture) return null;
  const { homeTeam, awayTeam } = fixture;

  const homeScore = prediction?.homeScore ?? 0;
  const awayScore = prediction?.awayScore ?? 0;
  const scorers = namedScorers(prediction?.homeScorers, prediction?.awayScorers);
  const ledger = buildLedgerRows(prediction || {});
  const headline = slipHeadline(homeTeam, awayTeam, homeScore, awayScore);
  const sentence = slipSentence(homeTeam, awayTeam, homeScore, awayScore, prediction?.homeScorers, prediction?.awayScorers);

  // RESTING / MAIN VIEW (Picture 3 - when fixture is filed and resting in center)
  if (variant === 'resting' || variant === 'main') {
    return (
      <div className="relative flex w-full max-w-[600px] flex-col gap-3 overflow-hidden rounded-[16px] border border-[#1c2942] bg-gradient-to-b from-[#0c1424] to-[#080e1a] p-5 shadow-2xl">
        <span className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-brand-teal-mid via-brand-indigo-mid to-brand-amber" />

        {/* Top line */}
        <div className="flex items-baseline justify-between gap-2.5">
          <span className="font-mono text-[10.5px] tracking-[0.14em] text-[#66748c]">
            THE SLIP · {gameweekLabel}
          </span>
          <span className="font-mono text-[10.5px] tracking-[0.12em] text-[#5eead4]">
            FILED 20:41
          </span>
        </div>

        {/* Headline + FILED stamp */}
        <div className="relative pr-16">
          <h2 className="m-0 font-dmSerif text-2xl md:text-[28px] leading-[1.16] text-white" style={{ textWrap: 'pretty' }}>
            {headline}
          </h2>
          <span className="absolute right-0 top-0 rotate-[-8deg] rounded-md border-[2.5px] border-[#14b8a699] px-2.5 py-0.5 font-mono text-xs font-bold tracking-[0.08em] text-[#5eead4]">
            FILED
          </span>
        </div>

        {/* Crests + Scores */}
        <div className="flex items-center justify-center gap-3 py-0.5">
          <TeamCrest team={homeTeam} size={32} />
          <span className="font-dmSerif text-4xl md:text-[44px] leading-none text-white">
            {homeScore}–{awayScore}
          </span>
          <TeamCrest team={awayTeam} size={32} />
        </div>

        <div className="h-px bg-[#16203a]" />

        {/* Scorer pills */}
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

        {/* Ledger & Ceiling */}
        <div className="flex items-center gap-5">
          {ledger.map((row) => (
            <div key={row.label} className="flex flex-col leading-[1.2]">
              <span className="font-mono text-[9.5px] tracking-[0.1em] text-[#5b667d]">{row.label}</span>
              <span className="font-mono text-xs font-medium text-white">{row.value}</span>
            </div>
          ))}

          <div className="ml-auto flex flex-col items-end leading-[1.05]">
            <span className="font-mono text-[9.5px] tracking-[0.14em] text-[#7f93ad]">CEILING</span>
            <span className="font-dmSerif text-2xl text-[#fcd34d]">{ceiling}</span>
          </div>

          {onEdit && (
            <button
              type="button"
              onClick={onEdit}
              className="flex shrink-0 cursor-pointer items-center gap-1.5 rounded-full bg-brand-indigo-mid px-4 py-2 font-outfit text-xs font-semibold text-white transition-colors hover:bg-brand-indigo-hover"
            >
              Edit slip
            </button>
          )}
        </div>
      </div>
    );
  }

  // LIVE PREVIEW SLIP (Picture 5 - Right rail preview while editing)
  return (
    <div className="relative flex w-full flex-col gap-2.5 overflow-hidden rounded-[13px] border border-[#1c2942] bg-gradient-to-b from-[#0c1424] to-[#080e1a] p-4 shadow-xl">
      <span className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-brand-teal-mid via-brand-indigo-mid to-brand-amber" />

      {/* Top line */}
      <div className="flex items-baseline justify-between gap-2">
        <span className="font-mono text-[9.5px] tracking-[0.14em] text-[#66748c]">
          THE SLIP · {gameweekLabel}
        </span>
        <span
          className={`font-mono text-[9.5px] tracking-[0.12em] ${
            filed ? 'text-[#5eead4]' : 'text-brand-amber-mid'
          }`}
        >
          {filed ? 'FILED' : 'UNFILED'}
        </span>
      </div>

      {/* Crests + Score */}
      <div className="flex items-center justify-center gap-3 py-0.5">
        <TeamCrest team={homeTeam} size={24} />
        <span className="font-dmSerif text-3xl leading-none text-white">{homeScore}</span>
        <span className="font-dmSerif text-base text-[#2c3a53]">–</span>
        <span className="font-dmSerif text-3xl leading-none text-white">{awayScore}</span>
        <TeamCrest team={awayTeam} size={24} />
      </div>

      {/* Summary sentence */}
      <p className="m-0 font-outfit text-[11.5px] leading-relaxed text-[#c8d2e0]" style={{ textWrap: 'pretty' }}>
        {sentence}
      </p>

      <div className="h-px bg-[#16203a]" />

      {/* Breakdown rows */}
      <div className="flex flex-col gap-1.5">
        {ledger.map((row) => (
          <div key={row.label} className="flex items-baseline justify-between gap-2 text-[11px] text-[#8fa0b8]">
            <span>{row.label}</span>
            <span className="font-mono text-white">{row.value}</span>
          </div>
        ))}
      </div>

      <div className="h-px bg-[#16203a]" />

      {/* Ceiling */}
      <div className="flex items-end justify-between">
        <span className="text-[11px] text-[#8fa0b8]">If it lands exactly</span>
        <span className="font-dmSerif text-[28px] leading-none text-[#fcd34d]">{ceiling}</span>
      </div>

      <span className="font-mono text-[9px] leading-tight text-[#4f5b70]">
        This slip is what gets filed. Review it, then sign it off.
      </span>
    </div>
  );
}
