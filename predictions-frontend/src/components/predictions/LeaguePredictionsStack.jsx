import React, { useContext, useState, useRef } from "react";
import { format, parseISO } from "date-fns";
import { 
  TargetIcon,
  CalendarIcon,
  ChevronLeftIcon,
  ChevronRightIcon
} from "@radix-ui/react-icons";
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";
// Import Swiper styles
import "swiper/css";
import "swiper/css/effect-cards";
// Import required modules
import { EffectCards } from "swiper/modules";

import { ThemeContext } from "../../context/ThemeContext";
import PredictionCard from "./PredictionCard";
import EmptyState from "../common/EmptyState";

const LeaguePredictionsStack = ({
  predictions,
  onPredictionSelect,
  teamLogos = {},
  searchQuery = "",
  cardStyle = "normal"
}) => {
  const { theme } = useContext(ThemeContext);
  const [activeIndex, setActiveIndex] = useState(0);
  const [swiperInitialized, setSwiperInitialized] = useState(false);
  const [visibleSlideIndex, setVisibleSlideIndex] = useState(0);
  const swiperRef = useRef(null);

  // Filter predictions based on search query
  const filteredPredictions = React.useMemo(() => {
    return predictions.filter(prediction => {
      if (!searchQuery) return true;
      
      const searchLower = searchQuery.toLowerCase();
      return (
        prediction.userDisplayName?.toLowerCase().includes(searchLower) ||
        prediction.homeTeam.toLowerCase().includes(searchLower) ||
        prediction.awayTeam.toLowerCase().includes(searchLower) ||
        `${prediction.homeTeam} vs ${prediction.awayTeam}`.toLowerCase().includes(searchLower)
      );
    });
  }, [predictions, searchQuery]);

  // Group predictions by date
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

  // Get sorted dates
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
    if (onPredictionSelect && typeof onPredictionSelect === 'function') {
      onPredictionSelect(prediction);
    }
  };

  const handleCardClick = (prediction) => {
    onPredictionSelect?.(prediction);
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
                                ? "bg-teal-900/40 text-teal-300"
                                : "bg-teal-100 text-teal-700 border border-teal-200"
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
                          {predictionsByDate[date]?.length > 1 && (
                            <div
                              className={`text-xs px-2 py-0.5 rounded-full ${
                                theme === "dark"
                                  ? "text-white/70 bg-teal-700/40"
                                  : "text-teal-700 bg-teal-100"
                              }`}
                            >
                              {predictionsByDate[date].length} predictions
                            </div>
                          )}
                        </div>
                      </div>
                      {/* Predictions container - scrollable */}
                      <div
                        className="space-y-3 mt-2 overflow-y-auto flex-grow pr-1 predictions-container"
                        style={{ maxHeight: "300px" }}
                      >
                        {predictionsByDate[date].map((prediction) => (
                          <PredictionCard
                            key={`${prediction.userId}-${prediction.fixtureId}`}
                            prediction={prediction}
                            mode="league"
                            showMemberInfo={true}
                            onSelect={handlePredictionClick}
                            isReadonly={true}
                            size={cardStyle}
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
      {/* Navigation controls and indicators */}
      {dates.length > 0 && (
        <div className="flex flex-col items-center mt-4 space-y-3">
          {/* Arrow navigation buttons */}
          <div className="flex justify-center items-center gap-4">
            <button
              onClick={() => swiperRef.current?.slidePrev()}
              disabled={dates.length <= 1}
              className={`p-2 rounded-full transition-all ${
                dates.length <= 1
                  ? 'opacity-30 cursor-not-allowed'
                  : theme === 'dark'
                  ? 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-teal-300'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-teal-600'
              }`}
            >
              <ChevronLeftIcon className="w-5 h-5" />
            </button>
            
            <div className={`text-xs px-3 py-1 rounded-full ${
              theme === 'dark'
                ? 'bg-slate-800/50 text-slate-400'
                : 'bg-slate-100 text-slate-600'
            }`}>
              {visibleSlideIndex + 1} of {dates.length}
            </div>
            
            <button
              onClick={() => swiperRef.current?.slideNext()}
              disabled={dates.length <= 1}
              className={`p-2 rounded-full transition-all ${
                dates.length <= 1
                  ? 'opacity-30 cursor-not-allowed'
                  : theme === 'dark'
                  ? 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-teal-300'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-teal-600'
              }`}
            >
              <ChevronRightIcon className="w-5 h-5" />
            </button>
          </div>

          {/* Page indicators */}
          <div className="flex space-x-1">
            {dates.map((_, index) => (
              <div
                key={index}
                className={`w-1.5 h-1.5 rounded-full transition-all cursor-pointer ${
                  index === visibleSlideIndex
                    ? theme === "dark"
                      ? "bg-teal-400 scale-125"
                      : "bg-teal-500 scale-125"
                    : theme === "dark"
                    ? "bg-white/30 hover:bg-white/50"
                    : "bg-slate-300 hover:bg-slate-400"
                }`}
                onClick={() => swiperRef.current?.slideTo(index)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default LeaguePredictionsStack;
