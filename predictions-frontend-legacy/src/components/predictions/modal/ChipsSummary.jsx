import { useContext } from "react";
import { ThemeContext } from "../../../context/ThemeContext";
import { getThemeStyles } from "../../../utils/themeUtils";
import { LightningBoltIcon } from "@radix-ui/react-icons";
import { CHIP_CONFIG } from "../../../utils/chipManager";

// Convert CHIP_CONFIG to availableChips format for display
// Only show match-scoped chips (doubleDown, wildcard, scorerFocus)
const availableChips = Object.values(CHIP_CONFIG)
  .filter(chip => ['doubleDown', 'wildcard', 'scorerFocus'].includes(chip.id))
  .map(chip => ({
    id: chip.id,
    name: chip.name,
    description: chip.description,
    icon: chip.icon,
    color: chip.color === 'teal' ? 'emerald' : chip.color === 'green' ? 'sky' : chip.color
  }));

export default function ChipsSummary({ selectedChips }) {
  const { theme } = useContext(ThemeContext);

  return (
    <div
      className={`${getThemeStyles(theme, {
        dark: "bg-slate-800/50 border-slate-700/60",
        light: "bg-slate-50/50 border-slate-200/60",
      })} border rounded-lg sm:rounded-xl p-3 sm:p-4 mb-3 sm:mb-4 font-outfit`}
    >
      <h4
        className={`${getThemeStyles(theme, {
          dark: "text-slate-200",
          light: "text-slate-800",
        })} text-xs sm:text-sm font-medium mb-2 sm:mb-3 flex items-center`}
      >
        <LightningBoltIcon className="mr-1.5 sm:mr-2 w-3.5 h-3.5 sm:w-4 sm:h-4 text-purple-400" />
        Selected Match Chips
      </h4>

      {selectedChips.length === 0 ? (
        <div
          className={`${getThemeStyles(theme, {
            dark: "text-slate-400 bg-slate-700/30",
            light: "text-slate-600 bg-slate-100/30",
          })} text-xs sm:text-sm py-2 px-3 rounded-lg text-center`}
        >
          No chips selected for this match
        </div>
      ) : (
        <div className="space-y-2">
          {selectedChips.map((chipId) => {
            const chip = availableChips.find((c) => c.id === chipId);
            if (!chip) return null;

            return (
              <div
                key={chipId}
                className={`flex items-center ${getThemeStyles(theme, {
                  dark: "bg-slate-700/40",
                  light: "bg-slate-100/40",
                })} border border-${chip.color}-500/20 rounded-lg px-2.5 sm:px-3 py-2 sm:py-2.5`}
              >
                <div
                  className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center bg-${chip.color}-500/20 border border-${chip.color}-500/30 mr-2 sm:mr-3 text-base sm:text-lg`}
                >
                  {chip.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className={`text-${chip.color}-300 text-xs sm:text-sm font-medium`}>
                    {chip.name}
                  </div>
                  <div
                    className={`${getThemeStyles(theme, {
                      dark: "text-slate-400",
                      light: "text-slate-600",
                    })} text-2xs sm:text-xs leading-relaxed`}
                  >
                    {chip.description}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
