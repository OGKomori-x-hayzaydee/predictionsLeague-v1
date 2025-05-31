import { Box } from "@radix-ui/themes";
import { motion } from "framer-motion";
import {
  CaretUpIcon,
  CaretDownIcon,
  LockClosedIcon,
  ClockIcon,
  SunIcon,
  MoonIcon,
} from "@radix-ui/react-icons";
import { useContext } from "react";
import { ThemeContext } from "../../context/ThemeContext";

export default function StatusBar({ user, onMakePredictions }) {
  // Get theme context
  const { theme, toggleTheme } = useContext(ThemeContext);

  // Sample user data - in a real app, this would come from props or context
  const userData = user || {
    username: "hayzaydee",
    points: 1250,
    rank: 1,
    rankChange: 0,
    nextMatchTime: "2025-06-12T15:00:00", // ISO format for the next upcoming match
    predictions: 28, // predictions made this season
    pendingPredictions: 4, // pending predictions for the upcoming gameweek
  };

  // Calculate time until next match
  const nextMatch = new Date(userData.nextMatchTime);
  const now = new Date();
  const timeUntilMatch = nextMatch - now;
  const hoursUntilMatch = Math.floor(timeUntilMatch / (1000 * 60 * 60));
  const minutesUntilMatch = Math.floor(
    (timeUntilMatch % (1000 * 60 * 60)) / (1000 * 60)
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
      <Box className="container mx-auto px-4 py-3">
        <div className="flex flex-wrap items-center justify-between gap-y-2">
          <div className="flex items-center">
            <div className="h-9 w-9 bg-indigo-600 rounded-full flex items-center justify-center text-white font-medium mr-3">
              {userData.username.substring(0, 1).toUpperCase()}
            </div>{" "}
            <div>
              <h3
                className={`${
                  theme === "dark" ? "text-teal-100" : "text-teal-700"
                } font-medium font-outfit`}
              >
                {userData.username}
              </h3>
              <div
                className={`flex items-center text-xs ${
                  theme === "dark" ? "text-white/60" : "text-slate-500"
                }`}
              >
                <span>Rank: {userData.rank.toLocaleString()}</span>{" "}
                <span
                  className={`flex items-center ml-2 ${
                    userData.rankChange > 0
                      ? theme === "dark"
                        ? "text-green-400"
                        : "text-green-600"
                      : userData.rankChange < 0
                      ? theme === "dark"
                        ? "text-red-400"
                        : "text-red-600"
                      : theme === "dark"
                      ? "text-white/60"
                      : "text-slate-400"
                  }`}
                >
                  {userData.rankChange > 0 ? (
                    <>
                      <CaretUpIcon className="mr-0.5" /> {userData.rankChange}
                    </>
                  ) : userData.rankChange < 0 ? (
                    <>
                      <CaretDownIcon className="mr-0.5" />{" "}
                      {Math.abs(userData.rankChange)}
                    </>
                  ) : (
                    "-"
                  )}
                </span>
              </div>
            </div>
          </div>{" "}
          {/* Stats */}
          <div className="flex space-x-6">
            {/* Points */}
            <div className="flex flex-col items-center">
              <span
                className={`text-xs ${
                  theme === "dark" ? "text-white/60" : "text-slate-500"
                } font-outfit`}
              >
                POINTS
              </span>
              <span
                className={`${
                  theme === "dark" ? "text-teal-200" : "text-teal-600"
                } font-bold font-dmSerif text-lg`}
              >
                {userData.points.toLocaleString()}
              </span>
            </div>

            {/* Predictions */}
            <div className="flex flex-col items-center">
              <span
                className={`text-xs ${
                  theme === "dark" ? "text-white/60" : "text-slate-500"
                } font-outfit`}
              >
                PREDICTIONS
              </span>
              <span
                className={`${
                  theme === "dark" ? "text-teal-200" : "text-teal-600"
                } font-bold font-dmSerif text-lg`}
              >
                {userData.predictions}
              </span>
            </div>
            {/* Next Match */}
            <div className="hidden md:flex flex-col items-center">
              <span
                className={`text-xs ${
                  theme === "dark" ? "text-white/60" : "text-slate-500"
                } font-outfit`}
              >
                NEXT MATCH IN
              </span>
              <span
                className={`${
                  theme === "dark" ? "text-teal-200" : "text-teal-600"
                } font-bold font-dmSerif text-lg flex items-center`}
              >
                <ClockIcon className="mr-1" /> {hoursUntilMatch}h{" "}
                {minutesUntilMatch}m
              </span>
            </div>
          </div>{" "}
          {/* Action Button & Theme Toggle */}
          <div className="flex items-center space-x-3">
            {/* Action Button */}
            {userData.pendingPredictions > 0 ? (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onMakePredictions}
                className={`${
                  theme === "dark"
                    ? "bg-indigo-600 hover:bg-indigo-700"
                    : "bg-indigo-600 hover:bg-indigo-700"
                } text-white text-sm py-2 px-4 rounded-md flex items-center font-outfit transition-colors`}
              >
                Make Predictions
                <span className="ml-2 bg-white text-indigo-600 rounded-full h-5 w-5 flex items-center justify-center text-xs font-bold">
                  {userData.pendingPredictions}
                </span>
              </motion.button>
            ) : (
              <button
                className={`${
                  theme === "dark"
                    ? "bg-indigo-700/50 text-white/70"
                    : "bg-indigo-100 text-indigo-500"
                } text-sm py-2 px-4 rounded-md flex items-center font-outfit cursor-not-allowed`}
              >
                <LockClosedIcon className="mr-1" /> All Predictions Made
              </button>
            )}

            {/* Theme Toggle */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleTheme}
              className={`p-2 rounded-md transition-colors ${
                theme === "dark"
                  ? "text-white/70 hover:bg-primary-600/40 hover:text-teal-300"
                  : "text-slate-600 hover:bg-slate-100 hover:text-teal-700"
              }`}
              title={`Switch to ${theme === "dark" ? "Light" : "Dark"} Mode`}
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
