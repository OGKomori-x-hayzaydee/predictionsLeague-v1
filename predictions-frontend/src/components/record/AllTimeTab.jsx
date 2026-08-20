import KickerLabel from '../ui/KickerLabel';
import Card from '../ui/Card';
import StatTile from '../ui/StatTile';
import Sparkline from '../charts/Sparkline';
import BarRow from '../charts/BarRow';
import TeamCrest from '../ui/TeamCrest';
import { computeTeamAccuracy } from '../../utils/profileStats';
import { computeScorelineHitRates, computeBestWorstWeeks } from '../../utils/recordStats';

/**
 * All-time view — Spine.dc.html desktop lines 846-950 (`REC.isAll`), mobile
 * lines 2720-2804. The prototype mocks a three-season, ranked-league
 * history here; this app only has one season of real prediction data and no
 * historical-rank endpoint (see predictions-backend LeagueController /
 * ProfileController), so the season-by-season comparison and rank
 * trajectory panels are intentionally omitted rather than faked — every
 * section below is a genuine aggregate of the user's own settled calls.
 */
export default function AllTimeTab({ predictions, stats }) {
  const teamAccuracy = computeTeamAccuracy(predictions);
  const scorelineHitRates = computeScorelineHitRates(predictions);
  const { best, worst } = computeBestWorstWeeks(stats.pointsByGameweek);
  const trend = stats.pointsByGameweek.map((p) => p.points);

  return (
    <div className="flex flex-col gap-4">
      <h2 className="font-dmSerif text-[25px] leading-tight text-text-primary md:text-[30px]">
        Every week you have ever filed
      </h2>

      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
        <StatTile label="Career points" value={stats.seasonPoints} accent="var(--color-brand-teal)" />
        <StatTile label="Settled calls" value={stats.totalCompleted} />
        <StatTile
          label="Best week"
          value={stats.bestWeek ? `+${stats.bestWeek.points}` : '—'}
          note={stats.bestWeek ? `GW${stats.bestWeek.gameweek}` : undefined}
        />
        <StatTile label="Chips played" value={stats.chipsPlayed} />
      </div>

      <Card className="p-4">
        <div className="mb-2 flex items-baseline justify-between">
          <KickerLabel>Points per settled week</KickerLabel>
          <span className="font-mono text-[10.5px] text-brand-teal">
            {trend.length ? `AVERAGE ${stats.avgPerWeek} A WEEK` : ''}
          </span>
        </div>
        <Sparkline data={trend} height={110} />
      </Card>

      <Card className="p-4">
        <KickerLabel as="div" className="mb-3">Hit rate by scoreline type</KickerLabel>
        <div className="space-y-3">
          {scorelineHitRates.map((s) => (
            <BarRow
              key={s.type}
              label={s.type}
              value={s.pct}
              max={100}
              note={s.n ? `${s.pct}% · ${s.n} call${s.n === 1 ? '' : 's'}` : 'no calls yet'}
              color={s.color}
            />
          ))}
        </div>
      </Card>

      <Card className="p-4">
        <div className="mb-3 flex items-baseline justify-between">
          <KickerLabel>Who you read well</KickerLabel>
          <span className="font-mono text-[9.5px] text-text-muted-4">SHARE OF CALLS CORRECT</span>
        </div>
        {teamAccuracy.length === 0 ? (
          <p className="text-sm text-text-muted-2">Not enough settled predictions yet.</p>
        ) : (
          <div className="grid grid-cols-4 gap-1.5 sm:grid-cols-6">
            {teamAccuracy.map((t) => {
              const strong = t.accuracy >= 60;
              return (
                <div
                  key={t.team}
                  className="flex flex-col items-center gap-1.5 rounded-9 border px-1 py-2.5"
                  style={{
                    background: strong ? 'color-mix(in srgb, var(--brand-teal-deep) 15%, transparent)' : 'var(--surface-card-3)',
                    borderColor: strong ? 'color-mix(in srgb, var(--brand-teal-mid) 35%, transparent)' : 'var(--border-base)',
                  }}
                  title={`${t.team} · ${t.accuracy}% of ${t.predictions} calls`}
                >
                  <TeamCrest team={t.team} size={20} />
                  <span className="font-mono text-[10px]" style={{ color: strong ? 'var(--brand-teal)' : 'var(--text-muted-2)' }}>
                    {t.accuracy}%
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </Card>

      {(best || worst) && (
        <div className="grid grid-cols-1 gap-3.5 pb-1.5 sm:grid-cols-2">
          <div
            className="flex flex-col gap-1.5 rounded-md border p-4"
            style={{ background: 'color-mix(in srgb, var(--brand-teal-deep) 12%, var(--surface-card))', borderColor: 'color-mix(in srgb, var(--brand-teal-mid) 40%, transparent)' }}
          >
            <KickerLabel className="text-brand-teal">Best week on record</KickerLabel>
            <span className="font-dmSerif text-xl leading-tight text-text-primary">
              {best ? `Gameweek ${best.gameweek} · ${best.points} points` : '—'}
            </span>
          </div>
          <div
            className="flex flex-col gap-1.5 rounded-md border p-4"
            style={{ background: 'color-mix(in srgb, var(--state-error) 10%, var(--surface-card))', borderColor: 'color-mix(in srgb, var(--state-error-mid) 35%, transparent)' }}
          >
            <KickerLabel className="text-[color:var(--state-error-mid)]">Worst week on record</KickerLabel>
            <span className="font-dmSerif text-xl leading-tight text-text-primary">
              {worst ? `Gameweek ${worst.gameweek} · ${worst.points} points` : '—'}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
