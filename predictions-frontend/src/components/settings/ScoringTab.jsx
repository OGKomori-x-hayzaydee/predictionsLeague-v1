import KickerLabel from '../ui/KickerLabel';

// Real numbers — mirrors src/utils/pointsCalculation.js (which itself mirrors
// backend PredictionService.getPredictionScore() exactly), not invented copy.
const SCORING = [
  { val: '15', label: 'Exact scoreline, every scorer named', note: 'the full mark — the only way to reach it is to name them all', fg: 'text-brand-teal' },
  { val: '10', label: 'Exact scoreline', note: 'right result, right numbers, scorers incomplete', fg: 'text-text-secondary' },
  { val: '+2', label: 'Each scorer you call correctly', note: '4 apiece with Scorer Focus played', fg: 'text-text-secondary' },
  { val: '7', label: 'Correct draw called', note: 'draws pay more than a right winner — most sheets never call one', fg: 'text-brand-teal' },
  { val: '5', label: 'Right winner, wrong scoreline', note: 'a win is a win, but the numbers pay', fg: 'text-brand-amber' },
  { val: '0', label: 'Wrong outcome', note: 'no consolation points, no partial credit', fg: 'text-text-muted-5' },
  { val: '−1', label: 'Per goal beyond two off the total', note: 'the goal-difference penalty, applied before chips', fg: 'text-state-error-mid' },
];

// Verbatim from the app's chip-settlement rules (RULES array, Spine script ~line
// 4795) — identical to what the current app's ScoringTab already showed.
const RULES = [
  'Stack as many chips on a match as cooldowns and caps allow, including both multipliers.',
  'Defence++ and All-In Week can both be on in the same gameweek; each spreads to every slip you file.',
  'Multipliers scale scorer points as well as the result, so they reward exact calls.',
  'Defence++ settles before any multiplier is applied.',
  'A chip is reserved when you plan it and only spent when you file that gameweek.',
  'Unplayed chips are worth nothing at the final whistle. They do not carry over.',
];

export default function ScoringTab() {
  return (
    <div className="flex flex-col gap-4">
      <span className="hidden font-mono text-xs tracking-[0.14em] text-text-muted-2 md:inline">
        WHAT A CALL IS WORTH
      </span>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-3">
        {SCORING.map((s) => (
          <div
            key={s.label}
            className="flex gap-4 rounded-[16px] border border-border-base bg-surface-card-3 p-4 md:items-center md:gap-[18px] md:rounded-14 md:border-border-card md:p-5"
          >
            <span className={`w-[52px] shrink-0 font-dmSerif text-3xl leading-none md:w-[64px] ${s.fg}`}>
              {s.val}
            </span>
            <span className="flex min-w-0 flex-1 flex-col gap-1">
              <span className="text-base text-text-secondary [text-wrap:pretty]">{s.label}</span>
              <span className="text-sm leading-[1.5] text-text-muted-3 [text-wrap:pretty] md:text-text-muted-2">
                {s.note}
              </span>
            </span>
          </div>
        ))}
      </div>

      {/* Mobile: rules grouped inside one bordered panel. Desktop: flat divided rows. */}
      <details className="flex flex-col gap-3 rounded-md border border-border-base bg-surface-header p-5 lg:hidden">
        <summary className="min-h-11 cursor-pointer font-outfit text-sm text-text-secondary">House rules</summary>
        {RULES.map((text, i) => (
          <span key={text} className="flex gap-3 text-sm leading-[1.55] text-text-muted-1">
            <span className="shrink-0 font-mono text-xs text-text-muted-5">{i + 1}.</span>
            {text}
          </span>
        ))}
      </details>

      <details className="hidden flex-col gap-1 lg:flex">
        <summary className="mt-3 min-h-11 cursor-pointer">
          <KickerLabel as="span" className="text-sm tracking-[0.14em] text-text-muted-2">
            How chips settle
          </KickerLabel>
        </summary>
        {RULES.map((text, i) => (
          <span key={text} className="flex items-start gap-3.5 border-b border-border-base py-3.5 last:border-b-0">
            <span className="w-5 shrink-0 font-mono text-xs text-text-muted-5">{i + 1}.</span>
            <span className="flex-1 text-base leading-[1.55] text-text-muted-1">{text}</span>
          </span>
        ))}
      </details>
    </div>
  );
}
