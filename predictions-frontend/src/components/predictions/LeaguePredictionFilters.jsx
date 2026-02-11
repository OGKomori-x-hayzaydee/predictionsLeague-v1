import { useState, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MagnifyingGlassIcon,
  MixerHorizontalIcon,
  Cross2Icon,
  ChevronDownIcon,
} from "@radix-ui/react-icons";
import { ThemeContext } from "../../context/ThemeContext";
import { text } from "../../utils/themeUtils";
import ViewToggleBarHybrid from "../ui/ViewToggleBarHybrid";

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
  viewMode,
  setViewMode,
  views,
  predictions = [],
  currentGameweek = 1,
  maxGameweek = 38,
}) => {
  const { theme } = useContext(ThemeContext);
  const [showSearchOnMobile, setShowSearchOnMobile] = useState(false);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  // Generate all possible gameweeks (1 to maxGameweek or current, whichever is higher)
  const allGameweeks = Array.from(
    { length: Math.max(maxGameweek, currentGameweek) },
    (_, i) => i + 1
  ).reverse();

  // Extract unique members from predictions for member filter
  const availableMembers = [...new Set(predictions.map(p => p.userDisplayName).filter(Boolean))].sort();

  // Filter options (league-specific: includes "Correct")
  const filterOptions = [
    { value: "all", label: "All Predictions", count: predictions.length },
    { value: "pending", label: "Pending", count: predictions.filter(p => p.status === "pending").length },
    { value: "completed", label: "Completed", count: predictions.filter(p => p.status === "completed").length },
    { value: "correct", label: "Correct", count: predictions.filter(p => p.correct === "exact" || p.correct === "partial").length },
  ];

  const clearAllFilters = () => {
    setActiveFilter("all");
    setSearchQuery("");
    setGameweekFilter("current");
    setMemberFilter("all");
    setSortBy("date");
    setShowSearchOnMobile(false);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    if (e.target.value === "") {
      setShowSearchOnMobile(false);
    }
  };

  const hasActiveFilters =
    activeFilter !== "all" ||
    searchQuery !== "" ||
    gameweekFilter !== "current" ||
    memberFilter !== "all" ||
    sortBy !== "date";

  return (
    <div>
      {/* MOBILE VIEW - Icon-based compact layout */}
      <div className="sm:hidden">
        {/* Row 1: Search Icon + Filters Button */}
        {!showSearchOnMobile && (
          <div className="flex items-center justify-between mb-2">
            <button
              onClick={() => setShowSearchOnMobile(true)}
              className={`p-2 rounded-md transition-colors ${
                theme === "dark"
                  ? "bg-slate-800/30 text-slate-400 hover:bg-slate-800/50 hover:text-slate-300 border border-slate-700/50"
                  : "bg-slate-50/50 text-slate-500 hover:bg-slate-100 hover:text-slate-700 border border-slate-200/50"
              }`}
            >
              <MagnifyingGlassIcon className="w-4 h-4" />
            </button>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors ${
                theme === "dark"
                  ? "bg-slate-800/30 text-slate-400 hover:bg-slate-800/50 hover:text-slate-300 border border-slate-700/50"
                  : "bg-slate-50/50 text-slate-500 hover:bg-slate-100 hover:text-slate-700 border border-slate-200/50"
              }`}
            >
              <MixerHorizontalIcon className="w-3.5 h-3.5" />
              <span>Filters</span>
              <ChevronDownIcon
                className={`w-3.5 h-3.5 transition-transform ${showFilters ? "rotate-180" : ""}`}
              />
            </button>
          </div>
        )}

        {/* Expanded Search Input */}
        <AnimatePresence>
          {showSearchOnMobile && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="mb-3"
            >
              <div className="relative w-full">
                <MagnifyingGlassIcon className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${text.muted[theme]}`} />
                <input
                  type="text"
                  placeholder="Search predictions..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  autoFocus
                  className={`w-full pl-10 pr-10 py-2.5 text-sm rounded-lg border ${
                    theme === "dark"
                      ? "bg-slate-800/50 border-slate-700 text-white placeholder-slate-400 focus:border-teal-500 focus:ring-teal-500/20"
                      : "bg-white border-slate-300 text-slate-900 placeholder-slate-500 focus:border-teal-500 focus:ring-teal-500/20"
                  } focus:ring-2 focus:outline-none transition-colors`}
                />
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setShowSearchOnMobile(false);
                  }}
                  className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${text.muted[theme]} hover:${text.primary[theme]} transition-colors`}
                >
                  <Cross2Icon className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mobile Filters Drawer */}
        <AnimatePresence>
          {showFilters && !showSearchOnMobile && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: [0.4, 0.0, 0.2, 1] }}
              className="overflow-hidden"
            >
              {/* Quick Filter Buttons */}
              <div className="flex gap-2 flex-wrap mb-3">
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
                    <span className="mr-1">{option.label}</span>
                    <span
                      className={`inline-flex items-center justify-center w-5 h-4 text-xs rounded-full ${
                        activeFilter === option.value
                          ? "bg-white/20 text-white"
                          : theme === "dark"
                          ? "bg-slate-600 text-slate-300"
                          : "bg-slate-200 text-slate-600"
                      }`}
                    >
                      {option.count}
                    </span>
                  </button>
                ))}
              </div>

              {/* View Selector */}
              <div className="flex items-center gap-2 mb-3">
                <ViewToggleBarHybrid viewMode={viewMode} setViewMode={setViewMode} views={views} />
              </div>

              {/* Advanced Filters Toggle */}
              <button
                onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                className={`w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors mb-3 ${
                  theme === "dark"
                    ? "bg-slate-800/50 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-700"
                    : "bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-800 border border-slate-200"
                }`}
              >
                <span>More Filters</span>
                <ChevronDownIcon
                  className={`w-4 h-4 transition-transform ${showAdvancedFilters ? "rotate-180" : ""}`}
                />
              </button>

              {/* Advanced Filters */}
              <AnimatePresence>
                {showAdvancedFilters && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className={`border-t pt-3 pb-1 overflow-hidden ${
                      theme === "dark" ? "border-slate-700/50" : "border-slate-200"
                    }`}
                  >
                    <div className="space-y-3">
                      {/* Gameweek Filter */}
                      <div>
                        <label className={`block text-xs font-medium mb-2 ${text.secondary[theme]}`}>
                          Gameweek
                        </label>
                        <select
                          value={gameweekFilter}
                          onChange={(e) => setGameweekFilter(e.target.value)}
                          className={`w-full px-3 py-2 text-sm rounded-lg border ${
                            theme === "dark"
                              ? "bg-slate-800/50 border-slate-700 text-white"
                              : "bg-white border-slate-300 text-slate-900"
                          } focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 focus:outline-none transition-colors`}
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
                        <label className={`block text-xs font-medium mb-2 ${text.secondary[theme]}`}>
                          Member
                        </label>
                        <select
                          value={memberFilter}
                          onChange={(e) => setMemberFilter(e.target.value)}
                          className={`w-full px-3 py-2 text-sm rounded-lg border ${
                            theme === "dark"
                              ? "bg-slate-800/50 border-slate-700 text-white"
                              : "bg-white border-slate-300 text-slate-900"
                          } focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 focus:outline-none transition-colors`}
                        >
                          <option value="all">All Members</option>
                          {availableMembers.map((member) => (
                            <option key={member} value={member}>
                              {member}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Sort By Filter */}
                      <div>
                        <label className={`block text-xs font-medium mb-2 ${text.secondary[theme]}`}>
                          Sort by
                        </label>
                        <select
                          value={sortBy}
                          onChange={(e) => setSortBy(e.target.value)}
                          className={`w-full px-3 py-2 text-sm rounded-lg border ${
                            theme === "dark"
                              ? "bg-slate-800/50 border-slate-700 text-white"
                              : "bg-white border-slate-300 text-slate-900"
                          } focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 focus:outline-none transition-colors`}
                        >
                          <option value="date">Date (Newest First)</option>
                          <option value="gameweek">Gameweek</option>
                          <option value="member">Member Name</option>
                          <option value="points">Points (Highest First)</option>
                        </select>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Clear All Button */}
              {hasActiveFilters && (
                <button
                  onClick={clearAllFilters}
                  className={`w-full mt-3 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                    theme === "dark"
                      ? "bg-red-600/20 text-red-400 hover:bg-red-600/30 border border-red-600/30"
                      : "bg-red-50 text-red-600 hover:bg-red-100 border border-red-200"
                  }`}
                >
                  Clear All Filters
                </button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* DESKTOP VIEW - Full inline layout */}
      <div className="hidden sm:block">
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between mb-4">
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
                  <span className="mr-1">{option.label}</span>
                  <span
                    className={`inline-flex items-center justify-center w-5 h-4 text-xs rounded-full ${
                      activeFilter === option.value
                        ? "bg-white/20 text-white"
                        : theme === "dark"
                        ? "bg-slate-600 text-slate-300"
                        : "bg-slate-200 text-slate-600"
                    }`}
                  >
                    {option.count}
                  </span>
                </button>
              ))}
            </div>

            {/* View Selector */}
            <div className="flex items-center">
              <ViewToggleBarHybrid viewMode={viewMode} setViewMode={setViewMode} views={views} />
            </div>
          </div>

          {/* Filter Toggle Button */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                theme === "dark"
                  ? "bg-slate-800/50 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-700"
                  : "bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-800 border border-slate-200"
              }`}
            >
              <MixerHorizontalIcon className="w-4 h-4" />
              <span>Filters</span>
              <ChevronDownIcon
                className={`w-4 h-4 transition-transform ${showFilters ? "rotate-180" : ""}`}
              />
            </button>

            {hasActiveFilters && (
              <button
                onClick={clearAllFilters}
                className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                  theme === "dark"
                    ? "bg-red-600/20 text-red-400 hover:bg-red-600/30 border border-red-600/30"
                    : "bg-red-50 text-red-600 hover:bg-red-100 border border-red-200"
                }`}
              >
                Clear All
              </button>
            )}
          </div>
        </div>

        {/* Advanced Filters */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0, marginTop: 0 }}
              animate={{ opacity: 1, height: "auto", marginTop: 16 }}
              exit={{ opacity: 0, height: 0, marginTop: 0 }}
              transition={{
                duration: 0.3,
                ease: [0.4, 0.0, 0.2, 1],
                opacity: { duration: 0.2 },
              }}
              className={`border-t pt-4 pb-4 overflow-hidden ${
                theme === "dark" ? "border-slate-700/50" : "border-slate-200"
              }`}
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Gameweek Filter */}
                <div>
                  <label className={`block text-xs font-medium mb-2 ${text.secondary[theme]}`}>
                    Gameweek
                  </label>
                  <select
                    value={gameweekFilter}
                    onChange={(e) => setGameweekFilter(e.target.value)}
                    className={`w-full px-3 py-2 text-sm rounded-lg border ${
                      theme === "dark"
                        ? "bg-slate-800/50 border-slate-700 text-white"
                        : "bg-white border-slate-300 text-slate-900"
                    } focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 focus:outline-none transition-colors`}
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
                  <label className={`block text-xs font-medium mb-2 ${text.secondary[theme]}`}>
                    Member
                  </label>
                  <select
                    value={memberFilter}
                    onChange={(e) => setMemberFilter(e.target.value)}
                    className={`w-full px-3 py-2 text-sm rounded-lg border ${
                      theme === "dark"
                        ? "bg-slate-800/50 border-slate-700 text-white"
                        : "bg-white border-slate-300 text-slate-900"
                    } focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 focus:outline-none transition-colors`}
                  >
                    <option value="all">All Members</option>
                    {availableMembers.map((member) => (
                      <option key={member} value={member}>
                        {member}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Sort By Filter */}
                <div>
                  <label className={`block text-xs font-medium mb-2 ${text.secondary[theme]}`}>
                    Sort by
                  </label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className={`w-full px-3 py-2 text-sm rounded-lg border ${
                      theme === "dark"
                        ? "bg-slate-800/50 border-slate-700 text-white"
                        : "bg-white border-slate-300 text-slate-900"
                    } focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 focus:outline-none transition-colors`}
                  >
                    <option value="date">Date (Newest First)</option>
                    <option value="gameweek">Gameweek</option>
                    <option value="member">Member Name</option>
                    <option value="points">Points (Highest First)</option>
                  </select>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      {/* End Desktop View */}
    </div>
  );
};

export default LeaguePredictionFilters;
