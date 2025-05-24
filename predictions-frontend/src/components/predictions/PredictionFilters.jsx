import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";

const PredictionFilters = ({
  activeFilter,
  setActiveFilter,
  searchQuery,
  setSearchQuery,
  gameweekFilter,
  setGameweekFilter,
  filterTeam,
  setFilterTeam,
  sortBy,
  setSortBy,
  showFilters,
  setShowFilters,
}) => {
  return (
    <div className="bg-primary-600/40 backdrop-blur-md rounded-lg border border-primary-400/20 p-5 pb-2 mb-6">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
        {/* Tabs */}
        <div className="flex bg-primary-700/40 rounded-lg p-1">
          <button
            onClick={() => setActiveFilter("all")}
            className={`px-4 py-2 text-sm rounded-md transition ${
              activeFilter === "all"
                ? "bg-indigo-600 text-white"
                : "text-white/70 hover:text-white"
            }`}
          >
            All
          </button>
          <button
            onClick={() => setActiveFilter("pending")}
            className={`px-4 py-2 text-sm rounded-md transition ${
              activeFilter === "pending"
                ? "bg-indigo-600 text-white"
                : "text-white/70 hover:text-white"
            }`}
          >
            Pending
          </button>
          <button
            onClick={() => setActiveFilter("completed")}
            className={`px-4 py-2 text-sm rounded-md transition ${
              activeFilter === "completed"
                ? "bg-indigo-600 text-white"
                : "text-white/70 hover:text-white"
            }`}
          >
            Completed
          </button>
        </div>

        {/* Search and filter button */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-1 text-white/70 hover:text-white font-outfit transition-colors mr-2 text-md"
          >
            {showFilters ? "Hide filters" : "Show filters"}
          </button>
          <div className="relative">
            <input
              type="text"
              placeholder="Search matches..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-primary-700/40 border border-primary-400/20 rounded-md pl-10 pr-4 py-2 text-white text-sm w-full sm:w-auto min-w-[200px]"
            />
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50" />
          </div>
        </div>
      </div>

      {/* Advanced filters */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="pt-4 border-t border-primary-400/20"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              {/* Gameweek filter */}
              <div>
                <label className="block text-white/70 text-sm mb-1">
                  Gameweek
                </label>
                <select
                  value={gameweekFilter}
                  onChange={(e) => setGameweekFilter(e.target.value)}
                  className="bg-primary-700/40 border border-primary-400/20 rounded-md px-3 py-2 text-white text-sm w-full"
                >
                  <option value="all" className="bg-indigo-800">
                    All Gameweeks
                  </option>
                  {Array.from({ length: 38 }, (_, i) => i + 1).map((gw) => (
                    <option key={gw} value={gw} className="bg-indigo-950">
                      Gameweek {gw}
                    </option>
                  ))}
                </select>
              </div>

              {/* Team filter */}
              <div>
                <label className="block text-white/70 text-sm mb-1">
                  Team
                </label>
                <select
                  value={filterTeam}
                  onChange={(e) => setFilterTeam(e.target.value)}
                  className="bg-primary-700/40 border border-primary-400/20 rounded-md px-3 py-2 text-white text-sm w-full"
                >
                  <option value="all" className="bg-indigo-800">
                    All Teams
                  </option>
                  <option value="Arsenal" className="bg-indigo-950">
                    Arsenal
                  </option>
                  <option value="Chelsea" className="bg-indigo-950">
                    Chelsea
                  </option>
                  <option value="Liverpool" className="bg-indigo-950">
                    Liverpool
                  </option>
                  <option value="Man. City" className="bg-indigo-950">
                    Man. City
                  </option>
                  <option value="Man. United" className="bg-indigo-950">
                    Man. United
                  </option>
                  <option value="Tottenham" className="bg-indigo-950">
                    Tottenham
                  </option>
                </select>
              </div>

              {/* Sort by */}
              <div>
                <label className="block text-white/70 text-sm mb-1">
                  Sort by
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-primary-700/40 border border-primary-400/20 rounded-md px-3 py-2 text-white text-sm w-full"
                >
                  <option value="date" className="bg-indigo-800">
                    Date (newest first)
                  </option>
                  <option value="team" className="bg-indigo-950">
                    Team name
                  </option>
                  <option value="points" className="bg-indigo-950">
                    Points (highest first)
                  </option>
                </select>
              </div>
            </div>

            {/* Reset filters button */}
            <div className="flex justify-end">
              <button
                onClick={() => {
                  setGameweekFilter("all");
                  setFilterTeam("all");
                  setSortBy("date");
                  setSearchQuery("");
                  setActiveFilter("all");
                }}
                className="bg-primary-700/50 hover:bg-primary-700/70 text-white text-sm py-1.5 px-4 rounded-md transition-colors flex items-center"
              >
                Reset filters
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PredictionFilters;