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
 * ViewToggleBarOption3 - Minimalist Dropdown
 * Ultra-compact dropdown menu
 * Just text with chevron - minimal visual weight
 */
const ViewToggleBarOption3 = ({ viewMode, setViewMode }) => {
  const { theme } = useContext(ThemeContext);
  const [isOpen, setIsOpen] = useState(false);

  const views = [
    { id: "stack", icon: StackIcon, label: "Stack" },
    { id: "list", icon: ListBulletIcon, label: "Grid" },
    { id: "teams", icon: PersonIcon, label: "Teams" },
    { id: "calendar", icon: CalendarIcon, label: "Calendar" },
    { id: "table", icon: TableIcon, label: "Table" },
    { id: "carousel", icon: LayoutIcon, label: "Carousel" },
  ];

  const currentView = views.find(v => v.id === viewMode);
  const CurrentIcon = currentView?.icon;

  return (
    <div className="relative">
      {/* Trigger button - minimalist style */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md transition-colors text-xs font-medium ${
          theme === "dark"
            ? "text-slate-400 hover:text-white hover:bg-slate-800/50"
            : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
        }`}
      >
        {CurrentIcon && <CurrentIcon className="w-3.5 h-3.5" />}
        <span>{currentView?.label}</span>
        <ChevronDownIcon className={`w-3.5 h-3.5 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown menu */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop for mobile */}
            <div 
              className="fixed inset-0 z-40 md:hidden" 
              onClick={() => setIsOpen(false)}
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              transition={{ duration: 0.15 }}
              className={`absolute top-full right-0 mt-2 rounded-lg border shadow-lg py-1 z-50 min-w-[140px] ${
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
                      setIsOpen(false);
                    }}
                    className={`w-full flex items-center gap-2 px-3 py-2 transition-colors text-left ${
                      isActive
                        ? theme === "dark"
                          ? "bg-teal-600/20 text-teal-400"
                          : "bg-teal-50 text-teal-700"
                        : theme === "dark"
                        ? "text-slate-300 hover:bg-slate-700/50"
                        : "text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="text-sm">{view.label}</span>
                    {isActive && (
                      <span className="ml-auto text-teal-500">✓</span>
                    )}
                  </button>
                );
              })}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ViewToggleBarOption3;
