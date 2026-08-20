/**
 * Real-data guard for the season planner's "assign a chip to a future
 * gameweek" action. useChipPlan() itself is a dumb localStorage map (by
 * design — see its own doc comment), so this is new logic specific to the
 * planner, additive per the chips-screen scope. It only uses fields that
 * already come back from the real /chips/status response (via
 * useChipManagement()'s availableChips) — no invented state.
 */
export function whyCannotPlan(chip, gameweek, currentGameweek) {
  if (!chip) return 'Unknown chip';

  if (chip.seasonLimit != null && (chip.remainingUses ?? 0) <= 0) {
    return 'Season limit reached';
  }

  // Still on cooldown right now, and the target gameweek falls before the
  // gameweek it frees up again.
  if (!chip.available && chip.remainingGameweeks > 0) {
    const freeFrom = currentGameweek + chip.remainingGameweeks;
    if (gameweek < freeFrom) {
      return `On cooldown until GW${freeFrom}`;
    }
  }

  return null;
}

export function canPlan(chip, gameweek, currentGameweek) {
  return whyCannotPlan(chip, gameweek, currentGameweek) === null;
}
