import { isGameweekChip, isMatchChip } from './chipManager';

export function matchChipFromIds(chipIds = []) {
  if (!Array.isArray(chipIds)) return null;
  return chipIds.find(isMatchChip) ?? null;
}

export function mergeMatchAndGameweekChips(matchChip, gwChipIds = []) {
  const next = [];
  if (matchChip && isMatchChip(matchChip)) next.push(matchChip);
  for (const id of gwChipIds || []) {
    if (isGameweekChip(id) && !next.includes(id)) next.push(id);
  }
  return next;
}

/**
 * GW chips active this week: status lastUsedGameweek, any filed row this GW, plus optimistic ids.
 */
export function inferActiveGameweekChipIds({
  statusChips = [],
  fixtures = [],
  currentGameweek,
  optimisticIds = [],
} = {}) {
  const fromStatus = (statusChips || [])
    .filter((chip) => {
      const id = chip.chipId || chip.id;
      return isGameweekChip(id) && Number(chip.lastUsedGameweek) === Number(currentGameweek);
    })
    .map((chip) => chip.chipId || chip.id);

  const fromFixtures = [];
  for (const fixture of fixtures || []) {
    const gw = fixture.gameweek ?? fixture.userPrediction?.gameweek;
    if (currentGameweek != null && gw != null && Number(gw) !== Number(currentGameweek)) continue;
    for (const id of fixture.userPrediction?.chips || []) {
      if (isGameweekChip(id)) fromFixtures.push(id);
    }
  }

  return [...new Set([...fromStatus, ...fromFixtures, ...(optimisticIds || [])].filter(Boolean))];
}
