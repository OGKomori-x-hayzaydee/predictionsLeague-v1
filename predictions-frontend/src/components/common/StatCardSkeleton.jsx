import React, { useContext } from "react";
import { motion } from "framer-motion";
import { ThemeContext } from "../../context/ThemeContext";

const StatCardSkeleton = () => {
  const { theme } = useContext(ThemeContext);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`${
        theme === "dark"
          ? "bg-slate-800/40 border-slate-700/50"
          : "bg-white border-slate-200 shadow-sm"
      } backdrop-blur-sm rounded-xl p-5 border transition-all duration-200`}
    >
      <div className="animate-pulse">
        {/* Header with icon and badge skeleton */}
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-center gap-2">
            <div
              className={`w-8 h-8 ${
                theme === "dark" ? "bg-slate-700/50" : "bg-slate-200"
              } rounded-lg`}
            />
            <div
              className={`w-16 h-4 ${
                theme === "dark" ? "bg-slate-700/50" : "bg-slate-200"
              } rounded`}
            />
          </div>
          <div
            className={`w-20 h-5 ${
              theme === "dark" ? "bg-slate-700/50" : "bg-slate-200"
            } rounded-full`}
          />
        </div>

        {/* Value and trend skeleton */}
        <div className="flex items-baseline gap-2 mb-1.5">
          <div
            className={`w-16 h-8 ${
              theme === "dark" ? "bg-slate-700/50" : "bg-slate-200"
            } rounded`}
          />
          <div
            className={`w-12 h-5 ${
              theme === "dark" ? "bg-slate-700/50" : "bg-slate-200"
            } rounded-md`}
          />
        </div>

        {/* Subtitle skeleton */}
        <div
          className={`w-32 h-3 ${
            theme === "dark" ? "bg-slate-700/50" : "bg-slate-200"
          } rounded`}
        />
      </div>
    </motion.div>
  );
};

export default StatCardSkeleton;
