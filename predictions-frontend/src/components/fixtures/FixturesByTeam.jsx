import React, { useState, useContext } from "react";
import {
  filterFixturesByQuery,
  groupFixturesByTeam,
} from "../../utils/fixtureUtils";
import TeamPanel from "./TeamPanel";
import EmptyFixtureState from "./EmptyFixtureState";
import { normalizeTeamName } from "../../utils/teamUtils";
import { ThemeContext } from "../../context/ThemeContext";
import { getThemeStyles, text } from "../../utils/themeUtils";

function FixturesByTeam({ fixtures = [], onFixtureSelect, searchQuery = "" }) {
  const { theme } = useContext(ThemeContext);
  const [expandedTeam, setExpandedTeam] = useState(null);

  // Use provided fixtures
  const fixturesToUse = fixtures;

  // Define the Big Six teams with their standardized names
  const bigSixTeams = [
    "Arsenal",
    "Chelsea",
    "Liverpool",
    "Man. City",
    "Man. United",
    "Spurs",
  ];

  // Log original fixtures for debugging
  console.log("Original fixtures:", fixturesToUse);
  console.log(
    "Teams in original fixtures:",
    [...new Set([...fixturesToUse.map((f) => f.homeTeam), ...fixturesToUse.map((f) => f.awayTeam)])]
  );

  // Filter fixtures based on search query - using common utility function
  const filteredFixtures = filterFixturesByQuery(fixturesToUse, searchQuery);

  // Normalize the team names in fixtures using our centralized utility function
  const normalizedFixtures = filteredFixtures.map((fixture) => ({
    ...fixture,
    homeTeam: normalizeTeamName(fixture.homeTeam),
    awayTeam: normalizeTeamName(fixture.awayTeam),
  }));

  // Log normalized team names for debugging
  console.log(
    "Normalized teams in fixtures:",
    [...new Set([...normalizedFixtures.map((f) => f.homeTeam), ...normalizedFixtures.map((f) => f.awayTeam)])]
  );

  // Group fixtures by team - but only for Big Six teams
  const fixturesByTeam = groupFixturesByTeam(normalizedFixtures, bigSixTeams);

  // Log the grouped fixtures to see what we're working with
  console.log("Fixtures by team (after grouping):", fixturesByTeam);

  // Toggle team expansion
  const toggleTeam = (team) => {
    setExpandedTeam(expandedTeam === team ? null : team);
  };

  // Check if we have any fixtures for Big Six teams with a more robust check
  const hasFixtures =
    filteredFixtures &&
    filteredFixtures.length > 0 &&
    bigSixTeams.some(
      (team) =>
        fixturesByTeam[team] &&
        Array.isArray(fixturesByTeam[team]) &&
        fixturesByTeam[team].length > 0
    );

  return (
    <div className="space-y-3">
      {hasFixtures ? (
        // Filter out null values after mapping
        bigSixTeams
          .map((team) => {
            // Only create panels for teams that have fixtures
            if (fixturesByTeam[team] && fixturesByTeam[team].length > 0) {
              return (
                <TeamPanel
                  key={team}
                  team={team}
                  fixtures={fixturesByTeam[team]}
                  isExpanded={expandedTeam === team}
                  onToggle={toggleTeam}
                  onFixtureSelect={onFixtureSelect}
                />
              );
            }
            return null;
          })
          .filter((panel) => panel !== null) // Filter out null values
      ) : (
        <EmptyFixtureState searchQuery={searchQuery} />
      )}
    </div>
  );
}

export default FixturesByTeam;