import { useState } from 'react';
import TeamCrest from '../ui/TeamCrest';
import { calculatePoints, getPointsBreakdown } from '../../utils/pointsCalculation';
import { callVerdict } from '../../utils/recordStats';

const BREAKDOWN_LABELS = {
  perfectPrediction: 'Exact scoreline called, scorers matched',
  exactScore: 'Exact scoreline called',
  correctDraw: 'Correct draw',
  correctOutcome: 'Right winner',
  goalscorers: 'Named scorers correctly',
  scorerFocus: 'Scorer Focus applied',
  goalDiffPenalty: 'Goal-difference penalty',
  wildcard: 'Wildcard applied',
  doubleDown: 'Double Down applied',
  allInWeek: 'All-In Week applied',
  defensePlusPlus: 'Defence++ clean sheet bonus',
};

function scorerLine(scorers) {
  const named = (scorers || []).filter(Boolean);
  return named.length ? named.join(', ') : 'No scorer named';
}

/**
 * Expandable prediction-vs-actual row: card recipe from foundation spec §9.4
 * (rounded-12/13, border-card, bg-surface-card), matching the prototype's
 * Record-screen row (Spine.dc.html lines 964-1025 desktop / 2819-2856
 * mobile-search) — GW tag, teams, "you said" vs "it finished", points +
 * verdict badge, expanding to prediction/result/chips columns plus the
 * points breakdown ("HOW THIS SCORED").
 */
export default function PredictionRow({ prediction, defaultOpen = false }) {
  const [expanded, setExpanded] = useState(defaultOpen);
  const isSettled = prediction.actualHomeScore !== null && prediction.actualHomeScore !== undefined;
  const breakdown = isSettled ? getPointsBreakdown(prediction) : null;
  const verdict = isSettled ? callVerdict(prediction) : null;
  const points = isSettled ? calculatePoints(prediction) ?? 0 : null;
  const chips = prediction.chips || [];

  return (
    <div className="overflow-hidden rounded-12 border border-border-card bg-surface-card">
      <button
        onClick={() => setExpanded((e) => !e)}
        className="flex w-full items-center gap-3 px-4 py-3 text-left"
      >
        <span className="w-11 shrink-0 font-mono text-[10px] tracking-wide text-text-muted-4">
          GW{prediction.gameweek}
        </span>

        <span className="flex min-w-0 flex-1 items-center gap-2">
          <TeamCrest team={prediction.homeTeam} size={18} />
          <span className="truncate text-[13px] text-text-secondary">{prediction.homeTeam}</span>
          <span className="font-mono text-[11px] text-text-muted-5">v</span>
          <span className="truncate text-[13px] text-text-secondary">{prediction.awayTeam}</span>
          <TeamCrest team={prediction.awayTeam} size={18} />
        </span>

        <span className="hidden shrink-0 flex-col leading-tight sm:flex">
          <span className="font-mono text-[9px] tracking-wide text-text-muted-4">YOU SAID</span>
          <span className="font-dmSerif text-base text-text-tertiary">
            {prediction.homeScore}–{prediction.awayScore}
          </span>
        </span>

        <span className="hidden shrink-0 flex-col leading-tight sm:flex">
          <span className="font-mono text-[9px] tracking-wide text-text-muted-4">
            {isSettled ? 'IT FINISHED' : 'STATUS'}
          </span>
          <span
            className="font-dmSerif text-base"
            style={{ color: isSettled ? (verdict?.exact ? 'var(--brand-teal)' : 'var(--text-tertiary)') : 'var(--brand-amber)' }}
          >
            {isSettled ? `${prediction.actualHomeScore}–${prediction.actualAwayScore}` : 'Open'}
          </span>
        </span>

        <span className="flex shrink-0 flex-col items-end leading-tight">
          <span className="font-dmSerif text-lg" style={{ color: isSettled ? verdict?.colorVar : 'var(--text-muted-4)' }}>
            {isSettled ? (points > 0 ? `+${points}` : '0') : '—'}
          </span>
          {isSettled && (
            <span className="font-mono text-[9px] tracking-wide" style={{ color: verdict?.colorVar }}>
              {verdict?.verdict}
            </span>
          )}
        </span>

        <span
          className={`shrink-0 text-text-muted-4 transition-transform ${expanded ? 'rotate-180' : ''}`}
        >
          &#9662;
        </span>
      </button>

      {expanded && (
        <div className="border-t border-border-base">
          <div className="grid grid-cols-1 sm:grid-cols-3">
            <div className="flex flex-col gap-1 px-4 py-3 min-w-0">
              <span className="font-mono text-[9px] tracking-wide text-text-muted-4">PREDICTION</span>
              <span className="font-dmSerif text-lg text-text-tertiary">
                {prediction.homeScore}–{prediction.awayScore}
              </span>
              <span className="text-[11px] leading-snug text-text-muted-3">
                {scorerLine([...(prediction.homeScorers || []), ...(prediction.awayScorers || [])])}
              </span>
            </div>
            <div className="flex flex-col gap-1 border-t border-border-base px-4 py-3 min-w-0 sm:border-t-0 sm:border-l">
              <span className="font-mono text-[9px] tracking-wide text-text-muted-4">RESULT</span>
              {isSettled ? (
                <>
                  <span className="font-dmSerif text-lg" style={{ color: verdict?.exact ? 'var(--brand-teal)' : 'var(--text-tertiary)' }}>
                    {prediction.actualHomeScore}–{prediction.actualAwayScore}
                  </span>
                  <span className="text-[11px] leading-snug text-text-muted-3">
                    {scorerLine([...(prediction.actualHomeScorers || []), ...(prediction.actualAwayScorers || [])])}
                  </span>
                </>
              ) : (
                <span className="text-[11px] text-text-muted-3">Not played yet</span>
              )}
            </div>
            <div className="flex flex-col gap-1 border-t border-border-base px-4 py-3 min-w-0 sm:border-t-0 sm:border-l">
              <span className="font-mono text-[9px] tracking-wide text-text-muted-4">CHIPS USED</span>
              <span className="font-dmSerif text-lg" style={{ color: chips.length ? 'var(--brand-amber)' : 'var(--text-muted-4)' }}>
                {chips.length ? chips.length : '—'}
              </span>
              <span className="text-[11px] leading-snug text-text-muted-3">
                {chips.length ? chips.join(', ') : 'none played'}
              </span>
            </div>
          </div>

          {isSettled && (
            <div className="flex flex-col gap-1.5 border-t border-border-base bg-surface-card-3 px-4 py-3">
              <span className="font-mono text-[9px] tracking-wide text-text-muted-3">HOW THIS SCORED</span>
              {breakdown && Object.keys(breakdown).length > 0 ? (
                <div className="flex flex-col gap-1">
                  {Object.entries(breakdown).map(([key, val]) => (
                    <div key={key} className="flex items-baseline justify-between gap-3 text-[12px]">
                      <span className="text-text-secondary">{BREAKDOWN_LABELS[key] || key}</span>
                      <span className="font-mono text-text-tertiary">{val}</span>
                    </div>
                  ))}
                  <div className="mt-1 flex items-baseline justify-between gap-3 border-t border-border-base pt-1.5 font-mono text-[10px] tracking-wide text-text-muted-3">
                    <span>TOTAL</span>
                    <span className="font-dmSerif text-sm" style={{ color: verdict?.colorVar }}>
                      {points > 0 ? `+${points}` : '0'}
                    </span>
                  </div>
                </div>
              ) : (
                <p className="text-[12px] text-text-muted-2">No points earned.</p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
