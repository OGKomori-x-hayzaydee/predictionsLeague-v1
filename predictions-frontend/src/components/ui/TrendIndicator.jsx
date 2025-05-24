import React from 'react';

const TrendIndicator = ({ trend }) => {
  if (trend === 'up') {
    return <span className="text-green-400 text-xs">▲</span>;
  } else if (trend === 'down') {
    return <span className="text-red-400 text-xs">▼</span>;
  }
  return <span className="text-slate-400 text-xs">■</span>;
};

export default TrendIndicator;