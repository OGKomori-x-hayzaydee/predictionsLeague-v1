import React from "react";
import { motion } from "framer-motion";
import { BarChartIcon, CheckIcon, Cross2Icon, ClockIcon, ChevronRightIcon, MagicWandIcon } from "@radix-ui/react-icons";

const RecentPredictionsPanel = ({ predictions, onViewAll }) => {
  return (    <div className="bg-slate-800/40 backdrop-blur-sm rounded-xl p-5 border border-slate-700/50 hover:border-slate-600/50 transition-all duration-200">
      <div className="flex justify-between items-center mb-5">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-indigo-500/10 rounded-lg border border-indigo-500/20">
            <BarChartIcon className="w-4 h-4 text-indigo-400" />
          </div>
          <div>
            <h3 className="text-white font-outfit font-semibold text-base">
              Recent Predictions
            </h3>
            <p className="text-slate-400 text-xs">Your latest prediction results</p>
          </div>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onViewAll}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-700/50 hover:bg-slate-700/70 border border-slate-600/30 rounded-lg text-slate-300 hover:text-white text-xs transition-all duration-200"
        >
          View all
          <ChevronRightIcon className="w-3 h-3" />
        </motion.button>
      </div>      <div className="space-y-2">
        {predictions.map((prediction, index) => {
          const isCorrect = prediction.correct;
          const points = prediction.points;
          
          return (
            <motion.div
              key={prediction.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="group relative bg-slate-700/20 hover:bg-slate-700/40 rounded-lg p-3 border border-slate-600/20 hover:border-slate-500/40 transition-all duration-200"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1.5">
                    <div className="text-white font-outfit font-medium text-sm">
                      {prediction.match}
                    </div>
                    <div className="flex items-center gap-1.5">
                      {isCorrect ? (
                        <CheckIcon className="w-3 h-3 text-emerald-400" />
                      ) : (
                        <Cross2Icon className="w-3 h-3 text-red-400" />
                      )}
                      <span className={`text-xs font-medium ${
                        isCorrect ? 'text-emerald-400' : 'text-red-400'
                      }`}>
                        {isCorrect ? 'Correct' : 'Incorrect'}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-slate-400 text-xs">
                    <div className="text-xs bg-slate-600/30 px-1.5 py-0.5 rounded">
                      GW{35 - (prediction.id - 1)}
                    </div>
                    <div className="flex items-center gap-0.5">
                      <ClockIcon className="w-3 h-3" />
                      <span>2 days ago</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <div className={`flex items-center gap-1.5 rounded-lg px-2 py-1.5 ${
                    points > 0
                      ? "bg-emerald-500/10 border border-emerald-500/20"
                      : "bg-red-500/10 border border-red-500/20"
                  }`}>
                    <MagicWandIcon className={`w-3 h-3 ${
                      points > 0 ? "text-emerald-400" : "text-red-400"
                    }`} />
                    <span className={`font-semibold text-xs ${
                      points > 0 ? "text-emerald-400" : "text-red-400"
                    }`}>
                      {points > 0 ? '+' : ''}{points} pts
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>      {predictions.length === 0 && (
        <div className="text-center py-6">
          <BarChartIcon className="w-10 h-10 text-slate-500 mx-auto mb-2" />
          <h4 className="text-slate-300 font-medium mb-1.5 text-sm">No predictions yet</h4>
          <p className="text-slate-500 text-xs">Start making predictions to see your results here!</p>
        </div>
      )}
    </div>
  );
};

export default RecentPredictionsPanel;