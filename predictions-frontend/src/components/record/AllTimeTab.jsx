import { Lock, CalendarBlank, TrendUp } from '@phosphor-icons/react';
import KickerLabel from '../ui/KickerLabel';
import Card from '../ui/Card';
import Sparkline from '../charts/Sparkline';
import TeamCrestGrid from '../ui/TeamCrestGrid';
import VisualizationsGate from './VisualizationsGate';
import { computeTeamAccuracy } from '../../utils/profileStats';
import { computeScorelineHitRates, computeBestWorstWeeks } from '../../utils/recordStats';

const VIZ_THRESHOLD = 5;
const CURRENT_SEASON = '2024/25';

function ordinal(n) {
  const v = n % 100;
  const suffix = v >= 11 && v <= 13 ? 'th' : ['th', 'st', 'nd', 'rd'][n % 10] || 'th';
  return `${n}${suffix}`;
}

function weekCopy(predictions, week, avg, kind) {
  if (!week) return '';
  const settled = predictions.filter(
    (p) => p.gameweek === week.gameweek && p.actualHomeScore != null && p.actualAwayScore != null
  );
  const exacts = settled.filter((p) => p.homeScore === p.actualHomeScore && p.awayScore === p.actualAwayScore).length;
  const chips = settled.filter((p) => (p.chips || []).length > 0).length;
  const delta = week.points - avg;
  if (kind === 'best') {
    const exactBit = exacts ? `${exacts} exact scoreline${exacts === 1 ? '' : 's'}` : `${settled.length} settled call${settled.length === 1 ? '' : 's'}`;
    const chipBit = chips ? ` and ${chips} chip${chips === 1 ? '' : 's'} played` : '';
    return `Your highest-scoring week on record — ${exactBit}${chipBit}, ${Math.abs(delta)} ${delta >= 0 ? 'above' : 'below'} your average of ${avg} a week.`;
  }
  return `A week that returned ${week.points} points from ${settled.length} call${settled.length === 1 ? '' : 's'} — ${Math.abs(delta)} below your average of ${avg}.`;
}

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
      <span aria-hidden="true" className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-[0.04]">
        {icon}
      </span>
      <span aria-hidden="true" className="text-text-muted-4"><Lock size={18} /></span>
      <p className="max-w-[22em] text-caption leading-relaxed text-text-muted-3">{text}</p>
    </div>
  );
}

function HitRateRows({ rows }) {
  return (
    <div className="flex flex-col gap-3.5">
      {rows.map((s) => (
        <div key={s.type} className="flex flex-col gap-1.5">
          <div className="flex items-baseline justify-between gap-3">
            <span className="text-caption text-text-muted-2">{s.type}</span>
            <span className="shrink-0 font-outfit text-sm text-text-primary">
              {s.n ? (
                <>
                  {s.pct}%
                  <span className="text-text-muted-3"> · {s.n} call{s.n === 1 ? '' : 's'}</span>
                </>
              ) : (
                <span className="text-caption text-text-muted-4">no calls yet</span>
              )}
            </span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-surface-card-4">
            <div
              className="h-full rounded-full"
              style={{
                width: `${s.pct}%`,
                background: `linear-gradient(90deg, ${s.color}, color-mix(in srgb, var(--brand-indigo) 70%, ${s.color}))`,
              }}
            />
          </div>
        </div>
      ))}
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

  const latestRank = hasMultiSeason ? demoRankTrajectory[demoRankTrajectory.length - 1] : null;
  const seasonRows = hasMultiSeason
    ? [
        ...demoSeasonHistory,
        {
          season: CURRENT_SEASON,
          points: stats.seasonPoints,
          avgPerWeek: stats.avgPerWeek,
          rank: latestRank ?? 4,
          totalTeams: demoSeasonHistory[0]?.totalTeams ?? 12,
          current: true,
        },
      ]
    : [];
  const lifetimePts = seasonRows.reduce((t, s) => t + s.points, 0);

  const gw = stats.pointsByGameweek;
  const mid = gw.length ? Math.floor((gw.length - 1) / 2) : 0;
  const chartLabels = gw.length >= 2
    ? [`GW ${gw[0].gameweek}`, gw.length > 2 ? `GW ${gw[mid].gameweek}` : null, `GW ${gw[gw.length - 1].gameweek}`].filter(Boolean)
    : [];

  if (vizGated) {
    return (
      <div className="flex flex-col gap-4">
        <h2 className="font-dmSerif text-2xl leading-tight text-text-primary md:text-3xl">
          Every week you have ever filed
        </h2>
        <VisualizationsGate settledWeeks={settledWeeks} threshold={VIZ_THRESHOLD} />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <header className="flex flex-col gap-1">
        <KickerLabel className="text-brand-teal">
          {hasMultiSeason ? 'Three seasons on record' : `${settledWeeks} settled week${settledWeeks === 1 ? '' : 's'} on record`}
        </KickerLabel>
        <h2 className="font-dmSerif text-2xl leading-tight text-text-primary md:text-3xl">
          Every week you have ever filed
        </h2>
      </header>

      <Card className="p-5">
        <div className="mb-3 flex items-baseline justify-between gap-3">
          <KickerLabel>Points per week</KickerLabel>
          {trend.length > 0 && (
            <span className="font-outfit text-2xs tracking-[0.12em] text-brand-teal">
              Average {stats.avgPerWeek} a week
            </span>
          )}
        </div>
        <Sparkline
          data={trend}
          height={128}
          fill={false}
          grid
          glow
          average={stats.avgPerWeek || undefined}
          labels={chartLabels}
        />
      </Card>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Card className="relative overflow-hidden p-5">
          <KickerLabel as="div" className="mb-4">Season by season</KickerLabel>
          {hasMultiSeason ? (
            <div className="flex flex-col gap-3.5">
              {seasonRows.map((s) => (
                <div key={s.season} className="flex flex-col gap-1.5">
                  <div className="flex items-baseline justify-between gap-2">
                    <span className="flex min-w-0 flex-wrap items-baseline gap-2">
                      <span className="text-caption text-text-muted-2">{s.season}</span>
                      <span className="font-dmSerif text-xl text-text-primary">{s.points}</span>
                      <span className="text-xs text-text-muted-3">{s.avgPerWeek} a week</span>
                    </span>
                    <span className="shrink-0 font-outfit text-2xs text-text-muted-3">
                      {ordinal(s.rank)} of {s.totalTeams}
                    </span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-surface-card-4">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${Math.round(((s.totalTeams - s.rank + 1) / s.totalTeams) * 100)}%`,
                        background: s.current
                          ? 'linear-gradient(90deg, var(--brand-teal-mid), var(--brand-indigo))'
                          : 'var(--brand-teal-mid)',
                      }}
                    />
                  </div>
                </div>
              ))}
              <div className="mt-0.5 flex items-baseline justify-between border-t border-border-base pt-2.5">
                <span className="font-outfit text-2xs tracking-wide text-text-muted-3">LIFETIME</span>
                <span className="font-dmSerif text-xl text-brand-teal">{lifetimePts} pts</span>
              </div>
            </div>
          ) : (
            <DataGateTeaser
              icon={<CalendarBlank size={96} />}
              text="Unlocks once you've completed 2 full seasons — this one's still in progress."
            />
          )}
        </Card>

        <Card className="relative overflow-hidden p-5">
          <div className="mb-4 flex items-baseline justify-between">
            <KickerLabel>Rank trajectory</KickerLabel>
            {hasMultiSeason && latestRank != null && (
              <span className="font-outfit text-2xs tracking-[0.12em] text-brand-indigo">
                {ordinal(latestRank).toUpperCase()} OF {seasonRows[0]?.totalTeams ?? 12}
              </span>
            )}
          </div>
          {hasMultiSeason ? (
            <div className="flex flex-col gap-2">
              <Sparkline
                data={demoRankTrajectory.map((r) => -r)}
                height={128}
                stroke="var(--brand-indigo)"
                fill={false}
                grid
                glow
              />
              {demoRankNote && <p className="text-2xs leading-relaxed text-text-muted-2">{demoRankNote}</p>}
            </div>
          ) : (
            <DataGateTeaser icon={<TrendUp size={96} />} text="Needs a full second season of results to plot a trend." />
          )}
        </Card>

        <Card className="p-5">
          <KickerLabel as="div" className="mb-4">Hit rate by scoreline type</KickerLabel>
          <HitRateRows rows={scorelineHitRates} />
        </Card>

        <Card className="p-5">
          <div className="mb-4 flex items-baseline justify-between gap-3">
            <KickerLabel>Who you read well</KickerLabel>
            <span className="font-outfit text-3xs tracking-[0.12em] text-text-muted-4">SHARE OF CALLS CORRECT</span>
          </div>
          {teamAccuracy.length === 0 ? (
            <p className="text-sm text-text-muted-2">Not enough settled predictions yet.</p>
          ) : (
            <TeamCrestGrid teams={teamAccuracy} />
          )}
        </Card>
      </div>

      {(best || worst) && (
        <div className="grid grid-cols-1 gap-3.5 pb-1.5 sm:grid-cols-2">
          <div
            className="flex flex-col gap-1.5 rounded-md border border-border-card border-t-2 p-4"
            style={{
              borderTopColor: 'var(--brand-teal)',
              background: 'linear-gradient(180deg, color-mix(in srgb, var(--brand-teal-deep) 16%, var(--surface-card)), var(--surface-card))',
            }}
          >
            <KickerLabel className="text-brand-teal">Best week on record</KickerLabel>
            <span className="font-dmSerif text-xl leading-tight text-text-primary">
              {best ? `Gameweek ${best.gameweek} · ${best.points} points` : '—'}
            </span>
            {best && (
              <p className="text-caption leading-relaxed text-text-muted-2">
                {weekCopy(predictions, best, stats.avgPerWeek, 'best')}
              </p>
            )}
          </div>
          <div
            className="flex flex-col gap-1.5 rounded-md border border-border-card border-t-2 p-4"
            style={{
              borderTopColor: 'var(--state-error)',
              background: 'linear-gradient(180deg, color-mix(in srgb, var(--state-error) 14%, var(--surface-card)), var(--surface-card))',
            }}
          >
            <KickerLabel className="text-[color:var(--state-error-mid)]">Worst week on record</KickerLabel>
            <span className="font-dmSerif text-xl leading-tight text-text-primary">
              {worst ? `Gameweek ${worst.gameweek} · ${worst.points} points` : '—'}
            </span>
            {worst && (
              <p className="text-caption leading-relaxed text-text-muted-2">
                {weekCopy(predictions, worst, stats.avgPerWeek, 'worst')}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
