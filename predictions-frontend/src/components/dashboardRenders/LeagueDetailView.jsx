import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format, parseISO, isValid } from 'date-fns';
import {
  ArrowLeftIcon,
  PersonIcon,
  CalendarIcon,
  TargetIcon,
  GearIcon,
  StarIcon,
  ClockIcon,
  ChevronRightIcon,
  EyeOpenIcon,
  Pencil2Icon
} from '@radix-ui/react-icons';

import { getSampleLeague, upcomingFixtures } from '../../data/sampleData';
import { showToast } from '../../services/notificationService';

const LeagueDetailView = ({ leagueId, onBack, onManage }) => {
  const [activeTab, setActiveTab] = useState('leaderboard');
  
  // Get league data using the imported function
  const league = getSampleLeague(leagueId);

  // Safe date formatter that handles invalid dates
  const formatSafeDate = (dateValue, formatString) => {
    try {
      if (!dateValue) return "N/A";
      
      // Handle string dates by parsing them first
      const date = typeof dateValue === 'string' ? parseISO(dateValue) : new Date(dateValue);
      
      // Check if date is valid before formatting
      if (!isValid(date)) return "N/A";
      
      return format(date, formatString);
    } catch (error) {
      console.warn(`Error formatting date: ${error.message}`);
      return "N/A";
    }
  };
  
  // Handle making or editing a prediction
  const handlePrediction = (fixtureId) => {
    console.log(`Make prediction for fixture ${fixtureId}`);
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    showToast('League link copied to clipboard!', 'success');
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Header Navigation */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors group"
        >
          <ArrowLeftIcon className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-medium">Back to Leagues</span>
        </button>

        <div className="flex items-center gap-3">
          <button
            onClick={handleShare}
            className="flex items-center gap-2 px-3 py-2 bg-slate-700/60 hover:bg-slate-700/80 border border-slate-600/40 rounded-lg text-slate-300 hover:text-white text-sm transition-all duration-200"
          >
            Share
          </button>
          
          {league.isAdmin && (
            <button
              onClick={() => onManage(league.id)}
              className="flex items-center gap-2 px-3 py-2 bg-teal-600/20 hover:bg-teal-600/30 border border-teal-500/30 rounded-lg text-teal-400 hover:text-teal-300 text-sm transition-all duration-200"
            >
              <GearIcon className="w-4 h-4" />
              Manage
            </button>
          )}
        </div>
      </motion.div>

      {/* League Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-800/50 to-slate-700/30 border border-slate-600/30 backdrop-blur-sm"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-teal-500/10 to-indigo-500/10" />
        <div className="relative p-8">
          <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                {/* <div className="p-3 bg-teal-500/10 rounded-2xl border border-teal-500/20 shrink-0">
                  <TrophyIcon className="w-8 h-8 text-teal-400" />
                </div> */}
                <div className="min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-2xl lg:text-3xl font-bold text-white font-outfit">
                      {league.name}
                    </h1>
                    {league.isAdmin && (
                      <span className="px-2 py-1 bg-amber-500/10 border border-amber-500/20 rounded-lg text-amber-400 text-xs font-medium">
                        Admin
                      </span>
                    )}
                  </div>
                  <p className="text-slate-300 max-w-2xl leading-relaxed">
                    {league.description}
                  </p>
                  <div className="flex items-center gap-4 mt-3 text-sm text-slate-400">
                    <div className="flex items-center gap-1">
                      <CalendarIcon className="w-4 h-4" />
                      <span>Created {format(league.lastUpdate, 'MMM d, yyyy')}</span>
                    </div>
                    <span className="w-1 h-1 bg-slate-500 rounded-full" />
                    <div className="flex items-center gap-1">
                      <span className="capitalize">{league.type}</span> League
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* League Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 shrink-0">
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <PersonIcon className="w-4 h-4 text-slate-400" />
                  <span className="text-2xl font-bold text-white">{league.members}</span>
                </div>
                <span className="text-xs text-slate-400">Members</span>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 mb-1">
                  {/* <TrophyIcon className="w-4 h-4 text-slate-400" /> */}
                  <span className="text-2xl font-bold text-white">#{league.position || 'N/A'}</span>
                </div>
                <span className="text-xs text-slate-400">Your Rank</span>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <TargetIcon className="w-4 h-4 text-slate-400" />
                  <span className="text-2xl font-bold text-white">{league.predictions || 0}</span>
                </div>
                <span className="text-xs text-slate-400">Predictions</span>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <StarIcon className="w-4 h-4 text-slate-400" />
                  <span className="text-2xl font-bold text-white">{league.points || 0}</span>
                </div>
                <span className="text-xs text-slate-400">Points</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Tab Navigation */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex bg-slate-800/50 rounded-2xl p-1 border border-slate-700/30"
      >
        {[
          { id: 'leaderboard', label: 'Leaderboard', icon: TargetIcon },
          { id: 'predictions', label: 'Predictions', icon: TargetIcon },
          { id: 'fixtures', label: 'Fixtures', icon: CalendarIcon }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
              activeTab === tab.id
                ? "bg-teal-600 text-white shadow-lg shadow-teal-600/20"
                : "text-slate-300 hover:text-white hover:bg-slate-700/50"
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </motion.div>

      {/* Tab Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <AnimatePresence mode="wait">          {activeTab === 'leaderboard' && (
            <LeaderboardContent leaderboard={league.leaderboard} formatSafeDate={formatSafeDate} />
          )}
          
          {activeTab === 'predictions' && (
            <PredictionsContent leagueId={leagueId} />
          )}
          
          {activeTab === 'fixtures' && (
            <FixturesContent fixtures={upcomingFixtures} handlePrediction={handlePrediction} />
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
};

// Leaderboard Content Component
const LeaderboardContent = ({ leaderboard, formatSafeDate }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-4"
    >
      {leaderboard && leaderboard.length > 0 ? (
        leaderboard.map((player, index) => (
          <motion.div
            key={player.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center justify-between p-4 bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-xl hover:border-slate-600/60 transition-all duration-300"
          >
            <div className="flex items-center gap-4">
              {/* Position */}
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold ${
                index === 0 ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                index === 1 ? 'bg-slate-500/20 text-slate-400 border border-slate-500/30' :
                index === 2 ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30' :
                'bg-slate-700/50 text-slate-300'
              }`}>
                {index < 3 ? (
                  "1st"
                ) : (
                  index + 1
                )}
              </div>
              
              {/* Player Info */}
              <div>
                <h4 className="font-medium text-white">{player.name}</h4>                <p className="text-sm text-slate-400">
                  {player.predictions || 0} predictions • Joined {formatSafeDate(player.joinedDate, 'MMM yyyy')}
                </p>
              </div>
            </div>
            
            {/* Points */}
            <div className="text-right">
              <div className="text-lg font-bold text-white">{player.points}</div>
              <div className="text-sm text-slate-400">points</div>
            </div>
          </motion.div>
        ))
      ) : (
        <div className="text-center py-12">
          {/* <TrophyIcon className="w-12 h-12 text-slate-400 mx-auto mb-4" /> */}
          <h3 className="text-lg font-semibold text-white mb-2">No Rankings Yet</h3>
          <p className="text-slate-400">Start making predictions to see the leaderboard!</p>
        </div>
      )}
    </motion.div>
  );
};

// Predictions Content Component  
const PredictionsContent = ({ leagueId }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="text-center py-12"
    >
      <TargetIcon className="w-12 h-12 text-slate-400 mx-auto mb-4" />
      <h3 className="text-lg font-semibold text-white mb-2">League Predictions</h3>
      <p className="text-slate-400 mb-6">View and compare predictions from all league members</p>
      <button className="px-6 py-3 bg-teal-600 hover:bg-teal-700 rounded-xl text-white font-medium transition-colors">
        View All Predictions
      </button>
    </motion.div>
  );
};

// Fixtures Content Component
const FixturesContent = ({ fixtures, handlePrediction }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-4"
    >
      {fixtures && fixtures.length > 0 ? (
        fixtures.slice(0, 5).map((fixture, index) => (
          <motion.div
            key={fixture.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center justify-between p-4 bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-xl hover:border-slate-600/60 transition-all duration-300"
          >
            <div className="flex items-center gap-4">
              <div className="text-center">
                <div className="text-sm font-medium text-white mb-1">
                  {format(new Date(fixture.date), 'MMM d')}
                </div>
                <div className="text-xs text-slate-400">
                  {format(new Date(fixture.date), 'HH:mm')}
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <div className="text-sm font-medium text-white">{fixture.homeTeam}</div>
                </div>
                <div className="text-slate-400 text-sm">vs</div>
                <div className="text-left">
                  <div className="text-sm font-medium text-white">{fixture.awayTeam}</div>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              {fixture.status === 'pending' ? (
                <div className="flex items-center gap-2 text-amber-400">
                  <ClockIcon className="w-4 h-4" />
                  <span className="text-sm">Pending</span>
                </div>
              ) : (
                <div className="text-center">
                  <div className="text-lg font-bold text-white">
                    {fixture.homeScore} - {fixture.awayScore}
                  </div>
                  <div className="text-xs text-emerald-400">Final</div>
                </div>
              )}
              
              {fixture.status === 'pending' && (
                <button
                  onClick={() => handlePrediction(fixture.id)}
                  className="flex items-center gap-2 px-3 py-2 bg-teal-600/20 hover:bg-teal-600/30 border border-teal-500/30 rounded-lg text-teal-400 text-sm transition-all duration-200"
                >
                  <Pencil2Icon className="w-4 h-4" />
                  Predict
                </button>
              )}
            </div>
          </motion.div>
        ))
      ) : (
        <div className="text-center py-12">
          <CalendarIcon className="w-12 h-12 text-slate-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-white mb-2">No Fixtures</h3>
          <p className="text-slate-400">Check back later for upcoming matches!</p>
        </div>
      )}
    </motion.div>
  );
};

export default LeagueDetailView;