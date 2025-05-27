import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ChevronDownIcon, 
  TargetIcon, 
  LightningBoltIcon,
  InfoCircledIcon,
  CalendarIcon,
  StarIcon,
  RocketIcon
} from "@radix-ui/react-icons";
import { calculatePredictionPoints } from "../../utils/chipUtils";

const PotentialPointsSummary = ({ predictions, teamLogos }) => {
  const [showDetailedPointsBreakdown, setShowDetailedPointsBreakdown] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(true);
  return (
    <motion.div 
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="backdrop-blur-xl rounded-xl border border-slate-700/50 mb-5 overflow-hidden font-outfit bg-slate-900/60"
    >
      {/* Status indicator bar */}
      <div className="h-0.5 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
      
      <div className="bg-slate-800/50 px-5 py-3 border-b border-slate-700/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center">
              <TargetIcon className="w-4 h-4 text-blue-400" />
            </div>
            <div>
              <h3 className="text-slate-100 text-base font-semibold">
                Potential Points Summary
              </h3>
              <p className="text-slate-400 text-sm">
                Total points you could earn from your pending predictions
              </p>
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 rounded-lg bg-slate-700/50 hover:bg-slate-700/70 text-slate-300 hover:text-slate-200 transition-all duration-200 border border-slate-600/50 hover:border-slate-500/50"
          >
            <ChevronDownIcon
              className={`w-4 h-4 transition-transform duration-200 ${
                isCollapsed ? "rotate-180" : ""
              }`}
            />
          </motion.button>
        </div>      </div>
      
      {/* Collapsible Content */}
      <AnimatePresence>
        {!isCollapsed && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <div className="p-4">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {/* Base potential */}
                <motion.div 
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                  className="bg-slate-800/60 rounded-lg p-4 flex flex-col items-center border border-slate-700/50"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-6 h-6 rounded-md bg-slate-600/50 flex items-center justify-center">
                      <CalendarIcon className="w-3 h-3 text-slate-300" />
                    </div>
                    <div className="text-slate-400 text-sm font-medium">Base Potential</div>
                  </div>
                  <div className="text-3xl font-bold text-slate-100 font-dmSerif mb-2">
                    {predictions.reduce((total, prediction) => {
                      const outcomePoints = 5;
                      const exactScorePoints = 10;
                      const baseGoalScorerPoints =
                        (prediction.homeScore + prediction.awayScore) * 2;
                      const basePoints =
                        outcomePoints + exactScorePoints + baseGoalScorerPoints;
                      return total + basePoints;
                    }, 0)}
                  </div>
                  <div className="text-slate-500 text-sm text-center">
                    Without chips applied
                  </div>
                </motion.div>

                {/* Maximum potential */}
                <motion.div 
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                  className="bg-gradient-to-br from-blue-900/40 via-purple-900/40 to-pink-900/40 rounded-lg p-4 flex flex-col items-center relative overflow-hidden border border-blue-500/30"
                >
                  <div className="absolute top-0 right-0 w-26 h-26 bg-blue-500/10 rounded-full -translate-x-13 -translate-y-13"></div>
                  <div className="absolute bottom-0 left-0 w-19 h-19 bg-purple-500/10 rounded-full -translate-x-9 translate-y-9"></div>
                  
                  <div className="flex items-center gap-2 mb-2 relative z-10">
                    <div className="w-6 h-6 rounded-md bg-blue-500/30 flex items-center justify-center">
                      <RocketIcon className="w-3 h-3 text-blue-300" />
                    </div>
                    <div className="text-blue-300 text-sm font-medium">Maximum Potential</div>
                  </div>
                  <div className="text-3xl font-bold text-white font-dmSerif mb-2 relative z-10">
                    {predictions.reduce((total, prediction) => {
                      const points = calculatePredictionPoints(prediction);
                      return total + points.finalPoints;
                    }, 0)}
                  </div>
                  <div className="text-blue-200/80 text-sm text-center relative z-10">
                    With all chips applied
                  </div>
                </motion.div>                {/* Match breakdown */}
                <motion.div 
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                  className="bg-slate-800/60 rounded-lg p-4 border border-slate-700/50"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-6 h-6 rounded-md bg-slate-600/50 flex items-center justify-center">
                      <InfoCircledIcon className="w-3 h-3 text-slate-300" />
                    </div>
                    <div className="text-slate-400 text-sm font-medium">Match Breakdown</div>
                  </div>
                  <div className="space-y-2 max-h-32 overflow-y-auto pr-2 custom-scrollbar">
                    {predictions.map((prediction) => {
                      const points = calculatePredictionPoints(prediction);
                      
                      return (
                        <div
                          key={prediction.id}
                          className="flex justify-between items-center p-2 bg-slate-700/30 rounded-md border border-slate-600/30"
                        >
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-md bg-slate-600/50 flex items-center justify-center">
                              <img
                                src={teamLogos[prediction.homeTeam]}
                                alt={prediction.homeTeam}
                                className="w-4 h-4 object-contain"
                              />
                            </div>
                            <span className="text-slate-200 text-sm font-medium">
                              {prediction.homeTeam} vs {prediction.awayTeam}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <span className="text-slate-400">
                              {points.pointsBeforeMultiplier}
                            </span>
                            <span className="text-slate-500">→</span>
                            <span className="text-blue-300 font-semibold">
                              {points.finalPoints}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="mt-3 pt-3 border-t border-slate-600/50">
                    <div className="flex items-center justify-between p-2 bg-slate-700/30 rounded-md">
                      <span className="text-slate-300 text-sm font-medium">
                        Total Fixtures
                      </span>
                      <span className="text-slate-100 text-base font-semibold">
                        {predictions.length}
                      </span>
                    </div>
                  </div>
                </motion.div>
              </div>              <motion.div 
                whileHover={{ scale: 1.01 }}
                transition={{ duration: 0.2 }}
                className="mt-4 bg-slate-800/60 rounded-lg p-3 border border-slate-700/50"
              >
                <div className="flex items-start gap-2">
                  <div className="w-7 h-7 rounded-lg bg-blue-500/20 flex items-center justify-center mt-0.5">
                    <LightningBoltIcon className="w-4 h-4 text-blue-400" />
                  </div>
                  <div>
                    <h4 className="text-blue-300 text-sm font-semibold mb-1">
                      How points are calculated
                    </h4>
                    <p className="text-slate-400 text-sm leading-relaxed">
                      Base points: 5 for correct outcome, 10 for exact score, 2
                      per correct goalscorer. Chips can multiply points or add
                      bonuses.
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Toggle button for detailed view */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() =>
                  setShowDetailedPointsBreakdown(!showDetailedPointsBreakdown)
                }
                className="mt-4 bg-slate-700/50 hover:bg-slate-700/70 text-slate-300 hover:text-slate-200 px-4 py-2 rounded-lg text-sm font-medium flex items-center mx-auto transition-all duration-200 border border-slate-600/50 hover:border-slate-500/50"
              >
                
                {showDetailedPointsBreakdown
                  ? "Hide detailed breakdown"
                  : "View detailed breakdown"}
                <ChevronDownIcon
                  className={`ml-2 w-3 h-3 transition-transform duration-200 ${
                    showDetailedPointsBreakdown ? "rotate-180" : ""
                  }`}
                />              </motion.button>

              {/* Detailed breakdown section */}
              <AnimatePresence>
                {showDetailedPointsBreakdown && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="mt-4 pt-4 border-t border-slate-700/50"
                  >
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-6 h-6 rounded-lg bg-purple-500/20 flex items-center justify-center">
                        <TargetIcon className="w-3 h-3 text-purple-400" />
                      </div>
                      <h4 className="text-slate-100 text-sm font-semibold">
                        Detailed Points Calculation
                      </h4>
                    </div>
                    <div className="space-y-4 font-outfit">
                      {predictions.map((prediction) => {
                        const points = calculatePredictionPoints(prediction);
                        
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
                          <motion.div
                            key={prediction.id}
                            initial={{ opacity: 0, y: 13 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: 0.1 }}
                            className="bg-slate-800/60 rounded-lg overflow-hidden border border-slate-700/50"
                          >
                            <DetailedBreakdown 
                              prediction={prediction} 
                              breakdown={breakdown} 
                              points={points}
                              teamLogos={teamLogos}
                            />
                          </motion.div>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const DetailedBreakdown = ({ prediction, breakdown, points, teamLogos }) => {
  
  return (
    <>
      <div className="bg-slate-700/50 px-4 py-3 flex items-center justify-between border-b border-slate-600/50">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-slate-600/50 flex items-center justify-center">
            <img
              src={teamLogos[prediction.homeTeam]}
              alt={prediction.homeTeam}
              className="w-4 h-4 object-contain"
            />
          </div>
          <span className="text-slate-100 font-semibold text-sm">
            {prediction.homeTeam} {prediction.homeScore} -{" "}
            {prediction.awayScore} {prediction.awayTeam}
          </span>
        </div>
      </div>

      <div className="p-4">
        <div className="overflow-hidden rounded-lg border border-slate-600/50">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-slate-700/50 text-slate-300 border-b border-slate-600/50">
                <th className="text-left py-2 px-3 font-medium">Component</th>
                <th className="text-right py-2 px-3 font-medium">Points</th>
              </tr>
            </thead>
            <tbody>
              {breakdown.map((item, idx) => (
                <tr
                  key={idx}
                  className="border-b border-slate-600/30 last:border-0 hover:bg-slate-700/30 transition-colors"
                >
                  <td
                    className={`py-2 px-3 ${
                      item.type === "bonus"
                        ? "text-blue-300"
                        : item.type === "multiplier"
                        ? "text-purple-300"
                        : "text-slate-200"
                    }`}
                  >
                    <div className="flex items-center gap-1.5">
                      {item.type === "bonus" && <StarIcon className="w-3 h-3" />}
                      {item.type === "multiplier" && <RocketIcon className="w-3 h-3" />}
                      <span>{item.label}</span>
                    </div>
                    {item.type === "multiplier" && (
                      <div className="text-slate-400 text-xs mt-0.5 ml-4">
                        Applies to all points above
                      </div>
                    )}
                  </td>
                  <td
                    className={`py-2 px-3 text-right font-medium ${
                      item.type === "bonus"
                        ? "text-blue-300"
                        : item.type === "multiplier"
                        ? "text-purple-300"
                        : "text-slate-200"
                    }`}
                  >
                    {item.type === "multiplier"
                      ? `+${item.value}`
                      : item.value}
                  </td>
                </tr>
              ))}
              <tr className="bg-slate-700/50 border-t-2 border-slate-500/50">
                <td className="py-3 px-3 text-slate-100 font-semibold text-sm">
                  Total Potential
                </td>
                <td className="py-3 px-3 text-right text-slate-100 font-bold text-sm">
                  {points.finalPoints}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="mt-4 p-3 bg-slate-700/30 rounded-lg border border-slate-600/50">
          <div className="flex items-center gap-1.5 mb-1.5">
            <TargetIcon className="w-3 h-3 text-slate-400" />
            <div className="text-xs font-medium text-slate-300">
              Predicted Goalscorers:
            </div>
          </div>
          <div className="text-slate-200 text-xs">
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