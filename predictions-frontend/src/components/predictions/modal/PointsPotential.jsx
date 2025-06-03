import React, { useContext } from 'react';
import { StarIcon } from '@radix-ui/react-icons';
import { ThemeContext } from '../../../context/ThemeContext';
import { getThemeStyles } from '../../../utils/themeUtils';

export default function PointsPotential({ 
  homeScore, 
  awayScore, 
  selectedChips, 
  activeGameweekChips 
}) {
  const { theme } = useContext(ThemeContext);

  // Calculate maximum potential points
  const calculateMaxPotential = () => {
    // Base points calculation
    let max = 10 + (homeScore + awayScore) * 2;

    // Apply match chip effects
    if (selectedChips.includes("opportunist")) max += 15;
    if (selectedChips.includes("scorerFocus")) max += (homeScore + awayScore) * 2;
    if (selectedChips.includes("doubleDown")) max *= 2;
    if (selectedChips.includes("wildcard")) max *= 3;

    // Apply gameweek-wide chip effects
    if (
      activeGameweekChips.includes("defensePlusPlus") &&
      (homeScore === 0 || awayScore === 0)
    ) {
      max += 10; // Potential clean sheet bonus
    }

    if (activeGameweekChips.includes("allInWeek")) {
      max *= 2; // Double all points
    }

    return `${max} points`;
  };

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
        {/* Base points */}
        <div className="flex justify-between items-center text-sm">
          <span
            className={`${getThemeStyles(theme, {
              dark: "text-slate-300",
              light: "text-slate-700",
            })} flex items-center`}
          >
            <div className="w-2 h-2 bg-emerald-500 rounded-full mr-2"></div>
            Correct outcome
          </span>
          <span
            className={`${getThemeStyles(theme, {
              dark: "text-slate-200",
              light: "text-slate-800",
            })} font-medium`}
          >
            5 points
          </span>
        </div>

        <div className="flex justify-between items-center text-sm">
          <span
            className={`${getThemeStyles(theme, {
              dark: "text-slate-300",
              light: "text-slate-700",
            })} flex items-center`}
          >
            <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
            Exact scoreline
          </span>
          <span
            className={`${getThemeStyles(theme, {
              dark: "text-slate-200",
              light: "text-slate-800",
            })} font-medium`}
          >
            10 points
          </span>
        </div>

        <div className="flex justify-between items-center text-sm">
          <span
            className={`${getThemeStyles(theme, {
              dark: "text-slate-300",
              light: "text-slate-700",
            })} flex items-center`}
          >
            <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
            Correct goalscorers
          </span>
          <span
            className={`${getThemeStyles(theme, {
              dark: "text-slate-200",
              light: "text-slate-800",
            })} font-medium`}
          >
            Up to {(homeScore + awayScore) * 2} points
          </span>
        </div>

        {/* Match chip bonuses */}
        {selectedChips.includes("doubleDown") && (
          <div className="flex justify-between items-center text-sm">
            <span
              className={`flex items-center ${getThemeStyles(theme, {
                dark: "text-emerald-300",
                light: "text-emerald-700",
              })}`}
            >
              <div className="w-2 h-2 bg-emerald-500 rounded-full mr-2"></div>
              <span className="mr-1">2x</span> Double Down bonus
            </span>
            <span
              className={`font-medium ${getThemeStyles(theme, {
                dark: "text-emerald-300",
                light: "text-emerald-700",
              })}`}
            >
              2x points
            </span>
          </div>
        )}

        {selectedChips.includes("wildcard") && (
          <div className="flex justify-between items-center text-sm">
            <span
              className={`flex items-center ${getThemeStyles(theme, {
                dark: "text-purple-300",
                light: "text-purple-700",
              })}`}
            >
              <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
              <span className="mr-1">3x</span> Wildcard bonus
            </span>
            <span
              className={`font-medium ${getThemeStyles(theme, {
                dark: "text-purple-300",
                light: "text-purple-700",
              })}`}
            >
              3x points
            </span>
          </div>
        )}

        {selectedChips.includes("opportunist") && (
          <div className="flex justify-between items-center text-sm">
            <span
              className={`flex items-center ${getThemeStyles(theme, {
                dark: "text-amber-300",
                light: "text-amber-700",
              })}`}
            >
              <div className="w-2 h-2 bg-amber-500 rounded-full mr-2"></div>
              <span className="mr-1">💰</span> Opportunist bonus
            </span>
            <span
              className={`font-medium ${getThemeStyles(theme, {
                dark: "text-amber-300",
                light: "text-amber-700",
              })}`}
            >
              +15 points
            </span>
          </div>
        )}

        {selectedChips.includes("scorerFocus") && (
          <div className="flex justify-between items-center text-sm">
            <span
              className={`flex items-center ${getThemeStyles(theme, {
                dark: "text-green-300",
                light: "text-green-700",
              })}`}
            >
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
              <span className="mr-1">⚽</span> Scorer Focus bonus
            </span>
            <span
              className={`font-medium ${getThemeStyles(theme, {
                dark: "text-green-300",
                light: "text-green-700",
              })}`}
            >
              2x scorer points
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
                <span className="mr-1">🛡️</span> Defense++ bonus (potential)
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
              <span className="mr-1">🎯</span> All-In Week bonus
            </span>
            <span
              className={`font-medium ${getThemeStyles(theme, {
                dark: "text-red-300",
                light: "text-red-700",
              })}`}
            >
              2x all points
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
          <div className="flex justify-between items-center text-sm">
            <span
              className={`${getThemeStyles(theme, {
                dark: "text-slate-100",
                light: "text-slate-900",
              })} font-medium`}
            >
              Maximum potential
            </span>
            <span
              className={`${getThemeStyles(theme, {
                dark: "text-slate-100",
                light: "text-slate-900",
              })} font-bold text-base`}
            >
              {calculateMaxPotential()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
