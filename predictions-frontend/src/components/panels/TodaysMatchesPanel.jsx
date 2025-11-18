import React, { useContext } from "react";
import { motion } from "framer-motion";
import { ThemeContext } from "../../context/ThemeContext";
import { CheckCircledIcon, EyeOpenIcon, ChevronRightIcon } from "@radix-ui/react-icons";
import { format, parseISO } from "date-fns";
import TeamLogo from "../ui/TeamLogo";
import { LOGO_SIZES } from "../../utils/teamLogos";

/**
 * TodaysMatchesPanel
 * Displays matches that are currently live or finished today
 * Only renders when there are matches to show
 */
const TodaysMatchesPanel = ({ matches = [], onViewAll, onViewPrediction }) => {
  const { theme } = useContext(ThemeContext);

  console.log('🎯 TodaysMatchesPanel render:', {
    matchesReceived: matches?.length || 0,
    matches: matches
  });

  if (!matches || matches.length === 0) {
    console.log('❌ TodaysMatchesPanel: No matches, not rendering');
    return null; // Don't render if no matches
  }

  // Categorize matches
  const liveMatches = matches.filter(m => {
    const statusLower = m.status?.toLowerCase() || '';
    return statusLower === 'live' || 
           statusLower === 'in_progress' || 
           statusLower === 'in_play' ||
           statusLower === 'playing';
  });
  
  const finishedMatches = matches.filter(m => {
    const statusLower = m.status?.toLowerCase() || '';
    return statusLower === 'completed' || 
           statusLower === 'finished' || 
           statusLower === 'ft' ||
           statusLower === 'full_time' ||
           statusLower === 'fulltime';
  });

  const hasLiveMatches = liveMatches.length > 0;
  const panelTitle = "Today's Matches";
  const panelIcon = hasLiveMatches ? "🔴" : "⚽";
  const iconColorClass = hasLiveMatches 
    ? theme === "dark" ? "bg-red-500/10 border-red-500/20" : "bg-red-50 border-red-200"
    : theme === "dark" ? "bg-teal-500/10 border-teal-500/20" : "bg-teal-50 border-teal-200";
  const titleColorClass = hasLiveMatches
    ? theme === "dark" ? "text-red-200" : "text-red-700"
    : theme === "dark" ? "text-teal-200" : "text-teal-700";

  return (
    <div
      className={`${
        theme === "dark"
          ? "bg-slate-800/40 border-slate-700/50 hover:border-slate-600/50"
          : "bg-white border-slate-200 shadow-sm hover:border-slate-300"
      } backdrop-blur-sm rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-5 border transition-all duration-200`}
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-2 sm:mb-3 md:mb-5">
        <div className="flex items-center gap-1.5 sm:gap-2">
          <div className={`p-1 sm:p-1.5 rounded border ${iconColorClass}`}>
            <span className="text-sm sm:text-base">{panelIcon}</span>
          </div>
          <div>
            <h3
              className={`${titleColorClass} font-outfit font-semibold text-sm sm:text-base`}
            >
              {panelTitle}
            </h3>
            <p
              className={`${
                theme === "dark" ? "text-slate-400" : "text-slate-500"
              } text-2xs sm:text-xs font-outfit hidden sm:block`}
            >
              {hasLiveMatches ? `${liveMatches.length} match${liveMatches.length !== 1 ? 'es' : ''} in progress` 
                : `${finishedMatches.length} match${finishedMatches.length !== 1 ? 'es' : ''} completed today`}
            </p>
          </div>
        </div>
        
        {/* View All Button */}
        {onViewAll && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onViewAll}
            className={`flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1 sm:py-1.5 border rounded text-2xs sm:text-xs transition-all duration-200 ${
              theme === "dark"
                ? "bg-slate-700/50 hover:bg-slate-700/70 border-slate-600/30 text-slate-300 hover:text-white"
                : "bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-600 hover:text-slate-800"
            }`}
          >
            <span className="hidden sm:inline">View all</span>
            <span className="sm:hidden">All</span>
            <ChevronRightIcon className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
          </motion.button>
        )}
      </div>

      {/* Matches List */}
      <div className="space-y-1.5 sm:space-y-2">
        {matches.map((match, index) => {
          const statusLower = match.status?.toLowerCase() || '';
          const isLive = statusLower === 'live' || 
                        statusLower === 'in_progress' || 
                        statusLower === 'in_play' ||
                        statusLower === 'playing';
          const isFinished = statusLower === 'completed' || 
                            statusLower === 'finished' || 
                            statusLower === 'ft' ||
                            statusLower === 'full_time' ||
                            statusLower === 'fulltime';
          const hasPrediction = match.predicted || match.userPrediction;

          return (
            <motion.div
              key={match.id || index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`group relative rounded p-2 sm:p-3 border transition-all duration-200 ${
                theme === "dark"
                  ? "bg-slate-700/20 hover:bg-slate-700/40 border-slate-600/20 hover:border-slate-500/40"
                  : "bg-slate-50/50 hover:bg-slate-100/50 border-slate-200/50 hover:border-slate-300/50"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  {/* Teams Row */}
                  <div className="flex items-center gap-1.5 sm:gap-2 mb-1 sm:mb-1.5">
                    <div className="flex items-center gap-1 sm:gap-2">
                      <TeamLogo 
                        teamName={match.homeTeam || match.home}
                        size={LOGO_SIZES.xs}
                        className="flex-shrink-0"
                      />
                      <span
                        className={`${
                          theme === "dark" ? "text-white" : "text-slate-800"
                        } font-outfit font-medium text-xs sm:text-sm`}
                      >
                        {match.homeTeam || match.home}
                      </span>
                      {(isLive || isFinished) && match.homeScore !== undefined && (
                        <span className={`${
                          theme === "dark" ? "text-white" : "text-slate-900"
                        } font-outfit font-bold text-xs sm:text-sm`}>
                          {match.homeScore}
                        </span>
                      )}
                    </div>
                    
                    <span
                      className={`${
                        theme === "dark" ? "text-slate-400" : "text-slate-500"
                      } text-xs sm:text-sm font-outfit`}
                    >
                      -
                    </span>
                    
                    <div className="flex items-center gap-1 sm:gap-2">
                      {(isLive || isFinished) && match.awayScore !== undefined && (
                        <span className={`${
                          theme === "dark" ? "text-white" : "text-slate-900"
                        } font-outfit font-bold text-xs sm:text-sm`}>
                          {match.awayScore}
                        </span>
                      )}
                      <span
                        className={`${
                          theme === "dark" ? "text-white" : "text-slate-800"
                        } font-outfit font-medium text-xs sm:text-sm`}
                      >
                        {match.awayTeam || match.away}
                      </span>
                      <TeamLogo 
                        teamName={match.awayTeam || match.away}
                        size={LOGO_SIZES.xs}
                        className="flex-shrink-0"
                      />
                    </div>

                    {/* Status Badge */}
                    {isLive ? (
                      <div className="flex items-center gap-0.5 sm:gap-1 text-2xs sm:text-xs font-bold py-0.5 px-1 sm:px-1.5 rounded-full border bg-red-500/10 text-red-400 border-red-500/20">
                        <span className="relative flex h-1.5 w-1.5 sm:h-2 sm:w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-full w-full bg-red-500"></span>
                        </span>
                        <span>LIVE</span>
                      </div>
                    ) : isFinished ? (
                      <div className="flex items-center gap-0.5 sm:gap-1 text-2xs sm:text-xs font-medium py-0.5 px-1 sm:px-1.5 rounded-full border bg-green-500/10 text-green-400 border-green-500/20">
                        <CheckCircledIcon className="w-2 h-2 sm:w-2.5 sm:h-2.5" />
                        <span>FT</span>
                      </div>
                    ) : null}
                  </div>

                  {/* Match Info Row */}
                  <div
                    className={`flex items-center gap-2 sm:gap-3 text-2xs sm:text-xs ${
                      theme === "dark" ? "text-slate-400" : "text-slate-500"
                    } font-outfit`}
                  >
                    {match.venue && (
                      <span className="hidden sm:inline">{match.venue}</span>
                    )}
                    <div
                      className={`text-2xs sm:text-xs px-1 sm:px-1.5 py-0.5 rounded ${
                        theme === "dark" ? "bg-slate-600/30" : "bg-slate-200/70"
                      }`}
                    >
                      GW{match.gameweek || 1}
                    </div>
                  </div>
                </div>

                {/* Action Button */}
                {hasPrediction && onViewPrediction && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => onViewPrediction(match.userPrediction || match.prediction)}
                    className={`flex items-center gap-1 sm:gap-1.5 border rounded px-2 sm:px-3 py-1 sm:py-1.5 text-2xs sm:text-xs font-medium transition-all duration-200 opacity-70 hover:opacity-100 ${
                      theme === "dark"
                        ? "bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-200 hover:text-indigo-200 border-indigo-500/30"
                        : "bg-indigo-50 hover:bg-indigo-100 text-indigo-600 hover:text-indigo-700 border-indigo-200"
                    }`}
                  >
                    <EyeOpenIcon className="w-3 h-3 hidden sm:block" />
                    <span className="hidden sm:inline">View</span>
                    <span className="sm:hidden">👁</span>
                  </motion.button>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default TodaysMatchesPanel;
