import React, { useContext } from "react";
import { motion } from "framer-motion";
import { LightningBoltIcon } from "@radix-ui/react-icons";
import { ThemeContext } from "../../context/ThemeContext";
import { text } from "../../utils/themeUtils";

const chipDisplayConfig = {
  wildcard: { name: "Wildcard", icon: "🃏", color: "purple" },
  tripleCaption: { name: "Triple Captain", icon: "👑", color: "amber" },
  benchBoost: { name: "Bench Boost", icon: "📈", color: "blue" },
  allInWeek: { name: "All-In Week", icon: "🎯", color: "red" },
  doubleDown: { name: "Double Down", icon: "⚡", color: "teal" },
  defensePlusPlus: { name: "Defense++", icon: "🛡️", color: "blue" },
};

const statusColors = {
  available: {
    dark: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
    light: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
  cooldown: {
    dark: "bg-amber-500/15 text-amber-400 border-amber-500/30",
    light: "bg-amber-50 text-amber-700 border-amber-200",
  },
  used: {
    dark: "bg-slate-500/15 text-slate-400 border-slate-500/30",
    light: "bg-slate-100 text-slate-500 border-slate-200",
  },
};

const ProfileChipArsenal = ({ chips = [], isLoading = false }) => {
  const { theme } = useContext(ThemeContext);

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-2">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div
              className={`h-14 ${
                theme === "dark" ? "bg-slate-700/50" : "bg-slate-200"
              } rounded-lg`}
            />
          </div>
        ))}
      </div>
    );
  }

  if (!chips || chips.length === 0) {
    return (
      <div className={`text-center py-6 ${text.muted[theme]}`}>
        <LightningBoltIcon className="w-8 h-8 mx-auto mb-2 opacity-50" />
        <p className="font-outfit text-sm">No chip data available</p>
      </div>
    );
  }

  const getChipStatusLabel = (chip) => {
    if (chip.available) return "Available";
    if (chip.reason?.toLowerCase().includes("cooldown")) return "Cooldown";
    return "Used";
  };

  const getStatusKey = (chip) => {
    if (chip.available) return "available";
    if (chip.reason?.toLowerCase().includes("cooldown")) return "cooldown";
    return "used";
  };

  return (
    <div className="grid grid-cols-2 gap-2">
      {chips.map((chip, index) => {
        const config = chipDisplayConfig[chip.chipId] || {
          name: chip.chipId,
          icon: "🎮",
          color: "teal",
        };
        const statusKey = getStatusKey(chip);
        const statusStyle =
          statusColors[statusKey]?.[theme] || statusColors.used[theme];

        return (
          <motion.div
            key={chip.chipId || index}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
            className={`flex items-center gap-2 p-2.5 rounded-lg border ${
              theme === "dark"
                ? "bg-slate-700/20 border-slate-600/30"
                : "bg-slate-50/50 border-slate-200/50"
            }`}
          >
            <span className="text-lg flex-shrink-0">{config.icon}</span>
            <div className="min-w-0 flex-1">
              <p
                className={`${text.primary[theme]} font-outfit text-xs font-medium truncate`}
              >
                {config.name}
              </p>
              <span
                className={`inline-block text-2xs px-1.5 py-0.5 rounded-full border ${statusStyle} font-outfit`}
              >
                {getChipStatusLabel(chip)}
              </span>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

export default ProfileChipArsenal;
