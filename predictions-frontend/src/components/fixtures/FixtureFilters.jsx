import { motion, AnimatePresence } from "framer-motion";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { teams } from "../../data/sampleData";

const FixtureFilters = ({
  activeFilter,
  setActiveFilter,
  searchQuery,
  setSearchQuery,
  gameweekFilter,
  setGameweekFilter,
  filterTeam,
  setFilterTeam,
  competitionFilter,
  setCompetitionFilter,
  sortBy,
  setSortBy,
  showFilters,
  setShowFilters,
}) => {
  return (
    <div className=" backdrop-blur-md rounded-lg border border-primary-400/20 p-5 pb-2 mb-6">
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
            onClick={() => setActiveFilter("upcoming")}
            className={`px-4 py-2 text-sm rounded-md transition ${
              activeFilter === "upcoming"
                ? "bg-indigo-600 text-white"
                : "text-white/70 hover:text-white"
            }`}
          >
            Upcoming
          </button>
          <button
            onClick={() => setActiveFilter("predicted")}
            className={`px-4 py-2 text-sm rounded-md transition ${
              activeFilter === "predicted"
                ? "bg-indigo-600 text-white"
                : "text-white/70 hover:text-white"
            }`}
          >
            Predicted
          </button>
        </div>

        {/* Search and filter button */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-1 text-white/70 hover:text-white font-outfit transition-colors mr-2 text-sm"
          >
            {showFilters ? "Hide filters" : "Show filters"}
          </button>
          <div className="relative">
            <input
              type="text"
              placeholder="Search fixtures..."
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
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
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
                  {teams.map(team => (
                    <option key={team} value={team} className="bg-indigo-950">
                      {team}
                    </option>
                  ))}
                </select>
              </div>

              {/* Competition filter */}
              <div>
                <label className="block text-white/70 text-sm mb-1">
                  Competition
                </label>
                <select
                  value={competitionFilter}
                  onChange={(e) => setCompetitionFilter(e.target.value)}
                  className="bg-primary-700/40 border border-primary-400/20 rounded-md px-3 py-2 text-white text-sm w-full"
                >
                  <option value="all" className="bg-indigo-800">
                    All Competitions
                  </option>
                  <option value="Premier League" className="bg-indigo-950">
                    Premier League
                  </option>
                  <option value="Champions League" className="bg-indigo-950">
                    Champions League
                  </option>
                  <option value="Europa League" className="bg-indigo-950">
                    Europa League
                  </option>
                  <option value="Europa Conference League" className="bg-indigo-950">
                    Conference League
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
                  <option value="gameweek" className="bg-indigo-950">
                    Gameweek
                  </option>
                  <option value="team" className="bg-indigo-950">
                    Home team
                  </option>
                  <option value="competition" className="bg-indigo-950">
                    Competition
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
                  setCompetitionFilter("all");
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

export default FixtureFilters;
