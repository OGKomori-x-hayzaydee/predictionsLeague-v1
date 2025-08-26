import { useState, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDownIcon,
  TargetIcon,
  LightningBoltIcon,
  InfoCircledIcon,
  CalendarIcon,
  StarIcon,
  RocketIcon,
} from "@radix-ui/react-icons";
import { calculatePredictionPoints } from "../../utils/chipUtils";
import { ThemeContext } from "../../context/ThemeContext";
import { getThemeStyles, text } from "../../utils/themeUtils";

const PotentialPointsSummary = ({ predictions, teamLogos }) => {
  const [showDetailedPointsBreakdown, setShowDetailedPointsBreakdown] =
    useState(false);
  const [isCollapsed, setIsCollapsed] = useState(true);
  // Get theme context
  const { theme } = useContext(ThemeContext);
  // Use the already filtered pending predictions passed from parent component
  const pendingPredictions = predictions;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={`backdrop-blur-xl rounded-xl border mb-5 overflow-hidden font-outfit ${getThemeStyles(
        theme,
        {
          dark: "border-slate-700/50 bg-slate-900/60",
          light: "border-slate-200 bg-white/80",
        }
      )}`}
    >
      {/* Status indicator bar */}
      <div className="h-0.5 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>

      <div
        className={`px-5 py-3 border-b ${getThemeStyles(theme, {
          dark: "bg-slate-800/50 border-slate-700/50",
          light: "bg-slate-50 border-slate-200",
        })}`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center">
              <TargetIcon className="w-4 h-4 text-blue-400" />
            </div>{" "}
            <div>
              <h3
                className={`text-base font-semibold ${getThemeStyles(
                  theme,
                  text.primary
                )}`}
              >
                Potential Points Summary
              </h3>
              <p className={`text-sm ${getThemeStyles(theme, text.secondary)}`}>
                {pendingPredictions.length > 0
                  ? "Total points you could earn from your pending predictions"
                  : "No pending predictions to calculate potential points"}
              </p>
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsCollapsed(!isCollapsed)}
            className={`p-2 rounded-lg transition-all duration-200 border ${getThemeStyles(
              theme,
              {
                dark: "bg-slate-700/50 hover:bg-slate-700/70 text-slate-300 hover:text-slate-200 border-slate-600/50 hover:border-slate-500/50",
                light:
                  "bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-700 border-slate-300 hover:border-slate-400",
              }
            )}`}
          >
            <ChevronDownIcon
              className={`w-4 h-4 transition-transform duration-200 ${
                isCollapsed ? "rotate-180" : ""
              }`}
            />
          </motion.button>
        </div>{" "}
      </div>

      {/* Collapsible Content */}
      <AnimatePresence>
        {!isCollapsed && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <div className="p-4">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {/* Base potential */}{" "}
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                  className={`rounded-lg p-4 flex flex-col items-center border ${getThemeStyles(
                    theme,
                    {
                      dark: "bg-slate-800/60 border-slate-700/50",
                      light: "bg-slate-50 border-slate-200",
                    }
                  )}`}
                >
                  {" "}
                  <div className="flex items-center gap-2 mb-2">
                    <div
                      className={`w-6 h-6 rounded-md flex items-center justify-center ${getThemeStyles(
                        theme,
                        {
                          dark: "bg-slate-600/50",
                          light: "bg-slate-200",
                        }
                      )}`}
                    >
                      <CalendarIcon
                        className={`w-3 h-3 ${getThemeStyles(
                          theme,
                          text.secondary
                        )}`}
                      />
                    </div>
                    <div
                      className={`text-sm font-medium ${getThemeStyles(
                        theme,
                        text.secondary
                      )}`}
                    >
                      Base Potential
                    </div>
                  </div>{" "}
                  <div
                    className={`text-3xl font-bold font-dmSerif mb-2 ${getThemeStyles(
                      theme,
                      text.primary
                    )}`}
                  >
                    {pendingPredictions.reduce((total, prediction) => {
                      const outcomePoints = 5;
                      const exactScorePoints = 10;
                      const baseGoalScorerPoints =
                        (prediction.homeScore + prediction.awayScore) * 2;
                      const basePoints =
                        outcomePoints + exactScorePoints + baseGoalScorerPoints;
                      return total + basePoints;
                    }, 0)}
                  </div>
                  <div
                    className={`text-sm text-center ${getThemeStyles(
                      theme,
                      text.muted
                    )}`}
                  >
                    Without chips applied
                  </div>
                </motion.div>{" "}
                {/* Maximum potential */}
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                  className={`rounded-lg p-4 flex flex-col items-center relative overflow-hidden border ${getThemeStyles(
                    theme,
                    {
                      dark: "bg-gradient-to-br from-blue-900/40 via-purple-900/40 to-pink-900/40 border-blue-500/30",
                      light:
                        "bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 border-blue-200",
                    }
                  )}`}
                >
                  <div
                    className={`absolute top-0 right-0 w-26 h-26 rounded-full -translate-x-13 -translate-y-13 ${getThemeStyles(
                      theme,
                      {
                        dark: "bg-blue-500/10",
                        light: "bg-blue-200/20",
                      }
                    )}`}
                  ></div>
                  <div
                    className={`absolute bottom-0 left-0 w-19 h-19 rounded-full -translate-x-9 translate-y-9 ${getThemeStyles(
                      theme,
                      {
                        dark: "bg-purple-500/10",
                        light: "bg-purple-200/20",
                      }
                    )}`}
                  ></div>
                  <div className="flex items-center gap-2 mb-2 relative z-10">
                    <div
                      className={`w-6 h-6 rounded-md flex items-center justify-center ${getThemeStyles(
                        theme,
                        {
                          dark: "bg-blue-500/30",
                          light: "bg-blue-200/50",
                        }
                      )}`}
                    >
                      <RocketIcon
                        className={`w-3 h-3 ${getThemeStyles(theme, {
                          dark: "text-blue-300",
                          light: "text-blue-600",
                        })}`}
                      />
                    </div>
                    <div
                      className={`text-sm font-medium ${getThemeStyles(theme, {
                        dark: "text-blue-300",
                        light: "text-blue-700",
                      })}`}
                    >
                      Maximum Potential
                    </div>
                  </div>{" "}
                  <div
                    className={`text-3xl font-bold font-dmSerif mb-2 relative z-10 ${getThemeStyles(
                      theme,
                      {
                        dark: "text-white",
                        light: "text-slate-800",
                      }
                    )}`}
                  >
                    {pendingPredictions.reduce((total, prediction) => {
                      const points = calculatePredictionPoints(prediction);
                      return total + points.finalPoints;
                    }, 0)}
                  </div>
                  <div
                    className={`text-sm text-center relative z-10 ${getThemeStyles(
                      theme,
                      {
                        dark: "text-blue-200/80",
                        light: "text-blue-600/80",
                      }
                    )}`}
                  >
                    With all chips applied
                  </div>{" "}
                </motion.div>
                {/* Match breakdown */}
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                  className={`rounded-lg p-4 flex flex-col items-center border ${getThemeStyles(
                    theme,
                    {
                      dark: "bg-slate-800/60 border-slate-700/50",
                      light: "bg-slate-50 border-slate-200",
                    }
                  )}`}
                >
                  <div className="flex items-center gap-2 mb-3">
                    <div
                      className={`w-6 h-6 rounded-md flex items-center justify-center ${getThemeStyles(
                        theme,
                        {
                          dark: "bg-slate-600/50",
                          light: "bg-slate-200",
                        }
                      )}`}
                    >
                      <InfoCircledIcon
                        className={`w-3 h-3 ${getThemeStyles(
                          theme,
                          text.secondary
                        )}`}
                      />
                    </div>
                    <div
                      className={`text-sm font-medium ${getThemeStyles(
                        theme,
                        text.secondary
                      )}`}
                    >
                      Match Breakdown
                    </div>
                  </div>{" "}
                  <div className="space-y-2 max-h-32 overflow-y-auto pr-2 custom-scrollbar">
                    {pendingPredictions.map((prediction) => {
                      const points = calculatePredictionPoints(prediction);

                      return (
                        <div
                          key={prediction.id}
                          className={`flex justify-between items-center p-2 rounded-md border ${getThemeStyles(
                            theme,
                            {
                              dark: "bg-slate-700/30 border-slate-600/30",
                              light: "bg-white border-slate-200",
                            }
                          )}`}
                        >
                          <div className="flex items-center gap-2">
                            <div
                              className={`w-6 h-6 rounded-md flex items-center justify-center ${getThemeStyles(
                                theme,
                                {
                                  dark: "bg-slate-600/50",
                                  light: "bg-slate-100",
                                }
                              )}`}
                            >
                              <img
                                src={teamLogos[prediction.homeTeam]}
                                alt={prediction.homeTeam}
                                className="w-4 h-4 object-contain"
                              />
                            </div>
                            <span
                              className={`text-sm font-medium ${getThemeStyles(
                                theme,
                                text.primary
                              )}`}
                            >
                              {prediction.homeTeam} vs {prediction.awayTeam}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <span
                              className={getThemeStyles(theme, text.secondary)}
                            >
                              {points.pointsBeforeMultiplier}
                            </span>
                            <span className={getThemeStyles(theme, text.muted)}>
                              →
                            </span>
                            <span
                              className={`font-semibold ${getThemeStyles(
                                theme,
                                {
                                  dark: "text-blue-300",
                                  light: "text-blue-600",
                                }
                              )}`}
                            >
                              {points.finalPoints}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <div
                    className={`mt-3 pt-3 border-t ${getThemeStyles(theme, {
                      dark: "border-slate-600/50",
                      light: "border-slate-200",
                    })}`}
                  >
                    <div
                      className={`flex items-center justify-between p-2 rounded-md ${getThemeStyles(
                        theme,
                        {
                          dark: "bg-slate-700/30",
                          light: "bg-white",
                        }
                      )}`}
                    >
                      {" "}
                      <span
                        className={`text-sm font-medium mr-2 ${getThemeStyles(
                          theme,
                          text.secondary
                        )}`}
                      >
                        Total Fixtures
                      </span>
                      <span
                        className={`text-base font-semibold ${getThemeStyles(
                          theme,
                          text.primary
                        )}`}
                      >
                        {pendingPredictions.length}
                      </span>
                    </div>
                  </div>
                </motion.div>
              </div>{" "}
              <motion.div
                whileHover={{ scale: 1.01 }}
                transition={{ duration: 0.2 }}
                className={`mt-4 rounded-lg p-3 border ${getThemeStyles(theme, {
                  dark: "bg-slate-800/60 border-slate-700/50",
                  light: "bg-slate-50 border-slate-200",
                })}`}
              >
                <div className="flex items-start gap-2">
                  <div className="w-7 h-7 rounded-lg bg-blue-500/20 flex items-center justify-center mt-0.5">
                    <LightningBoltIcon className="w-4 h-4 text-blue-400" />
                  </div>
                  <div>
                    <h4
                      className={`text-sm font-semibold mb-1 ${getThemeStyles(
                        theme,
                        {
                          dark: "text-blue-300",
                          light: "text-blue-600",
                        }
                      )}`}
                    >
                      How points are calculated
                    </h4>
                    <p
                      className={`text-sm leading-relaxed ${getThemeStyles(
                        theme,
                        text.secondary
                      )}`}
                    >
                      Base points: 5 for correct outcome, 10 for exact score, 2
                      per correct goalscorer. Chips can multiply points or add
                      bonuses.
                    </p>
                  </div>
                </div>
              </motion.div>
              {/* Toggle button for detailed view */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() =>
                  setShowDetailedPointsBreakdown(!showDetailedPointsBreakdown)
                }
                className={`mt-4 px-4 py-2 rounded-lg text-sm font-medium flex items-center mx-auto transition-all duration-200 border ${getThemeStyles(
                  theme,
                  {
                    dark: "bg-slate-700/50 hover:bg-slate-700/70 text-slate-300 hover:text-slate-200 border-slate-600/50 hover:border-slate-500/50",
                    light:
                      "bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-700 border-slate-300 hover:border-slate-400",
                  }
                )}`}
              >
                {showDetailedPointsBreakdown
                  ? "Hide detailed breakdown"
                  : "View detailed breakdown"}
                <ChevronDownIcon
                  className={`ml-2 w-3 h-3 transition-transform duration-200 ${
                    showDetailedPointsBreakdown ? "rotate-180" : ""
                  }`}
                />
              </motion.button>{" "}
              {/* Detailed breakdown section */}
              <AnimatePresence>
                {showDetailedPointsBreakdown && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className={`mt-4 pt-4 border-t ${getThemeStyles(theme, {
                      dark: "border-slate-700/50",
                      light: "border-slate-200",
                    })}`}
                  >
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-6 h-6 rounded-lg bg-purple-500/20 flex items-center justify-center">
                        <TargetIcon className="w-3 h-3 text-purple-400" />
                      </div>
                      <h4
                        className={`text-sm font-semibold ${getThemeStyles(
                          theme,
                          text.primary
                        )}`}
                      >
                        Detailed Points Calculation
                      </h4>
                    </div>{" "}
                    <div className="space-y-4 font-outfit">
                      {pendingPredictions.map((prediction) => {
                        const points = calculatePredictionPoints(prediction);

                        const breakdown = [
                          { label: "Outcome", value: 5, type: "base" },
                          { label: "Exact Score", value: 10, type: "base" },
                          {
                            label: "Goal Scorers",
                            value:
                              (prediction.homeScore + prediction.awayScore) * 2,
                            type: "base",
                          },
                        ];

                        if (prediction.chips.includes("scorerFocus")) {
                          breakdown.push({
                            label: "Scorer Focus",
                            value:
                              (prediction.homeScore + prediction.awayScore) * 2,
                            type: "bonus",
                          });
                        }

                        if (
                          prediction.chips.includes("defensePlusPlus") &&
                          (prediction.homeScore === 0 ||
                            prediction.awayScore === 0)
                        ) {
                          breakdown.push({
                            label: "Defense++",
                            value: 10,
                            type: "bonus",
                          });
                        }

                        if (points.hasWildcard) {
                          breakdown.push({
                            label: "Wildcard (3x)",
                            value: points.pointsBeforeMultiplier * 2,
                            type: "multiplier",
                            multiply: 3,
                          });
                        } else if (points.hasDoubleDown) {
                          breakdown.push({
                            label: "Double Down (2x)",
                            value: points.pointsBeforeMultiplier,
                            type: "multiplier",
                            multiply: 2,
                          });
                        }

                        return (
                          <motion.div
                            key={prediction.id}
                            initial={{ opacity: 0, y: 13 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: 0.1 }}
                            className={`rounded-lg overflow-hidden border ${getThemeStyles(
                              theme,
                              {
                                dark: "bg-slate-800/60 border-slate-700/50",
                                light: "bg-white border-slate-200",
                              }
                            )}`}
                          >
                            <DetailedBreakdown
                              prediction={prediction}
                              breakdown={breakdown}
                              points={points}
                              teamLogos={teamLogos}
                              theme={theme}
                            />
                          </motion.div>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const DetailedBreakdown = ({
  prediction,
  breakdown,
  points,
  teamLogos,
  theme,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <>
      <motion.div
        className={`px-4 py-3 flex items-center justify-between border-b cursor-pointer ${getThemeStyles(
          theme,
          {
            dark: "bg-slate-700/50 border-slate-600/50 hover:bg-slate-700/70",
            light: "bg-slate-50 border-slate-200 hover:bg-slate-100",
          }
        )}`}
        onClick={() => setIsExpanded(!isExpanded)}
        whileHover={{ scale: 1.005 }}
        whileTap={{ scale: 0.995 }}
      >
        <div className="flex items-center gap-2">
          <div
            className={`w-6 h-6 rounded-lg flex items-center justify-center ${getThemeStyles(
              theme,
              {
                dark: "bg-slate-600/50",
                light: "bg-slate-100",
              }
            )}`}
          >
            <img
              src={teamLogos[prediction.homeTeam]}
              alt={prediction.homeTeam}
              className="w-4 h-4 object-contain"
            />
          </div>
          <span
            className={` text-sm ${getThemeStyles(
              theme,
              text.primary
            )}`}
          >
            {prediction.homeTeam} {prediction.homeScore} -{" "}
            {prediction.awayScore} {prediction.awayTeam}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className={`text-sm font-medium ${getThemeStyles(theme, text.secondary)}`}>
            {points.finalPoints} pts
          </span>
          <ChevronDownIcon
            className={`w-4 h-4 transition-transform duration-200 ${
              isExpanded ? "rotate-180" : ""
            } ${getThemeStyles(theme, text.secondary)}`}
          />
        </div>
      </motion.div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >      <div className="p-4">
        <div
          className={`mb-4 p-3 rounded-lg border ${getThemeStyles(theme, {
            dark: "bg-slate-700/30 border-slate-600/50",
            light: "bg-slate-50 border-slate-200",
          })}`}
        >
          <div className="flex items-center gap-1.5 mb-1.5">
            <TargetIcon
              className={`w-3 h-3 ${getThemeStyles(theme, text.secondary)}`}
            />
            <div
              className={`text-xs font-medium ${getThemeStyles(
                theme,
                text.secondary
              )}`}
            >
              Predicted Goalscorers:
            </div>
          </div>
          <div className={`text-xs ${getThemeStyles(theme, text.primary)}`}>
            {[...prediction.homeScorers, ...prediction.awayScorers].join(
              ", "
            ) || "None predicted"}
          </div>
        </div>

        <div
          className={`mt-4 overflow-hidden rounded-lg border ${getThemeStyles(
            theme,
            {
              dark: "border-slate-600/50",
              light: "border-slate-200",
            }
          )}`}
        >
          <table className="w-full text-xs">
            <thead>
              <tr
                className={`border-b ${getThemeStyles(theme, {
                  dark: "bg-slate-700/50 text-slate-300 border-slate-600/50",
                  light: "bg-slate-50 text-slate-600 border-slate-200",
                })}`}
              >
                <th className="text-left py-2 px-3 font-medium">Component</th>
                <th className="text-right py-2 px-3 font-medium">Points</th>
              </tr>
            </thead>
            <tbody>
              {breakdown.map((item, idx) => (
                <tr
                  key={idx}
                  className={`border-b last:border-0 transition-colors ${getThemeStyles(
                    theme,
                    {
                      dark: "border-slate-600/30 hover:bg-slate-700/30",
                      light: "border-slate-200 hover:bg-slate-50",
                    }
                  )}`}
                >
                  <td
                    className={`py-2 px-3 ${
                      item.type === "bonus"
                        ? getThemeStyles(theme, {
                            dark: "text-blue-300",
                            light: "text-blue-600",
                          })
                        : item.type === "multiplier"
                        ? getThemeStyles(theme, {
                            dark: "text-purple-300",
                            light: "text-purple-600",
                          })
                        : getThemeStyles(theme, text.primary)
                    }`}
                  >
                    <div className="flex items-center gap-1.5">
                      {item.type === "bonus" && (
                        <StarIcon className="w-3 h-3" />
                      )}
                      {item.type === "multiplier" && (
                        <RocketIcon className="w-3 h-3" />
                      )}
                      <span>{item.label}</span>
                    </div>
                    {item.type === "multiplier" && (
                      <div
                        className={`text-xs mt-0.5 ml-4 ${getThemeStyles(
                          theme,
                          text.muted
                        )}`}
                      >
                        Applies to all points above
                      </div>
                    )}
                  </td>
                  <td
                    className={`py-2 px-3 text-right font-medium ${
                      item.type === "bonus"
                        ? getThemeStyles(theme, {
                            dark: "text-blue-300",
                            light: "text-blue-600",
                          })
                        : item.type === "multiplier"
                        ? getThemeStyles(theme, {
                            dark: "text-purple-300",
                            light: "text-purple-600",
                          })
                        : getThemeStyles(theme, text.primary)
                    }`}
                  >
                    {item.type === "multiplier" ? `+${item.value}` : item.value}
                  </td>
                </tr>
              ))}
              <tr
                className={`border-t-2 ${getThemeStyles(theme, {
                  dark: "bg-slate-700/50 border-slate-500/50",
                  light: "bg-slate-50 border-slate-300",
                })}`}
              >
                <td
                  className={`py-3 px-3 font-semibold text-sm ${getThemeStyles(
                    theme,
                    text.primary
                  )}`}
                >
                  Total Potential
                </td>
                <td
                  className={`py-3 px-3 text-right font-bold text-sm ${getThemeStyles(
                    theme,
                    text.primary
                  )}`}
                >
                  {points.finalPoints}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default PotentialPointsSummary;
