import React, { useContext } from "react";
import { motion } from "framer-motion";
import { DoubleArrowUpIcon, DoubleArrowDownIcon } from "@radix-ui/react-icons";
import { ThemeContext } from "../../context/ThemeContext";
import { padding, margins, textScale, iconSize, borderRadius } from "../../utils/mobileScaleUtils";

/**
 * StatCard Option 2: Accent Bar Design
 * - Colored accent bar on left edge
 * - Icon inline with title
 * - Cleaner badge design
 * - Better mobile scaling
 */
const StatCardOption2 = ({ title, value, subtitle, badge, icon, trend, accentColor = "teal" }) => {
  const { theme } = useContext(ThemeContext);

  // Accent color variants
  const accentColors = {
    teal: {
      bar: "bg-teal-500",
      icon: theme === "dark" ? "text-teal-400 bg-teal-500/10" : "text-teal-600 bg-teal-50",
      glow: theme === "dark" ? "shadow-teal-500/20" : "shadow-teal-200",
    },
    purple: {
      bar: "bg-purple-500",
      icon: theme === "dark" ? "text-purple-400 bg-purple-500/10" : "text-purple-600 bg-purple-50",
      glow: theme === "dark" ? "shadow-purple-500/20" : "shadow-purple-200",
    },
    blue: {
      bar: "bg-blue-500",
      icon: theme === "dark" ? "text-blue-400 bg-blue-500/10" : "text-blue-600 bg-blue-50",
      glow: theme === "dark" ? "shadow-blue-500/20" : "shadow-blue-200",
    },
    amber: {
      bar: "bg-amber-500",
      icon: theme === "dark" ? "text-amber-400 bg-amber-500/10" : "text-amber-600 bg-amber-50",
      glow: theme === "dark" ? "shadow-amber-500/20" : "shadow-amber-200",
    },
  };

  const accent = accentColors[accentColor] || accentColors.teal;

  return (
    <motion.div
      whileHover={{ y: -3, scale: 1.02 }}
      transition={{ duration: 0.2 }}
      className={`relative ${
        theme === "dark"
          ? "bg-slate-800/50 border-slate-700/50"
          : "bg-white border-slate-200 shadow-sm"
      } backdrop-blur-sm ${borderRadius.card} border transition-all duration-200 overflow-hidden group hover:shadow-lg`}
    >
      {/* Accent bar - left edge */}
      <div
        className={`absolute left-0 top-0 bottom-0 w-1 ${accent.bar} transition-all duration-300 group-hover:w-1.5`}
      />

      <div className={`${padding.cardCompact} pl-4 sm:pl-5`}>
        {/* Header: Icon and Title */}
        <div className="flex items-center gap-2 mb-2">
          {icon && (
            <div className={`p-1.5 ${accent.icon} rounded-lg ${iconSize.small}`}>
              {icon}
            </div>
          )}
          <h3
            className={`${
              theme === "dark" ? "text-slate-300" : "text-slate-700"
            } font-outfit font-semibold ${textScale.label} flex-1`}
          >
            {title}
          </h3>

          {/* Badge in header */}
          {badge && badge.icon && (
            <span
              className={`${textScale.labelTiny} ${
                theme === "dark" ? "text-slate-500" : "text-slate-400"
              }`}
            >
              {badge.icon}
            </span>
          )}
        </div>

        {/* Value and Trend */}
        <div className="flex items-baseline gap-2 mb-1">
          <p
            className={`text-2xl sm:text-3xl md:text-4xl font-bold ${
              theme === "dark" ? "text-white" : "text-slate-900"
            } font-dmSerif leading-none`}
          >
            {value}
          </p>

          {trend && (
            <div
              className={`flex items-center gap-0.5 px-1.5 py-0.5 rounded-md ${
                trend.direction === "up"
                  ? theme === "dark"
                    ? "bg-emerald-500/15 text-emerald-400"
                    : "bg-emerald-100 text-emerald-700"
                  : theme === "dark"
                  ? "bg-red-500/15 text-red-400"
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

        {/* Subtitle */}
        <div className="flex items-center justify-between gap-2">
          <p
            className={`${
              theme === "dark" ? "text-slate-500" : "text-slate-500"
            } ${textScale.labelTiny} font-outfit`}
          >
            {subtitle}
          </p>

          {badge && badge.text && (
            <span
              className={`${textScale.labelTiny} font-medium px-2 py-0.5 rounded ${
                badge.type === "success"
                  ? theme === "dark"
                    ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                    : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                  : badge.type === "info"
                  ? theme === "dark"
                    ? "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                    : "bg-blue-50 text-blue-700 border border-blue-200"
                  : theme === "dark"
                  ? "bg-slate-500/10 text-slate-400 border border-slate-500/20"
                  : "bg-slate-100 text-slate-600 border border-slate-300"
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

export default StatCardOption2;
