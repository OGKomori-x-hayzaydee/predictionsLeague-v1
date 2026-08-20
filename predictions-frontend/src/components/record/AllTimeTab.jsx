import KickerLabel from '../ui/KickerLabel';
import Card from '../ui/Card';
import StatTile from '../ui/StatTile';
import Sparkline from '../charts/Sparkline';
import BarRow from '../charts/BarRow';
import TeamCrest from '../ui/TeamCrest';
import VisualizationsGate from './VisualizationsGate';
import { computeTeamAccuracy } from '../../utils/profileStats';
import { computeScorelineHitRates, computeBestWorstWeeks } from '../../utils/recordStats';

const VIZ_THRESHOLD = 5;

/**
 * Honest "locked" state for a section that needs more real history than
 * exists yet — a ghosted backdrop (so it reads as "there's something here,
 * just not yet" rather than a blank gap) plus a lock glyph and plain-
 * language copy about what unlocks it. See AllTimeTab's doc comment for
 * why this replaced outright omission.
 */
function DataGateTeaser({ icon, text }) {
  return (
    <div className="relative flex min-h-[120px] flex-col items-center justify-center gap-2 overflow-hidden rounded-9 border border-dashed border-border-control px-4 py-6 text-center">
      <span aria-hidden="true" className="pointer-events-none absolute inset-0 flex items-center justify-center text-6xl opacity-[0.04]">
        {icon}
      </span>
      <span aria-hidden="true" className="text-lg text-text-muted-4">🔒</span>
      <p className="max-w-[22em] text-[12.5px] leading-relaxed text-text-muted-3">{text}</p>
    </div>
  );
}

/**
 * All-time view — Spine.dc.html desktop lines 846-950 (`REC.isAll`), mobile
 * lines 2720-2804. The prototype mocks a three-season, ranked-league
 * history here; this app only has one season of real prediction data and no
 * historical-rank endpoint (see predictions-backend LeagueController /
 * ProfileController). Rather than either faking that history OR silently
 * omitting the section, the season-by-season comparison and rank-trajectory
 * panels render as a designed "data gate" teaser (real default) that
 * explains honestly what unlocks it — unless `previewMode` is on, in which
 * case the caller-supplied illustrative `demoSeasonHistory`/
 * `demoRankTrajectory` render the real thing so the page's full populated
 * look is always inspectable on demand. Every other section below is a
 * genuine aggregate of the user's own settled calls regardless of mode.
 *
 * Below `VIZ_THRESHOLD` settled weeks (and not `previewMode`), the *entire*
 * body is replaced by one centralized `VisualizationsGate` message instead
 * of rendering a near-empty stat-tile grid, a near-flat one-point
 * sparkline, and empty hit-rate bars — unlike Season, this tab has no
 * "browse individual weeks" concept to preserve, so a full swap is
 * appropriate here specifically.
 */
export default function AllTimeTab({ predictions, stats, previewMode = false, demoSeasonHistory = [], demoRankTrajectory = [], demoRankNote }) {
  const teamAccuracy = computeTeamAccuracy(predictions);
  const scorelineHitRates = computeScorelineHitRates(predictions);
  const { best, worst } = computeBestWorstWeeks(stats.pointsByGameweek);
  const trend = stats.pointsByGameweek.map((p) => p.points);
  const hasMultiSeason = previewMode && demoSeasonHistory.length > 0;
  const settledWeeks = stats.pointsByGameweek.length;
  const vizGated = !previewMode && settledWeeks < VIZ_THRESHOLD;

  if (vizGated) {
    return (
      <div className="flex flex-col gap-4">
        <h2 className="font-dmSerif text-[25px] leading-tight text-text-primary md:text-[30px]">
          Every week you have ever filed
        </h2>
        <VisualizationsGate settledWeeks={settledWeeks} threshold={VIZ_THRESHOLD} />
      </div>
    );
  }

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

      <Card className="p-5">
        <div className="mb-3 flex items-baseline justify-between">
          <KickerLabel>Points per settled week</KickerLabel>
          <span className="font-outfit text-[10.5px] text-brand-teal">
            {trend.length ? `AVERAGE ${stats.avgPerWeek} A WEEK` : ''}
          </span>
        </div>
        <Sparkline data={trend} height={90} />
      </Card>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Card className="relative overflow-hidden p-5">
          <KickerLabel as="div" className="mb-3">Season by season</KickerLabel>
          {hasMultiSeason ? (
            <div className="flex flex-col gap-3">
              {demoSeasonHistory.map((s) => (
                <div key={s.season} className="flex flex-col gap-1">
                  <div className="flex items-baseline justify-between gap-2">
                    <span className="flex items-baseline gap-2">
                      <span className="text-[13px] text-text-muted-2">{s.season}</span>
                      <span className="font-dmSerif text-xl text-text-primary">{s.points}</span>
                      <span className="text-[12px] text-text-muted-3">{s.avgPerWeek} a week</span>
                    </span>
                    <span className="font-outfit text-[10px] text-text-muted-3">
                      {s.rank}
                      {s.rank === 1 ? 'st' : s.rank === 2 ? 'nd' : s.rank === 3 ? 'rd' : 'th'} of {s.totalTeams}
                    </span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-surface-card-4">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-brand-teal-mid to-brand-indigo-mid"
                      style={{ width: `${Math.round(((s.totalTeams - s.rank + 1) / s.totalTeams) * 100)}%` }}
                    />
                  </div>
                </div>
              ))}
              <div className="mt-1 flex items-baseline justify-between border-t border-border-base pt-2">
                <span className="font-outfit text-[10px] tracking-wide text-text-muted-3">LIFETIME</span>
                <span className="font-dmSerif text-xl text-brand-teal">
                  {demoSeasonHistory.reduce((t, s) => t + s.points, 0) + stats.seasonPoints} pts
                </span>
              </div>
            </div>
          ) : (
            <DataGateTeaser
              icon="📅"
              text="Unlocks once you've completed 2 full seasons — this one's still in progress."
            />
          )}
        </Card>

        <Card className="relative overflow-hidden p-5">
          <div className="mb-3 flex items-baseline justify-between">
            <KickerLabel>Rank trajectory</KickerLabel>
            {hasMultiSeason && <span className="font-outfit text-[10.5px] text-brand-indigo">4TH OF 12</span>}
          </div>
          {hasMultiSeason ? (
            <div className="flex flex-col gap-2">
              <Sparkline data={demoRankTrajectory.map((r) => -r)} height={70} stroke="var(--brand-indigo-mid)" fill={false} />
              {demoRankNote && <p className="text-[11.5px] leading-relaxed text-text-muted-2">{demoRankNote}</p>}
            </div>
          ) : (
            <DataGateTeaser icon="📈" text="Needs a full second season of results to plot a trend." />
          )}
        </Card>
      </div>

      <Card className="p-5">
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

      <Card className="p-5">
        <div className="mb-3 flex items-baseline justify-between">
          <KickerLabel>Who you read well</KickerLabel>
          <span className="font-outfit text-[9.5px] text-text-muted-4">SHARE OF CALLS CORRECT</span>
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
                  <span className="font-outfit text-[10px]" style={{ color: strong ? 'var(--brand-teal)' : 'var(--text-muted-2)' }}>
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
