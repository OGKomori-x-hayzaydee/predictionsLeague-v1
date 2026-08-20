/**
 * Per-chip accent hues + short poker-chip tags, literal from the v2
 * prototype's CHIPS table (frontendPrototype spec §1.8 / Spine.dc.html
 * ~line 4030-4036). Kept local to chips (mirrors components/fixtures/
 * chipHues.js and components/dashboard/chipHues.js) rather than added to
 * utils/chipManager.js's CHIP_CONFIG (whose own `color`/`icon` fields use
 * generic names + emoji for a different purpose elsewhere in the app) to
 * avoid touching that shared file.
 */
export const CHIP_HUES = {
  doubleDown: '#5eead4',
  wildcard: '#c4b5fd',
  scorerFocus: '#fcd34d',
  defensePlusPlus: '#7dd3fc',
  allInWeek: '#fb7185',
};

export const DEFAULT_CHIP_HUE = '#5eead4';

// Short poker-chip token labels (CHIPS[].tag in the prototype) — fit inside
// a small circular token where CHIP_CONFIG's emoji icons ("🛡️", "🎯") read
// poorly at 10-13px.
export const CHIP_TAGS = {
  doubleDown: '×2',
  wildcard: '×3',
  scorerFocus: 'S+',
  defensePlusPlus: 'D+',
  allInWeek: 'AI',
};

/**
 * Real chip status label — unlike the prototype's fictional SCHIPS table
 * (which gives every chip a season "allowance"), the real CHIP_CONFIG only
 * caps All-In Week (seasonLimit: 4); Double Down/Wildcard/Scorer
 * Focus/Defence++ are unlimited-use, cooldown-gated instead. Reflect
 * whichever constraint actually applies to this chip rather than forcing
 * every chip into an "N left" shape.
 */
export function chipStatusLabel(chip) {
  if (chip.seasonLimit != null) {
    const remaining = chip.remainingUses ?? Math.max(chip.seasonLimit - (chip.usageCount ?? 0), 0);
    return { text: `${remaining} of ${chip.seasonLimit} left`, warn: remaining === 0 };
  }
  if (!chip.available && chip.remainingGameweeks > 0) {
    return { text: `cooldown · ${chip.remainingGameweeks} GW${chip.remainingGameweeks === 1 ? '' : 's'}`, warn: true };
  }
  if (!chip.available) {
    return { text: chip.reason || 'Unavailable', warn: true };
  }
  return { text: 'Ready', warn: false };
}
