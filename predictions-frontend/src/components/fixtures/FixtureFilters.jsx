import { useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { teams } from "../../data/sampleData";
import { ThemeContext } from "../../context/ThemeContext";
import { getThemeStyles, text } from "../../utils/themeUtils";

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
  // Get theme context
  const { theme } = useContext(ThemeContext);
  return (
    <div
      className={`backdrop-blur-md rounded-lg border p-4 mb-6 ${
        getThemeStyles(theme, {
          dark: "border-slate-700/50 bg-slate-900/60",
          light: "border-slate-200 bg-white/80"
        })
      }`}
    >
      <div className="flex flex-wrap items-center justify-between gap-4">        {/* Tabs */}
        <div className={`flex rounded-lg p-1 ${
          getThemeStyles(theme, {
            dark: "bg-slate-800/60",
            light: "bg-slate-100"
          })
        }`}>
          <button
            onClick={() => setActiveFilter("all")}
            className={`px-4 py-2 text-sm rounded-md transition ${
              activeFilter === "all"
                ? getThemeStyles(theme, {
                    dark: "bg-indigo-600 text-white",
                    light: "bg-indigo-500 text-white"
                  })
                : getThemeStyles(theme, {
                    dark: "text-slate-300 hover:text-white",
                    light: "text-slate-600 hover:text-slate-800"
                  })
            }`}
          >
            All Fixtures
          </button>
          <button
            onClick={() => setActiveFilter("predicted")}
            className={`px-4 py-2 text-sm rounded-md transition ${
              activeFilter === "predicted"
                ? getThemeStyles(theme, {
                    dark: "bg-indigo-600 text-white",
                    light: "bg-indigo-500 text-white"
                  })
                : getThemeStyles(theme, {
                    dark: "text-slate-300 hover:text-white",
                    light: "text-slate-600 hover:text-slate-800"
                  })
            }`}
          >
            Predicted
          </button>
          <button
            onClick={() => setActiveFilter("unpredicted")}
            className={`px-4 py-2 text-sm rounded-md transition ${
              activeFilter === "unpredicted"
                ? getThemeStyles(theme, {
                    dark: "bg-indigo-600 text-white",
                    light: "bg-indigo-500 text-white"
                  })
                : getThemeStyles(theme, {
                    dark: "text-slate-300 hover:text-white",
                    light: "text-slate-600 hover:text-slate-800"
                  })
            }`}
          >
            Unpredicted
          </button>
        </div>

        {/* Search and filter button */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-1 hover:text-white font-outfit transition-colors mr-2 text-sm ${
              getThemeStyles(theme, {
                dark: "text-slate-300 hover:text-white",
                light: "text-slate-600 hover:text-slate-800"
              })
            }`}
          >
            {showFilters ? "Hide filters" : "Show filters"}
          </button>
          <div className="relative">
            <input
              type="text"
              placeholder="Search fixtures..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`border rounded-md pl-10 pr-4 py-2 text-sm w-full sm:w-auto min-w-[200px] ${
                getThemeStyles(theme, {
                  dark: "bg-slate-800/60 border-slate-600/50 text-white placeholder-slate-400",
                  light: "bg-white border-slate-300 text-slate-800 placeholder-slate-500"
                })
              }`}
            />
            <MagnifyingGlassIcon className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${
              getThemeStyles(theme, {
                dark: "text-slate-400",
                light: "text-slate-500"
              })
            }`} />
          </div>
        </div>
      </div>      {/* Advanced filters */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className={`pt-4 border-t ${
              getThemeStyles(theme, {
                dark: "border-slate-700/50",
                light: "border-slate-200"
              })
            }`}
          >
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              {/* Gameweek filter */}
              <div>
                <label className={`block text-sm mb-1 ${getThemeStyles(theme, text.secondary)}`}>
                  Gameweek
                </label>
                <select
                  value={gameweekFilter}
                  onChange={(e) => setGameweekFilter(e.target.value)}
                  className={`border rounded-md px-3 py-2 text-sm w-full ${
                    getThemeStyles(theme, {
                      dark: "bg-slate-800/60 border-slate-600/50 text-white",
                      light: "bg-white border-slate-300 text-slate-800"
                    })
                  }`}
                >
                  <option value="all" className={getThemeStyles(theme, {
                    dark: "bg-slate-800",
                    light: "bg-white"
                  })}>
                    All Gameweeks
                  </option>
                  {Array.from({ length: 38 }, (_, i) => i + 1).map((gw) => (
                    <option key={gw} value={gw} className={getThemeStyles(theme, {
                      dark: "bg-slate-800",
                      light: "bg-white"
                    })}>
                      Gameweek {gw}
                    </option>
                  ))}
                </select>
              </div>

              {/* Team filter */}
              <div>
                <label className={`block text-sm mb-1 ${getThemeStyles(theme, text.secondary)}`}>Team</label>
                <select
                  value={filterTeam}
                  onChange={(e) => setFilterTeam(e.target.value)}
                  className={`border rounded-md px-3 py-2 text-sm w-full ${
                    getThemeStyles(theme, {
                      dark: "bg-slate-800/60 border-slate-600/50 text-white",
                      light: "bg-white border-slate-300 text-slate-800"
                    })
                  }`}
                >
                  <option value="all" className={getThemeStyles(theme, {
                    dark: "bg-slate-800",
                    light: "bg-white"
                  })}>
                    All Teams
                  </option>
                  {teams.map((team) => (
                    <option key={team} value={team} className={getThemeStyles(theme, {
                      dark: "bg-slate-800",
                      light: "bg-white"
                    })}>
                      {team}
                    </option>
                  ))}
                </select>
              </div>

              {/* Competition filter */}
              <div>
                <label className={`block text-sm mb-1 ${getThemeStyles(theme, text.secondary)}`}>
                  Competition
                </label>
                <select
                  value={competitionFilter}
                  onChange={(e) => setCompetitionFilter(e.target.value)}
                  className={`border rounded-md px-3 py-2 text-sm w-full ${
                    getThemeStyles(theme, {
                      dark: "bg-slate-800/60 border-slate-600/50 text-white",
                      light: "bg-white border-slate-300 text-slate-800"
                    })
                  }`}
                >
                  <option value="all" className={getThemeStyles(theme, {
                    dark: "bg-slate-800",
                    light: "bg-white"
                  })}>
                    All Competitions
                  </option>
                  <option value="Premier League" className={getThemeStyles(theme, {
                    dark: "bg-slate-800",
                    light: "bg-white"
                  })}>
                    Premier League
                  </option>
                  <option value="Champions League" className={getThemeStyles(theme, {
                    dark: "bg-slate-800",
                    light: "bg-white"
                  })}>
                    Champions League
                  </option>
                  <option value="Europa League" className={getThemeStyles(theme, {
                    dark: "bg-slate-800",
                    light: "bg-white"
                  })}>
                    Europa League
                  </option>
                  <option
                    value="Europa Conference League"
                    className={getThemeStyles(theme, {
                      dark: "bg-slate-800",
                      light: "bg-white"
                    })}
                  >
                    Conference League
                  </option>
                </select>
              </div>

              {/* Sort by */}
              <div>
                <label className={`block text-sm mb-1 ${getThemeStyles(theme, text.secondary)}`}>
                  Sort by
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className={`border rounded-md px-3 py-2 text-sm w-full ${
                    getThemeStyles(theme, {
                      dark: "bg-slate-800/60 border-slate-600/50 text-white",
                      light: "bg-white border-slate-300 text-slate-800"
                    })
                  }`}
                >
                  <option value="date" className={getThemeStyles(theme, {
                    dark: "bg-slate-800",
                    light: "bg-white"
                  })}>
                    Date (newest first)
                  </option>
                  <option value="gameweek" className={getThemeStyles(theme, {
                    dark: "bg-slate-800",
                    light: "bg-white"
                  })}>
                    Gameweek
                  </option>
                  <option value="team" className={getThemeStyles(theme, {
                    dark: "bg-slate-800",
                    light: "bg-white"
                  })}>
                    Home team
                  </option>
                  <option value="competition" className={getThemeStyles(theme, {
                    dark: "bg-slate-800",
                    light: "bg-white"
                  })}>
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
                className={`text-sm py-1.5 px-4 rounded-md transition-colors flex items-center ${
                  getThemeStyles(theme, {
                    dark: "bg-slate-700/50 hover:bg-slate-700/70 text-slate-300 hover:text-white",
                    light: "bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-800"
                  })
                }`}
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
