import { useState, useContext, useEffect } from "react";
import { motion } from "framer-motion";
import { format, parseISO, isValid } from "date-fns";
import {
  ArrowLeftIcon,
  PersonIcon,
  CalendarIcon,
  TargetIcon,
  GearIcon,
  StarIcon,
  BarChartIcon,
  StackIcon,
  ExclamationTriangleIcon,
  CopyIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  ListBulletIcon,
  TableIcon,
  LayoutIcon,
} from "@radix-ui/react-icons";

import { showToast } from "../../services/notificationService";
import { ThemeContext } from "../../context/ThemeContext";
import { useUserPreferences } from "../../context/UserPreferencesContext";
import { text } from "../../utils/themeUtils";
import { spacing, padding } from "../../utils/mobileScaleUtils";
import leagueAPI from "../../services/api/leagueAPI";
import ViewToggleBarHybrid from "../ui/ViewToggleBarHybrid";
import TabNavigation from "../ui/TabNavigation";
import LeaguePredictionContentView from "../predictions/LeaguePredictionContentView";
import LeaguePredictionFilters from "../predictions/LeaguePredictionFilters";

// League-specific view options (uses "By Member" instead of "By Team")
const leagueViews = [
  { id: "stack", icon: StackIcon, label: "Stack View", description: "Swipeable cards by date" },
  { id: "list", icon: ListBulletIcon, label: "Grid View", description: "Compact grid layout" },
  { id: "teams", icon: PersonIcon, label: "By Member", description: "Grouped by member" },
  { id: "calendar", icon: CalendarIcon, label: "Calendar", description: "Monthly calendar view" },
  { id: "table", icon: TableIcon, label: "Table View", description: "Detailed table format" },
  { id: "carousel", icon: LayoutIcon, label: "Carousel", description: "Horizontal scrolling" },
];

// League detail tab options
const leagueTabs = [
  { id: "leaderboard", label: "Leaderboard", icon: TargetIcon },
  { id: "predictions", label: "Predictions", icon: StackIcon },
];

// ─── Container Card helper classes ──────────────────────────
const containerCard = (theme) =>
  `${
    theme === "dark"
      ? "backdrop-blur-xl border-slate-700/50 bg-slate-900/60 shadow-xl shadow-slate-950/50"
      : "border-slate-200 bg-white/80 backdrop-blur-sm shadow-lg shadow-slate-900/5"
  } rounded-xl border overflow-hidden font-outfit`;

const containerHeader = (theme) =>
  `${
    theme === "dark"
      ? "bg-slate-800/30 border-b border-slate-700/30"
      : "bg-slate-50/50 border-b border-slate-200/50"
  } ${padding.cardCompact}`;

const LeagueDetailView = ({ leagueId, league, onBack, onManage, essentialData }) => {
  const { theme } = useContext(ThemeContext);
  const [activeTab, setActiveTab] = useState("leaderboard");

  if (!league) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col justify-center items-center py-12 space-y-4"
      >
        <div className={`w-8 h-8 border-2 ${theme === 'dark' ? 'border-teal-400' : 'border-teal-600'} border-t-transparent rounded-full animate-spin`}></div>
        <p className={`text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'} font-outfit`}>
          Loading league details...
        </p>
      </motion.div>
    );
  }

  const formatSafeDate = (dateValue, formatString) => {
    try {
      if (!dateValue) return "N/A";
      const date = typeof dateValue === "string" ? parseISO(dateValue) : new Date(dateValue);
      if (!isValid(date)) return "N/A";
      return format(date, formatString);
    } catch {
      return "N/A";
    }
  };

  const handleCopyJoinCode = () => {
    if (league.joinCode) {
      navigator.clipboard.writeText(league.joinCode);
      showToast("Join code copied to clipboard!", "success");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className={spacing.normal}
    >
      {/* Back Navigation */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <button
          onClick={onBack}
          className={`flex items-center gap-2 ${
            theme === "dark"
              ? "text-slate-400 hover:text-white"
              : "text-slate-600 hover:text-slate-800"
          } transition-colors group font-outfit`}
        >
          <ArrowLeftIcon className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-medium">Back to Leagues</span>
        </button>
        <div className="flex items-center gap-3">
          {league.isAdmin && (
            <button
              onClick={() => onManage(league.id)}
              className={`flex items-center gap-2 px-3 py-2 ${
                theme === "dark"
                  ? "bg-teal-600/20 hover:bg-teal-600/30 border-teal-500/30 text-teal-400 hover:text-teal-300"
                  : "bg-teal-100 hover:bg-teal-200 border-teal-200 text-teal-600 hover:text-teal-700"
              } border rounded-lg text-sm transition-all duration-200 font-outfit`}
            >
              <GearIcon className="w-4 h-4" />
              Manage
            </button>
          )}
        </div>
      </motion.div>

      {/* League Hero Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className={`relative overflow-hidden rounded-2xl ${
          theme === "dark"
            ? "bg-gradient-to-r from-slate-800/50 to-slate-700/30 border-slate-600/30"
            : "bg-gradient-to-r from-slate-100 to-slate-50 border-slate-200 shadow-sm"
        } border backdrop-blur-sm`}
      >
        <div
          className={`absolute inset-0 ${
            theme === "dark"
              ? "bg-gradient-to-br from-teal-500/10 to-indigo-500/10"
              : "bg-gradient-to-br from-teal-500/5 to-indigo-500/5"
          }`}
        />
        <div className="relative p-4 sm:p-6 md:p-8">
          <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className={`text-2xl sm:text-3xl font-bold ${text.primary[theme]} font-dmSerif`}>
                      {league.name}
                    </h1>
                    {league.isAdmin && (
                      <span
                        className={`px-2 py-1 ${
                          theme === "dark"
                            ? "bg-amber-500/10 border-amber-500/20 text-amber-400"
                            : "bg-amber-50 border-amber-200 text-amber-600"
                        } border rounded-lg text-xs font-medium font-outfit`}
                      >
                        Admin
                      </span>
                    )}
                  </div>
                  <p className={`${text.secondary[theme]} max-w-2xl leading-relaxed font-outfit text-sm sm:text-base`}>
                    {league.description}
                  </p>
                  <div className={`flex flex-wrap items-center gap-3 sm:gap-4 mt-3 text-xs sm:text-sm ${text.muted[theme]} font-outfit`}>
                    <div className="flex items-center gap-1">
                      <CalendarIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      <span>Created {formatSafeDate(league.createdAt, "MMM d, yyyy")}</span>
                    </div>
                    <span className={`w-1 h-1 ${theme === "dark" ? "bg-slate-500" : "bg-slate-400"} rounded-full`} />
                    <div className="flex items-center gap-1">
                      <span className="capitalize">{league.type}</span> League
                    </div>
                    {league.joinCode && (
                      <>
                        <span className={`w-1 h-1 ${theme === "dark" ? "bg-slate-500" : "bg-slate-400"} rounded-full`} />
                        <div className="flex items-center gap-2">
                          <span>Code: {league.joinCode}</span>
                          <button
                            onClick={handleCopyJoinCode}
                            className={`p-1 rounded-md transition-colors ${
                              theme === "dark"
                                ? "hover:bg-slate-700 text-slate-400 hover:text-slate-300"
                                : "hover:bg-slate-200 text-slate-600 hover:text-slate-700"
                            }`}
                            title="Copy join code"
                          >
                            <CopyIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-3 gap-3 sm:gap-4 lg:gap-6 shrink-0">
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <PersonIcon className={`w-4 h-4 ${text.muted[theme]}`} />
                  <span className={`text-xl sm:text-2xl font-bold ${text.primary[theme]} font-outfit`}>
                    {league.members}
                  </span>
                </div>
                <span className={`text-xs ${text.muted[theme]} font-outfit`}>Members</span>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <BarChartIcon className={`w-4 h-4 ${text.muted[theme]}`} />
                  <span className={`text-xl sm:text-2xl font-bold ${text.primary[theme]} font-outfit`}>
                    #{league.position}
                  </span>
                </div>
                <span className={`text-xs ${text.muted[theme]} font-outfit`}>Your Rank</span>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <StarIcon className={`w-4 h-4 ${text.muted[theme]}`} />
                  <span className={`text-xl sm:text-2xl font-bold ${text.primary[theme]} font-outfit`}>
                    {league.points}
                  </span>
                </div>
                <span className={`text-xs ${text.muted[theme]} font-outfit`}>Your Points</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Tab Navigation */}
      <TabNavigation
        tabs={leagueTabs}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Tab Content */}
      {activeTab === "leaderboard" && (
        <LeaderboardSection leagueId={leagueId} formatSafeDate={formatSafeDate} />
      )}
      {activeTab === "predictions" && (
        <PredictionsSection leagueId={leagueId} essentialData={essentialData} />
      )}
    </motion.div>
  );
};

// ─── Leaderboard Section ─────────────────────────────────────
const INITIAL_DISPLAY_COUNT = 5;

const LeaderboardSection = ({ leagueId, formatSafeDate }) => {
  const { theme } = useContext(ThemeContext);
  const [standings, setStandings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    const fetchStandings = async () => {
      try {
        setLoading(true);
        const data = await leagueAPI.getLeagueStandings(leagueId);
        const sortedStandings = (data.standings || []).sort((a, b) => b.points - a.points);
        setStandings(sortedStandings);
      } catch (err) {
        console.error('Failed to fetch league standings:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (leagueId) {
      fetchStandings();
    }
  }, [leagueId]);

  const displayedStandings = showAll ? standings : standings.slice(0, INITIAL_DISPLAY_COUNT);
  const hasMore = standings.length > INITIAL_DISPLAY_COUNT;

  if (loading) {
    return (
      <div className={containerCard(theme)}>
        <div className="flex justify-center py-12">
          <div className={`w-8 h-8 border-2 ${theme === 'dark' ? 'border-teal-400' : 'border-teal-600'} border-t-transparent rounded-full animate-spin`}></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={containerCard(theme)}>
        <div className="text-center py-12 px-5">
          <ExclamationTriangleIcon className="w-12 h-12 mx-auto mb-2 text-red-500" />
          <p className="font-outfit text-red-500">Failed to load standings</p>
        </div>
      </div>
    );
  }

  return (
    <div className={containerCard(theme)}>
      {/* Content */}
      {standings.length > 0 ? (
        <>
          {/* Info bar */}
          <div className={`${padding.cardCompact} border-b ${theme === "dark" ? "border-slate-700/30" : "border-slate-200"}`}>
            <p className={`${text.muted[theme]} text-xs sm:text-sm font-outfit`}>
              {standings.length} {standings.length === 1 ? "member" : "members"} competing
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className={`border-b ${theme === "dark" ? "border-slate-700/30" : "border-slate-200"}`}>
                  <th className={`px-3 sm:px-5 md:px-6 py-3 text-left text-sm font-medium font-outfit ${text.muted[theme]}`}>Rank</th>
                  <th className={`px-3 sm:px-5 md:px-6 py-3 text-left text-sm font-medium font-outfit ${text.muted[theme]}`}>Player</th>
                  <th className={`px-3 sm:px-5 md:px-6 py-3 text-left text-sm font-medium font-outfit ${text.muted[theme]} hidden sm:table-cell`}>Joined</th>
                  <th className={`px-3 sm:px-5 md:px-6 py-3 text-left text-sm font-medium font-outfit ${text.muted[theme]} hidden sm:table-cell`}>Predictions</th>
                  <th className={`px-3 sm:px-5 md:px-6 py-3 text-right text-sm font-medium font-outfit ${text.muted[theme]}`}>Points</th>
                </tr>
              </thead>
              <tbody className={`divide-y ${theme === "dark" ? "divide-slate-700/20" : "divide-slate-200"}`}>
                {displayedStandings.map((player, index) => (
                  <motion.tr
                    key={player.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={`${
                      player.isCurrentUser
                        ? theme === "dark"
                          ? "bg-teal-900/20 border-teal-500/30"
                          : "bg-teal-50 border-teal-200"
                        : theme === "dark"
                        ? "hover:bg-slate-700/20"
                        : "hover:bg-slate-50"
                    } transition-colors ${player.isCurrentUser ? 'border-l-2' : ''}`}
                  >
                    <td className="px-3 sm:px-5 md:px-6 py-4">
                      <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold font-outfit ${
                          index === 0
                            ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                            : index === 1
                            ? "bg-slate-500/20 text-slate-400 border border-slate-500/30"
                            : index === 2
                            ? "bg-orange-500/20 text-orange-400 border border-orange-500/30"
                            : theme === "dark"
                            ? "bg-slate-700/50 text-slate-300"
                            : "bg-slate-200 text-slate-600"
                        }`}
                      >
                        #{index + 1}
                      </div>
                    </td>
                    <td className="px-3 sm:px-5 md:px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-teal-500 to-indigo-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                          {player.displayName.charAt(0)}
                        </div>
                        <div>
                          <div className={`${text.primary[theme]} font-medium font-outfit`}>
                            {player.displayName}
                          </div>
                          <div className={`${text.muted[theme]} text-sm font-outfit`}>
                            @{player.username}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className={`px-3 sm:px-5 md:px-6 py-4 text-sm ${text.secondary[theme]} hidden sm:table-cell`}>
                      <div className="flex items-center gap-2">
                        <CalendarIcon className={`w-4 h-4 ${text.muted[theme]}`} />
                        <span className="font-outfit">
                          {formatSafeDate(player.joinedAt, "MMM d, yyyy")}
                        </span>
                      </div>
                    </td>
                    <td className="px-3 sm:px-5 md:px-6 py-4 hidden sm:table-cell">
                      <div className={`${text.primary[theme]} font-medium font-outfit`}>
                        {player.predictions || 0}
                      </div>
                      <div className={`${text.muted[theme]} text-sm font-outfit`}>
                        predictions made
                      </div>
                    </td>
                    <td className="px-3 sm:px-5 md:px-6 py-4 text-right">
                      <div className={`text-lg font-bold ${text.primary[theme]} font-outfit`}>
                        {player.points}
                      </div>
                      <div className={`text-sm ${text.muted[theme]} font-outfit`}>
                        points
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Show all / collapse toggle */}
          {hasMore && (
            <div className={`${padding.cardCompact} border-t ${theme === "dark" ? "border-slate-700/30" : "border-slate-200"}`}>
              <button
                onClick={() => setShowAll(!showAll)}
                className={`w-full flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium font-outfit transition-colors ${
                  theme === "dark"
                    ? "text-teal-400 hover:bg-slate-700/50"
                    : "text-teal-600 hover:bg-slate-100"
                }`}
              >
                {showAll ? (
                  <>
                    <ChevronUpIcon className="w-4 h-4" />
                    Show top {INITIAL_DISPLAY_COUNT} only
                  </>
                ) : (
                  <>
                    <ChevronDownIcon className="w-4 h-4" />
                    Show all {standings.length} members
                  </>
                )}
              </button>
            </div>
          )}
        </>
      ) : (
        <div className={`${padding.cardCompact} text-center py-12`}>
          <TargetIcon className={`w-12 h-12 ${text.muted[theme]} mx-auto mb-4`} />
          <h3 className={`text-lg font-semibold ${text.primary[theme]} mb-2 font-outfit`}>
            No Rankings Yet
          </h3>
          <p className={`${text.muted[theme]} font-outfit`}>
            Start making predictions to see the leaderboard!
          </p>
        </div>
      )}
    </div>
  );
};

// ─── Predictions Section ─────────────────────────────────────
const PredictionsSection = ({ leagueId, essentialData }) => {
  const { theme } = useContext(ThemeContext);
  const { preferences, updatePreference } = useUserPreferences();
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const currentGameweek = essentialData?.season?.currentGameweek || 1;

  const [selectedViewMode, setSelectedViewMode] = useState(
    preferences?.defaultLeaguePredictionsView || 'teams'
  );
  const [cardStyle, setCardStyle] = useState(preferences?.cardStyle || 'normal');

  // Filter states
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [gameweekFilter, setGameweekFilter] = useState("current");
  const [memberFilter, setMemberFilter] = useState("all");
  const [sortBy, setSortBy] = useState("date");
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const fetchPredictions = async () => {
      try {
        setLoading(true);
        const gameweekToFetch = gameweekFilter === "current" || gameweekFilter === "all"
          ? currentGameweek
          : parseInt(gameweekFilter);

        const data = await leagueAPI.getLeaguePredictions(leagueId, gameweekToFetch);
        setPredictions(data);
      } catch (err) {
        console.error('Failed to fetch league predictions:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (leagueId) {
      fetchPredictions();
    }
  }, [leagueId, gameweekFilter, currentGameweek]);

  const handleViewModeChange = (viewMode) => {
    setSelectedViewMode(viewMode);
    updatePreference("defaultLeaguePredictionsView", viewMode);
  };

  // Filter predictions
  const filteredPredictions = predictions.filter((prediction) => {
    if (activeFilter === "pending" && prediction.status !== "pending") return false;
    if (activeFilter === "completed" && prediction.status !== "completed") return false;
    if (activeFilter === "correct" && !["exact", "partial"].includes(prediction.correct)) return false;
    if (memberFilter !== "all" && prediction.userDisplayName !== memberFilter) return false;

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        prediction.userDisplayName?.toLowerCase().includes(query) ||
        prediction.homeTeam?.toLowerCase().includes(query) ||
        prediction.awayTeam?.toLowerCase().includes(query)
      );
    }
    return true;
  });

  // Sort predictions
  const sortedPredictions = [...filteredPredictions].sort((a, b) => {
    if (sortBy === "date") {
      return new Date(b.date) - new Date(a.date);
    } else if (sortBy === "gameweek") {
      return b.gameweek - a.gameweek;
    } else if (sortBy === "member") {
      return a.userDisplayName?.localeCompare(b.userDisplayName) || 0;
    } else if (sortBy === "points") {
      if (a.points === null && b.points !== null) return 1;
      if (a.points !== null && b.points === null) return -1;
      if (a.points === null && b.points === null) return 0;
      return b.points - a.points;
    }
    return 0;
  });

  const handlePredictionSelect = (prediction) => {
    // Could open a detailed modal here if needed
  };

  if (loading) {
    return (
      <div className={containerCard(theme)}>
        <div className="flex justify-center py-12">
          <div className={`w-8 h-8 border-2 ${theme === 'dark' ? 'border-teal-400' : 'border-teal-600'} border-t-transparent rounded-full animate-spin`}></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={containerCard(theme)}>
        <div className="text-center py-12 px-5">
          <ExclamationTriangleIcon className="w-12 h-12 mx-auto mb-2 text-red-500" />
          <p className="font-outfit text-red-500">Failed to load predictions</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* View toggle row */}
      <div className="flex justify-end mb-3 sm:mb-4">
        <ViewToggleBarHybrid
          viewMode={selectedViewMode}
          setViewMode={handleViewModeChange}
          views={leagueViews}
        />
      </div>

      {/* Container card with filters + content */}
      <div className={containerCard(theme)}>
        {/* Filters subsection - de-emphasized */}
        <div className={containerHeader(theme)}>
          <LeaguePredictionFilters
            activeFilter={activeFilter}
            setActiveFilter={setActiveFilter}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            gameweekFilter={gameweekFilter}
            setGameweekFilter={setGameweekFilter}
            memberFilter={memberFilter}
            setMemberFilter={setMemberFilter}
            sortBy={sortBy}
            setSortBy={setSortBy}
            showFilters={showFilters}
            setShowFilters={setShowFilters}
            cardStyle={cardStyle}
            setCardStyle={setCardStyle}
            predictions={predictions}
            currentGameweek={currentGameweek}
          />
        </div>

        {/* Content area */}
        <div className={padding.cardCompact}>
          {sortedPredictions.length === 0 ? (
            <div className="text-center py-12">
              <TargetIcon className={`w-12 h-12 ${text.muted[theme]} mx-auto mb-4`} />
              <h3 className={`text-lg font-semibold ${text.primary[theme]} mb-2 font-outfit`}>
                No Predictions Found
              </h3>
              <p className={`${text.secondary[theme]} font-outfit`}>
                {activeFilter !== "all" || searchQuery || memberFilter !== "all"
                  ? "Try adjusting your filters to see more predictions."
                  : predictions.length === 0
                  ? `No predictions have been made for Gameweek ${gameweekFilter === "current" ? currentGameweek : gameweekFilter} yet.`
                  : "League members will appear here once they start making predictions."}
              </p>
            </div>
          ) : (
            <LeaguePredictionContentView
              viewMode={selectedViewMode}
              predictions={sortedPredictions}
              currentGameweek={currentGameweek}
              onPredictionSelect={handlePredictionSelect}
              searchQuery={searchQuery}
              cardStyle={cardStyle}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default LeagueDetailView;
