import { useState, useContext, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
} from "@radix-ui/react-icons";

import { showToast } from "../../services/notificationService";
import { ThemeContext } from "../../context/ThemeContext";
import { useUserPreferences } from "../../context/UserPreferencesContext";
import { backgrounds, text, buttons } from "../../utils/themeUtils";
import leagueAPI from "../../services/api/leagueAPI";
import LeaguePredictionViewToggleBar from "../predictions/LeaguePredictionViewToggleBar";
import LeaguePredictionContentView from "../predictions/LeaguePredictionContentView";
import LeaguePredictionFilters from "../predictions/LeaguePredictionFilters";


const LeagueDetailView = ({ leagueId, league, onBack, onManage, essentialData }) => {
  const [activeTab, setActiveTab] = useState("leaderboard");

  // Get theme context
  const { theme } = useContext(ThemeContext);

  console.log('LeagueDetailView props:', { 
    leagueId, 
    league: league ? 'present' : 'missing',
    currentGameweek: essentialData?.season?.currentGameweek
  });

  // Use the passed league object, with fallback to loading state
  if (!league) {
    console.log('LeagueDetailView: No league data, showing loading state');
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

  console.log('LeagueDetailView: League data found:', league.name);

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

  // Handle sharing league
  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    showToast("League link copied to clipboard!", "success");
  };

  // Handle copying join code
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
      className="space-y-6"
    >
      {/* Header Navigation */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        {" "}
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
          {" "}
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

      {/* League Header */}
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
        <div className="relative p-8">
          <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                {/* <div className="p-3 bg-teal-500/10 rounded-2xl border border-teal-500/20 shrink-0">
                  <TrophyIcon className="w-8 h-8 text-teal-400" />
                </div> */}
                <div className="min-w-0">
                  {" "}
                  <div className="flex items-center gap-3 mb-2">
                    <h1
                      className={`text-2xl lg:text-3xl font-bold ${text.primary[theme]} font-outfit`}
                    >
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
                  <p
                    className={`${text.secondary[theme]} max-w-2xl leading-relaxed font-outfit`}
                  >
                    {league.description}
                  </p>
                  <div
                    className={`flex items-center gap-4 mt-3 text-sm ${text.muted[theme]} font-outfit`}
                  >
                    <div className="flex items-center gap-1">
                      <CalendarIcon className="w-4 h-4" />
                      <span>
                        Created {formatSafeDate(league.createdAt, "MMM d, yyyy")}
                      </span>
                    </div>
                    <span
                      className={`w-1 h-1 ${
                        theme === "dark" ? "bg-slate-500" : "bg-slate-400"
                      } rounded-full`}
                    />
                    <div className="flex items-center gap-1">
                      <span className="capitalize">{league.type}</span> League
                    </div>
                    {league.joinCode && (
                      <>
                        <span
                          className={`w-1 h-1 ${
                            theme === "dark" ? "bg-slate-500" : "bg-slate-400"
                          } rounded-full`}
                        />
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
                            <CopyIcon className="w-4 h-4" />
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* League Stats Grid */}
            <div className="grid grid-cols-3 lg:grid-cols-3 gap-4 lg:gap-6 shrink-0">
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <PersonIcon className={`w-4 h-4 ${text.muted[theme]}`} />
                  <span
                    className={`text-2xl font-bold ${text.primary[theme]} font-outfit`}
                  >
                    {league.members}
                  </span>
                </div>
                <span className={`text-xs ${text.muted[theme]} font-outfit`}>
                  Members
                </span>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <BarChartIcon className={`w-4 h-4 ${text.muted[theme]}`} />
                  <span
                    className={`text-2xl font-bold ${text.primary[theme]} font-outfit`}
                  >
                    #{league.position}
                  </span>
                </div>
                <span className={`text-xs ${text.muted[theme]} font-outfit`}>
                  Your Rank
                </span>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <StarIcon className={`w-4 h-4 ${text.muted[theme]}`} />
                  <span
                    className={`text-2xl font-bold ${text.primary[theme]} font-outfit`}
                  >
                    {league.points}
                  </span>
                </div>
                <span className={`text-xs ${text.muted[theme]} font-outfit`}>
                  Your Points
                </span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Tab Navigation */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className={`flex ${
          theme === "dark"
            ? "bg-slate-800/50 border-slate-700/30"
            : "bg-slate-100 border-slate-200"
        } rounded-2xl p-1 border`}
      >
        {[
          { id: "leaderboard", label: "Leaderboard", icon: TargetIcon },
          { id: "predictions", label: "Predictions", icon: StackIcon },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-medium font-outfit transition-all duration-200 ${
              activeTab === tab.id
                ? `bg-teal-600 text-white shadow-lg ${
                    theme === "dark"
                      ? "shadow-teal-600/20"
                      : "shadow-teal-600/10"
                  }`
                : `${
                    theme === "dark"
                      ? "text-slate-300 hover:text-white hover:bg-slate-700/50"
                      : "text-slate-600 hover:text-slate-800 hover:bg-slate-200"
                  }`
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </motion.div>

      {/* Tab Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <AnimatePresence mode="wait">
          {" "}
          {activeTab === "leaderboard" && (
            <LeaderboardContent
              leagueId={leagueId}
              formatSafeDate={formatSafeDate}
            />
          )}
          {activeTab === "predictions" && (
            <PredictionsContent leagueId={leagueId} essentialData={essentialData} />
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
};

// Leaderboard Content Component
const LeaderboardContent = ({ leagueId, formatSafeDate }) => {
  const { theme } = useContext(ThemeContext);
  const [standings, setStandings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStandings = async () => {
      try {
        setLoading(true);
        const data = await leagueAPI.getLeagueStandings(leagueId);
        // Sort standings by points in descending order
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

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex justify-center py-12"
      >
        <div className={`w-8 h-8 border-2 ${theme === 'dark' ? 'border-teal-400' : 'border-teal-600'} border-t-transparent rounded-full animate-spin`}></div>
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-12"
      >
        <div className={`text-red-500 mb-4`}>
          <ExclamationTriangleIcon className="w-12 h-12 mx-auto mb-2" />
          <p className="font-outfit">Failed to load standings</p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={`${
        theme === "dark"
          ? "bg-slate-800/30 border-slate-700/50"
          : "bg-white border-slate-200"
      } backdrop-blur-sm border rounded-2xl overflow-hidden shadow-sm`}
    >
      <div
        className={`p-6 border-b ${
          theme === "dark" ? "border-slate-700/50" : "border-slate-200"
        }`}
      >
        <div className="flex justify-between items-center">
          <div>
            <h2
              className={`text-xl font-semibold ${text.primary[theme]} mb-1 font-outfit`}
            >
              Leaderboard
            </h2>
            <p className={`${text.muted[theme]} text-sm font-outfit`}>
              {standings && standings.length > 0
                ? `${standings.length} members competing`
                : "No rankings yet"}
            </p>
          </div>
        </div>
      </div>

      {standings && standings.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr
                className={`border-b ${
                  theme === "dark" ? "border-slate-700/30" : "border-slate-200"
                }`}
              >
                <th
                  className={`px-6 py-4 text-left text-sm font-medium font-outfit ${text.muted[theme]}`}
                >
                  Rank
                </th>
                <th
                  className={`px-6 py-4 text-left text-sm font-medium font-outfit ${text.muted[theme]}`}
                >
                  Player
                </th>
                <th
                  className={`px-6 py-4 text-left text-sm font-medium font-outfit ${text.muted[theme]}`}
                >
                  Joined
                </th>
                <th
                  className={`px-6 py-4 text-left text-sm font-medium font-outfit ${text.muted[theme]}`}
                >
                  Predictions
                </th>
                <th
                  className={`px-6 py-4 text-right text-sm font-medium font-outfit ${text.muted[theme]}`}
                >
                  Points
                </th>
              </tr>
            </thead>
            <tbody
              className={`divide-y ${
                theme === "dark" ? "divide-slate-700/20" : "divide-slate-200"
              }`}
            >
              {standings.map((player, index) => (
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
                  <td className="px-6 py-4">
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
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-teal-500 to-indigo-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                        {player.displayName.charAt(0)}
                      </div>
                      <div>
                        <div
                          className={`${text.primary[theme]} font-medium font-outfit`}
                        >
                          {player.displayName}
                        </div>
                        <div
                          className={`${text.muted[theme]} text-sm font-outfit`}
                        >
                          @{player.username}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className={`px-6 py-4 text-sm ${text.secondary[theme]}`}>
                    <div className="flex items-center gap-2">
                      <CalendarIcon
                        className={`w-4 h-4 ${text.muted[theme]}`}
                      />
                      <span className="font-outfit">
                        {formatSafeDate(player.joinedAt, "MMM d, yyyy")}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div
                      className={`${text.primary[theme]} font-medium font-outfit`}
                    >
                      {player.predictions || 0}
                    </div>
                    <div className={`${text.muted[theme]} text-sm font-outfit`}>
                      predictions made
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div
                      className={`text-lg font-bold ${text.primary[theme]} font-outfit`}
                    >
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
      ) : (
        <div className="text-center py-12">
          <TargetIcon
            className={`w-12 h-12 ${text.muted[theme]} mx-auto mb-4`}
          />
          <h3
            className={`text-lg font-semibold ${text.primary[theme]} mb-2 font-outfit`}
          >
            No Rankings Yet
          </h3>
          <p className={`${text.muted[theme]} font-outfit`}>
            Start making predictions to see the leaderboard!
          </p>
        </div>
      )}
    </motion.div>
  );
};

// Predictions Content Component
const PredictionsContent = ({ leagueId, essentialData }) => {
  const { theme } = useContext(ThemeContext);
  const { preferences, updatePreference } = useUserPreferences();
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Get current gameweek from essentialData, fallback to 1
  const currentGameweek = essentialData?.season?.currentGameweek || 1;
  
  const [selectedPrediction, setSelectedPrediction] = useState(null);
  const [selectedViewMode, setSelectedViewMode] = useState(
    preferences?.defaultLeaguePredictionsView || 'teams'
  );
  const [cardStyle, setCardStyle] = useState(preferences?.cardStyle || 'normal');

  // Filter states - following standard pattern
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [gameweekFilter, setGameweekFilter] = useState("current"); // Default to current gameweek
  const [memberFilter, setMemberFilter] = useState("all");
  const [sortBy, setSortBy] = useState("date");
  const [showFilters, setShowFilters] = useState(true);

  // Fetch predictions with gameweek filter
  useEffect(() => {
    const fetchPredictions = async () => {
      try {
        setLoading(true);
        
        // Determine which gameweek to fetch
        // "current" or "all" = use currentGameweek (backend requires gameweek to always be specified)
        // Specific number = that gameweek
        const gameweekToFetch = gameweekFilter === "current" || gameweekFilter === "all"
          ? currentGameweek // Use current gameweek from essentialData
          : parseInt(gameweekFilter);
        
        console.log('📊 Fetching league predictions for gameweek:', {
          filter: gameweekFilter,
          gameweekToFetch,
          currentGameweek
        });
        
        const data = await leagueAPI.getLeaguePredictions(leagueId, gameweekToFetch);
        
        console.log('🔍 Received predictions data:', {
          count: data?.length,
          firstPrediction: data?.[0],
          allUserDisplayNames: data?.map(p => p.userDisplayName),
          allFields: data?.[0] ? Object.keys(data[0]) : []
        });
        
        // Check for any undefined/null fields that might cause issues
        if (data && data.length > 0) {
          const firstPred = data[0];
          const nullFields = Object.entries(firstPred)
            .filter(([key, value]) => value === null || value === undefined)
            .map(([key]) => key);
          
          if (nullFields.length > 0) {
            console.warn('⚠️ Predictions contain null/undefined fields:', nullFields);
          }
        }
        
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

  // Handle view mode changes with preferences persistence
  const handleViewModeChange = (viewMode) => {
    setSelectedViewMode(viewMode);
    updatePreference("defaultLeaguePredictionsView", viewMode);
  };

  // Filter predictions based on active filters
  // NOTE: Gameweek filtering is done server-side via API call
  const filteredPredictions = predictions.filter((prediction) => {
    // Filter by status
    if (activeFilter === "pending" && prediction.status !== "pending") return false;
    if (activeFilter === "completed" && prediction.status !== "completed") return false;
    if (activeFilter === "correct" && !["exact", "partial"].includes(prediction.correct)) return false;

    // NOTE: Gameweek filter removed - handled by API call

    // Filter by member
    if (memberFilter !== "all" && prediction.userDisplayName !== memberFilter) return false;

    // Filter by search query
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

  // Get available gameweeks from predictions
  const availableGameweeks = [...new Set(predictions.map(p => p.gameweek))].sort((a, b) => b - a);

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex justify-center py-12"
      >
        <div className={`w-8 h-8 border-2 ${theme === 'dark' ? 'border-teal-400' : 'border-teal-600'} border-t-transparent rounded-full animate-spin`}></div>
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-12"
      >
        <div className={`text-red-500 mb-4`}>
          <ExclamationTriangleIcon className="w-12 h-12 mx-auto mb-2" />
          <p className="font-outfit">Failed to load predictions</p>
        </div>
      </motion.div>
    );
  }

  // Handler for prediction selection
  const handlePredictionSelect = (prediction) => {
    setSelectedPrediction(prediction);
    // Could open a detailed modal here if needed
    console.log('Selected prediction:', prediction);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={`${
        theme === "dark"
          ? "bg-slate-800/30 border-slate-700/50"
          : "bg-white border-slate-200"
      } backdrop-blur-sm border rounded-2xl overflow-hidden shadow-sm`}
    >
      {/* Header with View Toggle Bar */}
      <div
        className={`p-6 border-b ${
          theme === "dark" ? "border-slate-700/50" : "border-slate-200"
        }`}
      >
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h2
              className={`text-xl font-semibold ${text.primary[theme]} mb-1 font-outfit`}
            >
              League Predictions
            </h2>
            <p className={`${text.muted[theme]} text-sm font-outfit`}>
              View and compare member predictions for this league
            </p>
          </div>

          {/* View Toggle Bar */}
          <div className="flex-shrink-0">
            <LeaguePredictionViewToggleBar
              viewMode={selectedViewMode}
              setViewMode={handleViewModeChange}
            />
          </div>
        </div>
      </div>

      {/* Filters and Content Container */}
      <div className="p-5 font-outfit">
        {/* Prediction Filters */}
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


        {/* League Prediction Content with View System */}
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
          <div className="mt-6">
            <LeaguePredictionContentView
              viewMode={selectedViewMode}
              predictions={sortedPredictions}
              currentGameweek={currentGameweek}
              onPredictionSelect={handlePredictionSelect}
              searchQuery={searchQuery}
              cardStyle={cardStyle}
            />
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default LeagueDetailView;
