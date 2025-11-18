import { format, parseISO } from "date-fns";

/**
 * Groups fixtures by date
 * @param {Array} fixtures - Array of fixture objects with date property
 * @returns {Object} - Object with dates as keys and arrays of fixtures as values
 */
export function groupFixturesByDate(fixtures) {
  return fixtures.reduce((groups, fixture) => {
    const dateStr = format(parseISO(fixture.date), "yyyy-MM-dd");
    if (!groups[dateStr]) {
      groups[dateStr] = [];
    }
    groups[dateStr].push(fixture);
    return groups;
  }, {});
}

/**
 * Filters fixtures based on search query
 * @param {Array} fixtures - Array of fixture objects
 * @param {String} searchQuery - Search query to filter by
 * @returns {Array} - Filtered fixtures
 */
export function filterFixturesByQuery(fixtures, searchQuery = "") {
  if (!searchQuery) return fixtures;
  
  const query = searchQuery.toLowerCase();
  return fixtures.filter(fixture => 
    fixture.homeTeam.toLowerCase().includes(query) ||
    fixture.awayTeam.toLowerCase().includes(query) ||
    fixture.venue?.toLowerCase().includes(query) ||
    fixture.competition?.toLowerCase().includes(query)
  );
}

/**
 * Get all unique teams from fixtures
 * @param {Array} fixtures - Array of fixture objects
 * @returns {Array} - Sorted array of unique team names
 */
export function getUniqueTeams(fixtures) {
  return [...new Set([
    ...fixtures.map(f => f.homeTeam),
    ...fixtures.map(f => f.awayTeam)
  ])].sort();
}

/**
 * Group fixtures by team
 * @param {Array} fixtures - Array of fixture objects
 * @param {Array} teams - Array of team names to group by
 * @returns {Object} - Object with team names as keys and arrays of fixtures as values
 */
export function groupFixturesByTeam(fixtures, teams) {
  const fixturesByTeam = {};
  teams.forEach(team => {
    fixturesByTeam[team] = fixtures.filter(
      f => f.homeTeam === team || f.awayTeam === team
    );
  });
  return fixturesByTeam;
}

/**
 * Calculate prediction statistics for a team's fixtures
 * @param {Array} teamFixtures - Array of fixture objects for a specific team
 * @returns {Object} - Object with prediction statistics
 */
export function getPredictionStats(teamFixtures) {
  const predicted = teamFixtures.filter(f => f.predicted).length;
  const total = teamFixtures.length;
  return { 
    predicted, 
    total, 
    percentage: total > 0 ? Math.round((predicted / total) * 100) : 0 
  };
}

/**
 * Check if fixture collection has any unpredicted fixtures
 * @param {Array} fixtures - Array of fixture objects
 * @returns {Boolean} - True if at least one fixture is unpredicted
 */
export function hasUnpredictedFixture(fixtures) {
  return fixtures.some(fixture => !fixture.predicted);
}

// ============================================================================
// NEW UTILITIES FOR LIVE SCORES & PLAYER DATA (Added 2025-10-16)
// ============================================================================

/**
 * Match status constants
 */
export const MATCH_STATUS = {
  SCHEDULED: 'SCHEDULED',
  TIMED: 'TIMED',
  LIVE: 'LIVE',
  IN_PLAY: 'IN_PLAY',
  PAUSED: 'PAUSED',
  FINISHED: 'FINISHED',
  POSTPONED: 'POSTPONED',
  CANCELLED: 'CANCELLED',
  SUSPENDED: 'SUSPENDED',
  AWARDED: 'AWARDED'
};

/**
 * Player position constants
 */
export const PLAYER_POSITIONS = {
  FORWARD: 'FORWARD',
  MIDFIELDER: 'MIDFIELDER',
  DEFENDER: 'DEFENDER',
  GOALKEEPER: 'GOALKEEPER'
};

/**
 * Check if match is currently live
 */
export function isLiveMatch(status) {
  return [
    MATCH_STATUS.LIVE,
    MATCH_STATUS.IN_PLAY,
    MATCH_STATUS.PAUSED
  ].includes(status);
}

/**
 * Check if match is scheduled (not started)
 */
export function isScheduledMatch(status) {
  return [
    MATCH_STATUS.SCHEDULED,
    MATCH_STATUS.TIMED
  ].includes(status);
}

/**
 * Check if match is finished
 */
export function isFinishedMatch(status) {
  return status === MATCH_STATUS.FINISHED;
}

/**
 * Check if user can make a prediction for this fixture
 */
export function canMakePrediction(fixture) {
  if (!isScheduledMatch(fixture.status)) return false;
  
  const matchDate = new Date(fixture.date);
  const now = new Date();
  
  return matchDate > now;
}

/**
 * Get players by position from squad
 */
export function getPlayersByPosition(players, position) {
  if (!players || !Array.isArray(players)) return [];
  return players.filter(player => player && player.position === position);
}

/**
 * Get squad organized by position
 */
export function getSquadByPosition(players) {
  if (!players || !Array.isArray(players)) {
    return {
      forwards: [],
      midfielders: [],
      defenders: [],
      goalkeepers: []
    };
  }

  return {
    forwards: getPlayersByPosition(players, PLAYER_POSITIONS.FORWARD),
    midfielders: getPlayersByPosition(players, PLAYER_POSITIONS.MIDFIELDER),
    defenders: getPlayersByPosition(players, PLAYER_POSITIONS.DEFENDER),
    goalkeepers: getPlayersByPosition(players, PLAYER_POSITIONS.GOALKEEPER)
  };
}

/**
 * Find a player in squad by name (supports partial matching)
 */
export function findPlayerByName(players, playerName) {
  if (!players || !Array.isArray(players) || !playerName) return null;
  
  const searchName = playerName.toLowerCase().trim();
  
  return players.find(player => {
    const fullName = player.name.toLowerCase();
    const lastName = fullName.split(' ').pop();
    
    return fullName.includes(searchName) || lastName === searchName;
  });
}

/**
 * Check if player is in squad
 */
export function isPlayerInSquad(players, playerName) {
  return findPlayerByName(players, playerName) !== null;
}

/**
 * Get squad statistics (counts by position)
 */
export function getSquadStats(players) {
  if (!players || !Array.isArray(players)) {
    return {
      total: 0,
      forwards: 0,
      midfielders: 0,
      defenders: 0,
      goalkeepers: 0
    };
  }

  const stats = {
    total: players.length,
    forwards: 0,
    midfielders: 0,
    defenders: 0,
    goalkeepers: 0
  };

  players.forEach(player => {
    switch (player.position) {
      case PLAYER_POSITIONS.FORWARD:
        stats.forwards++;
        break;
      case PLAYER_POSITIONS.MIDFIELDER:
        stats.midfielders++;
        break;
      case PLAYER_POSITIONS.DEFENDER:
        stats.defenders++;
        break;
      case PLAYER_POSITIONS.GOALKEEPER:
        stats.goalkeepers++;
        break;
    }
  });

  return stats;
}

/**
 * Check if fixture has scores
 */
export function hasScore(fixture) {
  return fixture.homeScore !== null && fixture.awayScore !== null;
}

/**
 * Get formatted score display
 */
export function getScoreDisplay(fixture) {
  if (!hasScore(fixture)) return '- : -';
  return `${fixture.homeScore} : ${fixture.awayScore}`;
}

/**
 * Get winning team
 */
export function getWinningTeam(fixture) {
  if (!hasScore(fixture)) return null;
  
  if (fixture.homeScore > fixture.awayScore) return 'home';
  if (fixture.awayScore > fixture.homeScore) return 'away';
  return 'draw';
}

/**
 * Format match minute for display
 */
export function formatMatchMinute(minute) {
  if (!minute) return '';
  
  if (typeof minute === 'string' && minute.includes('+')) {
    return minute;
  }
  
  return `${minute}'`;
}

/**
 * Group fixtures by status (scheduled, live, finished)
 */
export function groupFixturesByStatus(fixtures) {
  if (!fixtures || !Array.isArray(fixtures)) {
    return {
      scheduled: [],
      live: [],
      finished: []
    };
  }

  return fixtures.reduce((groups, fixture) => {
    if (isLiveMatch(fixture.status)) {
      groups.live.push(fixture);
    } else if (isFinishedMatch(fixture.status)) {
      groups.finished.push(fixture);
    } else {
      groups.scheduled.push(fixture);
    }
    return groups;
  }, {
    scheduled: [],
    live: [],
    finished: []
  });
}