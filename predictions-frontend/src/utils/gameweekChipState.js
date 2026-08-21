import { isGameweekChip, isMatchChip } from './chipManager';

export function matchChipsFromIds(chipIds = []) {
  if (!Array.isArray(chipIds)) return [];
  return [...new Set(chipIds.filter(isMatchChip))];
}

export function mergeMatchAndGameweekChips(matchChipIds = [], gwChipIds = []) {
  const next = [];
  for (const id of matchChipIds || []) {
    if (isMatchChip(id) && !next.includes(id)) next.push(id);
  }
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
