import React, { useContext, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  StackIcon,
  ListBulletIcon,
  PersonIcon,
  CalendarIcon,
  TableIcon,
  LayoutIcon,
  Cross2Icon,
} from "@radix-ui/react-icons";
import { ThemeContext } from "../../context/ThemeContext";

/**
 * ViewToggleBarOption2 - Bottom Sheet (Modern)
 * Single button that opens a modal/bottom sheet with all view options
 * Saves maximum header space
 */
const ViewToggleBarOption2 = ({ viewMode, setViewMode }) => {
  const { theme } = useContext(ThemeContext);
  const [showSheet, setShowSheet] = useState(false);

  const views = [
    { id: "stack", icon: StackIcon, label: "Stack View", description: "Swipeable cards by date" },
    { id: "list", icon: ListBulletIcon, label: "Grid View", description: "Compact grid layout" },
    { id: "teams", icon: PersonIcon, label: "By Team", description: "Grouped by team" },
    { id: "calendar", icon: CalendarIcon, label: "Calendar", description: "Monthly calendar view" },
    { id: "table", icon: TableIcon, label: "Table View", description: "Detailed table format" },
    { id: "carousel", icon: LayoutIcon, label: "Carousel", description: "Horizontal scrolling" },
  ];

  const currentView = views.find(v => v.id === viewMode);
  const CurrentIcon = currentView?.icon;

  return (
    <>
      {/* Trigger button */}
      <button
        onClick={() => setShowSheet(true)}
        className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-all text-sm font-medium ${
          theme === "dark"
            ? "bg-slate-800/50 border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white"
            : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-800"
        }`}
      >
        {CurrentIcon && <CurrentIcon className="w-4 h-4" />}
        <span className="hidden sm:inline">View:</span>
        <span>{currentView?.label || "Stack"}</span>
      </button>

      {/* Bottom Sheet Overlay */}
      <AnimatePresence>
        {showSheet && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowSheet(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            />

            {/* Bottom Sheet */}
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className={`fixed bottom-0 left-0 right-0 rounded-t-2xl border-t z-50 max-h-[80vh] overflow-auto ${
                theme === "dark"
                  ? "bg-slate-900 border-slate-700"
                  : "bg-white border-slate-200"
              }`}
            >
              {/* Handle bar */}
              <div className="flex justify-center pt-3 pb-2">
                <div className={`w-12 h-1 rounded-full ${
                  theme === "dark" ? "bg-slate-700" : "bg-slate-300"
                }`} />
              </div>

              {/* Header */}
              <div className="flex items-center justify-between px-4 pb-4 border-b border-slate-700/50">
                <h3 className={`text-lg font-semibold ${
                  theme === "dark" ? "text-white" : "text-slate-900"
                }`}>
                  Select View
                </h3>
                <button
                  onClick={() => setShowSheet(false)}
                  className={`p-2 rounded-lg transition-colors ${
                    theme === "dark"
                      ? "hover:bg-slate-800 text-slate-400 hover:text-white"
                      : "hover:bg-slate-100 text-slate-600 hover:text-slate-900"
                  }`}
                >
                  <Cross2Icon className="w-5 h-5" />
                </button>
              </div>

              {/* View options grid */}
              <div className="grid grid-cols-2 gap-3 p-4">
                {views.map((view) => {
                  const Icon = view.icon;
                  const isActive = viewMode === view.id;
                  return (
                    <button
                      key={view.id}
                      onClick={() => {
                        setViewMode(view.id);
                        setShowSheet(false);
                      }}
                      className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                        isActive
                          ? theme === "dark"
                            ? "bg-teal-600/20 border-teal-600 text-teal-400"
                            : "bg-teal-50 border-teal-600 text-teal-700"
                          : theme === "dark"
                          ? "bg-slate-800/50 border-slate-700 text-slate-400 hover:border-slate-600 hover:text-white"
                          : "bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-300 hover:text-slate-900"
                      }`}
                    >
                      <Icon className="w-8 h-8" />
                      <div className="text-center">
                        <div className="text-sm font-medium">{view.label}</div>
                        <div className={`text-2xs mt-0.5 ${
                          theme === "dark" ? "text-slate-500" : "text-slate-500"
                        }`}>
                          {view.description}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default ViewToggleBarOption2;
