import React from 'react';
import { Cross2Icon } from "@radix-ui/react-icons";

const ErrorState = ({ error, onRetry }) => (
  <div className="flex flex-col items-center justify-center py-12">
    <div className="bg-red-900/40 border border-red-500/40 rounded-lg p-6 text-center max-w-md">
      <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-red-900/60 flex items-center justify-center">
        <Cross2Icon className="w-6 h-6 text-red-300" />
      </div>
      <h3 className="text-red-300 text-xl mb-2 font-dmSerif">Error Loading Leagues</h3>
      <p className="text-white/70 mb-4">{error}</p>
      <button 
        onClick={onRetry} 
        className="px-4 py-2 bg-slate-700/50 hover:bg-slate-700/70 rounded-md text-white/90 transition-colors"
      >
        Retry
      </button>
    </div>
  </div>
);

export default ErrorState;