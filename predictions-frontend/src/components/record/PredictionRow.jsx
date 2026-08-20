import { useEffect, useRef, useState } from 'react';
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

const VERDICT_LABELS = { EXACT: 'EXACT', OUTCOME: 'CORRECT', MISSED: 'MISSED' };

function scorerLine(scorers) {
  const named = (scorers || []).filter(Boolean);
  return named.length ? named.join(', ') : 'No scorer named';
}

/**
 * Verdict-driven visual treatment for the ticket — background wash + border
 * + pill colors, one source of truth so collapsed/expanded stay in sync.
 */
function ticketTheme(isSettled, verdict) {
  if (!isSettled) {
    return {
      wash: 'var(--surface-card)',
      border: 'var(--border-card)',
      pillBg: 'color-mix(in srgb, var(--brand-amber) 14%, transparent)',
      pillFg: 'var(--brand-amber)',
    };
  }
  if (verdict?.verdict === 'EXACT') {
    return {
      wash: 'color-mix(in srgb, var(--brand-teal-deep) 13%, var(--surface-card))',
      border: 'color-mix(in srgb, var(--brand-teal-mid) 40%, transparent)',
      pillBg: 'color-mix(in srgb, var(--brand-teal) 18%, transparent)',
      pillFg: 'var(--brand-teal)',
    };
  }
  if (verdict?.verdict === 'OUTCOME') {
    return {
      wash: 'color-mix(in srgb, var(--brand-indigo) 9%, var(--surface-card))',
      border: 'color-mix(in srgb, var(--brand-indigo-mid) 35%, transparent)',
      pillBg: 'color-mix(in srgb, var(--brand-indigo) 16%, transparent)',
      pillFg: 'var(--brand-indigo)',
    };
  }
  return {
    wash: 'var(--surface-card)',
    border: 'var(--border-card)',
    pillBg: 'var(--surface-card-4)',
    pillFg: 'var(--text-muted-3)',
  };
}

/**
 * "Scoreboard ticket" prediction card — the shared unit for Season (usually
 * `defaultOpen`) and Search (collapsed by default, expands in place).
 * Two densities:
 *   - Collapsed: a compact single-line ticket strip (crests, called/result,
 *     points pill, chevron).
 *   - Expanded: the full ticket — verdict-tinted wash, big crests, a
 *     "YOU CALLED" / "RESULT" split with a perforated notch between the
 *     halves, a rotated verdict stamp in the corner, a chip footer strip,
 *     and (only when `onViewFull` is supplied, i.e. from Season) a
 *     "Full prediction →" action that deep-links to this fixture's row in
 *     the Search tab.
 *
 * `highlighted` — true when this row is the target of that deep link: it
 * force-expands, scrolls itself into view, and glows briefly.
 */
export default function PredictionRow({ prediction, defaultOpen = false, onViewFull, highlighted = false }) {
  const [expanded, setExpanded] = useState(defaultOpen || highlighted);
  const rootRef = useRef(null);

  useEffect(() => {
    if (!highlighted) return;
    setExpanded(true);
    rootRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, [highlighted]);

  const isSettled = prediction.actualHomeScore !== null && prediction.actualHomeScore !== undefined;
  const breakdown = isSettled ? getPointsBreakdown(prediction) : null;
  const verdict = isSettled ? callVerdict(prediction) : null;
  const points = isSettled ? calculatePoints(prediction) ?? 0 : null;
  const chips = prediction.chips || [];
  const theme = ticketTheme(isSettled, verdict);
  const calledScorers = scorerLine([...(prediction.homeScorers || []), ...(prediction.awayScorers || [])]);
  const resultScorers = scorerLine([...(prediction.actualHomeScorers || []), ...(prediction.actualAwayScorers || [])]);

  return (
    <div
      ref={rootRef}
      className={`relative overflow-hidden rounded-14 border shadow-[0_16px_32px_-16px_rgba(0,0,0,0.55)] transition-shadow ${
        highlighted ? 'ring-2 ring-brand-teal-mid/70' : ''
      }`}
      style={{ background: theme.wash, borderColor: theme.border }}
    >
      {/* Collapsed header — always visible, toggles expansion */}
      <button onClick={() => setExpanded((e) => !e)} className="flex w-full items-center gap-3 px-4 py-3 text-left">
        <span className="w-11 shrink-0 font-mono text-[10px] tracking-wide text-text-muted-4">
          GW{prediction.gameweek}
        </span>

        <span className="flex min-w-0 flex-1 items-center gap-2">
          <TeamCrest team={prediction.homeTeam} size={20} />
          <span className="truncate text-[13px] text-text-secondary">{prediction.homeTeam}</span>
          <span className="font-mono text-[11px] text-text-muted-5">v</span>
          <span className="truncate text-[13px] text-text-secondary">{prediction.awayTeam}</span>
          <TeamCrest team={prediction.awayTeam} size={20} />
        </span>

        {!expanded && (
          <span className="hidden shrink-0 items-center gap-2.5 sm:flex">
            <span className="font-dmSerif text-[15px] text-text-tertiary">
              {prediction.homeScore}–{prediction.awayScore}
            </span>
            <span className="font-mono text-[10px] text-text-muted-5">vs</span>
            <span
              className="font-dmSerif text-[15px]"
              style={{ color: isSettled ? (verdict?.exact ? 'var(--brand-teal)' : 'var(--text-tertiary)') : 'var(--brand-amber)' }}
            >
              {isSettled ? `${prediction.actualHomeScore}–${prediction.actualAwayScore}` : 'Open'}
            </span>
          </span>
        )}

        <span
          className="flex shrink-0 items-center gap-1 rounded-full px-2.5 py-1 font-dmSerif text-sm"
          style={{ background: theme.pillBg, color: theme.pillFg }}
        >
          {isSettled ? (points > 0 ? `+${points}` : '0') : '—'}
        </span>

        <span className={`shrink-0 text-text-muted-4 transition-transform ${expanded ? 'rotate-180' : ''}`}>&#9662;</span>
      </button>

      {expanded && (
        <div className="border-t border-dashed" style={{ borderColor: theme.border }}>
          {/* Ticket body — "YOU CALLED" / "RESULT" halves with a faux-perforated notch on sm+ */}
          <div className="relative grid grid-cols-1 sm:grid-cols-2">
            <span
              aria-hidden="true"
              className="absolute -top-[7px] left-1/2 hidden h-3.5 w-3.5 -translate-x-1/2 rounded-full bg-surface-app sm:block"
            />
            <span
              aria-hidden="true"
              className="absolute -bottom-[7px] left-1/2 hidden h-3.5 w-3.5 -translate-x-1/2 rounded-full bg-surface-app sm:block"
            />

            <div className="flex flex-col items-center gap-2 px-5 py-4 text-center">
              <span className="font-mono text-[9px] tracking-[0.13em] text-text-muted-4">YOU CALLED</span>
              <div className="flex items-center gap-3">
                <TeamCrest team={prediction.homeTeam} size={30} />
                <span className="font-dmSerif text-[26px] leading-none text-[color:var(--text-primary)]">
                  {prediction.homeScore}–{prediction.awayScore}
                </span>
                <TeamCrest team={prediction.awayTeam} size={30} />
              </div>
              <span className="text-[11.5px] leading-snug text-text-muted-3">{calledScorers}</span>
            </div>

            <div className="flex flex-col items-center gap-2 border-t border-dashed px-5 py-4 text-center sm:border-t-0 sm:border-l" style={{ borderColor: theme.border }}>
              <span className="font-mono text-[9px] tracking-[0.13em] text-text-muted-4">RESULT</span>
              {isSettled ? (
                <>
                  <div className="flex items-center gap-3">
                    <TeamCrest team={prediction.homeTeam} size={30} />
                    <span
                      className="font-dmSerif text-[26px] leading-none"
                      style={{ color: verdict?.exact ? 'var(--brand-teal)' : 'var(--text-primary)' }}
                    >
                      {prediction.actualHomeScore}–{prediction.actualAwayScore}
                    </span>
                    <TeamCrest team={prediction.awayTeam} size={30} />
                  </div>
                  <span className="text-[11.5px] leading-snug text-text-muted-3">{resultScorers}</span>
                </>
              ) : (
                <span className="mt-2 font-dmSerif text-lg text-brand-amber">Not played yet</span>
              )}
            </div>
          </div>

          {isSettled && breakdown && Object.keys(breakdown).length > 0 && (
            <div className="flex flex-col gap-1.5 border-t border-dashed px-5 py-3" style={{ borderColor: theme.border }}>
              <span className="font-mono text-[9px] tracking-wide text-text-muted-3">HOW THIS SCORED</span>
              <div className="flex flex-col gap-1">
                {Object.entries(breakdown).map(([key, val]) => (
                  <div key={key} className="flex items-baseline justify-between gap-3 text-[12px]">
                    <span className="text-text-secondary">{BREAKDOWN_LABELS[key] || key}</span>
                    <span className="font-mono text-text-tertiary">{val}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Chip footer strip */}
          {chips.length > 0 && (
            <div
              className="flex flex-wrap items-center gap-1.5 border-t border-dashed px-5 py-2.5"
              style={{ borderColor: theme.border, background: 'color-mix(in srgb, var(--surface-app) 40%, transparent)' }}
            >
              <span className="font-mono text-[9px] tracking-wide text-text-muted-4">CHIPS</span>
              {chips.map((c) => (
                <span key={c} className="rounded-full border border-border-card px-2 py-0.5 font-mono text-[9.5px] text-brand-amber">
                  {c}
                </span>
              ))}
            </div>
          )}

          {/* Verdict stamp, corner-anchored over the ticket body */}
          {isSettled && (
            <span
              className="pointer-events-none absolute right-4 top-3 rotate-[-8deg] rounded-md border-[2.5px] px-2 py-[3px] font-mono text-[10px] font-bold tracking-wider"
              style={{ borderColor: verdict?.colorVar, color: verdict?.colorVar }}
            >
              {VERDICT_LABELS[verdict?.verdict] || verdict?.verdict}
            </span>
          )}

          {onViewFull && (
            <button
              type="button"
              onClick={() => onViewFull(prediction)}
              className="flex w-full items-center justify-center gap-1.5 border-t px-4 py-2.5 font-mono text-[9.5px] tracking-[0.14em] text-text-muted-1 transition-colors hover:bg-surface-card-4 hover:text-brand-teal"
              style={{ borderColor: theme.border }}
            >
              FULL PREDICTION <span aria-hidden="true">&rarr;</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
}
