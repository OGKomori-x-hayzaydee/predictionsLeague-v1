import React, { useState } from "react";
import { 
  filterFixturesByQuery, 
  getUniqueTeams, 
  groupFixturesByTeam 
} from "../../utils/fixtureUtils";
import TeamPanel from "./TeamPanel";
import EmptyFixtureState from "./EmptyFixtureState";

function FixturesByTeam({ fixtures, onFixtureSelect, searchQuery = "" }) {
  const [expandedTeam, setExpandedTeam] = useState(null);
  
  // Filter fixtures based on search query - using common utility function
  const filteredFixtures = filterFixturesByQuery(fixtures, searchQuery);
  
  // Get all unique teams - using utility function
  const allTeams = getUniqueTeams(filteredFixtures);
  
  // Group fixtures by team - using utility function
  const fixturesByTeam = groupFixturesByTeam(filteredFixtures, allTeams);
  
  // Toggle team expansion
  const toggleTeam = (team) => {
    setExpandedTeam(expandedTeam === team ? null : team);
  };

  // Check if we have any teams to display
  const hasTeams = allTeams.length > 0;

  return (
    <div className="space-y-3">
      {hasTeams ? (
        allTeams.map(team => (
          <TeamPanel 
            key={team}
            team={team}
            fixtures={fixturesByTeam[team]}
            isExpanded={expandedTeam === team}
            onToggle={toggleTeam}
            onFixtureSelect={onFixtureSelect}
          />
        ))
      ) : (
        <EmptyFixtureState searchQuery={searchQuery} />
      )}
    </div>
  );
}

export default FixturesByTeam;