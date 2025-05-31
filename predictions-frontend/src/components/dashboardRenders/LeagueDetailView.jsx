import { useState, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { format, parseISO, isValid } from "date-fns";
import {
  ArrowLeftIcon,
  PersonIcon,
  CalendarIcon,
  TargetIcon,
  GearIcon,
  StarIcon,
  ClockIcon,
  Pencil2Icon,
  BarChartIcon,
  StackIcon,
} from "@radix-ui/react-icons";

import { getSampleLeague, upcomingFixtures } from "../../data/sampleData";
import { showToast } from "../../services/notificationService";
import { ThemeContext } from "../../context/ThemeContext";
import { backgrounds, text, buttons } from "../../utils/themeUtils";

const LeagueDetailView = ({ leagueId, onBack, onManage }) => {
  const [activeTab, setActiveTab] = useState("leaderboard");

  // Get theme context
  const { theme } = useContext(ThemeContext);

  // Get league data using the imported function
  const league = getSampleLeague(leagueId);

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

  // Handle making or editing a prediction
  const handlePrediction = (fixtureId) => {
    console.log(`Make prediction for fixture ${fixtureId}`);
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    showToast("League link copied to clipboard!", "success");
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
          <button
            onClick={handleShare}
            className={`flex items-center gap-2 px-3 py-2 ${
              theme === "dark"
                ? "bg-slate-700/60 hover:bg-slate-700/80 border-slate-600/40 text-slate-300 hover:text-white"
                : "bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-600 hover:text-slate-800"
            } border rounded-lg text-sm transition-all duration-200 font-outfit`}
          >
            Share
          </button>
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
                        Created {format(league.lastUpdate, "MMM d, yyyy")}
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
                  </div>
                </div>
              </div>
            </div>

            {/* League Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 shrink-0">
              {" "}
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
                  {/* <TrophyIcon className="w-4 h-4 text-slate-400" /> */}
                  <span
                    className={`text-2xl font-bold ${text.primary[theme]} font-outfit`}
                  >
                    #{league.position || "N/A"}
                  </span>
                </div>
                <span className={`text-xs ${text.muted[theme]} font-outfit`}>
                  Your Rank
                </span>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <TargetIcon className={`w-4 h-4 ${text.muted[theme]}`} />
                  <span
                    className={`text-2xl font-bold ${text.primary[theme]} font-outfit`}
                  >
                    {league.predictions || 0}
                  </span>
                </div>
                <span className={`text-xs ${text.muted[theme]} font-outfit`}>
                  Predictions
                </span>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <StarIcon className={`w-4 h-4 ${text.muted[theme]}`} />
                  <span
                    className={`text-2xl font-bold ${text.primary[theme]} font-outfit`}
                  >
                    {league.points || 0}
                  </span>
                </div>
                <span className={`text-xs ${text.muted[theme]} font-outfit`}>
                  Points
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
          { id: "fixtures", label: "Fixtures", icon: CalendarIcon },
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
              leaderboard={league.leaderboard}
              formatSafeDate={formatSafeDate}
            />
          )}
          {activeTab === "predictions" && (
            <PredictionsContent leagueId={leagueId} />
          )}
          {activeTab === "fixtures" && (
            <FixturesContent
              fixtures={upcomingFixtures}
              handlePrediction={handlePrediction}
            />
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
};

// Leaderboard Content Component
const LeaderboardContent = ({ leaderboard, formatSafeDate }) => {
  const { theme } = useContext(ThemeContext);

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
              {leaderboard && leaderboard.length > 0
                ? `${leaderboard.length} members competing`
                : "No rankings yet"}
            </p>
          </div>
        </div>
      </div>

      {leaderboard && leaderboard.length > 0 ? (
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
              {leaderboard.map((player, index) => (
                <motion.tr
                  key={player.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`${
                    theme === "dark"
                      ? "hover:bg-slate-700/20"
                      : "hover:bg-slate-50"
                  } transition-colors`}
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
                        {player.name.charAt(0)}
                      </div>
                      <div>
                        <div
                          className={`${text.primary[theme]} font-medium font-outfit`}
                        >
                          {player.name}
                        </div>
                        <div
                          className={`${text.muted[theme]} text-sm font-outfit`}
                        >
                          {index === 0
                            ? "🏆 Champion"
                            : index === 1
                            ? "🥈 Runner-up"
                            : index === 2
                            ? "🥉 Third place"
                            : "Competitor"}
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
                        {formatSafeDate(player.joinedDate, "MMM d, yyyy")}
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
const PredictionsContent = ({ leagueId }) => {
  const { theme } = useContext(ThemeContext);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="text-center py-12"
    >
      <TargetIcon className={`w-12 h-12 ${text.muted[theme]} mx-auto mb-4`} />
      <h3
        className={`text-lg font-semibold ${text.primary[theme]} mb-2 font-outfit`}
      >
        League Predictions
      </h3>
      <p className={`${text.muted[theme]} mb-6 font-outfit`}>
        View and compare predictions from all league members
      </p>
      <button
        className={`px-6 py-3 ${
          buttons.primary[theme]
        } rounded-xl font-medium font-outfit transition-colors shadow-lg ${
          theme === "dark" ? "shadow-teal-600/20" : "shadow-teal-600/10"
        }`}
      >
        View All Predictions
      </button>
    </motion.div>
  );
};

// Fixtures Content Component
const FixturesContent = ({ fixtures, handlePrediction }) => {
  const { theme } = useContext(ThemeContext);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-4"
    >
      {fixtures && fixtures.length > 0 ? (
        fixtures.slice(0, 5).map((fixture, index) => (
          <motion.div
            key={fixture.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`flex items-center justify-between p-4 ${
              theme === "dark"
                ? "bg-slate-800/30 border-slate-700/50 hover:border-slate-600/60"
                : "bg-white border-slate-200 hover:border-slate-300 shadow-sm"
            } backdrop-blur-sm border rounded-xl transition-all duration-300`}
          >
            {" "}
            <div className="flex items-center gap-4">
              <div className="text-center">
                <div
                  className={`text-sm font-medium ${text.primary[theme]} mb-1 font-outfit`}
                >
                  {format(new Date(fixture.date), "MMM d")}
                </div>
                <div className={`text-xs ${text.muted[theme]} font-outfit`}>
                  {format(new Date(fixture.date), "HH:mm")}
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-right">
                  <div
                    className={`text-sm font-medium ${text.primary[theme]} font-outfit`}
                  >
                    {fixture.homeTeam}
                  </div>
                </div>
                <div className={`${text.muted[theme]} text-sm font-outfit`}>
                  vs
                </div>
                <div className="text-left">
                  <div
                    className={`text-sm font-medium ${text.primary[theme]} font-outfit`}
                  >
                    {fixture.awayTeam}
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {fixture.status === "pending" ? (
                <div
                  className={`flex items-center gap-2 ${
                    theme === "dark" ? "text-amber-400" : "text-amber-600"
                  }`}
                >
                  <ClockIcon className="w-4 h-4" />
                  <span className="text-sm font-outfit">Pending</span>
                </div>
              ) : (
                <div className="text-center">
                  <div
                    className={`text-lg font-bold ${text.primary[theme]} font-outfit`}
                  >
                    {fixture.homeScore} - {fixture.awayScore}
                  </div>
                  <div
                    className={`text-xs ${
                      theme === "dark" ? "text-emerald-400" : "text-emerald-600"
                    } font-outfit`}
                  >
                    Final
                  </div>
                </div>
              )}

              {fixture.status === "pending" && (
                <button
                  onClick={() => handlePrediction(fixture.id)}
                  className={`flex items-center gap-2 px-3 py-2 ${
                    theme === "dark"
                      ? "bg-teal-600/20 hover:bg-teal-600/30 border-teal-500/30 text-teal-400"
                      : "bg-teal-100 hover:bg-teal-200 border-teal-200 text-teal-600"
                  } border rounded-lg text-sm font-outfit transition-all duration-200`}
                >
                  <Pencil2Icon className="w-4 h-4" />
                  Predict
                </button>
              )}
            </div>
          </motion.div>
        ))
      ) : (
        <div className="text-center py-12">
          <CalendarIcon
            className={`w-12 h-12 ${text.muted[theme]} mx-auto mb-4`}
          />
          <h3
            className={`text-lg font-semibold ${text.primary[theme]} mb-2 font-outfit`}
          >
            No Fixtures
          </h3>
          <p className={`${text.muted[theme]} font-outfit`}>
            Check back later for upcoming matches!
          </p>
        </div>
      )}
    </motion.div>
  );
};

export default LeagueDetailView;
