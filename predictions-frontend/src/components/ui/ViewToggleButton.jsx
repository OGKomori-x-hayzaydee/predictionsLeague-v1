import React from 'react';

const ViewToggleButton = ({ icon, active, onClick, tooltip, label }) => (
  <button
    onClick={onClick}
    className={`p-1.5 rounded flex items-center transition-all ${
      active
        ? "bg-primary-600 text-white shadow-inner"
        : "text-white/60 hover:text-white/80 hover:bg-primary-700/40"
    }`}
    aria-label={tooltip}
    title={tooltip}
  >
    <div className="w-4 h-4 mr-1.5">{icon}</div>
    <span className="text-xs hidden sm:inline">{label}</span>
  </button>
);

export default ViewToggleButton;