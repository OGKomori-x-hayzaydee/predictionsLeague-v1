import { useEffect, useRef, useState } from 'react';
import TeamCrest from '../ui/TeamCrest';
import { calculatePoints, getPointsBreakdown } from '../../utils/pointsCalculation';
import { callVerdict } from '../../utils/recordStats';
import { CHIP_CONFIG } from '../../utils/chipManager';

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

/**
 * Own goals arrive from the feed as "<scorer> (o.g.)", but an unattributed
 * one stringifies its null name straight into the label ("null (o.g.)").
 * Client-side fallback — the record shouldn't print "null" at anybody.
 */
const OWN_GOAL_NO_NAME = /^\s*(null|undefined)\s*\(\s*o\.?\s*g\.?\s*\)\s*$/i;

function cleanScorerName(raw) {
  if (!raw) return null;
  const name = String(raw).trim();
  if (!name || /^(null|undefined)$/i.test(name)) return null;
  return OWN_GOAL_NO_NAME.test(name) ? 'Own goal' : name;
}

/**
 * Braces collapse into one "Haaland ×2" entry rather than repeating the name,
 * which is what made the merged scorer line run to three wrapped lines.
 */
function scorerTally(scorers) {
  const counts = new Map();
  for (const raw of scorers || []) {
    const name = cleanScorerName(raw);
    if (!name) continue;
    counts.set(name, (counts.get(name) || 0) + 1);
  }
  return Array.from(counts, ([name, count]) => (count > 1 ? `${name} ×${count}` : name));
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
 * One scoreline half of the ticket — the score itself, then each side's
 * scorers under their own crest (home right-aligned, away left-aligned)
 * so it's readable *who* scored for *whom*, instead of one merged
 * comma-run across both teams.
 */
function ScorelineHalf({ label, homeTeam, awayTeam, home, away, homeScorers, awayScorers, scoreColor, muted }) {
  return (
    <div className="flex flex-col items-center gap-3 px-6 py-5">
      <span className="font-outfit text-2xs tracking-[0.13em] text-text-muted-4">{label}</span>

      <div className="flex items-center gap-3">
        <TeamCrest team={homeTeam} size={34} />
        <span className="font-dmSerif text-3xl leading-none" style={{ color: scoreColor }}>
          {home}–{away}
        </span>
        <TeamCrest team={awayTeam} size={34} />
      </div>

      <div className="grid w-full grid-cols-2 gap-x-4 text-caption leading-relaxed">
        <ul className={`flex flex-col items-end gap-1 text-right ${muted ? 'text-text-muted-4' : 'text-text-muted-2'}`}>
          {homeScorers.length ? (
            homeScorers.map((s) => (
              <li key={s} className="max-w-full truncate">
                {s}
              </li>
            ))
          ) : (
            <li className="text-text-muted-5">—</li>
          )}
        </ul>
        <ul className={`flex flex-col items-start gap-1 border-l border-dashed border-border-card pl-4 ${muted ? 'text-text-muted-4' : 'text-text-muted-2'}`}>
          {awayScorers.length ? (
            awayScorers.map((s) => (
              <li key={s} className="max-w-full truncate">
                {s}
              </li>
            ))
          ) : (
            <li className="text-text-muted-5">—</li>
          )}
        </ul>
      </div>
    </div>
  );
}

/**
 * "Scoreboard ticket" prediction card — the shared unit for Season (usually
 * `defaultOpen`) and Search (collapsed by default, expands in place).
 * Two densities:
 *   - Collapsed: a compact single-line ticket strip (crests, called/result,
 *     points pill, chevron).
 *   - Expanded: the full ticket — verdict-tinted wash, big crests, a
 *     "YOU CALLED" / "RESULT" split with a perforated notch between the
 *     halves, and the scoring breakdown alongside them once the ticket
 *     itself is wide enough (stacked below otherwise) so the card spends
 *     its width instead of running tall.
 *
 * Layout switches on container queries (`@container` on the root), not
 * viewport breakpoints: this pane is width-capped and narrows again beside
 * the 400px rail, so viewport width is a poor proxy for the card's own.
 *
 * The verdict stamp lives in the header row rather than floating over the
 * body — as an overlay it landed on top of the "RESULT" label whenever the
 * ticket was narrow.
 *
 * `highlighted` — true when this row is the target of that deep link: it
 * force-expands, scrolls itself into view, and glows briefly.
 */
export default function PredictionRow({ prediction, defaultOpen = false, highlighted = false }) {
  const [expanded, setExpanded] = useState(defaultOpen || highlighted);
  const rootRef = useRef(null);

  useEffect(() => {
    if (!highlighted) return;
    setExpanded(true);
    rootRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, [highlighted]);

  const isSettled = prediction.actualHomeScore !== null && prediction.actualHomeScore !== undefined;
  const breakdown = isSettled ? getPointsBreakdown(prediction) : null;
  const hasBreakdown = Boolean(breakdown && Object.keys(breakdown).length > 0);
  const verdict = isSettled ? callVerdict(prediction) : null;
  const points = isSettled ? calculatePoints(prediction) ?? 0 : null;
  const chips = prediction.chips || [];
  const theme = ticketTheme(isSettled, verdict);

  return (
    <div
      ref={rootRef}
      className={`@container relative overflow-hidden rounded-14 border shadow-[0_16px_32px_-16px_rgba(0,0,0,0.55)] transition-shadow ${
        highlighted ? 'ring-2 ring-brand-teal-mid/70' : ''
      }`}
      style={{ background: theme.wash, borderColor: theme.border }}
    >
      {/* Collapsed header — always visible, toggles expansion */}
      <button onClick={() => setExpanded((e) => !e)} className="flex w-full items-center gap-3.5 px-5 py-4 text-left">
        <span className="w-12 shrink-0 font-outfit text-caption tracking-wide text-text-muted-4">
          GW{prediction.gameweek}
        </span>

        <span className="flex min-w-0 flex-1 items-center gap-2">
          <TeamCrest team={prediction.homeTeam} size={24} />
          <span className="truncate text-base text-text-secondary">{prediction.homeTeam}</span>
          <span className="font-outfit text-caption text-text-muted-5">v</span>
          <span className="truncate text-base text-text-secondary">{prediction.awayTeam}</span>
          <TeamCrest team={prediction.awayTeam} size={24} />
        </span>

        {!expanded && (
          <span className="hidden shrink-0 items-center gap-2.5 @min-[560px]:flex">
            <span className="font-dmSerif text-lg text-text-tertiary">
              {prediction.homeScore}–{prediction.awayScore}
            </span>
            <span className="font-outfit text-caption text-text-muted-5">vs</span>
            <span
              className="font-dmSerif text-lg"
              style={{ color: isSettled ? (verdict?.exact ? 'var(--brand-teal)' : 'var(--text-tertiary)') : 'var(--brand-amber)' }}
            >
              {isSettled ? `${prediction.actualHomeScore}–${prediction.actualAwayScore}` : 'Open'}
            </span>
          </span>
        )}

        {/* Verdict stamp — in-flow beside the points pill so nothing overlaps */}
        {isSettled && (
          <span
            className="hidden shrink-0 rotate-[-6deg] rounded-md border-[2.5px] px-2.5 py-1 font-outfit text-caption font-bold tracking-wider @min-[520px]:inline-block"
            style={{ borderColor: verdict?.colorVar, color: verdict?.colorVar }}
          >
            {VERDICT_LABELS[verdict?.verdict] || verdict?.verdict}
          </span>
        )}

        <span
          className="flex shrink-0 items-center gap-1 rounded-full px-3 py-1.5 font-dmSerif text-base"
          style={{ background: theme.pillBg, color: theme.pillFg }}
        >
          {isSettled ? (points > 0 ? `+${points}` : '0') : '—'}
        </span>

        <span className={`shrink-0 text-text-muted-4 transition-transform ${expanded ? 'rotate-180' : ''}`}>&#9662;</span>
      </button>

      {expanded && (
        <div className="border-t border-dashed" style={{ borderColor: theme.border }}>
          <div className={`grid grid-cols-1 ${hasBreakdown ? '@min-[720px]:grid-cols-[minmax(0,1.45fr)_minmax(0,1fr)]' : ''}`}>
            {/* Ticket body — "YOU CALLED" / "RESULT" halves with a faux-perforated notch on sm+ */}
            <div className="relative grid grid-cols-1 @min-[460px]:grid-cols-2">
              <span
                aria-hidden="true"
                className="absolute -top-[7px] left-1/2 hidden h-3.5 w-3.5 -translate-x-1/2 rounded-full bg-surface-app @min-[460px]:block"
              />
              <span
                aria-hidden="true"
                className="absolute -bottom-[7px] left-1/2 hidden h-3.5 w-3.5 -translate-x-1/2 rounded-full bg-surface-app @min-[460px]:block"
              />

              <ScorelineHalf
                label="YOU CALLED"
                homeTeam={prediction.homeTeam}
                awayTeam={prediction.awayTeam}
                home={prediction.homeScore}
                away={prediction.awayScore}
                homeScorers={scorerTally(prediction.homeScorers)}
                awayScorers={scorerTally(prediction.awayScorers)}
                scoreColor="var(--text-primary)"
              />

              <div
                className="border-t border-dashed @min-[460px]:border-l @min-[460px]:border-t-0"
                style={{ borderColor: theme.border }}
              >
                {isSettled ? (
                  <ScorelineHalf
                    label="RESULT"
                    homeTeam={prediction.homeTeam}
                    awayTeam={prediction.awayTeam}
                    home={prediction.actualHomeScore}
                    away={prediction.actualAwayScore}
                    homeScorers={scorerTally(prediction.actualHomeScorers)}
                    awayScorers={scorerTally(prediction.actualAwayScorers)}
                    scoreColor={verdict?.exact ? 'var(--brand-teal)' : 'var(--text-primary)'}
                    muted
                  />
                ) : (
                  <div className="flex h-full flex-col items-center justify-center gap-2.5 px-6 py-7">
                    <span className="font-outfit text-2xs tracking-[0.13em] text-text-muted-4">RESULT</span>
                    <span className="font-dmSerif text-xl text-brand-amber">Not played yet</span>
                  </div>
                )}
              </div>
            </div>

            {/* How this scored — sits beside the scorelines on lg+, under them below that */}
            {hasBreakdown && (
              <div
                className="flex flex-col gap-2 border-t border-dashed px-6 py-5 @min-[720px]:border-l @min-[720px]:border-t-0"
                style={{ borderColor: theme.border }}
              >
                <span className="font-outfit text-2xs tracking-wide text-text-muted-3">HOW THIS SCORED</span>
                <div className="flex flex-col gap-1">
                  {Object.entries(breakdown).map(([key, val]) => (
                    <div key={key} className="flex items-baseline justify-between gap-3 text-caption">
                      <span className="text-text-secondary">{BREAKDOWN_LABELS[key] || key}</span>
                      <span className="shrink-0 font-outfit text-text-tertiary">{val}</span>
                    </div>
                  ))}
                </div>
                <div
                  className="mt-auto flex items-baseline justify-between gap-3 border-t border-dashed pt-2.5 text-caption"
                  style={{ borderColor: theme.border }}
                >
                  <span className="font-outfit text-2xs tracking-wide text-text-muted-3">TOTAL</span>
                  <span className="font-dmSerif text-xl leading-none" style={{ color: theme.pillFg }}>
                    {points > 0 ? `+${points}` : points}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Chip footer strip — human-readable chip names (CHIP_CONFIG), not raw camelCase ids */}
          {chips.length > 0 && (
            <div
              className="flex flex-wrap items-center gap-2 border-t border-dashed px-6 py-3"
              style={{ borderColor: theme.border, background: 'color-mix(in srgb, var(--surface-app) 40%, transparent)' }}
            >
              <span className="font-outfit text-2xs tracking-wide text-text-muted-4">CHIPS</span>
              {chips.map((c) => (
                <span key={c} className="rounded-full border border-border-card px-2.5 py-1 font-outfit text-caption text-brand-amber">
                  {CHIP_CONFIG[c]?.name || c}
                </span>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
