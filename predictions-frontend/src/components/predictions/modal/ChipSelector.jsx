import { useContext } from "react";
import { motion } from "framer-motion";
import { ThemeContext } from "../../../context/ThemeContext";
import { useChipManagement } from "../../../context/ChipManagementContext";
import { CheckIcon, InfoCircledIcon, LightningBoltIcon, LockClosedIcon } from "@radix-ui/react-icons";
import { formatCooldownDisplay, formatSeasonLimitDisplay } from "../../../utils/chipManager";

// Helper functions for dynamic styling
const getSelectedStyles = (color) => {
  const styles = {
    emerald: "border-emerald-400/60 bg-emerald-500/10 shadow-lg shadow-emerald-500/10",
    purple: "border-purple-400/60 bg-purple-500/10 shadow-lg shadow-purple-500/10",
    amber: "border-amber-400/60 bg-amber-500/10 shadow-lg shadow-amber-500/10",
    cyan: "border-cyan-400/60 bg-cyan-500/10 shadow-lg shadow-cyan-500/10",
    blue: "border-blue-400/60 bg-blue-500/10 shadow-lg shadow-blue-500/10",
    rose: "border-rose-400/60 bg-rose-500/10 shadow-lg shadow-rose-500/10",
  };
  return styles[color] || styles.emerald;
};

const getDisabledStyles = (theme) => {
  return theme === "dark"
    ? "border-slate-600/30 bg-slate-800/20 opacity-50 cursor-not-allowed"
    : "border-slate-300/30 bg-slate-100/20 opacity-50 cursor-not-allowed";
};

const getDefaultStyles = (theme) => {
  return theme === "dark"
    ? "border-slate-600/40 bg-slate-800/30 hover:bg-slate-800/50 hover:border-slate-500/60"
    : "border-slate-300/40 bg-slate-50/30 hover:bg-slate-100/50 hover:border-slate-400/60";
};

const getChipIconStyles = (color, isSelected, theme) => {
  if (isSelected) {
    const styles = {
      emerald: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
      purple: "bg-purple-500/20 text-purple-300 border-purple-500/30",
      amber: "bg-amber-500/20 text-amber-300 border-amber-500/30",
      cyan: "bg-cyan-500/20 text-cyan-300 border-cyan-500/30",
      blue: "bg-blue-500/20 text-blue-300 border-blue-500/30",
      rose: "bg-rose-500/20 text-rose-300 border-rose-500/30",
    };
    return styles[color] || styles.emerald;
  }
  return theme === "dark"
    ? "bg-slate-700/30 text-slate-400 border-slate-600/40"
    : "bg-slate-200/30 text-slate-600 border-slate-300/40";
};

const getChipTextStyles = (color, isSelected, theme) => {
  if (isSelected) {
    const styles = {
      emerald: "text-emerald-300",
      purple: "text-purple-300",
      amber: "text-amber-300",
      cyan: "text-cyan-300",
      blue: "text-blue-300",
      rose: "text-rose-300",
    };
    return styles[color] || styles.emerald;
  }
  return theme === "dark" ? "text-slate-200" : "text-slate-800";
};

const getCheckIconStyles = (color) => {
  const styles = {
    emerald: "bg-emerald-500/20 border-emerald-500/30 text-emerald-300",
    purple: "bg-purple-500/20 border-purple-500/30 text-purple-300",
    amber: "bg-amber-500/20 border-amber-500/30 text-amber-300",
    cyan: "bg-cyan-500/20 border-cyan-500/30 text-cyan-300",
    blue: "bg-blue-500/20 border-blue-500/30 text-blue-300",
    rose: "bg-rose-500/20 border-rose-500/30 text-rose-300",
  };
  return styles[color] || styles.emerald;
};

export default function ChipSelector({
  selectedChips,
  onToggleChip,
  toggleChipInfoModal,
  gameweek,
  maxChips = 2,
  lockedChips = [], // Chips that cannot be removed (already applied)
  userPredictions = [], // For validating gameweek-limited chips
  currentMatchId = null // Current match ID (to exclude when checking usage)
}) {
  const { theme } = useContext(ThemeContext);
  const { getMatchChips, canUseChip, getChipInfo, isChipUsedInGameweek } = useChipManagement();

  // Get match-scoped chips with availability info
  const matchChips = getMatchChips();

  // Check if a chip is locked (cannot be removed)
  const isChipLocked = (chipId) => lockedChips.includes(chipId);

  // Check if a MATCH-SCOPED chip with gameweek limit is already used
  const isGameweekLimitReached = (chipId) => {
    const chipInfo = getChipInfo(chipId);
    const isMatchScopedWithLimit = chipInfo?.scope === 'match' && chipInfo?.gameweekLimit;

    if (!isMatchScopedWithLimit) {
      return false;
    }

    return isChipUsedInGameweek(chipId, gameweek, userPredictions, currentMatchId);
  };

  return (
    <div className="mb-4 sm:mb-6">
      <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-purple-500/20 flex items-center justify-center border border-purple-500/30">
          <LightningBoltIcon className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400" />
        </div>
        <div className="flex items-center justify-between w-full">
          <h3
            className={`${
              theme === "dark" ? "text-slate-100" : "text-slate-900"
            } text-lg sm:text-xl font-bold font-outfit`}
          >
            Match Chips
          </h3>
          <span className="text-purple-300 text-2xs sm:text-xs bg-purple-500/20 border border-purple-500/30 rounded-full px-2 sm:px-3 py-0.5 sm:py-1 font-medium">
            {selectedChips.length}/{maxChips}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3 mb-3 sm:mb-4">
        {matchChips.map((chip) => {
          const isSelected = selectedChips.includes(chip.id);
          const isLocked = isChipLocked(chip.id);
          const chipAvailable = chip.available;
          const gameweekLimitReached = !isSelected && !isLocked && isGameweekLimitReached(chip.id);
          const isDisabled = (!isSelected && selectedChips.length >= maxChips) ||
                            (!chipAvailable && !isLocked) ||
                            gameweekLimitReached;
          const cooldownDisplay = formatCooldownDisplay(chip);
          const seasonLimitDisplay = formatSeasonLimitDisplay(chip.id, chip.usageCount || 0);

          return (
            <motion.button
              key={chip.id}
              type="button"
              onClick={() => {
                if (isLocked && isSelected) {
                  onToggleChip(chip.id);
                  return;
                }
                if (chipAvailable || isSelected) {
                  onToggleChip(chip.id);
                }
              }}
              disabled={isDisabled && !isSelected && !isLocked}
              whileHover={{ scale: isDisabled && !isSelected ? 1 : 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`relative flex items-center rounded-lg sm:rounded-xl border p-2.5 sm:p-3 transition-all duration-200 ${
                isSelected
                  ? getSelectedStyles(chip.color)
                  : isDisabled
                  ? getDisabledStyles(theme)
                  : getDefaultStyles(theme)
              }`}
              title={
                isLocked
                  ? 'This chip cannot be removed once applied'
                  : gameweekLimitReached
                  ? 'This chip has already been used in this gameweek'
                  : !chipAvailable
                  ? chip.reason
                  : chip.description
              }
            >
              <div
                className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center mr-2 sm:mr-3 border flex-shrink-0 ${getChipIconStyles(chip.color, isSelected, theme)}`}
              >
                {isLocked ? (
                  <div className="relative">
                    <span className="text-base sm:text-lg opacity-50">{chip.icon}</span>
                    <LockClosedIcon className="w-3 h-3 sm:w-4 sm:h-4 absolute -bottom-1 -right-1 text-amber-400" />
                  </div>
                ) : !chipAvailable && !isSelected ? (
                  <LockClosedIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                ) : (
                  <span className="text-base sm:text-lg">{chip.icon}</span>
                )}
              </div>

              <div className="flex-1 text-left min-w-0">
                <div className="flex items-center gap-1 sm:gap-1.5">
                  <div
                    className={`text-xs sm:text-sm font-medium transition-colors truncate ${getChipTextStyles(chip.color, isSelected, theme)}`}
                  >
                    {chip.name}
                  </div>
                  {isLocked && (
                    <div className={`text-2xs px-1 sm:px-1.5 py-0.5 rounded font-medium flex-shrink-0 ${
                      theme === 'dark'
                        ? 'bg-amber-900/30 text-amber-400 border border-amber-700/30'
                        : 'bg-amber-100 text-amber-700 border border-amber-300'
                    }`}>
                      Locked
                    </div>
                  )}
                </div>
                {!chipAvailable && !isSelected && !isLocked && !gameweekLimitReached && (
                  <div className="text-2xs sm:text-xs text-red-400 mt-0.5 truncate">
                    {cooldownDisplay || seasonLimitDisplay || 'Unavailable'}
                  </div>
                )}
                {gameweekLimitReached && !isSelected && !isLocked && (
                  <div className="text-2xs sm:text-xs text-amber-400 mt-0.5 truncate">
                    Already used this gameweek
                  </div>
                )}
                {chipAvailable && seasonLimitDisplay && !isSelected && (
                  <div className="text-2xs sm:text-xs text-slate-400 mt-0.5 truncate">
                    {seasonLimitDisplay}
                  </div>
                )}
              </div>

              {isSelected && !isLocked && (
                <div
                  className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center ml-1.5 sm:ml-2 flex-shrink-0 ${getCheckIconStyles(chip.color)}`}
                >
                  <CheckIcon className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                </div>
              )}
              {isSelected && isLocked && (
                <div className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center ml-1.5 sm:ml-2 flex-shrink-0 ${
                  theme === 'dark'
                    ? 'bg-amber-500/20 border border-amber-500/30'
                    : 'bg-amber-200 border border-amber-300'
                }`}>
                  <LockClosedIcon className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-amber-400" />
                </div>
              )}
            </motion.button>
          );
        })}
      </div>

      <div>
        <button
          onClick={(e) => {
            e.preventDefault();
            toggleChipInfoModal();
          }}
          className={`${
            theme === "dark"
              ? "text-purple-300 hover:text-purple-200"
              : "text-purple-600 hover:text-purple-700"
          } text-xs sm:text-sm flex items-center transition-colors font-medium py-1`}
        >
          <InfoCircledIcon className="mr-1.5 sm:mr-2 w-3.5 h-3.5 sm:w-4 sm:h-4" />
          Learn more about all available chips
        </button>
      </div>
    </div>
  );
}
