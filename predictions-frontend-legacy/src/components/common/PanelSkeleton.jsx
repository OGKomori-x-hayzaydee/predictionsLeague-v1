import React, { useContext } from "react";
import { motion } from "framer-motion";
import { ThemeContext } from "../../context/ThemeContext";

const PanelSkeleton = ({ title, icon, rows = 3 }) => {
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
        {/* Header skeleton */}
        <div className="flex justify-between items-center mb-5">
          <div className="flex items-center gap-2">
            <div
              className={`p-1.5 rounded-lg border ${
                theme === "dark"
                  ? "bg-slate-700/50 border-slate-600/50"
                  : "bg-slate-200 border-slate-300"
              }`}
            >
              <div className="w-4 h-4 bg-current opacity-30" />
            </div>
            <div>
              <div
                className={`w-32 h-4 mb-1 ${
                  theme === "dark" ? "bg-slate-700/50" : "bg-slate-200"
                } rounded`}
              />
              <div
                className={`w-24 h-3 ${
                  theme === "dark" ? "bg-slate-700/50" : "bg-slate-200"
                } rounded`}
              />
            </div>
          </div>
          <div
            className={`w-16 h-6 ${
              theme === "dark" ? "bg-slate-700/50" : "bg-slate-200"
            } rounded`}
          />
        </div>

        {/* Content rows skeleton */}
        <div className="space-y-3">
          {Array.from({ length: rows }).map((_, index) => (
            <div
              key={index}
              className={`flex items-center justify-between p-3 ${
                theme === "dark" ? "bg-slate-700/30" : "bg-slate-100"
              } rounded-lg`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-8 h-8 ${
                    theme === "dark" ? "bg-slate-600/50" : "bg-slate-300"
                  } rounded`}
                />
                <div>
                  <div
                    className={`w-24 h-4 mb-1 ${
                      theme === "dark" ? "bg-slate-600/50" : "bg-slate-300"
                    } rounded`}
                  />
                  <div
                    className={`w-16 h-3 ${
                      theme === "dark" ? "bg-slate-600/50" : "bg-slate-300"
                    } rounded`}
                  />
                </div>
              </div>
              <div
                className={`w-12 h-4 ${
                  theme === "dark" ? "bg-slate-600/50" : "bg-slate-300"
                } rounded`}
              />
            </div>
          ))}
        </div>

        {/* View all button skeleton */}
        <div className="mt-4 pt-3 border-t border-slate-700/50">
          <div
            className={`w-20 h-4 mx-auto ${
              theme === "dark" ? "bg-slate-700/50" : "bg-slate-200"
            } rounded`}
          />
        </div>
      </div>
    </motion.div>
  );
};

export default PanelSkeleton;
