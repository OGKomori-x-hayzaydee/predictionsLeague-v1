import React, { useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Share1Icon, 
  Pencil1Icon, 
  ExitIcon, 
  DotsHorizontalIcon 
} from '@radix-ui/react-icons';
import { ThemeContext } from '../../context/ThemeContext';

const LeagueActionsMenu = ({ isOpen, setIsOpen, isAdmin, onManage }) => {
  const { theme } = useContext(ThemeContext);
  const isDarkMode = theme === 'dark';
  
  return (
    <div className="relative">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center px-3 py-1.5 border rounded-md transition-colors text-sm ${
          isDarkMode 
            ? 'bg-slate-700/40 hover:bg-slate-700/60 border-slate-600/30 text-white/70 hover:text-white/90' 
            : 'bg-gray-100 hover:bg-gray-200 border-gray-200 text-gray-700 hover:text-gray-900'
        }`}
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
            className={`absolute right-0 top-full mt-1 z-20 border rounded-lg shadow-xl w-48 ${
              isDarkMode 
                ? 'bg-slate-800 border-slate-600/40' 
                : 'bg-white border-gray-200'
            }`}
          >
            <div className="py-1">
              <button className={`w-full text-left px-3 py-2 flex items-center text-sm transition-colors ${
                isDarkMode 
                  ? 'hover:bg-slate-700/50 text-white/90' 
                  : 'hover:bg-gray-50 text-gray-900'
              }`}>
                <Share1Icon className="w-4 h-4 mr-2.5" />
                Share League
              </button>
              
              {isAdmin && (
                <button 
                  className={`w-full text-left px-3 py-2 flex items-center text-sm transition-colors ${
                    isDarkMode 
                      ? 'hover:bg-slate-700/50 text-white/90' 
                      : 'hover:bg-gray-50 text-gray-900'
                  }`}
                  onClick={onManage}
                >
                  <Pencil1Icon className="w-4 h-4 mr-2.5" />
                  Manage League
                </button>
              )}
              
              <button className={`w-full text-left px-3 py-2 flex items-center text-sm transition-colors ${
                isDarkMode 
                  ? 'hover:bg-slate-700/50 text-red-300' 
                  : 'hover:bg-gray-50 text-red-600'
              }`}>
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

export default LeagueActionsMenu;