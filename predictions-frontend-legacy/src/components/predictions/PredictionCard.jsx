import React, { useState, useContext } from "react";
import { motion } from "framer-motion";
import { format, parseISO, addMinutes } from "date-fns";
import {
  ChevronDownIcon,
  ChevronUpIcon,
  PersonIcon,
  ExclamationTriangleIcon,
} from "@radix-ui/react-icons";
import { ThemeContext } from "../../context/ThemeContext";
import TeamLogo from "../ui/TeamLogo";
import { LOGO_SIZES } from "../../utils/teamLogos";

const PredictionCard = ({
  prediction,
  mode = "personal", // "personal" | "league"
  showMemberInfo = false, // for league views except byMembers
  onSelect,
  onEdit, // only for personal mode
  isReadonly = false, // league views
  size = "normal", // "normal" | "compact"
}) => {
  const { theme } = useContext(ThemeContext);
  const [showGoalscorers, setShowGoalscorers] = useState(false);
  const [showChips, setShowChips] = useState(false);

  // Check if deadline has passed
  const isPastDeadline = () => {
    if (!prediction.matchDate && !prediction.date) return false;
    
    try {
      let dateString = prediction.matchDate || prediction.date;
      // Fix for backend sending date without timezone
      if (!dateString.endsWith('Z') && !dateString.match(/[+-]\d{2}:\d{2}$/)) {
        dateString = dateString + 'Z';
      }
      const matchDate = parseISO(dateString);
      const deadline = addMinutes(matchDate, -30);
      return new Date() > deadline;
    } catch (error) {
      console.error('Error checking deadline:', error);
      return false;
    }
  };

  const deadlinePassed = isPastDeadline();

  // Determine if card should be interactive
  const isPersonalMode = mode === "personal";
  const canEdit = isPersonalMode && typeof onEdit === "function" && !isReadonly && !deadlinePassed;
  const isCompact = size === "compact";  // Helper function to count goals per scorer
  const getGoalCounts = (scorers) => {
    if (!scorers || scorers.length === 0) return {};
    return scorers.reduce((counts, scorer) => {
      counts[scorer] = (counts[scorer] || 0) + 1;
      return counts;
    }, {});
  };

  // Format points display
  const formatPoints = (points) => {
    if (points !== null && points !== undefined) {
      return points;
    }
    return "—";
  };

  const handleCardClick = () => {
    try {
      if (onSelect && typeof onSelect === "function" && !isReadonly) {
        onSelect(prediction);
      }
    } catch (error) {
      console.error("Error in handleCardClick:", error);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-lg border transition-all ${
        !isReadonly && typeof onSelect === "function" ? "cursor-pointer" : ""
      } ${
        theme === "dark"
          ? `bg-slate-800 border-slate-600/30 ${
              !isReadonly && typeof onSelect === "function"
                ? "hover:bg-slate-700/90"
                : ""
            }`
          : `bg-slate-50 border-slate-200 ${
              !isReadonly && typeof onSelect === "function"
                ? "hover:bg-slate-100"
                : ""
            }`
      } ${isCompact ? "p-4" : "p-6"}`}
      onClick={handleCardClick}
    >
      {/* Member Header - only for league views with showMemberInfo */}
      {mode === "league" && showMemberInfo && (
        <div className="flex items-center gap-2 mb-3 pb-3 border-b border-slate-600/30">
          <div
            className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
              theme === "dark"
                ? "bg-purple-900/30 text-purple-300"
                : "bg-purple-100 text-purple-700"
            }`}
          >
            {prediction.userDisplayName?.charAt(0).toUpperCase() || "?"}
          </div>
          <span
            className={`text-sm font-medium ${
              theme === "dark" ? "text-slate-300" : "text-slate-700"
            }`}
          >
            {prediction.userDisplayName}
          </span>
        </div>
      )}

      {/* Match Info Section */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex-1 min-w-0">
          <p
            className={`font-semibold ${
              theme === "dark" ? "text-white" : "text-slate-900"
            } font-outfit ${isCompact ? "text-sm" : "text-base"} truncate`}
          >
            {prediction.homeTeam} vs {prediction.awayTeam}
          </p>
          <p
            className={`text-xs ${
              theme === "dark" ? "text-slate-500" : "text-slate-500"
            } font-outfit mt-1`}
          >
            GW{prediction.gameweek} •{" "}
            {format(parseISO(prediction.date), "MMM dd, HH:mm")}
          </p>
        </div>

        {/* Points Display */}
        <div className="text-right ml-3">
          {prediction.status === "pending" ? (
            <div
              className={`${
                isCompact ? "text-lg" : "text-xl"
              } font-bold font-outfit ${
                theme === "dark" ? "text-slate-400" : "text-slate-600"
              }`}
            >
              —
            </div>
          ) : prediction.points !== null && prediction.points !== undefined ? (
            <div className="flex items-baseline gap-1">
              <span
                className={`${isCompact ? "text-lg" : "text-xl"} font-bold ${
                  theme === "dark" ? "text-teal-400" : "text-teal-600"
                }`}
              >
                {formatPoints(prediction.points)}
              </span>
              <span
                className={`text-xs font-medium ${
                  theme === "dark" ? "text-teal-500" : "text-teal-500"
                }`}
              >
                pts
              </span>
            </div>
          ) : (
            <div
              className={`${
                isCompact ? "text-lg" : "text-xl"
              } font-bold font-outfit ${
                theme === "dark" ? "text-slate-400" : "text-slate-600"
              }`}
            >
              —
            </div>
          )}
          <div
            className={`text-xs font-medium font-outfit ${
              prediction.status === "pending"
                ? theme === "dark"
                  ? "text-amber-400"
                  : "text-amber-600"
                : theme === "dark"
                ? "text-green-400"
                : "text-green-600"
            }`}
          >
            {prediction.status === "pending" ? "Pending" : "Complete"}
          </div>
        </div>
      </div>

      {/* Score Prediction */}
      <div
        className={`${isCompact ? "p-3" : "p-4"} rounded-lg mb-4 ${
          theme === "dark"
            ? "bg-slate-800/50 border-slate-600/30"
            : "bg-white border-slate-200"
        } border`}
      >
        <div className="flex items-center justify-center space-x-4">
          <div className="text-center flex-1">
            <div
              className={`${isCompact ? "text-xl" : "text-2xl"} font-bold ${
                theme === "dark" ? "text-white" : "text-slate-900"
              } font-outfit`}
            >
              {prediction.homeScore}
            </div>
            <div
              className={`text-xs ${
                theme === "dark" ? "text-slate-500" : "text-slate-500"
              } font-outfit mt-1 truncate`}
            >
              {prediction.homeTeam}
            </div>
          </div>

          <div
            className={`text-lg font-bold ${
              theme === "dark" ? "text-slate-400" : "text-slate-600"
            } font-outfit`}
          >
            —
          </div>

          <div className="text-center flex-1">
            <div
              className={`${isCompact ? "text-xl" : "text-2xl"} font-bold ${
                theme === "dark" ? "text-white" : "text-slate-900"
              } font-outfit`}
            >
              {prediction.awayScore}
            </div>
            <div
              className={`text-xs ${
                theme === "dark" ? "text-slate-500" : "text-slate-500"
              } font-outfit mt-1 truncate`}
            >
              {prediction.awayTeam}
            </div>
          </div>
        </div>
      </div>

      {/* Goalscorers Section */}
      {prediction.homeScorers?.length > 0 ||
      prediction.awayScorers?.length > 0 ? (
        <div className="mb-4">
          {!isCompact ? (
            // Normal size - show goalscorers directly
            <div className="space-y-3">
              {prediction.homeScorers?.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <TeamLogo
                      teamName={prediction.homeTeam}
                      size={LOGO_SIZES.xs}
                      className="flex-shrink-0"
                    />
                    <div
                      className={`text-xs font-medium ${
                        theme === "dark" ? "text-slate-500" : "text-slate-500"
                      } font-outfit`}
                    >
                      {prediction.homeTeam}
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(getGoalCounts(prediction.homeScorers)).map(
                      ([scorer, count]) => (
                        <div
                          key={scorer}
                          className={`relative px-3 py-1.5 rounded-full text-xs font-medium font-outfit ${
                            theme === "dark"
                              ? "bg-blue-900/30 text-blue-400 border border-blue-800/50"
                              : "bg-blue-100 text-blue-700 border border-blue-200"
                          }`}
                        >
                          {scorer}
                          {count > 1 && (
                            <span
                              className={`absolute -top-1 -right-1 w-4 h-4 text-xs rounded-full flex items-center justify-center font-bold ${
                                theme === "dark"
                                  ? "bg-blue-600 text-white"
                                  : "bg-blue-600 text-white"
                              }`}
                            >
                              {count}
                            </span>
                          )}
                        </div>
                      )
                    )}
                  </div>
                </div>
              )}

              {prediction.awayScorers?.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <TeamLogo
                      teamName={prediction.awayTeam}
                      size={LOGO_SIZES.xs}
                      className="flex-shrink-0"
                    />
                    <div
                      className={`text-xs font-medium ${
                        theme === "dark" ? "text-slate-500" : "text-slate-500"
                      } font-outfit`}
                    >
                      {prediction.awayTeam}
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(getGoalCounts(prediction.awayScorers)).map(
                      ([scorer, count]) => (
                        <div
                          key={scorer}
                          className={`relative px-3 py-1.5 rounded-full text-xs font-medium font-outfit ${
                            theme === "dark"
                              ? "bg-red-900/30 text-red-400 border border-red-800/50"
                              : "bg-red-100 text-red-700 border border-red-200"
                          }`}
                        >
                          {scorer}
                          {count > 1 && (
                            <span
                              className={`absolute -top-1 -right-1 w-4 h-4 text-xs rounded-full flex items-center justify-center font-bold ${
                                theme === "dark"
                                  ? "bg-red-600 text-white"
                                  : "bg-red-600 text-white"
                              }`}
                            >
                              {count}
                            </span>
                          )}
                        </div>
                      )
                    )}
                  </div>
                </div>
              )}
            </div>
          ) : (
            // Compact size - collapsible goalscorers
            <div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowGoalscorers(!showGoalscorers);
                }}
                className={`flex items-center gap-2 text-xs font-medium mb-2 ${
                  theme === "dark"
                    ? "text-slate-400 hover:text-slate-300"
                    : "text-slate-600 hover:text-slate-700"
                } transition-colors`}
              >
                {showGoalscorers ? (
                  <ChevronUpIcon className="w-3 h-3" />
                ) : (
                  <ChevronDownIcon className="w-3 h-3" />
                )}
                Show Goalscorers
              </button>
              {showGoalscorers && (
                <div className="space-y-2 pl-4">
                  {prediction.homeScorers?.length > 0 && (
                    <div className="text-xs">
                      <span
                        className={`font-medium ${
                          theme === "dark" ? "text-slate-400" : "text-slate-600"
                        }`}
                      >
                        {prediction.homeTeam}:
                      </span>
                      <span
                        className={`ml-1 ${
                          theme === "dark" ? "text-slate-300" : "text-slate-700"
                        }`}
                      >
                        {prediction.homeScorers.join(", ")}
                      </span>
                    </div>
                  )}
                  {prediction.awayScorers?.length > 0 && (
                    <div className="text-xs">
                      <span
                        className={`font-medium ${
                          theme === "dark" ? "text-slate-400" : "text-slate-600"
                        }`}
                      >
                        {prediction.awayTeam}:
                      </span>
                      <span
                        className={`ml-1 ${
                          theme === "dark" ? "text-slate-300" : "text-slate-700"
                        }`}
                      >
                        {prediction.awayScorers.join(", ")}
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      ) : null}

      {/* Chips Section */}
      {prediction.chips?.length > 0 && (
        <div
          className={`border-t pt-3 ${
            theme === "dark" ? "border-slate-700/50" : "border-slate-200"
          }`}
        >
          {!isCompact ? (
            // Normal size - show chips directly
            <>
              <p
                className={`text-xs ${
                  theme === "dark" ? "text-slate-500" : "text-slate-500"
                } mb-2 font-outfit`}
              >
                Chips Used:
              </p>
              <div className="flex flex-wrap gap-1">
                {prediction.chips.map((chip, chipIndex) => (
                  <span
                    key={chipIndex}
                    className={`px-2 py-1 text-xs rounded-full font-medium font-outfit ${
                      theme === "dark"
                        ? "bg-teal-900/30 text-teal-400"
                        : "bg-teal-100 text-teal-700"
                    }`}
                  >
                    {chip.replace("_", " ")}
                  </span>
                ))}
              </div>
            </>
          ) : (
            // Compact size - collapsible chips
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowChips(!showChips);
                }}
                className={`flex items-center gap-2 text-xs font-medium mb-2 ${
                  theme === "dark"
                    ? "text-slate-400 hover:text-slate-300"
                    : "text-slate-600 hover:text-slate-700"
                } transition-colors`}
              >
                {showChips ? (
                  <ChevronUpIcon className="w-3 h-3" />
                ) : (
                  <ChevronDownIcon className="w-3 h-3" />
                )}
                Show Chips ({prediction.chips.length})
              </button>
              {showChips && (
                <div className="pl-4">
                  <div className="text-xs">
                    <span
                      className={`${
                        theme === "dark" ? "text-slate-300" : "text-slate-700"
                      }`}
                    >
                      {prediction.chips
                        .map((chip) => chip.replace("_", " "))
                        .join(", ")}
                    </span>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </motion.div>
  );
};

export default PredictionCard;
