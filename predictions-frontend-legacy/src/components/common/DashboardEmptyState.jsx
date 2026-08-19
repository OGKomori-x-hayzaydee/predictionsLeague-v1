import React, { useContext } from "react";
import { motion } from "framer-motion";
import { 
  CalendarIcon, 
  ExclamationTriangleIcon,
  RocketIcon,
  MagnifyingGlassIcon 
} from "@radix-ui/react-icons";
import { ThemeContext } from "../../context/ThemeContext";

const DashboardEmptyState = ({ type, title, message, action }) => {
  const { theme } = useContext(ThemeContext);

  const getIcon = () => {
    switch (type) {
      case "matches":
        return <CalendarIcon className="w-8 h-8" />;
      case "predictions":
        return <RocketIcon className="w-8 h-8" />;
      case "leagues":
        return <MagnifyingGlassIcon className="w-8 h-8" />;
      case "insights":
        return <RocketIcon className="w-8 h-8" />;
      default:
        return <ExclamationTriangleIcon className="w-8 h-8" />;
    }
  };

  const getDefaultContent = () => {
    switch (type) {
      case "matches":
        return {
          title: "No upcoming matches",
          message: "All matches for this gameweek have been completed. Check back soon for the next fixtures!"
        };
      case "predictions":
        return {
          title: "No recent predictions",
          message: "You haven't made any predictions yet. Start predicting to see your results here!"
        };
      case "leagues":
        return {
          title: "No leagues joined",
          message: "Join a league to compete with other players and track your progress!"
        };
      case "insights":
        return {
          title: "Insights Coming Soon",
          message: "Keep making predictions! Performance insights will unlock after you complete 5+ gameweeks of predictions."
        };
      default:
        return {
          title: "No data available",
          message: "There's nothing to show here right now."
        };
    }
  };

  const content = {
    title: title || getDefaultContent().title,
    message: message || getDefaultContent().message
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`${
        theme === "dark"
          ? "bg-slate-800/40 border-slate-700/50"
          : "bg-white border-slate-200 shadow-sm"
      } backdrop-blur-sm rounded-xl p-8 border text-center`}
    >
      <div className="flex flex-col items-center">
        {/* Icon */}
        <div
          className={`p-3 rounded-full mb-4 ${
            theme === "dark"
              ? "bg-slate-700/50 text-slate-400"
              : "bg-slate-100 text-slate-500"
          }`}
        >
          {getIcon()}
        </div>

        {/* Title */}
        <h3
          className={`text-lg font-semibold mb-2 font-outfit ${
            theme === "dark" ? "text-slate-200" : "text-slate-700"
          }`}
        >
          {content.title}
        </h3>

        {/* Message */}
        <p
          className={`text-sm mb-4 font-outfit max-w-sm ${
            theme === "dark" ? "text-slate-400" : "text-slate-500"
          }`}
        >
          {content.message}
        </p>

        {/* Optional action button */}
        {action && (
          <button
            onClick={action.onClick}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              theme === "dark"
                ? "bg-teal-500/20 text-teal-400 hover:bg-teal-500/30 border border-teal-500/30"
                : "bg-teal-50 text-teal-600 hover:bg-teal-100 border border-teal-200"
            }`}
          >
            {action.label}
          </button>
        )}
      </div>
    </motion.div>
  );
};

export default DashboardEmptyState;
