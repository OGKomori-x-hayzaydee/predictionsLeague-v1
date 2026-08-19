/**
 * Utility functions for calculating prediction points
 * 
 * Mirrors backend PredictionService.getPredictionScore() exactly.
 */

/**
 * Count correct scorers using multiset intersection (matches backend logic).
 * Each predicted scorer is consumed once against the actual pool.
 */
function countCorrectScorers(predHome = [], predAway = [], actualHome = [], actualAway = []) {
  const allPredicted = [...predHome, ...predAway];
  const allActual = [...actualHome, ...actualAway];

  // Build a frequency map of actual scorers
  const actualMap = {};
  allActual.forEach(s => { actualMap[s] = (actualMap[s] || 0) + 1; });

  let count = 0;
  allPredicted.forEach(scorer => {
    if (actualMap[scorer] && actualMap[scorer] > 0) {
      count++;
      actualMap[scorer]--;
    }
  });
  return count;
}

/**
 * Check if predicted scorers match actual scorers exactly (order-independent multiset equality).
 */
function scorersMatchExactly(predHome = [], predAway = [], actualHome = [], actualAway = []) {
  if (predHome.length !== actualHome.length || predAway.length !== actualAway.length) return false;

  const toFreqMap = (arr) => {
    const m = {};
    arr.forEach(s => { m[s] = (m[s] || 0) + 1; });
    return m;
  };
  const mapsEqual = (a, b) => {
    const keysA = Object.keys(a);
    if (keysA.length !== Object.keys(b).length) return false;
    return keysA.every(k => a[k] === b[k]);
  };

  return mapsEqual(toFreqMap(predHome), toFreqMap(actualHome)) &&
         mapsEqual(toFreqMap(predAway), toFreqMap(actualAway));
}

/**
 * Count clean sheets correctly predicted.
 * "Home clean sheet" = predicted away scored 0 AND actual away scored 0.
 * "Away clean sheet" = predicted home scored 0 AND actual home scored 0.
 */
function countCleanSheets(predHome, actualHome, predAway, actualAway) {
  let cs = 0;
  if (predHome === 0 && actualHome === 0) cs++;
  if (predAway === 0 && actualAway === 0) cs++;
  return cs;
}

/**
 * Calculate points for a prediction based on actual results.
 * Mirrors backend PredictionService.getPredictionScore() exactly.
 * @param {Object} prediction - The prediction object
 * @returns {number|null} - Total points earned, or null if pending
 */
export function calculatePoints(prediction) {
  if (prediction.actualHomeScore === null || prediction.actualHomeScore === undefined ||
      prediction.actualAwayScore === null || prediction.actualAwayScore === undefined) {
    return null;
  }

  const predHome = prediction.homeScore;
  const predAway = prediction.awayScore;
  const actualHome = prediction.actualHomeScore;
  const actualAway = prediction.actualAwayScore;
  const predHomeScorers = prediction.homeScorers || [];
  const predAwayScorers = prediction.awayScorers || [];
  const actualHomeScorers = prediction.actualHomeScorers || [];
  const actualAwayScorers = prediction.actualAwayScorers || [];
  const chips = prediction.chips || [];

  let points = 0;

  // --- Base score points ---
  const correctScoreline = (actualHome === predHome) && (actualAway === predAway);
  const correctDraw = (actualHome === actualAway) && (predHome === predAway);
  const correctWinner = Math.sign(actualHome - actualAway) === Math.sign(predHome - predAway);

  if (correctScoreline && scorersMatchExactly(predHomeScorers, predAwayScorers, actualHomeScorers, actualAwayScorers)) {
    points = 15; // Perfect prediction
  } else if (correctScoreline) {
    points = 10;
  } else if (correctDraw) {
    points = 7;
  } else if (correctWinner) {
    points = 5;
  }

  // --- Goalscorer points ---
  const correctScorers = countCorrectScorers(predHomeScorers, predAwayScorers, actualHomeScorers, actualAwayScorers);
  if (chips.includes("scorerFocus")) {
    points += 4 * correctScorers; // Scorer Focus: +4 per correct scorer
  } else {
    points += 2 * correctScorers; // Normal: +2 per correct scorer
  }

  // --- Goal difference penalty ---
  const goalDifference = Math.abs((actualHome + actualAway) - (predHome + predAway));
  if (goalDifference > 2) {
    points -= (goalDifference - 2);
  }

  // --- Multiplier chips (sequential, all stack) ---
  if (chips.includes("wildcard")) {
    points *= 3;
  }
  if (chips.includes("doubleDown")) {
    points *= 2;
  }
  if (chips.includes("allInWeek")) {
    points *= 2;
  }

  // --- Defense++ (flat bonus, applied after multipliers) ---
  if (chips.includes("defensePlusPlus")) {
    points += 5 * countCleanSheets(predHome, actualHome, predAway, actualAway);
  }

  return points;
}

/**
 * Get breakdown of points calculation for display purposes.
 * Mirrors backend logic for accurate step-by-step display.
 * @param {Object} prediction - The prediction object
 * @returns {Object|null} - Breakdown of points by category
 */
export function getPointsBreakdown(prediction) {
  if (prediction.actualHomeScore === null || prediction.actualHomeScore === undefined ||
      prediction.actualAwayScore === null || prediction.actualAwayScore === undefined) {
    return null;
  }

  const predHome = prediction.homeScore;
  const predAway = prediction.awayScore;
  const actualHome = prediction.actualHomeScore;
  const actualAway = prediction.actualAwayScore;
  const predHomeScorers = prediction.homeScorers || [];
  const predAwayScorers = prediction.awayScorers || [];
  const actualHomeScorers = prediction.actualHomeScorers || [];
  const actualAwayScorers = prediction.actualAwayScorers || [];
  const chips = prediction.chips || [];

  const breakdown = {};
  let runningPoints = 0;

  // --- Base score ---
  const correctScoreline = (actualHome === predHome) && (actualAway === predAway);
  const correctDraw = (actualHome === actualAway) && (predHome === predAway);
  const correctWinner = Math.sign(actualHome - actualAway) === Math.sign(predHome - predAway);

  if (correctScoreline && scorersMatchExactly(predHomeScorers, predAwayScorers, actualHomeScorers, actualAwayScorers)) {
    breakdown.perfectPrediction = 15;
    runningPoints = 15;
  } else if (correctScoreline) {
    breakdown.exactScore = 10;
    runningPoints = 10;
  } else if (correctDraw) {
    breakdown.correctDraw = 7;
    runningPoints = 7;
  } else if (correctWinner) {
    breakdown.correctOutcome = 5;
    runningPoints = 5;
  }

  // --- Goalscorer points ---
  const correctScorers = countCorrectScorers(predHomeScorers, predAwayScorers, actualHomeScorers, actualAwayScorers);
  if (correctScorers > 0) {
    const perScorer = chips.includes("scorerFocus") ? 4 : 2;
    const scorerPoints = perScorer * correctScorers;
    breakdown.goalscorers = scorerPoints;
    if (chips.includes("scorerFocus")) {
      breakdown.scorerFocus = `×2 scorer pts (${correctScorers} × 4 = ${scorerPoints})`;
    }
    runningPoints += scorerPoints;
  }

  // --- Goal difference penalty ---
  const goalDifference = Math.abs((actualHome + actualAway) - (predHome + predAway));
  if (goalDifference > 2) {
    const penalty = goalDifference - 2;
    breakdown.goalDiffPenalty = -penalty;
    runningPoints -= penalty;
  }

  // --- Multiplier chips ---
  if (chips.includes("wildcard")) {
    breakdown.wildcard = `×3 (${runningPoints} × 3 = ${runningPoints * 3})`;
    runningPoints *= 3;
  }
  if (chips.includes("doubleDown")) {
    breakdown.doubleDown = `×2 (${runningPoints} × 2 = ${runningPoints * 2})`;
    runningPoints *= 2;
  }
  if (chips.includes("allInWeek")) {
    breakdown.allInWeek = `×2 (${runningPoints} × 2 = ${runningPoints * 2})`;
    runningPoints *= 2;
  }

  // --- Defense++ (after multipliers) ---
  if (chips.includes("defensePlusPlus")) {
    const cs = countCleanSheets(predHome, actualHome, predAway, actualAway);
    if (cs > 0) {
      breakdown.defensePlusPlus = 5 * cs;
    }
  }

  return breakdown;
}