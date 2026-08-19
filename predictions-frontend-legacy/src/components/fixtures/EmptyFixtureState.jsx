import React, { useContext } from "react";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { ThemeContext } from "../../context/ThemeContext";

const EmptyFixtureState = ({ searchQuery, message }) => {
  const { theme } = useContext(ThemeContext);
  
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
      }`}>No fixtures found</h3>
      {message ? (
        <p className={`text-sm ${
          theme === 'dark' ? 'text-white/60' : 'text-gray-600'
        }`}>{message}</p>
      ) : searchQuery ? (
        <p className={`text-sm ${
          theme === 'dark' ? 'text-white/60' : 'text-gray-600'
        }`}>
          No fixtures match your search for "{searchQuery}". Try adjusting your search terms.
        </p>
      ) : (
        <p className={`text-sm ${
          theme === 'dark' ? 'text-white/60' : 'text-gray-600'
        }`}>
          There are no upcoming fixtures available at this time.
        </p>      )}
    </div>
  );
};

export default EmptyFixtureState;