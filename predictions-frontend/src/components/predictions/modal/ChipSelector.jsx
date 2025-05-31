import { useContext } from "react";
import { motion } from "framer-motion";
import { ThemeContext } from "../../../context/ThemeContext";
import { CheckIcon, InfoCircledIcon, LightningBoltIcon } from "@radix-ui/react-icons";

// Helper functions for dynamic styling
const getSelectedStyles = (color) => {
  const styles = {
    emerald: "border-emerald-400/60 bg-emerald-500/10 shadow-lg shadow-emerald-500/10",
    purple: "border-purple-400/60 bg-purple-500/10 shadow-lg shadow-purple-500/10",
    amber: "border-amber-400/60 bg-amber-500/10 shadow-lg shadow-amber-500/10",
    cyan: "border-cyan-400/60 bg-cyan-500/10 shadow-lg shadow-cyan-500/10",
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
  };
  return styles[color] || styles.emerald;
};

const availableChips = [
  {
    id: "doubleDown",
    name: "Double Down",
    description: "Double all points earned from this match",
    icon: "2x",
    color: "emerald"
  },
  {
    id: "wildcard",
    name: "Wildcard",
    description: "Triple all points earned from this match",
    icon: "3x",
    color: "purple"
  },
  {
    id: "opportunist",
    name: "Opportunist",
    description: "Change predictions up to 30 min before kickoff",
    icon: "⏱️",
    color: "amber"
  },
  {
    id: "scorerFocus",
    name: "Scorer Focus",
    description: "Double all points from goalscorer predictions",
    icon: "⚽",
    color: "cyan"
  },
];

export default function ChipSelector({ 
  selectedChips, 
  onToggleChip, 
  toggleChipInfoModal,
  maxChips = 2 
}) {
  const { theme } = useContext(ThemeContext);

  return (
    <div className="mb-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center border border-purple-500/30">
          <LightningBoltIcon className="w-5 h-5 text-purple-400" />
        </div>
        <div className="flex items-center justify-between w-full">
          <h3
            className={`${
              theme === "dark" ? "text-slate-100" : "text-slate-900"
            } text-xl font-bold font-outfit`}
          >
            Match Chips
          </h3>
          <span className="text-purple-300 text-xs bg-purple-500/20 border border-purple-500/30 rounded-full px-3 py-1 font-medium">
            {selectedChips.length}/{maxChips}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        {availableChips.map((chip) => {
          const isSelected = selectedChips.includes(chip.id);
          const isDisabled = !isSelected && selectedChips.length >= maxChips;

          return (            <motion.button
              key={chip.id}
              type="button"
              onClick={() => onToggleChip(chip.id)}
              disabled={isDisabled}
              whileHover={{ scale: isDisabled ? 1 : 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`relative flex items-center rounded-xl border p-3 transition-all duration-200 ${
                isSelected
                  ? getSelectedStyles(chip.color)
                  : isDisabled
                  ? getDisabledStyles(theme)
                  : getDefaultStyles(theme)
              }`}
            >              <div
                className={`w-10 h-10 rounded-lg flex items-center justify-center mr-3 border ${getChipIconStyles(chip.color, isSelected, theme)}`}
              >
                <span className="text-lg">{chip.icon}</span>
              </div>

              <div className="flex-1 text-left">
                <div
                  className={`text-sm font-medium transition-colors ${getChipTextStyles(chip.color, isSelected, theme)}`}
                >
                  {chip.name}
                </div>
              </div>

              {isSelected && (
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center ml-2 ${getCheckIconStyles(chip.color)}`}
                >
                  <CheckIcon className="w-3 h-3" />
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
          } text-sm flex items-center transition-colors font-medium`}
        >
          <InfoCircledIcon className="mr-2 w-4 h-4" />
          Learn more about all available chips
        </button>
      </div>
    </div>
  );
}
