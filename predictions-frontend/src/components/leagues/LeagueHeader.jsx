
import { 
  LockClosedIcon, 
  GlobeIcon, 
  PersonIcon, 
  CalendarIcon,
  Pencil1Icon
} from '@radix-ui/react-icons';
import { motion } from 'framer-motion';
import { formatDate } from '../../utils/dateUtils';

const LeagueHeader = ({ league, onManage }) => {
  return (
    <div className="bg-gradient-to-br from-slate-700/50 to-slate-800/30 border border-slate-600/30 rounded-lg p-5 mb-6">
      <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-4">
        <div className="flex items-start">
          {/* League icon/avatar */}
          <div className={`w-16 h-16 rounded-lg flex items-center justify-center mr-4 text-2xl font-bold shadow-md ${
            league.type === 'private' 
              ? 'bg-indigo-900/40 text-indigo-100 border border-indigo-700/20' 
              : 'bg-teal-900/40 text-teal-100 border border-teal-700/20'
          }`}>
            {league.name.charAt(0).toUpperCase()}
          </div>
          
          <div>
            <div className="flex items-center">
              <div className={`mr-2 text-xs px-2 py-0.5 rounded-full ${
                league.type === 'private' 
                  ? 'bg-indigo-900/50 text-indigo-300 border border-indigo-700/30' 
                  : 'bg-teal-900/50 text-teal-300 border border-teal-700/30'
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
                <span className="bg-amber-900/50 text-amber-300 text-xs px-2 py-0.5 rounded-full border border-amber-700/30">
                  Admin
                </span>
              )}
            </div>
            
            <h1 className="text-teal-100 text-3xl font-bold font-dmSerif mt-1">
              {league.name}
            </h1>
            
            <p className="text-white/70 max-w-3xl mt-2">
              {league.description}
            </p>
          </div>
        </div>
        
        {league.isAdmin && (
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={onManage}
            className="bg-indigo-900/40 hover:bg-indigo-900/60 border border-indigo-500/20 rounded-md py-2 px-4 transition-colors text-indigo-300 hover:text-indigo-200 flex items-center"
          >
            <Pencil1Icon className="w-3.5 h-3.5 mr-1.5" />
            Manage League
          </motion.button>
        )}
      </div>
      
      <div className="flex flex-wrap gap-4 mt-4 items-center text-sm">
        <div className="flex items-center text-white/70">
          <PersonIcon className="w-3.5 h-3.5 mr-1.5" />
          <span>{league.members} members</span>
        </div>
        
        <div className="flex items-center text-white/70">
          <CalendarIcon className="w-3.5 h-3.5 mr-1.5" />
          <span>Updated {formatDate(league.lastUpdate, 'MMM d, yyyy')}</span>
        </div>
      </div>
    </div>
  );
};

export default LeagueHeader;