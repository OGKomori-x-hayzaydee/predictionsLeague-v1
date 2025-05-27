import React from 'react';
import { motion } from 'framer-motion';
import { GlobeIcon, LockClosedIcon, CheckIcon } from "@radix-ui/react-icons";

const LeagueTypesExplainer = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
    <motion.div 
      whileHover={{ y: -4 }}
      className="bg-gradient-to-br from-slate-700/40 to-slate-700/20 rounded-lg border border-slate-600/30 p-5 h-full"
    >
      <div className="flex items-center mb-4">
        <div className="w-10 h-10 rounded-full bg-slate-600/40 flex items-center justify-center text-slate-300 mr-3">
          <GlobeIcon className="w-5 h-5" />
        </div>
        <h3 className="text-teal-100 text-xl font-outfit">Public Leagues</h3>
      </div>
      <p className="text-white/70 text-sm mb-4">
        Public leagues are open to everyone. Join global competitions with thousands of players, compete for higher ranks, and test your prediction skills against the world.
      </p>
      <ul className="space-y-3">
        {[
          "Open to all players",
          "Global leaderboards and rankings",
          "Standard scoring systems",
          "All Premier League matches included",
          "Seasonal and weekly prizes"
        ].map((item, idx) => (
          <li key={idx} className="flex items-start text-white/70 text-sm">
            <div className="w-5 h-5 rounded-full bg-teal-900/60 flex items-center justify-center mr-2 shrink-0">
              <CheckIcon className="w-3 h-3 text-teal-300" />
            </div>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </motion.div>
    
    <motion.div 
      whileHover={{ y: -4 }}
      className="bg-gradient-to-br from-indigo-900/30 to-indigo-900/10 rounded-lg border border-indigo-600/30 p-5 h-full"
    >
      <div className="flex items-center mb-4">
        <div className="w-10 h-10 rounded-full bg-indigo-800/50 flex items-center justify-center text-indigo-300 mr-3">
          <LockClosedIcon className="w-4 h-4" />
        </div>
        <h3 className="text-indigo-100 text-xl font-outfit">Private Leagues</h3>
      </div>
      <p className="text-white/70 text-sm mb-4">
        Create your own league and invite friends, family, or colleagues. As league admin, you control the rules, scoring systems, and which matches to include.
      </p>
      <ul className="space-y-3">
        {[
          "Invite-only membership",
          "Customizable scoring systems",
          "Select which fixtures to predict",
          "League admin controls",
          "Custom league settings"
        ].map((item, idx) => (
          <li key={idx} className="flex items-start text-white/70 text-sm">
            <div className="w-5 h-5 rounded-full bg-indigo-900/60 flex items-center justify-center mr-2 shrink-0">
              <CheckIcon className="w-3 h-3 text-indigo-300" />
            </div>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </motion.div>
  </div>
);

export default LeagueTypesExplainer;