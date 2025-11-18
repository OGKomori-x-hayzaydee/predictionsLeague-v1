import React, { useContext, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  StackIcon,
  ListBulletIcon,
  PersonIcon,
  CalendarIcon,
  TableIcon,
  LayoutIcon,
  ChevronDownIcon,
} from "@radix-ui/react-icons";
import { ThemeContext } from "../../context/ThemeContext";

/**
 * ViewToggleBarOption1 - Compact & Integrated
 * Shows 3 main views as segmented control on mobile
 * Other views accessible via dropdown
 * Designed to sit inline with filters
 */
const ViewToggleBarOption1 = ({ viewMode, setViewMode }) => {
  const { theme } = useContext(ThemeContext);
  const [showMoreViews, setShowMoreViews] = useState(false);

  // Primary views (most used)
  const primaryViews = [
    { id: "stack", icon: StackIcon, label: "Stack" },
    { id: "list", icon: ListBulletIcon, label: "Grid" },
    { id: "teams", icon: PersonIcon, label: "Teams" },
  ];

  // Secondary views (less common)
  const secondaryViews = [
    { id: "calendar", icon: CalendarIcon, label: "Calendar" },
    { id: "table", icon: TableIcon, label: "Table" },
    { id: "carousel", icon: LayoutIcon, label: "Carousel" },
  ];

  const allViews = [...primaryViews, ...secondaryViews];
  const currentView = allViews.find(v => v.id === viewMode);

  return (
    <div className="relative">
      {/* Mobile: Compact segmented control + More button */}
      <div className="md:hidden flex items-center gap-1">
        {/* Segmented control for primary views */}
        <div
          className={`flex rounded-lg border p-0.5 ${
            theme === "dark"
              ? "bg-slate-800/50 border-slate-700"
              : "bg-slate-100 border-slate-200"
          }`}
        >
          {primaryViews.map((view) => {
            const Icon = view.icon;
            const isActive = viewMode === view.id;
            return (
              <button
                key={view.id}
                onClick={() => setViewMode(view.id)}
                className={`relative px-2.5 py-1.5 rounded-md transition-all min-h-[44px] ${
                  isActive
                    ? theme === "dark"
                      ? "bg-teal-600 text-white"
                      : "bg-teal-600 text-white shadow-sm"
                    : theme === "dark"
                    ? "text-slate-400 hover:text-white"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <Icon className="w-4 h-4" />
              </button>
            );
          })}
        </div>

        {/* More views dropdown trigger */}
        <button
          onClick={() => setShowMoreViews(!showMoreViews)}
          className={`px-2 py-1.5 rounded-lg border transition-all min-h-[44px] ${
            theme === "dark"
              ? "bg-slate-800/50 border-slate-700 text-slate-400 hover:text-white"
              : "bg-slate-100 border-slate-200 text-slate-600 hover:text-slate-900"
          }`}
        >
          <ChevronDownIcon className={`w-4 h-4 transition-transform ${showMoreViews ? 'rotate-180' : ''}`} />
        </button>
      </div>

      {/* Desktop: Full segmented control */}
      <div className="hidden md:flex">
        <div
          className={`flex rounded-lg border p-1 ${
            theme === "dark"
              ? "bg-slate-800/50 border-slate-700"
              : "bg-slate-100 border-slate-200"
          }`}
        >
          {allViews.map((view) => {
            const Icon = view.icon;
            const isActive = viewMode === view.id;
            return (
              <button
                key={view.id}
                onClick={() => setViewMode(view.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-all ${
                  isActive
                    ? theme === "dark"
                      ? "bg-teal-600 text-white"
                      : "bg-teal-600 text-white shadow-sm"
                    : theme === "dark"
                    ? "text-slate-400 hover:text-white hover:bg-slate-700/50"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-200"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="text-xs font-medium">{view.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Mobile: More views dropdown */}
      <AnimatePresence>
        {showMoreViews && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`absolute top-full right-0 mt-2 rounded-lg border shadow-lg p-1 z-50 min-w-[140px] ${
              theme === "dark"
                ? "bg-slate-800 border-slate-700"
                : "bg-white border-slate-200"
            }`}
          >
            {secondaryViews.map((view) => {
              const Icon = view.icon;
              const isActive = viewMode === view.id;
              return (
                <button
                  key={view.id}
                  onClick={() => {
                    setViewMode(view.id);
                    setShowMoreViews(false);
                  }}
                  className={`w-full flex items-center gap-2 px-3 py-2 rounded-md transition-all text-left ${
                    isActive
                      ? theme === "dark"
                        ? "bg-teal-600 text-white"
                        : "bg-teal-600 text-white"
                      : theme === "dark"
                      ? "text-slate-300 hover:bg-slate-700"
                      : "text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-sm">{view.label}</span>
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ViewToggleBarOption1;
