import React, { useContext, useState } from "react";
import { motion } from "framer-motion";
import { 
  CalendarIcon, 
  TargetIcon, 
  CheckCircledIcon, 
  CrossCircledIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  ActivityLogIcon,
  RocketIcon
} from "@radix-ui/react-icons";
import { ThemeContext } from "../../context/ThemeContext";
import { text } from "../../utils/themeUtils";

const PredictionHistory = () => {
  const { theme } = useContext(ThemeContext);
  const [expandedPrediction, setExpandedPrediction] = useState(null);
  const [filter, setFilter] = useState("all"); // all, correct, incorrect

  // Sample prediction history data
  const predictionHistory = [
    {
      id: 1,
      match: "Arsenal vs Manchester City",
      date: "2025-07-05T15:00:00",
      gameweek: 37,
      prediction: { home: 2, away: 1 },
      actual: { home: 2, away: 1 },
      points: 12,
      isCorrect: true,
      chips: ["doublePower"],
      details: {
        homeScorers: ["Saka", "Martinelli"],
        awayScorers: ["Haaland"],
        actualHomeScorers: ["Saka", "Martinelli"],
        actualAwayScorers: ["Haaland"],
        scorersCorrect: true
      }
    },
    {
      id: 2,
      match: "Chelsea vs Liverpool",
      date: "2025-07-03T19:45:00",
      gameweek: 37,
      prediction: { home: 1, away: 2 },
      actual: { home: 0, away: 3 },
      points: 4,
      isCorrect: false,
      chips: [],
      details: {
        homeScorers: ["Sterling"],
        awayScorers: ["Salah", "Nunez"],
        actualHomeScorers: [],
        actualAwayScorers: ["Salah", "Nunez", "Gakpo"],
        scorersCorrect: false
      }
    },
    {
      id: 3,
      match: "Manchester United vs Tottenham",
      date: "2025-07-01T16:30:00",
      gameweek: 37,
      prediction: { home: 3, away: 1 },
      actual: { home: 3, away: 1 },
      points: 16,
      isCorrect: true,
      chips: ["defensePlus"],
      details: {
        homeScorers: ["Rashford", "Fernandes", "Garnacho"],
        awayScorers: ["Kane"],
        actualHomeScorers: ["Rashford", "Fernandes", "Garnacho"],
        actualAwayScorers: ["Kane"],
        scorersCorrect: true
      }
    },
    {
      id: 4,
      match: "Liverpool vs Arsenal",
      date: "2025-06-28T12:30:00",
      gameweek: 36,
      prediction: { home: 2, away: 2 },
      actual: { home: 1, away: 3 },
      points: 2,
      isCorrect: false,
      chips: [],
      details: {
        homeScorers: ["Salah", "Nunez"],
        awayScorers: ["Odegaard", "Saka"],
        actualHomeScorers: ["Salah"],
        actualAwayScorers: ["Odegaard", "Saka", "Martinelli"],
        scorersCorrect: false
      }
    },
    {
      id: 5,
      match: "Manchester City vs Chelsea",
      date: "2025-06-26T20:00:00",
      gameweek: 36,
      prediction: { home: 4, away: 0 },
      actual: { home: 4, away: 0 },
      points: 20,
      isCorrect: true,
      chips: ["wildcard"],
      details: {
        homeScorers: ["Haaland", "Haaland", "De Bruyne", "Foden"],
        awayScorers: [],
        actualHomeScorers: ["Haaland", "Haaland", "De Bruyne", "Foden"],
        actualAwayScorers: [],
        scorersCorrect: true
      }
    }
  ];

  const filteredHistory = predictionHistory.filter(prediction => {
    if (filter === "correct") return prediction.isCorrect;
    if (filter === "incorrect") return !prediction.isCorrect;
    return true;
  });

  const stats = {
    total: predictionHistory.length,
    correct: predictionHistory.filter(p => p.isCorrect).length,
    totalPoints: predictionHistory.reduce((sum, p) => sum + p.points, 0),
    avgPoints: predictionHistory.reduce((sum, p) => sum + p.points, 0) / predictionHistory.length
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      weekday: "short",
      day: "numeric",
      month: "short"
    });
  };

  const getChipColor = (chip) => {
    switch (chip) {
      case "doublePower":
        return theme === "dark" ? "bg-purple-500/10 text-purple-400" : "bg-purple-50 text-purple-600";
      case "defensePlus":
        return theme === "dark" ? "bg-blue-500/10 text-blue-400" : "bg-blue-50 text-blue-600";
      case "wildcard":
        return theme === "dark" ? "bg-amber-500/10 text-amber-400" : "bg-amber-50 text-amber-600";
      default:
        return theme === "dark" ? "bg-slate-500/10 text-slate-400" : "bg-slate-100 text-slate-600";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className={`${theme === 'dark' ? 'text-teal-100' : 'text-teal-700'} text-2xl font-bold font-dmSerif mb-2`}>
          Prediction History
        </h2>
        <p className={`${text.secondary[theme]} font-outfit`}>
          Review your past predictions and performance
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className={`p-4 rounded-lg ${
          theme === "dark"
            ? "bg-slate-800/40 border-slate-700/50"
            : "bg-white border-slate-200 shadow-sm"
        } border`}>
          <div className="flex items-center gap-2 mb-2">
            <ActivityLogIcon className={`w-4 h-4 ${
              theme === "dark" ? "text-teal-400" : "text-teal-600"
            }`} />
            <span className={`${text.muted[theme]} text-sm font-outfit`}>Total Predictions</span>
          </div>
          <p className={`${text.primary[theme]} font-dmSerif text-2xl font-bold`}>
            {stats.total}
          </p>
        </div>
        <div className={`p-4 rounded-lg ${
          theme === "dark"
            ? "bg-slate-800/40 border-slate-700/50"
            : "bg-white border-slate-200 shadow-sm"
        } border`}>
          <div className="flex items-center gap-2 mb-2">
            <CheckCircledIcon className={`w-4 h-4 ${
              theme === "dark" ? "text-emerald-400" : "text-emerald-600"
            }`} />
            <span className={`${text.muted[theme]} text-sm font-outfit`}>Correct</span>
          </div>
          <p className={`${text.primary[theme]} font-dmSerif text-2xl font-bold`}>
            {stats.correct}
          </p>
          <p className={`${text.muted[theme]} text-xs font-outfit`}>
            {Math.round((stats.correct / stats.total) * 100)}% accuracy
          </p>
        </div>
        <div className={`p-4 rounded-lg ${
          theme === "dark"
            ? "bg-slate-800/40 border-slate-700/50"
            : "bg-white border-slate-200 shadow-sm"
        } border`}>
          <div className="flex items-center gap-2 mb-2">
            <RocketIcon className={`w-4 h-4 ${
              theme === "dark" ? "text-indigo-400" : "text-indigo-600"
            }`} />
            <span className={`${text.muted[theme]} text-sm font-outfit`}>Total Points</span>
          </div>
          <p className={`${text.primary[theme]} font-dmSerif text-2xl font-bold`}>
            {stats.totalPoints}
          </p>
        </div>
        <div className={`p-4 rounded-lg ${
          theme === "dark"
            ? "bg-slate-800/40 border-slate-700/50"
            : "bg-white border-slate-200 shadow-sm"
        } border`}>
          <div className="flex items-center gap-2 mb-2">
            <TargetIcon className={`w-4 h-4 ${
              theme === "dark" ? "text-purple-400" : "text-purple-600"
            }`} />
            <span className={`${text.muted[theme]} text-sm font-outfit`}>Average Points</span>
          </div>
          <p className={`${text.primary[theme]} font-dmSerif text-2xl font-bold`}>
            {stats.avgPoints.toFixed(1)}
          </p>
        </div>
      </div>

      {/* Filter Controls */}
      <div className="flex gap-2">
        {["all", "correct", "incorrect"].map((filterType) => (
          <button
            key={filterType}
            onClick={() => setFilter(filterType)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              filter === filterType
                ? theme === 'dark'
                  ? 'bg-teal-600 text-white'
                  : 'bg-teal-600 text-white'
                : theme === 'dark'
                ? 'bg-slate-800/40 text-slate-300 hover:bg-slate-700/50'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {filterType.charAt(0).toUpperCase() + filterType.slice(1)}
            {filterType === "all" && ` (${stats.total})`}
            {filterType === "correct" && ` (${stats.correct})`}
            {filterType === "incorrect" && ` (${stats.total - stats.correct})`}
          </button>
        ))}
      </div>

      {/* Prediction List */}
      <div className="space-y-3">
        {filteredHistory.map((prediction) => (
          <motion.div
            key={prediction.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`${
              theme === "dark"
                ? "bg-slate-800/40 border-slate-700/50"
                : "bg-white border-slate-200 shadow-sm"
            } backdrop-blur-sm rounded-xl p-4 border transition-all duration-200`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${
                  prediction.isCorrect
                    ? theme === "dark"
                      ? "bg-emerald-500/10 text-emerald-400"
                      : "bg-emerald-50 text-emerald-600"
                    : theme === "dark"
                    ? "bg-red-500/10 text-red-400"
                    : "bg-red-50 text-red-600"
                }`}>
                  {prediction.isCorrect ? (
                    <CheckCircledIcon className="w-5 h-5" />
                  ) : (
                    <CrossCircledIcon className="w-5 h-5" />
                  )}
                </div>
                <div>
                  <h3 className={`${text.primary[theme]} font-outfit font-semibold`}>
                    {prediction.match}
                  </h3>
                  <div className="flex items-center gap-2 text-sm">
                    <span className={`${text.muted[theme]} font-outfit`}>
                      {formatDate(prediction.date)} • GW{prediction.gameweek}
                    </span>
                    {prediction.chips.length > 0 && (
                      <div className="flex gap-1">
                        {prediction.chips.map((chip, index) => (
                          <span
                            key={index}
                            className={`px-2 py-1 rounded-full text-xs font-medium ${getChipColor(chip)}`}
                          >
                            {chip}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <div className="flex items-center gap-2">
                    <span className={`${text.primary[theme]} font-outfit font-bold`}>
                      {prediction.prediction.home}-{prediction.prediction.away}
                    </span>
                    <span className={`${text.muted[theme]} font-outfit text-sm`}>
                      ({prediction.actual.home}-{prediction.actual.away})
                    </span>
                  </div>
                  <div className={`flex items-center gap-1 ${
                    prediction.points > 10 
                      ? theme === "dark" ? "text-emerald-400" : "text-emerald-600"
                      : prediction.points > 5
                      ? theme === "dark" ? "text-amber-400" : "text-amber-600"
                      : theme === "dark" ? "text-red-400" : "text-red-600"
                  }`}>
                    <span className="font-outfit text-sm font-medium">
                      +{prediction.points} pts
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setExpandedPrediction(
                    expandedPrediction === prediction.id ? null : prediction.id
                  )}
                  className={`p-2 rounded-lg ${
                    theme === "dark"
                      ? "hover:bg-slate-700/50 text-slate-400"
                      : "hover:bg-slate-100 text-slate-500"
                  }`}
                >
                  {expandedPrediction === prediction.id ? (
                    <ChevronUpIcon className="w-4 h-4" />
                  ) : (
                    <ChevronDownIcon className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Expanded Details */}
            {expandedPrediction === prediction.id && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className={`border-t pt-3 mt-3 ${
                  theme === "dark" ? "border-slate-700/50" : "border-slate-200"
                }`}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className={`${text.primary[theme]} font-outfit font-medium mb-2`}>
                      Predicted Scorers
                    </h4>
                    <div className="space-y-1">
                      {prediction.details.homeScorers.map((scorer, index) => (
                        <p key={index} className={`${text.muted[theme]} font-outfit text-sm`}>
                          {scorer}
                        </p>
                      ))}
                      {prediction.details.awayScorers.map((scorer, index) => (
                        <p key={index} className={`${text.muted[theme]} font-outfit text-sm`}>
                          {scorer}
                        </p>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className={`${text.primary[theme]} font-outfit font-medium mb-2`}>
                      Actual Scorers
                    </h4>
                    <div className="space-y-1">
                      {prediction.details.actualHomeScorers.map((scorer, index) => (
                        <p key={index} className={`${text.muted[theme]} font-outfit text-sm`}>
                          {scorer}
                        </p>
                      ))}
                      {prediction.details.actualAwayScorers.map((scorer, index) => (
                        <p key={index} className={`${text.muted[theme]} font-outfit text-sm`}>
                          {scorer}
                        </p>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-700">
                  <div className="flex items-center justify-between">
                    <span className={`${text.muted[theme]} font-outfit text-sm`}>
                      Scorers Prediction
                    </span>
                    <span className={`font-outfit text-sm font-medium ${
                      prediction.details.scorersCorrect
                        ? theme === "dark" ? "text-emerald-400" : "text-emerald-600"
                        : theme === "dark" ? "text-red-400" : "text-red-600"
                    }`}>
                      {prediction.details.scorersCorrect ? "Correct" : "Incorrect"}
                    </span>
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default PredictionHistory;
