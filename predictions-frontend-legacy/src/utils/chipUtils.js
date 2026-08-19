/**
 * Utilities for handling prediction chips
 */

import { CHIP_CONFIG } from './chipManager';

// Re-export CHIP_CONFIG as predictionChips for backward compatibility
export const predictionChips = CHIP_CONFIG;

/**
 * Get chip information by ID
 * @param {string} chipId - The chip identifier
 * @returns {Object} The chip information object
 */
export const getChipInfo = (chipId) => {
  return CHIP_CONFIG[chipId] || { name: chipId, description: "" };
};

/**
 * Get chips by type
 * @param {string} type - The chip type ("match" or "gameweek")
 * @returns {Array} Array of chips of the specified type
 */
export const getChipsByType = (type) => {
  return Object.values(CHIP_CONFIG).filter(chip => chip.type === type);
};

/**
 * Check if a chip is a gameweek-level multiplier
 * @param {string} chipId - The chip identifier
 * @returns {boolean} Whether the chip is a gameweek multiplier
 */
export const isGameweekMultiplier = (chipId) => {
  return chipId === "allInWeek";
};

/**
 * Check if a chip is a gameweek-level bonus chip
 * @param {string} chipId - The chip identifier
 * @returns {boolean} Whether the chip is a gameweek bonus chip
 */
export const isGameweekBonus = (chipId) => {
  return chipId === "defensePlusPlus";
};

/**
 * Check if a prediction correctly predicted a clean sheet
 * @param {Object} prediction - The prediction object
 * @returns {boolean} Whether a clean sheet was correctly predicted
 */
export const isCorrectCleanSheet = (prediction) => {
  const predictedCleanSheet = prediction.homeScore === 0 || prediction.awayScore === 0;
  const actualCleanSheet = prediction.actualHomeScore === 0 || prediction.actualAwayScore === 0;
  return predictedCleanSheet && actualCleanSheet && (prediction.status === "completed");
};

/**
 * Check if a scorer was correctly predicted
 * @param {string} scorer - The predicted scorer
 * @param {Array} actualScorers - Array of actual scorers
 * @returns {boolean} Whether the scorer was correctly predicted
 */
export const isCorrectScorer = (scorer, actualScorers) => {
  return actualScorers && actualScorers.includes(scorer);
};

/**
 * Calculate points from a prediction
 * @param {Object} prediction - The prediction object
 * @returns {Object} Breakdown of points and total
 */
export const calculatePredictionPoints = (prediction) => {
  if (prediction.status === "pending") {
    // For pending predictions, calculate potential maximum points
    
    // STEP 1: Base Points (only ONE of these applies)
    // We assume the best case: exact scoreline + all scorers correct
    let basePoints = 15; // Exact scoreline + all scorers = 15 points
    
    // STEP 2: Additional Points
    // Count predicted goalscorers (home + away)
    const homeScorers = prediction.homeScorers || [];
    const awayScorers = prediction.awayScorers || [];
    const totalPredictedScorers = homeScorers.length + awayScorers.length;
    
    // Calculate goalscorer points (2 points each)
    let goalscorerPoints = totalPredictedScorers * 2;
    
    // Apply Scorer Focus chip (doubles goalscorer points)
    if (prediction.chips?.includes("scorerFocus")) {
      goalscorerPoints *= 2;
    }
    
    // Own goal points (assume none for pending - can't predict max without knowing if predicted)
    const ownGoalPoints = 0;
    
    // No deductions for pending (we're calculating max potential)
    const deductionPoints = 0;
    
    // STEP 3: Subtotal before derby multiplier
    let subtotal = basePoints + goalscorerPoints + ownGoalPoints - deductionPoints;
    
    // STEP 4: Derby Match Multiplier (1.5x)
    // Check if this is a derby match (assume not for now - would need fixture data)
    const isDerby = prediction.isDerby || false;
    if (isDerby) {
      subtotal *= 1.5;
    }
    
    // STEP 5: Apply Match-Level Chip Multipliers
    let finalPoints = subtotal;
    if (prediction.chips?.includes("wildcard")) {
      finalPoints *= 3; // Wildcard: 3x
    } else if (prediction.chips?.includes("doubleDown")) {
      finalPoints *= 2; // Double Down: 2x
    }
    
    // Note: All-In Week is applied at gameweek level, not here
    
    return {
      basePoints,
      goalscorerPoints,
      ownGoalPoints,
      deductionPoints,
      subtotal,
      isDerby,
      derbyMultiplier: isDerby ? 1.5 : 1,
      pointsBeforeChipMultiplier: subtotal,
      finalPoints: Math.round(finalPoints), // Round to handle derby decimals
      hasWildcard: prediction.chips?.includes("wildcard") || false,
      hasDoubleDown: prediction.chips?.includes("doubleDown") || false,
      hasScorerFocus: prediction.chips?.includes("scorerFocus") || false,
      breakdown: {
        base: basePoints,
        scorers: goalscorerPoints,
        ownGoals: ownGoalPoints,
        deductions: deductionPoints,
        afterDerby: subtotal,
        chipMultiplier: prediction.chips?.includes("wildcard") ? 3 : 
                       prediction.chips?.includes("doubleDown") ? 2 : 1,
      }
    };
  }
  
  // For completed predictions, return actual points
  return {
    finalPoints: prediction.points || 0,
    completed: true
  };
};

/**
 * Calculate total gameweek points for a user, applying gameweek-level chips
 * @param {Array} predictions - Array of predictions for the gameweek
 * @param {Array} gameweekChips - Array of gameweek-level chips used
 * @returns {Object} Breakdown of gameweek points
 */
export const calculateGameweekPoints = (predictions, gameweekChips = []) => {
  let totalPoints = 0;
  let matchPoints = [];
  let defensePlusBonusPoints = 0;
  
  // Calculate points for each match
  predictions.forEach(prediction => {
    const matchResult = calculatePredictionPoints(prediction);
    matchPoints.push({
      matchId: prediction.matchId,
      points: matchResult.finalPoints,
      breakdown: matchResult
    });
    totalPoints += matchResult.finalPoints;
    
    // Calculate Defense++ bonus if chip is active
    // +10 for each correctly predicted clean sheet
    if (gameweekChips.includes("defensePlusPlus") && isCorrectCleanSheet(prediction)) {
      defensePlusBonusPoints += 10;
    }
  });
  
  // Add Defense++ bonus to total (before All-In Week multiplier)
  totalPoints += defensePlusBonusPoints;
  
  // Apply All-In Week multiplier if present (doubles everything including Defense++ bonus)
  const hasAllInWeek = gameweekChips.includes("allInWeek");
  if (hasAllInWeek) {
    totalPoints *= 2;
    defensePlusBonusPoints *= 2;
    matchPoints = matchPoints.map(match => ({
      ...match,
      points: match.points * 2
    }));
  }
  
  return {
    totalPoints,
    matchPoints,
    defensePlusBonusPoints,
    correctCleanSheets: predictions.filter(p => 
      gameweekChips.includes("defensePlusPlus") && isCorrectCleanSheet(p)
    ).length,
    hasAllInWeek,
    hasDefensePlusPlus: gameweekChips.includes("defensePlusPlus"),
    gameweekChips
  };
};