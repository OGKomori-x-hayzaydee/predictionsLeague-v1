import { Box } from "@radix-ui/themes";
import { motion } from "framer-motion";
import {
  SunIcon,
  MoonIcon,
  ClockIcon,
} from "@radix-ui/react-icons";
import { useContext } from "react";
import { ThemeContext } from "../../context/ThemeContext";
import { usePredictionTracker } from "../../utils/predictionTracker";
import { useFixtures } from "../../hooks/useFixtures";

/**
 * StatusBarOption3 - Profile Chip + Action Bar
 * User info as compact pill/chip
 * Shows: Next Match In + Points
 * Mobile-optimized layout with clear "Predict" button
 */
export default function StatusBarOption3({ 
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
    pendingPredictions: predictionStatus.pendingCount || 0,
  } : {
    username: "Loading...",
    points: 0,
    pendingPredictions: predictionStatus.pendingCount || 0,
  };

  // Calculate time until next match
  let timeDisplay = "Loading...";
  
  if (nextMatchData && nextMatchData.nextMatchTime) {
    const nextMatch = new Date(nextMatchData.nextMatchTime);
    const now = new Date();
    const timeUntilMatch = nextMatch - now;
    
    if (timeUntilMatch > 0) {
      const totalHours = Math.floor(timeUntilMatch / (1000 * 60 * 60));
      const minutes = Math.floor((timeUntilMatch % (1000 * 60 * 60)) / (1000 * 60));
      
      if (totalHours >= 24) {
        // More than 24 hours: show days & hours
        const days = Math.floor(totalHours / 24);
        const remainingHours = totalHours % 24;
        timeDisplay = `${days}d ${remainingHours}h`;
      } else {
        // Less than 24 hours: show hours & minutes
        timeDisplay = `${totalHours}h ${minutes}m`;
      }
    } else {
      timeDisplay = "Live";
    }
  } else {
    timeDisplay = "TBD";
  }

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
      <Box className="container mx-auto px-3 py-2 lg:py-4">
        <div className="flex items-center justify-between gap-3 lg:gap-6">
          {/* Left: Profile Chip */}
          <div
            className={`flex items-center gap-2 px-2.5 py-1 lg:px-3 lg:py-1.5 rounded-full flex-shrink-0 ${
              theme === "dark"
                ? "bg-slate-800/50 border border-slate-700/50"
                : "bg-white border border-slate-200"
            }`}
          >
            {loading ? (
              <>
                <div className="h-6 w-6 lg:h-8 lg:w-8 bg-slate-700/50 rounded-full animate-pulse" />
                <Skeleton width="w-16 lg:w-20" height="h-4 lg:h-5" />
              </>
            ) : (
              <>
                <div className="h-6 w-6 lg:h-8 lg:w-8 bg-indigo-600 rounded-full flex items-center justify-center text-white font-medium text-xs lg:text-sm">
                  {userData.username.substring(0, 1).toUpperCase()}
                </div>
                <span
                  className={`${
                    theme === "dark" ? "text-teal-100" : "text-teal-700"
                  } font-medium font-outfit text-xs lg:text-sm`}
                >
                  {userData.username}
                </span>
              </>
            )}
          </div>

          {/* Center: Stats Bar */}
          <div className="flex items-center gap-3 lg:gap-6 flex-1 justify-center">
            {/* Next Match In */}
            <div className="flex flex-col items-center">
              <span
                className={`text-2xs lg:text-xs ${
                  theme === "dark" ? "text-white/50" : "text-slate-400"
                } font-outfit leading-tight`}
              >
                NEXT
              </span>
              {loading ? (
                <Skeleton width="w-12 lg:w-16" height="h-5 lg:h-6" />
              ) : (
                <div className="flex items-center gap-0.5 lg:gap-1">
                  <ClockIcon
                    className={`w-3 h-3 lg:w-4 lg:h-4 ${
                      theme === "dark" ? "text-teal-400" : "text-teal-500"
                    }`}
                  />
                  <span
                    className={`${
                      theme === "dark" ? "text-teal-200" : "text-teal-600"
                    } font-bold font-dmSerif text-sm lg:text-base`}
                  >
                    {timeDisplay}
                  </span>
                </div>
              )}
            </div>

            {/* Divider */}
            <div
              className={`h-6 lg:h-8 w-px ${
                theme === "dark" ? "bg-slate-700" : "bg-slate-200"
              }`}
            />

            {/* Points */}
            <div className="flex flex-col items-center">
              <span
                className={`text-2xs lg:text-xs ${
                  theme === "dark" ? "text-white/50" : "text-slate-400"
                } font-outfit leading-tight`}
              >
                POINTS
              </span>
              {loading ? (
                <Skeleton width="w-8 lg:w-12" height="h-5 lg:h-6" />
              ) : (
                <span
                  className={`${
                    theme === "dark" ? "text-teal-200" : "text-teal-600"
                  } font-bold font-dmSerif text-sm lg:text-base`}
                >
                  {userData.points}
                </span>
              )}
            </div>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-2 lg:gap-3 flex-shrink-0">
            {loading ? (
              <Skeleton width="w-16 lg:w-20" height="h-8 lg:h-10" />
            ) : userData.pendingPredictions > 0 ? (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onMakePredictions}
                className={`${
                  theme === "dark"
                    ? "bg-indigo-600 hover:bg-indigo-700"
                    : "bg-indigo-600 hover:bg-indigo-700"
                } text-white rounded-md px-2.5 py-1.5 lg:px-4 lg:py-2 flex items-center gap-1.5 font-outfit font-medium text-xs lg:text-sm transition-colors shadow-lg`}
              >
                <span>Predict</span>
                <span className="bg-white text-indigo-600 rounded-full h-4 w-4 lg:h-5 lg:w-5 flex items-center justify-center text-2xs lg:text-xs font-bold">
                  {userData.pendingPredictions}
                </span>
              </motion.button>
            ) : null}

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleTheme}
              className={`p-1.5 lg:p-2 rounded-md transition-colors ${
                theme === "dark"
                  ? "text-white/70 hover:bg-primary-600/40 hover:text-teal-300"
                  : "text-slate-600 hover:bg-slate-100 hover:text-teal-700"
              }`}
            >
              <motion.span
                initial={{ rotate: 0 }}
                animate={{ rotate: theme === "dark" ? 0 : 360 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="block w-4 h-4 lg:w-5 lg:h-5"
              >
                {theme === "dark" ? <SunIcon className="w-full h-full" /> : <MoonIcon className="w-full h-full" />}
              </motion.span>
            </motion.button>
          </div>
        </div>
      </Box>
    </motion.div>
  );
}
