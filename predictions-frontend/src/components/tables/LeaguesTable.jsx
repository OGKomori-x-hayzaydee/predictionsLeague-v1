import React from "react";
import { motion } from "framer-motion";
import { BarChartIcon, PersonIcon, ChevronRightIcon, MagicWandIcon, GlobeIcon, LockClosedIcon } from "@radix-ui/react-icons";

const LeaguesTable = ({ leagues, onViewAll, onViewLeague }) => {
  return (    <div className="bg-slate-800/40 backdrop-blur-sm rounded-xl p-5 border border-slate-700/50 hover:border-slate-600/50 transition-all duration-200 font-outfit">
      <div className="flex justify-between items-center mb-5">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-amber-500/10 rounded-lg border border-amber-500/20">
            <MagicWandIcon className="w-4 h-4 text-amber-400" />
          </div>
          <div>
            <h3 className="text-white font-outfit font-semibold text-base">
              My Leagues
            </h3>
            <p className="text-slate-400 text-xs">Your current league standings</p>
          </div>
        </div>
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onViewAll}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-700/50 hover:bg-slate-700/70 border border-slate-600/30 rounded-lg text-slate-300 hover:text-white text-xs transition-all duration-200"
        >
          View all 
          <ChevronRightIcon className="w-3 h-3" />
        </motion.button>
      </div>      <div className="space-y-2">
        {leagues.map((league, index) => (
          <motion.div
            key={league.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="group relative bg-slate-700/20 hover:bg-slate-700/40 rounded-lg p-3 border border-slate-600/20 hover:border-slate-500/40 transition-all duration-200 cursor-pointer"
            onClick={() => onViewLeague(league.id)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 flex-1">
                {/* League Avatar */}
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-base font-bold border ${
                  league.type === 'private' 
                    ? 'bg-indigo-500/10 text-indigo-300 border-indigo-500/20' 
                    : 'bg-teal-500/10 text-teal-300 border-teal-500/20'
                }`}>
                  {league.name.charAt(0).toUpperCase()}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <h4 className="text-white font-medium text-sm truncate">
                      {league.name}
                    </h4>
                    <div className="flex items-center gap-0.5">
                      {league.type === 'private' ? (
                        <LockClosedIcon className="w-2.5 h-2.5 text-slate-400" />
                      ) : (
                        <GlobeIcon className="w-2.5 h-2.5 text-slate-400" />
                      )}
                      {league.isAdmin && (
                        <MagicWandIcon className="w-2.5 h-2.5 text-amber-400" title="Admin" />
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 text-slate-400 text-xs">
                    <div className="flex items-center gap-0.5">
                      <PersonIcon className="w-3 h-3" />
                      <span>{league.members} members</span>
                    </div>
                    <div className="text-xs">
                      Updated 2h ago
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                {/* Position Badge */}
                <div className={`flex items-center gap-1.5 px-2 py-1.5 rounded-lg ${
                  league.position <= 3 
                    ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                    : league.position <= 10
                    ? 'bg-teal-500/10 text-teal-400 border border-teal-500/20'
                    : 'bg-slate-600/20 text-slate-300 border border-slate-600/20'
                }`}>
                  {league.position <= 3 && <MagicWandIcon className="w-3 h-3" />}
                  <span className="font-semibold text-xs">
                    #{league.position}
                  </span>
                </div>
                
                {/* View Button */}
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    onViewLeague(league.id);
                  }}                  className="flex items-center gap-0.5 text-indigo-400 hover:text-indigo-300 text-xs font-medium opacity-0 group-hover:opacity-100 transition-all duration-200"
                >
                  View
                  <ChevronRightIcon className="w-3 h-3" />
                </motion.button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {leagues.length === 0 && (
        <div className="text-center py-6">
          <MagicWandIcon className="w-10 h-10 text-slate-500 mx-auto mb-2" />
          <h4 className="text-slate-300 font-medium mb-1.5 text-sm">No leagues joined</h4>
          <p className="text-slate-500 text-xs">Join or create a league to compete with friends!</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onViewAll}
            className="mt-3 px-3 py-1.5 bg-teal-600/20 hover:bg-teal-600/30 text-teal-400 border border-teal-500/30 rounded-lg text-xs font-medium transition-all duration-200"
          >
            Explore Leagues
          </motion.button>
        </div>
      )}
    </div>
  );
};

export default LeaguesTable;