import KickerLabel from '../ui/KickerLabel';
import Card from '../ui/Card';
import Sparkline from '../charts/Sparkline';
import BarRow from '../charts/BarRow';
import { computeTeamAccuracy } from '../../utils/profileStats';

const BREAKDOWN_LABELS = [
  { key: 'exactScorelines', label: 'Exact scorelines', color: 'var(--brand-teal)' },
  { key: 'correctWinnerOnly', label: 'Right winner only', color: 'var(--brand-indigo-mid)' },
  { key: 'correctDraws', label: 'Correct draws', color: 'var(--brand-indigo)' },
  { key: 'namedScorers', label: 'Named scorers', color: 'var(--brand-amber)' },
  { key: 'chipMultipliers', label: 'Chip multipliers', color: 'var(--brand-teal-deep)' },
  { key: 'goalDifferencePenalties', label: 'Goal-difference penalties', color: 'var(--state-error)' },
];

const MIN_TEAM_SAMPLE = 3;

function GroundRow({ team, tone }) {
  const toneColor = tone === 'strong' ? 'var(--brand-teal)' : 'var(--state-error)';
  return (
    <div className="flex items-center gap-3 rounded-[10px] border border-border-card bg-surface-card-3/60 px-3.5 py-2.5">
      <span className="h-6 w-[3px] shrink-0 rounded-full" style={{ background: toneColor }} />
      <div className="flex min-w-0 flex-1 flex-col leading-tight">
        <span className="truncate text-[12.5px] text-text-secondary">{team.team}</span>
        <span className="font-mono text-[10px] text-text-muted-2">
          {team.predictions} call{team.predictions === 1 ? '' : 's'} · {team.correct} correct
        </span>
      </div>
      <span className="shrink-0 font-dmSerif text-lg" style={{ color: toneColor }}>
        {team.accuracy}%
      </span>
    </div>
  );
}

/**
 * Spine.dc.html desktop lines 1476-1539 (rank chart + "where your points
 * come from" + "strongest and weakest ground"). The rank-through-season SVG
 * chart needs historical league-rank-per-gameweek data this app doesn't
 * track anywhere, so it's swapped for the points-per-gameweek sparkline
 * (real data, same "how have I trended" intent). "Strongest/weakest ground"
 * is rebuilt from real per-team accuracy (utils/profileStats.js#computeTeamAccuracy)
 * rather than the prototype's fabricated match-category buckets ("Home
 * favourites", "Derbies", etc.) which this app has no way to compute.
 */
export default function RecordTab({ stats, predictions = [] }) {
  const maxPoints = Math.max(1, ...BREAKDOWN_LABELS.map(({ key }) => Math.abs(stats.breakdown[key]?.points ?? 0)));

  const teamAccuracy = computeTeamAccuracy(predictions).filter((t) => t.predictions >= MIN_TEAM_SAMPLE);
  const sortedDesc = [...teamAccuracy].sort((a, b) => b.accuracy - a.accuracy || b.predictions - a.predictions);
  const strongest = sortedDesc.slice(0, 3);
  const strongestTeams = new Set(strongest.map((t) => t.team));
  const weakest = [...sortedDesc].reverse().filter((t) => !strongestTeams.has(t.team)).slice(0, 3);

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

      <Card className="p-5">
        <KickerLabel as="div" className="mb-4">Strongest and weakest ground</KickerLabel>
        {teamAccuracy.length === 0 ? (
          <p className="text-sm text-text-muted-2">
            Not enough settled predictions per team yet — this fills in once you've called at least
            {` ${MIN_TEAM_SAMPLE}`} fixtures involving the same side.
          </p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <span className="font-mono text-[10px] tracking-[0.13em] text-text-muted-2">STRONGEST</span>
              {strongest.length === 0 ? (
                <p className="text-xs text-text-muted-3">Not enough data yet.</p>
              ) : (
                strongest.map((t) => <GroundRow key={t.team} team={t} tone="strong" />)
              )}
            </div>
            <div className="flex flex-col gap-2">
              <span className="font-mono text-[10px] tracking-[0.13em] text-text-muted-2">WEAKEST</span>
              {weakest.length === 0 ? (
                <p className="text-xs text-text-muted-3">Not enough data yet.</p>
              ) : (
                weakest.map((t) => <GroundRow key={t.team} team={t} tone="weak" />)
              )}
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
