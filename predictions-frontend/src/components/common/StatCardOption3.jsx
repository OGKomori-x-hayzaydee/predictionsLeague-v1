import React, { useContext } from "react";
import { motion } from "framer-motion";
import { DoubleArrowUpIcon, DoubleArrowDownIcon } from "@radix-ui/react-icons";
import { ThemeContext } from "../../context/ThemeContext";
import { padding, margins, textScale, iconSize, borderRadius } from "../../utils/mobileScaleUtils";

/**
 * StatCard Option 3: Glassmorphic Design
 * - More translucent background
 * - Stronger blur effect
 * - Floating elevation on hover
 * - Gradient overlays
 * - Premium feel
 */
const StatCardOption3 = ({ title, value, subtitle, badge, icon, trend, accentColor = "teal" }) => {
  const { theme } = useContext(ThemeContext);

  // Accent color variants with gradients - adapted to app colors
  const accentColors = {
    teal: {
      gradient: "from-teal-600/40 via-cyan-600/20 to-indigo-600/10",
      iconGlow: theme === "dark" ? "text-teal-300 drop-shadow-[0_0_12px_rgba(94,234,212,0.6)]" : "text-teal-600",
      border: theme === "dark" ? "border-teal-500/40" : "border-teal-200",
    },
    purple: {
      gradient: "from-purple-600/40 via-fuchsia-600/20 to-pink-600/10",
      iconGlow: theme === "dark" ? "text-purple-300 drop-shadow-[0_0_12px_rgba(216,180,254,0.6)]" : "text-purple-600",
      border: theme === "dark" ? "border-purple-500/40" : "border-purple-200",
    },
    blue: {
      gradient: "from-blue-600/40 via-indigo-600/20 to-purple-600/10",
      iconGlow: theme === "dark" ? "text-blue-300 drop-shadow-[0_0_12px_rgba(147,197,253,0.6)]" : "text-blue-600",
      border: theme === "dark" ? "border-blue-500/40" : "border-blue-200",
    },
    amber: {
      gradient: "from-amber-600/40 via-orange-600/20 to-red-600/10",
      iconGlow: theme === "dark" ? "text-amber-300 drop-shadow-[0_0_12px_rgba(252,211,77,0.6)]" : "text-amber-600",
      border: theme === "dark" ? "border-amber-500/40" : "border-amber-200",
    },
  };

  const accent = accentColors[accentColor] || accentColors.teal;

  return (
    <motion.div
      whileHover={{ y: -6, scale: 1.03 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className={`relative ${
        theme === "dark"
          ? "bg-gradient-to-br from-slate-800 via-slate-800/95 to-slate-900 border-slate-700/50 hover:border-slate-600/80"
          : "bg-gradient-to-br from-white via-slate-50 to-slate-100 border-slate-200/60 hover:border-slate-300"
      } backdrop-blur-xl ${borderRadius.card} ${padding.cardCompact} border transition-all duration-300 overflow-hidden group
      ${theme === "dark" ? "hover:shadow-2xl hover:shadow-slate-900/80" : "shadow-lg hover:shadow-xl shadow-slate-200/50"}`}
    >
      {/* Colored gradient overlay - matching the reference image */}
      <div
        className={`absolute inset-0 bg-gradient-to-br ${accent.gradient} opacity-30 group-hover:opacity-40 transition-opacity duration-500`}
      />

      {/* Subtle mesh gradient pattern */}
      <div className="absolute inset-0 opacity-20 group-hover:opacity-30 transition-opacity duration-500">
        <div className={`absolute -top-10 -left-10 w-32 h-32 bg-gradient-to-br ${accent.gradient} rounded-full blur-2xl`} />
        <div className={`absolute -bottom-10 -right-10 w-32 h-32 bg-gradient-to-tl ${accent.gradient} rounded-full blur-2xl`} />
      </div>

      <div className="relative">
        {/* Header */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex-1">
            <h3
              className={`${
                theme === "dark" ? "text-slate-300" : "text-slate-700"
              } font-outfit font-semibold ${textScale.label} mb-1.5`}
            >
              {title}
            </h3>
            
            {/* Subtitle */}
            <p
              className={`${
                theme === "dark" ? "text-slate-500" : "text-slate-500"
              } ${textScale.labelTiny} font-outfit leading-tight`}
            >
              {subtitle}
            </p>
          </div>

          {/* Icon - simple, on the right */}
          {icon && (
            <div className={`${iconSize.large} ${accent.iconGlow} opacity-80 group-hover:opacity-100 transition-all duration-300 group-hover:scale-110`}>
              {icon}
            </div>
          )}
        </div>

        {/* Value - Takes center stage */}
        <div className="flex items-baseline gap-2 mb-2">
          <p
            className={`text-3xl sm:text-4xl md:text-5xl font-bold ${
              theme === "dark" ? "text-white" : "text-slate-900"
            } font-dmSerif leading-none tracking-tight`}
          >
            {value}
          </p>

          {trend && (
            <div
              className={`flex items-center gap-1 px-2 py-1 rounded-lg backdrop-blur-sm ${
                trend.direction === "up"
                  ? theme === "dark"
                    ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                    : "bg-emerald-100/80 text-emerald-700 border border-emerald-200"
                  : theme === "dark"
                  ? "bg-red-500/20 text-red-300 border border-red-500/30"
                  : "bg-red-100/80 text-red-700 border border-red-200"
              }`}
            >
              {trend.direction === "up" ? (
                <DoubleArrowUpIcon className={iconSize.tiny} />
              ) : (
                <DoubleArrowDownIcon className={iconSize.tiny} />
              )}
              <span className={`${textScale.labelTiny} font-bold`}>{trend.value}</span>
            </div>
          )}
        </div>

        {/* Badge - Bottom right */}
        {badge && badge.text && (
          <div className="flex justify-end">
            <span
              className={`${textScale.labelTiny} font-medium px-2.5 py-1 rounded-full backdrop-blur-sm ${
                badge.type === "success"
                  ? theme === "dark"
                    ? "bg-emerald-500/15 text-emerald-300 border border-emerald-500/30"
                    : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                  : badge.type === "info"
                  ? theme === "dark"
                    ? "bg-blue-500/15 text-blue-300 border border-blue-500/30"
                    : "bg-blue-50 text-blue-700 border border-blue-200"
                  : theme === "dark"
                  ? "bg-slate-500/15 text-slate-400 border border-slate-500/30"
                  : "bg-slate-100 text-slate-600 border border-slate-300"
              }`}
            >
              {badge.text}
            </span>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default StatCardOption3;
