import { hasSeasonCap } from '../../utils/chipStatus';

/** Chip accents resolve from CSS vars so light/dark stay in sync. */
export const CHIP_HUES = {
  doubleDown: 'var(--chip-teal)',
  wildcard: 'var(--chip-violet)',
  scorerFocus: 'var(--chip-amber)',
  defensePlusPlus: 'var(--chip-sky)',
  allInWeek: 'var(--chip-rose)',
};

export const DEFAULT_CHIP_HUE = 'var(--chip-teal)';

export const CHIP_TAGS = {
  doubleDown: '×2',
  wildcard: '×3',
  scorerFocus: 'S+',
  defensePlusPlus: 'D+',
  allInWeek: 'AI',
};

export const CHIP_BADGES = CHIP_TAGS;

export const CHIP_EFFECTS = {
  doubleDown: 'all points doubled',
  wildcard: 'all points tripled',
  scorerFocus: 'scorer points doubled',
  defensePlusPlus: 'clean sheets doubled',
  allInWeek: 'gameweek score doubled',
};

export function chipStatusLabel(chip) {
  if (hasSeasonCap(chip)) {
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
