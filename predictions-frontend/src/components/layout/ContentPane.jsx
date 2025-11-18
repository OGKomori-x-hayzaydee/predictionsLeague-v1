import { useState, useContext, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import PredictionsModal from "../predictions/PredictionsModal";
import ChipStrategyModal from "../predictions/ChipStrategyModal";
import { ThemeContext } from "../../context/ThemeContext";
import { backgrounds } from "../../utils/themeUtils";
import { useClientSideFixtures, useHybridFixturesUtils } from "../../hooks/useClientSideFixtures";
import { useChipManagement } from "../../context/ChipManagementContext";

// Import from centralized data file for non-dashboard views
// Import all view components
import {
  DashboardView,
  ProfileView,
  FixturesView,
  PredictionsView,
  LeaguesView,
  SettingsView,
  LeagueDetailView, // New component
  LeagueManagementView, // New component
} from "../dashboardRenders";

export default function ContentPane({ 
  activeItem, 
  navigateToSection, 
  navigationParams = {},
  dashboardData = {} 
}) {
  // Access theme context
  const { theme } = useContext(ThemeContext);

  // Get fixtures data (includes player squads) and user predictions
  const fixturesResponse = useClientSideFixtures();
  const fixturesData = fixturesResponse?.fixtures || [];
  const userPredictions = fixturesResponse?.rawData?.predictions || [];
  
  // Get utilities for invalidating/refetching hybrid data
  const { invalidateUserPredictions } = useHybridFixturesUtils();

  // Get active gameweek chips (derived from cooldown state)
  const { activeGameweekChips } = useChipManagement();

  // Extract dashboard data from props
  const {
    essentialData,
    essentialLoading,
    upcomingMatches: apiUpcomingMatches,
    recentPredictions: apiRecentPredictions,
    leagues: apiLeagues,
    secondaryLoading,
    errors,
    refreshLeagues,
  } = dashboardData;

  // Animation variants
  const contentVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: "easeOut",
      },
    },
    exit: {
      opacity: 0,
      y: -20,
      transition: { duration: 0.3 },
    },
  };

  // Consolidated modal state
  const [modalData, setModalData] = useState({
    isOpen: false,
    fixture: null,
    initialValues: null,
    isEditing: false,
    activeGameweekChips: [],
  });

  // Chip info modal state
  const [isChipInfoModalOpen, setIsChipInfoModalOpen] = useState(false);

  const [activeFilter, setActiveFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [gameweekFilter, setGameweekFilter] = useState("all");
  const [sortBy, setSortBy] = useState("date");
  const [filterTeam, setFilterTeam] = useState("all");
  const [showFilters, setShowFilters] = useState(false);

  // Toggle chip info modal
  const toggleChipInfoModal = () => {
    setIsChipInfoModalOpen(!isChipInfoModalOpen);
  };

  // Consolidated handler for fixture selection
  const handleFixtureSelect = (fixture, gameweekChips = [], options = {}) => {
    const { isEditing = false, initialValues = null } = options;
    
    setModalData({
      isOpen: true,
      fixture: fixture,
      initialValues: initialValues,
      isEditing: isEditing,
      // Use derived active chips from chip management context
      activeGameweekChips: activeGameweekChips || [],
    });
  };

  // Handler for editing predictions
  const handleEditPrediction = async (prediction) => {
    // 🔄 CRITICAL FIX: Invalidate and refetch predictions to get fresh chip data
    invalidateUserPredictions();
    
    // Wait a moment for the invalidation to trigger a refetch
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Get fresh prediction data from the refetched cache
    const freshPrediction = userPredictions.find(p => p.matchId === prediction.matchId) || prediction;
    
    
    // Log available fixtures for debugging
    // Try to find the full fixture data (including player squads) from current fixtures
    let fullFixture = fixturesData?.find(f => 
      f.id === freshPrediction.matchId || 
      f.matchId === freshPrediction.matchId ||
      (f.homeTeam === freshPrediction.homeTeam && f.awayTeam === freshPrediction.awayTeam && f.gameweek === freshPrediction.gameweek)
    );
    
    // If not found in loaded fixtures, try to fetch from backend
    if (!fullFixture) {
      console.warn('⚠️ Full fixture data not found in loaded fixtures, attempting to fetch from backend');
      
      try {
        // Try to fetch fixture from backend by gameweek
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/fixtures?gameweek=${freshPrediction.gameweek}`);
        if (response.ok) {
          const data = await response.json();
          
          // Find the specific fixture
          fullFixture = data.find(f => 
            f.id === freshPrediction.matchId || 
            f.matchId === freshPrediction.matchId||
            (f.homeTeam === freshPrediction.homeTeam && f.awayTeam === freshPrediction.awayTeam)
          );
        }
      } catch (error) {
        console.error('❌ Failed to fetch fixture from backend:', error);
      }
    }
    
    // If still not found, construct basic fixture object
    // Note: Player squads may not be available for completed/past matches
    if (!fullFixture) {
      // IMPORTANT: Backend bug - matchDate contains prediction timestamp, not fixture datetime
      // For now, we'll use a placeholder but this needs backend fix
      const fixtureDate = prediction.matchDate || prediction.date;
      
      fullFixture = {
        id: prediction.matchId,
        homeTeam: prediction.homeTeam,
        awayTeam: prediction.awayTeam,
        date: fixtureDate, // This is wrong but it's a backend bug
        venue: prediction.venue || "Premier League",
        gameweek: prediction.gameweek,
        // Player squads might not be available for past matches
        homePlayers: [],
        awayPlayers: [],
      };
    }

    setModalData({
      isOpen: true,
      fixture: fullFixture,
      initialValues: {
        homeScore: freshPrediction.homeScore,
        awayScore: freshPrediction.awayScore,
        homeScorers: freshPrediction.homeScorers || [],
        awayScorers: freshPrediction.awayScorers || [],
        chips: freshPrediction.chips || [],  // ✅ Now using fresh chips
      },
      isEditing: true,
      // Use derived active chips from chip management context
      activeGameweekChips: activeGameweekChips || [],
    });
  };

  // Common close handler
  const handleCloseModal = () => {
    setModalData({
      isOpen: false,
      fixture: null,
      initialValues: null,
      isEditing: false,
      activeGameweekChips: [],
    });
  };

  // Handle saving predictions
  const handleSavePrediction = (updatedPrediction) => {
    console.log("Updated prediction:", updatedPrediction);
    handleCloseModal();
  };

  // Add state for league views
  const [selectedLeagueId, setSelectedLeagueId] = useState(null);
  const [isManagingLeague, setIsManagingLeague] = useState(false);

  // Modified navigation handler for leagues
  const handleViewLeague = (leagueId) => {
    setSelectedLeagueId(leagueId);
    setIsManagingLeague(false);
  };

  // Handler for managing leagues
  const handleManageLeague = (leagueId) => {
    setSelectedLeagueId(leagueId);
    setIsManagingLeague(true);
  };
  // Handler to go back to leagues list
  const handleBackToLeagues = () => {
    setSelectedLeagueId(null);
    setIsManagingLeague(false);
  };

  // Handle navigation parameters (e.g., automatic league navigation from dashboard)
  useEffect(() => {
    if (activeItem === "leagues" && navigationParams.leagueId) {
      handleViewLeague(navigationParams.leagueId);
    }
  }, [activeItem, navigationParams]);

  // Render content based on active item
  const renderContent = () => {
    // Special case for league details/management
    if (activeItem === "leagues" && selectedLeagueId) {
      // Find the league from available data
      const selectedLeague = apiLeagues?.find(league => league.id === selectedLeagueId) || 
                           leagues?.find(league => league.id === selectedLeagueId);
      
      console.log('ContentPane league selection:', {
        selectedLeagueId,
        selectedLeague: selectedLeague ? 'found' : 'not found'
      });

      // If we're still loading and no league found, show loading
      if (!selectedLeague && secondaryLoading) {
        return (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col justify-center items-center py-12 space-y-4"
          >
            <div className={`w-8 h-8 border-2 ${theme === 'dark' ? 'border-teal-400' : 'border-teal-600'} border-t-transparent rounded-full animate-spin`}></div>
            <p className={`text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'} font-outfit`}>
              Loading leagues data...
            </p>
          </motion.div>
        );
      }

      // If league not found and not loading, show error
      if (!selectedLeague) {
        return (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col justify-center items-center py-12 space-y-4"
          >
            <div className={`text-6xl ${theme === 'dark' ? 'text-slate-600' : 'text-slate-400'}`}>⚠️</div>
            <h3 className={`text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-slate-900'} font-outfit`}>
              League Not Found
            </h3>
            <p className={`text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'} font-outfit text-center max-w-md`}>
              The league you're looking for could not be found. It may have been deleted or you may not have access to it.
            </p>
            <button
              onClick={handleBackToLeagues}
              className={`mt-4 px-4 py-2 rounded-lg font-medium transition-colors ${
                theme === 'dark' 
                  ? 'bg-teal-600 hover:bg-teal-700 text-white' 
                  : 'bg-teal-600 hover:bg-teal-700 text-white'
              }`}
            >
              Back to Leagues
            </button>
          </motion.div>
        );
      }
      
      if (isManagingLeague) {
        return (
          <LeagueManagementView
            leagueId={selectedLeagueId}
            league={selectedLeague}
            onBack={handleBackToLeagues}
            onRefreshLeagues={refreshLeagues}
          />
        );
      } else {
        return (
          <LeagueDetailView
            leagueId={selectedLeagueId}
            league={selectedLeague}
            onBack={handleBackToLeagues}
            onManage={() => setIsManagingLeague(true)}
            essentialData={essentialData}
          />
        );
      }
    }

    // Regular cases
    switch (activeItem) {
      case "dashboard":
        return (
          <DashboardView
            // Use real API data only - no fallbacks
            essentialData={essentialData}
            essentialLoading={essentialLoading || false}
            upcomingMatches={apiUpcomingMatches || []}
            recentPredictions={apiRecentPredictions || []}
            leagues={apiLeagues || []}
            secondaryLoading={secondaryLoading || {}}
            errors={errors || {}}
            // Replace the goToPredictions prop with this inline function
            goToPredictions={(match) =>
              handleFixtureSelect({
                id: match.id,
                homeTeam: match.homeTeam,
                awayTeam: match.awayTeam,
                date: match.date,
                venue: match.venue,
                gameweek: match.gameweek,
                competition: match.competition,
                // Include player data for goalscorer selection
                homePlayers: match.homePlayers || [],
                awayPlayers: match.awayPlayers || [],
              })
            }
            navigateToSection={navigateToSection}
            toggleChipInfoModal={toggleChipInfoModal}
          />
        );
      case "fixtures":
        return (
          <FixturesView
            handleFixtureSelect={handleFixtureSelect}
            toggleChipInfoModal={toggleChipInfoModal}
          />
        );
      case "profile":
        return <ProfileView />;
      case "predictions":
        return (
          <PredictionsView
            activeFilter={activeFilter}
            setActiveFilter={setActiveFilter}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            gameweekFilter={gameweekFilter}
            setGameweekFilter={setGameweekFilter}
            sortBy={sortBy}
            setSortBy={setSortBy}
            filterTeam={filterTeam}
            setFilterTeam={setFilterTeam}
            showFilters={showFilters}
            setShowFilters={setShowFilters}
            handleEditPrediction={handleEditPrediction}
            toggleChipInfoModal={toggleChipInfoModal}
          />
        );
      case "leagues":
        return (
          <LeaguesView
            onViewLeague={handleViewLeague}
            onManageLeague={handleManageLeague}
          />
        );
      case "settings":
        return <SettingsView />;
      default:
        return (
          <DashboardView
            upcomingMatches={[]}
            recentPredictions={[]}
            leagues={[]}
            // Create mode only - edit mode is handled via breakdown modal
            goToPredictions={(match) => {
              console.log('➕ Opening create mode for new prediction');
              handleFixtureSelect({
                id: match.id,
                homeTeam: match.homeTeam,
                awayTeam: match.awayTeam,
                date: match.date,
                venue: match.venue,
                gameweek: match.gameweek,
                competition: match.competition,
                homePlayers: match.homePlayers || [],
                awayPlayers: match.awayPlayers || [],
              });
            }}
            handleEditPrediction={handleEditPrediction}
            handleFixtureSelect={handleFixtureSelect}
            navigateToSection={navigateToSection}
            toggleChipInfoModal={toggleChipInfoModal}
          />
        );
    }
  };
  return (
    <div className={`h-full overflow-y-auto p-6 ${backgrounds.main[theme]}`}>
      {/* Render content based on activeItem */}
      {renderContent()}

      {/* Predictions Modal */}
      <AnimatePresence>
        {" "}
        {modalData.isOpen && (
          <motion.div
            className={`fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto backdrop-blur-sm`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <PredictionsModal
              fixture={modalData.fixture}
              onClose={() => setModalData({ ...modalData, isOpen: false })}
              onSave={(prediction) => {
                console.log("Saving prediction:", prediction);
                setModalData({ ...modalData, isOpen: false });
                // Add any additional logic needed
              }}
              initialValues={modalData.initialValues}
              isEditing={modalData.isEditing}
              activeGameweekChips={modalData.activeGameweekChips}
              toggleChipInfoModal={toggleChipInfoModal}
              userPredictions={userPredictions}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chip Info Modal */}
      <AnimatePresence>
        {isChipInfoModalOpen && (
          <ChipStrategyModal isOpen={isChipInfoModalOpen} onClose={() => setIsChipInfoModalOpen(false)} />
        )}
      </AnimatePresence>
    </div>
  );
}
