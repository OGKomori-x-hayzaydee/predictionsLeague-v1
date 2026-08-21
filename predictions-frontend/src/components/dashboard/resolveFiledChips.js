import { CHIP_CONFIG } from '../../utils/chipManager';
import { CHIP_HUES, CHIP_BADGES, CHIP_EFFECTS, DEFAULT_CHIP_HUE } from './chipHues';

/**
 * Shared by every dashboard fixture-preview spine variant (FixturePreviewCard's
 * A/B/D spines and the C/foil variant) so chip id -> display data resolves
 * identically everywhere.
 */
export function resolveFiledChips(chipIds) {
  return chipIds.map((id) => ({
    id,
    name: CHIP_CONFIG[id]?.name || id,
    tag: CHIP_BADGES[id] || CHIP_CONFIG[id]?.icon || '',
    hue: CHIP_HUES[id] || DEFAULT_CHIP_HUE,
    effect: CHIP_EFFECTS[id] || CHIP_CONFIG[id]?.description || '',
  }));
}
