import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronDownIcon,
  ChevronUpIcon,
  ClockIcon,
  CheckIcon,
  CaretSortIcon,
  MixerHorizontalIcon
} from '@radix-ui/react-icons';
import { format, parseISO, isValid } from 'date-fns';

const LeaguePredictionsTab = ({ leagueId }) => {
  const [viewMode, setViewMode] = useState('latest'); // 'latest' or 'historical'
  const [expandedFixture, setExpandedFixture] = useState(null);
  const [sortOption, setSortOption] = useState('kickoff');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showScorers, setShowScorers] = useState(true);
  
  // Import InfoCircledIcon for information tooltips
  const InfoCircledIcon = React.forwardRef((props, forwardedRef) => {
    return (
      <svg
        width="15"
        height="15"
        viewBox="0 0 15 15"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
        ref={forwardedRef}
      >
        <path
          d="M7.5 1.75C4.32436 1.75 1.75 4.32436 1.75 7.5C1.75 10.6756 4.32436 13.25 7.5 13.25C10.6756 13.25 13.25 10.6756 13.25 7.5C13.25 4.32436 10.6756 1.75 7.5 1.75ZM7.5 0.75C11.2279 0.75 14.25 3.77208 14.25 7.5C14.25 11.2279 11.2279 14.25 7.5 14.25C3.77208 14.25 0.75 11.2279 0.75 7.5C0.75 3.77208 3.77208 0.75 7.5 0.75ZM7.5 6.5C7.91421 6.5 8.25 6.83579 8.25 7.25V10C8.25 10.4142 7.91421 10.75 7.5 10.75C7.08579 10.75 6.75 10.4142 6.75 10V7.25C6.75 6.83579 7.08579 6.5 7.5 6.5ZM7.5 5.5C7.08579 5.5 6.75 5.16421 6.75 4.75C6.75 4.33579 7.08579 4 7.5 4C7.91421 4 8.25 4.33579 8.25 4.75C8.25 5.16421 7.91421 5.5 7.5 5.5Z"
          fill="currentColor"
          fillRule="evenodd"
          clipRule="evenodd"
        ></path>
      </svg>
    );
  });
  
  // Mock data - would be fetched from API in production
  const memberPredictions = [
    {
      fixtureId: 1,
      fixture: "Arsenal vs Tottenham",
      competition: "Premier League",
      kickoff: "2025-05-25T15:00:00",
      status: "upcoming",
      deadline: "2025-05-25T14:00:00",
      predictions: [
        { 
          memberId: 1, 
          memberName: "Jane Smith", 
          prediction: {
            id: 101,
            matchId: 1,
            homeTeam: "Arsenal",
            awayTeam: "Tottenham",
            homeScore: 2,
            awayScore: 1,
            actualHomeScore: null,
            actualAwayScore: null,
            correct: null,
            points: null,
            date: "2025-05-25T15:00:00",
            gameweek: 36,
            homeScorers: ["Saka", "Gabriel"],
            awayScorers: ["Son"],
            actualHomeScorers: null,
            actualAwayScorers: null,
            status: "pending",
            chips: ["scorerFocus"]
          }, 
          timestamp: "2025-05-23T10:30:00" 
        },
        { 
          memberId: 2, 
          memberName: "John Doe", 
          prediction: {
            id: 102,
            matchId: 1,
            homeTeam: "Arsenal",
            awayTeam: "Tottenham",
            homeScore: 1,
            awayScore: 0,
            actualHomeScore: null,
            actualAwayScore: null,
            correct: null,
            points: null,
            date: "2025-05-25T15:00:00",
            gameweek: 36,
            homeScorers: ["Ødegaard"],
            awayScorers: [],
            actualHomeScorers: null,
            actualAwayScorers: null,
            status: "pending",
            chips: ["defensiveBoost"]
          }, 
          timestamp: "2025-05-22T14:20:00" 
        },
        { 
          memberId: 3, 
          memberName: "Current User", 
          isCurrentUser: true, 
          prediction: {
            id: 103,
            matchId: 1,
            homeTeam: "Arsenal",
            awayTeam: "Tottenham",
            homeScore: 3,
            awayScore: 1,
            actualHomeScore: null,
            actualAwayScore: null,
            correct: null,
            points: null,
            date: "2025-05-25T15:00:00",
            gameweek: 36,
            homeScorers: ["Saka", "Martinelli", "Havertz"],
            awayScorers: ["Maddison"],
            actualHomeScorers: null,
            actualAwayScorers: null,
            status: "pending",
            chips: ["wildcard", "scorerFocus"]
          }, 
          timestamp: "2025-05-24T09:15:00" 
        }
      ]
    },
    {
      fixtureId: 2,
      fixture: "Liverpool vs Man City",
      competition: "Premier League",
      kickoff: "2025-05-25T17:30:00",
      status: "upcoming",
      deadline: "2025-05-25T16:30:00",
      predictions: [
        { 
          memberId: 1, 
          memberName: "Jane Smith", 
          prediction: {
            id: 104,
            matchId: 2,
            homeTeam: "Liverpool",
            awayTeam: "Man City",
            homeScore: 1,
            awayScore: 2,
            actualHomeScore: null,
            actualAwayScore: null,
            correct: null,
            points: null,
            date: "2025-05-25T17:30:00",
            gameweek: 36,
            homeScorers: ["Salah"],
            awayScorers: ["Haaland", "De Bruyne"],
            actualHomeScorers: null,
            actualAwayScorers: null,
            status: "pending",
            chips: []
          }, 
          timestamp: "2025-05-23T11:20:00" 
        },
        { 
          memberId: 3, 
          memberName: "Current User", 
          isCurrentUser: true, 
          prediction: null, 
          timestamp: null 
        }
      ]
    },
    {
      fixtureId: 3,
      fixture: "Chelsea vs Man United",
      competition: "Premier League",
      kickoff: "2025-05-23T20:00:00",
      status: "in-progress",
      currentScore: "1-0",
      deadline: "2025-05-23T19:00:00",
      predictions: [
        { 
          memberId: 1, 
          memberName: "Jane Smith", 
          prediction: {
            id: 105,
            matchId: 3,
            homeTeam: "Chelsea",
            awayTeam: "Man United",
            homeScore: 2,
            awayScore: 0,
            actualHomeScore: 1,
            actualAwayScore: 0,
            correct: null,
            points: null,
            date: "2025-05-23T20:00:00",
            gameweek: 36,
            homeScorers: ["Palmer", "Jackson"],
            awayScorers: [],
            actualHomeScorers: ["Palmer"],
            actualAwayScorers: null,
            status: "in-progress",
            chips: ["homeAdvantage"]
          }, 
          timestamp: "2025-05-22T10:30:00" 
        },
        { 
          memberId: 3, 
          memberName: "Current User", 
          isCurrentUser: true, 
          prediction: {
            id: 106,
            matchId: 3,
            homeTeam: "Chelsea",
            awayTeam: "Man United",
            homeScore: 1,
            awayScore: 1,
            actualHomeScore: 1,
            actualAwayScore: 0,
            correct: null,
            points: null,
            date: "2025-05-23T20:00:00",
            gameweek: 36,
            homeScorers: ["Palmer"],
            awayScorers: ["Rashford"],
            actualHomeScorers: ["Palmer"],
            actualAwayScorers: null,
            status: "in-progress",
            chips: ["drawSpecialist"]
          }, 
          timestamp: "2025-05-22T09:15:00" 
        }
      ]
    },
    {
      fixtureId: 4,
      fixture: "Newcastle vs Aston Villa",
      competition: "Premier League",
      kickoff: "2025-05-20T15:00:00",
      status: "completed",
      finalScore: "3-0",
      deadline: "2025-05-20T14:00:00",
      predictions: [
        { 
          memberId: 1, 
          memberName: "Jane Smith", 
          prediction: {
            id: 107,
            matchId: 4,
            homeTeam: "Newcastle",
            awayTeam: "Aston Villa",
            homeScore: 2,
            awayScore: 0,
            actualHomeScore: 3,
            actualAwayScore: 0,
            correct: "partial",
            points: 7,
            date: "2025-05-20T15:00:00",
            gameweek: 35,
            homeScorers: ["Isak", "Almirón"],
            awayScorers: [],
            actualHomeScorers: ["Isak", "Gordon", "Joelinton"],
            actualAwayScorers: [],
            status: "completed",
            chips: ["cleanSheet"]
          },
          timestamp: "2025-05-19T10:30:00" 
        },
        { 
          memberId: 3, 
          memberName: "Current User", 
          isCurrentUser: true, 
          prediction: {
            id: 108,
            matchId: 4,
            homeTeam: "Newcastle",
            awayTeam: "Aston Villa",
            homeScore: 2,
            awayScore: 0,
            actualHomeScore: 3,
            actualAwayScore: 0,
            correct: "partial",
            points: 7,
            date: "2025-05-20T15:00:00",
            gameweek: 35,
            homeScorers: ["Isak", "Tonali"],
            awayScorers: [],
            actualHomeScorers: ["Isak", "Gordon", "Joelinton"],
            actualAwayScorers: [],
            status: "completed",
            chips: ["scorerFocus", "cleanSheet"]
          }, 
          timestamp: "2025-05-19T09:15:00" 
        }
      ]
    }
  ];

  // Helper function for chip tooltips
  const getChipDescription = (chipName) => {
    const descriptions = {
      "wildcard": "Player predictions count double",
      "scorerFocus": "Extra points for correct goalscorer predictions",
      "cleanSheet": "Bonus points if predicted team keeps a clean sheet",
      "defensiveBoost": "Extra points for low scoring predictions that are correct",
      "homeAdvantage": "Extra points for predicting home team win",
      "drawSpecialist": "Extra points if the match ends in a draw"
    };
    return descriptions[chipName] || "Special points modifier";
  };

  // Filter and sort fixtures
  const getFilteredFixtures = () => {
    let fixtures = [...memberPredictions];
    
    // Apply filters
    if (filterStatus !== 'all') {
      fixtures = fixtures.filter(f => f.status === filterStatus);
    }
    
    // Apply sorting
    if (sortOption === 'kickoff') {
      fixtures.sort((a, b) => new Date(a.kickoff) - new Date(b.kickoff));
    } else if (sortOption === 'deadline') {
      fixtures.sort((a, b) => new Date(a.deadline) - new Date(b.deadline));
    }
    
    return fixtures;
  };

  const filteredFixtures = getFilteredFixtures();
  
  // Get status badge styling
  const getFixtureStatusBadge = (status, currentScore = null, finalScore = null) => {
    switch(status) {
      case 'upcoming':
        return (
          <span className="bg-slate-700/50 text-white/70 text-xs px-2 py-0.5 rounded-full">
            Upcoming
          </span>
        );
      case 'in-progress':
        return (
          <span className="bg-indigo-900/40 text-indigo-300 text-xs px-2 py-0.5 rounded-full animate-pulse flex items-center">
            <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full mr-1"></span>
            Live: {currentScore}
          </span>
        );
      case 'completed':
        return (
          <span className="bg-teal-900/40 text-teal-300 text-xs px-2 py-0.5 rounded-full">
            Final: {finalScore}
          </span>
        );
      default:
        return null;
    }
  };
  
  // Format date helper (reusing from parent)
  const formatDate = (dateString, formatStr) => {
    try {
      const date = parseISO(dateString);
      if (!isValid(date)) return 'N/A';
      return format(date, formatStr);
    } catch {
      return 'N/A';
    }
  };
  
  // Get points badge styling
  const getPointsBadge = (points) => {
    if (points >= 10) return "bg-green-900/40 text-green-300";
    if (points > 5) return "bg-teal-900/40 text-teal-300";
    if (points > 0) return "bg-amber-900/40 text-amber-300";
    return "bg-red-900/40 text-red-300";
  };
  
  // Get timestamp for prediction
  const getPredictionTime = (timestamp) => {
    if (!timestamp) return null;
    return formatDate(timestamp, 'MMM d, h:mm a');
  };
    // Get chip badge styling
  const getChipBadge = (chipName) => {
    const chipStyles = {
      "wildcard": "bg-purple-900/40 text-purple-300 border-purple-700/40",
      "scorerFocus": "bg-cyan-900/40 text-cyan-300 border-cyan-700/40",
      "cleanSheet": "bg-emerald-900/40 text-emerald-300 border-emerald-700/40",
      "defensiveBoost": "bg-blue-900/40 text-blue-300 border-blue-700/40",
      "homeAdvantage": "bg-amber-900/40 text-amber-300 border-amber-700/40",
      "drawSpecialist": "bg-orange-900/40 text-orange-300 border-orange-700/40"
    };
    
    return chipStyles[chipName] || "bg-gray-900/40 text-gray-300 border-gray-700/40";
  };
  
  // Generate chip icons for display
  const ChipBadge = ({ chipName }) => {
    return (
      <div className="group relative inline-block">
        <div className={`px-2 py-0.5 rounded text-xs border ${getChipBadge(chipName)}`}>
          {chipName.charAt(0).toUpperCase() + chipName.slice(1).replace(/([A-Z])/g, ' $1')}
        </div>
        <div className="absolute bottom-full left-0 mb-1 w-48 p-2 bg-slate-800 rounded shadow-lg z-10 text-xs text-white hidden group-hover:block">
          {getChipDescription(chipName)}
        </div>
      </div>
    );
  };
  
  // Show scorer details
  const ScorersList = ({ scorers, actual = false, predicted = false }) => {
    if (!scorers || scorers.length === 0) {
      return <span className="text-white/40 text-xs">None</span>;
    }
    
    return (
      <div className="flex flex-wrap gap-1 mt-1">
        {scorers.map((scorer, idx) => (
          <span 
            key={idx} 
            className={`
              text-xs px-1.5 py-0.5 rounded-sm inline-flex items-center
              ${actual && predicted && "bg-green-900/30 text-green-300"}
              ${!actual && !predicted && "bg-slate-700/40 text-white/70"}
            `}
          >
            {scorer}
          </span>
        ))}
      </div>
    );
  };
  
  return (
    <motion.div
      key="predictions"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="mb-8"
    >
      <div className="flex flex-wrap justify-between items-center mb-4 gap-3">
        <h2 className="text-teal-100 text-2xl font-outfit">League Predictions</h2>
        
        <div className="flex flex-wrap items-center gap-2">
          {/* View mode selector */}
          <div className="bg-slate-800/60 border border-slate-700/40 rounded-md p-0.5 flex">
            <button 
              className={`px-3 py-1.5 rounded text-sm transition-colors ${
                viewMode === 'latest' 
                  ? 'bg-indigo-900/60 text-indigo-200' 
                  : 'text-white/60 hover:text-white/80'
              }`}
              onClick={() => setViewMode('latest')}
            >
              Latest
            </button>
            <button 
              className={`px-3 py-1.5 rounded text-sm transition-colors ${
                viewMode === 'historical' 
                  ? 'bg-indigo-900/60 text-indigo-200' 
                  : 'text-white/60 hover:text-white/80'
              }`}
              onClick={() => setViewMode('historical')}
            >
              Historical
            </button>
          </div>
          
          {/* Scorers toggle */}
          <label className="flex items-center cursor-pointer">
            <div className="relative">
              <input 
                type="checkbox" 
                checked={showScorers} 
                onChange={() => setShowScorers(!showScorers)}
                className="sr-only" 
              />
              <div className="block bg-slate-700/40 w-10 h-5 rounded-full"></div>
              <div className={`dot absolute left-1 top-1 bg-white w-3 h-3 rounded-full transition-transform ${
                showScorers ? 'transform translate-x-5' : ''
              }`}></div>
            </div>
            <div className="ml-2 text-white/70 text-xs">Show Scorers</div>
          </label>
          
          {/* Filter button */}
          <div className="relative inline-block">
            <select 
              value={filterStatus}
              onChange={e => setFilterStatus(e.target.value)}
              className="appearance-none bg-slate-700/40 hover:bg-slate-700/60 border border-slate-600/30 rounded-md py-1.5 px-3 pr-8 text-sm text-white/70 hover:text-white transition-colors cursor-pointer"
            >
              <option value="all">All Fixtures</option>
              <option value="upcoming">Upcoming</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-white/70">
              <ChevronDownIcon className="w-4 h-4" />
            </div>
          </div>
          
          {/* Sort button */}
          <div className="relative inline-block">
            <select 
              value={sortOption}
              onChange={e => setSortOption(e.target.value)}
              className="appearance-none bg-slate-700/40 hover:bg-slate-700/60 border border-slate-600/30 rounded-md py-1.5 px-3 pr-8 text-sm text-white/70 hover:text-white transition-colors cursor-pointer"
            >
              <option value="kickoff">Sort by Kickoff</option>
              <option value="deadline">Sort by Deadline</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-white/70">
              <ChevronDownIcon className="w-4 h-4" />
            </div>
          </div>
        </div>
      </div>
      
      {filteredFixtures.length === 0 ? (
        <div className="bg-slate-800/30 border border-slate-700/40 rounded-lg p-8 text-center">
          <div className="text-white/50 mb-2">No fixtures available based on your filters</div>
          <button 
            onClick={() => {
              setFilterStatus('all');
              setSortOption('kickoff');
            }}
            className="text-indigo-400 hover:text-indigo-300 text-sm"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="space-y-5">
          {filteredFixtures.map((fixtureData) => (
            <motion.div 
              key={fixtureData.fixtureId}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={fixtureData.status !== 'completed' ? { y: -2 } : {}}
              className={`
                bg-slate-800/30 border rounded-lg overflow-hidden
                ${fixtureData.status === 'in-progress' 
                  ? 'border-indigo-600/30' 
                  : fixtureData.status === 'completed' 
                    ? 'border-slate-700/40' 
                    : 'border-slate-700/30'}
              `}
            >
              {/* Fixture header */}
              <div 
                className="p-4 border-b border-slate-700/30 cursor-pointer"
                onClick={() => setExpandedFixture(expandedFixture === fixtureData.fixtureId ? null : fixtureData.fixtureId)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-1.5">
                      {/* Status badge */}
                      {getFixtureStatusBadge(fixtureData.status, fixtureData.currentScore, fixtureData.finalScore)}
                      
                      {/* Competition badge */}
                      <span className="bg-slate-700/50 text-white/70 text-xs px-2 py-0.5 rounded">
                        {fixtureData.competition}
                      </span>

                      {/* Gameweek info - this assumes your first prediction has gameweek info */}
                      {fixtureData.predictions[0]?.prediction?.gameweek && (
                        <span className="bg-indigo-900/30 text-indigo-300 text-xs px-2 py-0.5 rounded">
                          GW {fixtureData.predictions[0].prediction.gameweek}
                        </span>
                      )}
                      
                      {/* Date/time info */}
                      <span className="text-white/50 text-xs">
                        {formatDate(fixtureData.kickoff, 'EEE, MMM d • h:mm a')}
                      </span>
                    </div>
                    
                    <div className="text-white font-medium text-lg">{fixtureData.fixture}</div>
                  </div>
                  
                  <div className="flex items-center">
                    {/* Number of predictions made */}
                    <div className="bg-slate-700/40 text-white/70 text-xs px-2 py-1 rounded-md flex items-center mr-3">
                      <span>{fixtureData.predictions.filter(p => p.prediction).length}/{fixtureData.predictions.length}</span>
                      <span className="ml-1">predictions</span>
                    </div>
                    
                    {/* Expand/collapse indicator */}
                    <motion.div 
                      animate={{ rotate: expandedFixture === fixtureData.fixtureId ? 180 : 0 }}
                      className="text-white/60"
                    >
                      <ChevronDownIcon className="h-5 w-5" />
                    </motion.div>
                  </div>
                </div>
                
                {/* Deadline info */}
                <div className="mt-2 flex items-center">
                  <ClockIcon className="w-3.5 h-3.5 text-white/50 mr-1.5" />
                  <span className="text-white/50 text-xs">
                    Prediction deadline: {formatDate(fixtureData.deadline, 'EEE, MMM d, h:mm a')}
                  </span>
                </div>
              </div>
              
              {/* Expanded prediction details */}
              <AnimatePresence>
                {expandedFixture === fixtureData.fixtureId && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="p-4 pt-0">
                      {/* Predictions table */}
                      <div className="mt-4 overflow-x-auto">
                        <table className="w-full">
                          <thead>
                            <tr className="text-left border-b border-slate-700/30">
                              <th className="py-2 pb-3 text-white/60 text-xs font-medium">Member</th>
                              <th className="py-2 pb-3 text-white/60 text-xs font-medium">Prediction</th>
                              {fixtureData.status === 'completed' && (
                                <th className="py-2 pb-3 text-white/60 text-xs font-medium text-center">Points</th>
                              )}
                              <th className="py-2 pb-3 text-white/60 text-xs font-medium">Chips</th>
                              <th className="py-2 pb-3 text-white/60 text-xs font-medium text-right">Predicted On</th>
                            </tr>
                          </thead>
                          <tbody>
                            {fixtureData.predictions.map((prediction) => (
                              <tr 
                                key={prediction.memberId}
                                className={`${prediction.isCurrentUser ? 'bg-indigo-900/10' : ''} border-b border-slate-700/10 last:border-b-0`}
                              >
                                {/* Member column */}
                                <td className="py-3 pr-4">
                                  <div className="flex items-center">
                                    <div className="w-7 h-7 rounded-full bg-slate-700/50 flex items-center justify-center mr-2 text-white/80 text-xs">
                                      {prediction.memberName.charAt(0)}
                                    </div>
                                    <span className={`${prediction.isCurrentUser ? 'text-indigo-300' : 'text-white/80'}`}>
                                      {prediction.isCurrentUser ? 'You' : prediction.memberName}
                                    </span>
                                  </div>
                                </td>
                                
                                {/* Prediction display - showing score and maybe scorers */}
                                <td className="py-3 pr-4 w-[200px]">
                                  {(fixtureData.status !== 'upcoming' || prediction.isCurrentUser) ? (
                                    prediction.prediction ? (
                                      <div>
                                        {/* Score prediction */}
                                        <div className="flex items-center">
                                          <span className="inline-block px-3 py-1 bg-slate-700/40 font-mono text-white font-medium rounded">
                                            {prediction.prediction.homeScore} - {prediction.prediction.awayScore}
                                          </span>
                                          
                                          {/* Correctness indicator */}
                                          {prediction.prediction.correct === "exact" && (
                                            <span className="text-green-400 ml-2 flex items-center">
                                              <CheckIcon className="w-4 h-4 mr-1" />
                                              Exact
                                            </span>
                                          )}
                                          {prediction.prediction.correct === "partial" && (
                                            <span className="text-amber-400 ml-2 text-sm">
                                              Partial
                                            </span>
                                          )}
                                        </div>
                                        
                                        {/* Scorers section */}
                                        {showScorers && (
                                          <div className="mt-2">
                                            <div className="flex flex-col gap-2 text-xs">
                                              {/* Home scorers */}
                                              <div>
                                                <span className="text-white/50">
                                                  {prediction.prediction.homeTeam} scorers:
                                                </span>
                                                <ScorersList 
                                                  scorers={prediction.prediction.homeScorers} 
                                                  actual={prediction.prediction.status === "completed" && 
                                                    prediction.prediction.actualHomeScorers?.some(
                                                      scorer => prediction.prediction.homeScorers.includes(scorer)
                                                    )}
                                                />
                                              </div>
                                              
                                              {/* Away scorers */}
                                              <div>
                                                <span className="text-white/50">
                                                  {prediction.prediction.awayTeam} scorers:
                                                </span>
                                                <ScorersList 
                                                  scorers={prediction.prediction.awayScorers}
                                                  actual={prediction.prediction.status === "completed" && 
                                                    prediction.prediction.actualAwayScorers?.some(
                                                      scorer => prediction.prediction.awayScorers.includes(scorer)
                                                    )}
                                                />
                                              </div>
                                            </div>
                                          </div>
                                        )}
                                      </div>
                                    ) : (
                                      <span className="text-white/40">Not predicted</span>
                                    )
                                  ) : (
                                    <span className="text-white/40">Hidden until kickoff</span>
                                  )}
                                </td>
                                
                                {/* Points column for completed fixtures */}
                                {fixtureData.status === 'completed' && (
                                  <td className="py-3 text-center w-[80px]">
                                    {prediction.prediction ? (
                                      <span className={`inline-block px-2.5 py-0.5 rounded ${getPointsBadge(prediction.prediction.points)}`}>
                                        {prediction.prediction.points || 0}
                                      </span>
                                    ) : (
                                      <span className="text-white/30">-</span>
                                    )}
                                  </td>
                                )}
                                
                                {/* Chips column */}
                                <td className="py-3 pr-4">
                                  {prediction.prediction?.chips?.length > 0 ? (
                                    <div className="flex flex-wrap gap-1">
                                      {prediction.prediction.chips.map((chip, idx) => (
                                        <ChipBadge key={idx} chipName={chip} />
                                      ))}
                                    </div>
                                  ) : (
                                    <span className="text-white/30">None</span>
                                  )}
                                </td>
                                
                                {/* Timestamp column */}
                                <td className="py-3 text-white/50 text-xs text-right">
                                  {prediction.timestamp 
                                    ? getPredictionTime(prediction.timestamp)
                                    : <span className="text-white/30">-</span>
                                  }
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      
                      {/* Final result for completed matches */}
                      {fixtureData.status === 'completed' && (
                        <div className="mt-4 bg-slate-700/20 rounded p-3">
                          <div className="text-white/70 font-medium mb-2">Final Result</div>
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="text-lg font-mono text-white">
                                {fixtureData.predictions[0]?.prediction?.actualHomeScore}-{fixtureData.predictions[0]?.prediction?.actualAwayScore}
                              </div>
                              
                              {/* Show actual scorers if we have them */}
                              {showScorers && fixtureData.predictions[0]?.prediction?.actualHomeScorers && (
                                <div className="mt-2 grid grid-cols-2 gap-4">
                                  <div>
                                    <div className="text-white/50 text-xs">
                                      {fixtureData.predictions[0].prediction.homeTeam} scorers:
                                    </div>
                                    <ScorersList scorers={fixtureData.predictions[0].prediction.actualHomeScorers} />
                                  </div>
                                  <div>
                                    <div className="text-white/50 text-xs">
                                      {fixtureData.predictions[0].prediction.awayTeam} scorers:
                                    </div>
                                    <ScorersList scorers={fixtureData.predictions[0].prediction.actualAwayScorers || []} />
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                      
                      {/* Rules reminder for upcoming matches */}
                      {fixtureData.status === 'upcoming' && (
                        <div className="flex items-center bg-slate-700/20 text-white/60 text-xs rounded p-2 mt-4">
                          <InfoCircledIcon className="w-3.5 h-3.5 mr-2 flex-shrink-0" />
                          <span>
                            Other members' predictions will be visible after kickoff. Make your prediction before the deadline to participate.
                          </span>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      )}
      
      {/* View more button */}
      {filteredFixtures.length > 3 && viewMode === 'latest' && (
        <div className="text-center mt-6">
          <button 
            className="bg-slate-700/40 hover:bg-slate-700/60 border border-slate-600/30 rounded-md py-2 px-4 text-sm text-white/70 hover:text-white transition-colors"
            onClick={() => setViewMode('historical')}
          >
            View All Fixtures
          </button>
        </div>
      )}
    </motion.div>
  );
};

export default LeaguePredictionsTab;