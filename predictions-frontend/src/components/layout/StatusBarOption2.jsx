import { Box } from "@radix-ui/themes";
import { motion } from "framer-motion";
import {
  SunIcon,
  MoonIcon,
  StarFilledIcon,
  LightningBoltIcon,
} from "@radix-ui/react-icons";
import { useContext } from "react";
import { ThemeContext } from "../../context/ThemeContext";
import { usePredictionTracker } from "../../utils/predictionTracker";
import { useFixtures } from "../../hooks/useFixtures";

/**
 * StatusBarOption2 - Icon-Only Stats
 * Replace text labels with intuitive icons
 * Icons: ⭐ for points, ⚡ for predictions
 * Compact but shows all essential data
 */
export default function StatusBarOption2({ 
  user, 
  globalRank,
  onMakePredictions, 
  loading = false,
  nextMatchData = null 
}) {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const { fixtures } = useFixtures({ fallbackToSample: false });
  const predictionStatus = usePredictionTracker(fixtures);

  const userData = user ? {
    username: user.username || "Anonymous User",
    points: user.points || 0,
    rank: user.rank || 0,
    predictions: predictionStatus.predictedCount || 0,
    pendingPredictions: predictionStatus.pendingCount || 0,
  } : {
    username: "Loading...",
    points: 0,
    rank: 0,
    predictions: 0,
    pendingPredictions: predictionStatus.pendingCount || 0,
  };

  const Skeleton = ({ width, height = "h-4" }) => (
    <div
      className={`${height} ${width} ${
        theme === "dark" ? "bg-slate-700/50" : "bg-slate-200"
      } rounded animate-pulse`}
    />
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`${
        theme === "dark"
          ? "bg-primary-500/90 border-slate-800"
          : "bg-slate-50 border-slate-200"
      } backdrop-blur-md border`}
    >
      <Box className="container mx-auto px-3 py-2">
        <div className="flex items-center justify-between gap-3">
          {/* Left: Avatar + Username */}
          <div className="flex items-center gap-2 min-w-0 flex-1">
            {loading ? (
              <div className="h-8 w-8 bg-slate-700/50 rounded-full animate-pulse flex-shrink-0" />
            ) : (
              <div className="h-8 w-8 bg-indigo-600 rounded-full flex items-center justify-center text-white font-medium text-sm flex-shrink-0">
                {userData.username.substring(0, 1).toUpperCase()}
              </div>
            )}
            {loading ? (
              <Skeleton width="w-24" height="h-5" />
            ) : (
              <div className="min-w-0">
                <h3
                  className={`${
                    theme === "dark" ? "text-teal-100" : "text-teal-700"
                  } font-medium font-outfit text-sm truncate`}
                >
                  {userData.username}
                </h3>
                <div
                  className={`text-2xs ${
                    theme === "dark" ? "text-white/60" : "text-slate-500"
                  }`}
                >
                  #{globalRank?.value?.toString() || "N/A"}
                </div>
              </div>
            )}
          </div>

          {/* Center: Icon Stats */}
          <div className="flex items-center gap-3 flex-shrink-0">
            {/* Points with Star Icon */}
            <div className="flex items-center gap-1">
              {loading ? (
                <Skeleton width="w-10" height="h-6" />
              ) : (
                <>
                  <StarFilledIcon
                    className={`w-3.5 h-3.5 ${
                      theme === "dark" ? "text-amber-400" : "text-amber-500"
                    }`}
                  />
                  <span
                    className={`${
                      theme === "dark" ? "text-teal-200" : "text-teal-600"
                    } font-bold font-dmSerif text-base`}
                  >
                    {userData.points}
                  </span>
                </>
              )}
            </div>

            {/* Predictions with Lightning Icon */}
            <div className="flex items-center gap-1">
              {loading ? (
                <Skeleton width="w-8" height="h-6" />
              ) : (
                <>
                  <LightningBoltIcon
                    className={`w-3.5 h-3.5 ${
                      theme === "dark" ? "text-indigo-400" : "text-indigo-500"
                    }`}
                  />
                  <span
                    className={`${
                      theme === "dark" ? "text-teal-200" : "text-teal-600"
                    } font-bold font-dmSerif text-base`}
                  >
                    {userData.predictions}
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Right: Predict Badge + Theme Toggle */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {loading ? (
              <Skeleton width="w-8" height="h-8" />
            ) : userData.pendingPredictions > 0 ? (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onMakePredictions}
                className={`${
                  theme === "dark"
                    ? "bg-indigo-600 hover:bg-indigo-700"
                    : "bg-indigo-600 hover:bg-indigo-700"
                } text-white rounded-full h-8 w-8 flex items-center justify-center font-bold text-sm transition-colors relative`}
              >
                {userData.pendingPredictions}
              </motion.button>
            ) : null}

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleTheme}
              className={`p-1.5 rounded-md transition-colors ${
                theme === "dark"
                  ? "text-white/70 hover:bg-primary-600/40 hover:text-teal-300"
                  : "text-slate-600 hover:bg-slate-100 hover:text-teal-700"
              }`}
            >
              <motion.span
                initial={{ rotate: 0 }}
                animate={{ rotate: theme === "dark" ? 0 : 360 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
              >
                {theme === "dark" ? <SunIcon /> : <MoonIcon />}
              </motion.span>
            </motion.button>
          </div>
        </div>
      </Box>
    </motion.div>
  );
}
