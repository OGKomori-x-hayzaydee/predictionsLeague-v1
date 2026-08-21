import { useEffect } from 'react';
import TeamCrest from '../ui/TeamCrest';
import KickerLabel from '../ui/KickerLabel';
import { chipBadge, verdictColors } from '../../utils/leagueStats';
import { getPointsBreakdown, calculateCeilingPoints } from '../../utils/pointsCalculation';

function outcome(home, away) {
  if (home > away) return 'home win';
  if (home < away) return 'away win';
  return 'draw';
}

function signed(n) {
  if (n == null) return '';
  return n > 0 ? `+${n}` : String(n);
}

/**
 * Spine "How this scored" overlay for a single form-book cell.
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
  const rows = [];

  if (settled && breakdown) {
    if (breakdown.perfectPrediction) rows.push({ label: 'Perfect prediction', val: signed(breakdown.perfectPrediction) });
    if (breakdown.exactScore) rows.push({ label: 'Exact scoreline called', val: signed(breakdown.exactScore) });
    if (breakdown.correctDraw) rows.push({ label: 'Correct draw', val: signed(breakdown.correctDraw) });
    if (breakdown.correctOutcome) rows.push({ label: 'Right winner', val: signed(breakdown.correctOutcome) });
    if (breakdown.goalscorers) rows.push({ label: 'Named scorers', val: signed(breakdown.goalscorers) });
    if (breakdown.goalDiffPenalty) rows.push({ label: 'Goal-difference penalty', val: signed(breakdown.goalDiffPenalty), danger: true });
    if (breakdown.wildcard) rows.push({ label: 'Wildcard', val: breakdown.wildcard, chip: true });
    if (breakdown.doubleDown) rows.push({ label: 'Double Down', val: breakdown.doubleDown, chip: true });
    if (breakdown.allInWeek) rows.push({ label: 'All-In Week', val: breakdown.allInWeek, chip: true });
    if (breakdown.defensePlusPlus) rows.push({ label: 'Defense++', val: signed(breakdown.defensePlusPlus), chip: true });
    if (rows.length === 0) rows.push({ label: 'No points on this call', val: '0' });
  } else {
    const ceiling = calculateCeilingPoints(p);
    rows.push({ label: 'If it finishes exactly as called', val: signed(ceiling) });
    if (badge) rows.push({ label: `${badge.name} is riding on this one`, val: badge.tag, chip: true });
  }

  const total = settled ? cell.points : null;
  const name = member.isCurrentUser ? 'You' : member.name;

  return (
    <div
      className="absolute inset-0 z-20 flex items-center justify-center bg-surface-app/70 p-6"
      onClick={onClose}
      role="presentation"
    >
      <div
        className="flex w-full max-w-md flex-col gap-4 rounded-16 border border-border-card bg-surface-modal p-5 shadow-modal"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-label="How this scored"
      >
        <div className="flex items-center gap-3">
          <span
            className={`flex size-10 shrink-0 items-center justify-center rounded-full text-sm font-semibold ${
              member.isCurrentUser ? 'bg-brand-teal-deep text-brand-teal-tint' : 'bg-surface-card-4 text-text-muted-1'
            }`}
          >
            {member.initial}
          </span>
          <div className="flex min-w-0 flex-1 flex-col gap-0.5">
            <span className="truncate font-dmSerif text-lg text-text-primary">{name}</span>
            <span className="flex items-center gap-1.5 text-caption text-text-muted-2">
              <TeamCrest team={fixture.homeTeam} size={16} className="size-4" />
              {fixture.homeTeam} v {fixture.awayTeam}
              <TeamCrest team={fixture.awayTeam} size={16} className="size-4" />
            </span>
          </div>
          {settled && (
            <span className="font-dmSerif text-2xl leading-none" style={{ color: vc?.fg || 'var(--text-primary)' }}>
              {signed(total)}
            </span>
          )}
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div className="flex flex-col gap-0.5 rounded-12 border border-border-card bg-surface-card-3 p-3">
            <KickerLabel>PREDICTION</KickerLabel>
            <span className="font-outfit text-caption text-text-primary">
              {p.homeScore}–{p.awayScore} {outcome(p.homeScore, p.awayScore)}
            </span>
          </div>
          <div className="flex flex-col gap-0.5 rounded-12 border border-border-card bg-surface-card-3 p-3">
            <KickerLabel>RESULT</KickerLabel>
            <span className="font-outfit text-caption" style={{ color: settled ? (cell.verdict === 'exact' ? 'var(--color-brand-teal)' : 'var(--text-primary)') : 'var(--text-muted-3)' }}>
              {settled ? `${fixture.actualHomeScore}–${fixture.actualAwayScore} ${outcome(fixture.actualHomeScore, fixture.actualAwayScore)}` : 'not yet'}
            </span>
          </div>
          <div className="flex flex-col gap-0.5 rounded-12 border border-border-card bg-surface-card-3 p-3">
            <KickerLabel>CHIPS</KickerLabel>
            <span className="font-outfit text-caption text-text-primary">{badge ? badge.name : 'none played'}</span>
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <KickerLabel>{settled ? 'HOW THIS SCORED' : 'IF IT LANDS'}</KickerLabel>
          {rows.map((r) => (
            <span key={r.label} className="flex items-baseline justify-between gap-3 border-b border-border-hairline py-2 last:border-0">
              <span className="text-caption text-text-muted-2">{r.label}</span>
              <span className={`font-outfit text-caption ${r.danger ? 'text-state-error' : r.chip ? 'text-brand-amber' : 'text-text-primary'}`}>
                {r.val}
              </span>
            </span>
          ))}
          {settled && (
            <span className="flex items-baseline justify-between gap-3 pt-2">
              <span className="font-outfit text-2xs tracking-widest text-text-muted-3">TOTAL</span>
              <span className="font-dmSerif text-xl leading-none text-brand-teal">{signed(total)}</span>
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
