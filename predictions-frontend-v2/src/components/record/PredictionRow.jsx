import { useState } from 'react';
import TeamCrest from '../ui/TeamCrest';
import { getPointsBreakdown } from '../../utils/pointsCalculation';

const BREAKDOWN_LABELS = {
  perfectPrediction: 'Perfect prediction',
  exactScore: 'Exact scoreline',
  correctDraw: 'Correct draw',
  correctOutcome: 'Right winner',
  goalscorers: 'Named scorers',
  goalDiffPenalty: 'Goal-difference penalty',
  wildcard: 'Wildcard',
  doubleDown: 'Double Down',
  allInWeek: 'All-In Week',
  defensePlusPlus: 'Defence++',
};

export default function PredictionRow({ prediction }) {
  const [expanded, setExpanded] = useState(false);
  const isSettled = prediction.actualHomeScore !== null && prediction.actualHomeScore !== undefined;
  const breakdown = isSettled ? getPointsBreakdown(prediction) : null;

  return (
    <div className="rounded-md border border-border-card bg-surface-card-2">
      <button
        onClick={() => setExpanded((e) => !e)}
        className="flex w-full items-center gap-3 px-4 py-3 text-left"
      >
        <span className="font-mono text-[10px] text-text-muted-3">GW{prediction.gameweek}</span>
        <TeamCrest team={prediction.homeTeam} size={20} />
        <span className="flex-1 truncate text-sm text-text-secondary">
          {prediction.homeTeam} v {prediction.awayTeam}
        </span>
        <TeamCrest team={prediction.awayTeam} size={20} />
        <span className="font-dmSerif text-sm text-text-primary">
          {prediction.homeScore}-{prediction.awayScore}
        </span>
        {isSettled && (
          <span className={`font-mono text-xs ${(prediction.points ?? 0) > 0 ? 'text-brand-teal' : 'text-text-muted-3'}`}>
            {prediction.points ?? 0}pts
          </span>
        )}
        <span className={`text-text-muted-3 transition-transform ${expanded ? 'rotate-180' : ''}`}>&#8964;</span>
      </button>

      {expanded && (
        <div className="border-t border-border-base px-4 py-3 text-xs">
          {!isSettled && <p className="text-text-muted-2">Not settled yet.</p>}
          {isSettled && (
            <>
              <p className="mb-2 text-text-muted-2">
                Final: {prediction.actualHomeScore}-{prediction.actualAwayScore}
              </p>
              {breakdown && Object.keys(breakdown).length > 0 ? (
                <ul className="space-y-1">
                  {Object.entries(breakdown).map(([key, val]) => (
                    <li key={key} className="flex justify-between text-text-secondary">
                      <span>{BREAKDOWN_LABELS[key] || key}</span>
                      <span className="font-mono">{typeof val === 'number' ? val : val}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-text-muted-2">No points earned.</p>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
