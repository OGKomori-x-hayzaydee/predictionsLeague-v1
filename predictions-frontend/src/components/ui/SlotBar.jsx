import { ArrowLeft, ArrowRight } from '@phosphor-icons/react';
import KickerLabel from './KickerLabel';
import IconButton from './buttons/IconButton';

/**
 * Desktop secondary bar. Hidden below lg so phone/tablet pages own their header.
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
      className={`hidden h-14 items-center gap-4 border-b border-border-base bg-surface-bar px-4 lg:flex lg:px-6 ${className}`}
    >
      {onBack && (
        <IconButton label="Back" onClick={onBack} className="rounded-md border border-border-card bg-surface-card">
          &#8249;
        </IconButton>
      )}

      {kicker && (
        <KickerLabel as="span" className="shrink-0 whitespace-nowrap">
          {kicker}
        </KickerLabel>
      )}

      <span className="hidden h-4 w-px shrink-0 bg-border-card sm:block" />

      {reelNav && (
        <div className="flex shrink-0 items-center gap-3">
          <IconButton
            label="Previous"
            onClick={reelNav.onPrev}
            disabled={!reelNav.canPrev}
            className="rounded-full border border-border-control bg-surface-card disabled:opacity-30"
          >
            <ArrowLeft size={16} weight="bold" />
          </IconButton>
          <span className="min-w-14 text-center font-outfit text-caption tracking-[0.14em] text-brand-teal">
            {reelNav.counter}
          </span>
          <IconButton
            label="Next"
            onClick={reelNav.onNext}
            disabled={!reelNav.canNext}
            className="rounded-full border border-border-control bg-surface-card disabled:opacity-30"
          >
            <ArrowRight size={16} weight="bold" />
          </IconButton>
          <span className="h-4 w-px bg-border-card" />
          <span className="whitespace-nowrap text-base text-text-secondary">{reelNav.title}</span>
          {reelNav.status && (
            <span
              className="whitespace-nowrap rounded-sm border px-2.5 py-1 font-outfit text-caption tracking-[0.1em]"
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
              type="button"
              onClick={() => onTabChange?.(tab.id)}
          className={`flex h-full shrink-0 items-center whitespace-nowrap text-base transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-teal ${
                tab.id === activeTab
                  ? 'text-brand-teal shadow-[inset_0_-2px_0_0_var(--color-brand-teal)]'
                  : 'text-text-muted hover:text-text-primary'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      )}

      <div className="ml-auto flex min-w-0 shrink items-center gap-3">
        {right && <span className="min-w-0 truncate font-outfit text-base text-text-muted">{right}</span>}
        {deadline && (
          <span className="flex shrink-0 items-center gap-2 rounded-full border border-border-control bg-surface-elevated/70 px-3 py-1.5">
            <span className="size-2 shrink-0 rounded-full bg-brand-amber" />
            <span className="whitespace-nowrap font-outfit text-sm text-brand-amber">{deadline} to deadline</span>
          </span>
        )}
        {trailing}
      </div>
    </div>
  );
}
