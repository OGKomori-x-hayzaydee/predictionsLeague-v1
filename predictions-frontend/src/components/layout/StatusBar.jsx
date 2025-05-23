import { Box } from '@radix-ui/themes';
import { motion } from 'framer-motion';
import { CaretUpIcon, CaretDownIcon, LockClosedIcon, ClockIcon } from '@radix-ui/react-icons';

export default function StatusBar({ user }) {
  // Sample user data - in a real app, this would come from props or context
  const userData = user || {
    username: "hayzaydee",
    points: 1250,
    rank: 1,
    rankChange: 0, 
    nextMatchTime: "2025-06-12T15:00:00", // ISO format for the next upcoming match
    predictions: 28, // predictions made this season
    pendingPredictions: 4, // pending predictions for the upcoming gameweek
  };

  // Calculate time until next match
  const nextMatch = new Date(userData.nextMatchTime);
  const now = new Date();
  const timeUntilMatch = nextMatch - now;
  const hoursUntilMatch = Math.floor(timeUntilMatch / (1000 * 60 * 60));
  const minutesUntilMatch = Math.floor((timeUntilMatch % (1000 * 60 * 60)) / (1000 * 60));

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-primary-500/90 backdrop-blur-md border-b border-primary-400/20"
    >
      <Box className="container mx-auto px-4 py-3">
        <div className="flex flex-wrap items-center justify-between gap-y-2">
          
          <div className="flex items-center">
            <div className="h-9 w-9 bg-indigo-600 rounded-full flex items-center justify-center text-white font-medium mr-3">
              {userData.username.substring(0, 1).toUpperCase()}
            </div>
            <div>
              <h3 className="text-teal-100 font-medium font-outfit">
                {userData.username}
              </h3>
              <div className="flex items-center text-xs text-white/60">
                <span>Rank: {userData.rank.toLocaleString()}</span>
                <span className={`flex items-center ml-2 ${
                  userData.rankChange > 0 
                    ? 'text-green-400' 
                    : userData.rankChange < 0 
                      ? 'text-red-400' 
                      : 'text-white/60'
                }`}>
                  {userData.rankChange > 0 ? (
                    <>
                      <CaretUpIcon className="mr-0.5" /> {userData.rankChange}
                    </>
                  ) : userData.rankChange < 0 ? (
                    <>
                      <CaretDownIcon className="mr-0.5" /> {Math.abs(userData.rankChange)}
                    </>
                  ) : (
                    '-'
                  )}
                </span>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="flex space-x-6">
            {/* Points */}
            <div className="flex flex-col items-center">
              <span className="text-xs text-white/60 font-outfit">POINTS</span>
              <span className="text-teal-200 font-bold font-dmSerif text-lg">{userData.points.toLocaleString()}</span>
            </div>
            
            {/* Predictions */}
            <div className="flex flex-col items-center">
              <span className="text-xs text-white/60 font-outfit">PREDICTIONS</span>
              <span className="text-teal-200 font-bold font-dmSerif text-lg">{userData.predictions}</span>
            </div>
            
            {/* Next Match */}
            <div className="hidden md:flex flex-col items-center">
              <span className="text-xs text-white/60 font-outfit">NEXT MATCH IN</span>
              <span className="text-teal-200 font-bold font-dmSerif text-lg flex items-center">
                <ClockIcon className="mr-1" /> {hoursUntilMatch}h {minutesUntilMatch}m
              </span>
            </div>
          </div>

          {/* Action Button */}
          <div>
            {userData.pendingPredictions > 0 ? (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => alert('Navigate to predictions page')}
                className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm py-2 px-4 rounded-md flex items-center font-outfit transition-colors"
              >
                Make Predictions
                <span className="ml-2 bg-white text-indigo-600 rounded-full h-5 w-5 flex items-center justify-center text-xs font-bold">
                  {userData.pendingPredictions}
                </span>
              </motion.button>
            ) : (
              <button className="bg-indigo-700/50 text-white/70 text-sm py-2 px-4 rounded-md flex items-center font-outfit cursor-not-allowed">
                <LockClosedIcon className="mr-1" /> All Predictions Made
              </button>
            )}
          </div>
        </div>
      </Box>
    </motion.div>
  );
}