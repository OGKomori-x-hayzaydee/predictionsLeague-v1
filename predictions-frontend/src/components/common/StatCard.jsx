import React from "react";

const StatCard = ({ title, value, subtitle, badge }) => {
  return (
    <div className="bg-primary-600/40 rounded-lg p-5 border border-primary-400/20">
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-teal-200 font-outfit font-medium text-lg">
          {title}
        </h3>
        {badge && (
          badge.icon ? (
            <span className="text-white/60 text-xs font-medium py-1 px-2 rounded-full">
              {badge.icon}
            </span>
          ) : (
            <span className={`${badge.type === 'success' ? 'bg-teal-700/20 text-teal-300' : 'bg-indigo-700/20 text-indigo-300'} text-xs font-medium py-1 px-2 rounded-full`}>
              {badge.text}
            </span>
          )
        )}
      </div>
      <p className="text-3xl font-bold text-white font-dmSerif">{value}</p>
      <div className="text-white/60 text-sm mt-1 font-outfit">
        {subtitle}
      </div>
    </div>
  );
};

export default StatCard;