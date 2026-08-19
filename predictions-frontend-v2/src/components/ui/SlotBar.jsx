import KickerLabel from './KickerLabel';

/**
 * Shared secondary contextual bar rendered below the desktop masthead
 * (and reused as an in-page tab strip on mobile screens). Parameterized
 * per screen: a kicker label, optional back button, optional tabs or a
 * reel-navigator, and optional right-aligned content (e.g. deadline pill).
 */
export default function SlotBar({
  kicker,
  onBack,
  tabs,
  activeTab,
  onTabChange,
  reelNav,
  right,
  className = '',
}) {
  return (
    <div
      className={`flex min-h-[46px] items-center gap-4 border-b border-border-hairline bg-surface-bar px-4 py-2.5 md:px-6 ${className}`}
    >
      {onBack && (
        <button
          onClick={onBack}
          aria-label="Back"
          className="text-lg text-text-muted-2 transition-colors hover:text-text-primary"
        >
          &#8249;
        </button>
      )}

      {kicker && <KickerLabel className="shrink-0">{kicker}</KickerLabel>}

      {tabs && tabs.length > 0 && (
        <div className="flex items-center gap-1 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange?.(tab.id)}
              className={`shrink-0 rounded-full px-3 py-1 font-mono text-[11px] uppercase tracking-wide transition-colors ${
                tab.id === activeTab
                  ? 'bg-brand-teal/15 text-brand-teal'
                  : 'text-text-muted-2 hover:text-text-primary'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      )}

      {reelNav && (
        <div className="flex items-center gap-3 font-mono text-[11px] text-text-muted-1">
          <button
            onClick={reelNav.onPrev}
            disabled={!reelNav.canPrev}
            className="disabled:opacity-30"
            aria-label="Previous"
          >
            &#8249;
          </button>
          <span className="tabular-nums">{reelNav.counter}</span>
          <span className="max-w-[160px] truncate text-text-secondary normal-case">{reelNav.title}</span>
          {reelNav.status && (
            <span
              className="rounded-full border px-2 py-0.5"
              style={{ borderColor: reelNav.status.border, color: reelNav.status.fg, background: reelNav.status.bg }}
            >
              {reelNav.status.label}
            </span>
          )}
          <button
            onClick={reelNav.onNext}
            disabled={!reelNav.canNext}
            className="disabled:opacity-30"
            aria-label="Next"
          >
            &#8250;
          </button>
        </div>
      )}

      <div className="ml-auto flex shrink-0 items-center gap-3">{right}</div>
    </div>
  );
}
