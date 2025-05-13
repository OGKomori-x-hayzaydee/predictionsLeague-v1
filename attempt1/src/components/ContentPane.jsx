import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { NavLink, useNavigate } from "react-router-dom";
import PredictionsModal from "./PredictionsModal";
import ChipInfoModal from "./ChipInfoModal";

// Import all view components
import {
  DashboardView,
  ProfileView,
  FixturesView,
  PredictionsView,
  LeaguesView,
  CommunityView,
  SettingsView,
} from "./dashboardRenders";

// Sample data for the dashboard
const upcomingMatches = [
  {
    id: 1,
    home: "Arsenal",
    away: "Tottenham",
    date: "2025-05-10T15:00:00",
    predicted: true,
  },
  {
    id: 2,
    home: "Liverpool",
    away: "Man City",
    date: "2025-05-11T14:30:00",
    predicted: false,
  },
  {
    id: 3,
    home: "Chelsea",
    away: "Man United",
    date: "2025-05-12T20:00:00",
    predicted: false,
  },
];

const recentPredictions = [
  { id: 1, match: "Man United 3-1 Liverpool", points: 12, correct: true },
  { id: 2, match: "Arsenal 2-1 Chelsea", points: 8, correct: true },
  { id: 3, match: "Man City 1-1 Tottenham", points: 0, correct: false },
];

const leagues = [
  { id: 1, name: "Global League", position: 567, members: 10843 },
  { id: 2, name: "Friends & Family", position: 3, members: 12 },
  { id: 3, name: "Office Rivalry", position: 1, members: 8 },
];

export default function ContentPane({ activeItem, navigateToSection }) {
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

  const navigate = useNavigate();

  const goToPredictions = () => {
    navigate("/predictions");
  };

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

  // Render content based on active item
  const renderContent = () => {
    switch (activeItem) {
      case "dashboard":
        return (
          <DashboardView
            upcomingMatches={upcomingMatches}
            recentPredictions={recentPredictions}
            leagues={leagues}
            goToPredictions={goToPredictions}
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
        return <LeaguesView />;
      case "settings":
        return <SettingsView />;
      case "community":
        return <CommunityView />;
      default:
        return (
          <DashboardView
            upcomingMatches={upcomingMatches}
            recentPredictions={recentPredictions}
            leagues={leagues}
            goToPredictions={goToPredictions}
            navigateToSection={navigateToSection}
            toggleChipInfoModal={toggleChipInfoModal}
          />
        );
    }
  };

  return (
    <div className="h-full overflow-y-auto p-6">
      <motion.div
        key={activeItem}
        initial="hidden"
        animate="visible"
        exit="exit"
        variants={contentVariants}
      >
        {renderContent()}
      </motion.div>

      {/* SINGLE Prediction modal implementation */}
      <AnimatePresence>
        {modalData.isOpen && (
          <motion.div
            className="fixed inset-0 bg-primary-900/70 backdrop-blur-lg z-50 flex items-center justify-center overflow-y-auto p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleCloseModal}
          >
            <motion.div
              className="relative max-w-4xl w-full"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              transition={{ type: "spring", damping: 15 }}
              onClick={(e) => e.stopPropagation()}
            >
              <PredictionsModal
                fixture={modalData.fixture}
                initialValues={modalData.initialValues}
                isEditing={modalData.isEditing}
                onClose={handleCloseModal}
                onSave={handleSavePrediction}
                activeGameweekChips={modalData.activeGameweekChips}
                toggleChipInfoModal={toggleChipInfoModal}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Global Chip Info Modal */}
      <AnimatePresence>
        <ChipInfoModal 
          isOpen={isChipInfoModalOpen}
          onClose={() => setIsChipInfoModalOpen(false)}
        />
      </AnimatePresence>
    </div>
  );
}
