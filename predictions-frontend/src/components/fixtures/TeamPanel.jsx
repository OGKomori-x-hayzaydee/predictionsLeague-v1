import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PlusIcon, MinusIcon } from "@radix-ui/react-icons";
import { getPredictionStats } from "../../utils/fixtureUtils";
import TeamFixtureItem from "./TeamFixtureItem";
import { normalizeTeamName, getTeamLogo } from "../../utils/teamUtils";
import { getLogoUrl } from "../../utils/logoCache";
import { teamLogos } from "../../data/sampleData";

const TeamPanel = ({ team, fixtures, isExpanded, onToggle, onFixtureSelect }) => {
  const stats = getPredictionStats(fixtures);
  
  // Handle team logo with better caching and fallbacks
  const getTeamLogoSrc = (teamName) => {
    // Use the getLogoUrl helper first to try all variants with context logos
    if (teamLogos) {
      const logoUrl = getLogoUrl(teamName, teamLogos, normalizeTeamName);
      
      // If we got a non-placeholder logo, use it
      if (!logoUrl.includes('placeholder')) {
        return logoUrl;
      }
    }
    
    // Fall back to the utility function which uses local assets
    const logo = getTeamLogo(teamName);
    
    // Debug logging
    if (logo.includes('placeholder')) {
      console.log(`No logo found for ${teamName} in either context or local assets`);
      if (teamLogos) {
        console.log('Available logo team names:', Object.keys(teamLogos).sort().join(', '));
      }
    }
    
    return logo;
  };

  return (
    <div className="bg-primary-800/30 rounded-lg border border-primary-700/30 overflow-hidden">
      {/* Team header - clickable */}
      <div 
        className="flex items-center justify-between p-3 cursor-pointer hover:bg-primary-700/30 transition-colors"
        onClick={() => onToggle(team)}
      >
        <div className="flex items-center">
          <img 
            src={getTeamLogoSrc(team)} 
            alt={team} 
            className="w-8 h-8 object-contain mr-3" 
          />
          <div>
            <h3 className="text-white font-medium">{team}</h3>
            <div className="text-white/60 text-xs">
              {fixtures.length} upcoming fixture{fixtures.length !== 1 ? 's' : ''}
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <div className="w-20 bg-primary-700/30 rounded-full h-1.5 overflow-hidden">
            <div 
              className="bg-teal-500 h-full"
              style={{ width: `${stats.percentage}%` }}
            ></div>
          </div>
          <div className="text-xs text-white/70">
            {stats.predicted}/{stats.total} predicted
          </div>
          {isExpanded ? (
            <MinusIcon className="text-white/60" />
          ) : (
            <PlusIcon className="text-white/60" />
          )}
        </div>
      </div>
      
      {/* Team fixtures - collapsible */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="border-t border-primary-700/30 overflow-hidden"
          >
            <div className="divide-y divide-primary-700/20">
              {fixtures.map(fixture => (
                <TeamFixtureItem
                  key={fixture.id}
                  fixture={fixture}
                  team={team}
                  onFixtureSelect={onFixtureSelect}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TeamPanel;