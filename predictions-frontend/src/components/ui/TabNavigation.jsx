import React, { useContext } from 'react';
import { motion } from 'framer-motion';
import { ThemeContext } from '../../context/ThemeContext';

const TabNavigation = ({ tabs, activeTab, setActiveTab }) => {
  const { theme } = useContext(ThemeContext);
  
  return (
    <div className={`flex border-b ${theme === 'dark' ? 'border-slate-600/30' : 'border-slate-200'} mb-6`}>
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => setActiveTab(tab)}
          className={`py-2 px-4 font-medium text-sm relative ${
            activeTab === tab 
              ? theme === 'dark' ? "text-teal-200" : "text-teal-600" 
              : theme === 'dark' ? "text-white/60 hover:text-white/90" : "text-slate-500 hover:text-slate-900"
          }`}
        >
          {tab.charAt(0).toUpperCase() + tab.slice(1)}
          
          {activeTab === tab && (
            <motion.div 
              className={`absolute bottom-0 left-0 right-0 h-0.5 ${theme === 'dark' ? 'bg-teal-500' : 'bg-teal-600'}`}
              layoutId="tabIndicator"
            />
          )}
        </button>
      ))}
    </div>
  );
};

export default TabNavigation;