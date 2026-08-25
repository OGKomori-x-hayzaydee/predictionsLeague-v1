/**
 * Utility functions for calculating next match information
 */

import { fixtureDeadline, isFilingLocked } from './dateUtils';

/**
 * Find the next upcoming match from fixtures data
 * @param {Array} fixtures - Array of fixture objects
 * @returns {Object|null} Next match object or null if no upcoming matches
 */
export const getNextMatch = (fixtures) => {
  if (!fixtures || !Array.isArray(fixtures)) {
    return null;
  }

  const now = Date.now();

  const upcomingMatches = fixtures
    .filter((fixture) => {
      const isUpcoming = fixture.status === 'SCHEDULED' || fixture.status === 'TIMED';
      if (!isUpcoming || isFilingLocked(fixture.status, fixture.date)) return false;
      const deadline = fixtureDeadline(fixture.date);
      return deadline && deadline.getTime() > now;
    })
    .sort((a, b) => {
      const da = fixtureDeadline(a.date)?.getTime() ?? 0;
      const db = fixtureDeadline(b.date)?.getTime() ?? 0;
      return da - db;
    });

  if (upcomingMatches.length === 0) {
    return null;
  }

  const nextMatch = upcomingMatches[0];
  const deadline = fixtureDeadline(nextMatch.date);

  return {
    nextMatchTime: deadline ? deadline.toISOString() : nextMatch.date,
    kickoffTime: nextMatch.date,
    homeTeam: nextMatch.homeTeam,
    awayTeam: nextMatch.awayTeam,
    matchId: nextMatch.id,
    venue: nextMatch.venue,
    gameweek: nextMatch.gameweek
  };
};

/**
 * Calculate time until the next filing deadline (45 minutes before kickoff).
 * @param {string} nextMatchTime - ISO timestamp of the deadline
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
    return { timeDisplay: "Locked", isLive: false };
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