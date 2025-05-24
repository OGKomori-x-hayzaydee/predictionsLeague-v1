import React from "react";
import { BarChartIcon } from "@radix-ui/react-icons";

const RecentPredictionsPanel = ({ predictions, onViewAll }) => {
  return (
    <div className="bg-primary-600/40 rounded-lg p-5 border border-primary-400/20">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-teal-200 font-outfit font-medium text-lg">
          Recent Predictions
        </h3>
        <button
          onClick={onViewAll}
          className="text-indigo-300 text-sm flex items-center hover:text-indigo-200 transition-colors"
        >
          View all <BarChartIcon className="ml-1" />
        </button>
      </div>

      <div className="space-y-3">
        {predictions.map((prediction) => (
          <div
            key={prediction.id}
            className="flex items-center justify-between py-3 border-b border-primary-500/60 last:border-0"
          >
            <div>
              <div className="text-white font-outfit font-medium">
                {prediction.match}
              </div>
              <div className="text-white/60 text-xs">
                GW{35 - (prediction.id - 1)}
              </div>
            </div>
            <div
              className={`rounded-full flex items-center ${
                prediction.correct
                  ? "bg-green-700/20 text-green-300"
                  : "bg-red-700/20 text-red-300"
              } text-xs font-medium py-1 px-3`}
            >
              {prediction.points} points
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentPredictionsPanel;