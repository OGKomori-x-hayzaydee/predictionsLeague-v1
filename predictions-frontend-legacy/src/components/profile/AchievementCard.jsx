import React, { useContext } from "react";
import { motion } from "framer-motion";
import { CheckCircledIcon, CircleIcon } from "@radix-ui/react-icons";
import { ThemeContext } from "../../context/ThemeContext";
import { text } from "../../utils/themeUtils";

const AchievementCard = ({ achievement, isUnlocked, progress }) => {
  const { theme } = useContext(ThemeContext);

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className={`relative p-4 rounded-lg border transition-all duration-200 ${
        isUnlocked
          ? theme === "dark"
            ? "bg-gradient-to-br from-teal-500/10 to-indigo-500/10 border-teal-500/20"
            : "bg-gradient-to-br from-teal-50 to-indigo-50 border-teal-200"
          : theme === "dark"
          ? "bg-slate-800/20 border-slate-700/30"
          : "bg-slate-50/50 border-slate-200/50"
      }`}
    >
      {/* Achievement Icon */}
      <div className="flex items-center justify-between mb-3">
        <div className={`p-2 rounded-full ${
          isUnlocked
            ? theme === "dark"
              ? "bg-teal-500/20 text-teal-400"
              : "bg-teal-100 text-teal-600"
            : theme === "dark"
            ? "bg-slate-700/50 text-slate-500"
            : "bg-slate-100 text-slate-400"
        }`}>
          {achievement.icon}
        </div>
        {isUnlocked ? (
          <CheckCircledIcon className={`w-5 h-5 ${
            theme === "dark" ? "text-emerald-400" : "text-emerald-600"
          }`} />
        ) : (
          <CircleIcon className={`w-5 h-5 ${
            theme === "dark" ? "text-slate-500" : "text-slate-400"
          }`} />
        )}
      </div>

      {/* Achievement Details */}
      <div className="mb-3">
        <h4 className={`${
          isUnlocked ? text.primary[theme] : text.muted[theme]
        } font-outfit font-semibold text-sm mb-1`}>
          {achievement.name}
        </h4>
        <p className={`${text.muted[theme]} font-outfit text-xs`}>
          {achievement.description}
        </p>
      </div>

      {/* Progress Bar (if not unlocked) */}
      {!isUnlocked && progress && (
        <div className="mb-2">
          <div className={`w-full h-2 rounded-full ${
            theme === "dark" ? "bg-slate-700" : "bg-slate-200"
          }`}>
            <div 
              className={`h-2 rounded-full transition-all duration-500 ${
                theme === "dark" ? "bg-teal-500" : "bg-teal-600"
              }`}
              style={{ width: `${Math.min(progress.percentage, 100)}%` }}
            />
          </div>
          <p className={`${text.muted[theme]} font-outfit text-xs mt-1`}>
            {progress.current}/{progress.target} {progress.unit}
          </p>
        </div>
      )}

      {/* Unlock Date */}
      {isUnlocked && achievement.unlockedDate && (
        <p className={`${text.muted[theme]} font-outfit text-xs`}>
          Unlocked {achievement.unlockedDate}
        </p>
      )}
    </motion.div>
  );
};

export default AchievementCard;
