import { useState, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MagnifyingGlassIcon,
  MixerHorizontalIcon,
  Cross2Icon,
  ChevronDownIcon,
} from "@radix-ui/react-icons";
import { ThemeContext } from "../../context/ThemeContext";
import { text, backgrounds } from "../../utils/themeUtils";

const FixtureFilters = ({
  activeFilter,
  setActiveFilter,
  searchQuery,
  setSearchQuery,
  dateFilter,
  setDateFilter,
  sortBy,
  setSortBy,
  showFilters,
  setShowFilters,
  filterTeam,
  setFilterTeam,
  fixtures = [], // Add fixtures prop to calculate counts
}) => {
  const { theme } = useContext(ThemeContext);
  const [showSearchOnMobile, setShowSearchOnMobile] = useState(false);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  // Calculate filter counts based on fixtures
  const filterOptions = [
    { value: "all", label: "All Fixtures", count: fixtures.length },
    { value: "predicted", label: "Predicted", count: fixtures.filter(f => f.hasPrediction).length },
    { value: "unpredicted", label: "Unpredicted", count: fixtures.filter(f => !f.hasPrediction).length },
  ];
  
  // Extract unique teams for team filter
  const availableTeams = [...new Set(fixtures.flatMap(f => [f.homeTeam, f.awayTeam]))].sort();

  const clearAllFilters = () => {
    setActiveFilter("all");
    setSearchQuery("");
    setDateFilter("all");
    setSortBy("date");
    setFilterTeam("all");
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
    dateFilter !== "all" || 
    sortBy !== "date" ||
    filterTeam !== "all";

  return (
    <div>
      {/* MOBILE VIEW - Icon-based layout */}
      <div className="sm:hidden">
        {/* Row 1: Search Icon + Filters Button - Reduced size */}
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
                  placeholder="Search fixtures..."
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
                      {/* Date Filter */}
                      <div>
                        <label className={`block text-xs font-medium mb-2 ${text.secondary[theme]}`}>
                          Date
                        </label>
                        <select
                          value={dateFilter}
                          onChange={(e) => setDateFilter(e.target.value)}
                          className={`w-full px-3 py-2 text-sm rounded-lg border ${
                            theme === "dark"
                              ? "bg-slate-800/50 border-slate-700 text-white"
                              : "bg-white border-slate-300 text-slate-900"
                          } focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 focus:outline-none transition-colors`}
                        >
                          <option value="all">All Matches</option>
                          <option value="today">Today's Matches</option>
                          <option value="upcoming">Upcoming</option>
                          <option value="finished">Finished</option>
                        </select>
                      </div>

                      {/* Team Filter */}
                      <div>
                        <label className={`block text-xs font-medium mb-2 ${text.secondary[theme]}`}>
                          Team
                        </label>
                        <select
                          value={filterTeam}
                          onChange={(e) => setFilterTeam(e.target.value)}
                          className={`w-full px-3 py-2 text-sm rounded-lg border ${
                            theme === "dark"
                              ? "bg-slate-800/50 border-slate-700 text-white"
                              : "bg-white border-slate-300 text-slate-900"
                          } focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 focus:outline-none transition-colors`}
                        >
                          <option value="all">All Teams</option>
                          {availableTeams.map((team) => (
                            <option key={team} value={team}>
                              {team}
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
                          <option value="date-asc">Date (Oldest First)</option>
                          <option value="gameweek">Gameweek (High to Low)</option>
                          <option value="gameweek-asc">Gameweek (Low to High)</option>
                          <option value="team">Home Team (A-Z)</option>
                          <option value="team-desc">Home Team (Z-A)</option>
                          <option value="competition">Competition (A-Z)</option>
                          <option value="competition-desc">Competition (Z-A)</option>
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

      {/* DESKTOP VIEW - Original layout unchanged */}
      <div className="hidden sm:block">
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between mb-4">
        {/* Search and Quick Filters */}
        <div className="flex flex-col sm:flex-row gap-3 flex-1">
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <MagnifyingGlassIcon className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${text.muted[theme]}`} />
            <input
              type="text"
              placeholder="Search fixtures..."
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
              opacity: { duration: 0.2 }
            }}
            className={`border-t pt-4 pb-4 overflow-hidden ${
              theme === "dark" ? "border-slate-700/50" : "border-slate-200"
            }`}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Date Filter */}
              <div>
                <label className={`block text-xs font-medium mb-2 ${text.secondary[theme]}`}>
                  Date
                </label>
                <select
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                  className={`w-full px-3 py-2 text-sm rounded-lg border ${
                    theme === "dark"
                      ? "bg-slate-800/50 border-slate-700 text-white"
                      : "bg-white border-slate-300 text-slate-900"
                  } focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 focus:outline-none transition-colors`}
                >
                  <option value="all">All Matches</option>
                  <option value="today">Today's Matches</option>
                  <option value="upcoming">Upcoming</option>
                  <option value="finished">Finished</option>
                </select>
              </div>

              {/* Team Filter */}
              <div>
                <label className={`block text-xs font-medium mb-2 ${text.secondary[theme]}`}>
                  Team
                </label>
                <select
                  value={filterTeam}
                  onChange={(e) => setFilterTeam(e.target.value)}
                  className={`w-full px-3 py-2 text-sm rounded-lg border ${
                    theme === "dark"
                      ? "bg-slate-800/50 border-slate-700 text-white"
                      : "bg-white border-slate-300 text-slate-900"
                  } focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 focus:outline-none transition-colors`}
                >
                  <option value="all">All Teams</option>
                  {availableTeams.map((team) => (
                    <option key={team} value={team}>
                      {team}
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
                  <option value="date-asc">Date (Oldest First)</option>
                  <option value="gameweek">Gameweek (High to Low)</option>
                  <option value="gameweek-asc">Gameweek (Low to High)</option>
                  <option value="team">Home Team (A-Z)</option>
                  <option value="team-desc">Home Team (Z-A)</option>
                  <option value="competition">Competition (A-Z)</option>
                  <option value="competition-desc">Competition (Z-A)</option>
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

export default FixtureFilters;
