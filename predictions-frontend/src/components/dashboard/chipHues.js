/**
 * Per-chip accent hues, literal from the v2 prototype's CHIPS table
 * (frontendPrototype spec §1.8 / Spine.dc.html ~line 4030-4036). Kept local
 * to Dashboard rather than added to utils/chipManager.js's CHIP_CONFIG
 * (whose own `color` field uses generic names like "teal"/"purple" for a
 * different purpose elsewhere in the app) to avoid touching that shared file.
 */
export const CHIP_HUES = {
  doubleDown: '#5eead4',
  wildcard: '#c4b5fd',
  scorerFocus: '#fcd34d',
  defensePlusPlus: '#7dd3fc',
  allInWeek: '#fb7185',
};

export const DEFAULT_CHIP_HUE = '#5eead4';

/**
 * Compact badge codes for the sidebar chip stock (Spine.dc.html's CHIPS
 * table), distinct from CHIP_CONFIG's emoji `icon` used elsewhere in the app.
 */
export const CHIP_BADGES = {
  doubleDown: 'x2',
  wildcard: 'x3',
  scorerFocus: 'S+',
  defensePlusPlus: 'D+',
  allInWeek: 'AI',
};
