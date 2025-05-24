import React from 'react';
import { motion } from "framer-motion";
import {
  PersonIcon,
  EnterIcon,
  LockClosedIcon,
  GlobeIcon,
  InfoCircledIcon,
  StarFilledIcon
} from "@radix-ui/react-icons";

const FeaturedLeagueCard = ({ league, onJoinLeague, isJoining }) => {
  const memberCount = league.memberCount || 0;
  
  return (
    <motion.div
      whileHover={{ y: -3 }}
      className="bg-gradient-to-br from-slate-700/30 to-slate-800/20 border border-slate-600/30 rounded-lg overflow-hidden h-full"
    >
      {/* Feature badge
      <div className="absolute top-0 left-0">
        <div className="bg-gradient-to-r from-amber-600 to-amber-500 text-white px-3 py-1 rounded-br-lg text-xs flex items-center">
          <StarFilledIcon className="w-3 h-3 mr-1" />
          Featured
        </div>
      </div> */}
      
      {/* Header with image background */}
      <div className="h-24 bg-gradient-to-r from-indigo-900/50 to-teal-900/50 relative flex items-center justify-center p-4">
        <div className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold ${
          league.type === 'official' 
            ? 'bg-indigo-900/60 text-indigo-100 border-2 border-indigo-500/30' 
            : 'bg-teal-900/60 text-teal-100 border-2 border-teal-500/30'
        }`}>
          {league.name.charAt(0).toUpperCase()}
        </div>
      </div>
      
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-white font-dmSerif text-xl">{league.name}</h3>
          <div className={`px-2 py-1 rounded-full text-xs flex items-center ${
            league.type === 'private' 
              ? 'bg-indigo-900/40 text-indigo-300' 
              : 'bg-teal-900/40 text-teal-300'
          }`}>
            {league.type === 'private' 
              ? <LockClosedIcon className="w-3 h-3 mr-1" /> 
              : <GlobeIcon className="w-3 h-3 mr-1" />
            }
            <span>{league.type === 'private' ? 'Private' : 'Public'}</span>
          </div>
        </div>
        
        <p className="text-white/70 text-sm mb-3 line-clamp-2">
          {league.description || "No description provided for this league."}
        </p>
        
        <div className="flex flex-wrap gap-2 mb-4">
          <div className="bg-slate-700/30 px-2 py-1 rounded-md text-white/80 text-xs flex items-center">
            <PersonIcon className="w-3 h-3 mr-1.5" />
            {memberCount.toLocaleString()} {memberCount === 1 ? 'member' : 'members'}
          </div>
          
          {league.competition && (
            <div className="bg-slate-700/30 px-2 py-1 rounded-md text-white/80 text-xs">
              {league.competition}
            </div>
          )}
          
          {league.prizes && (
            <div className="bg-amber-900/30 text-amber-300 px-2 py-1 rounded-md text-xs flex items-center">
              {/* <TrophyIcon className="w-3 h-3 mr-1.5" /> */}
              Prizes
            </div>
          )}
        </div>
        
        <div className="flex justify-between items-center">
          <div>
            {league.startDate && (
              <p className="text-white/50 text-xs">
                Starting soon
              </p>
            )}
          </div>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            disabled={isJoining}
            onClick={() => onJoinLeague(league.id)}
            className={`px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-md text-white text-sm flex items-center transition-colors ${isJoining ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            <EnterIcon className="w-3.5 h-3.5 mr-1.5" />
            {isJoining ? 'Joining...' : 'Join League'}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default FeaturedLeagueCard;