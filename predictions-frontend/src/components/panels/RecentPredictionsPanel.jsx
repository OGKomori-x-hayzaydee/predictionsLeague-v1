import React, { useContext } from "react";
import { motion } from "framer-motion";
import {
  BarChartIcon,
  CheckIcon,
  Cross2Icon,
  ClockIcon,
  ChevronRightIcon,
  MagicWandIcon,
  StackIcon
} from "@radix-ui/react-icons";
import { ThemeContext } from "../../context/ThemeContext";

// Helper function to format time ago
const formatTimeAgo = (dateString) => {
  if (!dateString) return 'Unknown';
  
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

const RecentPredictionsPanel = ({ predictions, onViewAll }) => {
  const { theme } = useContext(ThemeContext);

  return (
    <div
      className={`${
        theme === "dark"
          ? "bg-slate-800/40 border-slate-700/50 hover:border-slate-600/50"
          : "bg-white border-slate-200 shadow-sm hover:border-slate-300"
      } backdrop-blur-sm rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-5 border transition-all duration-200`}
    >
      {" "}
      <div className="flex justify-between items-center mb-2 sm:mb-3 md:mb-5">
        <div className="flex items-center gap-1.5 sm:gap-2">
          <div
            className={`p-1 sm:p-1.5 rounded-lg border ${
              theme === "dark"
                ? "bg-indigo-500/10 border-indigo-500/20"
                : "bg-indigo-50 border-indigo-200"
            }`}
          >
            <StackIcon
              className={`w-3 h-3 sm:w-4 sm:h-4 ${
                theme === "dark" ? "text-indigo-400" : "text-indigo-600"
              }`}
            />
          </div>
          <div>
            <h3
              className={`${
                theme === "dark" ? "text-teal-200" : "text-teal-700"
              } font-outfit font-semibold text-sm sm:text-base`}
            >
              Recent Predictions
            </h3>
            <p
              className={`${
                theme === "dark" ? "text-slate-400" : "text-slate-500"
              } text-2xs sm:text-xs font-outfit hidden sm:block`}
            >
              Your latest prediction results
            </p>
          </div>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onViewAll}
          className={`flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1 sm:py-1.5 border rounded text-2xs sm:text-xs transition-all duration-200 ${
            theme === "dark"
              ? "bg-slate-700/50 hover:bg-slate-700/70 border-slate-600/30 text-slate-300 hover:text-white"
              : "bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-600 hover:text-slate-800"
          }`}
        >
          <span className="hidden sm:inline">View all</span>
          <span className="sm:hidden">All</span>
          <ChevronRightIcon className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
        </motion.button>
      </div>
      <div className="space-y-1.5 sm:space-y-2">
        {predictions.map((prediction, index) => {
          const isCorrect = prediction.correct;
          const points = prediction.points || 0;
          const isPending = prediction.status === 'PENDING' || prediction.status === 'pending';
          const matchDisplay = `${prediction.homeTeam} vs ${prediction.awayTeam}`;

          return (
            <motion.div
              key={prediction.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`group relative rounded p-2 sm:p-3 border transition-all duration-200 ${
                theme === "dark"
                  ? "bg-slate-700/20 hover:bg-slate-700/40 border-slate-600/20 hover:border-slate-500/40"
                  : "bg-slate-50/50 hover:bg-slate-100/50 border-slate-200/50 hover:border-slate-300/50"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-1.5 sm:gap-2 mb-1 sm:mb-1.5">
                    <div
                      className={`${
                        theme === "dark" ? "text-white" : "text-slate-800"
                      } font-outfit font-medium text-xs sm:text-sm`}
                    >
                      {matchDisplay}
                    </div>
                    <div className="flex items-center gap-1 sm:gap-1.5">
                      {isPending ? (
                        <ClockIcon
                          className={`w-2.5 h-2.5 sm:w-3 sm:h-3 ${
                            theme === "dark"
                              ? "text-amber-400"
                              : "text-amber-500"
                          }`}
                        />
                      ) : isCorrect ? (
                        <CheckIcon
                          className={`w-2.5 h-2.5 sm:w-3 sm:h-3 ${
                            theme === "dark"
                              ? "text-emerald-400"
                              : "text-emerald-500"
                          }`}
                        />
                      ) : (
                        <Cross2Icon
                          className={`w-2.5 h-2.5 sm:w-3 sm:h-3 ${
                            theme === "dark" ? "text-red-400" : "text-red-500"
                          }`}
                        />
                      )}
                      <span
                        className={`text-2xs sm:text-xs font-medium font-outfit ${
                          isPending
                            ? theme === "dark"
                              ? "text-amber-400"
                              : "text-amber-600"
                            : isCorrect
                            ? theme === "dark"
                              ? "text-emerald-400"
                              : "text-emerald-600"
                            : theme === "dark"
                            ? "text-red-400"
                            : "text-red-600"
                        }`}
                      >
                        {isPending ? "Pending" : isCorrect ? "Correct" : "Incorrect"}
                      </span>
                    </div>
                  </div>
                  <div
                    className={`flex items-center gap-2 sm:gap-3 text-2xs sm:text-xs font-outfit ${
                      theme === "dark" ? "text-slate-400" : "text-slate-500"
                    }`}
                  >
                    <div
                      className={`text-2xs sm:text-xs px-1 sm:px-1.5 py-0.5 rounded ${
                        theme === "dark" ? "bg-slate-600/30" : "bg-slate-200/70"
                      }`}
                    >
                      GW{prediction.gameweek || '?'}
                    </div>
                    <div className="flex items-center gap-0.5 sm:gap-1">
                      <ClockIcon className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                      <span>{formatTimeAgo(prediction.date)}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <div
                    className={`flex items-center gap-1 sm:gap-1.5 rounded-full px-1.5 sm:px-2 py-1 sm:py-1.5 font-outfit border ${
                      isPending
                        ? theme === "dark"
                          ? "bg-slate-500/10 border-slate-500/20"
                          : "bg-slate-100 border-slate-300"
                        : points > 0
                        ? theme === "dark"
                          ? "bg-emerald-500/10 border-emerald-500/20"
                          : "bg-emerald-50 border-emerald-200"
                        : theme === "dark"
                        ? "bg-red-500/10 border-red-500/20"
                        : "bg-red-50 border-red-200"
                    }`}
                  >
                    <MagicWandIcon
                      className={`w-2.5 h-2.5 sm:w-3 sm:h-3 ${
                        isPending
                          ? theme === "dark"
                            ? "text-slate-400"
                            : "text-slate-500"
                          : points > 0
                          ? theme === "dark"
                            ? "text-emerald-400"
                            : "text-emerald-600"
                          : theme === "dark"
                          ? "text-red-400"
                          : "text-red-600"
                      }`}
                    />
                    <span
                      className={`font-semibold text-2xs sm:text-xs ${
                        isPending
                          ? theme === "dark"
                            ? "text-slate-400"
                            : "text-slate-600"
                          : points > 0
                          ? theme === "dark"
                            ? "text-emerald-400"
                            : "text-emerald-600"
                          : theme === "dark"
                          ? "text-red-400"
                          : "text-red-600"
                      }`}
                    >
                      {isPending ? "-" : points > 0 ? "+" : ""}
                      {isPending ? "" : points} pts
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>{" "}
      {predictions.length === 0 && (
        <div className="text-center py-4 sm:py-6">
          <BarChartIcon
            className={`w-8 h-8 sm:w-10 sm:h-10 mx-auto mb-1.5 sm:mb-2 ${
              theme === "dark" ? "text-slate-500" : "text-slate-400"
            }`}
          />
          <h4
            className={`${
              theme === "dark" ? "text-slate-300" : "text-slate-600"
            } font-medium mb-1 sm:mb-1.5 text-xs sm:text-sm`}
          >
            No predictions yet
          </h4>
          <p
            className={`${
              theme === "dark" ? "text-slate-500" : "text-slate-500"
            } text-2xs sm:text-xs`}
          >
            Start making predictions to see your results here!
          </p>
        </div>
      )}
    </div>
  );
};

export default RecentPredictionsPanel;
