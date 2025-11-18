/**
 * Utility functions for calculating prediction points
 */

/**
 * Calculate points for a prediction based on actual results
 * @param {Object} prediction - The prediction object
 * @returns {number} - Total points earned
 */
export function calculatePoints(prediction) {
  // If no actual results yet, return null for pending predictions
  if (prediction.actualHomeScore === null || prediction.actualHomeScore === undefined ||
      prediction.actualAwayScore === null || prediction.actualAwayScore === undefined) {
    return null;
  }

  let basePoints = 0;

  // 1. Score Prediction Points
  if (prediction.homeScore === prediction.actualHomeScore && 
      prediction.awayScore === prediction.actualAwayScore) {
    // Exact scoreline: +10 points
    basePoints += 10;
  } else if (
    // Correct outcome: +5 points (only if not exact score)
    (prediction.homeScore > prediction.awayScore && prediction.actualHomeScore > prediction.actualAwayScore) ||
    (prediction.homeScore < prediction.awayScore && prediction.actualHomeScore < prediction.actualAwayScore) ||
    (prediction.homeScore === prediction.awayScore && prediction.actualHomeScore === prediction.actualAwayScore)
  ) {
    basePoints += 5;
  }
  // Otherwise: 0 points for incorrect outcome

  // 2. Goalscorer Points (+2 per correct prediction)
  if (prediction.homeScorers && prediction.actualHomeScorers) {
    const homeCorrect = prediction.homeScorers.filter(scorer => 
      prediction.actualHomeScorers.includes(scorer)
    ).length;
    basePoints += homeCorrect * 2;
  }

  if (prediction.awayScorers && prediction.actualAwayScorers) {
    const awayCorrect = prediction.awayScorers.filter(scorer => 
      prediction.actualAwayScorers.includes(scorer)
    ).length;
    basePoints += awayCorrect * 2;
  }

  // 3. Apply Chip Effects
  let finalPoints = basePoints;
  
  if (prediction.chips && prediction.chips.length > 0) {
    // Check for multiplier chips (applied in order of priority)
    if (prediction.chips.includes("wildcard")) {
      finalPoints = basePoints * 3;
    } else if (prediction.chips.includes("doubleDown")) {
      finalPoints = basePoints * 2;
    } else if (prediction.chips.includes("scorerFocus")) {
      // Double only the goalscorer points, not the score points
      const homeCorrect = prediction.homeScorers?.filter(scorer => 
        prediction.actualHomeScorers?.includes(scorer)
      ).length || 0;
      const awayCorrect = prediction.awayScorers?.filter(scorer => 
        prediction.actualAwayScorers?.includes(scorer)
      ).length || 0;
      const scorerPoints = (homeCorrect + awayCorrect) * 2;
      const scorePoints = basePoints - scorerPoints; // Score points (exact/outcome)
      finalPoints = scorePoints + (scorerPoints * 2); // Normal score points + doubled scorer points
    }

    // Add bonus chips (these add to the total, don't multiply)
    if (prediction.chips.includes("defensePlusPlus")) {
      // +10 bonus for correct clean sheet predictions
      const homeCleanSheet = prediction.awayScore === 0 && prediction.actualAwayScore === 0;
      const awayCleanSheet = prediction.homeScore === 0 && prediction.actualHomeScore === 0;
      if (homeCleanSheet || awayCleanSheet) {
        finalPoints += 10;
      }
    }

    // Note: allInWeek is applied at gameweek level, not individual match level
  }

  return Math.max(0, finalPoints); // Ensure non-negative points
}

/**
 * Get breakdown of points calculation for display purposes
 * @param {Object} prediction - The prediction object
 * @returns {Object} - Breakdown of points by category
 */
export function getPointsBreakdown(prediction) {
  if (prediction.actualHomeScore === null || prediction.actualHomeScore === undefined ||
      prediction.actualAwayScore === null || prediction.actualAwayScore === undefined) {
    return null;
  }

  const breakdown = {};
  let basePoints = 0;

  // Score prediction
  if (prediction.homeScore === prediction.actualHomeScore && 
      prediction.awayScore === prediction.actualAwayScore) {
    breakdown.exactScore = 10;
    basePoints += 10;
  } else if (
    (prediction.homeScore > prediction.awayScore && prediction.actualHomeScore > prediction.actualAwayScore) ||
    (prediction.homeScore < prediction.awayScore && prediction.actualHomeScore < prediction.actualAwayScore) ||
    (prediction.homeScore === prediction.awayScore && prediction.actualHomeScore === prediction.actualAwayScore)
  ) {
    breakdown.correctOutcome = 5;
    basePoints += 5;
  }

  // Goalscorer points
  const homeCorrect = prediction.homeScorers?.filter(scorer => 
    prediction.actualHomeScorers?.includes(scorer)
  ).length || 0;
  const awayCorrect = prediction.awayScorers?.filter(scorer => 
    prediction.actualAwayScorers?.includes(scorer)
  ).length || 0;
  const totalScorerPoints = (homeCorrect + awayCorrect) * 2;
  
  if (totalScorerPoints > 0) {
    breakdown.goalscorers = totalScorerPoints;
    basePoints += totalScorerPoints;
  }

  // Chip effects
  if (prediction.chips && prediction.chips.length > 0) {
    prediction.chips.forEach(chip => {
      switch (chip) {
        case "wildcard":
          breakdown.wildcard = `×3 (${basePoints} × 3 = ${basePoints * 3})`;
          break;
        case "doubleDown":
          breakdown.doubleDown = `×2 (${basePoints} × 2 = ${basePoints * 2})`;
          break;
        case "scorerFocus":
          breakdown.scorerFocus = `×2 scorers (${totalScorerPoints} × 2 = ${totalScorerPoints * 2})`;
          break;
        case "defensePlusPlus":
          const homeCleanSheet = prediction.awayScore === 0 && prediction.actualAwayScore === 0;
          const awayCleanSheet = prediction.homeScore === 0 && prediction.actualHomeScore === 0;
          if (homeCleanSheet || awayCleanSheet) {
            breakdown.defensePlusPlus = 10;
          }
          break;
      }
    });
  }

  return breakdown;
}