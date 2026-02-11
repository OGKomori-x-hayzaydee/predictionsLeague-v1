import React, { useState, useEffect, useRef, useContext } from "react";
import { parseISO } from "date-fns";
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";
// Import Swiper styles
import "swiper/css";
import "swiper/css/effect-cards";
// Import required modules
import { EffectCards } from "swiper/modules";
import { ChevronLeftIcon, ChevronRightIcon } from "@radix-ui/react-icons";

import PredictionCard from "./PredictionCard";
import EmptyState from "../common/EmptyState";
import { ThemeContext } from "../../context/ThemeContext";

const PredictionStack = ({
  predictions,
  onPredictionSelect,
  onEditClick,
  teamLogos,
  searchQuery = "",
  cardStyle = "normal",
  mode = "personal",
  showMemberInfo = false,
  isReadonly = false
}) => {
  const [selectedPrediction, setSelectedPrediction] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const swiperRef = useRef(null);
  const [swiperInitialized, setSwiperInitialized] = useState(false);

  // Get theme context
  const { theme } = useContext(ThemeContext);

  // Filter predictions based on search query
  const filteredPredictions = React.useMemo(() => {
    return predictions.filter((prediction) => {
      if (!searchQuery) return true;

      const query = searchQuery.toLowerCase();

      if (mode === "league") {
        return (
          prediction.userDisplayName?.toLowerCase().includes(query) ||
          prediction.homeTeam.toLowerCase().includes(query) ||
          prediction.awayTeam.toLowerCase().includes(query) ||
          `${prediction.homeTeam} vs ${prediction.awayTeam}`.toLowerCase().includes(query)
        );
      }

      return (
        prediction.homeTeam.toLowerCase().includes(query) ||
        prediction.awayTeam.toLowerCase().includes(query) ||
        prediction.venue?.toLowerCase().includes(query) ||
        prediction.competition?.toLowerCase().includes(query)
      );
    });
  }, [predictions, searchQuery, mode]);

  // Initialize to today's first prediction or closest upcoming
  const initializationDone = useRef(false);

  useEffect(() => {
    if (initializationDone.current || filteredPredictions.length === 0) return;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Find first prediction today or upcoming
    const upcomingIndex = filteredPredictions.findIndex((prediction) => {
      const predictionDate = parseISO(prediction.date);
      return predictionDate >= today;
    });

    const targetIndex = upcomingIndex !== -1 ? upcomingIndex : 0;

    if (targetIndex !== 0) {
      setActiveIndex(targetIndex);
    }

    initializationDone.current = true;
  }, [filteredPredictions]);

  // Swiper initialization handler
  const handleSwiperInit = (swiper) => {
    if (!swiper) return;
    swiperRef.current = swiper;
    setSwiperInitialized(true);
  };

  // Slide change handler
  const handleSlideChange = (swiper) => {
    if (!swiper || typeof swiper.activeIndex !== "number") return;

    if (swiper.activeIndex !== activeIndex && swiper.activeIndex < filteredPredictions.length) {
      setActiveIndex(swiper.activeIndex);
    }
  };

  // Handle prediction selection
  const handlePredictionClick = (prediction) => {
    setSelectedPrediction(prediction);
    if (onPredictionSelect) {
      onPredictionSelect(prediction);
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!swiperRef.current) return;

      let newIndex = activeIndex;

      if (e.key === "ArrowLeft" && activeIndex > 0) {
        newIndex = activeIndex - 1;
      } else if (e.key === "ArrowRight" && activeIndex < filteredPredictions.length - 1) {
        newIndex = activeIndex + 1;
      } else {
        return;
      }

      if (newIndex !== activeIndex) {
        swiperRef.current.slideTo(newIndex);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [activeIndex, filteredPredictions.length]);

  // Reset activeIndex if it exceeds filtered predictions length
  useEffect(() => {
    if (filteredPredictions.length === 0) {
      setActiveIndex(0);
    } else if (activeIndex >= filteredPredictions.length) {
      setActiveIndex(0);
    }
  }, [filteredPredictions.length, activeIndex]);

  return (
    <>
      {filteredPredictions.length === 0 ? (
        <EmptyState />
      ) : (
        <>
          {/* Stack of individual prediction cards using Swiper */}
          <div className="relative">
            <div className="fixture-swiper-container">
              <Swiper
                effect={"cards"}
                grabCursor={true}
                modules={[EffectCards]}
                className="fixture-stack-swiper"
                onSlideChange={handleSlideChange}
                onSwiper={handleSwiperInit}
                cardsEffect={{
                  slideShadows: false,
                  perSlideRotate: 3,
                  perSlideOffset: 8,
                  rotate: true,
                }}
                speed={400}
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
                {filteredPredictions.map((prediction, index) => (
                  <SwiperSlide key={prediction.id} className="fixture-stack-slide">
                    <PredictionCard
                      prediction={prediction}
                      mode={mode}
                      showMemberInfo={mode === "league" || showMemberInfo}
                      onSelect={handlePredictionClick}
                      onEdit={mode === "personal" ? onEditClick : undefined}
                      isReadonly={mode === "league" || isReadonly}
                      size={cardStyle}
                    />
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </div>

          {/* Navigation controls and progress indicators */}
          <div className="flex flex-col items-center mt-4 gap-2">
            {/* Arrow navigation + counter row */}
            <div className="flex justify-center items-center gap-4">
              <button
                onClick={() => swiperRef.current?.slidePrev()}
                disabled={activeIndex === 0}
                className={`p-2 rounded-full transition-all ${
                  activeIndex === 0
                    ? "opacity-30 cursor-not-allowed"
                    : theme === "dark"
                    ? "bg-slate-700 hover:bg-slate-600 text-slate-300"
                    : "bg-white hover:bg-slate-50 text-slate-700 shadow-md"
                }`}
                aria-label="Previous prediction"
              >
                <ChevronLeftIcon className="w-5 h-5" />
              </button>

              <div
                className={`text-xs font-medium px-3 py-1 rounded-full ${
                  theme === "dark"
                    ? "bg-slate-800/50 text-slate-400"
                    : "bg-slate-100 text-slate-600"
                }`}
              >
                {activeIndex + 1} / {filteredPredictions.length}
              </div>

              <button
                onClick={() => swiperRef.current?.slideNext()}
                disabled={activeIndex >= filteredPredictions.length - 1}
                className={`p-2 rounded-full transition-all ${
                  activeIndex >= filteredPredictions.length - 1
                    ? "opacity-30 cursor-not-allowed"
                    : theme === "dark"
                    ? "bg-slate-700 hover:bg-slate-600 text-slate-300"
                    : "bg-white hover:bg-slate-50 text-slate-700 shadow-md"
                }`}
                aria-label="Next prediction"
              >
                <ChevronRightIcon className="w-5 h-5" />
              </button>
            </div>

            {/* Dot indicators for smaller lists */}
            {filteredPredictions.length <= 10 && (
              <div className="flex space-x-1">
                {filteredPredictions.map((_, index) => (
                  <div
                    key={index}
                    className={`w-1.5 h-1.5 rounded-full transition-all ${
                      index === activeIndex
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
            )}
          </div>
        </>
      )}
    </>
  );
};

export default PredictionStack;
