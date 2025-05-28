import React from "react";
import { motion } from "framer-motion";
import SimplePredictionCard from "./SimplePredictionCard";
import EmptyState from "../common/EmptyState";

const PredictionStack = ({
  predictions,
  onPredictionSelect,
  onEditClick,
  teamLogos,
  searchQuery,
}) => {
  if (predictions.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="relative">
      {/* Stack container with offset cards */}
      <div className="space-y-2">
        {predictions.map((prediction, index) => (
          <motion.div
            key={prediction.id}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ 
              opacity: 1, 
              y: 0, 
              scale: 1,
              // Create stacking effect for first few cards
              translateY: index < 3 ? -index * 4 : -8,
              zIndex: predictions.length - index
            }}
            transition={{ 
              duration: 0.4, 
              delay: index * 0.1,
              ease: "easeOut"
            }}
            style={{
              // Add subtle shadow and depth
              filter: index > 0 ? `brightness(${1 - (index * 0.05)})` : 'brightness(1)',
            }}
            className={index > 0 ? "relative" : ""}
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

      {/* Show count indicator if there are many predictions */}
      {predictions.length > 5 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-4 text-center"
        >
          <span className="text-sm text-slate-400">
            Showing {Math.min(5, predictions.length)} of {predictions.length} predictions
          </span>
        </motion.div>
      )}
    </div>
  );
};

export default PredictionStack;
