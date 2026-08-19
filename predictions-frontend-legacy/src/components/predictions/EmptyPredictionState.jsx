import React, { useContext } from "react";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { ThemeContext } from "../../context/ThemeContext";

const EmptyPredictionState = ({ searchQuery, activeFilter, message }) => {
  const { theme } = useContext(ThemeContext);
  
  // Generate contextual message based on filters
  const getEmptyMessage = () => {
    if (message) return message;
    
    if (searchQuery) {
      return `No predictions match your search for "${searchQuery}". Try adjusting your search terms.`;
    }
    
    if (activeFilter === "pending") {
      return "You don't have any pending predictions. All your predictions have been completed!";
    }
    
    if (activeFilter === "completed") {
      return "You don't have any completed predictions yet. Make some predictions and check back after matches finish.";
    }
    
    return "You haven't made any predictions yet. Head to the Fixtures tab to start predicting!";
  };
  
  return (
    <div className={`border rounded-lg p-6 text-center max-w-lg mx-auto ${
      theme === 'dark'
        ? 'bg-primary-700/30 border-primary-600/30'
        : 'bg-white border-gray-200 shadow-sm'
    }`}>
      <div className={`rounded-full w-12 h-12 mx-auto mb-3 flex items-center justify-center ${
        theme === 'dark'
          ? 'bg-primary-600/30'
          : 'bg-gray-100'
      }`}>
        <MagnifyingGlassIcon className={`w-6 h-6 ${
          theme === 'dark' ? 'text-teal-300/60' : 'text-gray-400'
        }`} />
      </div>
      <h3 className={`text-lg mb-2 ${
        theme === 'dark' ? 'text-teal-100' : 'text-gray-900'
      }`}>No predictions found</h3>
      <p className={`text-sm ${
        theme === 'dark' ? 'text-white/60' : 'text-gray-600'
      }`}>
        {getEmptyMessage()}
      </p>
    </div>
  );
};

export default EmptyPredictionState;
