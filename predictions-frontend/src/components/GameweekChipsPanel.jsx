import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  InfoCircledIcon, 
  CheckIcon, 
  LightningBoltIcon,
  Cross2Icon,
  ArrowRightIcon,
  QuestionMarkCircledIcon
} from "@radix-ui/react-icons";

const GameweekChipsPanel = ({ 
  currentGameweek, 
  onApplyChip, 
  activeMatchChips = [], 
  upcomingFixtures = [],
  toggleChipInfoModal 
}) => {
  const [activeChips, setActiveChips] = useState([]);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedChip, setSelectedChip] = useState(null);
  const [selectedTab, setSelectedTab] = useState("gameweek");
  
  // In a real app, you'd fetch these from an API
  const gameweekChips = [
    { 
      id: "defensePlusPlus", 
      name: "Defense++", 
      description: "Earn +10 bonus points for each match where you correctly predict a clean sheet.",
      icon: "🛡️",
      color: "blue",
      cooldown: 5,
      cooldownRemaining: 0,
      available: true,
      type: "gameweek"
    },
    { 
      id: "allInWeek", 
      name: "All-In Week", 
      description: "Doubles all points earned this gameweek (including deductions).",
      icon: "🎯",
      color: "red",
      seasonLimit: 2,
      remainingUses: 2,
      available: true,
      type: "gameweek"
    }
  ];
  
  const matchChips = [
    {
      id: "doubleDown",
      name: "Double Down",
      description: "Double points for a single match prediction.",
      icon: "2x",
      color: "teal",
      cooldown: 2,
      cooldownRemaining: 0,
      available: true,
      type: "match",
      strategyTip: "Best used on matches where you have high confidence in your prediction, especially if you've predicted goalscorers correctly."
    },
    {
      id: "wildcard",
      name: "Wildcard",
      description: "Triple points for a single match prediction.",
      icon: "3x",
      color: "indigo",
      seasonLimit: 1,
      remainingUses: 1,
      available: true,
      type: "match",
      strategyTip: "Save this for matches where you're extremely confident, or for derby matches where the points multiplier is already in effect."
    },
    {
      id: "scorerFocus",
      name: "Scorer Focus",
      description: "Double points for correct goalscorer predictions.",
      icon: "⚽",
      color: "amber",
      cooldown: 3,
      cooldownRemaining: 1,
      available: false,
      type: "match",
      strategyTip: "Best used in high-scoring matches where you're confident about multiple goalscorers."
    },
    {
      id: "opportunist",
      name: "Opportunist",
      description: "Score points even if goalscorer prediction is partially correct.",
      icon: "🎭",
      color: "yellow",
      cooldown: 2,
      cooldownRemaining: 0,
      available: true,
      type: "match",
      strategyTip: "Use when late team news significantly impacts your predictions, such as key players being injured or rested."
    }
  ];
  
  // Combined chips for display
  const allChips = [...gameweekChips, ...matchChips];
  
  // Toggle chip selection
  const selectChipForConfirmation = (chipId) => {
    // Check if trying to remove or apply
    const alreadyActive = activeChips.some(c => c.id === chipId);
    
    if (alreadyActive) {
      // Directly remove if already active (no confirmation needed)
      removeChip(chipId);
      return;
    }
    
    const chip = allChips.find(c => c.id === chipId);
    if (!chip || !chip.available) return;
    
    setSelectedChip(chip);
    setShowConfirmModal(true);
  };
  
  // Handle chip application after confirmation
  const confirmChipApplication = () => {
    if (!selectedChip) return;
    
    // Add to active chips
    setActiveChips(prev => {
      // Only allow one of each type
      if (prev.find(c => c.id === selectedChip.id)) return prev;
      return [...prev, selectedChip];
    });
    
    // Call parent handler
    if (onApplyChip) {
      onApplyChip(selectedChip.id, currentGameweek);
    }
    
    setShowConfirmModal(false);
    setSelectedChip(null);
  };
  
  // Remove an applied chip
  const removeChip = (chipId) => {
    setActiveChips(prev => prev.filter(chip => chip.id !== chipId));
    
    // Call parent handler to remove the chip
    if (onApplyChip) {
      onApplyChip(chipId, currentGameweek, true); // true indicates removal
    }
  };
  
  // Get chip details by ID helper
  const getChipById = (chipId) => {
    return allChips.find(chip => chip.id === chipId) || null;
  };
  
  // Format fixture name helper
  const formatFixture = (fixture) => {
    if (!fixture || !fixture.homeTeam || !fixture.awayTeam) {
      return "Unknown fixture";
    }
    return `${fixture.homeTeam} vs ${fixture.awayTeam}`;
  };
  
  // Get count of active chips (for the header)
  const activeChipsCount = activeChips.length + activeMatchChips.length;
  
  return (
    <div className="bg-gradient-to-br from-primary-600/40 to-primary-700/40 backdrop-blur-md rounded-lg border border-primary-400/20 p-4 mb-5">
      {/* Header - More compact with side-by-side layout */}
      <div className="flex items-center justify-between mb-3">
        <div>
          <h2 className="text-teal-100 text-3xl font-dmSerif mb-1">Chip Strategy</h2>
          <p className="text-white/70 font-outfit text-sm mb-2">Manage your prediction chips</p>
        </div>
        <div className="flex items-center gap-3">
          {activeChipsCount > 0 && (
            <div className="bg-indigo-900/40 border border-indigo-700/30 text-indigo-300 rounded-full px-3 py-1 flex items-center font-outfit">
              <span className="text-xs">
                <span className="font-medium">{activeChipsCount}</span> active
              </span>
            </div>
          )}
          <div className="bg-teal-900/40 border border-teal-700/30 text-teal-300 rounded-full px-3 py-1 flex items-center font-outfit">
            <span className="text-white/70 text-xs mr-1">GW:</span>
            <span className="font-medium">{currentGameweek}</span>
          </div>
        </div>
      </div>
      
      {/* Tab navigation - Simplified and more compact */}
      <div className="mb-0.5 border-b border-primary-600/30">
        <div className="flex">
          <button
            onClick={() => setSelectedTab("gameweek")}
            className={`py-1.5 px-3 text-sm relative ${
              selectedTab === "gameweek" 
                ? "text-teal-200" 
                : "text-white/60 hover:text-white/80"
            }`}
          >
            Gameweek Chips
            {selectedTab === "gameweek" && (
              <motion.div 
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-teal-500"
                layoutId="tabIndicator"
              />
            )}
          </button>
          <button
            onClick={() => setSelectedTab("match")}
            className={`py-1.5 px-3 text-sm relative ${
              selectedTab === "match" 
                ? "text-teal-200" 
                : "text-white/60 hover:text-white/80"
            }`}
          >
            Match Chips
            {selectedTab === "match" && (
              <motion.div 
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-teal-500"
                layoutId="tabIndicator"
              />
            )}
          </button>
        </div>
      </div>
      
      {/* Tab content*/}
      <AnimatePresence mode="wait">
        {selectedTab === "gameweek" ? (
          <motion.div
            key="gameweek"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            <div className="bg-primary-700/30 rounded-lg border border-primary-600/30 mt-3">
              <div className="font-outfit p-2 border-b border-primary-600/30 bg-primary-800/30 flex items-center justify-between">
                <span className="text-white/40 text-xs">Affects all predictions</span>
              </div>
              
              <div className="p-2">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
                  {gameweekChips.map(chip => {
                    const isActive = activeChips.some(c => c.id === chip.id);
                    const isAvailable = chip.available && !isActive;
                    
                    return (
                      <div
                        key={chip.id}
                        className={`relative flex flex-col rounded-lg overflow-hidden border font-outfit ${
                          isActive 
                            ? "border-teal-500/40 bg-teal-900/20"
                            : !isAvailable 
                              ? "opacity-70 border-primary-400/10 bg-primary-700/10" 
                              : "border-primary-400/20 bg-primary-700/20"
                        }`}
                      >
                        {/* Chip header with icon and status */}
                        <div className="flex items-center p-2 pb-1.5 bg-primary-800/20 ">
                          <div 
                            className="w-7 h-7 rounded-md flex items-center justify-center shrink-0 mr-2 ${}"
                          >
                            <span className="text-lg">{chip.icon}</span>
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <div className="text-white text-md font-medium">
                                {chip.name}
                              </div>
                              
                              {isActive && (
                                <div className="flex items-center bg-teal-700/30 text-teal-300 text-[0.8rem] px-1.5 py-0.5 rounded-full">
                                  <CheckIcon className="w-2 h-2 mr-0.5" />
                                  <span>Active</span>
                                </div>
                              )}
                              
                              {/* Status indicators */}
                              {!isActive && chip.cooldownRemaining > 0 && (
                                <div className="bg-red-900/20 text-red-300 text-sm px-1.5 py-0.5 rounded-full">
                                  {chip.cooldownRemaining} GW cooldown
                                </div>
                              )}
                              
                              {!isActive && chip.cooldownRemaining === 0 && chip.remainingUses === 0 && (
                                <div className="bg-red-900/20 text-red-300 text-sm px-1.5 py-0.5 rounded-full">
                                  No uses left
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        {/* Limits section */}
                        <div className="px-2 pt-1 pb-2 text-[0.8rem] flex justify-between text-white/50">
                          {chip.cooldown && (
                            <div>{chip.cooldown} GW cooldown</div>
                          )}
                          {chip.seasonLimit && (
                            <div>{chip.remainingUses}/{chip.seasonLimit} uses left</div>
                          )}
                        </div>
                        
                        {/* Apply/Remove button - Smaller */}
                        <div className="mt-auto border-primary-600/20">
                          {isActive ? (
                            <button
                              onClick={() => removeChip(chip.id)}
                              className="w-full border-primary-400/10 text-white/80 hover:text-white hover:bg-primary-600/30 text-[0.8rem] py-1.5 transition-colors flex items-center justify-center"
                            >
                              <Cross2Icon className="w-2.5 h-2.5 mr-1" />
                              Remove Chip
                            </button>
                          ) : isAvailable ? (
                            <button
                              onClick={() => selectChipForConfirmation(chip.id)}
                              className="w-full border-primary-400/10 bg-indigo-600/60 hover:bg-indigo-600/80 text-white text-[0.8rem] py-1.5 transition-colors"
                            >
                              Apply
                            </button>
                          ) : (
                            <div className="w-full border-t border-primary-400/10 text-center text-[0.8rem] text-white/40 py-1.5">
                              Not Available
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="match"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            <div className="bg-primary-700/30 rounded-lg border border-primary-600/30 mt-3">
              <div className="p-2 border-b border-primary-600/30 bg-primary-800/30 flex items-center justify-between font-outfit">
              
                <span className="text-white/40 text-xs">Apply during predictions</span>
              </div>
              
              <div className="p-2">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-2 font-outfit">
                  {matchChips.map(chip => {
                    const usages = activeMatchChips.filter(usage => usage.chipId === chip.id);
                    const usageCount = usages.length;
                    
                    return (
                      <div
                        key={chip.id}
                        className={`relative flex flex-col rounded-lg overflow-hidden border 
                          ${chip.available ? 'border-slate-600' : 'border-primary-400/20 bg-primary-700/20'}`}
                      >
                        {/* Chip header - With icon and usage count */}
                        <div className={`flex items-center p-2 pb-1.5 bg-primary-800/20`}>
                          <div
                            className={`w-7 h-7 rounded-md flex items-center justify-center shrink-0 mr-2 ${
                              chip.icon === "2x" 
                                ? "bg-green-900/40 text-green-400" 
                                : chip.icon === "3x" 
                                  ? "bg-indigo-900/40 text-purple-400" 
                                  : ""
                            }`}
                          >
                            <span className="text-lg">{chip.icon}</span>
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <div className="text-white text-md font-medium">
                                {chip.name}
                              </div>
                              
                              {usageCount > 0 && (
                                <div className="bg-indigo-700/30 text-indigo-300 text-[0.6rem] px-1.5 py-0.5 rounded-full">
                                  {usageCount}
                                </div>
                              )}
                              
                              {usageCount === 0 && chip.cooldownRemaining > 0 && (
                                <div className="bg-red-900/20 text-red-300 text-[0.6rem] px-1.5 py-0.5 rounded-full">
                                  {chip.cooldownRemaining} GW
                                </div>
                              )}
                              
                              {usageCount === 0 && chip.remainingUses === 0 && (
                                <div className="bg-red-900/20 text-red-300 text-[0.6rem] px-1.5 py-0.5 rounded-full">
                                  None left
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Limits section */}
                        <div className="px-2 pt-1 pb-2 text-[0.8rem] flex justify-between text-white/50">
                          {chip.cooldown && (
                            <div>{chip.cooldown} GW cooldown</div>
                          )}
                          {chip.seasonLimit && (
                            <div>{chip.remainingUses}/{chip.seasonLimit} uses left</div>
                          )}
                        </div>
                        
                        {/* Usage tags - Only shown if used */}
                        {usageCount > 0 && usages.length > 0 && (
                          <div className="px-2 pb-2">
                            <div className="flex flex-wrap gap-1">
                              {usages.slice(0, 1).map((usage, idx) => (
                                <div 
                                  key={idx}
                                  className="bg-primary-700/50 rounded px-1 py-0.5 text-[0.8rem] text-white/80 truncate max-w-full"
                                >
                                  {formatFixture(usage.fixture)}
                                </div>
                              ))}
                              {usages.length > 1 && (
                                <div className="bg-primary-700/30 rounded px-1 py-0.5 text-[0.8rem] text-white/60">
                                  +{usages.length - 1} more
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                        
                        {/* Apply during match prediction button */}
                        {chip.available && (
                          <div className="mt-auto border-t border-slate-100/20 text-center">
                            <div className=" text-[0.8rem] px-2 py-1.5 border-slate-100/20">
                              <span className="text-white/60">Use in prediction</span>
                            </div>
                          </div>
                        )}
                        
                        {!chip.available && (
                          <div className="mt-auto border-t border-slate-100/20 text-center text-[0.8rem] text-white/40 py-1.5">
                            Not Available
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
              
              {/* Upcoming fixtures*/}
              {upcomingFixtures.length > 0 && (
                <div className="mt-2 border-t border-primary-600/30 mx-2 pt-2 pb-1">
                  <h4 className="text-white/70 text-[0.8rem] mb-1.5">Upcoming Fixtures</h4>
                  <div className="flex flex-wrap gap-1">
                    {upcomingFixtures.slice(0, 4).map((fixture, idx) => (
                      <div 
                        key={idx}
                        className="bg-primary-700/20 border border-primary-600/20 rounded flex items-center"
                      >
                        <span className="text-white/80 text-[0.8rem] px-1.5 py-0.5">
                          {formatFixture(fixture)}
                        </span>
                        <button className="bg-indigo-600/80 hover:bg-indigo-600 h-full rounded-r text-[0.8rem] px-1.5 py-0.5 text-white transition-colors">
                          Predict
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Learn more button */}
      <div className="mt-2 flex justify-end">
        <button 
          onClick={toggleChipInfoModal} // Use the prop instead of local state
          className="text-[0.8rem] text-indigo-300 hover:text-indigo-200 flex items-center transition-colors"
        >
          <QuestionMarkCircledIcon className="mr-1 w-3 h-3" />
          Learn more about chips
        </button>
      </div>
      
      {/* Confirmation Modal*/}
      <AnimatePresence>
        {showConfirmModal && selectedChip && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-950/85 backdrop-blur-lg z-50 flex items-center justify-center p-4"
            onClick={() => setShowConfirmModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", damping: 15 }}
              className="bg-gradient-to-b from-primary-700 to-primary-800 border border-slate-400 rounded-lg p-4 max-w-sm w-full font-outfit"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center mb-3">
                <div 
                  className="w-10 h-10 rounded-full flex items-center justify-center mr-3 text-2xl"
                  style={{ 
                    backgroundColor: `rgba(var(--color-${selectedChip.color}-700), 0.4)`,
                    color: `rgba(var(--color-${selectedChip.color}-300), 1)`
                  }}
                >
                  {selectedChip.icon}
                </div>
                <h3 className="text-teal-100 text-2xl font-dmSerif">
                  Apply {selectedChip.name}?
                </h3>
              </div>
              
              <div className="text-white/70 mb-3 text-sm">
                <p>This chip affects <span className="text-teal-300">all predictions</span> for Gameweek {currentGameweek}.</p>
                <p className="text-white/60 text-xs mt-1 italic">"{selectedChip.description}"</p>
              </div>
              
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setShowConfirmModal(false)}
                  className="px-3 py-1.5 border border-primary-400/30 text-white/80 hover:text-white rounded-md transition-colors text-xs hover:bg-primary-600/20"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmChipApplication}
                  className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md transition-colors text-xs flex items-center justify-center font-medium"
                >
                  <CheckIcon className="mr-1 w-3 h-3" />
                  Apply
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default GameweekChipsPanel;
