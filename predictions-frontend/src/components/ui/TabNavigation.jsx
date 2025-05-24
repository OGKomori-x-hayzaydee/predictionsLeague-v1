import React from 'react';
import { motion } from 'framer-motion';

const TabNavigation = ({ tabs, activeTab, setActiveTab }) => {
  return (
    <div className="flex border-b border-slate-600/30 mb-6">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => setActiveTab(tab)}
          className={`py-2 px-4 font-medium text-sm relative ${
            activeTab === tab 
              ? "text-teal-200" 
              : "text-white/60 hover:text-white/90"
          }`}
        >
          {tab.charAt(0).toUpperCase() + tab.slice(1)}
          
          {activeTab === tab && (
            <motion.div 
              className="absolute bottom-0 left-0 right-0 h-0.5 bg-teal-500"
              layoutId="tabIndicator"
            />
          )}
        </button>
      ))}
    </div>
  );
};

export default TabNavigation;