import React from 'react';
import { motion } from 'framer-motion';
import { CaretSortIcon, MixerHorizontalIcon } from '@radix-ui/react-icons';
import TrendIndicator from '../ui/TrendIndicator';

const LeaderboardTab = ({ leaderboard }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="mb-8"
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-teal-100 text-2xl font-outfit">Leaderboard</h2>
        
        <div className="flex items-center gap-2">
          <button className="bg-slate-700/40 hover:bg-slate-700/60 border border-slate-600/30 rounded-md py-1.5 px-3 text-sm text-white/70 hover:text-white flex items-center transition-colors">
            <CaretSortIcon className="w-4 h-4 mr-1.5" />
            Sort
          </button>
          
          <button className="bg-slate-700/40 hover:bg-slate-700/60 border border-slate-600/30 rounded-md py-1.5 px-3 text-sm text-white/70 hover:text-white flex items-center transition-colors">
            <MixerHorizontalIcon className="w-4 h-4 mr-1.5" />
            Filter
          </button>
        </div>
      </div>
      
      <div className="bg-slate-800/30 border border-slate-700/40 rounded-lg overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="text-left bg-slate-700/50">
              <th className="py-3 px-4 text-white/70 font-medium">Position</th>
              <th className="py-3 px-4 text-white/70 font-medium">Name</th>
              <th className="py-3 px-4 text-white/70 font-medium text-right">Points</th>
              <th className="py-3 px-4 text-white/70 font-medium text-right w-24">Trend</th>
            </tr>
          </thead>
          <tbody>
            {leaderboard.map((user, index) => (
              <motion.tr 
                key={user.id} 
                className={`
                  border-t border-slate-700/30 
                  ${user.isCurrentUser ? "bg-indigo-900/20" : ""}
                  ${index % 2 === 1 && !user.isCurrentUser ? "bg-slate-800/20" : ""}
                `}
                whileHover={{ backgroundColor: user.isCurrentUser ? "rgba(79, 70, 229, 0.3)" : "rgba(30, 41, 59, 0.3)" }}
              >
                <td className="py-3 px-4">
                  <div className={`
                    inline-flex items-center justify-center w-7 h-7 rounded-full text-sm
                    ${user.position === 1 ? "bg-amber-900/40 text-amber-300 border border-amber-700/30" : 
                      user.position <= 3 ? "bg-teal-900/40 text-teal-300 border border-teal-700/30" : 
                      "bg-slate-700/30 text-white/70"}
                  `}>
                    {user.position}
                  </div>
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-slate-700/50 mr-2 flex items-center justify-center text-white/80 text-sm">
                      {user.avatar ? (
                        <img src={user.avatar} alt={user.name} className="w-full h-full rounded-full" />
                      ) : (
                        user.name.charAt(0)
                      )}
                    </div>
                    <span className={user.isCurrentUser ? "text-indigo-300 font-medium" : "text-white/90"}>
                      {user.isCurrentUser ? "You" : user.name}
                    </span>
                  </div>
                </td>
                <td className="py-3 px-4 text-right font-mono text-white/80">{user.points}</td>
                <td className="py-3 px-4 text-right">
                  <TrendIndicator trend={user.trend} />
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

export default LeaderboardTab;