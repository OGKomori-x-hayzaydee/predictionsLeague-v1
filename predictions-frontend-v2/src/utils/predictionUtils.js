import { format, parseISO } from "date-fns";

/**
 * Groups predictions by fixture date
 * @param {Array} predictions - Array of prediction objects with date property
 * @returns {Object} - Object with dates as keys and arrays of predictions as values
 */
export function groupPredictionsByDate(predictions) {
  return predictions.reduce((groups, prediction) => {
    const dateStr = format(parseISO(prediction.date), "yyyy-MM-dd");
    if (!groups[dateStr]) {
      groups[dateStr] = [];
    }
    groups[dateStr].push(prediction);
    return groups;
  }, {});
}

/**
 * Groups predictions by when they were created (predictedAt)
 * @param {Array} predictions - Array of prediction objects with predictedAt property
 * @returns {Object} - Object with dates as keys and arrays of predictions as values
 */
export function groupPredictionsByPredictedDate(predictions) {
  return predictions.reduce((groups, prediction) => {
    // Use predictedAt if available, otherwise fall back to date
    const dateStr = format(parseISO(prediction.predictedAt || prediction.date), "yyyy-MM-dd");
    if (!groups[dateStr]) {
      groups[dateStr] = [];
    }
    groups[dateStr].push(prediction);
    return groups;
  }, {});
}

/**
 * Filters predictions based on search query
 * @param {Array} predictions - Array of prediction objects
 * @param {String} searchQuery - Search query to filter by
 * @returns {Array} - Filtered predictions
 */
export function filterPredictionsByQuery(predictions, searchQuery = "") {
  if (!searchQuery) return predictions;
  
  const query = searchQuery.toLowerCase();
  return predictions.filter(prediction => 
    prediction.homeTeam.toLowerCase().includes(query) ||
    prediction.awayTeam.toLowerCase().includes(query) ||
    prediction.venue?.toLowerCase().includes(query) ||
    prediction.competition?.toLowerCase().includes(query) ||
    prediction.predictedResult?.toLowerCase().includes(query)
  );
}

/**
 * Get all unique teams from predictions
 * @param {Array} predictions - Array of prediction objects
 * @returns {Array} - Sorted array of unique team names
 */
export function getUniqueTeams(predictions) {
  return [...new Set([
    ...predictions.map(p => p.homeTeam),
    ...predictions.map(p => p.awayTeam)
  ])].sort();
}

/**
 * Group predictions by team
 * @param {Array} predictions - Array of prediction objects
 * @param {Array} teams - Array of team names to group by
 * @returns {Object} - Object with team names as keys and arrays of predictions as values
 */
export function groupPredictionsByTeam(predictions, teams) {
  const predictionsByTeam = {};
  teams.forEach(team => {
    predictionsByTeam[team] = predictions.filter(
      p => p.homeTeam === team || p.awayTeam === team
    );
  });
  return predictionsByTeam;
}

/**
 * Calculate prediction statistics for a team's predictions
 * @param {Array} teamPredictions - Array of prediction objects for a specific team
 * @returns {Object} - Object with prediction statistics
 */
export function getTeamPredictionStats(teamPredictions) {
  const total = teamPredictions.length;
  const correct = teamPredictions.filter(p => p.status === 'correct').length;
  const incorrect = teamPredictions.filter(p => p.status === 'incorrect').length;
  const pending = teamPredictions.filter(p => p.status === 'pending').length;
  const completed = teamPredictions.filter(p => p.status !== 'pending').length;
  const totalPoints = teamPredictions
    .filter(p => p.points !== null && p.points !== undefined)
    .reduce((sum, p) => sum + p.points, 0);
  
  return { 
    total,
    correct, 
    incorrect,
    pending,
    completed,
    totalPoints,
    accuracy: total > 0 ? Math.round((correct / (correct + incorrect)) * 100) : 0,
    completionRate: total > 0 ? Math.round(((correct + incorrect) / total) * 100) : 0
  };
}

/**
 * Check if prediction collection has any pending predictions
 * @param {Array} predictions - Array of prediction objects
 * @returns {Boolean} - True if at least one prediction is pending
 */
export function hasPendingPrediction(predictions) {
  return predictions.some(prediction => prediction.status === 'pending');
}

/**
 * Get predictions by result type
 * @param {Array} predictions - Array of prediction objects
 * @param {String} resultType - 'correct', 'incorrect', or 'pending'
 * @returns {Array} - Filtered predictions by result type
 */
export function getPredictionsByResult(predictions, resultType) {
  return predictions.filter(prediction => prediction.status === resultType);
}

/**
 * Calculate overall prediction accuracy
 * @param {Array} predictions - Array of prediction objects
 * @returns {Number} - Accuracy percentage
 */
export function calculateAccuracy(predictions) {
  const completed = predictions.filter(p => p.status === 'correct' || p.status === 'incorrect');
  const correct = predictions.filter(p => p.status === 'correct');
  
  return completed.length > 0 ? Math.round((correct.length / completed.length) * 100) : 0;
}

/**
 * Get prediction confidence distribution
 * @param {Array} predictions - Array of prediction objects
 * @returns {Object} - Object with confidence level counts
 */
export function getConfidenceDistribution(predictions) {
  const distribution = {
    high: 0,
    medium: 0,
    low: 0
  };
  
  predictions.forEach(prediction => {
    const confidence = prediction.confidence?.toLowerCase();
    if (confidence && distribution.hasOwnProperty(confidence)) {
      distribution[confidence]++;
    }
  });
  
  return distribution;
}
