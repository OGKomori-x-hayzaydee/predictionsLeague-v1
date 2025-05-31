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

import SimplePredictionCard from "./SimplePredictionCard";
import EmptyState from "../common/EmptyState";
import { ThemeContext } from "../../context/ThemeContext";

const PredictionStack = ({
  predictions,
  onPredictionSelect,
  onEditClick,
  teamLogos,
  searchQuery,
}) => {
  const [selectedPrediction, setSelectedPrediction] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const swiperRef = useRef(null);
  const [swiperInitialized, setSwiperInitialized] = useState(false);
  const [visibleSlideIndex, setVisibleSlideIndex] = useState(0);

  // Get theme context
  const { theme } = useContext(ThemeContext);

  // Memo-ize expensive operations
  const filteredPredictions = React.useMemo(() => {
    return predictions.filter((prediction) => {
      if (!searchQuery) return true;

      const query = searchQuery.toLowerCase();
      return (
        prediction.homeTeam.toLowerCase().includes(query) ||
        prediction.awayTeam.toLowerCase().includes(query) ||
        prediction.venue?.toLowerCase().includes(query) ||
        prediction.competition?.toLowerCase().includes(query)
      );
    });
  }, [predictions, searchQuery]);

  // Memo-ize grouped predictions by date
  const predictionsByDate = React.useMemo(() => {
    return filteredPredictions.reduce((groups, prediction) => {
      const date = format(parseISO(prediction.date), "yyyy-MM-dd");
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(prediction);
      return groups;
    }, {});
  }, [filteredPredictions]);

  // Compute dates rather than storing in state
  const dates = React.useMemo(
    () => Object.keys(predictionsByDate).sort(),
    [predictionsByDate]
  );

  // Handle swiper initialization
  const handleSwiperInit = (swiper) => {
    if (!swiper) return;
    swiperRef.current = swiper;
    setSwiperInitialized(true);
    setVisibleSlideIndex(swiper.activeIndex);
  };

  // Handle slide change
  const handleSlideChange = (swiper) => {
    if (!swiper || typeof swiper.activeIndex !== "number") return;

    if (
      swiper.activeIndex !== activeIndex &&
      swiper.activeIndex < dates.length
    ) {
      setActiveIndex(swiper.activeIndex);
      setVisibleSlideIndex(swiper.activeIndex);
    }
  };

  // Handle prediction selection
  const handlePredictionClick = (prediction) => {
    setSelectedPrediction(prediction);
    if (onPredictionSelect) {
      onPredictionSelect(prediction);
    }
  };
  // Check if a date's prediction group has any pending predictions
  const hasPendingPrediction = (predictions) => {
    return predictions.some((prediction) => prediction.status === "pending");
  };

  if (filteredPredictions.length === 0) {
    return <EmptyState />;
  }
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
          <EmptyState />
        ) : (
          <div className="relative">
            {" "}
            {/* Stack of date cards using Swiper */}
            <div className="fixture-swiper-container">
              <Swiper
                effect={"cards"}
                grabCursor={true}
                modules={[EffectCards]}
                className="prediction-stack-swiper"
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
                preventInteractionOnTransition={true}
                allowTouchMove={true}
                watchSlidesProgress={true}
                observer={true}
                observeParents={true}
                resistanceRatio={0.85}
                watchOverflow={true}
                touchStartPreventDefault={false}
              >
                {dates.map((date) => (
                  <SwiperSlide key={date} className="prediction-stack-slide">
                    <div
                      className={`backdrop-blur-md rounded-xl border p-4 h-full flex flex-col ${
                        theme === "dark"
                          ? "bg-slate-900 border-slate-600/50"
                          : "bg-white border-slate-300 shadow-sm"
                      }`}
                    >
                      {/* Date header */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center">
                          <div
                            className={`text-sm px-3 py-1 rounded-md flex items-center ${
                              theme === "dark"
                                ? "bg-indigo-900/40 text-indigo-300"
                                : "bg-indigo-100 text-indigo-700 border border-indigo-200"
                            }`}
                          >
                            <CalendarIcon className="mr-1.5 w-4 h-4" />
                            {format(parseISO(date), "EEEE, d")}
                          </div>
                        </div>
                        <div className="flex items-center space-x-1">
                          {predictionsByDate[date]?.length > 0 && (
                            <div
                              className={`text-xs px-2 py-0.5 rounded-full ${
                                theme === "dark"
                                  ? "text-white/50 bg-primary-700/40"
                                  : "text-slate-600 bg-slate-100"
                              }`}
                            >
                              GW {predictionsByDate[date][0].gameweek}
                            </div>
                          )}
                          {predictionsByDate[date]?.length > 2 && (
                            <div
                              className={`text-xs px-2 py-0.5 rounded-full ${
                                theme === "dark"
                                  ? "text-white/70 bg-purple-700/40"
                                  : "text-purple-700 bg-purple-100"
                              }`}
                            >
                              {predictionsByDate[date].length} predictions
                            </div>
                          )}
                        </div>
                      </div>{" "}
                      {/* Predictions container - scrollable */}
                      <div
                        className="space-y-3 mt-2 overflow-y-auto flex-grow pr-1 predictions-container"
                        style={{ maxHeight: "300px" }}
                      >
                        {predictionsByDate[date].map((prediction) => (
                          <SimplePredictionCard
                            key={prediction.id}
                            prediction={prediction}
                            teamLogos={teamLogos}
                            onClick={handlePredictionClick}
                            onEditClick={onEditClick}
                            selected={
                              selectedPrediction &&
                              selectedPrediction.id === prediction.id
                            }
                          />
                        ))}
                      </div>
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
          {/* Page indicators */}
          <div className="flex space-x-1">
            {dates.map((_, index) => (
              <div
                key={index}
                className={`w-1.5 h-1.5 rounded-full transition-all ${
                  index === visibleSlideIndex
                    ? theme === "dark"
                      ? "bg-indigo-400 scale-125"
                      : "bg-indigo-500 scale-125"
                    : theme === "dark"
                    ? "bg-white/30"
                    : "bg-slate-300"
                }`}
              />
            ))}
          </div>
        </div>
      )}{" "}
    </div>
  );
};

export default PredictionStack;
