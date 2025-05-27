import { useState, useRef } from "react";
import DateGroup from "./DateGroup";
import CarouselNavButton from "../ui/CarouselNavButton";
import useCarouselScroll from "../../hooks/useCarouselScroll";
import { groupFixturesByDate, filterFixturesByQuery } from "../../utils/fixtureUtils";
import { normalizeTeamName } from "../../utils/teamUtils";
import { teamLogos } from "../../data/sampleData";
import EmptyFixtureState from "./EmptyFixtureState";

export default function FixtureCarousel({
  fixtures,
  onFixtureSelect,
  activeGameweekChips = [],
  searchQuery = ""
}) {
  const carouselRef = useRef();
  const [selectedFixture, setSelectedFixture] = useState(null);

  // Use custom hook for carousel scroll logic
  const { canScrollLeft, canScrollRight, scroll, checkScrollability } =
    useCarouselScroll(carouselRef);

  // Define the Big Six teams with their standardized names
  const bigSixTeams = [
    "Arsenal",
    "Chelsea",
    "Liverpool",
    "Man. City",
    "Man. United",
    "Tottenham",
  ];

  // Filter fixtures based on search query - using common utility function
  const filteredFixtures = filterFixturesByQuery(fixtures, searchQuery);

  // Normalize the team names in fixtures using our centralized utility function
  const normalizedFixtures = filteredFixtures.map((fixture) => ({
    ...fixture,
    homeTeam: normalizeTeamName(fixture.homeTeam),
    awayTeam: normalizeTeamName(fixture.awayTeam),
  }));

  // Handle selection
  const handleFixtureClick = (fixture) => {
    setSelectedFixture(fixture);
    if (onFixtureSelect) {
      onFixtureSelect(fixture);
    }
  };

  // Group fixtures by date for the carousel - using normalized fixtures
  const fixturesByDate = groupFixturesByDate(normalizedFixtures);

  // Check if we have any fixtures to display
  const hasFixtures = Object.keys(fixturesByDate).length > 0;

  return (
    <div className="relative backdrop-blur-md to-primary-700/40 rounded-lg">
      {hasFixtures ? (
        <div className="relative">
          {/* Left scroll button */}
          <CarouselNavButton
            direction="left"
            onClick={() => scroll("left")}
            visible={canScrollLeft}
          />

          {/* carousel */}
          <div
            className="overflow-x-auto hide-scrollbar pb-2 font-outfit"
            ref={carouselRef}
            onScroll={checkScrollability}
          >
            <div className="grid grid-flow-col auto-cols-max gap-4 p-0.5">
              {Object.entries(fixturesByDate).map(([date, dayFixtures]) => (
                <DateGroup
                  key={date}
                  date={date}
                  fixtures={dayFixtures}
                  selectedFixture={selectedFixture}
                  onFixtureClick={handleFixtureClick}
                  teamLogos={teamLogos}
                />
              ))}
            </div>
          </div>

          {/* Right scroll button */}
          <CarouselNavButton
            direction="right"
            onClick={() => scroll("right")}
            visible={canScrollRight}
          />
        </div>
      ) : (
        <EmptyFixtureState searchQuery={searchQuery} />
      )}
    </div>
  );
}
