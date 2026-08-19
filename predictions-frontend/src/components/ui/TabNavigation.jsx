import React, { useContext } from "react";
import { motion } from "framer-motion";
import { ThemeContext } from "../../context/ThemeContext";

const TabNavigation = ({ tabs, activeTab, setActiveTab }) => {
  const { theme } = useContext(ThemeContext);

  // Normalize tabs: accept either strings or {id, label, icon?} objects
  const normalizedTabs = tabs.map((tab) =>
    typeof tab === "string" ? { id: tab, label: tab.charAt(0).toUpperCase() + tab.slice(1) } : tab
  );

  return (
    <div
      className={`${
        theme === "dark"
          ? "bg-slate-800/40 border-slate-700/50"
          : "bg-white border-slate-200 shadow-sm"
      } backdrop-blur-sm rounded-xl p-1 border inline-flex`}
    >
      <div className="flex overflow-x-auto scrollbar-hide">
        {normalizedTabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`relative flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium font-outfit transition-all duration-200 flex-shrink-0 ${
                isActive
                  ? "text-white shadow-lg"
                  : theme === "dark"
                  ? "text-slate-300 hover:text-white hover:bg-slate-700/50"
                  : "text-slate-600 hover:text-slate-800 hover:bg-slate-100"
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="activeTabBg"
                  className="absolute inset-0 bg-teal-600 rounded-lg"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                />
              )}
              <span className="relative flex items-center gap-2">
                {Icon && <Icon className="w-4 h-4" />}
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default TabNavigation;
