import React, { useState } from "react";
import { groupFixturesByDate, filterFixturesByQuery } from "../../utils/fixtureUtils";
import FixtureCard from "./FixtureCard";
import DateHeader from "./DateHeader";
import EmptyFixtureState from "./EmptyFixtureState";
import { teamLogos } from "../../data/sampleData";

function FixtureList({ fixtures, onFixtureSelect, searchQuery = "" }) {
  const [selectedFixture, setSelectedFixture] = useState(null);

  // Filter fixtures based on search query - using common utility function
  const filteredFixtures = filterFixturesByQuery(fixtures, searchQuery);

  // Group fixtures by date for the list view - using common utility function
  const fixturesByDate = groupFixturesByDate(filteredFixtures);

  // Handle selection
  const handleFixtureClick = (fixture) => {
    setSelectedFixture(fixture);
    if (onFixtureSelect) {
      onFixtureSelect(fixture);
    }
  };

  // Check if we have any fixtures to display
  const hasFixtures = Object.keys(fixturesByDate).length > 0;

  return (
    <div>
      {hasFixtures ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(fixturesByDate).map(([date, dayFixtures]) => (
            <React.Fragment key={date}>
              {/* Date header component */}
              <DateHeader 
                date={date} 
                fixturesCount={dayFixtures.length} 
              />
              
              {/* Fixtures for this date */}
              {dayFixtures.map(fixture => (
                <FixtureCard
                  key={fixture.id}
                  fixture={fixture}
                  selected={selectedFixture && selectedFixture.id === fixture.id}
                  onClick={handleFixtureClick}
                  teamLogos={teamLogos}
                />
              ))}
            </React.Fragment>
          ))}
        </div>
      ) : (
        <EmptyFixtureState searchQuery={searchQuery} />
      )}
    </div>
  );
}

export default FixtureList;