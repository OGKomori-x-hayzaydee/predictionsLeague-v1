import React from 'react';
import { motion } from "framer-motion";
import { LightningBoltIcon } from "@radix-ui/react-icons";

const ActiveChipsBanner = ({ activeGameweekChips, currentGameweek }) => {
  if (activeGameweekChips.length === 0) return null;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="mb-4 bg-teal-900/30 border border-teal-700/30 rounded-lg p-3"
    >
      <div className="flex items-center text-teal-200 mb-2">
        <LightningBoltIcon className="mr-2" />
        <span className="font-medium">Active Gameweek Chips</span>
      </div>
      <p className="text-teal-100/70 text-sm">
        You have gameweek-wide chips active for Gameweek {currentGameweek}. These will apply to all your predictions this gameweek.
      </p>
    </motion.div>
  );
};

export default ActiveChipsBanner;