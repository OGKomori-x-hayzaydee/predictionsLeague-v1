import React, { useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PlusIcon, MinusIcon } from "@radix-ui/react-icons";
import { getTeamPredictionStats } from "../../utils/predictionUtils";
import { normalizeTeamName } from "../../utils/teamUtils";
import { ThemeContext } from "../../context/ThemeContext";
import TeamLogo from "../ui/TeamLogo";
import { LOGO_SIZES } from "../../utils/teamLogos";
import PredictionCard from "./PredictionCard";

const PredictionTeamPanel = ({
  team,
  predictions,
  isExpanded,
  onToggle,
  onPredictionSelect,
  onPredictionEdit,
  cardStyle = "normal"
}) => {
  const { theme } = useContext(ThemeContext);
  const stats = getTeamPredictionStats(predictions);

  // Team logos now handled by TeamLogo component - no custom function needed
  const normalizedTeamName = normalizeTeamName(team);

  return (
    <div
      className={`rounded-lg border overflow-hidden ${
        theme === "dark"
          ? "bg-slate-800/50 border-slate-600/50"
          : "bg-white border-gray-200 shadow-sm"
      }`}
    >
      {/* Team Header */}
      <div
        className={`flex items-center justify-between p-2 sm:p-3 cursor-pointer transition-colors ${
          theme === "dark" ? "bg-slate-900/60 hover:bg-slate-700/30" : "hover:bg-gray-50"
        }`}
        onClick={() => onToggle && onToggle(team)}
      >
        <div className="flex items-center gap-2 sm:gap-3">
          <TeamLogo 
            teamName={team} 
            size={LOGO_SIZES.sm}
            className="w-6 h-6 sm:w-8 sm:h-8 flex-shrink-0"
          />
          <div className="min-w-0">
            <h3 className={`font-medium text-xs sm:text-sm ${
              theme === "dark" ? "text-white" : "text-gray-900"
            }`}>
              {team}
            </h3>
            <div className={`text-2xs sm:text-xs ${
              theme === "dark" ? "text-white/70" : "text-gray-600"
            }`}>
              {stats.total} prediction{stats.total !== 1 ? 's' : ''}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
          {/* Progress Bar */}
          <div className={`w-12 sm:w-20 rounded-full h-1 sm:h-1.5 overflow-hidden ${
            theme === "dark" ? "bg-slate-700/60" : "bg-gray-200"
          }`}>
            <div
              className="bg-teal-500 h-full transition-all duration-300"
              style={{ width: `${stats.total > 0 ? (stats.completed / stats.total) * 100 : 0}%` }}
            ></div>
          </div>
          
          {/* Stats Display */}
          <div className="text-right">
            <div className="flex items-baseline gap-0.5 sm:gap-1">
              <span className={`text-sm sm:text-lg font-bold ${
                theme === "dark" ? "text-teal-400" : "text-teal-600"
              }`}>
                {stats.totalPoints}
              </span>
              <span className={`text-2xs sm:text-sm font-medium ${
                theme === "dark" ? "text-teal-500" : "text-teal-500"
              }`}>
                pts
              </span>
            </div>
            <div className={`text-2xs sm:text-xs ${
              theme === "dark" ? "text-white/60" : "text-gray-500"
            }`}>
              {stats.completed}/{stats.total} complete
            </div>
          </div>
          
          {/* Expand/Collapse Icon */}
          {isExpanded ? (
            <MinusIcon className={`w-3 h-3 sm:w-4 sm:h-4 ${theme === "dark" ? "text-white/60" : "text-gray-400"}`} />
          ) : (
            <PlusIcon className={`w-3 h-3 sm:w-4 sm:h-4 ${theme === "dark" ? "text-white/60" : "text-gray-400"}`} />
          )}
        </div>
      </div>

      {/* Team Predictions - Expanded */}
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
              {/* Predictions Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {predictions.map((prediction) => (
                  <PredictionCard
                    key={prediction.id}
                    prediction={prediction}
                    mode="personal"
                    onSelect={onPredictionSelect}
                    onEdit={onPredictionEdit}
                    isReadonly={false}
                    size={cardStyle}
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

