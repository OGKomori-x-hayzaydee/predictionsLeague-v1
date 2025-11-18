/**
 * Performance Insights Generator
 * Analyzes user prediction patterns and generates actionable insights
 */

/**
 * Generate performance insights based on prediction history
 * @param {Array} predictions - User's prediction history
 * @param {Object} stats - User's overall stats (accuracy, etc.)
 * @returns {Array} Array of insight objects
 */
export const generatePerformanceInsights = (predictions = [], stats = {}) => {
  if (!predictions || predictions.length < 15) {
    return [];
  }

  const insights = [];
  
  // Analyze home/away patterns
  const homeAwayInsight = analyzeHomeAwayPattern(predictions);
  if (homeAwayInsight) insights.push(homeAwayInsight);
  
  // Analyze team preferences
  const teamInsight = analyzeTeamPerformance(predictions);
  if (teamInsight) insights.push(teamInsight);
  
  // Analyze timing patterns
  const timingInsight = analyzeTimingPatterns(predictions);
  if (timingInsight) insights.push(timingInsight);
  
  // Analyze match importance patterns
  const importanceInsight = analyzeMatchImportance(predictions);
  if (importanceInsight) insights.push(importanceInsight);
  
  // Analyze prediction confidence
  const confidenceInsight = analyzeConfidencePatterns(predictions);
  if (confidenceInsight) insights.push(confidenceInsight);

  // Return top 3 most relevant insights
  return insights
    .sort((a, b) => b.relevanceScore - a.relevanceScore)
    .slice(0, 3);
};

/**
 * Analyze home vs away prediction accuracy
 */
const analyzeHomeAwayPattern = (predictions) => {
  const homeCorrect = predictions.filter(p => p.predicted_home_goals > p.predicted_away_goals && p.actual_home_goals > p.actual_away_goals).length;
  const homePredictions = predictions.filter(p => p.predicted_home_goals > p.predicted_away_goals).length;
  
  const awayCorrect = predictions.filter(p => p.predicted_away_goals > p.predicted_home_goals && p.actual_away_goals > p.actual_home_goals).length;
  const awayPredictions = predictions.filter(p => p.predicted_away_goals > p.predicted_home_goals).length;
  
  const homeAccuracy = homePredictions > 0 ? (homeCorrect / homePredictions) * 100 : 0;
  const awayAccuracy = awayPredictions > 0 ? (awayCorrect / awayPredictions) * 100 : 0;
  
  const difference = Math.abs(homeAccuracy - awayAccuracy);
  
  if (difference > 15) {
    const isHomeStrong = homeAccuracy > awayAccuracy;
    return {
      id: 'home_away_pattern',
      type: 'strength',
      title: isHomeStrong ? 'Strong home predictions' : 'Away game specialist',
      value: `+${difference.toFixed(0)}%`,
      color: isHomeStrong ? 'green' : 'blue',
      description: isHomeStrong ? 
        'You consistently predict home victories more accurately' :
        'You have a keen eye for away team upsets',
      relevanceScore: Math.min(difference / 5, 10)
    };
  }
  return null;
};

/**
 * Analyze performance against specific teams
 */
const analyzeTeamPerformance = (predictions) => {
  const teamStats = {};
  
  predictions.forEach(pred => {
    // Track predictions for home team
    if (!teamStats[pred.home_team]) {
      teamStats[pred.home_team] = { correct: 0, total: 0 };
    }
    teamStats[pred.home_team].total++;
    
    // Track predictions for away team  
    if (!teamStats[pred.away_team]) {
      teamStats[pred.away_team] = { correct: 0, total: 0 };
    }
    teamStats[pred.away_team].total++;
    
    // Check if prediction was correct (simplified - exact score or correct winner)
    const predictedWinner = pred.predicted_home_goals > pred.predicted_away_goals ? 'home' :
                           pred.predicted_away_goals > pred.predicted_home_goals ? 'away' : 'draw';
    const actualWinner = pred.actual_home_goals > pred.actual_away_goals ? 'home' :
                        pred.actual_away_goals > pred.actual_home_goals ? 'away' : 'draw';
    
    if (predictedWinner === actualWinner) {
      teamStats[pred.home_team].correct++;
      teamStats[pred.away_team].correct++;
    }
  });
  
  // Find team with highest accuracy (min 3 predictions)
  let bestTeam = null;
  let bestAccuracy = 0;
  
  Object.entries(teamStats).forEach(([team, stats]) => {
    if (stats.total >= 3) {
      const accuracy = (stats.correct / stats.total) * 100;
      if (accuracy > bestAccuracy && accuracy > 70) {
        bestAccuracy = accuracy;
        bestTeam = team;
      }
    }
  });
  
  if (bestTeam) {
    // Check if it's a "Big 6" team
    const big6Teams = ['Arsenal', 'Chelsea', 'Liverpool', 'Manchester City', 'Manchester United', 'Tottenham'];
    const isBig6 = big6Teams.some(team => bestTeam.toLowerCase().includes(team.toLowerCase()));
    
    return {
      id: 'team_specialist',
      type: 'expertise',
      title: isBig6 ? 'Big 6 match expert' : `${bestTeam} specialist`,
      value: `${bestAccuracy.toFixed(0)}%`,
      color: 'blue',
      description: `You have exceptional accuracy predicting ${bestTeam} matches`,
      relevanceScore: Math.min(bestAccuracy / 10, 9)
    };
  }
  
  return null;
};

/**
 * Analyze timing patterns (weekend vs weekday performance)
 */
const analyzeTimingPatterns = (predictions) => {
  const weekendPredictions = predictions.filter(p => {
    const date = new Date(p.match_date || p.date);
    const day = date.getDay();
    return day === 0 || day === 6; // Sunday or Saturday
  });
  
  const weekdayPredictions = predictions.filter(p => {
    const date = new Date(p.match_date || p.date);
    const day = date.getDay();
    return day >= 1 && day <= 5; // Monday to Friday
  });
  
  if (weekendPredictions.length < 5 || weekdayPredictions.length < 5) {
    return null;
  }
  
  const weekendAccuracy = calculateAccuracy(weekendPredictions);
  const weekdayAccuracy = calculateAccuracy(weekdayPredictions);
  
  const difference = weekendAccuracy - weekdayAccuracy;
  
  if (Math.abs(difference) > 12) {
    const isWeekendBetter = difference > 0;
    return {
      id: 'timing_pattern',
      type: 'timing',
      title: isWeekendBetter ? 'Weekend warrior' : 'Weekday focus',
      value: `+${Math.abs(difference).toFixed(0)}%`,
      color: 'amber',
      description: isWeekendBetter ? 
        'Your weekend predictions are significantly more accurate' :
        'You perform better on weekday matches',
      relevanceScore: Math.min(Math.abs(difference) / 3, 8)
    };
  }
  
  return null;
};

/**
 * Analyze performance in high-stakes matches
 */
const analyzeMatchImportance = (predictions) => {
  // Define important match patterns
  const importantMatches = predictions.filter(p => {
    const homeTeam = p.home_team?.toLowerCase() || '';
    const awayTeam = p.away_team?.toLowerCase() || '';
    const big6Teams = ['arsenal', 'chelsea', 'liverpool', 'manchester city', 'manchester united', 'tottenham'];
    
    // Big 6 vs Big 6 matches
    const isHomeBig6 = big6Teams.some(team => homeTeam.includes(team));
    const isAwayBig6 = big6Teams.some(team => awayTeam.includes(team));
    
    return isHomeBig6 && isAwayBig6;
  });
  
  const regularMatches = predictions.filter(p => {
    const homeTeam = p.home_team?.toLowerCase() || '';
    const awayTeam = p.away_team?.toLowerCase() || '';
    const big6Teams = ['arsenal', 'chelsea', 'liverpool', 'manchester city', 'manchester united', 'tottenham'];
    
    const isHomeBig6 = big6Teams.some(team => homeTeam.includes(team));
    const isAwayBig6 = big6Teams.some(team => awayTeam.includes(team));
    
    return !(isHomeBig6 && isAwayBig6);
  });
  
  if (importantMatches.length < 3) return null;
  
  const importantAccuracy = calculateAccuracy(importantMatches);
  const regularAccuracy = calculateAccuracy(regularMatches);
  
  const difference = importantAccuracy - regularAccuracy;
  
  if (difference > 10) {
    return {
      id: 'clutch_performer',
      type: 'clutch',
      title: 'Big match specialist',
      value: `+${difference.toFixed(0)}%`,
      color: 'purple',
      description: 'You excel at predicting high-stakes Big 6 clashes',
      relevanceScore: Math.min(difference / 2, 9)
    };
  } else if (difference < -10) {
    return {
      id: 'underdog_expert',
      type: 'specialist',
      title: 'Underdog expert',
      value: `${Math.abs(difference).toFixed(0)}% better`,
      color: 'green',
      description: 'You have better accuracy with smaller team matches',
      relevanceScore: Math.min(Math.abs(difference) / 2, 8)
    };
  }
  
  return null;
};

/**
 * Analyze prediction confidence patterns
 */
const analyzeConfidencePatterns = (predictions) => {
  // Analyze goal difference predictions as confidence indicator
  const boldPredictions = predictions.filter(p => {
    const goalDiff = Math.abs((p.predicted_home_goals || 0) - (p.predicted_away_goals || 0));
    return goalDiff >= 2; // 2+ goal difference = bold prediction
  });
  
  const safePredictions = predictions.filter(p => {
    const goalDiff = Math.abs((p.predicted_home_goals || 0) - (p.predicted_away_goals || 0));
    return goalDiff <= 1; // 0-1 goal difference = safe prediction
  });
  
  if (boldPredictions.length < 5 || safePredictions.length < 5) return null;
  
  const boldAccuracy = calculateAccuracy(boldPredictions);
  const safeAccuracy = calculateAccuracy(safePredictions);
  
  const difference = boldAccuracy - safeAccuracy;
  
  if (difference > 15) {
    return {
      id: 'bold_predictor',
      type: 'style',
      title: 'Bold prediction master',
      value: `+${difference.toFixed(0)}%`,
      color: 'red',
      description: 'Your confident, high-margin predictions pay off',
      relevanceScore: Math.min(difference / 3, 8)
    };
  } else if (difference < -10) {
    return {
      id: 'safe_predictor',
      type: 'style',
      title: 'Steady & reliable',
      value: `${Math.abs(difference).toFixed(0)}% safer`,
      color: 'blue',
      description: 'You excel with conservative, close-margin predictions',
      relevanceScore: Math.min(Math.abs(difference) / 3, 7)
    };
  }
  
  return null;
};

/**
 * Calculate accuracy percentage for a set of predictions
 */
const calculateAccuracy = (predictions) => {
  if (!predictions || predictions.length === 0) return 0;
  
  const correct = predictions.filter(pred => {
    const predictedWinner = pred.predicted_home_goals > pred.predicted_away_goals ? 'home' :
                           pred.predicted_away_goals > pred.predicted_home_goals ? 'away' : 'draw';
    const actualWinner = pred.actual_home_goals > pred.actual_away_goals ? 'home' :
                        pred.actual_away_goals > pred.actual_home_goals ? 'away' : 'draw';
    
    return predictedWinner === actualWinner;
  }).length;
  
  return (correct / predictions.length) * 100;
};

/**
 * Get color class for insight type
 */
export const getInsightColorClass = (color, theme = 'light') => {
  const colors = {
    green: {
      dot: 'bg-green-400',
      text: theme === 'dark' ? 'text-green-400' : 'text-green-600'
    },
    blue: {
      dot: 'bg-blue-400', 
      text: theme === 'dark' ? 'text-blue-400' : 'text-blue-600'
    },
    amber: {
      dot: 'bg-amber-400',
      text: theme === 'dark' ? 'text-amber-400' : 'text-amber-600'
    },
    purple: {
      dot: 'bg-purple-400',
      text: theme === 'dark' ? 'text-purple-400' : 'text-purple-600'
    },
    red: {
      dot: 'bg-red-400',
      text: theme === 'dark' ? 'text-red-400' : 'text-red-600'
    }
  };
  
  return colors[color] || colors.blue;
};