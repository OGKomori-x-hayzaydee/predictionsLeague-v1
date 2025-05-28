import React from "react";
import { motion } from "framer-motion";
import SimplePredictionCard from "./SimplePredictionCard";
import EmptyState from "../common/EmptyState";

const PredictionList = ({
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
    <div className="space-y-3">
      {predictions.map((prediction, index) => (
        <motion.div
          key={prediction.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.05 }}
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
  );
};

export default PredictionList;
