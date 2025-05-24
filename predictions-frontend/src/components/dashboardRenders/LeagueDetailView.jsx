import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import BackButton from '../ui/BackButton';
import ActionsMenu from '../ui/ActionsMenu';
import LeagueHeader from '../leagues/LeagueHeader';
import LeagueStats from '../leagues/LeagueStats';
import TabNavigation from '../ui/TabNavigation';
import LeaderboardTab from '../leagues/LeaderboardTab';
import FixturesTab from '../leagues/FixturesTab';
import LeaguePredictionsTab from '../leagues/LeaguePredictionsTab';

import { getSampleLeague, upcomingFixtures } from '../../data/sampleData';

const LeagueDetailView = ({ leagueId, onBack, onManage }) => {
  const [activeTab, setActiveTab] = useState('leaderboard');
  const [isActionsOpen, setIsActionsOpen] = useState(false);
  
  // Get league data using the imported function
  const league = getSampleLeague(leagueId);
  
  // Handle making or editing a prediction
  const handlePrediction = (fixtureId) => {
    // This would open a prediction modal or form in a real app
    console.log(`Make prediction for fixture ${fixtureId}`);
  };
  
  const toggleActionsMenu = () => {
    setIsActionsOpen(!isActionsOpen);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Back button and top actions */}
      <div className="flex justify-between items-center mb-6">
        <BackButton onClick={onBack} text="Back to Leagues" />
        <ActionsMenu 
          isOpen={isActionsOpen} 
          toggleOpen={toggleActionsMenu} 
          isAdmin={league.isAdmin} 
          onManage={onManage} 
        />
      </div>
      
      {/* League header section */}
      <LeagueHeader league={league} onManage={onManage} />
      
      {/* League stats section */}
      <LeagueStats league={league} />
      
      {/* Tabs navigation */}
      <TabNavigation 
        tabs={['leaderboard', 'predictions', 'fixtures']} 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
      />
      
      {/* Tab content with animations */}
      <AnimatePresence mode="wait">
        {activeTab === 'leaderboard' && (
          <LeaderboardTab leaderboard={league.leaderboard} />
        )}
        
        {activeTab === 'predictions' && (
          <LeaguePredictionsTab leagueId={leagueId} />
        )}
        
        {activeTab === 'fixtures' && (
          <FixturesTab fixtures={upcomingFixtures} handlePrediction={handlePrediction} />
        )}
      </AnimatePresence>

      {/* League ID for development purposes - styled better */}
      <div className="text-center text-white/30 text-xs mt-8 bg-slate-800/20 py-2 rounded-md border border-slate-700/20">
        League ID: {leagueId}
      </div>
    </motion.div>
  );
};

export default LeagueDetailView;