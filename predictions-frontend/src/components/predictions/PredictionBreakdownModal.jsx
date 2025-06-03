import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { format, parseISO } from "date-fns";
import {
  StarIcon,
  InfoCircledIcon,
  ClockIcon,
  CheckIcon,
  Cross2Icon,
  LightningBoltIcon,
  TargetIcon,
  RocketIcon,
  CalendarIcon,
  MagicWandIcon,
} from "@radix-ui/react-icons";

import { getTeamLogo } from "../../data/sampleData";

// Available chips data (should match PredictionsModal)
const availableChips = [
  {
    id: "doubleDown",
    name: "Double Down",
    icon: "💪",
    description: "2x points for this prediction",
  },
  {
    id: "wildcard",
    name: "Wildcard",
    icon: "🃏",
    description: "3x points for this prediction",
  },
  {
    id: "opportunist",
    name: "Opportunist",
    icon: "💰",
    description: "+15 bonus points",
  },
  {
    id: "scorerFocus",
    name: "Scorer Focus",
    icon: "⚽",
    description: "2x points for correct goalscorers",
  },
];

export default function PredictionBreakdownModal({
  prediction,
  onClose,
  onEdit,
  teamLogos = {},
}) {
  const [currentTab, setCurrentTab] = useState("overview");

  if (!prediction) {
    return (
      <div className="bg-slate-900/95 backdrop-blur-lg rounded-xl border border-slate-700/60 p-6">
        <div className="text-center p-8">
          <InfoCircledIcon className="mx-auto mb-4 text-slate-400 w-8 h-8" />
          <p className="text-slate-300 font-outfit">No prediction selected</p>
        </div>
      </div>
    );
  }

  const matchDate = parseISO(prediction.date);
  const formattedDate = format(matchDate, "EEEE, MMMM d, yyyy");
  const formattedTime = format(matchDate, "h:mm a");

  // Calculate actual points earned if prediction is completed
  const calculateActualPoints = () => {
    if (prediction.status !== "completed" || !prediction.actualResult) {
      return null;
    }

    let points = 0;
    const { homeScore: actualHome, awayScore: actualAway } = prediction.actualResult;
    const { homeScore: predHome, awayScore: predAway } = prediction;

    // Outcome points (5 points)
    const actualOutcome = actualHome > actualAway ? "home" : actualHome < actualAway ? "away" : "draw";
    const predictedOutcome = predHome > predAway ? "home" : predHome < predAway ? "away" : "draw";
    if (actualOutcome === predictedOutcome) {
      points += 5;
    }

    // Exact score points (10 points)
    if (actualHome === predHome && actualAway === predAway) {
      points += 10;
    }

    // Goalscorer points (2 points each)
    const actualScorers = prediction.actualResult.scorers || [];
    const predictedScorers = [...(prediction.homeScorers || []), ...(prediction.awayScorers || [])];
    
    predictedScorers.forEach(scorer => {
      if (actualScorers.includes(scorer)) {
        points += 2;
      }
    });

    // Apply chip bonuses
    if (prediction.chips?.includes("doubleDown")) {
      points *= 2;
    } else if (prediction.chips?.includes("wildcard")) {
      points *= 3;
    }

    if (prediction.chips?.includes("opportunist")) {
      points += 15;
    }

    if (prediction.chips?.includes("scorerFocus")) {
      // Additional scorer points already factored above
    }

    return points;
  };

  const actualPoints = calculateActualPoints();

  const tabs = [
    { id: "overview", name: "Overview", icon: MagicWandIcon },
    { id: "details", name: "Details", icon: TargetIcon },
    { id: "analysis", name: "Analysis", icon: StarIcon },
  ];

  return (
    <motion.div
      className="fixed inset-0 bg-slate-950/85 backdrop-blur-lg z-50 flex items-center justify-center overflow-y-auto p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ type: "spring", damping: 15 }}
        className="bg-slate-900/95 border border-slate-700/60 rounded-xl relative max-h-[85vh] md:max-h-[90vh] md:max-w-4xl mx-auto flex flex-col overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Status indicator bar */}
        <div className={`h-0.5 rounded-full ${
          prediction.status === "completed" 
            ? "bg-gradient-to-r from-emerald-500 to-blue-500"
            : prediction.status === "pending"
            ? "bg-gradient-to-r from-amber-500 to-orange-500" 
            : "bg-gradient-to-r from-slate-500 to-slate-600"
        }`}></div>

        {/* Header section */}
        <div className="p-4 border-b border-slate-700/60 relative bg-slate-800/50">
          {/* Close button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-lg bg-slate-800/60 hover:bg-slate-700/60 text-slate-400 hover:text-slate-200 transition-all duration-200 border border-slate-700/50 hover:border-slate-600/50"
            aria-label="Close"
          >
            <Cross2Icon className="w-4 h-4" />
          </motion.button>

          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center border border-blue-500/30">
              <TargetIcon className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <h2 className="text-slate-100 text-2xl font-bold font-outfit">
                Prediction Breakdown
              </h2>
              <p className="text-slate-400 text-sm font-outfit">
                {formattedDate} • {formattedTime}
              </p>
            </div>
          </div>

          {/* Status and match info */}
          <div className="flex items-center justify-between">
            <div className={`px-3 py-1 rounded-lg text-xs font-medium border ${
              prediction.status === "completed"
                ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
                : prediction.status === "pending"
                ? "bg-amber-500/20 text-amber-300 border-amber-500/30"
                : "bg-slate-500/20 text-slate-300 border-slate-500/30"
            }`}>
              {prediction.status === "completed" ? "Completed" : 
               prediction.status === "pending" ? "Pending" : "Upcoming"}
            </div>
            
            {actualPoints !== null && (
              <div className="text-slate-200 text-sm font-medium">
                <span className="text-slate-400">Earned: </span>
                <span className="text-emerald-300 font-bold">{actualPoints} points</span>
              </div>
            )}
          </div>
        </div>

        {/* Tab navigation */}
        <div className="px-4 py-3 bg-slate-800/30 border-b border-slate-700/60">
          <div className="flex gap-1">
            {tabs.map((tab) => (
              <motion.button
                key={tab.id}
                onClick={() => setCurrentTab(tab.id)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                  currentTab === tab.id
                    ? "bg-blue-500/20 text-blue-300 border border-blue-500/30"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-700/30"
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.name}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Scrollable content area */}
        <div className="overflow-y-auto flex-1 p-4">
          <AnimatePresence mode="wait">
            {/* Overview Tab */}
            {currentTab === "overview" && (
              <motion.div
                key="overview"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="space-y-4"
              >
                {/* Match Summary */}
                <div className="bg-slate-800/50 border border-slate-700/60 rounded-xl p-5">
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-slate-400 text-xs font-outfit">
                      Premier League • GW{prediction.gameweek}
                    </div>
                    <div className="text-slate-400 text-xs font-outfit flex items-center gap-1">
                      <CalendarIcon className="w-3 h-3" />
                      {formattedDate}
                    </div>
                  </div>

                  {/* Score Display */}
                  <div className="flex justify-between items-center">
                    <div className="flex flex-col items-center">
                      <div className="w-16 h-16 p-1 bg-slate-700/30 border border-slate-600/50 rounded-full mb-2 flex items-center justify-center">
                        <img
                          src={teamLogos[prediction.homeTeam] || getTeamLogo(prediction.homeTeam)}
                          alt={prediction.homeTeam}
                          className="w-12 h-12 object-contain"
                        />
                      </div>
                      <span className="text-slate-200 font-outfit text-sm text-center font-medium">
                        {prediction.homeTeam}
                      </span>
                    </div>

                    <div className="text-center">
                      <div className="text-slate-400 text-xs mb-2">Predicted</div>
                      <div className="flex items-center justify-center bg-blue-500/20 border border-blue-500/30 rounded-lg px-4 py-2">
                        <span className="text-blue-300 text-3xl font-bold">
                          {prediction.homeScore}
                        </span>
                        <span className="px-3 text-slate-400 text-xl">-</span>
                        <span className="text-blue-300 text-3xl font-bold">
                          {prediction.awayScore}
                        </span>
                      </div>
                      
                      {/* Actual result if available */}
                      {prediction.actualResult && (
                        <div className="mt-3">
                          <div className="text-slate-400 text-xs mb-2">Actual</div>
                          <div className="flex items-center justify-center bg-emerald-500/20 border border-emerald-500/30 rounded-lg px-4 py-2">
                            <span className="text-emerald-300 text-2xl font-bold">
                              {prediction.actualResult.homeScore}
                            </span>
                            <span className="px-3 text-slate-400 text-lg">-</span>
                            <span className="text-emerald-300 text-2xl font-bold">
                              {prediction.actualResult.awayScore}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col items-center">
                      <div className="w-16 h-16 p-1 bg-slate-700/30 border border-slate-600/50 rounded-full mb-2 flex items-center justify-center">
                        <img
                          src={teamLogos[prediction.awayTeam] || getTeamLogo(prediction.awayTeam)}
                          alt={prediction.awayTeam}
                          className="w-12 h-12 object-contain"
                        />
                      </div>
                      <span className="text-slate-200 font-outfit text-sm text-center font-medium">
                        {prediction.awayTeam}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Points Breakdown */}
                {actualPoints !== null && (
                  <div className="bg-slate-800/50 border border-slate-700/60 rounded-xl p-4">
                    <h4 className="text-slate-200 text-sm font-medium mb-3 flex items-center">
                      <MagicWandIcon className="mr-2 w-4 h-4 text-amber-400" />
                      Points Earned
                    </h4>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-slate-300">Base Points</span>
                        <span className="text-slate-200 font-medium">
                          {/* Calculate base points logic here */}
                          15 points
                        </span>
                      </div>
                      
                      {prediction.chips?.length > 0 && (
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-purple-300">Chip Bonuses</span>
                          <span className="text-purple-300 font-medium">
                            +{actualPoints - 15} points
                          </span>
                        </div>
                      )}
                      
                      <div className="border-t border-slate-600/50 pt-2 mt-3">
                        <div className="flex justify-between items-center">
                          <span className="text-slate-100 font-medium">Total Earned</span>
                          <span className="text-emerald-300 font-bold text-lg">
                            {actualPoints} points
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Quick Actions */}
                {prediction.status === "pending" && onEdit && (
                  <div className="bg-slate-800/50 border border-slate-700/60 rounded-xl p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-slate-200 text-sm font-medium">
                          Prediction Actions
                        </h4>
                        <p className="text-slate-400 text-xs mt-1">
                          You can still edit this prediction before the match starts
                        </p>
                      </div>
                      <motion.button
                        onClick={onEdit}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-all duration-200"
                      >
                        Edit Prediction
                      </motion.button>
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {/* Details Tab */}
            {currentTab === "details" && (
              <motion.div
                key="details"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="space-y-4"
              >
                {/* Goalscorers */}
                {(prediction.homeScorers?.length > 0 || prediction.awayScorers?.length > 0) && (
                  <div className="bg-slate-800/50 border border-slate-700/60 rounded-xl p-4">
                    <h4 className="text-slate-200 text-sm font-medium mb-3 flex items-center">
                      <TargetIcon className="mr-2 w-4 h-4 text-emerald-400" />
                      Predicted Goalscorers
                    </h4>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {prediction.homeScorers?.length > 0 && (
                        <div className="space-y-2">
                          <div className="text-emerald-300 text-xs font-medium mb-2 flex items-center">
                            <div className="w-4 h-4 rounded-full bg-emerald-500/20 border border-emerald-500/30 p-0.5 flex items-center justify-center mr-1.5">
                              <img
                                src={teamLogos[prediction.homeTeam] || getTeamLogo(prediction.homeTeam)}
                                alt={prediction.homeTeam}
                                className="w-2.5 h-2.5 object-contain"
                              />
                            </div>
                            {prediction.homeTeam}
                          </div>
                          {prediction.homeScorers.map((scorer, index) => (
                            <div
                              key={index}
                              className="flex items-center bg-slate-700/40 border border-emerald-500/20 rounded-lg px-3 py-2"
                            >
                              <div className="w-6 h-6 rounded-full flex items-center justify-center bg-emerald-500/20 border border-emerald-500/30 mr-2 text-xs text-emerald-300 font-medium">
                                {index + 1}
                              </div>
                              <span className="text-slate-200 text-sm font-medium">
                                {scorer}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}

                      {prediction.awayScorers?.length > 0 && (
                        <div className="space-y-2">
                          <div className="text-blue-300 text-xs font-medium mb-2 flex items-center">
                            <div className="w-4 h-4 rounded-full bg-blue-500/20 border border-blue-500/30 p-0.5 flex items-center justify-center mr-1.5">
                              <img
                                src={teamLogos[prediction.awayTeam] || getTeamLogo(prediction.awayTeam)}
                                alt={prediction.awayTeam}
                                className="w-2.5 h-2.5 object-contain"
                              />
                            </div>
                            {prediction.awayTeam}
                          </div>
                          {prediction.awayScorers.map((scorer, index) => (
                            <div
                              key={index}
                              className="flex items-center bg-slate-700/40 border border-blue-500/20 rounded-lg px-3 py-2"
                            >
                              <div className="w-6 h-6 rounded-full flex items-center justify-center bg-blue-500/20 border border-blue-500/30 mr-2 text-xs text-blue-300 font-medium">
                                {index + 1}
                              </div>
                              <span className="text-slate-200 text-sm font-medium">
                                {scorer}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Chips Used */}
                {prediction.chips?.length > 0 && (
                  <div className="bg-slate-800/50 border border-slate-700/60 rounded-xl p-4">
                    <h4 className="text-slate-200 text-sm font-medium mb-3 flex items-center">
                      <LightningBoltIcon className="mr-2 w-4 h-4 text-purple-400" />
                      Chips Used
                    </h4>

                    <div className="space-y-2">
                      {prediction.chips.map((chipId) => {
                        const chip = availableChips.find(c => c.id === chipId);
                        if (!chip) return null;

                        const chipColors = {
                          doubleDown: { bg: "emerald", text: "emerald" },
                          wildcard: { bg: "purple", text: "purple" },
                          opportunist: { bg: "amber", text: "amber" },
                          scorerFocus: { bg: "sky", text: "sky" },
                        };
                        const colors = chipColors[chipId] || { bg: "blue", text: "blue" };

                        return (
                          <div
                            key={chipId}
                            className={`flex items-center bg-slate-700/40 border border-${colors.bg}-500/20 rounded-lg px-3 py-2.5`}
                          >
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center bg-${colors.bg}-500/20 border border-${colors.bg}-500/30 mr-3 text-lg`}>
                              {chip.icon}
                            </div>
                            <div className="flex-1">
                              <div className={`text-${colors.text}-300 text-sm font-medium`}>
                                {chip.name}
                              </div>
                              <div className="text-slate-400 text-xs leading-relaxed">
                                {chip.description}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Prediction Metadata */}
                <div className="bg-slate-800/50 border border-slate-700/60 rounded-xl p-4">
                  <h4 className="text-slate-200 text-sm font-medium mb-3 flex items-center">
                    <InfoCircledIcon className="mr-2 w-4 h-4 text-blue-400" />
                    Prediction Details
                  </h4>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Submitted</span>
                        <span className="text-slate-200">{format(parseISO(prediction.submittedAt || prediction.date), "MMM d, h:mm a")}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Status</span>
                        <span className={`font-medium ${
                          prediction.status === "completed" ? "text-emerald-300" :
                          prediction.status === "pending" ? "text-amber-300" : "text-slate-300"
                        }`}>
                          {prediction.status.charAt(0).toUpperCase() + prediction.status.slice(1)}
                        </span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Gameweek</span>
                        <span className="text-slate-200">GW{prediction.gameweek}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Competition</span>
                        <span className="text-slate-200">Premier League</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Analysis Tab */}
            {currentTab === "analysis" && (
              <motion.div
                key="analysis"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="space-y-4"
              >
                {/* Accuracy Analysis */}
                {prediction.status === "completed" && prediction.actualResult && (
                  <div className="bg-slate-800/50 border border-slate-700/60 rounded-xl p-4">
                    <h4 className="text-slate-200 text-sm font-medium mb-3 flex items-center">
                      <StarIcon className="mr-2 w-4 h-4 text-amber-400" />
                      Prediction Accuracy
                    </h4>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-300 text-sm">Outcome Prediction</span>
                        <div className="flex items-center gap-2">
                          {(() => {
                            const actualOutcome = prediction.actualResult.homeScore > prediction.actualResult.awayScore ? "home" : 
                                                prediction.actualResult.homeScore < prediction.actualResult.awayScore ? "away" : "draw";
                            const predictedOutcome = prediction.homeScore > prediction.awayScore ? "home" : 
                                                   prediction.homeScore < prediction.awayScore ? "away" : "draw";
                            const correct = actualOutcome === predictedOutcome;
                            
                            return (
                              <>
                                <span className={`text-sm font-medium ${correct ? "text-emerald-300" : "text-red-300"}`}>
                                  {correct ? "Correct" : "Incorrect"}
                                </span>
                                {correct ? (
                                  <CheckIcon className="w-4 h-4 text-emerald-300" />
                                ) : (
                                  <Cross2Icon className="w-4 h-4 text-red-300" />
                                )}
                              </>
                            );
                          })()}
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-slate-300 text-sm">Exact Score</span>
                        <div className="flex items-center gap-2">
                          {(() => {
                            const exactScore = prediction.actualResult.homeScore === prediction.homeScore && 
                                             prediction.actualResult.awayScore === prediction.awayScore;
                            
                            return (
                              <>
                                <span className={`text-sm font-medium ${exactScore ? "text-emerald-300" : "text-red-300"}`}>
                                  {exactScore ? "Correct" : "Incorrect"}
                                </span>
                                {exactScore ? (
                                  <CheckIcon className="w-4 h-4 text-emerald-300" />
                                ) : (
                                  <Cross2Icon className="w-4 h-4 text-red-300" />
                                )}
                              </>
                            );
                          })()}
                        </div>
                      </div>

                      {/* Goalscorer accuracy */}
                      {(prediction.homeScorers?.length > 0 || prediction.awayScorers?.length > 0) && (
                        <div className="flex items-center justify-between">
                          <span className="text-slate-300 text-sm">Goalscorer Accuracy</span>
                          <div className="flex items-center gap-2">
                            {(() => {
                              const actualScorers = prediction.actualResult.scorers || [];
                              const predictedScorers = [...(prediction.homeScorers || []), ...(prediction.awayScorers || [])];
                              const correctScorers = predictedScorers.filter(scorer => actualScorers.includes(scorer)).length;
                              const accuracy = predictedScorers.length > 0 ? Math.round((correctScorers / predictedScorers.length) * 100) : 0;
                              
                              return (
                                <span className={`text-sm font-medium ${
                                  accuracy >= 75 ? "text-emerald-300" : 
                                  accuracy >= 50 ? "text-amber-300" : "text-red-300"
                                }`}>
                                  {accuracy}% ({correctScorers}/{predictedScorers.length})
                                </span>
                              );
                            })()}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Community Comparison */}
                <div className="bg-slate-800/50 border border-slate-700/60 rounded-xl p-4">
                  <h4 className="text-slate-200 text-sm font-medium mb-3 flex items-center">
                    <InfoCircledIcon className="mr-2 w-4 h-4 text-blue-400" />
                    Community Insights
                  </h4>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                    <div className="flex flex-col">
                      <span className="text-slate-400 text-xs mb-1">Most predicted score</span>
                      <span className="text-slate-200 font-outfit font-medium">2-1</span>
                      <span className="text-slate-400 text-xs mt-1">35% of users</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-slate-400 text-xs mb-1">Your prediction rank</span>
                      <span className="text-slate-200 font-outfit font-medium">#42</span>
                      <span className="text-slate-400 text-xs mt-1">Top 15%</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-slate-400 text-xs mb-1">Similar predictions</span>
                      <span className="text-slate-200 font-outfit font-medium">127</span>
                      <span className="text-slate-400 text-xs mt-1">8% of users</span>
                    </div>
                  </div>
                </div>

                {/* Points Potential */}
                <div className="bg-slate-800/50 border border-slate-700/60 rounded-xl p-4">
                  <h4 className="text-slate-200 text-sm font-medium mb-3 flex items-center">
                    <RocketIcon className="mr-2 w-4 h-4 text-purple-400" />
                    Points Breakdown
                  </h4>

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-300">Correct outcome (5 pts)</span>
                      <span className="text-slate-400">Available</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-300">Exact scoreline (10 pts)</span>
                      <span className="text-slate-400">Available</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-300">Goalscorers (2 pts each)</span>
                      <span className="text-slate-400">
                        Up to {(prediction.homeScore + prediction.awayScore) * 2} pts
                      </span>
                    </div>
                    
                    {prediction.chips?.includes("doubleDown") && (
                      <div className="flex justify-between items-center">
                        <span className="text-emerald-300">Double Down multiplier</span>
                        <span className="text-emerald-300">2x points</span>
                      </div>
                    )}
                    
                    {prediction.chips?.includes("wildcard") && (
                      <div className="flex justify-between items-center">
                        <span className="text-purple-300">Wildcard multiplier</span>
                        <span className="text-purple-300">3x points</span>
                      </div>
                    )}
                    
                    <div className="border-t border-slate-600/50 pt-2 mt-3">
                      <div className="flex justify-between items-center">
                        <span className="text-slate-100 font-medium">Maximum potential</span>
                        <span className="text-slate-100 font-bold">
                          {(() => {
                            let max = 15 + (prediction.homeScore + prediction.awayScore) * 2;
                            if (prediction.chips?.includes("opportunist")) max += 15;
                            if (prediction.chips?.includes("doubleDown")) max *= 2;
                            if (prediction.chips?.includes("wildcard")) max *= 3;
                            return `${max} pts`;
                          })()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div className="border-t border-slate-700/60 p-4 bg-slate-800/40">
          <div className="flex justify-between items-center">
            <div className="text-slate-400 text-xs">
              Prediction ID: {prediction.id}
            </div>
            
            <div className="flex gap-2">
              {prediction.status === "pending" && onEdit && (
                <motion.button
                  onClick={onEdit}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-all duration-200"
                >
                  Edit Prediction
                </motion.button>
              )}
              
              <motion.button
                onClick={onClose}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-lg text-sm font-medium transition-all duration-200"
              >
                Close
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
