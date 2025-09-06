import React, { useContext } from "react";
import { MagnifyingGlassIcon, BarChartIcon } from "@radix-ui/react-icons";
import { ThemeContext } from "../../context/ThemeContext";

const EmptyPredictionState = ({ searchQuery }) => {
  const { theme } = useContext(ThemeContext);

  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <div
        className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${
          theme === "dark" ? "bg-primary-800/30" : "bg-gray-100"
        }`}
      >
        {searchQuery ? (
          <MagnifyingGlassIcon
            className={`w-8 h-8 ${
              theme === "dark" ? "text-white/40" : "text-gray-400"
            }`}
          />
        ) : (
          <BarChartIcon
            className={`w-8 h-8 ${
              theme === "dark" ? "text-white/40" : "text-gray-400"
            }`}
          />
        )}
      </div>
      
      <h3
        className={`text-lg font-medium mb-2 ${
          theme === "dark" ? "text-white" : "text-gray-900"
        }`}
      >
        {searchQuery ? "No predictions found" : "No predictions available"}
      </h3>
      
      <p
        className={`text-sm text-center max-w-md ${
          theme === "dark" ? "text-white/60" : "text-gray-500"
        }`}
      >
        {searchQuery
          ? `No predictions match "${searchQuery}". Try adjusting your search terms.`
          : "Predictions for Big Six teams will appear here once you start making predictions for their fixtures."}
      </p>
      
      {searchQuery && (
        <button
          onClick={() => window.location.reload()}
          className={`mt-4 px-4 py-2 text-sm rounded-lg transition-colors ${
            theme === "dark"
              ? "bg-primary-700 hover:bg-primary-600 text-white"
              : "bg-blue-600 hover:bg-blue-700 text-white"
          }`}
        >
          Clear search
        </button>
      )}
    </div>
  );
};

export default EmptyPredictionState;
