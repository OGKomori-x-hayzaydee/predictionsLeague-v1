import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PlusIcon, MinusIcon } from "@radix-ui/react-icons";
import { getTeamLogo } from "../../data/sampleData";
import { getPredictionStats } from "../../utils/fixtureUtils";
import TeamFixtureItem from "./TeamFixtureItem";

const TeamPanel = ({ team, fixtures, isExpanded, onToggle, onFixtureSelect }) => {
  const stats = getPredictionStats(fixtures);

  return (
    <div className="bg-primary-800/30 rounded-lg border border-primary-700/30 overflow-hidden">
      {/* Team header - clickable */}
      <div 
        className="flex items-center justify-between p-3 cursor-pointer hover:bg-primary-700/30 transition-colors"
        onClick={() => onToggle(team)}
      >
        <div className="flex items-center">
          <img 
            src={getTeamLogo(team)} 
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