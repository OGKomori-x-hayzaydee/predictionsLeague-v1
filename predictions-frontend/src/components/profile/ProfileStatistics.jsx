import React, { useContext } from "react";
import { motion } from "framer-motion";
import { 
  BarChartIcon, 
  CalendarIcon, 
  TargetIcon,
  RocketIcon,
  LightningBoltIcon,
  PersonIcon,
  ActivityLogIcon
} from "@radix-ui/react-icons";
import { ThemeContext } from "../../context/ThemeContext";
import { text } from "../../utils/themeUtils";

const ProfileStatistics = () => {
  const { theme } = useContext(ThemeContext);

  // Sample detailed statistics
  const detailedStats = {
    monthlyPerformance: [
      { month: "Jan", points: 142, predictions: 18, accuracy: 72 },
      { month: "Feb", points: 156, predictions: 20, accuracy: 78 },
      { month: "Mar", points: 134, predictions: 17, accuracy: 65 },
      { month: "Apr", points: 189, predictions: 22, accuracy: 86 },
      { month: "May", points: 167, predictions: 21, accuracy: 81 },
      { month: "Jun", points: 145, predictions: 19, accuracy: 74 },
      { month: "Jul", points: 98, predictions: 12, accuracy: 83 }
    ],
    teamPerformance: [
      { team: "Arsenal", predictions: 42, correct: 34, accuracy: 81, points: 387 },
      { team: "Manchester City", predictions: 38, correct: 28, accuracy: 74, points: 312 },
      { team: "Liverpool", predictions: 41, correct: 31, accuracy: 76, points: 348 },
      { team: "Chelsea", predictions: 39, correct: 25, accuracy: 64, points: 276 },
      { team: "Manchester United", predictions: 40, correct: 29, accuracy: 73, points: 325 },
      { team: "Tottenham", predictions: 37, correct: 24, accuracy: 65, points: 264 }
    ],
    competitionStats: [
      { competition: "Premier League", predictions: 198, correct: 142, accuracy: 72, points: 1542 },
      { competition: "FA Cup", predictions: 12, correct: 9, accuracy: 75, points: 98 },
      { competition: "League Cup", predictions: 15, correct: 8, accuracy: 53, points: 87 },
      { competition: "Champions League", predictions: 12, correct: 7, accuracy: 58, points: 72 }
    ],
    streakHistory: [
      { type: "Current Streak", value: 3, description: "Weeks with correct predictions" },
      { type: "Longest Streak", value: 7, description: "Best consecutive correct predictions" },
      { type: "Perfect Gameweeks", value: 2, description: "Gameweeks with 100% accuracy" },
      { type: "Prediction Frequency", value: 94, description: "Percentage of available matches predicted" }
    ]
  };

  const getBarWidth = (value, max) => {
    return (value / max) * 100;
  };

  const maxMonthlyPoints = Math.max(...detailedStats.monthlyPerformance.map(m => m.points));
  const maxTeamPoints = Math.max(...detailedStats.teamPerformance.map(t => t.points));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className={`${theme === 'dark' ? 'text-teal-100' : 'text-teal-700'} text-2xl font-bold font-dmSerif mb-2`}>
          Performance Statistics
        </h2>
        <p className={`${text.secondary[theme]} font-outfit`}>
          Detailed analytics of your prediction performance
        </p>
      </div>

      {/* Monthly Performance Chart */}
      <div className={`${
        theme === "dark"
          ? "bg-slate-800/40 border-slate-700/50"
          : "bg-white border-slate-200 shadow-sm"
      } backdrop-blur-sm rounded-xl p-6 border`}>
        <div className="flex items-center gap-2 mb-6">
          <div className={`p-1.5 rounded-lg border ${
            theme === "dark"
              ? "bg-teal-500/10 border-teal-500/20"
              : "bg-teal-50 border-teal-200"
          }`}>
            <BarChartIcon className={`w-4 h-4 ${
              theme === "dark" ? "text-teal-400" : "text-teal-600"
            }`} />
          </div>
          <h3 className={`${theme === 'dark' ? 'text-teal-200' : 'text-teal-700'} font-outfit font-semibold text-lg`}>
            Monthly Performance
          </h3>
        </div>

        <div className="space-y-4">
          {detailedStats.monthlyPerformance.map((month, index) => (
            <div key={month.month} className="flex items-center gap-4">
              <div className="w-8 text-sm font-medium">
                <span className={`${text.primary[theme]} font-outfit`}>
                  {month.month}
                </span>
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className={`${text.muted[theme]} font-outfit text-sm`}>
                    {month.points} pts • {month.predictions} predictions • {month.accuracy}% accuracy
                  </span>
                  <span className={`${text.primary[theme]} font-outfit text-sm font-medium`}>
                    {month.points}
                  </span>
                </div>
                <div className={`w-full h-2 rounded-full ${
                  theme === "dark" ? "bg-slate-700" : "bg-slate-200"
                }`}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${getBarWidth(month.points, maxMonthlyPoints)}%` }}
                    transition={{ duration: 1, delay: index * 0.1 }}
                    className={`h-2 rounded-full bg-gradient-to-r ${
                      theme === "dark" 
                        ? "from-teal-500 to-indigo-500" 
                        : "from-teal-600 to-indigo-600"
                    }`}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Team Performance */}
      <div className={`${
        theme === "dark"
          ? "bg-slate-800/40 border-slate-700/50"
          : "bg-white border-slate-200 shadow-sm"
      } backdrop-blur-sm rounded-xl p-6 border`}>
        <div className="flex items-center gap-2 mb-6">
          <div className={`p-1.5 rounded-lg border ${
            theme === "dark"
              ? "bg-teal-500/10 border-teal-500/20"
              : "bg-teal-50 border-teal-200"
          }`}>
            <TargetIcon className={`w-4 h-4 ${
              theme === "dark" ? "text-teal-400" : "text-teal-600"
            }`} />
          </div>
          <h3 className={`${theme === 'dark' ? 'text-teal-200' : 'text-teal-700'} font-outfit font-semibold text-lg`}>
            Performance by Team
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {detailedStats.teamPerformance.map((team, index) => (
            <div key={team.team} className={`p-4 rounded-lg ${
              theme === "dark"
                ? "bg-slate-700/20 border-slate-600/20"
                : "bg-slate-50/50 border-slate-200/50"
            } border`}>
              <div className="flex items-center justify-between mb-3">
                <h4 className={`${text.primary[theme]} font-outfit font-medium`}>
                  {team.team}
                </h4>
                <span className={`text-sm px-2 py-1 rounded-full ${
                  team.accuracy >= 80
                    ? theme === "dark" ? "bg-emerald-500/10 text-emerald-400" : "bg-emerald-50 text-emerald-600"
                    : team.accuracy >= 70
                    ? theme === "dark" ? "bg-amber-500/10 text-amber-400" : "bg-amber-50 text-amber-600"
                    : theme === "dark" ? "bg-red-500/10 text-red-400" : "bg-red-50 text-red-600"
                }`}>
                  {team.accuracy}%
                </span>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className={`${text.muted[theme]} text-sm font-outfit`}>Predictions</span>
                  <span className={`${text.primary[theme]} text-sm font-outfit font-medium`}>
                    {team.predictions}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className={`${text.muted[theme]} text-sm font-outfit`}>Correct</span>
                  <span className={`${text.primary[theme]} text-sm font-outfit font-medium`}>
                    {team.correct}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className={`${text.muted[theme]} text-sm font-outfit`}>Total Points</span>
                  <span className={`${text.primary[theme]} text-sm font-outfit font-medium`}>
                    {team.points}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Competition Statistics */}
      <div className={`${
        theme === "dark"
          ? "bg-slate-800/40 border-slate-700/50"
          : "bg-white border-slate-200 shadow-sm"
      } backdrop-blur-sm rounded-xl p-6 border`}>
        <div className="flex items-center gap-2 mb-6">
          <div className={`p-1.5 rounded-lg border ${
            theme === "dark"
              ? "bg-teal-500/10 border-teal-500/20"
              : "bg-teal-50 border-teal-200"
          }`}>
            <RocketIcon className={`w-4 h-4 ${
              theme === "dark" ? "text-teal-400" : "text-teal-600"
            }`} />
          </div>
          <h3 className={`${theme === 'dark' ? 'text-teal-200' : 'text-teal-700'} font-outfit font-semibold text-lg`}>
            Competition Breakdown
          </h3>
        </div>

        <div className="space-y-4">
          {detailedStats.competitionStats.map((comp, index) => (
            <div key={comp.competition} className={`p-4 rounded-lg ${
              theme === "dark"
                ? "bg-slate-700/20 border-slate-600/20"
                : "bg-slate-50/50 border-slate-200/50"
            } border`}>
              <div className="flex items-center justify-between mb-3">
                <h4 className={`${text.primary[theme]} font-outfit font-medium`}>
                  {comp.competition}
                </h4>
                <div className="flex items-center gap-2">
                  <span className={`${text.primary[theme]} font-outfit font-bold`}>
                    {comp.points} pts
                  </span>
                  <span className={`text-sm px-2 py-1 rounded-full ${
                    comp.accuracy >= 70
                      ? theme === "dark" ? "bg-emerald-500/10 text-emerald-400" : "bg-emerald-50 text-emerald-600"
                      : comp.accuracy >= 60
                      ? theme === "dark" ? "bg-amber-500/10 text-amber-400" : "bg-amber-50 text-amber-600"
                      : theme === "dark" ? "bg-red-500/10 text-red-400" : "bg-red-50 text-red-600"
                  }`}>
                    {comp.accuracy}%
                  </span>
                </div>
              </div>
              <div className="flex justify-between text-sm">
                <span className={`${text.muted[theme]} font-outfit`}>
                  {comp.correct}/{comp.predictions} predictions correct
                </span>
                <span className={`${text.muted[theme]} font-outfit`}>
                  {(comp.points / comp.predictions).toFixed(1)} pts/prediction
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Streak & Consistency */}
      <div className={`${
        theme === "dark"
          ? "bg-slate-800/40 border-slate-700/50"
          : "bg-white border-slate-200 shadow-sm"
      } backdrop-blur-sm rounded-xl p-6 border`}>
        <div className="flex items-center gap-2 mb-6">
          <div className={`p-1.5 rounded-lg border ${
            theme === "dark"
              ? "bg-teal-500/10 border-teal-500/20"
              : "bg-teal-50 border-teal-200"
          }`}>
            <LightningBoltIcon className={`w-4 h-4 ${
              theme === "dark" ? "text-teal-400" : "text-teal-600"
            }`} />
          </div>
          <h3 className={`${theme === 'dark' ? 'text-teal-200' : 'text-teal-700'} font-outfit font-semibold text-lg`}>
            Streaks & Consistency
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {detailedStats.streakHistory.map((streak, index) => (
            <div key={streak.type} className={`p-4 rounded-lg ${
              theme === "dark"
                ? "bg-slate-700/20 border-slate-600/20"
                : "bg-slate-50/50 border-slate-200/50"
            } border`}>
              <div className="flex items-center justify-between mb-2">
                <h4 className={`${text.primary[theme]} font-outfit font-medium text-sm`}>
                  {streak.type}
                </h4>
                <span className={`${text.primary[theme]} font-dmSerif text-2xl font-bold`}>
                  {streak.value}
                </span>
              </div>
              <p className={`${text.muted[theme]} font-outfit text-xs`}>
                {streak.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProfileStatistics;
