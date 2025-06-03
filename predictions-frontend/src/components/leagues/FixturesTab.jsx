import React from 'react';
import { motion } from 'framer-motion';
import { ClockIcon } from '@radix-ui/react-icons';
import { formatDate, getDeadlineStatus } from '../../utils/dateUtils';

const FixturesTab = ({ fixtures, handlePrediction }) => {
  return (
    <motion.div
      key="fixtures"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="mb-8"
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-teal-100 text-2xl font-outfit">Upcoming Fixtures</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {fixtures.map((fixture, idx) => {
          const deadline = getDeadlineStatus(fixture.deadline);
          return (
            <motion.div 
              key={fixture.id}
              whileHover={{ y: -3 }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className={`
                p-4 rounded-lg border ${fixture.predicted 
                  ? "bg-indigo-900/10 border-indigo-600/30" 
                  : deadline.status === 'urgent' 
                    ? "bg-red-900/10 border-red-600/30"
                    : "bg-slate-800/30 border-slate-700/40"}
              `}
            >
              <div className="flex justify-between items-start mb-3">
                <div className="text-sm text-white/60">
                  {formatDate(fixture.date, 'EEE, MMM d')}
                  <div className="text-white/40 text-xs">
                    {formatDate(fixture.date, 'h:mm a')}
                  </div>
                </div>
                
                {/* Deadline status */}
                <div className={`
                  px-1.5 py-0.5 rounded text-xs 
                  ${deadline.status === 'urgent' ? 'bg-red-900/30 text-red-300 animate-pulse' : 
                    deadline.status === 'soon' ? 'bg-amber-900/30 text-amber-300' : 
                    deadline.status === 'open' ? 'bg-slate-700/40 text-white/70' :
                    deadline.status === 'closed' ? 'bg-slate-800/50 text-white/40' : ''}
                `}>
                  <div className="flex items-center">
                    <ClockIcon className="w-3 h-3 mr-1" />
                    {deadline.status === 'closed' ? 'Closed' : `Predict by ${deadline.text}`}
                  </div>
                </div>
              </div>
              
              {/* Competition badge */}
              <div className="mb-3">
                <span className="inline-block bg-slate-700/50 rounded px-1.5 py-0.5 text-xs text-white/70">
                  {fixture.competition}
                </span>
              </div>
              
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-slate-700/50 rounded-full mr-2 flex items-center justify-center">
                    {fixture.homeImg ? (
                      <img src={fixture.homeImg} alt={fixture.home} className="w-6 h-6" />
                    ) : (
                      <span className="text-xs text-white/70">{fixture.home.slice(0,3)}</span>
                    )}
                  </div>
                  <div className="text-white/90">{fixture.home}</div>
                </div>
                <div className="text-white/40 text-sm mx-2">vs</div>
                <div className="flex items-center">
                  <div className="text-white/90">{fixture.away}</div>
                  <div className="w-8 h-8 bg-slate-700/50 rounded-full ml-2 flex items-center justify-center">
                    {fixture.awayImg ? (
                      <img src={fixture.awayImg} alt={fixture.away} className="w-6 h-6" />
                    ) : (
                      <span className="text-xs text-white/70">{fixture.away.slice(0,3)}</span>
                    )}
                  </div>
                </div>
              </div>
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handlePrediction(fixture.id)}
                disabled={deadline.status === 'closed'}
                className={`
                  w-full py-1.5 rounded text-sm font-medium transition-colors
                  ${fixture.predicted
                    ? "bg-indigo-700/40 text-indigo-300 border border-indigo-600/30 hover:bg-indigo-700/60"
                    : deadline.status === 'closed'
                      ? "bg-slate-700/20 text-white/30 border border-slate-600/20 cursor-not-allowed"
                      : deadline.status === 'urgent'
                        ? "bg-red-700/40 text-red-200 border border-red-600/30 hover:bg-red-700/60"
                        : "bg-teal-700/40 text-teal-200 border border-teal-600/40 hover:bg-teal-700/60"}
                `}
              >
                {fixture.predicted ? "Edit Prediction" : "Make Prediction"}
              </motion.button>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};

export default FixturesTab;