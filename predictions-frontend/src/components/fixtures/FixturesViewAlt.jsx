import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import FixtureCarousel from "../FixtureCarousel";
import GameweekChipsPanel from "../GameweekChipsPanel";
import { 
  LightningBoltIcon, 
  CalendarIcon, 
  InfoCircledIcon, 
  RocketIcon 
} from "@radix-ui/react-icons";

const FixturesView = ({ handleFixtureSelect, toggleChipInfoModal }) => {
  const [currentGameweek, setCurrentGameweek] = useState(36); // This would come from your API
  const [activeGameweekChips, setActiveGameweekChips] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterByGameweek, setFilterByGameweek] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  
  // Simulate loading data
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    
    return () => clearTimeout(timer);
  }, []);

  // Handle applying gameweek chips
  const handleApplyGameweekChip = (chipId, gameweek, isRemoval = false) => {
    if (isRemoval) {
      setActiveGameweekChips(prev => prev.filter(id => id !== chipId));
    } else {
      setActiveGameweekChips(prev => [...prev, chipId]);
    }
    
    // In a real app, you'd make an API call here to update the user's chip selections
    console.log(`${isRemoval ? 'Removed' : 'Applied'} gameweek chip ${chipId} for gameweek ${gameweek}`);
  };
  
  // Instead of rendering its own modal, just pass the fixture and chips info to the parent
  const onFixtureSelect = (fixture) => {
    handleFixtureSelect(fixture, activeGameweekChips);
  };
  
  // Calculate days until next gameweek deadline
  const daysUntilDeadline = 2; // In a real app, you'd calculate this

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <div className="mb-6">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-teal-100 text-3xl font-bold font-dmSerif">
              Fixtures
            </h1>
            <p className="text-white/70 font-outfit">
              View and predict upcoming fixtures
            </p>
          </div>
          
          <motion.div 
            className="mt-3 md:mt-0 bg-primary-800/50 border border-primary-500/20 rounded-lg px-4 py-2 flex items-center"
            whileHover={{ y: -2, boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)" }}
            transition={{ duration: 0.2 }}
          >
            <CalendarIcon className="text-teal-300 mr-2" />
            <div>
              <div className="text-teal-100 text-xs">Next Gameweek Deadline</div>
              <div className="text-white font-medium">
                {daysUntilDeadline === 0 
                  ? "Today!" 
                  : daysUntilDeadline === 1 
                    ? "Tomorrow" 
                    : `In ${daysUntilDeadline} days`}
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Gameweek Chips Panel with animated reveal */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        <GameweekChipsPanel 
          currentGameweek={currentGameweek}
          onApplyChip={handleApplyGameweekChip}
          toggleChipInfoModal={toggleChipInfoModal}
        />
      </motion.div>

      {/* Alert bar for active chips */}
      {activeGameweekChips.length > 0 && (
        <motion.div 
          className="my-4"
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="bg-gradient-to-r from-teal-900/40 to-teal-700/30 border border-teal-700/30 rounded-lg p-3">
            <div className="flex items-center text-teal-200 mb-2">
              <RocketIcon className="mr-2" />
              <span className="font-medium">Active Gameweek Chips</span>
            </div>
            <div className="flex items-center space-x-2 mb-2">
              {activeGameweekChips.map((chipId) => (
                <div key={chipId} className="bg-teal-800/40 rounded-full px-3 py-1 text-xs text-teal-200 border border-teal-600/30">
                  {chipId === "defensePlusPlus" && "Defense++ 🛡️"}
                  {chipId === "allInWeek" && "All-In Week 🎯"}
                </div>
              ))}
            </div>
            <p className="text-teal-100/70 text-sm">
              These chips will apply to all your predictions for Gameweek {currentGameweek}.
            </p>
          </div>
        </motion.div>
      )}
      
      {/* Help tip for new users */}
      <motion.div
        className="mb-4"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.3 }}
      >
        <div className="flex items-start bg-primary-800/30 border border-primary-400/20 rounded-lg p-3">
          <InfoCircledIcon className="text-teal-300 mr-2 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-white/90 text-sm">
              Select a fixture below to make your predictions. For better results, try 
              using chips strategically - 
              <button 
                onClick={toggleChipInfoModal} 
                className="text-teal-300 hover:text-teal-200 underline ml-1"
              >
                learn about chips
              </button>
            </p>
          </div>
        </div>
      </motion.div>

      {/* Full-width fixture carousel with loading state */}
      <motion.div 
        className="bg-gradient-to-b from-primary-700/40 to-primary-800/40 backdrop-blur-md rounded-lg border border-primary-400/20 p-5 font-outfit"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-12 h-12 border-4 border-primary-500/30 border-t-teal-400 rounded-full animate-spin"></div>
            <p className="mt-4 text-teal-200">Loading fixtures...</p>
          </div>
        ) : (
          <FixtureCarousel 
            onFixtureSelect={onFixtureSelect} 
            activeGameweekChips={activeGameweekChips}
          />
        )}
      </motion.div>
    </motion.div>
  );
};

export default FixturesView;
