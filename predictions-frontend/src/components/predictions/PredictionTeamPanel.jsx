import React, { useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PlusIcon, MinusIcon } from "@radix-ui/react-icons";
import { getTeamPredictionStats } from "../../utils/predictionUtils";
import SimplePredictionCard from "./SimplePredictionCard";
import { normalizeTeamName, getTeamLogo } from "../../utils/teamUtils";
import { getLogoUrl } from "../../utils/logoCache";
import { teamLogos } from "../../data/sampleData";
import { ThemeContext } from "../../context/ThemeContext";

const PredictionTeamPanel = ({
  team,
  predictions,
  isExpanded,
  onToggle,
  onPredictionSelect,
  onPredictionEdit,
}) => {
  const { theme } = useContext(ThemeContext);
  const stats = getTeamPredictionStats(predictions);

  // Handle team logo with better caching and fallbacks
  const getTeamLogoSrc = (teamName) => {
    // Use the getLogoUrl helper first to try all variants with context logos
    if (teamLogos) {
      const logoUrl = getLogoUrl(teamName, teamLogos, normalizeTeamName);

      // If we got a non-placeholder logo, use it
      if (!logoUrl.includes("placeholder")) {
        return logoUrl;
      }
    }

    // Fall back to the utility function which uses local assets
    const logo = getTeamLogo(teamName);

    // Debug logging
    if (logo.includes("placeholder")) {
      console.log(
        `No logo found for ${teamName} in either context or local assets`
      );
      if (teamLogos) {
        console.log(
          "Available logo team names:",
          Object.keys(teamLogos).sort().join(", ")
        );
      }
    }

    return logo;
  };

  return (
    <div
      className={`rounded-lg border overflow-hidden ${
        theme === "dark"
          ? "bg-slate-800/50 border-slate-600/50"
          : "bg-white border-gray-200 shadow-sm"
      }`}
    >
      {/* Team header - clickable */}
      <div
        className={`flex items-center justify-between p-3 cursor-pointer transition-colors ${
          theme === "dark" ? "bg-slate-900/60" : "hover:bg-gray-50"
        }`}
        onClick={() => onToggle(team)}
      >
        <div className="flex items-center">
          <img
            src={getTeamLogoSrc(team)}
            alt={team}
            className="w-8 h-8 object-contain mr-3"
          />
          <div>
            <h3
              className={`font-medium ${
                theme === "dark" ? "text-white" : "text-gray-900"
              }`}
            >
              {team}
            </h3>
            <div
              className={`text-xs ${
                theme === "dark" ? "text-white/60" : "text-gray-500"
              }`}
            >
              {predictions.length} prediction
              {predictions.length !== 1 ? "s" : ""}
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          {/* Accuracy Progress Bar */}
          <div
            className={`w-20 rounded-full h-1.5 overflow-hidden ${
              theme === "dark" ? "bg-slate-800/60" : "bg-gray-200"
            }`}
          >
            <div
              className="bg-emerald-500 h-full transition-all duration-300"
              style={{ width: `${stats.accuracy}%` }}
            ></div>
          </div>
          
          {/* Stats Display */}
          <div className="flex flex-col items-end">
            <div
              className={`text-xs font-medium ${
                theme === "dark" ? "text-white/90" : "text-gray-800"
              }`}
            >
              {stats.accuracy}% accuracy
            </div>
            <div
              className={`text-xs ${
                theme === "dark" ? "text-white/60" : "text-gray-500"
              }`}
            >
              {stats.correct}/{stats.correct + stats.incorrect} correct
            </div>
          </div>
          
          {/* Expand/Collapse Icon */}
          {isExpanded ? (
            <MinusIcon
              className={`w-4 h-4 ${theme === "dark" ? "text-white/60" : "text-gray-400"}`}
            />
          ) : (
            <PlusIcon
              className={`w-4 h-4 ${theme === "dark" ? "text-white/60" : "text-gray-400"}`}
            />
          )}
        </div>
      </div>

      {/* Team predictions - collapsible */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className={`border-t overflow-hidden ${
              theme === "dark" ? "border-slate-600/50 bg-slate-900/60" : "border-gray-200"
            }`}
          >
            <div className="p-4">
              {/* Team Stats Overview */}
              <div className={`mb-4 p-3 rounded-lg ${
                theme === "dark" ? "bg-slate-800/60" : "bg-gray-50"
              }`}>
                <div className="flex items-center justify-between mb-2">
                  <h4 className={`text-sm font-medium ${
                    theme === "dark" ? "text-white" : "text-gray-900"
                  }`}>
                    Team Performance
                  </h4>
                </div>
                <div className="grid grid-cols-4 gap-4 text-center">
                  <div>
                    <div className={`text-lg font-bold ${
                      theme === "dark" ? "text-emerald-400" : "text-emerald-600"
                    }`}>
                      {stats.correct}
                    </div>
                    <div className={`text-xs ${
                      theme === "dark" ? "text-white/60" : "text-gray-500"
                    }`}>
                      Correct
                    </div>
                  </div>
                  <div>
                    <div className={`text-lg font-bold ${
                      theme === "dark" ? "text-red-400" : "text-red-600"
                    }`}>
                      {stats.incorrect}
                    </div>
                    <div className={`text-xs ${
                      theme === "dark" ? "text-white/60" : "text-gray-500"
                    }`}>
                      Incorrect
                    </div>
                  </div>
                  <div>
                    <div className={`text-lg font-bold ${
                      theme === "dark" ? "text-amber-400" : "text-amber-600"
                    }`}>
                      {stats.pending}
                    </div>
                    <div className={`text-xs ${
                      theme === "dark" ? "text-white/60" : "text-gray-500"
                    }`}>
                      Pending
                    </div>
                  </div>
                  <div>
                    <div className={`text-lg font-bold ${
                      theme === "dark" ? "text-blue-400" : "text-blue-600"
                    }`}>
                      {stats.completionRate}%
                    </div>
                    <div className={`text-xs ${
                      theme === "dark" ? "text-white/60" : "text-gray-500"
                    }`}>
                      Complete
                    </div>
                  </div>
                </div>
              </div>

              {/* Predictions Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {predictions.map((prediction) => (
                  <SimplePredictionCard
                    key={prediction.id}
                    prediction={prediction}
                    onSelect={onPredictionSelect}
                    onEdit={onPredictionEdit}
                    teamLogos={teamLogos}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PredictionTeamPanel;
