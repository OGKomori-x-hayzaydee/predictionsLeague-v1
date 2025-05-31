import { useState, useContext, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import PredictionsModal from "../predictions/PredictionsModal";
import ChipInfoModal from "../predictions/ChipInfoModal";
import { ThemeContext } from "../../context/ThemeContext";
import { backgrounds } from "../../utils/themeUtils";

// Import from centralized data file
import {
  upcomingMatches,
  recentPredictions,
  leagues,
} from "../../data/sampleData";

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

export default function ContentPane({ activeItem, navigateToSection, navigationParams = {} }) {
  // Access theme context
  const { theme } = useContext(ThemeContext);

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
  const handleFixtureSelect = (fixture, gameweekChips = []) => {
    setModalData({
      isOpen: true,
      fixture: fixture,
      initialValues: null,
      isEditing: false,
      activeGameweekChips: gameweekChips || [],
    });
  };

  // Handler for editing predictions
  const handleEditPrediction = (prediction) => {
    // Convert the prediction to the fixture format expected by PredictionsModal
    const fixture = {
      id: prediction.matchId,
      homeTeam: prediction.homeTeam,
      awayTeam: prediction.awayTeam,
      date: prediction.date,
      venue: "Premier League",
      gameweek: prediction.gameweek,
    };

    setModalData({
      isOpen: true,
      fixture: fixture,
      initialValues: {
        homeScore: prediction.homeScore,
        awayScore: prediction.awayScore,
        homeScorers: prediction.homeScorers,
        awayScorers: prediction.awayScorers,
        chips: prediction.chips || [],
      },
      isEditing: true,
      activeGameweekChips: [],
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
      if (isManagingLeague) {
        return (
          <LeagueManagementView
            leagueId={selectedLeagueId}
            onBack={handleBackToLeagues}
          />
        );
      } else {
        return (
          <LeagueDetailView
            leagueId={selectedLeagueId}
            onBack={handleBackToLeagues}
            onManage={() => setIsManagingLeague(true)}
          />
        );
      }
    }

    // Regular cases
    switch (activeItem) {
      case "dashboard":
        return (
          <DashboardView
            upcomingMatches={upcomingMatches}
            recentPredictions={recentPredictions}
            leagues={leagues}
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
            upcomingMatches={upcomingMatches}
            recentPredictions={recentPredictions}
            leagues={leagues}
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
              })
            }
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
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chip Info Modal */}
      <AnimatePresence>
        {isChipInfoModalOpen && (
          <ChipInfoModal onClose={() => setIsChipInfoModalOpen(false)} />
        )}
      </AnimatePresence>
    </div>
  );
}
