import React, { useState, useEffect } from "react";
import FixtureCarousel from "../FixtureCarousel";
import GameweekChipsPanel from "../GameweekChipsPanel";
import { LightningBoltIcon } from "@radix-ui/react-icons";

const FixturesView = ({ handleFixtureSelect, toggleChipInfoModal }) => {
  const [currentGameweek, setCurrentGameweek] = useState(36); // This would come from your API
  const [activeGameweekChips, setActiveGameweekChips] = useState([]);
  
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

  return (
    <>
      <div className="mb-6">
        <h1 className="text-teal-100 text-3xl font-bold font-dmSerif">
          Fixtures
        </h1>
        <p className="text-white/70 font-outfit">
          View and predict upcoming fixtures
        </p>
      </div>

      {/* Gameweek Chips Panel */}
      <GameweekChipsPanel 
        currentGameweek={currentGameweek}
        onApplyChip={handleApplyGameweekChip}
        toggleChipInfoModal={toggleChipInfoModal}  // Pass the toggle function
      />

      {/* Full-width fixture carousel */}
      <div className="bg-primary-600/40 backdrop-blur-md rounded-lg border border-primary-400/20 p-5 font-outfit" >
        {activeGameweekChips.length > 0 && (
          <div className="mb-4 bg-teal-900/30 border border-teal-700/30 rounded-lg p-3">
            <div className="flex items-center text-teal-200 mb-2">
              <LightningBoltIcon className="mr-2" />
              <span className="font-medium">Active Gameweek Chips</span>
            </div>
            <p className="text-teal-100/70 text-sm">
              You have gameweek-wide chips active for Gameweek {currentGameweek}. These will apply to all your predictions this gameweek.
            </p>
          </div>
        )}
        <FixtureCarousel 
          onFixtureSelect={onFixtureSelect} 
          activeGameweekChips={activeGameweekChips}
        />
      </div>
    </>
  );
};

export default FixturesView;
