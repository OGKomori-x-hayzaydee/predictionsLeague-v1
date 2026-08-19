import React, { useContext } from "react";
import { motion } from "framer-motion";
import { DoubleArrowUpIcon, DoubleArrowDownIcon } from "@radix-ui/react-icons";
import { ThemeContext } from "../../context/ThemeContext";
import { backgrounds, text, status } from "../../utils/themeUtils";
import { padding, margins, textScale, iconSize, borderRadius } from "../../utils/mobileScaleUtils";

const StatCard = ({ title, value, subtitle, badge, icon, trend }) => {
  const { theme } = useContext(ThemeContext);

  return (
    <motion.div
      whileHover={{ y: -3, scale: 1.02 }}
      transition={{ duration: 0.2 }}
      className={`relative ${
        theme === "dark"
          ? "bg-slate-800/40 border-slate-700/50 hover:border-slate-600/50"
          : "bg-white border-slate-200 hover:border-slate-300 shadow-sm"
      } backdrop-blur-sm ${borderRadius.card} ${padding.cardCompact} border transition-all duration-200 overflow-hidden group`}
    >
      {" "}
      {/* Background gradient on hover */}
      <div
        className={`absolute inset-0 bg-gradient-to-br ${
          theme === "dark"
            ? "from-teal-500/5 to-indigo-500/5"
            : "from-teal-50 to-indigo-50"
        } opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
      />
      <div className="relative">
        {" "}
        {/* Header with icon and badge */}
        <div className={`flex justify-between items-start ${margins.bottom.tight}`}>
          <div className="flex items-center gap-1.5 sm:gap-2">
            {" "}
            {icon && (
              <div
                className={`p-1 sm:p-1.5 ${
                  theme === "dark"
                    ? "bg-teal-500/10 border-teal-500/20"
                    : "bg-teal-50 border-teal-200"
                } rounded border flex items-center justify-center`}
              >
                <div
                  className={`${iconSize.tiny} ${
                    theme === "dark" ? "text-teal-400" : "text-teal-600"
                  }`}
                >
                  {icon}
                </div>
              </div>
            )}
            <h3
              className={`${
                theme === "dark" ? "text-slate-300" : "text-slate-600"
              } font-outfit font-medium ${textScale.label}`}
            >
              {title}
            </h3>
          </div>
          {badge &&
            (badge.icon ? (
              <span
                className={`${textScale.labelTiny} font-medium py-0.5 px-1.5 sm:py-1 sm:px-2 rounded-full ${
                  theme === "dark"
                    ? "text-white/60 bg-slate-700/30"
                    : "text-slate-500 bg-slate-100"
                }`}
              >
                {badge.icon}
              </span>
            ) : (
              <span
                className={`
                ${
                  badge.type === "success"
                    ? theme === "dark"
                      ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                      : "bg-emerald-50 text-emerald-600 border-emerald-100"
                    : badge.type === "info"
                    ? theme === "dark"
                      ? "bg-blue-500/10 text-blue-400 border-blue-500/20"
                      : "bg-blue-50 text-blue-600 border-blue-100"
                    : theme === "dark"
                    ? "bg-slate-500/10 text-slate-400 border-slate-500/20"
                    : "bg-slate-100 text-slate-600 border-slate-200"
                }
                ${textScale.labelTiny} font-medium py-0.5 px-2 sm:py-1 sm:px-3 rounded-full border
              `}
              >
                {badge.text}
              </span>
            ))}
        </div>{" "}
        {/* Value and trend */}
        <div className={`flex items-baseline gap-1 sm:gap-2 ${margins.bottom.tight}`}>
          <p
            className={`text-2xl sm:text-3xl md:text-4xl font-bold ${
              theme === "dark" ? "text-white" : "text-slate-800"
            } font-dmSerif leading-none`}
          >
            {value}
          </p>
          {trend && (
            <div
              className={`flex items-center gap-0.5 sm:gap-1 px-1 sm:px-1.5 py-0.5 rounded-md ${
                trend.direction === "up"
                  ? theme === "dark"
                    ? "bg-emerald-500/10 text-emerald-400"
                    : "bg-emerald-50 text-emerald-600"
                  : theme === "dark"
                  ? "bg-red-500/10 text-red-400"
                  : "bg-red-50 text-red-600"
              }`}
            >
              {trend.direction === "up" ? (
                <DoubleArrowUpIcon className={iconSize.tiny} />
              ) : (
                <DoubleArrowDownIcon className={iconSize.tiny} />
              )}
              <span className={`${textScale.labelTiny} font-medium`}>{trend.value}</span>
            </div>
          )}{" "}
        </div>
        {/* Subtitle */}
        <div
          className={`${
            theme === "dark" ? "text-slate-400" : "text-slate-500"
          } ${textScale.labelTiny} font-outfit leading-tight`}
        >
          {subtitle}
        </div>
      </div>
    </motion.div>
  );
};

export default StatCard;
