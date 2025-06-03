import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  GlobeIcon,
  LockClosedIcon,
  PersonIcon,
  DashboardIcon,
  ChevronRightIcon,
} from "@radix-ui/react-icons";
import { format, isValid, parseISO } from "date-fns";
import { ThemeContext } from "../../contexts/ThemeContext";

const LeagueCard = ({ league, onManageLeague, onViewLeague }) => {
  const navigate = useNavigate();

  const { theme } = useContext(ThemeContext);
  const isDarkMode = theme === "dark";

  // Handler for viewing league details
  const handleViewLeague = (e) => {
    onViewLeague(league.id);
  };

  // Handler for managing league (admin only)
  const handleManage = (e) => {
    e.stopPropagation(); // Prevent triggering view league
    onManageLeague(league);
  };

  // Safe date formatter that handles invalid dates
  const formatSafeDate = (dateValue, formatString) => {
    try {
      if (!dateValue) return "N/A";

      // Handle string dates by parsing them first
      const date =
        typeof dateValue === "string"
          ? parseISO(dateValue)
          : new Date(dateValue);

      // Check if date is valid before formatting
      if (!isValid(date)) return "N/A";

      return format(date, formatString);
    } catch (error) {
      console.warn(`Error formatting date: ${error.message}`);
      return "N/A";
    }
  };

  // Format relative time for "last updated"
  const getRelativeTime = (date) => {
    try {
      if (!date) return "N/A";

      const dateObj =
        typeof date === "string" ? parseISO(date) : new Date(date);

      if (!isValid(dateObj)) return "N/A";

      const now = new Date();
      const diffMs = now - dateObj;
      const diffMins = Math.floor(diffMs / (1000 * 60));
      const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

      if (diffMins < 60)
        return `${diffMins} min${diffMins !== 1 ? "s" : ""} ago`;
      if (diffHrs < 24) return `${diffHrs} hr${diffHrs !== 1 ? "s" : ""} ago`;
      if (diffDays < 7)
        return `${diffDays} day${diffDays !== 1 ? "s" : ""} ago`;
      return formatSafeDate(dateObj, "MMM d");
    } catch (error) {
      console.warn(`Error calculating relative time: ${error.message}`);
      return "N/A";
    }
  };
  return (
    <motion.div
      whileHover={{ y: -2 }}
      className={`relative border rounded-lg overflow-hidden font-outfit ${
        isDarkMode
          ? "bg-gradient-to-br from-slate-700/50 to-slate-800/30 border-slate-600/30"
          : "bg-gradient-to-br from-gray-50 to-white border-gray-200"
      }`}
    >
      {" "}
      {/* League type badge */}
      <div className="absolute top-4 right-4">
        <div
          className={`flex items-center px-2 py-1 rounded-full ${
            league.type === "private"
              ? isDarkMode
                ? "bg-indigo-900/40 text-indigo-300"
                : "bg-indigo-100 text-indigo-700"
              : isDarkMode
              ? "bg-teal-900/40 text-teal-300"
              : "bg-teal-100 text-teal-700"
          }`}
        >
          {league.type === "private" ? (
            <LockClosedIcon className="w-3 h-3 mr-1" />
          ) : (
            <GlobeIcon className="w-3 h-3 mr-1" />
          )}
          <span className="text-xs">
            {league.type === "private" ? "Private" : "Public"}
          </span>
        </div>
      </div>
      <div className="p-5">
        {" "}
        <div className="flex items-center mb-3">
          {/* League icon or avatar */}
          <div
            className={`w-12 h-12 rounded-md flex items-center justify-center mr-3 text-xl font-bold ${
              league.type === "private"
                ? isDarkMode
                  ? "bg-indigo-900/40 text-indigo-100"
                  : "bg-indigo-100 text-indigo-800"
                : isDarkMode
                ? "bg-teal-900/40 text-teal-100"
                : "bg-teal-100 text-teal-800"
            }`}
          >
            {league.name?.charAt(0).toUpperCase() || "?"}
          </div>

          <div>
            <h3
              className={`font-outfit text-xl ${
                isDarkMode ? "text-white" : "text-gray-900"
              }`}
            >
              {league.name}
            </h3>
            <div
              className={`flex items-center text-xs ${
                isDarkMode ? "text-white/60" : "text-gray-600"
              }`}
            >
              <span>
                Created {formatSafeDate(league.createdAt, "MMM d, yyyy")}
              </span>
              {league.isAdmin && (
                <span
                  className={`ml-2 px-1.5 py-0.5 rounded text-xs ${
                    isDarkMode
                      ? "bg-indigo-900/40 text-indigo-300"
                      : "bg-indigo-100 text-indigo-700"
                  }`}
                >
                  Admin
                </span>
              )}
            </div>
          </div>
        </div>
        <p
          className={`text-sm mb-4 ${
            isDarkMode ? "text-white/70" : "text-gray-600"
          }`}
        >
          {league.description || "No description provided for this league."}
        </p>
        <div className="flex flex-wrap gap-3 mb-4">
          <div
            className={`px-2 py-1 rounded-md text-sm flex items-center ${
              isDarkMode
                ? "bg-slate-700/40 text-white/80"
                : "bg-gray-100 text-gray-700"
            }`}
          >
            {/* <TrophyIcon className="w-3.5 h-3.5 mr-1.5" /> */}
            Rank: {league.userRank || "N/A"}
          </div>

          <div
            className={`px-2 py-1 rounded-md text-sm flex items-center ${
              isDarkMode
                ? "bg-slate-700/40 text-white/80"
                : "bg-gray-100 text-gray-700"
            }`}
          >
            <PersonIcon className="w-3.5 h-3.5 mr-1.5" />
            {league.memberCount} members
          </div>

          {league.nextDeadline && (
            <div
              className={`px-2 py-1 rounded-md text-sm flex items-center ${
                isDarkMode
                  ? "bg-slate-700/40 text-white/80"
                  : "bg-gray-100 text-gray-700"
              }`}
            >
              Next predictions:{" "}
              {formatSafeDate(league.nextDeadline, "EEE, h:mm a")}
            </div>
          )}
        </div>
        <div className="flex justify-between items-center">
          <div
            className={`text-xs flex items-center ${
              isDarkMode ? "text-white/60" : "text-gray-500"
            }`}
          >
            <span>Last updated {getRelativeTime(league.lastUpdated)}</span>
          </div>

          <div className="flex gap-2">
            {league.isAdmin && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleManage}
                className={`px-3 py-1.5 border rounded-md text-sm transition-colors flex items-center ${
                  isDarkMode
                    ? "bg-slate-700/40 hover:bg-slate-700/60 border-slate-600/30 text-white/80 hover:text-white"
                    : "bg-gray-100 hover:bg-gray-200 border-gray-200 text-gray-700 hover:text-gray-900"
                }`}
              >
                <DashboardIcon className="w-3.5 h-3.5 mr-1.5" />
                Manage
              </motion.button>
            )}

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleViewLeague}
              className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 rounded-md text-sm text-white transition-colors flex items-center"
            >
              View League
              <ChevronRightIcon className="ml-1.5 w-3.5 h-3.5" />
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default LeagueCard;
