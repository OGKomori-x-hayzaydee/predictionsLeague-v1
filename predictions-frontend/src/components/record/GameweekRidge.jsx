/**
 * Clickable per-gameweek points ridge — Spine.dc.html desktop lines 771-784
 * (`REC.ridge`) / mobile lines 2653-2660 (`REC.mobRidge`). One responsive
 * component covers both breakpoints (bar height/gap shrink on mobile via
 * Tailwind, no separate mobile variant needed).
 */
export default function GameweekRidge({ weeks, selected, onSelect }) {
  if (!weeks.length) {
    return (
      <div className="flex h-[68px] items-center justify-center font-mono text-[11px] text-text-muted-3">
        No settled gameweeks yet
      </div>
    );
  }

  const max = Math.max(1, ...weeks.map((w) => w.points));

  return (
    <div className="relative border-b border-border-base pb-3.5">
      <div className="flex h-[68px] items-end justify-between gap-[3px] md:h-[100px]">
        {weeks.map((w) => {
          const on = w.gameweek === selected;
          const h = Math.max(6, Math.round((w.points / max) * 68));
          return (
            <button
              key={w.gameweek}
              onClick={() => onSelect(on ? null : w.gameweek)}
              className="flex h-full flex-1 flex-col items-center justify-end gap-1"
            >
              <span
                className="font-mono text-[9px]"
                style={{ color: on ? 'var(--brand-teal)' : 'var(--text-muted-4)' }}
              >
                {w.points}
              </span>
              <span
                className="w-full max-w-[26px] rounded-t-[3px] transition-colors"
                style={{
                  height: `${on ? h * 1.3 : h}px`,
                  background: on ? 'var(--brand-teal)' : w.points >= max * 0.85 ? 'var(--brand-teal-deep)' : 'var(--border-control)',
                }}
              />
              <span
                className="h-[13px] font-mono text-[9px]"
                style={{ color: on ? 'var(--brand-teal)' : 'var(--text-muted-4)' }}
              >
                {w.gameweek % 4 === 0 || on ? w.gameweek : ''}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
