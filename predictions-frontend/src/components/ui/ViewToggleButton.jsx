import React, { useContext } from 'react';
import { ThemeContext } from '../../context/ThemeContext';

const ViewToggleButton = ({ icon, active, onClick, tooltip, label }) => {
  const { theme } = useContext(ThemeContext);
  
  return (
    <button
      onClick={onClick}
      className={`p-1.5 rounded flex items-center transition-all ${
        active
          ? theme === 'dark' 
            ? "bg-primary-600 text-white shadow-inner" 
            : "bg-indigo-600 text-white shadow-inner"
          : theme === 'dark'
            ? "text-white/60 hover:text-white/80 hover:bg-primary-700/40"
            : "text-slate-600 hover:text-slate-800 hover:bg-slate-200/70"
      }`}
      aria-label={tooltip}
      title={tooltip}
    >
      <div className="w-4 h-4 mr-1.5">{icon}</div>
      <span className="text-xs hidden sm:inline">{label}</span>
    </button>
  );
};

export default ViewToggleButton;