import KickerLabel from './KickerLabel';

/**
 * Shared secondary contextual bar (foundation spec §5.2), rendered by each
 * screen as the first thing inside its own content — the shell itself
 * (AppShell/TopNav) doesn't know about per-screen context. Also usable
 * as an in-page tab strip inside mobile scroll content, since the mobile
 * shell has no chrome-level equivalent of this bar.
 *
 * Modes (screen picks whichever applies, none are mutually required):
 * - `reelNav` — GW-reel prev/next/counter/title/status-pill (Fixtures).
 * - `tabs` + `activeTab` + `onTabChange` — flat underline tabs (Profile/
 *   Settings/Leagues/My Record). No pill background, unlike nav buttons.
 * - neither — plain kicker (+ optional back button) bar.
 *
 * `deadline`: pass a countdown string (e.g. from useNextMatch()'s
 * `timeDisplay`) to render the always-present amber pulsing-dot pill. Left
 * undefined/null on screens with no real deadline value — never fabricated.
 */
export default function SlotBar({
  kicker,
  onBack,
  tabs,
  activeTab,
  onTabChange,
  reelNav,
  right,
  deadline,
  className = '',
}) {
  return (
    <div
      className={`flex min-h-[46px] items-center gap-[22px] border-b border-border-base bg-surface-bar px-4 md:px-[22px] ${className}`}
    >
      {onBack && (
        <button
          onClick={onBack}
          aria-label="Back"
          className="flex h-6 w-6 shrink-0 items-center justify-center rounded-7 border border-border-card bg-surface-card-4 text-sm leading-none text-text-muted-2 transition-colors hover:border-brand-teal-mid/40 hover:text-brand-teal"
        >
          &#8249;
        </button>
      )}

      {kicker && (
        <KickerLabel as="span" className="shrink-0 whitespace-nowrap tracking-[0.16em] text-text-muted-5">
          {kicker}
        </KickerLabel>
      )}

      <span className="hidden h-3.5 w-px shrink-0 bg-border-card sm:block" />

      {reelNav && (
        <div className="flex shrink-0 items-center gap-[11px]">
          <button
            onClick={reelNav.onPrev}
            disabled={!reelNav.canPrev}
            aria-label="Previous"
            className="flex h-[26px] w-[26px] items-center justify-center rounded-7 border border-border-control bg-surface-card-4/70 text-text-muted-1 transition-colors hover:border-brand-teal-mid/40 hover:text-brand-teal disabled:opacity-30"
          >
            &#8249;
          </button>
          <span className="min-w-[52px] text-center font-outfit text-2xs tracking-[0.14em] text-brand-teal">
            {reelNav.counter}
          </span>
          <button
            onClick={reelNav.onNext}
            disabled={!reelNav.canNext}
            aria-label="Next"
            className="flex h-[26px] w-[26px] items-center justify-center rounded-7 border border-border-control bg-surface-card-4/70 text-text-muted-1 transition-colors hover:border-brand-teal-mid/40 hover:text-brand-teal disabled:opacity-30"
          >
            &#8250;
          </button>
          <span className="h-3.5 w-px bg-border-card" />
          <span className="whitespace-nowrap text-sm text-text-secondary">{reelNav.title}</span>
          {reelNav.status && (
            <span
              className="whitespace-nowrap rounded-xs border px-[9px] py-[3px] font-outfit text-2xs tracking-[0.1em]"
              style={{ borderColor: reelNav.status.border, color: reelNav.status.fg, background: reelNav.status.bg }}
            >
              {reelNav.status.label}
            </span>
          )}
        </div>
      )}

      {tabs && tabs.length > 0 && (
        <div className="flex h-full items-center gap-4 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange?.(tab.id)}
              className={`flex h-full shrink-0 items-center whitespace-nowrap text-sm transition-colors ${
                tab.id === activeTab
                  ? 'text-brand-teal shadow-[inset_0_-2px_0_0_var(--color-brand-teal)]'
                  : 'text-text-muted-2 hover:text-text-primary'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      )}

      <div className="ml-auto flex shrink-0 items-center gap-3">
        {right && <span className="whitespace-nowrap font-outfit text-2xs text-text-muted-2">{right}</span>}
        {deadline && (
          <span className="flex shrink-0 items-center gap-[7px] rounded-full border border-border-control bg-surface-card-4/70 px-[11px] py-[5px]">
            <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-brand-amber animate-[tick_2s_ease-in-out_infinite]" />
            <span className="whitespace-nowrap font-outfit text-2xs text-brand-amber">{deadline} to deadline</span>
          </span>
        )}
      </div>
    </div>
  );
}
