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
    // From Rules: "Exact scoreline with scorers" = 15 points (not additive)
    const basePoints = 15;

    // STEP 2: Goalscorer Points (2 points each)
    const totalScorers = homeScore + awayScore;
    let goalscorerPoints = totalScorers * 2;

    // 🔧 FIXED: Scorer Focus DOUBLES goalscorer points (not adds)
    if (selectedChips.includes("scorerFocus")) {
      goalscorerPoints *= 2;
    }

    // STEP 3: Subtotal before match chip multipliers
    let subtotal = basePoints + goalscorerPoints;

    // STEP 4: Apply Match-Level Chip Multipliers (only one applies, in priority order)
    let matchPoints = subtotal;
    if (selectedChips.includes("wildcard")) {
      matchPoints *= 3; // Wildcard: 3x
    } else if (selectedChips.includes("doubleDown")) {
      matchPoints *= 2; // Double Down: 2x
    }
    // Note: Scorer Focus is NOT a match multiplier, it's applied to scorers only (above)

    // STEP 5: Defense++ Bonus (if clean sheet predicted)
    let defenseBonusPoints = 0;
    if (activeGameweekChips.includes("defensePlusPlus") &&
        (homeScore === 0 || awayScore === 0)) {
      defenseBonusPoints = 10;
    }

    // STEP 6: Total before All-In Week
    let total = matchPoints + defenseBonusPoints;

    // STEP 7: All-In Week multiplier (doubles EVERYTHING including Defense++)
    if (activeGameweekChips.includes("allInWeek")) {
      total *= 2;
    }

    return {
      total: Math.round(total),
      breakdown: {
        basePoints,
        goalscorerPoints,
        scorerFocusApplied: selectedChips.includes("scorerFocus"),
        subtotal,
        matchMultiplier: selectedChips.includes("wildcard") ? 3 :
                        selectedChips.includes("doubleDown") ? 2 : 1,
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
      })} border rounded-xl p-4 font-outfit`}
    >
      <h4
        className={`${getThemeStyles(theme, {
          dark: "text-slate-200",
          light: "text-slate-800",
        })} text-sm font-medium mb-4 flex items-center`}
      >
        <StarIcon className="mr-2 w-4 h-4 text-amber-400" />
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
              Goalscorer predictions ({homeScore + awayScore} × 2)
            </span>
            <span
              className={`${getThemeStyles(theme, {
                dark: "text-slate-200",
                light: "text-slate-800",
              })} font-medium`}
            >
              {(homeScore + awayScore) * 2} points
            </span>
          </div>
        )}

        {/* Scorer Focus chip - shows effect on scorer points */}
        {selectedChips.includes("scorerFocus") && (homeScore + awayScore) > 0 && (
          <div className="flex justify-between items-center text-sm">
            <span
              className={`flex items-center ${getThemeStyles(theme, {
                dark: "text-cyan-300",
                light: "text-cyan-700",
              })}`}
            >
              <div className="w-2 h-2 bg-cyan-500 rounded-full mr-2"></div>
              <span className="mr-1">⚽</span> Scorer Focus (2x scorer pts)
            </span>
            <span
              className={`font-medium ${getThemeStyles(theme, {
                dark: "text-cyan-300",
                light: "text-cyan-700",
              })}`}
            >
              +{(homeScore + awayScore) * 2} points
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

        {selectedChips.includes("doubleDown") && !selectedChips.includes("wildcard") && (
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
                <span className="mr-1">🛡️</span> Defense++ (clean sheet)
              </span>
              <span
                className={`font-medium ${getThemeStyles(theme, {
                  dark: "text-blue-300",
                  light: "text-blue-700",
                })}`}
              >
                +10 points
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
              ×2 final total
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
              })} font-bold text-xl`}
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
                (Before All-In Week: {Math.round(calculateMaxPotential.total / 2)} pts)
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
