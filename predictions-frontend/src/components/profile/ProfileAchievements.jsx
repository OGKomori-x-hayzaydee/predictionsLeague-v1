import React, { useContext } from "react";
import { motion } from "framer-motion";
import { 
  BadgeIcon,
  ClockIcon,
  StarIcon
} from "@radix-ui/react-icons";
import { ThemeContext } from "../../context/ThemeContext";
import { text } from "../../utils/themeUtils";

const ProfileAchievements = () => {
  const { theme } = useContext(ThemeContext);

  return (
    <div className="space-y-6">
      {/* Coming Soon State */}
      <div className={`flex flex-col items-center justify-center py-16 px-8 rounded-xl ${
        theme === "dark"
          ? "bg-slate-800/40 border-slate-700/50"
          : "bg-white border-slate-200 shadow-sm"
      } border`}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center space-y-6"
        >
          {/* Icon with animation */}
          <motion.div
            animate={{ 
              rotate: [0, 10, -10, 0],
              scale: [1, 1.1, 1]
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              repeatDelay: 3
            }}
            className={`inline-flex items-center justify-center w-20 h-20 rounded-full ${
              theme === "dark" 
                ? "bg-gradient-to-br from-teal-500/20 to-indigo-500/20 border-teal-400/30" 
                : "bg-gradient-to-br from-teal-100 to-indigo-100 border-teal-300"
            } border-2`}
          >
            <BadgeIcon className={`w-10 h-10 ${
              theme === "dark" ? "text-teal-400" : "text-teal-600"
            }`} />
          </motion.div>

          {/* Title */}
          <div>
            <h3 className={`${text.primary[theme]} text-2xl font-bold font-dmSerif mb-2`}>
              Achievements Coming Soon!
            </h3>
          </div>

          {/* Features Preview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8 max-w-2xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className={`p-4 rounded-lg ${
                theme === "dark" 
                  ? "bg-slate-700/30 border-slate-600/50" 
                  : "bg-slate-50 border-slate-200"
              } border`}
            >
              <StarIcon className={`w-6 h-6 mb-2 ${
                theme === "dark" ? "text-yellow-400" : "text-yellow-500"
              }`} />
              <h4 className={`${text.primary[theme]} font-outfit font-semibold mb-1`}>
                Streak Rewards
              </h4>
              <p className={`${text.secondary[theme]} font-outfit text-sm`}>
                Unlock badges for consecutive correct predictions
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className={`p-4 rounded-lg ${
                theme === "dark" 
                  ? "bg-slate-700/30 border-slate-600/50" 
                  : "bg-slate-50 border-slate-200"
              } border`}
            >
              <BadgeIcon className={`w-6 h-6 mb-2 ${
                theme === "dark" ? "text-teal-400" : "text-teal-500"
              }`} />
              <h4 className={`${text.primary[theme]} font-outfit font-semibold mb-1`}>
                Milestone Badges
              </h4>
              <p className={`${text.secondary[theme]} font-outfit text-sm`}>
                Earn achievements for reaching prediction milestones
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className={`p-4 rounded-lg ${
                theme === "dark" 
                  ? "bg-slate-700/30 border-slate-600/50" 
                  : "bg-slate-50 border-slate-200"
              } border`}
            >
              <ClockIcon className={`w-6 h-6 mb-2 ${
                theme === "dark" ? "text-indigo-400" : "text-indigo-500"
              }`} />
              <h4 className={`${text.primary[theme]} font-outfit font-semibold mb-1`}>
                Weekly Challenges
              </h4>
              <p className={`${text.secondary[theme]} font-outfit text-sm`}>
                Complete special challenges for bonus rewards
              </p>
            </motion.div>
          </div>

          {/* Status Message */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${
              theme === "dark" 
                ? "bg-teal-500/10 text-teal-400 border-teal-400/20" 
                : "bg-teal-50 text-teal-600 border-teal-200"
            } border text-sm font-outfit`}
          >
            <ClockIcon className="w-4 h-4" />
            <span>Expected in next update</span>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default ProfileAchievements;
