import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Share1Icon, Pencil1Icon, ExitIcon, DotsHorizontalIcon } from '@radix-ui/react-icons';

const ActionsMenu = ({ isOpen, toggleOpen, isAdmin, onManage }) => {
  return (
    <div className="relative">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={toggleOpen}
        className="flex items-center px-3 py-1.5 bg-slate-700/40 hover:bg-slate-700/60 border border-slate-600/30 rounded-md text-white/70 hover:text-white/90 transition-colors text-sm"
      >
        Actions
        <DotsHorizontalIcon className="ml-1.5 w-3.5 h-3.5" />
      </motion.button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 5 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 5 }}
            className="absolute right-0 top-full mt-1 z-20 bg-slate-800 border border-slate-600/40 rounded-lg shadow-xl w-48"
          >
            <div className="py-1">
              <button className="w-full text-left px-3 py-2 hover:bg-slate-700/50 text-white/90 flex items-center text-sm">
                <Share1Icon className="w-4 h-4 mr-2.5" />
                Share League
              </button>
              
              {isAdmin && (
                <button 
                  className="w-full text-left px-3 py-2 hover:bg-slate-700/50 text-white/90 flex items-center text-sm"
                  onClick={onManage}
                >
                  <Pencil1Icon className="w-4 h-4 mr-2.5" />
                  Manage League
                </button>
              )}
              
              <button className="w-full text-left px-3 py-2 hover:bg-slate-700/50 text-red-300 flex items-center text-sm">
                <ExitIcon className="w-4 h-4 mr-2.5" />
                Leave League
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ActionsMenu;