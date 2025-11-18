import { useContext } from "react";
import { motion } from "framer-motion";
import { ThemeContext } from "../../../context/ThemeContext";
import { getThemeStyles } from "../../../utils/themeUtils";
import { CheckIcon, TargetIcon, LightningBoltIcon, RocketIcon, StarIcon } from "@radix-ui/react-icons";
import ScoreDisplay from "./ScoreDisplay";
import GoalscorerSummary from "./GoalscorerSummary";
import ChipsSummary from "./ChipsSummary";
import PointsPotential from "./PointsPotential";

export default function ReviewStep({ 
  fixture, 
  homeScore, 
  awayScore, 
  homeScorers, 
  awayScorers, 
  selectedChips, 
  activeGameweekChips 
}) {
  const { theme } = useContext(ThemeContext);

  return (
    <motion.div
      key="step3"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="pb-4"
    >
      <div className={`${getThemeStyles(theme, {
        dark: "bg-slate-800/50 border border-slate-700/60",
        light: "bg-slate-50/50 border border-slate-200/60",
      })} rounded-xl p-6 mb-6`}>
        <div className="flex items-center space-x-2 mb-4">
          <CheckIcon className="w-5 h-5 text-purple-400" />
          <h3 className={`text-lg font-semibold font-outfit ${getThemeStyles(theme, {
            dark: "text-slate-200",
            light: "text-slate-800",
          })}`}>
            Review Your Prediction
          </h3>
        </div>

        {/* Score summary */}
        <div className={`${getThemeStyles(theme, {
          dark: "bg-slate-900/50 border border-slate-700/30",
          light: "bg-slate-100/50 border border-slate-200/30",
        })} rounded-lg p-4 mb-4`}>
          <div className={`text-xs font-medium mb-3 font-outfit text-center ${getThemeStyles(theme, {
            dark: "text-slate-400",
            light: "text-slate-600",
          })}`}>
            Your Predicted Score
          </div>
          <ScoreDisplay 
            fixture={fixture} 
            homeScore={homeScore} 
            awayScore={awayScore} 
            variant="review" 
          />
        </div>

        {/* Goalscorers summary */}
        {(homeScore > 0 || awayScore > 0) && (
          <GoalscorerSummary
            fixture={fixture}
            homeScore={homeScore}
            awayScore={awayScore}
            homeScorers={homeScorers}
            awayScorers={awayScorers}
          />
        )}

        {/* Selected chips summary */}
        <ChipsSummary selectedChips={selectedChips} />
      </div>

      {/* Active gameweek chips */}
      {activeGameweekChips.length > 0 && (
        <div
          className={`${getThemeStyles(theme, {
            dark: "bg-slate-800/50 border-slate-700/60",
            light: "bg-slate-50/50 border-slate-200/60",
          })} border rounded-xl p-4 mb-4 font-outfit`}
        >
          <h4
            className={`${getThemeStyles(theme, {
              dark: "text-slate-200",
              light: "text-slate-800",
            })} text-sm font-medium mb-3 flex items-center`}
          >
            <RocketIcon className="mr-2 w-4 h-4 text-blue-400" />
            Active Gameweek Chips
          </h4>

          <div className="space-y-2">
            {activeGameweekChips.includes("defensePlusPlus") && (
              <div
                className={`flex items-center ${getThemeStyles(theme, {
                  dark: "bg-slate-700/40",
                  light: "bg-slate-100/40",
                })} border border-blue-500/20 rounded-lg px-3 py-2.5`}
              >
                <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-blue-500/20 border border-blue-500/30 mr-3 text-lg">
                  🛡️
                </div>
                <div className="flex-1">
                  <div
                    className={`text-sm font-medium ${getThemeStyles(theme, {
                      dark: "text-blue-300",
                      light: "text-blue-700",
                    })}`}
                  >
                    Defense++
                  </div>
                  <div
                    className={`${getThemeStyles(theme, {
                      dark: "text-slate-400",
                      light: "text-slate-600",
                    })} text-xs leading-relaxed`}
                  >
                    Applied to all predictions this gameweek
                  </div>
                </div>
              </div>
            )}

            {activeGameweekChips.includes("allInWeek") && (
              <div
                className={`flex items-center ${getThemeStyles(theme, {
                  dark: "bg-slate-700/40",
                  light: "bg-slate-100/40",
                })} border border-red-500/20 rounded-lg px-3 py-2.5`}
              >
                <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-red-500/20 border border-red-500/30 mr-3 text-lg">
                  🎯
                </div>
                <div className="flex-1">
                  <div className="text-red-300 text-sm font-medium">
                    All-In Week
                  </div>
                  <div
                    className={`${getThemeStyles(theme, {
                      dark: "text-slate-400",
                      light: "text-slate-600",
                    })} text-xs leading-relaxed`}
                  >
                    All gameweek points doubled
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Points potential */}
      <PointsPotential
        fixture={fixture}
        homeScore={homeScore}
        awayScore={awayScore}
        selectedChips={selectedChips}
        activeGameweekChips={activeGameweekChips}
      />
    </motion.div>
  );
}
