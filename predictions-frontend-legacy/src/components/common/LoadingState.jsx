import React from 'react';

const LoadingState = ({ message = "Loading..." }) => (
  <div className="flex flex-col items-center justify-center py-12">
    <div className="relative w-16 h-16">
      <div className="w-16 h-16 rounded-full border-2 border-indigo-400/30"></div>
      <div className="absolute top-0 left-0 w-16 h-16 border-t-2 border-indigo-500 rounded-full animate-spin"></div>
    </div>
    <p className="mt-4 text-white/70 animate-pulse">{message}</p>
  </div>
);

export default LoadingState;