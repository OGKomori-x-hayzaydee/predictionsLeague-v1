/**
 * Clickable per-gameweek points ridge — Spine.dc.html desktop lines 771-784
 * (`REC.ridge`) / mobile lines 2653-2660 (`REC.mobRidge`). One responsive
 * component covers both breakpoints (bar height/gap shrink on mobile via
 * Tailwind, no separate mobile variant needed).
 */
export default function GameweekRidge({ weeks, selected, onSelect }) {
  if (!weeks.length) {
    return (
      <div className="flex h-[68px] items-center justify-center font-outfit text-2xs text-text-muted-3">
        No settled gameweeks yet
      </div>
    );
  }

  const max = Math.max(1, ...weeks.map((w) => w.points));
  // Early in a season a handful of weeks stretched across the full pane read
  // as two lonely slivers a screen apart. Below this count the bars keep a
  // fixed width and group in the centre instead of spreading.
  const sparse = weeks.length <= 8;

  return (
    <div className="relative border-b border-border-base pb-3.5">
      <div
        className={`flex h-[68px] items-end md:h-[100px] ${
          sparse ? 'justify-center gap-3 md:gap-5' : 'justify-between gap-[3px]'
        }`}
      >
        {weeks.map((w) => {
          const on = w.gameweek === selected;
          const h = Math.max(6, Math.round((w.points / max) * 68));
          return (
            <button
              key={w.gameweek}
              onClick={() => onSelect(on ? null : w.gameweek)}
              aria-pressed={on}
              className={`group flex h-full cursor-pointer flex-col items-center justify-end gap-1 ${
                sparse ? 'w-12 flex-none md:w-16' : 'flex-1'
              }`}
            >
              <span
                className="font-outfit text-3xs transition-colors group-hover:text-brand-teal-pale"
                style={{ color: on ? 'var(--brand-teal)' : 'var(--text-muted-4)' }}
              >
                {w.points}
              </span>
              <span
                className={`w-full rounded-t-[3px] transition-colors group-hover:brightness-125 ${sparse ? '' : 'max-w-[26px]'}`}
                style={{
                  height: `${on ? h * 1.3 : h}px`,
                  background: on ? 'var(--brand-teal)' : w.points >= max * 0.85 ? 'var(--brand-teal-deep)' : 'var(--border-control)',
                }}
              />
              <span
                className="h-[13px] font-outfit text-3xs transition-colors group-hover:text-brand-teal-pale"
                style={{ color: on ? 'var(--brand-teal)' : 'var(--text-muted-4)' }}
              >
                {sparse ? `GW${w.gameweek}` : w.gameweek % 4 === 0 || on ? w.gameweek : ''}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
