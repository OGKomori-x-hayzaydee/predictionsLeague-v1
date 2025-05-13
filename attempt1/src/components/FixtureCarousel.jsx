import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { format, parseISO, isSameDay } from "date-fns";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  CalendarIcon,
  ClockIcon,
} from "@radix-ui/react-icons";

// Import club logos
import arsenalLogo from "../assets/clubs/arsenal.png";
import chelseaLogo from "../assets/clubs/chelsea.png";
import liverpoolLogo from "../assets/clubs/liverpool.png";
import manCityLogo from "../assets/clubs/mancity.png";
import manUtdLogo from "../assets/clubs/manutd.png";
import tottenhamLogo from "../assets/clubs/tottenham.png";

export default function FixtureCarousel({ onFixtureSelect }) {
  const carouselRef = useRef();
  const [selectedFixture, setSelectedFixture] = useState(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  // Sample fixtures data - would come from API in real app
  const fixtures = [
    {
      id: 1,
      gameweek: 36,
      homeTeam: "Arsenal",
      awayTeam: "Tottenham",
      date: "2025-05-12T15:00:00",
      venue: "Emirates Stadium",
      competition: "Premier League",
      predicted: false,
    },
    {
      id: 2,
      gameweek: 36,
      homeTeam: "Man. City",
      awayTeam: "Man. United",
      date: "2025-05-12T17:30:00",
      venue: "Etihad Stadium",
      competition: "Premier League",
      predicted: false,
    },
    {
      id: 3,
      gameweek: 36,
      homeTeam: "Chelsea",
      awayTeam: "Liverpool",
      date: "2025-05-13T20:00:00",
      venue: "Stamford Bridge",
      competition: "Premier League",
      predicted: false,
    },
    {
      id: 4,
      gameweek: 37,
      homeTeam: "Liverpool",
      awayTeam: "Chelsea",
      date: "2025-05-19T15:00:00",
      venue: "Anfield",
      competition: "Premier League",
      predicted: false,
    },
    {
      id: 5,
      gameweek: 37,
      homeTeam: "Man. United",
      awayTeam: "Tottenham",
      date: "2025-05-20T20:00:00",
      venue: "Old Trafford",
      competition: "Premier League",
      predicted: false,
    },
    {
      id: 6,
      gameweek: 38,
      homeTeam: "Arsenal",
      awayTeam: "Man. City",
      date: "2025-05-26T16:00:00",
      venue: "Emirates Stadium",
      competition: "Premier League",
      predicted: false,
    },
    {
      id: 7,
      gameweek: 38,
      homeTeam: "Tottenham",
      awayTeam: "Chelsea",
      date: "2025-05-26T16:00:00",
      venue: "Tottenham Hotspur Stadium",
      competition: "Premier League",
      predicted: false,
    },
    {
      id: 8,
      gameweek: 38,
      homeTeam: "Arsenal",
      awayTeam: "Chelsea",
      date: "2025-05-26T16:00:00",
      venue: "Emirates Stadium",
      competition: "Premier League",
      predicted: false,
    },
  ];

  // Get team logo function
  const getTeamLogo = (team) => {
    // Map team names to their logo files
    const teamLogos = {
      Arsenal: arsenalLogo,
      Chelsea: chelseaLogo,
      Liverpool: liverpoolLogo,
      "Man. City": manCityLogo,
      "Man. United": manUtdLogo,
      Tottenham: tottenhamLogo,
    };

    // Return the appropriate logo or a fallback
    return (
      teamLogos[team] ||
      `https://via.placeholder.com/40?text=${team.substring(0, 3)}`
    );
  };

  // Handle selection
  const handleFixtureClick = (fixture) => {
    setSelectedFixture(fixture);
    if (onFixtureSelect) {
      onFixtureSelect(fixture);
    }
  };

  // Group fixtures by date for the carousel
  const fixturesByDate = fixtures.reduce((groups, fixture) => {
    const date = format(parseISO(fixture.date), "yyyy-MM-dd");
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(fixture);
    return groups;
  }, {});

  // Check scroll capability
  const checkScrollability = () => {
    if (!carouselRef.current) return;

    const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
    setCanScrollLeft(scrollLeft > 0);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 5); // 5px buffer
  };

  useEffect(() => {
    // Set up resize observer to check scrollability when container size changes
    const observer = new ResizeObserver(() => {
      checkScrollability();
    });

    if (carouselRef.current) {
      observer.observe(carouselRef.current);
    }

    return () => {
      if (carouselRef.current) {
        observer.unobserve(carouselRef.current);
      }
    };
  }, []);

  // Handle scroll buttons
  const scroll = (direction) => {
    if (!carouselRef.current) return;

    const scrollAmount = 300;
    carouselRef.current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });

    // Update scroll status after animation
    setTimeout(checkScrollability, 300);
  };

  return (
    <div className="relative">
      <h3 className="text-teal-100 text-3xl font-dmSerif mb-3">
        Upcoming Fixtures
      </h3>

      <div className="relative">
        {/* Left scroll button */}
        {canScrollLeft && (
          <button
            onClick={() => scroll("left")}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-primary-600/80 hover:bg-primary-700 text-white rounded-full p-1 shadow-md"
            aria-label="Scroll left"
          >
            <ChevronLeftIcon className="w-5 h-5" />
          </button>
        )}

        {/* Carousel */}
        <div
          className="overflow-x-auto hide-scrollbar pb-2 font-outfit"
          ref={carouselRef}
          onScroll={checkScrollability}
        >
          <div className="flex space-x-4 p-0.5">
            {Object.entries(fixturesByDate).map(([date, dayFixtures]) => (
              <div key={date} className="flex">
                <div className="bg-primary-600/40 backdrop-blur-md rounded-lg border border-primary-400/20 p-3 w-[400px]">
                  <div className="flex items-center justify-between mb-2">
                    <div className="bg-teal-700/20 text-teal-300 text-xs rounded-full px-2 py-0.5 flex items-center">
                      <CalendarIcon className="mr-1 w-3 h-3" />
                      {format(parseISO(date), "EEE, MMM d")}
                    </div>
                    <div className="text-white/50 text-xs">
                      GW {dayFixtures[0].gameweek}
                    </div>
                  </div>

                  <div className="space-y-3">
                    {dayFixtures.map((fixture) => (
                      <motion.div
                        key={fixture.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleFixtureClick(fixture)}
                        className={`bg-primary-700/40 rounded-md p-3 cursor-pointer transition-colors ${
                          selectedFixture && selectedFixture.id === fixture.id
                            ? "ring-1 ring-teal-400 bg-primary-600/50"
                            : "hover:bg-primary-600/30"
                        }`}
                      >
                        <div className="flex justify-between items-center text-xs text-white/60 mb-2">
                          <span>{fixture.competition}</span>
                          <span className="flex items-center">
                            <ClockIcon className="mr-1 w-3 h-3" />
                            {format(parseISO(fixture.date), "h:mm a")}
                          </span>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <img
                              src={getTeamLogo(fixture.homeTeam)}
                              alt={fixture.homeTeam}
                              className="w-8 h-8 object-contain"
                            />
                            <span className="text-white ml-2 font-outfit text-sm">
                              {fixture.homeTeam}
                            </span>
                          </div>
                          <span className="text-xs text-white/70 mx-2">vs</span>
                          <div className="flex items-center justify-end">
                            <span className="text-white mr-2 font-outfit text-sm text-right">
                              {fixture.awayTeam}
                            </span>
                            <img
                              src={getTeamLogo(fixture.awayTeam)}
                              alt={fixture.awayTeam}
                              className="w-8 h-8 object-contain"
                            />
                          </div>
                        </div>

                        <div className="mt-2 text-center">
                          <div
                            className={`text-xs py-1 px-2 rounded ${
                              fixture.predicted
                                ? "bg-indigo-900/30 text-indigo-300"
                                : "bg-teal-900/30 text-teal-300"
                            }`}
                          >
                            {fixture.predicted
                              ? "Prediction Made"
                              : "Prediction Required"}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right scroll button */}
        {canScrollRight && (
          <button
            onClick={() => scroll("right")}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-primary-600/80 hover:bg-primary-700 text-white rounded-full p-1 shadow-md"
            aria-label="Scroll right"
          >
            <ChevronRightIcon className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );
}
