import { useContext } from "react";
import { format, parseISO } from "date-fns";
import { CalendarIcon } from "@radix-ui/react-icons";
import { ThemeContext } from "../../context/ThemeContext";
import { hasUnpredictedFixture } from "../../utils/fixtureUtils";
import { hasPendingPrediction } from "../../utils/predictionUtils";
import FixtureCard from "../fixtures/FixtureCardOption2";
import SimplePredictionCard from "../predictions/SimplePredictionCard";

/**
 * UniversalDateGroup - A reusable component for displaying fixtures or predictions grouped by date
 * 
 * This component provides a unified interface for both FixturesCarousel and PredictionsCarousel,
 * automatically adapting its display and functionality based on the data type provided.
 * 
 * @component
 * @param {Object} props - Component props
 * @param {string} props.date - ISO date string (YYYY-MM-DD format) for the group
 * @param {Array} props.items - Array of fixture or prediction objects to display
 * @param {('fixtures'|'predictions')} props.type - Type of data being displayed
 * @param {Object} props.selectedItem - Currently selected fixture or prediction object
 * @param {Function} props.onItemClick - Callback function when an item is clicked
 * @param {Object} props.teamLogos - Object mapping team names to logo URLs
 * @param {Function} [props.onEditClick] - Optional callback for editing predictions (predictions only)
 * 
 * @features
 * - Automatic theme support (light/dark mode)
 * - Consistent styling across fixtures and predictions
 * - Smart status indicators (New/Pending based on data type)
 * - Gameweek display when available
 * - Responsive design with proper spacing
 * - Type-safe rendering with appropriate card components
 * 
 * @example
 * // For fixtures
 * <UniversalDateGroup
 *   date="2025-05-31"
 *   items={fixtures}
 *   type="fixtures"
 *   selectedItem={selectedFixture}
 *   onItemClick={handleFixtureClick}
 *   teamLogos={teamLogos}
 * />
 * 
 * @example
 * // For predictions
 * <UniversalDateGroup
 *   date="2025-05-31"
 *   items={predictions}
 *   type="predictions"
 *   selectedItem={selectedPrediction}
 *   onItemClick={handlePredictionClick}
 *   onEditClick={handleEditClick}
 *   teamLogos={teamLogos}
 * />
 */

/**
 * UniversalDateGroup - A reusable component for displaying grouped items by date
 * 
 * This component can handle both fixtures and predictions data, providing a consistent
 * interface for date-grouped carousel displays. It automatically detects the type of
 * items and renders the appropriate card component.
 * 
 * @param {string} date - ISO date string (YYYY-MM-DD format)
 * @param {Array} items - Array of fixture or prediction objects
 * @param {string} type - Either 'fixtures' or 'predictions' 
 * @param {Object} selectedItem - Currently selected fixture or prediction object
 * @param {Function} onItemClick - Callback when an item is clicked
 * @param {Object} teamLogos - Object mapping team names to logo URLs
 * @param {Function} onEditClick - (Predictions only) Callback for edit button
 */

const UniversalDateGroup = ({ 
  date, 
  items, 
  type, 
  selectedItem, 
  onItemClick, 
  teamLogos,
  onEditClick // Only used for predictions
}) => {
  const { theme } = useContext(ThemeContext);
  
  // Determine if this is fixtures or predictions
  const isFixtures = type === 'fixtures';
  const isPredictions = type === 'predictions';
  
  // Get gameweek from first item
  const gameweek = items[0]?.gameweek;
  
  // Check for unpredicted/pending items
  const hasUnpredictedItems = isFixtures 
    ? hasUnpredictedFixture(items)
    : isPredictions 
      ? hasPendingPrediction(items)
      : false;
  
  return (
    <div id={`date-${date}`} className="w-[min(400px,80vw)]">
      <div className={`rounded-lg border p-3 h-full ${
        theme === "dark" 
          ? "bg-slate-800/50 border-slate-700/50 backdrop-blur-md" 
          : "bg-white border-slate-200"
      }`}>
        {/* Date header with improved layout */}
        <div className="flex items-center justify-between mb-3">
          <div className={`text-xs rounded-full px-2 py-1 flex items-center ${
            theme === "dark" 
              ? "bg-teal-800/30 text-teal-300" 
              : "bg-teal-50 text-teal-700"
          }`}>
            <CalendarIcon className="mr-1 w-3 h-3" />
            {format(parseISO(date), "EEE, MMM d")}
          </div>
          <div className="flex items-center space-x-1">
            {gameweek && (
              <div className={`text-xs px-2 py-0.5 rounded-full ${
                theme === "dark" 
                  ? "bg-slate-700/50 text-slate-300" 
                  : "bg-slate-100 text-slate-700"
              }`}>
                GW {gameweek}
              </div>
            )}
            {hasUnpredictedItems && (
              <div className={`text-xs px-2 py-0.5 rounded-full flex items-center ${
                theme === "dark" 
                  ? "bg-indigo-800/30 text-indigo-300" 
                  : "bg-indigo-50 text-indigo-700"
              }`}>
                <span className={`w-1.5 h-1.5 rounded-full mr-1 ${
                  theme === "dark" ? "bg-indigo-400" : "bg-indigo-500"
                }`}></span>
                {isFixtures ? "New" : "Pending"}
              </div>
            )}
          </div>
        </div>

        {/* Items list */}
        <div className="space-y-3">
          {items.map((item) => {
            if (isFixtures) {
              return (
                <FixtureCard
                  key={item.id}
                  fixture={item}
                  selected={selectedItem && selectedItem.id === item.id}
                  onClick={onItemClick}
                  teamLogos={teamLogos}
                />
              );
            } else if (isPredictions) {
              return (
                <SimplePredictionCard
                  key={item.id}
                  prediction={item}
                  teamLogos={teamLogos}
                  onClick={onItemClick}
                  onEditClick={onEditClick}
                  selected={selectedItem && selectedItem.id === item.id}
                />
              );
            }
            return null;
          })}
        </div>
      </div>
    </div>
  );
};

export default UniversalDateGroup;
