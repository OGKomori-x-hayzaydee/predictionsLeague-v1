import KickerLabel from '../ui/KickerLabel';

// Real numbers — mirrors src/utils/pointsCalculation.js (which itself mirrors
// backend PredictionService.getPredictionScore() exactly), not invented copy.
const SCORING = [
  { val: '15', label: 'Exact scoreline, every scorer named', note: 'the full mark — the only way to reach it is to name them all', fg: 'text-brand-teal' },
  { val: '10', label: 'Exact scoreline', note: 'right result, right numbers, scorers incomplete', fg: 'text-text-secondary' },
  { val: '+2', label: 'Each scorer you call correctly', note: '4 apiece with Scorer Focus played', fg: 'text-text-secondary' },
  { val: '7', label: 'Correct draw called', note: 'draws pay more than a right winner — most sheets never call one', fg: 'text-brand-indigo-pale' },
  { val: '5', label: 'Right winner, wrong scoreline', note: 'a win is a win, but the numbers pay', fg: 'text-brand-amber' },
  { val: '0', label: 'Wrong outcome', note: 'no consolation points, no partial credit', fg: 'text-text-muted-5' },
  { val: '−1', label: 'Per goal beyond two off the total', note: 'the goal-difference penalty, applied before chips', fg: 'text-state-error-mid' },
];

// Verbatim from the app's chip-settlement rules (RULES array, Spine script ~line
// 4795) — identical to what the current app's ScoringTab already showed.
const RULES = [
  'Two chips to a match at most — never two multipliers on the same one.',
  'One gameweek chip a week. Defence++ and All-In Week cannot share.',
  'Multipliers scale scorer points as well as the result, so they reward exact calls.',
  'Defence++ settles before any multiplier is applied.',
  'A chip is reserved when you plan it and only spent when you file that gameweek.',
  'Unplayed chips are worth nothing at the final whistle. They do not carry over.',
];

export default function ScoringTab() {
  return (
    <div className="flex flex-col gap-[10px] md:gap-[10px]">
      <span className="hidden font-mono text-2xs tracking-[0.14em] text-text-muted-2 md:inline">
        WHAT A CALL IS WORTH
      </span>

      <div className="grid grid-cols-1 gap-[9px] md:grid-cols-2 md:gap-2">
        {SCORING.map((s) => (
          <div
            key={s.label}
            className="flex gap-[13px] rounded-14 border border-border-base bg-surface-card-3 p-[13px] md:items-center md:gap-[14px] md:rounded-11 md:border-border-card md:p-4"
          >
            <span className={`w-[42px] shrink-0 font-dmSerif text-2xl leading-none md:w-[52px] md:text-2xl ${s.fg}`}>
              {s.val}
            </span>
            <span className="flex min-w-0 flex-1 flex-col gap-[3px]">
              <span className="text-caption text-text-secondary [text-wrap:pretty] md:text-caption">{s.label}</span>
              <span className="text-2xs leading-[1.5] text-text-muted-3 [text-wrap:pretty] md:text-2xs md:text-text-muted-2">
                {s.note}
              </span>
            </span>
          </div>
        ))}
      </div>

      {/* Mobile: rules grouped inside one bordered panel. Desktop: flat divided rows. */}
      <div className="flex flex-col gap-[9px] rounded-14 border border-border-base bg-surface-header p-[14px] md:hidden">
        <KickerLabel as="span" className="tracking-[0.14em] text-text-muted-1">House rules</KickerLabel>
        {RULES.map((text, i) => (
          <span key={text} className="flex gap-[9px] text-xs leading-[1.55] text-text-muted-1">
            <span className="shrink-0 font-mono text-2xs text-text-muted-5">{i + 1}.</span>
            {text}
          </span>
        ))}
      </div>

      <div className="hidden flex-col gap-0.5 md:flex">
        <KickerLabel as="span" className="mt-2 tracking-[0.14em] text-text-muted-2">
          How chips settle
        </KickerLabel>
        {RULES.map((text, i) => (
          <span key={text} className="flex items-start gap-[11px] border-b border-border-base py-[10px] last:border-b-0">
            <span className="w-[18px] shrink-0 font-mono text-2xs text-text-muted-5">{i + 1}.</span>
            <span className="flex-1 text-caption leading-[1.55] text-text-muted-1">{text}</span>
          </span>
        ))}
      </div>
    </div>
  );
}
