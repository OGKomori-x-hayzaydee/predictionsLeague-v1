import arsenalLogo from "../assets/clubs/arsenal.png";
import chelseaLogo from "../assets/clubs/chelsea.png";
import liverpoolLogo from "../assets/clubs/liverpool.png";
import manCityLogo from "../assets/clubs/mancity.png";
import manUtdLogo from "../assets/clubs/manutd.png";
import tottenhamLogo from "../assets/clubs/spurs.png";

// Map team names to their logo files
export const teamLogos = {
  // Arsenal variations
  "Arsenal": arsenalLogo,
  "Arsenal FC": arsenalLogo,
  
  // Chelsea variations
  "Chelsea": chelseaLogo,
  "Chelsea FC": chelseaLogo,
  
  // Liverpool variations
  "Liverpool": liverpoolLogo,
  "Liverpool FC": liverpoolLogo,
  
  // Manchester City variations
  "Man. City": manCityLogo,
  "Manchester City": manCityLogo,
  "Manchester City FC": manCityLogo,
  
  // Manchester United variations
  "Man. United": manUtdLogo,
  "Manchester United": manUtdLogo,
  "Manchester United FC": manUtdLogo,
  
  // Spurs variations
  "Spurs": tottenhamLogo,
  "Tottenham Hotspur": tottenhamLogo,
  "Tottenham Hotspur FC": tottenhamLogo,
};

// Comprehensive team name mapping
export const teamNameMappings = {
  // Arsenal variations
  "Arsenal FC": "Arsenal",
  "Arsenal": "Arsenal",
  
  // Chelsea variations
  "Chelsea FC": "Chelsea",
  "Chelsea": "Chelsea",
  
  // Liverpool variations
  "Liverpool FC": "Liverpool",
  "Liverpool": "Liverpool",
  
  // Manchester City variations
  "Manchester City FC": "Man. City",
  "Manchester City": "Man. City",
  "Man. City": "Man. City",
  
  // Manchester United variations
  "Manchester United FC": "Man. United",
  "Manchester United": "Man. United",
  "Man. United": "Man. United",
  
  // spurs variations
  "Tottenham Hotspur FC": "Spurs",
  "Tottenham Hotspur": "Spurs",
  "Tottenham": "Spurs",
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
  // Try with the original name first
  if (teamLogos[teamName]) {
    return teamLogos[teamName];
  }
  
  // Try with normalized name
  const normalizedName = normalizeTeamName(teamName);
  if (teamLogos[normalizedName]) {
    return teamLogos[normalizedName];
  }
  
  // Return placeholder as fallback
  return `https://via.placeholder.com/40?text=${teamName.substring(0, 3)}`;
};

/**
 * Check if a date's fixture group has any unpredicted fixtures
 * @param {Array} fixtures - Array of fixture objects
 * @returns {boolean} True if any fixtures are unpredicted
 */
export const hasUnpredictedFixture = (fixtures) => {
  return fixtures.some((fixture) => !fixture.predicted);
};