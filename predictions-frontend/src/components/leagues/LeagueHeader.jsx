import { useContext } from "react";
import { 
  LockClosedIcon, 
  GlobeIcon, 
  PersonIcon, 
  CalendarIcon,
  Pencil1Icon
} from '@radix-ui/react-icons';
import { motion } from 'framer-motion';
import { formatDate } from '../../utils/dateUtils';
import { ThemeContext } from '../../contexts/ThemeContext';

const LeagueHeader = ({ league, onManage }) => {
    const { theme } = useContext(ThemeContext);
    const isDarkMode = theme === 'dark';
  
  return (
    <div className={`border rounded-lg p-5 mb-6 ${
      isDarkMode 
        ? 'bg-gradient-to-br from-slate-700/50 to-slate-800/30 border-slate-600/30' 
        : 'bg-gradient-to-br from-gray-50 to-white border-gray-200'
    }`}>
      <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-4">        <div className="flex items-start">
          {/* League icon/avatar */}
          <div className={`w-16 h-16 rounded-lg flex items-center justify-center mr-4 text-2xl font-bold shadow-md border ${
            league.type === 'private' 
              ? isDarkMode
                ? 'bg-indigo-900/40 text-indigo-100 border-indigo-700/20' 
                : 'bg-indigo-100 text-indigo-800 border-indigo-200'
              : isDarkMode
                ? 'bg-teal-900/40 text-teal-100 border-teal-700/20'
                : 'bg-teal-100 text-teal-800 border-teal-200'
          }`}>
            {league.name.charAt(0).toUpperCase()}
          </div>
            <div>
            <div className="flex items-center">
              <div className={`mr-2 text-xs px-2 py-0.5 rounded-full border ${
                league.type === 'private' 
                  ? isDarkMode
                    ? 'bg-indigo-900/50 text-indigo-300 border-indigo-700/30' 
                    : 'bg-indigo-100 text-indigo-700 border-indigo-200'
                  : isDarkMode
                    ? 'bg-teal-900/50 text-teal-300 border-teal-700/30'
                    : 'bg-teal-100 text-teal-700 border-teal-200'
              }`}>
                <div className="flex items-center">
                  {league.type === 'private' ? (
                    <LockClosedIcon className="w-3 h-3 mr-1" />
                  ) : (
                    <GlobeIcon className="w-3 h-3 mr-1" />
                  )}
                  <span>{league.type === 'private' ? 'Private' : 'Public'}</span>
                </div>
              </div>
              
              {league.isAdmin && (
                <span className={`text-xs px-2 py-0.5 rounded-full border ${
                  isDarkMode 
                    ? 'bg-amber-900/50 text-amber-300 border-amber-700/30' 
                    : 'bg-amber-100 text-amber-700 border-amber-200'
                }`}>
                  Admin
                </span>
              )}
            </div>
              <h1 className={`text-3xl font-bold font-dmSerif mt-1 ${
              isDarkMode ? 'text-teal-100' : 'text-teal-800'
            }`}>
              {league.name}
            </h1>
            
            <p className={`max-w-3xl mt-2 ${isDarkMode ? 'text-white/70' : 'text-gray-600'}`}>
              {league.description}
            </p>
          </div>
        </div>
          {league.isAdmin && (
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={onManage}
            className={`border rounded-md py-2 px-4 transition-colors flex items-center ${
              isDarkMode 
                ? 'bg-indigo-900/40 hover:bg-indigo-900/60 border-indigo-500/20 text-indigo-300 hover:text-indigo-200' 
                : 'bg-indigo-100 hover:bg-indigo-200 border-indigo-200 text-indigo-700 hover:text-indigo-800'
            }`}
          >
            <Pencil1Icon className="w-3.5 h-3.5 mr-1.5" />
            Manage League
          </motion.button>
        )}
      </div>
        <div className="flex flex-wrap gap-4 mt-4 items-center text-sm">
        <div className={`flex items-center ${isDarkMode ? 'text-white/70' : 'text-gray-600'}`}>
          <PersonIcon className="w-3.5 h-3.5 mr-1.5" />
          <span>{league.members} members</span>
        </div>
        
        <div className={`flex items-center ${isDarkMode ? 'text-white/70' : 'text-gray-600'}`}>
          <CalendarIcon className="w-3.5 h-3.5 mr-1.5" />
          <span>Updated {formatDate(league.lastUpdate, 'MMM d, yyyy')}</span>
        </div>
      </div>
    </div>
  );
};

export default LeagueHeader;