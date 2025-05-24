import { useState, useRef } from "react";
import DateGroup from "./DateGroup";
import CarouselNavButton from "../ui/CarouselNavButton";
import useCarouselScroll from "../../hooks/useCarouselScroll";
import { groupFixturesByDate } from "../../utils/fixtureUtils";

// Import from centralized data file
import { fixtures as sampleFixtures, teamLogos } from "../../data/sampleData";

export default function FixtureCarousel({ onFixtureSelect, activeGameweekChips = [] }) {
  const carouselRef = useRef();
  const [selectedFixture, setSelectedFixture] = useState(null);
  
  // Use custom hook for carousel scroll logic
  const { canScrollLeft, canScrollRight, scroll, checkScrollability } = useCarouselScroll(carouselRef);

  // Use data from centralized data file
  const fixtures = sampleFixtures;

  // Handle selection
  const handleFixtureClick = (fixture) => {
    setSelectedFixture(fixture);
    if (onFixtureSelect) {
      onFixtureSelect(fixture);
    }
  };

  // Group fixtures by date for the carousel
  const fixturesByDate = groupFixturesByDate(fixtures);

  return (
    <div className="relative backdrop-blur-md to-primary-700/40 rounded-lg">
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
    </div>
  );
}
