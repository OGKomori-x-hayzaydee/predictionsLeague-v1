import StatTile from '../ui/StatTile';
import GameweekRidge from './GameweekRidge';
import PredictionRow from './PredictionRow';
import { calculatePoints } from '../../utils/pointsCalculation';

/**
 * Season view — Spine.dc.html desktop lines 761-844 (`REC.isSeason`), mobile
 * lines 2633-2718. Gameweek ridge up top; clicking a week opens its calls
 * inline (the prototype's "drawer"), otherwise shows season-wide stat tiles
 * and a "select a week" placeholder.
 */
export default function SeasonTab({ predictions, stats, selectedGameweek, onSelectGameweek }) {
  const weekPredictions = selectedGameweek
    ? predictions
        .filter((p) => p.gameweek === selectedGameweek)
        .sort((a, b) => (a.matchId ?? 0) - (b.matchId ?? 0))
    : [];
  const weekTotal = weekPredictions.reduce((t, p) => t + (calculatePoints(p) ?? 0), 0);
  const weekExact = weekPredictions.filter((p) => {
    const exact = p.actualHomeScore != null && p.homeScore === p.actualHomeScore && p.awayScore === p.actualAwayScore;
    return exact;
  }).length;

  const settledWeeks = stats.pointsByGameweek.length;
  const best = stats.bestWeek;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-end justify-between gap-4">
        <h2 className="font-dmSerif text-[25px] leading-tight text-text-primary md:text-[30px]">
          {selectedGameweek
            ? `Gameweek ${selectedGameweek}, call by call`
            : settledWeeks
              ? `${stats.seasonPoints} points across ${settledWeeks} settled week${settledWeeks === 1 ? '' : 's'}`
              : 'No settled gameweeks yet'}
        </h2>
        {!selectedGameweek && settledWeeks > 0 && (
          <span className="hidden shrink-0 text-right font-mono text-[10px] leading-relaxed text-text-muted-5 md:block">
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
            <span className="font-mono text-[10.5px] tracking-wide text-text-muted-2">
              {weekTotal} PTS · {weekExact} EXACT
            </span>
            <button
              onClick={() => onSelectGameweek(null)}
              className="ml-auto font-mono text-[10px] tracking-wide text-text-muted-4 hover:text-text-secondary"
            >
              CLOSE
            </button>
          </div>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {weekPredictions.length === 0 ? (
              <p className="text-sm text-text-muted-2">No predictions filed for this gameweek.</p>
            ) : (
              weekPredictions.map((p) => <PredictionRow key={p.id || p.matchId} prediction={p} defaultOpen />)
            )}
          </div>
        </div>
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

          {settledWeeks === 0 ? (
            <p className="text-sm text-text-muted-2">
              No predictions have settled yet this season — once your first gameweek's results come in, your
              record will build here.
            </p>
          ) : (
            <div className="flex min-h-[110px] items-center justify-center rounded-14 border border-dashed border-border-control">
              <span className="px-4 text-center text-[13.5px] text-text-muted-4">
                Select a week on the ridge to unfold its calls here.
              </span>
            </div>
          )}
        </>
      )}
    </div>
  );
}
