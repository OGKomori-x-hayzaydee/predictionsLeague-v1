import React, { useState, useRef, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ChevronLeftIcon, 
  ChevronRightIcon, 
  TargetIcon,
  ClockIcon,
  CalendarIcon
} from "@radix-ui/react-icons";
import { format, parseISO } from "date-fns";
import { ThemeContext } from "../../context/ThemeContext";
import PredictionCard from "./PredictionCard";
import TeamLogo from "../ui/TeamLogo";
import { LOGO_SIZES } from "../../utils/teamLogos";

const PredictionCarousel = ({
  predictions,
  currentGameweek = 15,
  onPredictionSelect,
  onEditClick, // For personal mode
  isReadOnly = true,
  mode = "league", // "personal" or "league"
  searchQuery = "",
  cardStyle = "normal"
}) => {
  const { theme } = useContext(ThemeContext);
  const [activeMatchIndex, setActiveMatchIndex] = useState(0);
  const [selectedPrediction, setSelectedPrediction] = useState(null);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const carouselRef = useRef(null);

  // Filter predictions based on search query and mode
  const filteredPredictions = predictions.filter(prediction => {
    if (searchQuery) {
      const searchLower = searchQuery.toLowerCase();
      if (mode === "league") {
        return (
          prediction.userDisplayName?.toLowerCase().includes(searchLower) ||
          prediction.homeTeam?.toLowerCase().includes(searchLower) ||
          prediction.awayTeam?.toLowerCase().includes(searchLower)
        );
      } else {
        return (
          prediction.homeTeam?.toLowerCase().includes(searchLower) ||
          prediction.awayTeam?.toLowerCase().includes(searchLower) ||
          prediction.venue?.toLowerCase().includes(searchLower) ||
          prediction.competition?.toLowerCase().includes(searchLower)
        );
      }
    }
    return true;
  });

  // Group predictions based on mode
  let matches = [];
  
  if (mode === "league") {
    // Group by match within the current gameweek (league mode)
    const gameweekPredictions = filteredPredictions.filter(p => p.gameweek === currentGameweek);
    
    const predictionsByMatch = gameweekPredictions.reduce((groups, prediction) => {
      const matchKey = `${prediction.homeTeam}_vs_${prediction.awayTeam}`;
      if (!groups[matchKey]) {
        groups[matchKey] = {
          matchInfo: {
            homeTeam: prediction.homeTeam,
            awayTeam: prediction.awayTeam,
            date: prediction.date,
            gameweek: prediction.gameweek,
            matchId: prediction.matchId
          },
          predictions: []
        };
      }
      groups[matchKey].predictions.push(prediction);
      return groups;
    }, {});
    
    matches = Object.values(predictionsByMatch);
  } else {
    // For personal mode, show all filtered predictions in a single group
    if (filteredPredictions.length > 0) {
      matches = [{
        matchInfo: {
          isPersonalMode: true,
          totalPredictions: filteredPredictions.length
        },
        predictions: filteredPredictions
      }];
    }
  }

  // Helper function to count goals per scorer
  const getGoalCounts = (scorers) => {
    if (!scorers || scorers.length === 0) return {};
    return scorers.reduce((counts, scorer) => {
      counts[scorer] = (counts[scorer] || 0) + 1;
      return counts;
    }, {});
  };

  if (matches.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`text-center py-16 ${
          theme === "dark"
            ? "bg-slate-800/30 border-slate-700/50"
            : "bg-white border-slate-200"
        } backdrop-blur-sm border rounded-xl shadow-sm`}
      >
        <CalendarIcon className={`w-16 h-16 mx-auto mb-4 ${
          theme === "dark" ? "text-slate-500" : "text-slate-400"
        }`} />
        <h3 className={`text-xl font-semibold ${
          theme === "dark" ? "text-white" : "text-slate-900"
        } mb-2 font-outfit`}>
          No Predictions Found
        </h3>
        <p className={`${
          theme === "dark" ? "text-slate-400" : "text-slate-600"
        } font-outfit`}>
          {mode === "league" 
            ? `No predictions available for Gameweek ${currentGameweek}`
            : searchQuery 
              ? "No predictions match your search criteria"
              : "No predictions available"
          }
        </p>
      </motion.div>
    );
  }

  // Ensure activeMatchIndex is within bounds
  const safeActiveMatchIndex = Math.max(0, Math.min(activeMatchIndex, matches.length - 1));
  const currentMatch = matches[safeActiveMatchIndex];
  
  if (!currentMatch || !currentMatch.predictions) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="text-center py-12"
      >
        <TargetIcon className={`w-12 h-12 mx-auto mb-4 opacity-50 ${
          theme === 'dark' ? 'text-slate-500' : 'text-slate-400'
        }`} />
        <p className={`text-lg font-medium ${
          theme === 'dark' ? 'text-slate-300' : 'text-slate-700'
        }`}>
          No match data available
        </p>
      </motion.div>
    );
  }

  const itemsPerView = 3;
  const totalItems = currentMatch.predictions.length;
  // Calculate how many "pages" we need (each page shows itemsPerView cards)
  const totalPages = Math.ceil(totalItems / itemsPerView);
  const maxCarouselIndex = Math.max(0, totalPages - 1);
  const canScrollLeft = carouselIndex > 0;
  const canScrollRight = carouselIndex < maxCarouselIndex;

  // Calculate the transform percentage to move by full viewport widths
  const getTransformX = () => {
    if (totalItems <= itemsPerView) return 0;
    
    // Move by full viewport widths (100% per page)
    return -(carouselIndex * 100);
  };

  const handlePredictionClick = (prediction) => {
    setSelectedPrediction(prediction);
    if (onPredictionSelect && typeof onPredictionSelect === 'function') {
      onPredictionSelect(prediction);
    }
  };

  const handleMatchChange = (matchIndex) => {
    if (matchIndex >= 0 && matchIndex < matches.length) {
      setActiveMatchIndex(matchIndex);
      setSelectedPrediction(null);
      setCarouselIndex(0); // Reset carousel when changing matches
    }
  };

  const scrollLeft = () => {
    if (canScrollLeft) {
      setCarouselIndex(prev => Math.max(0, prev - 1));
    }
  };

  const scrollRight = () => {
    if (canScrollRight) {
      setCarouselIndex(prev => Math.min(maxCarouselIndex, prev + 1));
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      {/* Header - Only show for league mode */}
      {mode === "league" && (
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-lg ${
            theme === "dark" 
              ? "bg-slate-800/50 border-slate-700" 
              : "bg-slate-50 border-slate-200"
          } border`}>
            <TargetIcon className="w-5 h-5 text-teal-600" />
          </div>
          <div>
            <h3 className={`text-xl font-bold ${
              theme === "dark" ? "text-white" : "text-slate-900"
            } font-outfit`}>
              Gameweek {currentGameweek}
            </h3>
            <p className={`text-sm ${
              theme === "dark" ? "text-slate-400" : "text-slate-600"
            } font-outfit`}>
              League Predictions
            </p>
          </div>
        </div>
      )}

      {/* Match/Date Selector Tabs - Only show for league mode */}
      {mode === "league" && (
        <div className="overflow-x-auto">
          <div className="flex space-x-2 min-w-max pb-2">
            {matches.map((match, index) => {
              const tabLabel = `${match.matchInfo.homeTeam} vs ${match.matchInfo.awayTeam}`;
              const tabKey = `${match.matchInfo.homeTeam}_vs_${match.matchInfo.awayTeam}`;
                
              return (
                <button
                  key={tabKey}
                  onClick={() => handleMatchChange(index)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap font-outfit ${
                    index === activeMatchIndex
                      ? "bg-teal-600 text-white"
                      : theme === "dark"
                      ? "bg-slate-800/50 text-slate-300 hover:bg-slate-700/50"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  {tabLabel}
                  <span className={`ml-2 px-1.5 py-0.5 rounded text-xs ${
                    index === activeMatchIndex
                    ? "bg-white/20 text-white"
                    : "bg-teal-600 text-white"
                }`}>
                  {match.predictions.length}
                </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Current Match Display */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeMatchIndex}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className={`${
            theme === "dark"
              ? "bg-slate-800/30 border-slate-700/50"
              : "bg-white border-slate-200"
          } backdrop-blur-sm border rounded-xl shadow-sm overflow-hidden`}
        >
          {/* Match Header */}
          <div className={`p-6 border-b ${
            theme === "dark" ? "border-slate-700/50" : "border-slate-200"
          }`}>
            <div className="flex items-center justify-between">
              {mode === "league" ? (
                <div className="flex items-center space-x-6">
                  {/* Home Team */}
                  <div className="flex items-center space-x-3">
                    <TeamLogo 
                      teamName={currentMatch.matchInfo.homeTeam} 
                      size={LOGO_SIZES.md}
                      className="flex-shrink-0"
                    />
                    <div>
                      <h4 className={`font-bold text-lg ${
                        theme === "dark" ? "text-white" : "text-slate-900"
                      } font-outfit`}>
                        {currentMatch.matchInfo.homeTeam}
                      </h4>
                      <p className={`text-xs ${
                        theme === "dark" ? "text-slate-500" : "text-slate-500"
                      } font-outfit`}>
                        Home
                      </p>
                    </div>
                  </div>
                  
                  {/* VS */}
                  <div className="flex flex-col items-center">
                    <span className={`text-lg font-bold ${
                      theme === "dark" ? "text-slate-400" : "text-slate-600"
                    } font-outfit`}>
                      VS
                    </span>
                    <span className={`text-xs ${
                      theme === "dark" ? "text-slate-500" : "text-slate-500"
                    } font-outfit`}>
                      {mode === "league" 
                        ? format(parseISO(currentMatch.matchInfo.date), 'MMM dd')
                        : "Filtered"
                      }
                    </span>
                  </div>
                  
                  {/* Away Team */}
                  <div className="flex items-center space-x-3">
                    <div className="text-right">
                      <h4 className={`font-bold text-lg ${
                        theme === "dark" ? "text-white" : "text-slate-900"
                      } font-outfit`}>
                        {currentMatch.matchInfo.awayTeam}
                      </h4>
                      <p className={`text-xs ${
                        theme === "dark" ? "text-slate-500" : "text-slate-500"
                      } font-outfit`}>
                        Away
                      </p>
                    </div>
                    <TeamLogo 
                      teamName={currentMatch.matchInfo.awayTeam} 
                      size={LOGO_SIZES.md}
                      className="flex-shrink-0"
                    />
                  </div>
                </div>
              ) : (
                /* Personal Mode - Your Predictions Header */
                <div className="flex items-center space-x-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    theme === "dark" ? "bg-teal-900/30 text-teal-300" : "bg-teal-100 text-teal-700"
                  }`}>
                    <TargetIcon className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className={`font-bold text-lg ${
                      theme === "dark" ? "text-white" : "text-slate-900"
                    } font-outfit`}>
                      Your Predictions
                    </h4>
                    <p className={`text-xs ${
                      theme === "dark" ? "text-slate-500" : "text-slate-500"
                    } font-outfit`}>
                      {currentMatch.predictions.length} prediction{currentMatch.predictions.length !== 1 ? 's' : ''}
                    </p>
                  </div>
                </div>
              )}

              {/* Match Time */}
              <div className="text-right">
                <div className="flex items-center space-x-2">
                  <ClockIcon className={`w-4 h-4 ${
                    theme === "dark" ? "text-slate-500" : "text-slate-500"
                  }`} />
                  <span className={`text-sm font-medium ${
                    theme === "dark" ? "text-slate-300" : "text-slate-700"
                  } font-outfit`}>
                    {mode === "league" 
                      ? format(parseISO(currentMatch.matchInfo.date), 'HH:mm')
                      : `${currentMatch.predictions.length} match${currentMatch.predictions.length !== 1 ? 'es' : ''}`
                    }
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Predictions Carousel */}
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              {mode === "league" && (
                <h4 className={`font-semibold text-lg ${
                  theme === "dark" ? "text-white" : "text-slate-900"
                } font-outfit`}>
                  Member Predictions
                </h4>
              )}
              
              {/* Carousel Controls */}
              {currentMatch.predictions.length > itemsPerView && (
                <div className="flex items-center space-x-2">
                  <button
                    onClick={scrollLeft}
                    disabled={!canScrollLeft}
                    className={`p-2 rounded-lg transition-colors ${
                      !canScrollLeft
                        ? "opacity-50 cursor-not-allowed"
                        : theme === "dark"
                        ? "bg-slate-700 hover:bg-slate-600 text-white"
                        : "bg-slate-100 hover:bg-slate-200 text-slate-700"
                    }`}
                  >
                    <ChevronLeftIcon className="w-4 h-4" />
                  </button>
                  <span className={`text-sm ${
                    theme === "dark" ? "text-slate-400" : "text-slate-600"
                  } font-outfit`}>
                    {(carouselIndex * itemsPerView) + 1}-{Math.min((carouselIndex + 1) * itemsPerView, currentMatch.predictions.length)} of {currentMatch.predictions.length}
                  </span>
                  <button
                    onClick={scrollRight}
                    disabled={!canScrollRight}
                    className={`p-2 rounded-lg transition-colors ${
                      !canScrollRight
                        ? "opacity-50 cursor-not-allowed"
                        : theme === "dark"
                        ? "bg-slate-700 hover:bg-slate-600 text-white"
                        : "bg-slate-100 hover:bg-slate-200 text-slate-700"
                    }`}
                  >
                    <ChevronRightIcon className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
            
            {/* Predictions Cards Container */}
            <div className="relative overflow-hidden -mx-2">
              <motion.div
                className="flex gap-4 px-2"
                animate={{
                  x: `${getTransformX()}%`
                }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              >
                {currentMatch.predictions.map((prediction, index) => (
                  <motion.div
                    key={`${prediction.matchId}-${prediction.username || prediction.userDisplayName}-${index}`}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                    className={`flex-shrink-0 ${
                      selectedPrediction?.matchId === prediction.matchId &&
                      selectedPrediction?.username === prediction.username
                        ? "ring-2 ring-teal-500 rounded-lg"
                        : ""
                    }`}
                    style={{
                      width: totalItems <= itemsPerView 
                        ? `calc(${100 / Math.min(totalItems, itemsPerView)}% - ${16}px)`
                        : `calc(${100 / itemsPerView}% - ${16}px)`
                    }}
                  >
                    <PredictionCard
                      prediction={prediction}
                      mode={mode}
                      showMemberInfo={mode === "league"}
                      onSelect={handlePredictionClick}
                      onEdit={onEditClick}
                      isReadonly={isReadOnly}
                      size={cardStyle}
                    />
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Dots */}
      {matches.length > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          {matches.map((_, index) => (
            <button
              key={index}
              onClick={() => handleMatchChange(index)}
              className={`w-2 h-2 rounded-full transition-colors ${
                activeMatchIndex === index
                  ? "bg-teal-500"
                  : theme === "dark"
                  ? "bg-slate-600"
                  : "bg-slate-300"
              }`}
            />
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default PredictionCarousel;
