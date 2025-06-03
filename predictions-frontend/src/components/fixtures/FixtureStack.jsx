import React, { useState, useEffect, useRef, useContext } from "react";
import { format, parseISO } from "date-fns";
import { ClockIcon, CalendarIcon } from "@radix-ui/react-icons";
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";
// Import Swiper styles
import "swiper/css";
import "swiper/css/effect-cards";
// Import required modules
import { EffectCards } from "swiper/modules";

import EmptyFixtureState from "./EmptyFixtureState";
import FixtureCard from "./FixtureCard";
import { ThemeContext } from "../../context/ThemeContext";

export default function FixtureStack({
  fixtures,
  onFixtureSelect,
  searchQuery = "",
  onClearSearch,
}) {
  const [selectedFixture, setSelectedFixture] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [lastUpdateSource, setLastUpdateSource] = useState("init");
  const swiperRef = useRef(null);
  const [swiperInitialized, setSwiperInitialized] = useState(false);
  const [visibleSlideIndex, setVisibleSlideIndex] = useState(0);

  // Get theme context
  const { theme } = useContext(ThemeContext);
  // Memo-ize expensive operations
  const filteredFixtures = React.useMemo(() => {
    return fixtures.filter((fixture) => {
      if (!searchQuery) return true;

      const query = searchQuery.toLowerCase();
      return (
        fixture.homeTeam.toLowerCase().includes(query) ||
        fixture.awayTeam.toLowerCase().includes(query) ||
        fixture.venue?.toLowerCase().includes(query) ||
        fixture.competition?.toLowerCase().includes(query)
      );
    });
  }, [fixtures, searchQuery]);

  // Memo-ize grouped fixtures
  const fixturesByDate = React.useMemo(() => {
    return filteredFixtures.reduce((groups, fixture) => {
      const date = format(parseISO(fixture.date), "yyyy-MM-dd");
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(fixture);
      return groups;
    }, {});
  }, [filteredFixtures]);

  // Compute dates rather than storing in state
  const dates = React.useMemo(
    () => Object.keys(fixturesByDate).sort(),
    [fixturesByDate]
  );

  // This effect is still needed for initialization and can't be replaced
  const initializationDone = useRef(false);

  useEffect(() => {
    // Skip if already initialized or no dates
    if (initializationDone.current || dates.length === 0) return;

    // Find today's date or closest upcoming date
    const today = format(new Date(), "yyyy-MM-dd");
    const todayIndex = dates.indexOf(today);

    let targetIndex = 0;
    if (todayIndex !== -1) {
      targetIndex = todayIndex;
    } else {
      const nextDateIndex = dates.findIndex((date) => date > today);
      if (nextDateIndex !== -1) {
        targetIndex = nextDateIndex;
      }
    }

    // Only update if we're not already at the target
    if (targetIndex !== 0) {
      console.log(`Setting initial active index to ${targetIndex}`);
      setActiveIndex(targetIndex);
    }

    // Mark initialization as complete
    initializationDone.current = true;
  }, [dates]); // Remove activeIndex from dependencies

  // Add this near the top of your component
  const isInitializing = useRef(false);

  // Improved Swiper initialization handler
  const handleSwiperInit = (swiper) => {
    if (!swiper) return;

    // Prevent duplicate initialization
    if (isInitializing.current) return;
    isInitializing.current = true;

    // Store the swiper instance
    swiperRef.current = swiper;
    setSwiperInitialized(true);
    console.log("Swiper initialized");

    // Set the visible slide index to match the actual slide
    setVisibleSlideIndex(swiper.activeIndex);

    // Reset after a small delay
    setTimeout(() => {
      isInitializing.current = false;
    }, 500);
  };

  // More reliable slide change handler with debouncing
  const slideChangeTimeoutRef = useRef(null);

  const handleSlideChange = (swiper) => {
    if (!swiper || typeof swiper.activeIndex !== "number") return;

    // Clear any pending timeout
    if (slideChangeTimeoutRef.current) {
      clearTimeout(slideChangeTimeoutRef.current);
    }

    // Debounce changes to avoid rapid updates
    slideChangeTimeoutRef.current = setTimeout(() => {
      if (
        swiper.activeIndex !== activeIndex &&
        swiper.activeIndex < dates.length
      ) {
        console.log(
          `Slide change: setting activeIndex to ${swiper.activeIndex}`
        );
        setActiveIndex(swiper.activeIndex);
        setVisibleSlideIndex(swiper.activeIndex); // Update visible index too
      }
    }, 50);
  };

  // Add cleanup for the timeout
  useEffect(() => {
    return () => {
      if (slideChangeTimeoutRef.current) {
        clearTimeout(slideChangeTimeoutRef.current);
      }
    };
  }, []);

  // Handle fixture selection
  const handleFixtureClick = (fixture) => {
    setSelectedFixture(fixture);
    if (onFixtureSelect) {
      onFixtureSelect(fixture);
    }
  };

  // Check if a date's fixture group has any unpredicted fixtures
  const hasUnpredictedFixture = (fixtures) => {
    return fixtures.some((fixture) => !fixture.predicted);
  };

  // Add keyboard navigation for accessibility
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!swiperRef.current?.swiper) return;

      let newIndex = activeIndex;

      if (e.key === "ArrowLeft" && activeIndex > 0) {
        newIndex = activeIndex - 1;
      } else if (e.key === "ArrowRight" && activeIndex < dates.length - 1) {
        newIndex = activeIndex + 1;
      } else {
        return; // No change needed
      }

      // Only update if the index will change
      if (newIndex !== activeIndex) {
        swiperRef.current.swiper.slideTo(newIndex);
        // Don't call setActiveIndex here - let the slide change event handle it
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [activeIndex, dates.length]);

  // Add a useEffect to reset state when fixtures/dates change drastically
  useEffect(() => {
    // If dates disappear or change dramatically, reset activeIndex
    if (dates.length === 0) {
      setActiveIndex(0);
    } else if (activeIndex >= dates.length) {
      setActiveIndex(0);
    }
  }, [dates.length, activeIndex]);

  // Log component state updates
  useEffect(() => {
    console.log(
      `Component state update - activeIndex: ${activeIndex}, dates: ${dates.length}, source: ${lastUpdateSource}`
    );
  }, [activeIndex, dates.length, lastUpdateSource]);

  // Add a new state to track if a card has more fixtures than visible
  const [cardsWithOverflow, setCardsWithOverflow] = useState({});

  // Add this near your other state variables:
  const overflowCheckedRef = useRef({});

  // Replace the checkOverflow function with this version:
  const checkOverflow = (dateKey, containerRef) => {
    if (containerRef && !overflowCheckedRef.current[dateKey]) {
      // Only check overflow if we haven't already for this date
      const hasOverflow = containerRef.scrollHeight > containerRef.clientHeight;
      overflowCheckedRef.current[dateKey] = true;

      // Use a setTimeout to avoid the infinite update
      setTimeout(() => {
        setCardsWithOverflow((prev) => ({
          ...prev,
          [dateKey]: hasOverflow,
        }));
      }, 0);
    }
  };

  // Add this effect to reset overflow checks when dates change
  useEffect(() => {
    overflowCheckedRef.current = {};
  }, [dates]);
  return (
    <div
      className={`relative backdrop-blur-md rounded-lg p-4 ${
        theme === "dark"
          ? "bg-slate-900/60 border border-slate-700/50"
          : "bg-white/80 border border-slate-200 shadow-sm"
      }`}
    >
      <div className="mb-6">
        {dates.length === 0 ? (
          <EmptyFixtureState searchQuery={searchQuery} />
        ) : (
          <div className="relative">
            {/* Date navigation pills
            <div className="flex justify-center mb-4 space-x-1 overflow-x-auto hide-scrollbar py-2">
              {dates.map((date, index) => (
                <button
                  key={date}
                  aria-label={`View fixtures for ${format(
                    parseISO(date),
                    "MMMM d, yyyy"
                  )}`}
                  aria-current={index === visibleSlideIndex ? "true" : "false"}
                  className={`px-2 py-1 text-xs rounded-full transition-all ${
                    index === visibleSlideIndex
                      ? "bg-teal-700 text-white"
                      : "bg-primary-700/40 text-white/60 hover:bg-primary-600/40 hover:text-white/80"
                  }`}
                  onClick={() => {
                    if (swiperRef.current?.swiper) {
                      swiperRef.current.swiper.slideTo(index);
                      // Update both state values immediately
                      setActiveIndex(index);
                      setVisibleSlideIndex(index);
                    }
                  }}
                >
                  {format(parseISO(date), "MMM d")}
                  {hasUnpredictedFixture(fixturesByDate[date]) && (
                    <span
                      className="ml-1 inline-block w-1.5 h-1.5 bg-indigo-400 rounded-full"
                      aria-label="Contains unpredicted fixtures"
                    ></span>
                  )}
                </button>
              ))}
            </div> */}

            {/* Stack of date cards using Swiper */}
            <div className="fixture-swiper-container">
              <Swiper
                effect={"cards"}
                grabCursor={true}
                modules={[EffectCards]}
                className="fixture-stack-swiper"
                onSlideChange={handleSlideChange}
                onSwiper={handleSwiperInit}
                cardsEffect={{
                  slideShadows: true,
                  perSlideRotate: 5,
                  perSlideOffset: 12,
                  rotate: true,
                }}
                speed={600}
                initialSlide={activeIndex}
                preventInteractionOnTransition={true} // Prevent interaction during transitions
                allowTouchMove={true}
                watchSlidesProgress={true}
                observer={true}
                observeParents={true}
                // Add these to reduce weird behavior
                resistanceRatio={0.85}
                watchOverflow={true}
                touchStartPreventDefault={false}
              >
                {" "}
                {dates.map((date) => (
                  <SwiperSlide key={date} className="fixture-stack-slide">
                    <div
                      className={`backdrop-blur-md rounded-xl border p-4 h-full flex flex-col ${
                        theme === "dark"
                          ? "bg-slate-900 border-slate-600/50"
                          : "bg-white border-slate-300 shadow-sm"
                      }`}
                    >
                      {" "}
                      {/* Date header - now fixed position within the card */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center">
                          <div
                            className={`text-sm px-3 py-1 rounded-md flex items-center ${
                              theme === "dark"
                                ? "bg-teal-900/40 text-teal-300"
                                : "bg-teal-100 text-teal-700 border border-teal-200"
                            }`}
                          >
                            <CalendarIcon className="mr-1.5 w-4 h-4" />
                            {format(parseISO(date), "EEEE, d")}
                          </div>
                        </div>
                        <div className="flex items-center space-x-1">
                          {fixturesByDate[date]?.length > 0 && (
                            <div
                              className={`text-xs px-2 py-0.5 rounded-full ${
                                theme === "dark"
                                  ? "text-white/50 bg-primary-700/40"
                                  : "text-slate-600 bg-slate-100"
                              }`}
                            >
                              GW {fixturesByDate[date][0].gameweek}
                            </div>
                          )}
                          {fixturesByDate[date]?.length > 2 && (
                            <div
                              className={`text-xs px-2 py-0.5 rounded-full ${
                                theme === "dark"
                                  ? "text-white/70 bg-indigo-700/40"
                                  : "text-indigo-700 bg-indigo-100"
                              }`}
                            >
                              {fixturesByDate[date].length} fixtures
                            </div>
                          )}
                        </div>
                      </div>
                      {/* Fixtures container - now scrollable */}
                      <div
                        className="space-y-3 mt-2 overflow-y-auto flex-grow pr-1 fixtures-container"
                        style={{ maxHeight: "300px" }} // Fixed height for scrolling
                        ref={(ref) => ref && checkOverflow(date, ref)}
                      >
                        {" "}                        {fixturesByDate[date].map((fixture) => (
                          <FixtureCard
                            key={fixture.id}
                            fixture={fixture}
                            selected={selectedFixture && selectedFixture.id === fixture.id}
                            onClick={handleFixtureClick}
                          />
                        ))}
                      </div>
                      {/* Scroll indicator - shows only when content overflows
                      {cardsWithOverflow[date] && (
                        <div className="text-center mt-3 mb-1 flex items-center justify-center">
                          <div className="bg-white/10 h-8 w-8 rounded-full flex items-center justify-center">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4 text-white/70 animate-bounce"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 14l-7 7m0 0l-7-7m7 7V3"
                              />
                            </svg>
                          </div>
                        </div>
                      )} */}{" "}
                      <div
                        className={`text-center mt-2 text-xs ${
                          theme === "dark" ? "text-white/50" : "text-slate-400"
                        }`}
                      >
                        Swipe for more dates
                      </div>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </div>
        )}
      </div>

      {/* Navigation hint and indicators */}
      {dates.length > 0 && (
        <div className="flex flex-col items-center mt-4">
          {/* <div className="flex justify-center items-center text-white/50 text-xs mb-3">
            <span className="ml-1">Swipe to navigate</span>
          </div> */}{" "}
          {/* Page indicators */}
          <div className="flex space-x-1">
            {dates.map((_, index) => (
              <div
                key={index}
                className={`w-1.5 h-1.5 rounded-full transition-all ${
                  index === visibleSlideIndex
                    ? theme === "dark"
                      ? "bg-teal-400 scale-125"
                      : "bg-teal-500 scale-125"
                    : theme === "dark"
                    ? "bg-white/30"
                    : "bg-slate-300"
                }`}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
