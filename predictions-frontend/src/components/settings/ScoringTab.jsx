import Card from '../ui/Card';
import KickerLabel from '../ui/KickerLabel';

const SCORING_ROWS = [
  { label: 'Exact scoreline, every scorer named', points: '15' },
  { label: 'Exact scoreline (scorers incomplete)', points: '10' },
  { label: 'Each scorer named correctly', points: '+2 (+4 with Scorer Focus)' },
  { label: 'Correct draw called', points: '7' },
  { label: 'Right winner, wrong scoreline', points: '5' },
  { label: 'Wrong outcome', points: '0' },
  { label: 'Per goal beyond two, off the total (before chips)', points: '−1' },
];

const CHIP_RULES = [
  'Two chips max per match, never two multipliers on one.',
  'One gameweek-level chip per week; Defence++ and All-In Week cannot share a week.',
  'Multipliers scale scorer points too, not just result points.',
  'Defence++ settles before any multiplier is applied.',
  'A chip is reserved when planned, only spent when that gameweek is filed.',
  'Unplayed chips expire worthless at season end — no carryover.',
];

export default function ScoringTab() {
  return (
    <div className="space-y-6">
      <Card className="overflow-hidden p-0">
        <KickerLabel as="div" className="px-5 pt-4">Scoring</KickerLabel>
        <div className="divide-y divide-border-base">
          {SCORING_ROWS.map((row) => (
            <div key={row.label} className="flex items-center justify-between gap-4 px-5 py-3">
              <span className="text-sm text-text-secondary">{row.label}</span>
              <span className="font-dmSerif text-base text-text-primary">{row.points}</span>
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-5">
        <KickerLabel as="div" className="mb-3">Chip rules</KickerLabel>
        <ol className="space-y-2 text-sm text-text-secondary">
          {CHIP_RULES.map((rule, i) => (
            <li key={i} className="flex gap-2">
              <span className="font-mono text-xs text-text-muted-3">{i + 1}.</span>
              {rule}
            </li>
          ))}
        </ol>
      </Card>
    </div>
  );
}
