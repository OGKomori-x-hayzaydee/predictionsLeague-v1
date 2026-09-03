/** Dashboard right rail — use on every page that has a side rail. */
export const SIDE_RAIL_PX = 400;

export const SIDE_RAIL_GRID = 'md:grid-cols-[minmax(0,1fr)_400px]';

/**
 * Inner width for My Record / Leagues main columns so cards don’t stretch.
 * 940 rather than the original 820: beside the 400px rail an 820 cap left
 * ~170px of the column unused on a 1440-wide screen, which read as cramped
 * once cards stopped being laid out two-up. Still capped, so nothing
 * stretches edge-to-edge on very wide monitors.
 */
export const MAIN_PANE_CLASS = 'mx-auto w-full max-w-[940px]';
