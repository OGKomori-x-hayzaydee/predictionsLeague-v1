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