import arsenalLogo from "../assets/clubs/arsenal.png";
import chelseaLogo from "../assets/clubs/chelsea.png";
import liverpoolLogo from "../assets/clubs/liverpool.png";
import manCityLogo from "../assets/clubs/mancity.png";
import manUtdLogo from "../assets/clubs/manutd.png";
import tottenhamLogo from "../assets/clubs/tottenham.png";

// Map team names to their logo files
const teamLogos = {
  Arsenal: arsenalLogo,
  Chelsea: chelseaLogo,
  Liverpool: liverpoolLogo,
  "Man. City": manCityLogo,
  "Man. United": manUtdLogo,
  Tottenham: tottenhamLogo,
};

/**
 * Returns the appropriate logo for a given team
 * @param {string} team - The team name
 * @returns {string} URL to the team logo
 */
export const getTeamLogo = (team) => {
  return (
    teamLogos[team] ||
    `https://via.placeholder.com/40?text=${team.substring(0, 3)}`
  );
};

/**
 * Check if a date's fixture group has any unpredicted fixtures
 * @param {Array} fixtures - Array of fixture objects
 * @returns {boolean} True if any fixtures are unpredicted
 */
export const hasUnpredictedFixture = (fixtures) => {
  return fixtures.some((fixture) => !fixture.predicted);
};