import { ChartBar } from '@phosphor-icons/react';

/**
 * Centralized "not enough real history yet" message for Season/All-time's
 * aggregate visualizations — replaces what used to be several small,
 * scattered near-empty states (near-zero stat tiles, a near-flat
 * sparkline, empty hit-rate bars) that read as broken/stub-like rather
 * than intentional. One honest, well-designed message instead, telling
 * the user exactly how many settled gameweeks are left until it unlocks.
 *
 * Does not gate week-*browsing* — Season's ridge + week-drawer keep
 * working the moment there's a single settled week; this only covers the
 * aggregate summary views (see SeasonTab.jsx/AllTimeTab.jsx for exactly
 * what each replaces).
 */
export default function VisualizationsGate({ settledWeeks, threshold = 5 }) {
  const remaining = Math.max(0, threshold - settledWeeks);

  return (
    <div className="flex min-h-[280px] flex-col items-center justify-center gap-3 rounded-14 border border-dashed border-border-control px-6 py-10 text-center">
      <span
        aria-hidden="true"
        className="flex h-14 w-14 items-center justify-center rounded-14 border border-border-card bg-surface-card-3 text-brand-teal"
      >
        <ChartBar size={28} />
      </span>
      <span className="font-dmSerif text-xl text-text-primary">
        {settledWeeks === 0
          ? 'Your visualizations unlock after 5 gameweeks'
          : `${remaining} more settled week${remaining === 1 ? '' : 's'} to go`}
      </span>
      <p className="max-w-sm text-sm text-text-muted-2">
        {settledWeeks === 0
          ? "Charts and season stats need a few results in to say anything real — keep filing predictions and they'll build here."
          : `You're ${settledWeeks} settled week${settledWeeks === 1 ? '' : 's'} in. Once you hit 5, the full breakdown — points trend, hit rates, best/worst weeks — unlocks here.`}
      </p>
    </div>
  );
}
