import React, { useState, useContext } from "react";
import { motion } from "framer-motion";
import { TargetIcon } from "@radix-ui/react-icons";
import { filterPredictionsByQuery, groupPredictionsByPredictedDate } from "../../utils/predictionUtils";
import { ThemeContext } from "../../context/ThemeContext";
import PredictionCard from "./PredictionCard";
import DateHeader from "../fixtures/DateHeader";




const PredictionGrid = ({
  predictions,
  onPredictionSelect,
  onEditClick,
  teamLogos = {},
  searchQuery = "",
  mode = "personal", // "personal" or "league"
  cardStyle = "normal" // "normal" or "compact"
}) => {
  const { theme } = useContext(ThemeContext);
  const [selectedPrediction, setSelectedPrediction] = useState(null);

  // Filter predictions based on search query
  const filteredPredictions = mode === "personal" 
    ? filterPredictionsByQuery(predictions, searchQuery)
    : predictions.filter(prediction => {
        if (!searchQuery) return true;
        
        const searchLower = searchQuery.toLowerCase();
        return (
          prediction.userDisplayName?.toLowerCase().includes(searchLower) ||
          prediction.homeTeam.toLowerCase().includes(searchLower) ||
          prediction.awayTeam.toLowerCase().includes(searchLower) ||
          `${prediction.homeTeam} vs ${prediction.awayTeam}`.toLowerCase().includes(searchLower)
        );
      });

  // Handle selection
  const handlePredictionClick = (prediction) => {
    setSelectedPrediction(prediction);
    if (onPredictionSelect) {
      onPredictionSelect(prediction);
    }
  };

  // Sort predictions - league by most recent, personal by date
  const sortedPredictions = [...filteredPredictions].sort((a, b) => {
    if (mode === "personal") {
      return new Date(a.date) - new Date(b.date); // Chronological for personal
    } else {
      return new Date(b.predictedAt || b.date) - new Date(a.predictedAt || a.date); // Most recent first for league
    }
  });

  // Group predictions by the date they were created (predictedAt)
  const predictionsByDate = groupPredictionsByPredictedDate(sortedPredictions);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {sortedPredictions.length === 0 ? (
        <div className={`text-center py-12 ${
          theme === "dark" ? "text-slate-400" : "text-slate-600"
        }`}>
          <TargetIcon className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p className="text-lg font-medium font-outfit">No predictions found</p>
          <p className="text-sm mt-2">
            {searchQuery ? "Try adjusting your search terms." : "Member predictions will appear here."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(predictionsByDate).map(([date, dayPredictions]) => (
            <React.Fragment key={date}>
              {/* Date header component */}
              <DateHeader 
                date={date} 
                itemsCount={dayPredictions.length}
                type="predictions"
              />
              
              {/* Predictions for this date */}
              {dayPredictions.map((prediction, index) => (
                <motion.div
                  key={prediction.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <PredictionCard
                    prediction={prediction}
                    mode={mode}
                    showMemberInfo={mode === "league"}
                    onSelect={handlePredictionClick}
                    onEdit={onEditClick}
                    isReadonly={mode === "league"}
                    size={cardStyle}
                  />
                </motion.div>
              ))}
            </React.Fragment>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default PredictionGrid;
