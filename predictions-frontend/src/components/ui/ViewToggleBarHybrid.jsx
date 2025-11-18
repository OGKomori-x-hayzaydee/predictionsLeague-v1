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
  Cross2Icon,
} from "@radix-ui/react-icons";
import { ThemeContext } from "../../context/ThemeContext";

/**
 * ViewToggleBarHybrid - Responsive Best of Both
 * Mobile (< md): Bottom Sheet (Option 2) - Modern, touch-friendly
 * Desktop (>= md): Minimalist Dropdown (Option 3) - Compact, efficient
 */
const ViewToggleBarHybrid = ({ viewMode, setViewMode }) => {
  const { theme } = useContext(ThemeContext);
  const [showSheet, setShowSheet] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

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
      {/* Mobile: Bottom Sheet Button */}
      <button
        onClick={() => setShowSheet(true)}
        className={`md:hidden flex items-center gap-1.5 px-2.5 py-1.5 rounded-md border transition-all text-xs font-medium ${
          theme === "dark"
            ? "bg-slate-800/30 border-slate-700/50 text-slate-400 hover:bg-slate-800/50 hover:text-slate-300"
            : "bg-slate-50/50 border-slate-200/50 text-slate-500 hover:bg-slate-100 hover:text-slate-700"
        }`}
      >
        {CurrentIcon && <CurrentIcon className="w-3.5 h-3.5" />}
        <span className="hidden sm:inline">View:</span>
        <span>{currentView?.label || "Stack"}</span>
      </button>

      {/* Desktop: Minimalist Dropdown */}
      <div className="hidden md:block relative">
        <button
          onClick={() => setShowDropdown(!showDropdown)}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md border transition-colors text-xs font-medium ${
            theme === "dark"
              ? "bg-slate-800/30 border-slate-700/50 text-slate-400 hover:bg-slate-800/50 hover:text-slate-300"
              : "bg-slate-50/50 border-slate-200/50 text-slate-500 hover:bg-slate-100 hover:text-slate-700"
          }`}
        >
          {CurrentIcon && <CurrentIcon className="w-3.5 h-3.5" />}
          <span>{currentView?.label}</span>
          <ChevronDownIcon className={`w-3.5 h-3.5 transition-transform ${showDropdown ? 'rotate-180' : ''}`} />
        </button>

        {/* Desktop Dropdown menu */}
        <AnimatePresence>
          {showDropdown && (
            <>
              <div 
                className="fixed inset-0 z-40" 
                onClick={() => setShowDropdown(false)}
              />
              
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -10 }}
                transition={{ duration: 0.15 }}
                className={`absolute top-full right-0 mt-2 rounded-lg border shadow-lg py-1.5 z-50 min-w-[180px] ${
                  theme === "dark"
                    ? "bg-slate-800 border-slate-700"
                    : "bg-white border-slate-200 shadow-xl"
                }`}
              >
                {views.map((view) => {
                  const Icon = view.icon;
                  const isActive = viewMode === view.id;
                  return (
                    <button
                      key={view.id}
                      onClick={() => {
                        setViewMode(view.id);
                        setShowDropdown(false);
                      }}
                      className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 transition-colors text-left ${
                        isActive
                          ? theme === "dark"
                            ? "bg-teal-600/20 text-teal-400"
                            : "bg-teal-50 text-teal-700"
                          : theme === "dark"
                          ? "text-slate-300 hover:bg-slate-700/50"
                          : "text-slate-700 hover:bg-slate-50"
                      }`}
                    >
                      <Icon className="w-4 h-4 flex-shrink-0" />
                      <span className="text-sm font-medium">{view.label}</span>
                      {isActive && (
                        <span className="ml-auto text-teal-500 font-bold">✓</span>
                      )}
                    </button>
                  );
                })}
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>

      {/* Mobile: Bottom Sheet Overlay */}
      <AnimatePresence>
        {showSheet && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowSheet(false)}
              className="md:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            />

            {/* Bottom Sheet */}
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className={`md:hidden fixed bottom-0 left-0 right-0 rounded-t-2xl border-t z-50 max-h-[80vh] overflow-auto ${
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
              <div className={`flex items-center justify-between px-4 pb-4 border-b ${
                theme === "dark" ? "border-slate-700/50" : "border-slate-200"
              }`}>
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

export default ViewToggleBarHybrid;
