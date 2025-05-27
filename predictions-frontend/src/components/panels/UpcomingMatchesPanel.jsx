import React from "react";
import { motion } from "framer-motion";
import { CalendarIcon, LightningBoltIcon, PlusIcon, ClockIcon, ChevronRightIcon } from "@radix-ui/react-icons";

const UpcomingMatchesPanel = ({ matches, onViewAll, onPredictMatch }) => {  return (
    <div className="bg-slate-800/40 backdrop-blur-sm rounded-xl p-5 border border-slate-700/50 hover:border-slate-600/50 transition-all duration-200">
      <div className="flex justify-between items-center mb-5">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-teal-500/10 rounded-lg border border-teal-500/20">
            <CalendarIcon className="w-4 h-4 text-teal-400" />
          </div>
          <div>
            <h3 className="text-white font-outfit font-semibold text-base">
              Upcoming Matches
            </h3>
            <p className="text-slate-400 text-xs">Make your predictions before deadline</p>
          </div>
        </div>
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onViewAll}
          className="flex items-center gap-2 px-3 py-1.5 bg-slate-700/50 hover:bg-slate-700/70 border border-slate-600/30 rounded-lg text-slate-300 hover:text-white text-xs transition-all duration-200"
        >
          View all 
          <ChevronRightIcon className="w-3 h-3" />
        </motion.button>
      </div>      <div className="space-y-2">
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
              className="group relative bg-slate-700/20 hover:bg-slate-700/40 rounded-lg p-3 border border-slate-600/20 hover:border-slate-500/40 transition-all duration-200"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1.5">
                    <div className="text-white font-outfit font-medium text-sm">
                      {match.home} vs {match.away}
                    </div>
                    {match.predicted && (
                      <div className="flex items-center gap-1 bg-emerald-500/10 text-emerald-400 text-xs font-medium py-0.5 px-1.5 rounded-full border border-emerald-500/20">
                        <LightningBoltIcon className="w-2.5 h-2.5" />
                        Predicted
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-3 text-slate-400 text-xs">
                    <div className="flex items-center gap-1">
                      <CalendarIcon className="w-3 h-3" />
                      <span>{formattedDate}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <ClockIcon className="w-3 h-3" />
                      <span>{formattedTime}</span>
                    </div>
                    <div className="text-xs bg-slate-600/30 px-1.5 py-0.5 rounded">
                      GW{match.gameweek || 36}
                    </div>
                  </div>
                </div>
                
                {!match.predicted ? (                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => onPredictMatch(match)}
                    className="flex items-center gap-1.5 bg-teal-600/20 hover:bg-teal-600/30 text-teal-400 hover:text-teal-300 border border-teal-500/30 rounded-lg px-3 py-1.5 text-xs font-medium transition-all duration-200 opacity-70 hover:opacity-100"
                  >
                    <PlusIcon className="w-3 h-3" />
                    Predict
                  </motion.button>
                ) : (                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => onPredictMatch(match)}
                    className="flex items-center gap-1.5 bg-amber-600/20 hover:bg-amber-600/30 text-amber-400 hover:text-amber-300 border border-amber-500/30 rounded-lg px-3 py-1.5 text-xs font-medium transition-all duration-200 opacity-70 hover:opacity-100"
                  >
                    <LightningBoltIcon className="w-3 h-3" />
                    Edit
                  </motion.button>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>      {matches.length === 0 && (
        <div className="text-center py-6">
          <CalendarIcon className="w-10 h-10 text-slate-500 mx-auto mb-2" />
          <h4 className="text-slate-300 font-medium mb-1.5">No upcoming matches</h4>
          <p className="text-slate-500 text-xs">Check back soon for new fixtures!</p>
        </div>
      )}
    </div>
  );
};

export default UpcomingMatchesPanel;