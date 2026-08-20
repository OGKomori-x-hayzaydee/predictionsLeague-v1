import TeamCrest from '../ui/TeamCrest';
import { buildLedgerRows, namedScorers, slipHeadline, slipSentence } from './predictionLedger';

function formatKickoff(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return '';
  const day = d.toLocaleDateString(undefined, { weekday: 'short' });
  const time = d.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit', hour12: false });
  return `${day} ${time}`;
}

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
  deadlineLabel,
  onFile,
}) {
  if (!fixture) return null;
  const { homeTeam, awayTeam, date } = fixture;

  const homeScore = prediction?.homeScore ?? 0;
  const awayScore = prediction?.awayScore ?? 0;
  const scorers = namedScorers(prediction?.homeScorers, prediction?.awayScorers);
  const ledger = buildLedgerRows(prediction || {});
  const headline = slipHeadline(homeTeam, awayTeam, homeScore, awayScore);
  const sentence = slipSentence(homeTeam, awayTeam, homeScore, awayScore, prediction?.homeScorers, prediction?.awayScorers);

  // RESTING / MAIN VIEW (Picture 3 - when fixture is filed and resting in center)
  if (variant === 'resting' || variant === 'main') {
    return (
      <div className="relative flex w-full max-w-[640px] flex-col gap-4 overflow-hidden rounded-[20px] border border-[#1c2942] bg-gradient-to-b from-[#0c1424] to-[#080e1a] p-7 shadow-2xl">
        <span className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-brand-teal-mid via-brand-indigo-mid to-brand-amber" />

        {/* Top line */}
        <div className="flex items-baseline justify-between gap-2.5">
          <span className="font-mono text-[11px] tracking-[0.14em] text-[#66748c]">
            THE SLIP · {gameweekLabel}
          </span>
          <span className="font-mono text-[11px] tracking-[0.12em] text-[#5eead4]">
            FILED 20:41
          </span>
        </div>

        {/* Headline + FILED stamp */}
        <div className="relative pr-20">
          <h2 className="m-0 font-dmSerif text-[32px] leading-[1.16] text-white" style={{ textWrap: 'pretty' }}>
            {headline}
          </h2>
          <span className="absolute right-0 top-0.5 rotate-[-8deg] rounded-md border-[3px] border-[#14b8a699] px-3.5 py-1 font-mono text-sm font-bold tracking-[0.08em] text-[#5eead4]">
            FILED
          </span>
        </div>

        {/* Crests + Scores */}
        <div className="flex items-center justify-center gap-4 py-1">
          <TeamCrest team={homeTeam} size={36} />
          <span className="font-dmSerif text-[52px] leading-none text-white">
            {homeScore}–{awayScore}
          </span>
          <TeamCrest team={awayTeam} size={36} />
        </div>

        <div className="h-px bg-[#16203a]" />

        {/* Scorer pills */}
        <div className="flex flex-wrap justify-center gap-2">
          {scorers.length > 0 ? (
            scorers.map((name, i) => (
              <span
                key={`${name}-${i}`}
                className="flex items-center gap-2 rounded-full border border-[#1c2942] bg-[#0b1626] px-3 py-1.5 text-[13px] text-[#c8d2e0]"
              >
                <span className="h-1.5 w-1.5 shrink-0 rounded-full border-[1.5px] border-brand-teal" />
                {name}
              </span>
            ))
          ) : (
            <span className="font-mono text-[11px] text-[#4f5b70]">no scorers named</span>
          )}
        </div>

        <div className="h-px bg-[#16203a]" />

        {/* Ledger & Ceiling */}
        <div className="flex items-center gap-6">
          {ledger.map((row) => (
            <div key={row.label} className="flex flex-col leading-[1.3]">
              <span className="font-mono text-[10px] tracking-[0.1em] text-[#5b667d]">{row.label}</span>
              <span className="font-mono text-sm font-medium text-white">{row.value}</span>
            </div>
          ))}

          <div className="ml-auto flex flex-col items-end leading-[1.05]">
            <span className="font-mono text-[10px] tracking-[0.14em] text-[#7f93ad]">CEILING</span>
            <span className="font-dmSerif text-[28px] text-[#fcd34d]">{ceiling}</span>
          </div>

          {onEdit && (
            <button
              type="button"
              onClick={onEdit}
              className="flex shrink-0 cursor-pointer items-center gap-2 rounded-full bg-brand-indigo-mid px-5 py-2.5 font-outfit text-[13px] font-semibold text-white transition-colors hover:bg-brand-indigo-hover"
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
    <div className="relative flex w-full flex-col gap-3.5 overflow-hidden rounded-[14px] border border-[#1c2942] bg-gradient-to-b from-[#0c1424] to-[#080e1a] p-[19px] shadow-[0_34px_70px_-26px_#000e]">
      <span className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-brand-teal-mid via-brand-indigo-mid to-brand-amber" />

      {/* Top line */}
      <div className="flex items-baseline justify-between gap-2.5">
        <span className="font-mono text-[10px] tracking-[0.14em] text-[#66748c]">
          THE SLIP · {gameweekLabel}
        </span>
        <span
          className={`font-mono text-[10px] tracking-[0.12em] ${
            filed ? 'text-[#5eead4]' : 'text-brand-amber-mid'
          }`}
        >
          {filed ? 'FILED' : 'UNFILED'}
        </span>
      </div>

      {/* Crests + Score */}
      <div className="flex items-center justify-center gap-3.5 py-1">
        <TeamCrest team={homeTeam} size={28} />
        <span className="font-dmSerif text-[38px] leading-none text-white">{homeScore}</span>
        <span className="font-dmSerif text-[19px] text-[#2c3a53]">–</span>
        <span className="font-dmSerif text-[38px] leading-none text-white">{awayScore}</span>
        <TeamCrest team={awayTeam} size={28} />
      </div>

      {/* Summary sentence */}
      <p className="m-0 font-outfit text-[12.5px] leading-relaxed text-[#c8d2e0]" style={{ textWrap: 'pretty' }}>
        {sentence}
      </p>

      <div className="h-px bg-[#16203a]" />

      {/* Breakdown rows */}
      <div className="flex flex-col gap-2">
        {ledger.map((row) => (
          <div key={row.label} className="flex items-baseline justify-between gap-2.5 text-xs text-[#8fa0b8]">
            <span>{row.label}</span>
            <span className="font-mono text-white">{row.value}</span>
          </div>
        ))}
      </div>

      <div className="h-px bg-[#16203a]" />

      {/* Ceiling */}
      <div className="flex items-end justify-between">
        <span className="text-xs text-[#8fa0b8]">If it lands exactly</span>
        <span className="font-dmSerif text-[34px] leading-none text-[#fcd34d]">{ceiling}</span>
      </div>

      <span className="font-mono text-[10px] leading-relaxed text-[#4f5b70]">
        This slip is what gets filed. Review it, then sign it off.
      </span>

      {onFile && (
        <button
          type="button"
          onClick={onFile}
          className="mt-1 flex w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-gradient-to-r from-brand-indigo-mid to-brand-indigo px-4 py-3 font-outfit text-sm font-semibold text-white shadow-lg transition-transform active:scale-95"
        >
          Review &amp; file &rarr;
        </button>
      )}
    </div>
  );
}
