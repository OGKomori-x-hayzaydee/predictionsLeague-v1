import KickerLabel from './KickerLabel';

/**
 * Shared secondary contextual bar. Each screen renders this as the first
 * thing inside its own content. `trailing` slots extra chrome (preview
 * toggle) into the right cluster so the bar stays one full-width strip.
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
  trailing,
  className = '',
}) {
  return (
    <div
      className={`flex h-14 items-center gap-[22px] border-b border-border-base bg-surface-bar px-4 md:px-[22px] ${className}`}
    >
      {onBack && (
        <button
          onClick={onBack}
          aria-label="Back"
          className="flex size-8 shrink-0 items-center justify-center rounded-7 border border-border-card bg-surface-card-4 text-base leading-none text-text-muted-2 transition-colors hover:border-brand-teal-mid/40 hover:text-brand-teal"
        >
          &#8249;
        </button>
      )}

      {kicker && (
        <KickerLabel as="span" className="shrink-0 whitespace-nowrap tracking-[0.16em] text-text-muted-5">
          {kicker}
        </KickerLabel>
      )}

      <span className="hidden h-4 w-px shrink-0 bg-border-card sm:block" />

      {reelNav && (
        <div className="flex shrink-0 items-center gap-3">
          <button
            onClick={reelNav.onPrev}
            disabled={!reelNav.canPrev}
            aria-label="Previous"
            className="flex size-8 items-center justify-center rounded-7 border border-border-control bg-surface-card-4/70 text-text-muted-1 transition-colors hover:border-brand-teal-mid/40 hover:text-brand-teal disabled:opacity-30"
          >
            &#8249;
          </button>
          <span className="min-w-14 text-center font-outfit text-caption tracking-[0.14em] text-brand-teal">
            {reelNav.counter}
          </span>
          <button
            onClick={reelNav.onNext}
            disabled={!reelNav.canNext}
            aria-label="Next"
            className="flex size-8 items-center justify-center rounded-7 border border-border-control bg-surface-card-4/70 text-text-muted-1 transition-colors hover:border-brand-teal-mid/40 hover:text-brand-teal disabled:opacity-30"
          >
            &#8250;
          </button>
          <span className="h-4 w-px bg-border-card" />
          <span className="whitespace-nowrap text-base text-text-secondary">{reelNav.title}</span>
          {reelNav.status && (
            <span
              className="whitespace-nowrap rounded-xs border px-2.5 py-1 font-outfit text-caption tracking-[0.1em]"
              style={{ borderColor: reelNav.status.border, color: reelNav.status.fg, background: reelNav.status.bg }}
            >
              {reelNav.status.label}
            </span>
          )}
        </div>
      )}

      {tabs && tabs.length > 0 && (
        <div className="flex h-full items-center gap-5 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange?.(tab.id)}
              className={`flex h-full shrink-0 items-center whitespace-nowrap text-base transition-colors ${
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

      <div className="ml-auto flex min-w-0 shrink items-center gap-3">
        {right && <span className="min-w-0 truncate font-outfit text-caption text-text-muted-2">{right}</span>}
        {deadline && (
          <span className="flex shrink-0 items-center gap-2 rounded-full border border-border-control bg-surface-card-4/70 px-3 py-1.5">
            <span className="size-2 shrink-0 rounded-full bg-brand-amber animate-[tick_2s_ease-in-out_infinite]" />
            <span className="whitespace-nowrap font-outfit text-caption text-brand-amber">{deadline} to deadline</span>
          </span>
        )}
        {trailing}
      </div>
    </div>
  );
}
