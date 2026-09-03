import { useEffect, useState } from 'react';
import { ArrowLeft, ArrowRight } from '@phosphor-icons/react';
import StatTile from '../ui/StatTile';
import GameweekRidge from './GameweekRidge';
import PredictionRow from './PredictionRow';
import VisualizationsGate from './VisualizationsGate';
import { calculatePoints } from '../../utils/pointsCalculation';

const VIZ_THRESHOLD = 5;

function weekSlice(predictions, gameweek) {
  const weekPredictions = gameweek
    ? predictions.filter((p) => p.gameweek === gameweek).sort((a, b) => (a.matchId ?? 0) - (b.matchId ?? 0))
    : [];
  const weekTotal = weekPredictions.reduce((t, p) => t + (calculatePoints(p) ?? 0), 0);
  const weekExact = weekPredictions.filter((p) => {
    const exact = p.actualHomeScore != null && p.homeScore === p.actualHomeScore && p.awayScore === p.actualAwayScore;
    return exact;
  }).length;
  return { weekPredictions, weekTotal, weekExact };
}

/**
 * Season view — Spine.dc.html desktop lines 761-844 (`REC.isSeason`), mobile
 * lines 2633-2718. Gameweek ridge up top; clicking a week opens its calls
 * inline (the prototype's "drawer"), otherwise shows season-wide stat tiles
 * and a "select a week" placeholder.
 *
 * Mobile is a genuinely different layout (not just reflowed desktop markup,
 * matching the Dashboard/Fixtures convention of dedicated `md:hidden`
 * blocks): it always shows a steppable week — defaulting to the latest
 * settled one — inside one card with prev/next arrows, a 3-tile stat strip
 * (Points/Exacts/vs Avg) and a compact ridge, rather than requiring an
 * explicit "select a week" tap first. This uses its own local
 * `mobileGameweek` state rather than the shared `selectedGameweek` prop, so
 * defaulting it doesn't also force the desktop drawer open.
 */
export default function SeasonTab({ predictions, stats, selectedGameweek, onSelectGameweek, previewMode = false }) {
  const { weekPredictions, weekTotal, weekExact } = weekSlice(predictions, selectedGameweek);

  const settledWeeks = stats.pointsByGameweek.length;
  const vizGated = !previewMode && settledWeeks < VIZ_THRESHOLD;
  const best = stats.bestWeek;
  const weeks = stats.pointsByGameweek; // ascending by gameweek
  const latestWeek = weeks.length ? weeks[weeks.length - 1].gameweek : null;

  const [mobileGw, setMobileGw] = useState(latestWeek);
  // Re-sync (not just initialize) so this recovers correctly if the
  // dataset itself swaps out from under the current selection — e.g.
  // toggling "preview with example data" mid-session replaces `weeks`
  // entirely, and the previously-selected real gameweek number may not
  // exist in the demo set (or vice versa on exit).
  useEffect(() => {
    if (!weeks.some((w) => w.gameweek === mobileGw)) setMobileGw(latestWeek);
  }, [weeks, mobileGw, latestWeek]);

  const mobileIndex = weeks.findIndex((w) => w.gameweek === mobileGw);
  const canMobilePrev = mobileIndex > 0;
  const canMobileNext = mobileIndex >= 0 && mobileIndex < weeks.length - 1;
  const { weekPredictions: mobileWeekPredictions, weekTotal: mobileWeekTotal, weekExact: mobileWeekExact } = weekSlice(
    predictions,
    mobileGw
  );
  const mobileVsAvg = stats.avgPerWeek ? mobileWeekTotal - stats.avgPerWeek : null;

  return (
    <div className="flex flex-col gap-4">
      {/* Desktop */}
      <div className="hidden flex-col gap-4 md:flex">
        <div className="flex items-end justify-between gap-4">
          <h2 className="font-dmSerif text-3xl leading-tight text-text-primary">
            {selectedGameweek
              ? `Gameweek ${selectedGameweek}, call by call`
              : settledWeeks
                ? `${stats.seasonPoints} points across ${settledWeeks} settled week${settledWeeks === 1 ? '' : 's'}`
                : 'No settled gameweeks yet'}
          </h2>
          {!selectedGameweek && settledWeeks > 0 && (
            <span className="hidden shrink-0 text-right font-outfit text-2xs leading-relaxed text-text-muted-5 md:block">
              CLICK A WEEK
              <br />
              TO OPEN ITS CALLS
            </span>
          )}
        </div>

        <GameweekRidge weeks={stats.pointsByGameweek} selected={selectedGameweek} onSelect={onSelectGameweek} />

        {selectedGameweek ? (
          <div className="flex flex-col gap-3 overflow-hidden rounded-14 border border-border-card bg-surface-card p-4">
            <div className="flex flex-wrap items-center gap-3">
              <span className="font-dmSerif text-lg text-brand-teal-pale">Gameweek {selectedGameweek}</span>
              <span className="font-outfit text-2xs tracking-wide text-text-muted-2">
                {weekTotal} PTS · {weekExact} EXACT
              </span>
              <button
                onClick={() => onSelectGameweek(null)}
                className="ml-auto font-outfit text-2xs tracking-wide text-text-muted-4 hover:text-text-secondary"
              >
                CLOSE
              </button>
            </div>
            {/* One ticket per row: the pane caps at 820px, so a 2-up grid left
                each expanded ticket ~190px per half — scorer lines wrapped to
                three lines and the verdict stamp sat on the RESULT label. */}
            <div className="flex flex-col gap-3">
              {weekPredictions.length === 0 ? (
                <p className="text-sm text-text-muted-2">No predictions filed for this gameweek.</p>
              ) : (
                weekPredictions.map((p) => (
                  <PredictionRow key={p.id || p.matchId} prediction={p} defaultOpen />
                ))
              )}
            </div>
          </div>
        ) : vizGated ? (
          <VisualizationsGate settledWeeks={settledWeeks} threshold={VIZ_THRESHOLD} />
        ) : (
          <>
            <div className="grid grid-cols-2 gap-2.5 md:grid-cols-4">
              <StatTile label="Season points" value={stats.seasonPoints} accent="var(--color-brand-teal)" />
              <StatTile
                label="Best week"
                value={best ? `+${best.points}` : '—'}
                note={best ? `Gameweek ${best.gameweek}` : undefined}
              />
              <StatTile
                label="Exact scorelines"
                value={stats.exactCalls}
                note={`of ${stats.totalCompleted} calls filed`}
              />
              <StatTile label="Average week" value={stats.avgPerWeek} />
            </div>

            <div className="flex min-h-[110px] items-center justify-center rounded-14 border border-dashed border-border-control">
              <span className="px-4 text-center text-caption text-text-muted-4">
                Select a week on the ridge to unfold its calls here.
              </span>
            </div>
          </>
        )}
      </div>

      {/* Mobile */}
      <div className="flex flex-col gap-4 md:hidden">
        <div className="flex flex-col gap-1">
          <span className="font-outfit text-2xs tracking-[0.14em] text-brand-teal">
            SEASON · {settledWeeks} WEEK{settledWeeks === 1 ? '' : 'S'} SETTLED
          </span>
          <h2 className="font-dmSerif text-2xl leading-tight text-text-primary">
            {settledWeeks
              ? `${stats.seasonPoints} points across ${settledWeeks} settled week${settledWeeks === 1 ? '' : 's'}`
              : 'No settled gameweeks yet'}
          </h2>
        </div>

        {settledWeeks === 0 ? (
          <VisualizationsGate settledWeeks={settledWeeks} threshold={VIZ_THRESHOLD} />
        ) : (
          <>
            <div className="flex flex-col gap-3 rounded-14 border border-border-card bg-surface-card p-4">
              <div className="flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => canMobilePrev && setMobileGw(weeks[mobileIndex - 1].gameweek)}
                  disabled={!canMobilePrev}
                  aria-label="Previous week"
                  className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-text-muted-4 bg-surface-card text-text-primary transition-colors hover:border-brand-teal-mid hover:text-brand-teal disabled:pointer-events-none disabled:opacity-30"
                >
                  <ArrowLeft size={14} weight="bold" />
                </button>
                <div className="flex flex-col items-center gap-0.5">
                  <span className="font-dmSerif text-lg text-text-primary">Gameweek {mobileGw}</span>
                  <span className="font-outfit text-3xs tracking-wide text-text-muted-4">
                    {mobileWeekPredictions.length} CALLS FILED · {mobileWeekExact} EXACT
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => canMobileNext && setMobileGw(weeks[mobileIndex + 1].gameweek)}
                  disabled={!canMobileNext}
                  aria-label="Next week"
                  className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-text-muted-4 bg-surface-card text-text-primary transition-colors hover:border-brand-teal-mid hover:text-brand-teal disabled:pointer-events-none disabled:opacity-30"
                >
                  <ArrowRight size={14} weight="bold" />
                </button>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <StatTile label="Points" value={mobileWeekTotal} accent="var(--color-brand-teal)" />
                <StatTile label="Exacts" value={mobileWeekExact} />
                <StatTile
                  label="vs Avg"
                  value={mobileVsAvg != null ? (mobileVsAvg >= 0 ? `+${mobileVsAvg}` : mobileVsAvg) : '—'}
                  accent={mobileVsAvg != null && mobileVsAvg < 0 ? 'var(--state-error-mid)' : undefined}
                />
              </div>

              <GameweekRidge weeks={stats.pointsByGameweek} selected={mobileGw} onSelect={(gw) => gw && setMobileGw(gw)} />

              <span className="text-center text-2xs leading-snug text-text-muted-4">
                Tap the ridge or step with the arrows to change week · tap a call to open its full card.
              </span>
            </div>

            <div className="flex flex-col gap-3">
              {mobileWeekPredictions.length === 0 ? (
                <p className="text-sm text-text-muted-2">No predictions filed for this gameweek.</p>
              ) : (
                mobileWeekPredictions.map((p, i) => (
                  <PredictionRow key={p.id || p.matchId} prediction={p} defaultOpen={i === 0} />
                ))
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
