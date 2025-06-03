import React, { useContext } from "react";
import { motion } from "framer-motion";
import {
  CalendarIcon,
  LightningBoltIcon,
  PlusIcon,
  ClockIcon,
  ChevronRightIcon,
} from "@radix-ui/react-icons";
import { ThemeContext } from "../../context/ThemeContext";

const UpcomingMatchesPanel = ({ matches, onViewAll, onPredictMatch }) => {
  const { theme } = useContext(ThemeContext);

  return (
    <div
      className={`${
        theme === "dark"
          ? "bg-slate-800/40 border-slate-700/50 hover:border-slate-600/50"
          : "bg-white border-slate-200 shadow-sm hover:border-slate-300"
      } backdrop-blur-sm rounded-xl p-5 border transition-all duration-200`}
    >
      {" "}
      <div className="flex justify-between items-center mb-5">
        <div className="flex items-center gap-2">
          <div
            className={`p-1.5 rounded-lg border ${
              theme === "dark"
                ? "bg-teal-500/10 border-teal-500/20"
                : "bg-teal-50 border-teal-200"
            }`}
          >
            <CalendarIcon
              className={`w-4 h-4 ${
                theme === "dark" ? "text-teal-400" : "text-teal-600"
              }`}
            />
          </div>
          <div>
            <h3
              className={`${
                theme === "dark" ? "text-teal-200" : "text-teal-700"
              } font-outfit font-semibold text-base`}
            >
              Upcoming Matches
            </h3>
            <p
              className={`${
                theme === "dark" ? "text-slate-400" : "text-slate-500"
              } text-xs font-outfit`}
            >
              Make your predictions before deadline
            </p>
          </div>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onViewAll}
          className={`flex items-center gap-2 px-3 py-1.5 border rounded-lg text-xs transition-all duration-200 ${
            theme === "dark"
              ? "bg-slate-700/50 hover:bg-slate-700/70 border-slate-600/30 text-slate-300 hover:text-white"
              : "bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-600 hover:text-slate-800"
          }`}
        >
          View all
          <ChevronRightIcon className="w-3 h-3" />
        </motion.button>
      </div>
      <div className="space-y-2">
        {matches.map((match, index) => {
          const matchDate = new Date(match.date);
          const formattedDate = `${matchDate.toLocaleDateString("en-GB", {
            weekday: "short",
          })} ${matchDate.toLocaleDateString("en-GB", {
            day: "numeric",
            month: "short",
          })}`;
          const formattedTime = matchDate
            .toLocaleTimeString("en-GB", {
              hour: "2-digit",
              minute: "2-digit",
            })
            .toLowerCase();

          return (
            <motion.div
              key={match.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`group relative rounded-lg p-3 border transition-all duration-200 ${
                theme === "dark"
                  ? "bg-slate-700/20 hover:bg-slate-700/40 border-slate-600/20 hover:border-slate-500/40"
                  : "bg-slate-50/50 hover:bg-slate-100/50 border-slate-200/50 hover:border-slate-300/50"
              }`}
            >
              {" "}
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1.5">
                    <div
                      className={`${
                        theme === "dark" ? "text-white" : "text-slate-800"
                      } font-outfit font-medium text-sm`}
                    >
                      {match.home} vs {match.away}
                    </div>
                    {match.predicted && (
                      <div
                        className={`flex items-center gap-1 text-xs font-medium py-0.5 px-1.5 rounded-full border ${
                          theme === "dark"
                            ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                            : "bg-emerald-50 text-emerald-600 border-emerald-200"
                        }`}
                      >
                        <LightningBoltIcon className="w-2.5 h-2.5" />
                        Predicted
                      </div>
                    )}
                  </div>
                  <div
                    className={`flex items-center gap-3 text-xs ${
                      theme === "dark" ? "text-slate-400" : "text-slate-500"
                    } font-outfit`}
                  >
                    <div className="flex items-center gap-1">
                      <CalendarIcon className="w-3 h-3" />
                      <span>{formattedDate}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <ClockIcon className="w-3 h-3" />
                      <span>{formattedTime}</span>
                    </div>
                    <div
                      className={`text-xs px-1.5 py-0.5 rounded ${
                        theme === "dark" ? "bg-slate-600/30" : "bg-slate-200/70"
                      }`}
                    >
                      GW{match.gameweek || 36}
                    </div>
                  </div>
                </div>
                {!match.predicted ? (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => onPredictMatch(match)}
                    className={`flex items-center gap-1.5 border rounded-lg px-3 py-1.5 text-xs font-medium transition-all duration-200 opacity-70 hover:opacity-100 ${
                      theme === "dark"
                        ? "bg-teal-600/20 hover:bg-teal-600/30 text-emerald-200 hover:text-emerald-200 border-emerald-500/30"
                        : "bg-teal-50 hover:bg-teal-100 text-teal-600 hover:text-teal-700 border-teal-200"
                    }`}
                  >
                    <PlusIcon className="w-3 h-3" />
                    Predict
                  </motion.button>
                ) : (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => onPredictMatch(match)}
                    className={`flex items-center gap-1.5 border rounded-lg px-3 py-1.5 text-xs font-medium transition-all duration-200 opacity-70 hover:opacity-100 ${
                      theme === "dark"
                        ? "bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-200 hover:text-indigo-200 border-indigo-500/30"
                        : "bg-indigo-50 hover:bg-indigo-100 text-indigo-600 hover:text-indigo-700 border-indigo-200"
                    }`}
                  >
                    <LightningBoltIcon className="w-3 h-3" />
                    Edit
                  </motion.button>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>{" "}
      {matches.length === 0 && (
        <div className="text-center py-6">
          <CalendarIcon
            className={`w-10 h-10 mx-auto mb-2 ${
              theme === "dark" ? "text-slate-500" : "text-slate-400"
            }`}
          />
          <h4
            className={`${
              theme === "dark" ? "text-slate-300" : "text-slate-600"
            } font-medium mb-1.5`}
          >
            No upcoming matches
          </h4>
          <p
            className={`${
              theme === "dark" ? "text-slate-500" : "text-slate-500"
            } text-xs`}
          >
            Check back soon for new fixtures!
          </p>
        </div>
      )}
    </div>
  );
};

export default UpcomingMatchesPanel;
