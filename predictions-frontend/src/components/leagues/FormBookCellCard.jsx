import { useEffect } from 'react';
import TeamCrest from '../ui/TeamCrest';
import { chipBadge, verdictColors } from '../../utils/leagueStats';
import { getPointsBreakdown, calculateCeilingPoints } from '../../utils/pointsCalculation';
import { CHIP_CONFIG } from '../../utils/chipManager';
import { REVERSE_CHIP_MAPPING } from '../../utils/backendMappings';

const BREAKDOWN_LABELS = {
  perfectPrediction: 'Exact scoreline called, scorers matched',
  exactScore: 'Exact scoreline called',
  correctDraw: 'Correct draw',
  correctOutcome: 'Right winner',
  goalscorers: 'Named scorers correctly',
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

function ticketTheme(settled, verdict) {
  if (!settled) {
    return {
      wash: 'var(--surface-card)',
      border: 'var(--border-card)',
      pillBg: 'color-mix(in srgb, var(--brand-amber) 14%, transparent)',
      pillFg: 'var(--brand-amber)',
    };
  }
  if (verdict === 'exact') {
    return {
      wash: 'color-mix(in srgb, var(--brand-teal-deep) 13%, var(--surface-card))',
      border: 'color-mix(in srgb, var(--brand-teal-mid) 40%, transparent)',
      pillBg: 'color-mix(in srgb, var(--brand-teal) 18%, transparent)',
      pillFg: 'var(--brand-teal)',
    };
  }
  if (verdict === 'draw' || verdict === 'winner') {
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
 * Cell overlay — same scoreboard-ticket language as My Record's PredictionRow.
 */
export default function FormBookCellCard({ formBook, card, onClose }) {
  useEffect(() => {
    if (!card) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [card, onClose]);

  if (!card || !formBook) return null;

  const member = formBook.rows.find((r) => r.username === card.username);
  const fixture = formBook.fixtures.find((f) => f.matchId === card.matchId);
  const cell = member?.cells.find((c) => c.matchId === card.matchId);
  if (!member || !fixture || !cell?.filed || !cell.prediction) return null;

  const p = cell.prediction;
  const settled = formBook.isSettled;
  const vc = cell.verdict ? verdictColors(cell.verdict) : null;
  const badge = chipBadge(p.chips);
  const breakdown = settled ? getPointsBreakdown(p) : null;
  const theme = ticketTheme(settled, cell.verdict);
  const total = settled ? cell.points : null;
  const name = member.isCurrentUser ? 'You' : member.name;
  const chips = p.chips || [];
  const calledScorers = scorerLine([...(p.homeScorers || []), ...(p.awayScorers || [])]);
  const resultScorers = scorerLine([...(fixture.actualHomeScorers || []), ...(fixture.actualAwayScorers || [])]);
  const ceiling = settled ? null : calculateCeilingPoints(p);

  const stamp =
    cell.verdict === 'exact' ? 'EXACT' : cell.verdict === 'draw' || cell.verdict === 'winner' ? 'CORRECT' : settled ? 'MISSED' : null;

  return (
    <div
      className="absolute inset-0 z-20 flex items-center justify-center bg-surface-app/70 p-6"
      onClick={onClose}
      role="presentation"
    >
      <div
        className="relative w-full max-w-lg overflow-hidden rounded-14 border shadow-modal"
        style={{ background: theme.wash, borderColor: theme.border }}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-label="How this scored"
      >
        <div className="flex items-center gap-3 px-5 py-4">
          <span
            className={`flex size-10 shrink-0 items-center justify-center rounded-full text-sm font-semibold ${
              member.isCurrentUser ? 'bg-brand-teal-deep text-brand-teal-tint' : 'bg-surface-card-4 text-text-muted-1'
            }`}
          >
            {member.initial}
          </span>
          <div className="flex min-w-0 flex-1 flex-col gap-0.5">
            <span className="truncate font-dmSerif text-xl text-text-primary">{name}</span>
            <span className="font-outfit text-2xs tracking-widest text-text-muted-3">GW{formBook.gw}</span>
          </div>
          <span
            className="flex shrink-0 items-center gap-1 rounded-full px-2.5 py-1 font-dmSerif text-lg"
            style={{ background: theme.pillBg, color: theme.pillFg }}
          >
            {settled ? (total > 0 ? `+${total}` : '0') : '—'}
          </span>
        </div>

        <div className="relative grid grid-cols-1 border-t border-dashed sm:grid-cols-2" style={{ borderColor: theme.border }}>
          <span
            aria-hidden="true"
            className="absolute -top-1.5 left-1/2 hidden size-3.5 -translate-x-1/2 rounded-full bg-surface-app sm:block"
          />
          <span
            aria-hidden="true"
            className="absolute -bottom-1.5 left-1/2 hidden size-3.5 -translate-x-1/2 rounded-full bg-surface-app sm:block"
          />

          <div className="flex flex-col items-center gap-2 px-5 py-4 text-center">
            <span className="font-outfit text-3xs tracking-widest text-text-muted-4">CALLED</span>
            <div className="flex items-center gap-3">
              <TeamCrest team={fixture.homeTeam} size={30} />
              <span className="font-dmSerif text-2xl leading-none text-text-primary">
                {p.homeScore}–{p.awayScore}
              </span>
              <TeamCrest team={fixture.awayTeam} size={30} />
            </div>
            <span className="text-2xs leading-snug text-text-muted-3">{calledScorers}</span>
          </div>

          <div
            className="flex flex-col items-center gap-2 border-t border-dashed px-5 py-4 text-center sm:border-t-0 sm:border-l"
            style={{ borderColor: theme.border }}
          >
            <span className="font-outfit text-3xs tracking-widest text-text-muted-4">RESULT</span>
            {settled ? (
              <>
                <div className="flex items-center gap-3">
                  <TeamCrest team={fixture.homeTeam} size={30} />
                  <span
                    className="font-dmSerif text-2xl leading-none"
                    style={{ color: cell.verdict === 'exact' ? 'var(--brand-teal)' : 'var(--text-primary)' }}
                  >
                    {fixture.actualHomeScore}–{fixture.actualAwayScore}
                  </span>
                  <TeamCrest team={fixture.awayTeam} size={30} />
                </div>
                <span className="text-2xs leading-snug text-text-muted-3">{resultScorers}</span>
              </>
            ) : (
              <span className="mt-2 font-dmSerif text-lg text-brand-amber">Not played yet</span>
            )}
          </div>
        </div>

        {settled && breakdown && Object.keys(breakdown).length > 0 && (
          <div className="flex flex-col gap-1.5 border-t border-dashed px-5 py-3" style={{ borderColor: theme.border }}>
            <span className="font-outfit text-2xs tracking-widest text-text-muted-3">HOW THIS SCORED</span>
            {Object.entries(breakdown).map(([key, val]) => (
              <div key={key} className="flex items-baseline justify-between gap-3">
                <span className="text-caption text-text-secondary">{BREAKDOWN_LABELS[key] || key}</span>
                <span className="font-outfit text-caption text-text-tertiary">{val}</span>
              </div>
            ))}
          </div>
        )}

        {!settled && (
          <div className="flex flex-col gap-1.5 border-t border-dashed px-5 py-3" style={{ borderColor: theme.border }}>
            <span className="font-outfit text-2xs tracking-widest text-text-muted-3">IF IT LANDS</span>
            <div className="flex items-baseline justify-between gap-3">
              <span className="text-caption text-text-secondary">If it finishes exactly as called</span>
              <span className="font-outfit text-caption text-text-primary">+{ceiling}</span>
            </div>
          </div>
        )}

        {chips.length > 0 && (
          <div
            className="flex flex-wrap items-center gap-1.5 border-t border-dashed px-5 py-2.5"
            style={{ borderColor: theme.border, background: 'color-mix(in srgb, var(--surface-app) 40%, transparent)' }}
          >
            <span className="font-outfit text-2xs tracking-widest text-text-muted-4">CHIPS</span>
            {chips.map((c) => {
              const id = REVERSE_CHIP_MAPPING[c] || c;
              return (
                <span key={c} className="rounded-full border border-border-card px-2 py-0.5 font-outfit text-2xs text-brand-amber">
                  {CHIP_CONFIG[id]?.name || badge?.name || c}
                </span>
              );
            })}
          </div>
        )}

        {settled && stamp && (
          <span
            className="pointer-events-none absolute right-4 top-16 rotate-[-8deg] rounded-md border-[2.5px] px-2 py-0.5 font-outfit text-2xs font-bold tracking-wider"
            style={{ borderColor: vc?.fg || theme.pillFg, color: vc?.fg || theme.pillFg }}
          >
            {stamp}
          </span>
        )}

        <button
          type="button"
          onClick={onClose}
          className="flex w-full items-center justify-center gap-1.5 border-t px-4 py-2.5 font-outfit text-2xs tracking-widest text-text-muted-1 hover:text-brand-teal"
          style={{ borderColor: theme.border }}
        >
          CLOSE
        </button>
      </div>
    </div>
  );
}
