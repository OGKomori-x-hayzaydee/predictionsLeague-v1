/**
 * Utilities for handling prediction chips
 */

// Chip definitions
export const predictionChips = {
  doubleDown: {
    id: "doubleDown",
    name: "Double Down",
    description: "Double all points earned from this match",
    icon: "2x",
  },
  wildcard: {
    id: "wildcard",
    name: "Wildcard",
    description: "Triple all points earned from this match",
    icon: "3x",
  },
  opportunist: {
    id: "opportunist",
    name: "Opportunist",
    description: "Change predictions up to 30 min before kickoff",
    icon: "⏱️",
  },
  scorerFocus: {
    id: "scorerFocus",
    name: "Scorer Focus",
    description: "Double all points from goalscorer predictions",
    icon: "⚽",
  },
  defensePlusPlus: {
    id: "defensePlusPlus",
    name: "Defense++",
    description:
      "Earn +10 bonus points for each match where you correctly predict a clean sheet.",
    icon: "🛡️",
  },
};

/**
 * Get chip information by ID
 * @param {string} chipId - The chip identifier
 * @returns {Object} The chip information object
 */
export const getChipInfo = (chipId) => {
  return predictionChips[chipId] || { name: chipId, description: "" };
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
    // Base points calculation
    const outcomePoints = 5;
    const exactScorePoints = 10;
    const baseGoalScorerPoints = (prediction.homeScore + prediction.awayScore) * 2;
    
    // Calculate clean sheet bonus
    const isCleanSheet = prediction.homeScore === 0 || prediction.awayScore === 0;
    const defensePlusBonus = prediction.chips.includes("defensePlusPlus") && isCleanSheet ? 10 : 0;
    
    // Calculate scorer focus bonus
    const scorerFocusBonus = prediction.chips.includes("scorerFocus") ? baseGoalScorerPoints : 0;
    
    // Calculate base points before multipliers
    const pointsBeforeMultiplier = outcomePoints + exactScorePoints + baseGoalScorerPoints + 
                                  defensePlusBonus + scorerFocusBonus;
    
    // Apply multipliers (Wild card has precedence over Double Down)
    let finalPoints = pointsBeforeMultiplier;
    if (prediction.chips.includes("wildcard")) {
      finalPoints = pointsBeforeMultiplier * 3;
    } else if (prediction.chips.includes("doubleDown")) {
      finalPoints = pointsBeforeMultiplier * 2;
    }
    
    return {
      outcomePoints,
      exactScorePoints,
      baseGoalScorerPoints,
      defensePlusBonus,
      scorerFocusBonus,
      pointsBeforeMultiplier,
      finalPoints,
      hasWildcard: prediction.chips.includes("wildcard"),
      hasDoubleDown: prediction.chips.includes("doubleDown"),
    };
  }
  
  return {
    finalPoints: prediction.points || 0
  };
};