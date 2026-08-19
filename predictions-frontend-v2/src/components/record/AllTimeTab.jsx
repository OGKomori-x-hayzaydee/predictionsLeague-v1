import KickerLabel from '../ui/KickerLabel';
import Card from '../ui/Card';
import StatTile from '../ui/StatTile';
import BarRow from '../charts/BarRow';
import TeamCrest from '../ui/TeamCrest';
import { computeTeamAccuracy, computeHitRateByOutcome } from '../../utils/profileStats';

const OUTCOME_LABELS = [
  { key: 'exact', label: 'Exact scoreline', color: 'var(--brand-teal)' },
  { key: 'correctDraw', label: 'Correct draw', color: 'var(--brand-indigo)' },
  { key: 'correctWinner', label: 'Right winner only', color: 'var(--brand-indigo-mid)' },
  { key: 'wrong', label: 'Wrong outcome', color: 'var(--state-error)' },
];

export default function AllTimeTab({ stats, predictions }) {
  const hitRate = computeHitRateByOutcome(predictions);
  const teamAccuracy = computeTeamAccuracy(predictions);
  const maxHitRate = Math.max(1, ...OUTCOME_LABELS.map(({ key }) => hitRate[key]));

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatTile label="Lifetime points" value={stats.seasonPoints} />
        <StatTile label="Settled calls" value={stats.totalCompleted} />
        <StatTile
          label="Best week"
          value={stats.bestWeek ? `+${stats.bestWeek.points}` : '—'}
          note={stats.bestWeek ? `GW${stats.bestWeek.gameweek}` : undefined}
        />
        <StatTile label="Chips played" value={stats.chipsPlayed} />
      </div>

      <Card className="p-5">
        <KickerLabel as="div" className="mb-4">Hit rate by outcome</KickerLabel>
        <div className="space-y-4">
          {OUTCOME_LABELS.map(({ key, label, color }) => (
            <BarRow
              key={key}
              label={label}
              value={hitRate[key]}
              max={maxHitRate}
              note={`${hitRate[key]} of ${hitRate.total}`}
              color={color}
            />
          ))}
        </div>
      </Card>

      <Card className="overflow-hidden p-0">
        <KickerLabel as="div" className="px-5 pt-4">Accuracy by team</KickerLabel>
        <div className="divide-y divide-border-base">
          {teamAccuracy.length === 0 && (
            <p className="px-5 py-4 text-sm text-text-muted-2">Not enough settled predictions yet.</p>
          )}
          {teamAccuracy.map((t) => (
            <div key={t.team} className="flex items-center gap-3 px-5 py-3">
              <TeamCrest team={t.team} size={22} />
              <span className="flex-1 text-sm text-text-secondary">{t.team}</span>
              <span className="font-mono text-xs text-text-muted-2">{t.predictions} calls</span>
              <span className="font-dmSerif text-sm text-text-primary">{t.accuracy}%</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
