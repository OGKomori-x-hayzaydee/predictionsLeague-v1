// Import centralized team logo system
import { getTeamLogo as getTeamLogoFromCentral } from './teamLogos.js';

// Comprehensive team name mapping
export const teamNameMappings = {
  // Arsenal variations
  "Arsenal FC": "Arsenal",
  "Arsenal": "Arsenal",
  "ARSENAL": "Arsenal",
  
  // Chelsea variations
  "Chelsea FC": "Chelsea",
  "Chelsea": "Chelsea",
  "CHELSEA": "Chelsea",
  
  // Liverpool variations
  "Liverpool FC": "Liverpool",
  "Liverpool": "Liverpool",
  "LIVERPOOL": "Liverpool",
  
  // Manchester City variations
  "Manchester City FC": "Man City",
  "Manchester City": "Man City", 
  "Man. City": "Man City",
  "MANCITY": "Man City",
  
  // Manchester United variations
  "Manchester United FC": "Man United",
  "Manchester United": "Man United",
  "Man. United": "Man United", 
  "MANUTD": "Man United",
  
  // Spurs variations
  "Tottenham Hotspur FC": "Spurs",
  "Tottenham Hotspur": "Spurs",
  "Tottenham": "Spurs",
  "SPURS": "Spurs",
};

/**
 * Normalizes team names to a consistent format
 * @param {string} teamName - The team name from any source
 * @returns {string} Normalized team name
 */
export const normalizeTeamName = (teamName) => {
  // Check if we have a direct mapping first
  if (teamNameMappings[teamName]) {
    return teamNameMappings[teamName];
  }
  
  // If no direct mapping and name ends with 'FC', try without the FC
  if (teamName && teamName.endsWith(' FC')) {
    const withoutFC = teamName.replace(' FC', '');
    if (teamNameMappings[withoutFC]) {
      return teamNameMappings[withoutFC];
    }
    return withoutFC;
  }
  
  return teamName;
};

/**
 * Returns the appropriate logo for a given team
 * @param {string} teamName - The team name
 * @returns {string} URL to the team logo
 */
export const getTeamLogo = (teamName) => {
  // Use the centralized team logo system
  return getTeamLogoFromCentral(teamName);
};

/**
 * Map team display names to backend format
 * @param {string} teamName - The display team name
 * @returns {string} Backend formatted team name
 */
export const mapTeamToBackendFormat = (teamName) => {
  const teamMapping = {
    "Arsenal": "ARSENAL",
    "Chelsea": "CHELSEA", 
    "Liverpool": "LIVERPOOL",
    "Manchester City": "MANCITY",
    "Manchester United": "MANUTD",
    "Tottenham Hotspur": "SPURS",
    // Add any other teams as needed
  };
  
  return teamMapping[teamName] || teamName.toUpperCase();
};

/**
 * Check if a date's fixture group has any unpredicted fixtures
 * @param {Array} fixtures - Array of fixture objects
 * @returns {boolean} True if any fixtures are unpredicted
 */
export const hasUnpredictedFixture = (fixtures) => {
  return fixtures.some((fixture) => !fixture.predicted);
};