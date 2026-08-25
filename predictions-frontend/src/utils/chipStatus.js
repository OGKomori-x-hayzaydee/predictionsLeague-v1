import { toFrontendChipId } from './backendMappings';

/**
 * Backend seasonLimit 0 means unlimited (cooldown-gated), not "zero uses left".
 */
export function hasSeasonCap(chip) {
  return typeof chip?.seasonLimit === 'number' && chip.seasonLimit > 0;
}

function normalizeSeasonLimit(raw) {
  if (raw == null || raw === 0) return null;
  const n = Number(raw);
  return Number.isFinite(n) && n > 0 ? n : null;
}

/**
 * Normalize one /chips/status UserChip into the shape the UI consumes.
 * Static display fields (name, icon, scope) are merged later from CHIP_CONFIG.
 */
export function normalizeChipFromBackend(backendChip) {
  if (!backendChip) return null;

  const chipId = toFrontendChipId(backendChip.chipId) || backendChip.chipId;
  const seasonLimit = normalizeSeasonLimit(backendChip.seasonLimit);
  const usageCount = Number(backendChip.seasonUsageCount ?? backendChip.usageCount ?? 0) || 0;
  const remainingGameweeks = Number(backendChip.remainingGameweeks ?? 0) || 0;

  let available = backendChip.available;
  if (available == null) {
    available = remainingGameweeks === 0;
  }

  const remainingUses = seasonLimit != null ? Math.max(seasonLimit - usageCount, 0) : null;

  return {
    ...backendChip,
    id: chipId,
    chipId,
    usageCount,
    seasonLimit,
    remainingUses,
    remainingGameweeks,
    lastUsedGameweek: backendChip.lastUsedGameweek ?? 0,
    available: Boolean(available),
    reason: backendChip.reason || (available ? 'Available' : 'Unavailable'),
  };
}

export function normalizeChipStatusPayload(data) {
  const chips = (data?.chips || [])
    .map(normalizeChipFromBackend)
    .filter(Boolean);

  return {
    ...data,
    chips,
  };
}
