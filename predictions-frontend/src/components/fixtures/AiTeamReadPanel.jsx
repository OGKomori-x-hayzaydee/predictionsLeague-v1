import KickerLabel from '../ui/KickerLabel';

/**
 * Honest placeholder for the prototype's "AI TEAM READ" panel — availability/
 * injuries, goals-in-last-5 + xG, and likely scorers (Spine.dc.html desktop
 * lines 458-534, mobile lines 2409-2447/2565-2602). None of this has a
 * backend source: FixtureController/PredictionController expose only
 * fixtures, squads and predictions — no injury feed, no form/xG service, no
 * per-player scoring-likelihood model. Matches the Dashboard rebuild's
 * FixturePreviewCard precedent (and RivalsSection) — render an honest
 * "coming soon" collapsible section instead of fabricating numbers.
 */
export default function AiTeamReadPanel({ open, onToggle }) {
  return (
    <div className="flex w-full flex-col overflow-hidden rounded-14 border border-border-card bg-surface-card/70">
      <button
        type="button"
        onClick={onToggle}
        className="flex items-center gap-[9px] px-4 py-[13px] text-left"
      >
        <span className="h-[5px] w-[5px] shrink-0 rounded-full bg-brand-indigo" />
        <KickerLabel as="span" className="tracking-[0.16em] text-text-muted-3">
          AI team read
        </KickerLabel>
        <span className="ml-auto shrink-0 font-mono text-xs text-text-muted-2">{open ? '▴' : '▾'}</span>
      </button>
      {open && (
        <div className="border-t border-border-base px-4 py-[14px]">
          <p className="text-xs leading-relaxed text-text-muted-1">
            Availability, recent goals/xG form and likely-scorer reads are arriving once a real
            injury feed and odds/model data source are wired in for this fixture — this isn&apos;t
            guesswork we&apos;re willing to show you yet.
          </p>
        </div>
      )}
    </div>
  );
}
