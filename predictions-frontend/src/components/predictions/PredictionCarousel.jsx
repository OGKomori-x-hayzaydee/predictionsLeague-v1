import React, { useState, useRef, useContext } from "react";
import { motion } from "framer-motion";
import { ChevronLeftIcon, ChevronRightIcon } from "@radix-ui/react-icons";
import UniversalDateGroup from "../common/UniversalDateGroup";
import EmptyState from "../common/EmptyState";
import { ThemeContext } from "../../context/ThemeContext";
import { groupPredictionsByDate, filterPredictionsByQuery } from "../../utils/predictionUtils";

const PredictionCarousel = ({
  predictions,
  onPredictionSelect,
  onEditClick,
  teamLogos,
  searchQuery = "",
}) => {
  const { theme } = useContext(ThemeContext);
  const [currentIndex, setCurrentIndex] = useState(0);
  const carouselRef = useRef(null);
  const [selectedPrediction, setSelectedPrediction] = useState(null);

  // Filter predictions based on search query
  const filteredPredictions = filterPredictionsByQuery(predictions, searchQuery);

  if (filteredPredictions.length === 0) {
    return <EmptyState />;
  }

  // Group predictions by date for the carousel
  const predictionsByDate = groupPredictionsByDate(filteredPredictions);
  const dateGroups = Object.entries(predictionsByDate);

  // Handle selection
  const handlePredictionClick = (prediction) => {
    setSelectedPrediction(prediction);
    if (onPredictionSelect) {
      onPredictionSelect(prediction);
    }
  };

  const itemsPerView = 3;
  const maxIndex = Math.max(0, dateGroups.length - itemsPerView);

  const scrollToIndex = (index) => {
    const clampedIndex = Math.max(0, Math.min(index, maxIndex));
    setCurrentIndex(clampedIndex);
    
    if (carouselRef.current) {
      const itemWidth = carouselRef.current.children[0]?.offsetWidth || 0;
      const gap = 16; // 1rem gap
      const scrollLeft = clampedIndex * (itemWidth + gap);
      carouselRef.current.scrollTo({
        left: scrollLeft,
        behavior: 'smooth'
      });
    }
  };

  const handlePrevious = () => {
    scrollToIndex(currentIndex - 1);
  };

  const handleNext = () => {
    scrollToIndex(currentIndex + 1);
  };

  return (
    <div className="relative">
      {/* Navigation buttons */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrevious}
            disabled={currentIndex === 0}
            className={`p-2 rounded-lg transition-colors ${
              currentIndex === 0
                ? theme === "dark"
                  ? "bg-slate-800/30 text-slate-600 cursor-not-allowed"
                  : "bg-slate-100 text-slate-400 cursor-not-allowed"
                : theme === "dark"
                  ? "bg-slate-700/50 text-slate-300 hover:bg-slate-700/70"
                  : "bg-slate-200 text-slate-600 hover:bg-slate-300"
            }`}
          >
            <ChevronLeftIcon className="w-4 h-4" />
          </button>
          
          <button
            onClick={handleNext}
            disabled={currentIndex >= maxIndex}
            className={`p-2 rounded-lg transition-colors ${
              currentIndex >= maxIndex
                ? theme === "dark"
                  ? "bg-slate-800/30 text-slate-600 cursor-not-allowed"
                  : "bg-slate-100 text-slate-400 cursor-not-allowed"
                : theme === "dark"
                  ? "bg-slate-700/50 text-slate-300 hover:bg-slate-700/70"
                  : "bg-slate-200 text-slate-600 hover:bg-slate-300"
            }`}
          >
            <ChevronRightIcon className="w-4 h-4" />
          </button>
        </div>            {/* Indicators */}
            <div className="flex items-center gap-1">
              {Array.from({ length: Math.ceil(dateGroups.length / itemsPerView) }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => scrollToIndex(index * itemsPerView)}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    Math.floor(currentIndex / itemsPerView) === index
                      ? theme === "dark" ? "bg-teal-400" : "bg-teal-500"
                      : theme === "dark" ? "bg-slate-600" : "bg-slate-300"
                  }`}
                />
              ))}
            </div>
      </div>

      {/* Carousel container */}          <div className="overflow-hidden">
            <motion.div
              ref={carouselRef}
              className="flex gap-4 transition-transform duration-300"
              style={{
                transform: `translateX(-${currentIndex * (100 / itemsPerView + 4 / itemsPerView)}%)`,
              }}
            >
              {dateGroups.map(([date, dayPredictions], index) => (
                <motion.div
                  key={date}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="flex-shrink-0"
                  style={{ width: `calc(${100 / itemsPerView}% - ${(itemsPerView - 1) * 16 / itemsPerView}px)` }}
                >
                  <UniversalDateGroup
                    date={date}
                    items={dayPredictions}
                    type="predictions"
                    selectedItem={selectedPrediction}
                    onItemClick={handlePredictionClick}
                    onEditClick={onEditClick}
                    teamLogos={teamLogos}
                  />
                </motion.div>
              ))}
            </motion.div>
          </div>      {/* Progress indicator */}
      <div className="mt-4 text-center">
        <span className={`text-sm ${theme === "dark" ? "text-slate-400" : "text-slate-500"}`}>
          {currentIndex + 1}-{Math.min(currentIndex + itemsPerView, dateGroups.length)} of {dateGroups.length} groups
        </span>
      </div>
    </div>
  );
};

export default PredictionCarousel;
