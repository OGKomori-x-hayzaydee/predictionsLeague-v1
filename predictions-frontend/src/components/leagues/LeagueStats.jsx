import React from 'react';
import { motion } from 'framer-motion';

const LeagueStats = ({ league }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      <motion.div 
        whileHover={{ scale: 1.02 }}
        className="bg-slate-800/40 border border-slate-700/40 rounded-lg p-5 text-center relative overflow-hidden"
      >
        <div className="relative z-10">
          <div className="text-sm text-white/50 uppercase">Your Position</div>
          <div className="text-4xl font-bold text-teal-300 mt-1">{league.position}</div>
          <div className="text-xs text-white/40 mt-1">out of {league.members}</div>
        </div>
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${(1 - (league.position - 1) / league.members) * 100}%` }}
          transition={{ delay: 0.3, duration: 0.8, ease: "easeOut" }}
          className="absolute bottom-0 left-0 h-1 bg-teal-500/60"
        />
      </motion.div>
      
      <motion.div 
        whileHover={{ scale: 1.02 }}
        className="bg-slate-800/40 border border-slate-700/40 rounded-lg p-5 text-center relative overflow-hidden"
      >
        <div className="relative z-10">
          <div className="text-sm text-white/50 uppercase">Your Points</div>
          <div className="text-4xl font-bold text-white mt-1">{league.points}</div>
          <div className="text-xs text-white/40 mt-1">{league.pointsLeader - league.points} behind leader</div>
        </div>
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${(league.points / league.pointsLeader) * 100}%` }}
          transition={{ delay: 0.3, duration: 0.8, ease: "easeOut" }}
          className="absolute bottom-0 left-0 h-1 bg-indigo-500/60"
        />
      </motion.div>
      
      <motion.div 
        whileHover={{ scale: 1.02 }}
        className="bg-slate-800/40 border border-slate-700/40 rounded-lg p-5 text-center relative overflow-hidden"
      >
        <div className="relative z-10">
          <div className="text-sm text-white/50 uppercase">Leader Points</div>
          <div className="text-4xl font-bold text-amber-300 mt-1">{league.pointsLeader}</div>
          <div className="text-xs text-white/40 mt-1">Current league high</div>
        </div>
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: "100%" }}
          transition={{ delay: 0.3, duration: 0.8, ease: "easeOut" }}
          className="absolute bottom-0 left-0 h-1 bg-amber-500/60"
        />
      </motion.div>
    </div>
  );
};

export default LeagueStats;