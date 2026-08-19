import React, { useContext, useMemo } from 'react';
import { StarIcon } from '@radix-ui/react-icons';
import { ThemeContext } from '../../../context/ThemeContext';
import { getThemeStyles } from '../../../utils/themeUtils';

export default function PointsPotential({
  homeScore,
  awayScore,
  selectedChips,
  activeGameweekChips,
  fixture // For team logos/crests
}) {
  const { theme } = useContext(ThemeContext);


  // References: chipUtils.js:72-150, RulesAndPointsModal.jsx:47-54
  const calculateMaxPotential = useMemo(() => {
    // STEP 1: Base Points - Assume best case (exact scoreline + all scorers correct)
    // From Rules: "Perfect prediction" = 15 points (not additive)
    const basePoints = 15;

    // STEP 2: Goalscorer Points
    const totalScorers = homeScore + awayScore;
    let goalscorerPoints;
    if (selectedChips.includes("scorerFocus")) {
      goalscorerPoints = totalScorers * 4; // Scorer Focus: +4 per scorer
    } else {
      goalscorerPoints = totalScorers * 2; // Normal: +2 per scorer
    }

    // STEP 3: Subtotal before multiplier chips
    let subtotal = basePoints + goalscorerPoints;

    // STEP 4: Apply multiplier chips (all stack sequentially, matching backend)
    let matchPoints = subtotal;
    if (selectedChips.includes("wildcard")) {
      matchPoints *= 3; // Wildcard: 3x
    }
    if (selectedChips.includes("doubleDown")) {
      matchPoints *= 2; // Double Down: 2x (stacks with wildcard)
    }
    if (activeGameweekChips.includes("allInWeek")) {
      matchPoints *= 2; // All-In Week: 2x (stacks with other multipliers)
    }

    // STEP 5: Defense++ Bonus (+5 per correctly predicted clean sheet, AFTER multipliers)
    let defenseBonusPoints = 0;
    if (activeGameweekChips.includes("defensePlusPlus")) {
      let cleanSheets = 0;
      if (awayScore === 0) cleanSheets++; // Home team clean sheet (away scored 0)
      if (homeScore === 0) cleanSheets++; // Away team clean sheet (home scored 0)
      defenseBonusPoints = 5 * cleanSheets;
    }

    // STEP 6: Final total
    let total = matchPoints + defenseBonusPoints;

    return {
      total: Math.round(total),
      breakdown: {
        basePoints,
        goalscorerPoints,
        scorerFocusApplied: selectedChips.includes("scorerFocus"),
        subtotal,
        wildcardApplied: selectedChips.includes("wildcard"),
        doubleDownApplied: selectedChips.includes("doubleDown"),
        matchPoints,
        defenseBonusPoints,
        allInWeekApplied: activeGameweekChips.includes("allInWeek")
      }
    };
  }, [homeScore, awayScore, selectedChips, activeGameweekChips]);

  return (
    <div
      className={`${getThemeStyles(theme, {
        dark: "bg-slate-800/50 border-slate-700/60",
        light: "bg-slate-50/50 border-slate-200/60",
      })} border rounded-lg sm:rounded-xl p-3 sm:p-4 font-outfit`}
    >
      <h4
        className={`${getThemeStyles(theme, {
          dark: "text-slate-200",
          light: "text-slate-800",
        })} text-xs sm:text-sm font-medium mb-3 sm:mb-4 flex items-center`}
      >
        <StarIcon className="mr-1.5 sm:mr-2 w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400" />
        Points Potential
      </h4>

      <div className="space-y-3">
        {/* Base points - exact scoreline with all scorers */}
        <div className="flex justify-between items-center text-sm">
          <span
            className={`${getThemeStyles(theme, {
              dark: "text-slate-300",
              light: "text-slate-700",
            })} flex items-center`}
          >
            <div className="w-2 h-2 bg-amber-500 rounded-full mr-2"></div>
            Exact scoreline + all scorers
          </span>
          <span
            className={`${getThemeStyles(theme, {
              dark: "text-slate-200",
              light: "text-slate-800",
            })} font-medium`}
          >
            {calculateMaxPotential.breakdown.basePoints} points
          </span>
        </div>

        {/* Goalscorer points */}
        {(homeScore + awayScore) > 0 && (
          <div className="flex justify-between items-center text-sm">
            <span
              className={`${getThemeStyles(theme, {
                dark: "text-slate-300",
                light: "text-slate-700",
              })} flex items-center`}
            >
              <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
              Goalscorer predictions ({homeScore + awayScore} × {selectedChips.includes("scorerFocus") ? 4 : 2})
            </span>
            <span
              className={`${getThemeStyles(theme, {
                dark: "text-slate-200",
                light: "text-slate-800",
              })} font-medium`}
            >
              {calculateMaxPotential.breakdown.goalscorerPoints} points
            </span>
          </div>
        )}

        {/* Scorer Focus chip indicator */}
        {selectedChips.includes("scorerFocus") && (homeScore + awayScore) > 0 && (
          <div className="flex justify-between items-center text-sm">
            <span
              className={`flex items-center ${getThemeStyles(theme, {
                dark: "text-cyan-300",
                light: "text-cyan-700",
              })}`}
            >
              <div className="w-2 h-2 bg-cyan-500 rounded-full mr-2"></div>
              <span className="mr-1">⚽</span> Scorer Focus (+4 per scorer)
            </span>
            <span
              className={`font-medium ${getThemeStyles(theme, {
                dark: "text-cyan-300",
                light: "text-cyan-700",
              })}`}
            >
              included above
            </span>
          </div>
        )}

        {/* Match chip multipliers - only one applies */}
        {selectedChips.includes("wildcard") && (
          <div className="flex justify-between items-center text-sm">
            <span
              className={`flex items-center ${getThemeStyles(theme, {
                dark: "text-purple-300",
                light: "text-purple-700",
              })}`}
            >
              <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
              Wildcard (3x match)
            </span>
            <span
              className={`font-medium ${getThemeStyles(theme, {
                dark: "text-purple-300",
                light: "text-purple-700",
              })}`}
            >
              ×3 multiplier
            </span>
          </div>
        )}

        {selectedChips.includes("doubleDown") && (
          <div className="flex justify-between items-center text-sm">
            <span
              className={`flex items-center ${getThemeStyles(theme, {
                dark: "text-emerald-300",
                light: "text-emerald-700",
              })}`}
            >
              <div className="w-2 h-2 bg-emerald-500 rounded-full mr-2"></div>
              Double Down (2x match)
            </span>
            <span
              className={`font-medium ${getThemeStyles(theme, {
                dark: "text-emerald-300",
                light: "text-emerald-700",
              })}`}
            >
              ×2 multiplier
            </span>
          </div>
        )}

        {/* Gameweek chip bonuses */}
        {activeGameweekChips.includes("defensePlusPlus") &&
          (homeScore === 0 || awayScore === 0) && (
            <div className="flex justify-between items-center text-sm">
              <span
                className={`flex items-center ${getThemeStyles(theme, {
                  dark: "text-blue-300",
                  light: "text-blue-700",
                })}`}
              >
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                <span className="mr-1">🛡️</span> Defense++ (+5/clean sheet)
              </span>
              <span
                className={`font-medium ${getThemeStyles(theme, {
                  dark: "text-blue-300",
                  light: "text-blue-700",
                })}`}
              >
                +{calculateMaxPotential.breakdown.defenseBonusPoints} points
              </span>
            </div>
          )}

        {activeGameweekChips.includes("allInWeek") && (
          <div className="flex justify-between items-center text-sm">
            <span
              className={`flex items-center ${getThemeStyles(theme, {
                dark: "text-red-300",
                light: "text-red-700",
              })}`}
            >
              <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
              <span className="mr-1">🎯</span> All-In Week (gameweek-wide)
            </span>
            <span
              className={`font-medium ${getThemeStyles(theme, {
                dark: "text-red-300",
                light: "text-red-700",
              })}`}
            >
              ×2 multiplier
            </span>
          </div>
        )}

        {/* Total potential */}
        <div
          className={`border-t ${getThemeStyles(theme, {
            dark: "border-slate-600/50",
            light: "border-slate-300/50",
          })} pt-3 mt-4`}
        >
          <div className="flex justify-between items-center">
            <span
              className={`${getThemeStyles(theme, {
                dark: "text-slate-100",
                light: "text-slate-900",
              })} font-semibold text-sm`}
            >
              Maximum potential
            </span>
            <span
              className={`${getThemeStyles(theme, {
                dark: "text-amber-400",
                light: "text-amber-600",
              })} font-bold text-lg sm:text-xl`}
            >
              {calculateMaxPotential.total} pts
            </span>
          </div>
          {/* Show subtotal before All-In Week if applied */}
          {activeGameweekChips.includes("allInWeek") && (
            <div className="flex justify-between items-center mt-1">
              <span
                className={`${getThemeStyles(theme, {
                  dark: "text-slate-400",
                  light: "text-slate-600",
                })} text-xs`}
              >
                (Before All-In Week: {Math.round((calculateMaxPotential.total - calculateMaxPotential.breakdown.defenseBonusPoints) / 2 + calculateMaxPotential.breakdown.defenseBonusPoints)} pts)
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
