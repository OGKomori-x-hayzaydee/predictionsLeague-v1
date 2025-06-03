import React, { useContext } from "react";
import { motion } from "framer-motion";
import { format, parseISO, isSameDay } from "date-fns";
import SimplePredictionCard from "./SimplePredictionCard";
import EmptyState from "../common/EmptyState";
import { ThemeContext } from "../../context/ThemeContext";

const PredictionTimeline = ({
  predictions,
  onPredictionSelect,
  onEditClick,
  teamLogos,
  searchQuery,
}) => {
  const { theme } = useContext(ThemeContext);

  if (predictions.length === 0) {
    return <EmptyState />;
  }

  // Group predictions by date
  const groupedPredictions = predictions.reduce((groups, prediction) => {
    const date = format(parseISO(prediction.date), 'yyyy-MM-dd');
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(prediction);
    return groups;
  }, {});

  const sortedDates = Object.keys(groupedPredictions).sort((a, b) => 
    new Date(b) - new Date(a) // Most recent first
  );

  return (
    <div className="space-y-8">
      {sortedDates.map((dateKey, dateIndex) => {
        const datePredictions = groupedPredictions[dateKey];
        const date = parseISO(dateKey);
        
        return (
          <motion.div
            key={dateKey}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: dateIndex * 0.1 }}
            className="relative"
          >
            {/* Timeline line - only show if not the last group */}
            {dateIndex < sortedDates.length - 1 && (
              <div 
                className={`absolute left-6 top-16 w-0.5 h-full ${
                  theme === "dark" ? "bg-slate-700" : "bg-slate-200"
                }`}
                style={{ height: 'calc(100% + 2rem)' }}
              />
            )}

            {/* Date header with timeline dot */}
            <div className="flex items-center gap-4 mb-4">
              <div className={`relative w-12 h-12 rounded-full flex items-center justify-center ${
                theme === "dark" ? "bg-slate-800 border-2 border-slate-600" : "bg-white border-2 border-slate-300 shadow-sm"
              }`}>
                <div className={`w-3 h-3 rounded-full ${
                  theme === "dark" ? "bg-teal-400" : "bg-teal-500"
                }`} />
              </div>
              
              <div>
                <h3 className={`font-semibold text-lg ${
                  theme === "dark" ? "text-white" : "text-slate-800"
                }`}>
                  {format(date, 'EEEE, MMMM do, yyyy')}
                </h3>
                <p className={`text-sm ${
                  theme === "dark" ? "text-slate-400" : "text-slate-500"
                }`}>
                  {datePredictions.length} prediction{datePredictions.length > 1 ? 's' : ''}
                </p>
              </div>
            </div>

            {/* Predictions for this date */}
            <div className="ml-16 space-y-3">
              {datePredictions.map((prediction, predictionIndex) => (
                <motion.div
                  key={prediction.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ 
                    duration: 0.3, 
                    delay: dateIndex * 0.1 + predictionIndex * 0.05 
                  }}
                >
                  <SimplePredictionCard
                    prediction={prediction}
                    teamLogos={teamLogos}
                    onClick={onPredictionSelect}
                    onEditClick={onEditClick}
                  />
                </motion.div>
              ))}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

export default PredictionTimeline;
