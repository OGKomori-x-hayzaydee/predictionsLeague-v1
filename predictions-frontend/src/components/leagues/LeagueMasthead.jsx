import { ordinal, formatMonthYear } from '../../utils/leagueStats';

/**
 * League masthead card — real overview + standings data (name, position,
 * points, member count, since, neighbours).
 */
export default function LeagueMasthead({ overview, you, tone, memberCount, neighbours, move, onBack }) {
  const position = you?.position;
  const points = you?.points ?? 0;
  const initials = overview?.name?.slice(0, 2).toUpperCase() || '??';

  return (
    <div
      className="relative flex shrink-0 flex-col gap-4 overflow-hidden rounded-16 border p-4 md:gap-4 md:px-6 md:py-5"
      style={{ background: `linear-gradient(135deg, ${tone.tint}, var(--surface-card))`, borderColor: `${tone.var}33` }}
    >
      <span
        className="pointer-events-none absolute -right-1.5 -top-6 select-none font-dmSerif text-8xl leading-none md:text-9xl"
        style={{ color: tone.var, opacity: 0.07 }}
        aria-hidden
      >
        {ordinal(position)}
      </span>

      <div className="relative flex min-w-0 items-center gap-3 md:gap-4">
        {onBack && (
          <button
            onClick={onBack}
            aria-label="Back to all leagues"
            className="flex size-11 shrink-0 items-center justify-center rounded-11 border border-border-control bg-surface-card-4/60 text-sm text-text-secondary md:hidden"
          >
            &#8249;
          </button>
        )}
        <span
          className="flex size-11 shrink-0 items-center justify-center rounded-12 font-outfit text-sm font-semibold md:size-12 md:rounded-14 md:text-base"
          style={{ background: tone.tint, color: tone.var }}
        >
          {initials}
        </span>
        <div className="flex min-w-0 flex-1 flex-col gap-0.5">
          <span className="truncate font-dmSerif text-2xl leading-none text-text-primary md:text-3xl">
            {overview?.name}
          </span>
          <span className="truncate font-outfit text-2xs tracking-widest text-text-muted-1">
            {memberCount} · SINCE {formatMonthYear(overview?.createdAt)}
          </span>
        </div>
        <div className="flex shrink-0 flex-col items-end gap-0.5 md:hidden">
          <span className="font-dmSerif text-2xl leading-none" style={{ color: tone.var }}>
            {ordinal(position)}
          </span>
          {move?.label && (
            <span className={`font-outfit text-3xs ${move.tone === 'up' ? 'text-brand-teal' : move.tone === 'down' ? 'text-state-error' : 'text-text-muted-2'}`}>
              {move.label}
            </span>
          )}
        </div>
        <div className="hidden shrink-0 items-baseline gap-2.5 md:flex">
          <span className="font-dmSerif text-5xl leading-none" style={{ color: tone.var }}>
            {ordinal(position)}
          </span>
          <div className="flex flex-col gap-0.5">
            <span className="font-outfit text-2xs tracking-widest text-text-muted-4">{points} PTS</span>
            {move?.label && (
              <span className={`font-outfit text-2xs ${move.tone === 'up' ? 'text-brand-teal' : move.tone === 'down' ? 'text-state-error' : 'text-text-muted-2'}`}>
                {move.label}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="relative flex items-baseline gap-2 border-t border-white/10 pt-3 md:hidden">
        <span className="font-dmSerif text-2xl leading-none text-text-primary">{points}</span>
        <span className="font-outfit text-2xs tracking-widest text-text-muted-1">POINTS</span>
      </div>

      <div className="relative hidden h-px bg-white/10 md:block" />

      <div className="relative hidden items-center gap-5 md:flex">
        <span className="flex min-w-0 flex-1 items-baseline gap-2">
          <span className="font-outfit text-2xs tracking-widest text-state-error">ABOVE</span>
          <span className="min-w-0 flex-1 truncate text-caption text-text-secondary">
            {neighbours.above ? (neighbours.above.displayName || neighbours.above.username) : 'nobody'}
          </span>
          {neighbours.above && <span className="shrink-0 font-outfit text-caption text-state-error">+{neighbours.gapAbove}</span>}
        </span>
        <span className="h-4 w-px shrink-0 bg-white/10" />
        <span className="flex min-w-0 flex-1 items-baseline gap-2">
          <span className="font-outfit text-2xs tracking-widest text-brand-teal">BELOW</span>
          <span className="min-w-0 flex-1 truncate text-caption text-text-secondary">
            {neighbours.below ? (neighbours.below.displayName || neighbours.below.username) : 'nobody'}
          </span>
          {neighbours.below && <span className="shrink-0 font-outfit text-caption text-brand-teal">−{neighbours.gapBelow}</span>}
        </span>
      </div>

      <span className="relative text-caption leading-relaxed text-text-secondary">{neighbours.verdict}</span>
    </div>
  );
}
