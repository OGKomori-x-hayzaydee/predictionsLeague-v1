import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDownIcon } from "@radix-ui/react-icons";
import { calculatePredictionPoints } from "../../utils/chipUtils";

const PotentialPointsSummary = ({ predictions, teamLogos }) => {
  const [showDetailedPointsBreakdown, setShowDetailedPointsBreakdown] = useState(false);

  return (
    <div className="bg-primary-600/40 backdrop-blur-md rounded-lg border border-primary-400/20 mb-6 overflow-hidden">
      <div className="bg-primary-700/30 px-5 py-3 border-b border-primary-400/20">
        <h3 className="text-teal-100 text-lg font-dmSerif">
          Potential Points Summary
        </h3>
        <p className="text-white/60 text-sm">
          Total points you could earn from your pending predictions
        </p>
      </div>

      <div className="p-5">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Base potential - should NOT include chip bonuses */}
          <div className="bg-primary-700/30 rounded-lg p-4 flex flex-col items-center">
            <div className="text-white/50 text-xs mb-2">Base Potential</div>
            <div className="text-3xl font-bold text-white font-dmSerif mb-1 relative z-10">
              {predictions.reduce((total, prediction) => {
                // Base points calculation - without any chip effects
                const outcomePoints = 5;
                const exactScorePoints = 10;
                const baseGoalScorerPoints =
                  (prediction.homeScore + prediction.awayScore) * 2;

                // Simple sum of base points - NO CHIPS APPLIED
                const basePoints =
                  outcomePoints + exactScorePoints + baseGoalScorerPoints;

                return total + basePoints;
              }, 0)}
            </div>
            <div className="text-white/60 text-xs text-center">
              Without chips applied
            </div>
          </div>

          {/* With chips potential - should include all chip bonuses */}
          <div className="bg-gradient-to-br from-indigo-900/30 to-primary-700/30 rounded-lg p-4 flex flex-col items-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-600/10 rounded-full -translate-x-12 -translate-y-12"></div>
            <div className="absolute bottom-0 left-0 w-16 h-16 bg-teal-600/10 rounded-full -translate-x-8 translate-y-8"></div>

            <div className="text-indigo-200 text-xs mb-2 relative z-10">
              Maximum Potential
            </div>
            <div className="text-3xl font-bold text-white font-dmSerif mb-1 relative z-10">
              {predictions.reduce((total, prediction) => {
                const points = calculatePredictionPoints(prediction);
                return total + points.finalPoints;
              }, 0)}
            </div>
            <div className="text-indigo-200/80 text-xs text-center relative z-10">
              With all chips applied
            </div>
          </div>

          {/* Match breakdown */}
          <div className="bg-primary-700/30 rounded-lg p-4 font-outfit">
            <div className="text-white/50 text-xs mb-3">
              Match Breakdown
            </div>
            <div className="space-y-2 max-h-32 overflow-y-auto pr-1 custom-scrollbar">
              {predictions.map((prediction) => {
                const points = calculatePredictionPoints(prediction);
                
                return (
                  <div
                    key={prediction.id}
                    className="flex justify-between text-xs border-b border-primary-600/30 pb-1 last:border-0"
                  >
                    <div className="flex items-center">
                      <div className="w-5 h-5 rounded-full bg-white/5 flex items-center justify-center mr-2">
                        <img
                          src={teamLogos[prediction.homeTeam]}
                          alt={prediction.homeTeam}
                          className="w-3 h-3 object-contain"
                        />
                      </div>
                      <span className="text-white/80">
                        {prediction.homeTeam} vs {prediction.awayTeam}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <span className="text-white/60">
                        {points.pointsBeforeMultiplier}
                      </span>
                      <span>→</span>
                      <span className="text-teal-300 font-medium">
                        {points.finalPoints}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-3 pt-2 border-t border-primary-600/50">
              <div className="flex items-center justify-between">
                <span className="text-white/70 text-xs">
                  Total Fixtures
                </span>
                <span className="text-white text-sm font-medium">
                  {predictions.length}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 bg-primary-800/30 rounded-lg p-3 border border-primary-700/50">
          <div className="flex items-start gap-2">
            <div className="bg-indigo-800/40 p-1.5 rounded-full mt-0.5">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 text-indigo-300"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zm-4 4a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div>
              <h4 className="text-indigo-200 text-xs font-medium">
                How points are calculated
              </h4>
              <p className="text-white/60 text-xs mt-0.5">
                Base points: 5 for correct outcome, 10 for exact score, 2
                per correct goalscorer. Chips can multiply points or add
                bonuses.
              </p>
            </div>
          </div>
        </div>

        {/* Toggle button for detailed view */}
        <button
          onClick={() =>
            setShowDetailedPointsBreakdown(!showDetailedPointsBreakdown)
          }
          className="mt-3 text-indigo-300 text-sm flex items-center mx-auto hover:text-indigo-200 transition-colors"
        >
          {showDetailedPointsBreakdown
            ? "Hide detailed breakdown"
            : "View detailed breakdown"}
          <ChevronDownIcon
            className={`ml-1 transition-transform ${
              showDetailedPointsBreakdown ? "rotate-180" : ""
            }`}
          />
        </button>

        {/* Detailed breakdown section */}
        <AnimatePresence>
          {showDetailedPointsBreakdown && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="mt-4 pt-4 border-t border-primary-400/20"
            >
              <h4 className="text-teal-200 text-lg font-medium mb-3 font-dmSerif">
                Detailed Points Calculation
              </h4>
              <div className="space-y-4 font-outfit">
                {predictions.map((prediction) => {
                  // Call our utility function
                  const points = calculatePredictionPoints(prediction);
                  
                  // Build detailed breakdown
                  const breakdown = [
                    { label: "Outcome", value: 5, type: "base" },
                    { label: "Exact Score", value: 10, type: "base" },
                    { label: "Goal Scorers", value: (prediction.homeScore + prediction.awayScore) * 2, type: "base" },
                  ];
                  
                  if (prediction.chips.includes("scorerFocus")) {
                    breakdown.push({
                      label: "Scorer Focus",
                      value: (prediction.homeScore + prediction.awayScore) * 2,
                      type: "bonus",
                    });
                  }
                  
                  if (prediction.chips.includes("defensePlusPlus") && 
                      (prediction.homeScore === 0 || prediction.awayScore === 0)) {
                    breakdown.push({
                      label: "Defense++",
                      value: 10,
                      type: "bonus",
                    });
                  }
                  
                  if (points.hasWildcard) {
                    breakdown.push({
                      label: "Wildcard (3x)",
                      value: points.pointsBeforeMultiplier * 2,
                      type: "multiplier",
                      multiply: 3,
                    });
                  } else if (points.hasDoubleDown) {
                    breakdown.push({
                      label: "Double Down (2x)",
                      value: points.pointsBeforeMultiplier,
                      type: "multiplier",
                      multiply: 2,
                    });
                  }

                  return (
                    <div
                      key={prediction.id}
                      className="bg-primary-700/20 rounded-lg overflow-hidden"
                    >
                      <PointsBreakdownDetail 
                        prediction={prediction} 
                        breakdown={breakdown} 
                        points={points}
                        teamLogos={teamLogos}
                      />
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

const PointsBreakdownDetail = ({ prediction, breakdown, points, teamLogos }) => {
  
  return (
    <>
      <div className="bg-primary-800/30 px-4 py-2 flex items-center justify-between">
        <div className="flex items-center">
          <div className="w-6 h-6 rounded-full bg-white/5 flex items-center justify-center mr-2">
            <img
              src={teamLogos[prediction.homeTeam]}
              alt={prediction.homeTeam}
              className="w-4 h-4 object-contain"
            />
          </div>
          <span className="text-white font-medium text-sm">
            {prediction.homeTeam} {prediction.homeScore} -{" "}
            {prediction.awayScore} {prediction.awayTeam}
          </span>
        </div>
      </div>

      <div className="p-4">
        <table className="w-full text-xs">
          <thead>
            <tr className="text-white/50 border-b border-primary-600/30">
              <th className="text-left pb-2">Component</th>
              <th className="text-right pb-2">Points</th>
            </tr>
          </thead>
          <tbody>
            {breakdown.map((item, idx) => (
              <tr
                key={idx}
                className="border-b border-primary-600/10 last:border-0"
              >
                <td
                  className={`py-2 ${
                    item.type === "bonus"
                      ? "text-teal-300"
                      : item.type === "multiplier"
                      ? "text-indigo-300"
                      : "text-white/80"
                  }`}
                >
                  {item.label}
                  {item.type === "multiplier" && (
                    <span className="text-white/50 ml-1">
                      (applies to all points above)
                    </span>
                  )}
                </td>
                <td
                  className={`py-2 text-right ${
                    item.type === "bonus"
                      ? "text-teal-300"
                      : item.type === "multiplier"
                      ? "text-indigo-300"
                      : "text-white/80"
                  }`}
                >
                  {item.type === "multiplier"
                    ? `+${item.value}`
                    : item.value}
                </td>
              </tr>
            ))}
            <tr className="bg-primary-700/30">
              <td className="py-2 text-white font-medium">
                Total Potential
              </td>
              <td className="py-2 text-right text-white font-medium">
                {points.finalPoints}
              </td>
            </tr>
          </tbody>
        </table>

        <div className="mt-3 pt-3 border-t border-primary-600/30">
          <div className="text-xs text-white/50">
            Predicted Goalscorers:
          </div>
          <div className="text-white/80 text-xs mt-1">
            {[
              ...prediction.homeScorers,
              ...prediction.awayScorers,
            ].join(", ") || "None predicted"}
          </div>
        </div>
      </div>
    </>
  );
};

export default PotentialPointsSummary;