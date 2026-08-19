import React, { useContext } from "react";
import { motion } from "framer-motion";
import { DoubleArrowUpIcon, DoubleArrowDownIcon } from "@radix-ui/react-icons";
import { ThemeContext } from "../../context/ThemeContext";
import { padding, margins, textScale, iconSize, borderRadius } from "../../utils/mobileScaleUtils";

/**
 * StatCard Option 1: Minimal & Modern
 * - No icon background boxes
 * - Icon floats top-right as accent
 * - Value takes center stage
 * - Gradient border on hover
 * - Card-specific accent colors
 */
const StatCardOption1 = ({ title, value, subtitle, badge, icon, trend, accentColor = "teal" }) => {
  const { theme } = useContext(ThemeContext);

  // Accent color variants
  const accentColors = {
    teal: {
      icon: theme === "dark" ? "text-teal-400" : "text-teal-600",
      gradient: "from-teal-500/10 to-teal-500/5",
      border: "border-teal-500/50",
      glow: "shadow-teal-500/20",
    },
    purple: {
      icon: theme === "dark" ? "text-purple-400" : "text-purple-600",
      gradient: "from-purple-500/10 to-purple-500/5",
      border: "border-purple-500/50",
      glow: "shadow-purple-500/20",
    },
    blue: {
      icon: theme === "dark" ? "text-blue-400" : "text-blue-600",
      gradient: "from-blue-500/10 to-blue-500/5",
      border: "border-blue-500/50",
      glow: "shadow-blue-500/20",
    },
    amber: {
      icon: theme === "dark" ? "text-amber-400" : "text-amber-600",
      gradient: "from-amber-500/10 to-amber-500/5",
      border: "border-amber-500/50",
      glow: "shadow-amber-500/20",
    },
  };

  const accent = accentColors[accentColor] || accentColors.teal;

  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.02 }}
      transition={{ duration: 0.2 }}
      className={`relative ${
        theme === "dark"
          ? "bg-slate-800/60 border-slate-700/50 hover:border-slate-600"
          : "bg-white border-slate-200 hover:border-slate-300 shadow-sm hover:shadow-md"
      } backdrop-blur-md ${borderRadius.card} ${padding.cardCompact} border transition-all duration-300 overflow-hidden group`}
    >
      {/* Gradient overlay on hover */}
      <div
        className={`absolute inset-0 bg-gradient-to-br ${accent.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
      />

      {/* Subtle top gradient accent */}
      <div className={`absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r ${accent.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />

      <div className="relative">
        {/* Header: Title and Icon */}
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3
            className={`${
              theme === "dark" ? "text-slate-400" : "text-slate-600"
            } font-outfit font-medium ${textScale.label}`}
          >
            {title}
          </h3>
          
          {/* Floating icon - top right */}
          {icon && (
            <div className={`${iconSize.normal} ${accent.icon} opacity-60 group-hover:opacity-100 transition-opacity`}>
              {icon}
            </div>
          )}
        </div>

        {/* Value and Trend */}
        <div className="flex items-baseline gap-2 mb-1.5">
          <p
            className={`text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold ${
              theme === "dark" ? "text-white" : "text-slate-900"
            } font-dmSerif leading-none tracking-tight`}
          >
            {value}
          </p>
          
          {trend && (
            <div
              className={`flex items-center gap-1 px-1.5 py-0.5 rounded ${
                trend.direction === "up"
                  ? theme === "dark"
                    ? "bg-emerald-500/20 text-emerald-400"
                    : "bg-emerald-100 text-emerald-700"
                  : theme === "dark"
                  ? "bg-red-500/20 text-red-400"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {trend.direction === "up" ? (
                <DoubleArrowUpIcon className={iconSize.tiny} />
              ) : (
                <DoubleArrowDownIcon className={iconSize.tiny} />
              )}
              <span className={`${textScale.labelTiny} font-semibold`}>{trend.value}</span>
            </div>
          )}
        </div>

        {/* Subtitle and Badge */}
        <div className="flex items-center justify-between gap-2">
          <p
            className={`${
              theme === "dark" ? "text-slate-500" : "text-slate-500"
            } ${textScale.labelTiny} font-outfit leading-tight`}
          >
            {subtitle}
          </p>

          {badge && badge.text && (
            <span
              className={`${textScale.labelTiny} font-medium px-2 py-0.5 rounded-full ${
                badge.type === "success"
                  ? theme === "dark"
                    ? "bg-emerald-500/10 text-emerald-400"
                    : "bg-emerald-50 text-emerald-700"
                  : badge.type === "info"
                  ? theme === "dark"
                    ? "bg-blue-500/10 text-blue-400"
                    : "bg-blue-50 text-blue-700"
                  : theme === "dark"
                  ? "bg-slate-500/10 text-slate-400"
                  : "bg-slate-100 text-slate-600"
              }`}
            >
              {badge.text}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default StatCardOption1;
