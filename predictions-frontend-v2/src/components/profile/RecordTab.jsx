import KickerLabel from '../ui/KickerLabel';
import Card from '../ui/Card';
import Sparkline from '../charts/Sparkline';
import BarRow from '../charts/BarRow';

const BREAKDOWN_LABELS = [
  { key: 'exactScorelines', label: 'Exact scorelines', color: 'var(--brand-teal)' },
  { key: 'correctWinnerOnly', label: 'Right winner only', color: 'var(--brand-indigo-mid)' },
  { key: 'correctDraws', label: 'Correct draws', color: 'var(--brand-indigo)' },
  { key: 'namedScorers', label: 'Named scorers', color: 'var(--brand-amber)' },
  { key: 'chipMultipliers', label: 'Chip multipliers', color: 'var(--brand-teal-deep)' },
  { key: 'goalDifferencePenalties', label: 'Goal-difference penalties', color: 'var(--state-error)' },
];

export default function RecordTab({ stats }) {
  const maxPoints = Math.max(1, ...BREAKDOWN_LABELS.map(({ key }) => Math.abs(stats.breakdown[key]?.points ?? 0)));

  return (
    <div className="space-y-6">
      <Card className="p-5">
        <KickerLabel as="div" className="mb-3">Points by gameweek</KickerLabel>
        <Sparkline data={stats.pointsByGameweek.map((p) => p.points)} height={72} />
      </Card>

      <Card className="p-5">
        <KickerLabel as="div" className="mb-4">Where the points come from</KickerLabel>
        <div className="space-y-4">
          {BREAKDOWN_LABELS.map(({ key, label, color }) => {
            const b = stats.breakdown[key];
            return (
              <BarRow
                key={key}
                label={label}
                value={Math.abs(b.points)}
                max={maxPoints}
                note={`${b.calls} call${b.calls === 1 ? '' : 's'} · ${b.points > 0 ? '+' : ''}${b.points} pts`}
                color={color}
              />
            );
          })}
        </div>
      </Card>
    </div>
  );
}
