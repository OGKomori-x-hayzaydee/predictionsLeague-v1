import { useContext } from "react";
import { motion } from "framer-motion";
import {
  PersonIcon,
  EnterIcon,
  LockClosedIcon,
  GlobeIcon,
} from "@radix-ui/react-icons";
import { ThemeContext } from "../../contexts/ThemeContext";

const FeaturedLeagueCard = ({ league, onJoinLeague, isJoining }) => {
  const { theme } = useContext(ThemeContext);
  const isDarkMode = theme === "dark";

  const memberCount = league.memberCount || 0;
  return (
    <motion.div
      whileHover={{ y: -3 }}
      className={`border rounded-lg overflow-hidden h-full ${
        isDarkMode
          ? "bg-gradient-to-br from-slate-700/30 to-slate-800/20 border-slate-600/30"
          : "bg-gradient-to-br from-gray-50 to-white border-gray-200"
      }`}
    >
      {/* Feature badge
      <div className="absolute top-0 left-0">
        <div className="bg-gradient-to-r from-amber-600 to-amber-500 text-white px-3 py-1 rounded-br-lg text-xs flex items-center">
          <StarFilledIcon className="w-3 h-3 mr-1" />
          Featured
        </div>
      </div> */}
      {/* Header with image background */}
      <div
        className={`h-24 relative flex items-center justify-center p-4 ${
          isDarkMode
            ? "bg-gradient-to-r from-indigo-900/50 to-teal-900/50"
            : "bg-gradient-to-r from-indigo-100 to-teal-100"
        }`}
      >
        <div
          className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold border-2 ${
            league.type === "official"
              ? isDarkMode
                ? "bg-indigo-900/60 text-indigo-100 border-indigo-500/30"
                : "bg-indigo-200 text-indigo-800 border-indigo-300"
              : isDarkMode
              ? "bg-teal-900/60 text-teal-100 border-teal-500/30"
              : "bg-teal-200 text-teal-800 border-teal-300"
          }`}
        >
          {league.name.charAt(0).toUpperCase()}
        </div>
      </div>
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <h3
            className={`font-outfit text-xl ${
              isDarkMode ? "text-white" : "text-gray-900"
            }`}
          >
            {league.name}
          </h3>
          <div
            className={`px-2 py-1 rounded-full text-xs flex items-center ${
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
            <span>{league.type === "private" ? "Private" : "Public"}</span>
          </div>
        </div>
        <p
          className={`text-sm mb-3 line-clamp-2 ${
            isDarkMode ? "text-white/70" : "text-gray-600"
          }`}
        >
          {league.description || "No description provided for this league."}
        </p>

        <div className="flex flex-wrap gap-2 mb-4">
          <div
            className={`px-2 py-1 rounded-md text-xs flex items-center ${
              isDarkMode
                ? "bg-slate-700/30 text-white/80"
                : "bg-gray-100 text-gray-700"
            }`}
          >
            <PersonIcon className="w-3 h-3 mr-1.5" />
            {memberCount.toLocaleString()}{" "}
            {memberCount === 1 ? "member" : "members"}
          </div>

          {league.competition && (
            <div
              className={`px-2 py-1 rounded-md text-xs ${
                isDarkMode
                  ? "bg-slate-700/30 text-white/80"
                  : "bg-gray-100 text-gray-700"
              }`}
            >
              {league.competition}
            </div>
          )}

          {league.prizes && (
            <div
              className={`px-2 py-1 rounded-md text-xs flex items-center ${
                isDarkMode
                  ? "bg-amber-900/30 text-amber-300"
                  : "bg-amber-100 text-amber-700"
              }`}
            >
              {/* <TrophyIcon className="w-3 h-3 mr-1.5" /> */}
              Prizes
            </div>
          )}
        </div>
        <div className="flex justify-between items-center">
          <div>
            {league.startDate && (
              <p
                className={`text-xs ${
                  isDarkMode ? "text-white/50" : "text-gray-500"
                }`}
              >
                Starting soon
              </p>
            )}
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            disabled={isJoining}
            onClick={() => onJoinLeague(league.id)}
            className={`px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-md text-white text-sm flex items-center transition-colors ${
              isJoining ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            <EnterIcon className="w-3.5 h-3.5 mr-1.5" />
            {isJoining ? "Joining..." : "Join League"}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default FeaturedLeagueCard;
