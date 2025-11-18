/**
 * Utility functions for calculating next match information
 */

/**
 * Find the next upcoming match from fixtures data
 * @param {Array} fixtures - Array of fixture objects
 * @returns {Object|null} Next match object or null if no upcoming matches
 */
export const getNextMatch = (fixtures) => {
  if (!fixtures || !Array.isArray(fixtures)) {
    return null;
  }

  const now = new Date();
  
  // Filter for future matches and sort by date
  const upcomingMatches = fixtures
    .filter(fixture => {
      const matchDate = new Date(fixture.date);
      const isUpcoming = fixture.status === 'SCHEDULED' || fixture.status === 'TIMED';
      const isFuture = matchDate > now;
      
      return isFuture && isUpcoming;
    })
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  if (upcomingMatches.length === 0) {
    return null;
  }

  const nextMatch = upcomingMatches[0];
  
  return {
    nextMatchTime: nextMatch.date,
    homeTeam: nextMatch.homeTeam,
    awayTeam: nextMatch.awayTeam,
    matchId: nextMatch.id,
    venue: nextMatch.venue,
    gameweek: nextMatch.gameweek
  };
};

/**
 * Calculate time until next match
 * @param {string} nextMatchTime - ISO timestamp of next match
 * @returns {Object} Time breakdown object
 */
export const calculateTimeUntilMatch = (nextMatchTime) => {
  if (!nextMatchTime) {
    return { timeDisplay: "No matches", isLive: false };
  }

  const nextMatch = new Date(nextMatchTime);
  const now = new Date();
  const timeUntilMatch = nextMatch - now;

  if (timeUntilMatch <= 0) {
    return { timeDisplay: "Live now", isLive: true };
  }

  const days = Math.floor(timeUntilMatch / (1000 * 60 * 60 * 24));
  const hours = Math.floor((timeUntilMatch % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((timeUntilMatch % (1000 * 60 * 60)) / (1000 * 60));

  let timeDisplay;
  
  if (days > 0) {
    timeDisplay = `${days}d ${hours}h`;
  } else if (hours > 0) {
    timeDisplay = `${hours}h ${minutes}m`;
  } else {
    timeDisplay = `${minutes}m`;
  }

  return {
    timeDisplay,
    isLive: false,
    days,
    hours,
    minutes,
    totalMinutes: Math.floor(timeUntilMatch / (1000 * 60))
  };
};

/**
 * Get next match with time calculation
 * @param {Array} fixtures - Array of fixture objects
 * @returns {Object|null} Complete next match info with time display
 */
export const getNextMatchWithTime = (fixtures) => {
  const nextMatch = getNextMatch(fixtures);
  
  if (!nextMatch) {
    return null;
  }

  const timeInfo = calculateTimeUntilMatch(nextMatch.nextMatchTime);
  
  return {
    ...nextMatch,
    ...timeInfo
  };
};