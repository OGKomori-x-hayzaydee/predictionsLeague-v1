import React, { useState, useContext } from "react";
import { motion } from "framer-motion";
import { groupPredictionsByDate, filterPredictionsByQuery } from "../../utils/predictionUtils";
import SimplePredictionCard from "./SimplePredictionCard";
import EmptyState from "../common/EmptyState";
import { format, parseISO } from "date-fns";
import { ThemeContext } from "../../context/ThemeContext";

const PredictionDateHeader = ({ date, predictionsCount }) => {
  const { theme } = useContext(ThemeContext);
  
  return (
    <div className="col-span-full mt-2 mb-1 flex items-center">
      <div className={`font-medium text-sm px-3 py-1 rounded-md ${
        theme === "dark" 
          ? "bg-teal-900/30 text-teal-300" 
          : "bg-teal-100 text-teal-700 border border-teal-200"
      }`}>
        {format(parseISO(date), "EEEE, MMMM d, yyyy")}
      </div>
      <div className={`ml-2 text-sm ${
        theme === "dark" ? "text-white/40" : "text-slate-500"
      }`}>
        {predictionsCount} prediction{predictionsCount !== 1 ? 's' : ''}
      </div>
    </div>
  );
};

const PredictionList = ({
  predictions,
  onPredictionSelect,
  onEditClick,
  teamLogos,
  searchQuery,
}) => {
  const [selectedPrediction, setSelectedPrediction] = useState(null);

  // Filter predictions based on search query - using common utility function
  const filteredPredictions = filterPredictionsByQuery(predictions, searchQuery);

  // Group predictions by date for the list view - using common utility function
  const predictionsByDate = groupPredictionsByDate(filteredPredictions);

  // Handle selection
  const handlePredictionClick = (prediction) => {
    setSelectedPrediction(prediction);
    if (onPredictionSelect) {
      onPredictionSelect(prediction);
    }
  };

  // Check if we have any predictions to display
  const hasPredictions = Object.keys(predictionsByDate).length > 0;

  if (!hasPredictions) {
    return <EmptyState />;
  }

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Object.entries(predictionsByDate).map(([date, dayPredictions]) => (
          <React.Fragment key={date}>
            {/* Date header component */}
            <PredictionDateHeader 
              date={date} 
              predictionsCount={dayPredictions.length} 
            />
            
            {/* Predictions for this date */}
            {dayPredictions.map((prediction, index) => (
              <motion.div
                key={prediction.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <SimplePredictionCard
                  prediction={prediction}
                  teamLogos={teamLogos}
                  selected={selectedPrediction && selectedPrediction.id === prediction.id}
                  onClick={handlePredictionClick}
                  onEditClick={onEditClick}
                />
              </motion.div>
            ))}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default PredictionList;
