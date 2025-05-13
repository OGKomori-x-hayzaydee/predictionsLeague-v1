import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  PlusCircledIcon, 
  MagnifyingGlassIcon, 
  RocketIcon,
  GlobeIcon,
  LockClosedIcon,
  CaretSortIcon,
  CheckIcon,
  Cross2Icon,
  PersonIcon,
  EnterIcon,
  InfoCircledIcon,
  MixerHorizontalIcon
} from "@radix-ui/react-icons";

const LeaguesView = () => {
  const [activeTab, setActiveTab] = useState("my-leagues");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
  
  // Placeholder league data
  const myLeagues = [
    {
      id: 1,
      name: "Global Premier League Predictions",
      type: "public",
      members: 10843,
      position: 567,
      rank: "Silver II",
      points: 345,
      pointsLeader: 521,
      isAdmin: false,
      description: "Official global league for all Premier League prediction enthusiasts."
    },
    {
      id: 2,
      name: "Friends & Family",
      type: "private",
      members: 12,
      position: 3,
      rank: "Gold",
      points: 453,
      pointsLeader: 478,
      isAdmin: true,
      description: "Our private prediction league for bragging rights at family gatherings!"
    },
    {
      id: 3,
      name: "Office Rivalry",
      type: "private",
      members: 8,
      position: 1,
      rank: "Leader",
      points: 482,
      pointsLeader: 482,
      isAdmin: true,
      description: "Settle workplace debates through the beautiful game."
    },
    {
      id: 4,
      name: "Reddit r/PremierLeague",
      type: "public",
      members: 5432,
      position: 78,
      rank: "Platinum",
      points: 471,
      pointsLeader: 543,
      isAdmin: false,
      description: "The official prediction league for the Premier League subreddit."
    }
  ];
  
  const featuredLeagues = [
    {
      id: 101,
      name: "Official NBC Sports League",
      type: "public",
      members: 24567,
      pointsToQualify: null,
      description: "NBC Sports official prediction challenge with weekly prizes!",
      sponsor: "NBC Sports",
      hasAwards: true
    },
    {
      id: 102,
      name: "Sky Sports Super 6",
      type: "public",
      members: 31245,
      pointsToQualify: null,
      description: "Predict six matches each week with a chance to win £250,000.",
      sponsor: "Sky Sports",
      hasAwards: true
    },
    {
      id: 103,
      name: "Premier League Legends",
      type: "public",
      members: 8762,
      pointsToQualify: 1200,
      description: "Elite league for the top 10% of predictors from previous season.",
      sponsor: null,
      hasAwards: true
    },
    {
      id: 104,
      name: "FPL Integration Challenge",
      type: "public",
      members: 15328,
      pointsToQualify: null,
      description: "Link your FPL team and earn bonus points based on your squad performance.",
      sponsor: "Fantasy Premier League",
      hasAwards: false
    }
  ];
  
  return (
    <>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-teal-100 text-3xl font-bold font-dmSerif">
            My Leagues
          </h1>
          <p className="text-white/70 font-outfit">
            View your leagues, rankings, and join new competitions
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowJoinModal(true)}
            className="px-3 py-1.5 bg-slate-700/60 hover:bg-slate-700/80 border border-slate-500/30 rounded-md transition-colors flex items-center text-white/90 text-sm"
          >
            <EnterIcon className="mr-1.5 w-3.5 h-3.5" />
            Join League
          </button>
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 rounded-md transition-colors flex items-center text-white text-sm font-medium"
          >
            <PlusCircledIcon className="mr-1.5 w-3.5 h-3.5" />
            Create League
          </button>
        </div>
      </div>
      
      {/* Tab Navigation */}
      <div className="border-b border-slate-600/30 mb-5">
        <div className="flex font-outfit">
          <button
            onClick={() => setActiveTab("my-leagues")}
            className={`py-2 px-4 relative ${
              activeTab === "my-leagues" 
                ? "text-teal-200" 
                : "text-white/60 hover:text-white/80"
            }`}
          >
            My Leagues
            {activeTab === "my-leagues" && (
              <motion.div 
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-teal-500"
                layoutId="tabIndicator"
              />
            )}
          </button>
          <button
            onClick={() => setActiveTab("discover")}
            className={`py-2 px-4 relative ${
              activeTab === "discover" 
                ? "text-teal-200" 
                : "text-white/60 hover:text-white/80"
            }`}
          >
            Discover
            {activeTab === "discover" && (
              <motion.div 
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-teal-500"
                layoutId="tabIndicator"
              />
            )}
          </button>
        </div>
      </div>
      
      <AnimatePresence mode="wait">
        {activeTab === "my-leagues" ? (
          <motion.div
            key="my-leagues"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="grid grid-cols-1 gap-4">
              {myLeagues.map(league => (
                <div
                  key={league.id}
                  className="bg-gradient-to-r from-slate-700/40 to-slate-700/20 backdrop-blur-md rounded-lg border border-slate-500/20 overflow-hidden font-outfit"
                >
                  <div className="flex flex-col md:flex-row">
                    {/* League info section */}
                    <div className="flex-1 p-4">
                      <div className="flex items-start">
                        <div className="flex-1">
                          <div className="flex items-center">
                            <h3 className="text-teal-100 text-2xl font-dmSerif">{league.name}</h3>
                            {league.isAdmin && (
                              <span className="ml-2 bg-amber-900/50 text-amber-300 text-[10px] px-1.5 py-0.5 rounded-full">
                                Admin
                              </span>
                            )}
                            <div className="ml-auto md:hidden">
                              <div className={`flex items-center rounded-full px-2 py-0.5 text-xs ${
                                league.type === 'public' 
                                  ? 'bg-slate-600/30 text-slate-300' 
                                  : 'bg-indigo-900/30 text-indigo-300'
                              }`}>
                                {league.type === 'public' ? (
                                  <GlobeIcon className="w-3 h-3 mr-1" />
                                ) : (
                                  <LockClosedIcon className="w-3 h-3 mr-1" />
                                )}
                                {league.type === 'public' ? 'Public' : 'Private'}
                              </div>
                            </div>
                          </div>
                          <p className="text-white/50 text-sm mt-1">{league.description}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center mt-3 text-sm">
                        <div className="flex items-center text-white/70">
                          <PersonIcon className="w-3.5 h-3.5 mr-1" />
                          <span>{league.members.toLocaleString()} members</span>
                        </div>
                        <div className="w-1 h-1 bg-white/20 rounded-full mx-3"></div>
                        <div className={`text-white/70`}>
                          <span className="text-white/50 mr-1">Points:</span>
                          <span>{league.points}</span>
                        </div>
                        <div className="w-1 h-1 bg-white/20 rounded-full mx-3"></div>
                        <div className={`text-white/70`}>
                          <span className="text-white/50 mr-1">Leader:</span>
                          <span>{league.pointsLeader}</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* League stats section */}
                    <div className="bg-slate-800/40 border-t md:border-t-0 md:border-l border-slate-600/30 p-4 flex md:flex-col justify-between">
                      <div className="hidden md:flex items-center justify-center mb-2">
                        <div className={`flex items-center rounded-full px-2 py-0.5 text-xs ${
                          league.type === 'public' 
                            ? 'bg-slate-600/30 text-slate-300' 
                            : 'bg-indigo-900/30 text-indigo-300'
                        }`}>
                          {league.type === 'public' ? (
                            <GlobeIcon className="w-3 h-3 mr-1" />
                          ) : (
                            <LockClosedIcon className="w-3 h-3 mr-1" />
                          )}
                          {league.type === 'public' ? 'Public' : 'Private'}
                        </div>
                      </div>
                      
                      <div className="text-center">
                        <div className="text-xs text-white/50">POSITION</div>
                        <div className={`text-2xl font-medium ${
                          league.position === 1 
                            ? 'text-amber-300' 
                            : league.position <= 3 
                              ? 'text-teal-300' 
                              : 'text-white'
                        }`}>
                          {league.position.toLocaleString()}
                          <span className="text-xs text-white/30">/{league.members.toLocaleString()}</span>
                        </div>
                      </div>
                      
                      <div className="text-center">
                        <div className="text-xs text-white/50">RANK</div>
                        <div className="text-lg font-medium text-teal-300">
                          {league.rank}
                        </div>
                      </div>
                      
                      <div className="md:mt-4">
                        <button className="w-full mt-2 px-3 py-1.5 bg-slate-700/60 hover:bg-slate-700/80 border border-slate-500/30 rounded-md transition-colors flex items-center justify-center text-white/90 text-xs">
                          View League
                        </button>
                        {league.isAdmin && (
                          <button className="w-full mt-2 px-3 py-1.5 bg-indigo-900/40 hover:bg-indigo-900/60 border border-indigo-500/20 rounded-md transition-colors flex items-center justify-center text-indigo-300 hover:text-indigo-200 text-xs">
                            <MixerHorizontalIcon className="mr-1" />
                            Manage
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="discover"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {/* Search and filter */}
            <div className="flex flex-col md:flex-row gap-3 mb-5">
              <div className="relative flex-1">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40 w-4 h-4" />
                <input 
                  type="text"
                  placeholder="Search for leagues..."
                  className="w-full bg-slate-700/30 border border-slate-600/30 rounded-md py-2 pl-10 pr-4 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-teal-500/50"
                />
              </div>
              
              <div className="flex gap-2">
                <button className="px-4 py-2 bg-slate-700/40 hover:bg-slate-700/60 border border-slate-600/30 rounded-md flex items-center text-white/80 text-sm">
                  <CaretSortIcon className="mr-1.5 w-4 h-4" />
                  Sort
                </button>
                <button className="px-4 py-2 bg-slate-700/40 hover:bg-slate-700/60 border border-slate-600/30 rounded-md flex items-center text-white/80 text-sm">
                  Filter
                </button>
              </div>
            </div>
            
            {/* Featured Leagues */}
            <div className="mb-8">
              <h2 className="text-teal-100 text-2xl font-dmSerif mb-3">Featured Leagues</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {featuredLeagues.map(league => (
                  <div
                    key={league.id}
                    className="bg-slate-700/30 backdrop-blur-md rounded-lg border border-slate-500/20 overflow-hidden hover:border-slate-400/30 transition-colors"
                  >
                    <div className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <div className="flex items-center">
                            <h3 className="text-teal-100 font-dmSerif">{league.name}</h3>
                            {league.sponsor && (
                              <span className="ml-2 bg-slate-800/50 text-white/70 text-[10px] px-1.5 py-0.5 rounded">
                                {league.sponsor}
                              </span>
                            )}
                          </div>
                          <p className="text-white/50 text-xs mt-1">{league.description}</p>
                        </div>
                        <div className={`flex items-center rounded-full px-2 py-0.5 text-xs ${
                          league.type === 'public' 
                            ? 'bg-slate-600/30 text-slate-300' 
                            : 'bg-indigo-900/30 text-indigo-300'
                        }`}>
                          {league.type === 'public' ? (
                            <GlobeIcon className="w-3 h-3 mr-1" />
                          ) : (
                            <LockClosedIcon className="w-3 h-3 mr-1" />
                          )}
                          {league.type === 'public' ? 'Public' : 'Private'}
                        </div>
                      </div>
                      
                      <div className="flex items-center mt-3 text-xs">
                        <div className="flex items-center text-white/70">
                          <PersonIcon className="w-3.5 h-3.5 mr-1" />
                          <span>{league.members.toLocaleString()} members</span>
                        </div>
                        {league.pointsToQualify && (
                          <>
                            <div className="w-1 h-1 bg-white/20 rounded-full mx-3"></div>
                            <div className="text-amber-300/90 flex items-center">
                              <RocketIcon className="w-3 h-3 mr-1" />
                              <span>{league.pointsToQualify} pts to qualify</span>
                            </div>
                          </>
                        )}
                        {league.hasAwards && (
                          <>
                            <div className="w-1 h-1 bg-white/20 rounded-full mx-3"></div>
                            <div className="text-amber-300/90">
                              🏆 Weekly prizes
                            </div>
                          </>
                        )}
                      </div>
                      
                      <div className="mt-4">
                        <button className="w-full px-3 py-1.5 bg-indigo-600/80 hover:bg-indigo-700 rounded transition-colors text-white text-sm flex items-center justify-center">
                          <EnterIcon className="mr-1.5 w-3.5 h-3.5" />
                          Join League
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Public vs Private Leagues Explainer */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
              <div className="bg-gradient-to-br from-slate-700/40 to-slate-700/20 rounded-lg border border-slate-600/30 p-4">
                <div className="flex items-center mb-3">
                  <div className="w-8 h-8 rounded-full bg-slate-600/40 flex items-center justify-center text-slate-300 mr-3">
                    <GlobeIcon className="w-5 h-5" />
                  </div>
                  <h3 className="text-teal-100 text-lg font-dmSerif">Public Leagues</h3>
                </div>
                <p className="text-white/70 text-sm mb-3">
                  Public leagues are open to everyone. Join global competitions with thousands of players, compete for higher ranks, and test your prediction skills against the world.
                </p>
                <ul className="space-y-2">
                  {[
                    "Open to all players",
                    "Global leaderboards and rankings",
                    "Standard scoring systems",
                    "All Premier League matches included",
                    "Seasonal and weekly prizes"
                  ].map((item, idx) => (
                    <li key={idx} className="flex items-start text-white/60 text-sm">
                      <CheckIcon className="w-4 h-4 text-teal-400 mr-2 mt-0.5 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="bg-gradient-to-br from-indigo-900/30 to-indigo-800/20 rounded-lg border border-indigo-600/30 p-4">
                <div className="flex items-center mb-3">
                  <div className="w-8 h-8 rounded-full bg-indigo-800/50 flex items-center justify-center text-indigo-300 mr-3">
                    <LockClosedIcon className="w-4 h-4" />
                  </div>
                  <h3 className="text-indigo-100 text-lg font-dmSerif">Private Leagues</h3>
                </div>
                <p className="text-white/70 text-sm mb-3">
                  Create your own league and invite friends, family, or colleagues. As league admin, you control the rules, scoring systems, and which matches to include.
                </p>
                <ul className="space-y-2">
                  {[
                    "Invite-only membership",
                    "Customizable scoring systems",
                    "Select which fixtures to predict",
                    "League admin controls",
                    "Custom league settings"
                  ].map((item, idx) => (
                    <li key={idx} className="flex items-start text-white/60 text-sm">
                      <CheckIcon className="w-4 h-4 text-indigo-400 mr-2 mt-0.5 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Create League Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-950/85 backdrop-blur-lg z-50 flex items-center justify-center p-4"
            onClick={() => setShowCreateModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", damping: 15 }}
              className="bg-gradient-to-b from-slate-700 to-slate-800 border border-slate-400/20 rounded-lg p-5 max-w-md w-full font-outfit"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-teal-100 text-2xl font-dmSerif">Create New League</h2>
                <button 
                  onClick={() => setShowCreateModal(false)}
                  className="text-white/60 hover:text-white p-1 rounded-full hover:bg-slate-600/20 transition-colors"
                >
                  <Cross2Icon className="w-4 h-4" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-white/70 text-sm mb-1">League Name</label>
                  <input 
                    type="text" 
                    placeholder="Enter league name"
                    className="w-full bg-slate-800/40 border border-slate-600/30 rounded-md py-2 px-3 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-teal-500/50"
                  />
                </div>
                
                <div>
                  <label className="block text-white/70 text-sm mb-1">League Type</label>
                  <div className="flex gap-2">
                    <button className="flex-1 px-3 py-2 bg-indigo-900/40 border border-indigo-700/30 rounded-md flex items-center justify-center text-indigo-300">
                      <LockClosedIcon className="mr-1.5 w-4 h-4" />
                      Private
                    </button>
                    <button className="flex-1 px-3 py-2 bg-slate-800/30 border border-slate-600/20 rounded-md flex items-center justify-center text-white/60 hover:text-white/80">
                      <GlobeIcon className="mr-1.5 w-4 h-4" />
                      Public
                    </button>
                  </div>
                </div>
                
                <div>
                  <label className="block text-white/70 text-sm mb-1">Description</label>
                  <textarea
                    placeholder="About this league..."
                    className="w-full bg-slate-800/40 border border-slate-600/30 rounded-md py-2 px-3 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-teal-500/50 resize-none h-20"
                  ></textarea>
                </div>
                
                <div>
                  <div className="flex items-start mb-2">
                    <div className="flex h-5 items-center">
                      <input
                        id="customize-scoring"
                        type="checkbox"
                        className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      />
                    </div>
                    <div className="ml-2">
                      <label htmlFor="customize-scoring" className="text-white/80 text-sm">
                        Customize scoring system
                      </label>
                      <p className="text-white/50 text-xs">
                        Define your own point values for correct predictions
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start mb-2">
                    <div className="flex h-5 items-center">
                      <input
                        id="select-fixtures"
                        type="checkbox"
                        className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      />
                    </div>
                    <div className="ml-2">
                      <label htmlFor="select-fixtures" className="text-white/80 text-sm">
                        Select specific fixtures
                      </label>
                      <p className="text-white/50 text-xs">
                        Choose which matches your league will predict each gameweek
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="pt-2 flex justify-end gap-2">
                  <button
                    onClick={() => setShowCreateModal(false)}
                    className="px-4 py-2 border border-slate-400/30 text-white/80 hover:text-white rounded-md transition-colors hover:bg-slate-600/20"
                  >
                    Cancel
                  </button>
                  <button
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md transition-colors flex items-center"
                  >
                    <PlusCircledIcon className="mr-1.5 w-4 h-4" />
                    Create League
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Join League Modal */}
      <AnimatePresence>
        {showJoinModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-950/85 backdrop-blur-lg z-50 flex items-center justify-center p-4"
            onClick={() => setShowJoinModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", damping: 15 }}
              className="bg-gradient-to-b from-slate-700 to-slate-800 border border-slate-400/20 rounded-lg p-5 max-w-md w-full font-outfit"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-teal-100 text-2xl font-dmSerif">Join a League</h2>
                <button 
                  onClick={() => setShowJoinModal(false)}
                  className="text-white/60 hover:text-white p-1 rounded-full hover:bg-slate-600/20 transition-colors"
                >
                  <Cross2Icon className="w-4 h-4" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-white/70 text-sm mb-1">League Code</label>
                  <input 
                    type="text" 
                    placeholder="Enter league invite code"
                    className="w-full bg-slate-800/40 border border-slate-600/30 rounded-md py-2 px-3 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-teal-500/50"
                  />
                </div>
                
                <div className="flex items-center py-2 px-3 bg-indigo-900/20 border border-indigo-700/20 rounded-lg text-sm">
                  <InfoCircledIcon className="w-4 h-4 text-indigo-300 mr-2" />
                  <p className="text-indigo-200/90">Ask the league admin for the invite code, or search for public leagues in the Discover tab.</p>
                </div>
                
                <div className="pt-2 flex justify-end gap-2">
                  <button
                    onClick={() => setShowJoinModal(false)}
                    className="px-4 py-2 border border-slate-400/30 text-white/80 hover:text-white rounded-md transition-colors hover:bg-slate-600/20"
                  >
                    Cancel
                  </button>
                  <button
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md transition-colors flex items-center"
                  >
                    <EnterIcon className="mr-1.5 w-4 h-4" />
                    Join League
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default LeaguesView;

/* 
for private leagues, the admins/creator of the league should have the ability to:
1. Define the games that will be predicted within every gameweek (select from all available fixtures or randomize)
2. Customize the scoring system for that league, if they want to use a different one from the default
*/