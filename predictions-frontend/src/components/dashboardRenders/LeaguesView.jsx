import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  PlusCircledIcon, 
  EnterIcon,
} from "@radix-ui/react-icons";

// Import our custom hooks and components
import useLeagues from "../../hooks/useLeagues";
import { showToast } from "../../services/notificationService";
import TabNav from "../common/TabNav";
import CreateLeagueForm from "../leagues/CreateLeagueForm";
import JoinLeagueForm from "../leagues/JoinLeagueForm";
import Modal from "../ui/Modal";
import LoadingState from "../common/LoadingState";
import ErrorState from "../common/ErrorState";
import MyLeaguesTab from "../leagues/MyLeaguesTab";
import DiscoverTab from "../leagues/DiscoverTab";

const LeaguesView = ({ onViewLeague, onManageLeague }) => {
  const [activeTab, setActiveTab] = useState("my-leagues");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [joiningLeague, setJoiningLeague] = useState(false);
  const [leagueCode, setLeagueCode] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState("newest");
  const [filterOptions, setFilterOptions] = useState({
    type: "all",
    status: "all"
  });
  
  // Use our custom hook to get league data and functions
  const { 
    myLeagues, 
    featuredLeagues, 
    isLoading, 
    error, 
    joinLeague,
    joinFeaturedLeague 
  } = useLeagues();

  // Filter leagues based on search query
  const filteredMyLeagues = myLeagues.filter(league => 
    league.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    league.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredFeaturedLeagues = featuredLeagues.filter(league => 
    league.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    league.description.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Handle joining a league with code
  const handleJoinWithCode = async () => {
    if (!leagueCode.trim()) {
      showToast("Please enter a league code", "warning");
      return;
    }
    
    setJoiningLeague(true);
    
    const result = await joinLeague(leagueCode);
    
    if (result.success) {
      showToast(result.message, "success");
      setLeagueCode("");
      setShowJoinModal(false);
      setActiveTab("my-leagues");
    } else {
      showToast(result.message, "error");
    }
    
    setJoiningLeague(false);
  };
  
  // Handle joining a featured league
  const handleJoinFeaturedLeague = async (leagueId) => {
    setJoiningLeague(true);
    
    const result = await joinFeaturedLeague(leagueId);
    
    if (result.success) {
      showToast(result.message, "success");
      setActiveTab("my-leagues");
    } else {
      showToast(result.message, "warning");
    }
    
    setJoiningLeague(false);
  };
  
  // Handle viewing league details
  const handleViewLeague = (leagueId) => {
    onViewLeague(leagueId);
  };
  
  // Handle managing a league
  const handleManageLeague = (league) => {
    onManageLeague(league.id);
  };
  
  // Clear search
  const handleClearSearch = () => {
    setSearchQuery("");
  };

  // Loading state
  if (isLoading && activeTab === "my-leagues") {
    return <LoadingState message="Loading your leagues..." />;
  }
  
  // Error state
  if (error && activeTab === "my-leagues") {
    return <ErrorState error={error} onRetry={() => window.location.reload()} />;
  }
  
  return (
    <>
      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center">
            <h1 className="text-teal-100 text-3xl font-bold font-dmSerif">
              My Leagues
            </h1>
            <div className="ml-3 mt-1 bg-teal-900/30 text-teal-300 text-xs px-2.5 py-1 rounded-full">
              {myLeagues.length} {myLeagues.length === 1 ? 'League' : 'Leagues'}
            </div>
          </div>
          <p className="text-white/70 font-outfit mt-1">
            Manage your leagues, check rankings, and join competitions
          </p>
        </div>
        
        <div className="flex items-center gap-2 shrink-0">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowJoinModal(true)}
            className="px-3 py-1.5 bg-slate-700/60 hover:bg-slate-700/80 border border-slate-500/30 rounded-md transition-colors flex items-center text-white/90 text-sm"
          >
            <EnterIcon className="mr-1.5 w-3.5 h-3.5" />
            Join League
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowCreateModal(true)}
            className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 rounded-md transition-colors flex items-center text-white text-sm font-medium"
          >
            <PlusCircledIcon className="mr-1.5 w-3.5 h-3.5" />
            Create League
          </motion.button>
        </div>
      </div>
      
      {/* Tab Navigation */}
      <TabNav 
        tabs={[
          { id: "my-leagues", label: "My Leagues" },
          { id: "discover", label: "Discover" }
        ]}
        activeTab={activeTab}
        onChange={setActiveTab}
      />
      
      <AnimatePresence mode="wait">
        {activeTab === "my-leagues" ? (
          <MyLeaguesTab 
            leagues={filteredMyLeagues}
            isLoading={isLoading}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onClearSearch={handleClearSearch}
            onCreateLeague={() => setShowCreateModal(true)}
            onJoinLeague={() => setShowJoinModal(true)}
            onDiscoverLeagues={() => setActiveTab("discover")}
            onViewLeague={handleViewLeague}
            onManageLeague={handleManageLeague}
            sortOption={sortOption}
            onSortChange={setSortOption}
            filterOptions={filterOptions}
            onFilterChange={setFilterOptions}
          />
        ) : (
          <DiscoverTab
            leagues={filteredFeaturedLeagues}
            isLoading={isLoading}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onClearSearch={handleClearSearch}
            onJoinLeague={handleJoinFeaturedLeague}
            isJoining={joiningLeague}
            sortOption={sortOption}
            onSortChange={setSortOption}
            filterOptions={filterOptions}
            onFilterChange={setFilterOptions}
          />
        )}
      </AnimatePresence>

      {/* Create League Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <Modal onClose={() => setShowCreateModal(false)}>
            <CreateLeagueForm 
              onCancel={() => setShowCreateModal(false)} 
              onSuccess={() => {
                setShowCreateModal(false);
                showToast("League created successfully!", "success");
                setActiveTab("my-leagues");
              }}
            />
          </Modal>
        )}
      </AnimatePresence>
      
      {/* Join League Modal */}
      <AnimatePresence>
        {showJoinModal && (
          <Modal onClose={() => setShowJoinModal(false)}>
            <JoinLeagueForm
              leagueCode={leagueCode}
              onLeagueCodeChange={setLeagueCode}
              onCancel={() => setShowJoinModal(false)}
              onSubmit={handleJoinWithCode}
              isLoading={joiningLeague}
            />
          </Modal>
        )}
      </AnimatePresence>
    </>
  );
};

export default LeaguesView;