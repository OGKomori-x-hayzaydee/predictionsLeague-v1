import { ordinal, formatMonthYear } from '../../utils/leagueStats';

/**
 * League masthead card — real overview + standings data (name, position,
 * points, member count, since, neighbours). `tone` is a presentation-only
 * accent (utils/leagueStats.leagueTone), not derived from any backend field.
 */
export default function LeagueMasthead({ overview, you, tone, memberCount, neighbours, move, onBack }) {
  const position = you?.position;
  const points = you?.points ?? 0;

  return (
    <div
      className="relative flex flex-col gap-4 overflow-hidden rounded-16 border p-[15px] md:gap-4 md:p-[22px_26px]"
      style={{ background: `linear-gradient(135deg, ${tone.tint}, var(--surface-card))`, borderColor: `${tone.var}33` }}
    >
      <span
        className="pointer-events-none absolute -right-1.5 -top-6 select-none font-dmSerif text-[90px] leading-none md:text-[150px]"
        style={{ color: tone.var, opacity: 0.07 }}
      >
        {position ?? ''}
      </span>

      <div className="relative flex items-center gap-3 md:gap-4">
        {onBack && (
          <button
            onClick={onBack}
            aria-label="Back to all leagues"
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-11 border border-border-control bg-surface-card-4/60 text-text-secondary md:hidden"
          >
            &#8249;
          </button>
        )}
        <span
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-12 font-mono text-[14px] font-semibold tracking-[0.04em] md:h-[52px] md:w-[52px] md:rounded-14 md:text-[16px]"
          style={{ background: tone.tint, color: tone.var }}
        >
          {overview?.name?.slice(0, 2).toUpperCase() || '??'}
        </span>
        <div className="flex min-w-0 flex-1 flex-col gap-0.5 md:gap-[2px]">
          <span className="truncate font-dmSerif text-[20px] leading-tight text-text-primary md:text-[25px]">{overview?.name}</span>
          <span className="font-mono text-[10px] tracking-[0.1em] text-text-muted-1 md:text-[10.5px]">
            {memberCount} · SINCE {formatMonthYear(overview?.createdAt)}
          </span>
        </div>
        <div className="flex shrink-0 flex-col items-end gap-0.5 md:hidden">
          <span className="font-dmSerif text-[26px] leading-none" style={{ color: tone.var }}>
            {ordinal(position)}
          </span>
          {move?.label && (
            <span className={`font-mono text-[9.5px] ${move.tone === 'up' ? 'text-brand-teal' : move.tone === 'down' ? 'text-state-error' : 'text-text-muted-2'}`}>
              {move.label}
            </span>
          )}
        </div>
        <div className="hidden items-baseline gap-[11px] md:flex">
          <span className="font-dmSerif text-[46px] leading-none" style={{ color: tone.var }}>
            {ordinal(position)}
          </span>
          <div className="flex flex-col gap-0.5">
            <span className="font-mono text-[10px] tracking-[0.1em] text-text-muted-4">{points} PTS</span>
            {move?.label && (
              <span className={`font-mono text-[10.5px] ${move.tone === 'up' ? 'text-brand-teal' : move.tone === 'down' ? 'text-state-error' : 'text-text-muted-2'}`}>
                {move.label}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="relative flex items-baseline gap-[9px] border-t border-white/10 pt-[11px] md:hidden">
        <span className="font-dmSerif text-[23px] leading-none text-text-primary">{points}</span>
        <span className="font-mono text-[10px] tracking-[0.1em] text-text-muted-1">POINTS</span>
      </div>

      <div className="relative hidden items-center gap-[22px] md:flex">
        <span className="flex min-w-0 flex-1 items-baseline gap-[9px]">
          <span className="font-mono text-[10px] tracking-[0.12em] text-state-error">ABOVE</span>
          <span className="flex-1 truncate text-[13px] text-text-secondary">{neighbours.above ? (neighbours.above.displayName || neighbours.above.username) : 'nobody'}</span>
          {neighbours.above && <span className="font-mono text-[12.5px] text-state-error">+{neighbours.gapAbove}</span>}
        </span>
        <span className="h-4 w-px bg-white/10" />
        <span className="flex min-w-0 flex-1 items-baseline gap-[9px]">
          <span className="font-mono text-[10px] tracking-[0.12em] text-brand-teal">BELOW</span>
          <span className="flex-1 truncate text-[13px] text-text-secondary">{neighbours.below ? (neighbours.below.displayName || neighbours.below.username) : 'nobody'}</span>
          {neighbours.below && <span className="font-mono text-[12.5px] text-brand-teal">−{neighbours.gapBelow}</span>}
        </span>
      </div>

      <span className="relative text-[12px] leading-relaxed text-text-secondary">{neighbours.verdict}</span>
    </div>
  );
}
