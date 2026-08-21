import KickerLabel from '../ui/KickerLabel';
import Card from '../ui/Card';
import Sparkline from '../charts/Sparkline';
import BarRow from '../charts/BarRow';
import TeamCrestGrid from '../ui/TeamCrestGrid';
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

/**
 * Spine.dc.html desktop lines 1476-1539 (rank chart + "where your points
 * come from" + "strongest and weakest ground"). The rank-through-season SVG
 * chart needs historical league-rank-per-gameweek data this app doesn't
 * track anywhere, so it's swapped for the points-per-gameweek sparkline
 * (real data, same "how have I trended" intent). "Strongest/weakest ground"
 * is rebuilt from real per-team accuracy (utils/profileStats.js#computeTeamAccuracy)
 * rather than the prototype's fabricated match-category buckets ("Home
 * favourites", "Derbies", etc.) which this app has no way to compute.
 *
 * Crest cells share the All-time tab's "Who you read well" language so the
 * two team-accuracy views read as the same visualisation on different ground.
 */
export default function RecordTab({ stats, predictions = [] }) {
  const maxPoints = Math.max(1, ...BREAKDOWN_LABELS.map(({ key }) => Math.abs(stats.breakdown[key]?.points ?? 0)));

  const teamAccuracy = computeTeamAccuracy(predictions).filter((t) => t.predictions >= MIN_TEAM_SAMPLE);
  const sortedDesc = [...teamAccuracy].sort((a, b) => b.accuracy - a.accuracy || b.predictions - a.predictions);
  const strongest = sortedDesc.slice(0, 3).map((t) => ({ ...t, tone: 'strong' }));
  const strongestTeams = new Set(strongest.map((t) => t.team));
  const weakest = [...sortedDesc].reverse().filter((t) => !strongestTeams.has(t.team)).slice(0, 3).map((t) => ({ ...t, tone: 'weak' }));

  const gw = stats.pointsByGameweek || [];
  const mid = gw.length ? Math.floor((gw.length - 1) / 2) : 0;
  const chartLabels = gw.length >= 2
    ? [`GW ${gw[0].gameweek}`, gw.length > 2 ? `GW ${gw[mid].gameweek}` : null, `GW ${gw[gw.length - 1].gameweek}`].filter(Boolean)
    : [];

  return (
    <div className="space-y-6">
      <Card className="p-5">
        <div className="mb-3 flex items-baseline justify-between gap-3">
          <KickerLabel>Points by gameweek</KickerLabel>
          {gw.length > 0 && (
            <span className="font-outfit text-2xs tracking-[0.12em] text-brand-teal">
              Average {stats.avgPerWeek} a week
            </span>
          )}
        </div>
        <Sparkline
          data={gw.map((p) => p.points)}
          height={96}
          fill={false}
          grid
          glow
          average={stats.avgPerWeek || undefined}
          labels={chartLabels}
        />
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
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="flex flex-col gap-2.5">
              <span className="font-outfit text-2xs tracking-[0.13em] text-brand-teal">STRONGEST</span>
              {strongest.length === 0 ? (
                <p className="text-xs text-text-muted-3">Not enough data yet.</p>
              ) : (
                <TeamCrestGrid teams={strongest} className="grid-cols-3" />
              )}
            </div>
            <div className="flex flex-col gap-2.5">
              <span className="font-outfit text-2xs tracking-[0.13em] text-[color:var(--state-error-mid)]">WEAKEST</span>
              {weakest.length === 0 ? (
                <p className="text-xs text-text-muted-3">Not enough data yet.</p>
              ) : (
                <TeamCrestGrid teams={weakest} className="grid-cols-3" />
              )}
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
