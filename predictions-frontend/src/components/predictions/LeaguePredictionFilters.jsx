import { useState, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MagnifyingGlassIcon,
  MixerHorizontalIcon,
  Cross2Icon,
  ChevronDownIcon,
} from "@radix-ui/react-icons";
import { ThemeContext } from "../../context/ThemeContext";
import { useUserPreferences } from "../../context/UserPreferencesContext";
import { text, backgrounds } from "../../utils/themeUtils";

const LeaguePredictionFilters = ({
  activeFilter,
  setActiveFilter,
  searchQuery,
  setSearchQuery,
  gameweekFilter,
  setGameweekFilter,
  memberFilter,
  setMemberFilter,
  sortBy,
  setSortBy,
  showFilters,
  setShowFilters,
  cardStyle,
  setCardStyle,
  predictions = [],
  currentGameweek = 1, // Add current gameweek prop
  maxGameweek = 38     // Add max gameweek prop (default to 38 for Premier League)
}) => {
  const { theme } = useContext(ThemeContext);
  const { preferences, updatePreference } = useUserPreferences();

  // Generate all possible gameweeks (1 to maxGameweek or current, whichever is higher)
  const allGameweeks = Array.from(
    { length: Math.max(maxGameweek, currentGameweek) }, 
    (_, i) => i + 1
  ).reverse(); // Reverse to show newest first

  // Extract unique members from predictions for member filter
  // Filter out undefined/null values before sorting
  const availableMembers = [...new Set(predictions.map(p => p.userDisplayName).filter(Boolean))].sort();

  // Filter options
  const filterOptions = [
    { value: "all", label: "All Predictions", count: predictions.length },
    { value: "pending", label: "Pending", count: predictions.filter(p => p.status === "pending").length },
    { value: "completed", label: "Completed", count: predictions.filter(p => p.status === "completed").length },
    { value: "correct", label: "Correct", count: predictions.filter(p => p.correct === "exact" || p.correct === "partial").length },
  ];

  const clearAllFilters = () => {
    setActiveFilter("all");
    setSearchQuery("");
    setGameweekFilter("current"); // Changed from "all" to "current"
    setMemberFilter("all");
    setSortBy("date");
  };

  const hasActiveFilters = 
    activeFilter !== "all" || 
    searchQuery !== "" || 
    gameweekFilter !== "current" ||  // Changed from "all" to "current"
    memberFilter !== "all" || 
    sortBy !== "date";

  return (
    <div className="space-y-4">
      {/* Main Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between pb-4">
        {/* Search and Quick Filters */}
        <div className="flex flex-col sm:flex-row gap-3 flex-1">
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <MagnifyingGlassIcon className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${text.muted[theme]}`} />
            <input
              type="text"
              placeholder="Search predictions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full pl-10 pr-4 py-2 text-sm rounded-lg border ${
                theme === "dark"
                  ? "bg-slate-800/50 border-slate-700 text-white placeholder-slate-400 focus:border-teal-500 focus:ring-teal-500/20"
                  : "bg-white border-slate-300 text-slate-900 placeholder-slate-500 focus:border-teal-500 focus:ring-teal-500/20"
              } focus:ring-2 focus:outline-none transition-colors`}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${text.muted[theme]} hover:${text.primary[theme]} transition-colors`}
              >
                <Cross2Icon className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Quick Filter Buttons */}
          <div className="flex gap-2 flex-wrap">
            {filterOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => setActiveFilter(option.value)}
                className={`px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200 ${
                  activeFilter === option.value
                    ? theme === "dark"
                      ? "bg-teal-600 text-white"
                      : "bg-teal-600 text-white"
                    : theme === "dark"
                    ? "bg-slate-700/50 text-slate-300 hover:bg-slate-700 hover:text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-800"
                } whitespace-nowrap`}
              >
                {option.label}
                {option.count > 0 && (
                  <span className={`ml-1.5 px-1.5 py-0.5 rounded text-xs ${
                    activeFilter === option.value
                      ? "bg-white/20"
                      : theme === "dark"
                      ? "bg-slate-600/50"
                      : "bg-slate-300/50"
                  }`}>
                    {option.count}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Card Style Toggle */}
          <div className="flex items-center gap-2">
            <span className={`text-xs font-medium ${
              theme === 'dark' ? 'text-slate-400' : 'text-slate-500'
            }`}>
              View:
            </span>
            <div className="flex rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700">
              <button
                onClick={() => {
                  setCardStyle('normal');
                  updatePreference('cardStyle', 'normal');
                }}
                className={`px-3 py-1.5 text-xs font-medium transition-colors ${
                  cardStyle === 'normal'
                    ? theme === 'dark'
                      ? 'bg-teal-600 text-white'
                      : 'bg-teal-600 text-white'
                    : theme === 'dark'
                    ? 'bg-slate-800/50 text-slate-300 hover:bg-slate-700'
                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                }`}
              >
                Normal
              </button>
              <button
                onClick={() => {
                  setCardStyle('compact');
                  updatePreference('cardStyle', 'compact');
                }}
                className={`px-3 py-1.5 text-xs font-medium transition-colors ${
                  cardStyle === 'compact'
                    ? theme === 'dark'
                      ? 'bg-teal-600 text-white'
                      : 'bg-teal-600 text-white'
                    : theme === 'dark'
                    ? 'bg-slate-800/50 text-slate-300 hover:bg-slate-700'
                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                }`}
              >
                Compact
              </button>
            </div>
          </div>
        </div>

        {/* Advanced Filters Toggle */}
        <div className="flex items-center gap-2">
          {hasActiveFilters && (
            <button
              onClick={clearAllFilters}
              className={`px-3 py-2 text-xs font-medium rounded-lg transition-colors ${
                theme === "dark"
                  ? "text-slate-400 hover:text-white bg-slate-700/50 hover:bg-slate-700"
                  : "text-slate-600 hover:text-slate-800 bg-slate-100 hover:bg-slate-200"
              }`}
            >
              Clear All
            </button>
          )}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              showFilters
                ? theme === "dark"
                  ? "bg-teal-600/20 text-teal-400 border border-teal-500/30"
                  : "bg-teal-50 text-teal-700 border border-teal-200"
                : theme === "dark"
                ? "bg-slate-700/50 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-600/30"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-800 border border-slate-200"
            }`}
          >
            <MixerHorizontalIcon className="w-4 h-4" />
            Filters
            <motion.div
              animate={{ rotate: showFilters ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronDownIcon className="w-3 h-3" />
            </motion.div>
          </button>
        </div>
      </div>

      {/* Advanced Filters Panel */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div
              className={`p-4 rounded-lg border ${
                theme === "dark"
                  ? "bg-slate-800/30 border-slate-700/50"
                  : "bg-slate-50 border-slate-200"
              }`}
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Gameweek Filter */}
                <div>
                  <label className={`block text-xs font-medium ${text.primary[theme]} mb-2`}>
                    Gameweek
                  </label>
                  <select
                    value={gameweekFilter}
                    onChange={(e) => setGameweekFilter(e.target.value)}
                    className={`w-full px-3 py-2 text-sm rounded-lg border ${
                      theme === "dark"
                        ? "bg-slate-700/50 border-slate-600 text-white"
                        : "bg-white border-slate-300 text-slate-900"
                    } focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 focus:outline-none`}
                  >
                    <option value="current">Current Gameweek ({currentGameweek})</option>
                    {allGameweeks.map((gw) => (
                      <option key={gw} value={gw}>
                        Gameweek {gw}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Member Filter */}
                <div>
                  <label className={`block text-xs font-medium ${text.primary[theme]} mb-2`}>
                    Member
                  </label>
                  <select
                    value={memberFilter}
                    onChange={(e) => setMemberFilter(e.target.value)}
                    className={`w-full px-3 py-2 text-sm rounded-lg border ${
                      theme === "dark"
                        ? "bg-slate-700/50 border-slate-600 text-white"
                        : "bg-white border-slate-300 text-slate-900"
                    } focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 focus:outline-none`}
                  >
                    <option value="all">All Members</option>
                    {availableMembers.map((member) => (
                      <option key={member} value={member}>
                        {member}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Sort By */}
                <div>
                  <label className={`block text-xs font-medium ${text.primary[theme]} mb-2`}>
                    Sort By
                  </label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className={`w-full px-3 py-2 text-sm rounded-lg border ${
                      theme === "dark"
                        ? "bg-slate-700/50 border-slate-600 text-white"
                        : "bg-white border-slate-300 text-slate-900"
                    } focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 focus:outline-none`}
                  >
                    <option value="date">Date (Newest First)</option>
                    <option value="gameweek">Gameweek</option>
                    <option value="member">Member Name</option>
                    <option value="points">Points (Highest First)</option>
                  </select>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LeaguePredictionFilters;