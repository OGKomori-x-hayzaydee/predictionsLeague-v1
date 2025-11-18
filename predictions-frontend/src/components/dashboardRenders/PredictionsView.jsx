import { useState, useContext } from "react";
import PredictionFilters from "../predictions/PredictionFilters";
import PotentialPointsSummary from "../panels/PotentialPointsSummary";
import PredictionContentView from "../predictions/PredictionContentView";
import PredictionBreakdownModal from "../predictions/PredictionBreakdownModal";
import ViewToggleBarHybrid from "../ui/ViewToggleBarHybrid";
import EmptyPredictionState from "../predictions/EmptyPredictionState";
import ChipSyncBanner from "../ui/ChipSyncBanner";
import { ThemeContext } from "../../context/ThemeContext";
import { useUserPreferences } from "../../context/UserPreferencesContext";
import { text } from "../../utils/themeUtils";
import { useUserPredictions } from "../../hooks/useClientSideFixtures";
import { spacing, padding } from "../../utils/mobileScaleUtils";
import { usePersistentFilters } from "../../hooks/usePersistentState";
import { useChipManagement } from "../../context/ChipManagementContext";
import { useChipValidation } from "../../hooks/useChipValidation";
import { syncPredictionsWithActiveChips, markDismissed } from "../../utils/chipValidation";
import { CHIP_CONFIG } from "../../utils/chipManager";
import { useQueryClient } from "@tanstack/react-query";
import { showToast } from "../../services/notificationService";

const PredictionsView = ({ handleEditPrediction }) => {
  // Get theme context and user preferences
  const { theme } = useContext(ThemeContext);
  const { preferences, updatePreference } = useUserPreferences();
  
  // Get chip management context
  const { activeGameweekChips, currentGameweek } = useChipManagement();
  const queryClient = useQueryClient();
  
  // Fetch user predictions from backend
  const { data: predictions = [], isLoading, error } = useUserPredictions({
    status: 'all'
  });
  
  // Chip validation - check if predictions need syncing with active chips
  const { data: validation, refetch: refetchValidation } = useChipValidation(
    predictions,
    activeGameweekChips,
    currentGameweek
  );
  
  // Syncing state
  const [isSyncing, setIsSyncing] = useState(false);
  
  // Use persistent filters that survive navigation
  const {
    activeFilter,
    setActiveFilter,
    searchQuery,
    setSearchQuery,
    gameweekFilter,
    setGameweekFilter,
    sortBy,
    setSortBy,
    filterTeam,
    setFilterTeam,
    showFilters,
    setShowFilters
  } = usePersistentFilters('predictions', {
    activeFilter: 'all',
    searchQuery: '',
    gameweekFilter: 'all',
    sortBy: 'date',
    filterTeam: 'all',
    showFilters: false
  });
  
  const [viewMode, setViewMode] = useState(preferences.defaultPredictionsView);
  const [cardStyle, setCardStyle] = useState(preferences.cardStyle);
  const [selectedPrediction, setSelectedPrediction] = useState(null);

  // Wrapper function to update both state and preferences
  const handleViewModeChange = (newViewMode) => {
    setViewMode(newViewMode);
    updatePreference("defaultPredictionsView", newViewMode);
  };
  const [showBreakdownModal, setShowBreakdownModal] = useState(false);
  // Filter predictions based on active filter
  const filteredPredictions = predictions.filter((prediction) => {
    // Filter by status
    if (activeFilter === "pending" && prediction.status !== "pending")
      return false;
    if (activeFilter === "completed" && prediction.status !== "completed")
      return false;

    // Filter by gameweek
    if (
      gameweekFilter !== "all" &&
      prediction.gameweek !== Number(gameweekFilter)
    )
      return false;

    // Filter by team
    if (
      filterTeam !== "all" &&
      prediction.homeTeam !== filterTeam &&
      prediction.awayTeam !== filterTeam
    )
      return false;

    // Filter by search query
    if (
      searchQuery &&
      !`${prediction.homeTeam} vs ${prediction.awayTeam}`
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
    )
      return false;

    return true;
  });
  // For PotentialPointsSummary: show pending predictions from the filtered set
  // This ensures consistency - if user filters by pending, both components show the same data
  // If user filters by something else, PotentialPointsSummary still only shows pending predictions
  const pendingPredictions = activeFilter === "pending" 
    ? filteredPredictions  // When filtering by pending, use the already filtered data
    : predictions.filter((prediction) => prediction.status === "pending"); // Otherwise, show all pending predictions

  // Sort predictions
  const sortedPredictions = [...filteredPredictions].sort((a, b) => {
    if (sortBy === "date" || sortBy === "date-asc") {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return sortBy === "date" ? dateB - dateA : dateA - dateB; // Default: newest first
    } else if (sortBy === "team" || sortBy === "team-desc") {
      const comparison = a.homeTeam?.localeCompare(b.homeTeam) || 0;
      return sortBy === "team" ? comparison : -comparison; // Default: A-Z
    } else if (sortBy === "points" || sortBy === "points-asc") {
      // Handle null points (pending predictions)
      if (a.points === null && b.points !== null) return 1;
      if (a.points !== null && b.points === null) return -1;
      if (a.points === null && b.points === null) return 0;
      const comparison = b.points - a.points;
      return sortBy === "points" ? comparison : -comparison; // Default: high to low
    }
    return 0;
  });
  // The edit button handler passes the prediction to the parent
  const onEditClick = (prediction) => {
    handleEditPrediction(prediction);
  };

  // Handle prediction card click to open breakdown modal
  const handlePredictionSelect = (prediction) => {
    setSelectedPrediction(prediction);
    setShowBreakdownModal(true);
  };

  // Handle modal close
  const handleCloseModal = () => {
    setShowBreakdownModal(false);
    setSelectedPrediction(null);
  };

  // Handle edit from modal
  const handleEditFromModal = (prediction) => {
    handleCloseModal();
    handleEditPrediction(prediction);
  };
  
  // Handle auto-sync of predictions with active chips
  const handleAutoSync = async () => {
    if (!validation || isSyncing) return;
    
    setIsSyncing(true);
    try {
      const result = await syncPredictionsWithActiveChips(
        validation.predictions,
        activeGameweekChips,
        currentGameweek
      );
      
      if (result.successful > 0) {
        // Invalidate predictions query to refetch
        await queryClient.invalidateQueries(['userPredictions']);
        
        // Refetch validation to update banner
        await refetchValidation();
        
        // Build success message
        let message = `✅ Synced ${result.successful} prediction${result.successful === 1 ? '' : 's'} successfully`;
        
        const chipNames = activeGameweekChips.map(id => 
          CHIP_CONFIG[id]?.name
        ).filter(Boolean).join(', ');
        
        if (chipNames) {
          message += ` - ${chipNames}`;
        }
        
        if (result.skipped?.length > 0) {
          message += ` (${result.skipped.length} skipped - no clean sheet)`;
        }
        
        showToast(message, 'success');
      } else if (result.skipped?.length > 0 && result.successful === 0) {
        showToast('No predictions updated - Defense++ only applies to clean sheet predictions (0-X or X-0)', 'info');
      } else {
        const errorMsg = result.errors?.[0]?.error || 'Please try again';
        showToast(`Failed to sync predictions: ${errorMsg}`, 'error');
      }
    } catch (error) {
      console.error('[PredictionsView] Auto-sync error:', error);
      showToast(`Sync failed: ${error.message || 'An unexpected error occurred'}`, 'error');
    } finally {
      setIsSyncing(false);
    }
  };
  
  // Handle dismissal of sync banner
  const handleDismiss = () => {
    if (!validation) return;
    
    markDismissed(currentGameweek, activeGameweekChips);
    refetchValidation();
  };
  // Show loading state
  if (isLoading) {
    return (
      <div className="space-y-6">
        <h1 className={`${theme === 'dark' ? 'text-teal-100' : 'text-teal-700'} text-3xl font-bold font-dmSerif`}>
          My Predictions
        </h1>
        <div className={`${theme === 'dark' ? 'bg-slate-800/50' : 'bg-slate-50'} rounded-xl p-8 text-center`}>
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500 mx-auto mb-4"></div>
          <p className={`${text.secondary[theme]} font-outfit`}>Loading predictions...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="space-y-6">
        <h1 className={`${theme === 'dark' ? 'text-teal-100' : 'text-teal-700'} text-3xl font-bold font-dmSerif`}>
          My Predictions
        </h1>
        <div className={`${theme === 'dark' ? 'bg-red-900/20 border-red-700' : 'bg-red-50 border-red-200'} rounded-xl p-8 text-center border`}>
          <p className={`${theme === 'dark' ? 'text-red-300' : 'text-red-700'} font-outfit`}>
            Failed to load predictions: {error.message}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={spacing.normal}>
      {/* HERO SECTION - Prominent header with clear hierarchy */}
      <div className="flex flex-row justify-between items-center gap-4 mb-4 sm:mb-6">
        <div>
          <h1
            className={`${
              theme === "dark" ? "text-teal-100" : "text-teal-700"
            } text-2xl sm:text-3xl font-bold font-dmSerif mb-0.5`}
          >
            My Predictions
          </h1>
          <p className={`${text.secondary[theme]} font-outfit text-xs sm:text-sm opacity-70`}>
            View and manage your predictions
          </p>
        </div>

        {/* View toggle controls - HYBRID: Bottom Sheet (mobile) + Dropdown (desktop) */}
        <ViewToggleBarHybrid viewMode={viewMode} setViewMode={handleViewModeChange} />
      </div>
      
      {/* POTENTIAL POINTS SUMMARY PANEL - Elevated card with shadow */}
      {pendingPredictions.length > 0 && (
        <PotentialPointsSummary
          predictions={pendingPredictions}
        />
      )}
      
      {/* CHIP SYNC BANNER - Notification for predictions missing active chips */}
      {validation?.shouldShow && (
        <ChipSyncBanner
          validation={validation}
          onAutoSync={handleAutoSync}
          onDismiss={handleDismiss}
          syncing={isSyncing}
        />
      )}

      {/* API STATUS BANNER - Warning if predictions fail */}
      {error && (
        <div
          className={`${
            theme === "dark"
              ? "backdrop-blur-xl border-amber-700/50 bg-amber-900/20 shadow-lg shadow-amber-900/20"
              : "border-amber-200 bg-amber-50/80 backdrop-blur-sm shadow-md shadow-amber-500/10"
          } rounded-xl border mb-4 sm:mb-5 overflow-hidden font-outfit p-3 sm:p-4`}
        >
          <div className="flex items-center gap-3">
            <div className="text-amber-500 text-lg">⚠️</div>
            <div className="flex-1">
              <div className={`${text.primary[theme]} font-semibold text-sm`}>
                Predictions Service Unavailable
              </div>
              <div className={`${text.secondary[theme]} text-xs mt-1 opacity-80`}>
                Failed to load predictions: {error.message}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MAIN PREDICTIONS CONTAINER - Primary content card with elevation */}
      <div
        className={`${
          theme === "dark"
            ? "backdrop-blur-xl border-slate-700/50 bg-slate-900/60 shadow-xl shadow-slate-950/50"
            : "border-slate-200 bg-white/80 backdrop-blur-sm shadow-lg shadow-slate-900/5"
        } rounded-xl border mb-5 overflow-hidden font-outfit`}
      >
        {/* FILTERS SECTION - Separated and de-emphasized */}
        <div className={`${
          theme === "dark" 
            ? "bg-slate-800/30 border-b border-slate-700/30" 
            : "bg-slate-50/50 border-b border-slate-200/50"
        } ${padding.cardCompact}`}>
          <PredictionFilters
          predictions={predictions}
          activeFilter={activeFilter}
          setActiveFilter={setActiveFilter}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          gameweekFilter={gameweekFilter}
          setGameweekFilter={setGameweekFilter}
          filterTeam={filterTeam}
          setFilterTeam={setFilterTeam}
          sortBy={sortBy}
          setSortBy={setSortBy}
          showFilters={showFilters}
          setShowFilters={setShowFilters}
          cardStyle={cardStyle}
          setCardStyle={setCardStyle}
        />
        </div>

        {/* PREDICTIONS CONTENT - Main focus area with breathing room */}
        <div className={padding.cardCompact}>
          {sortedPredictions.length === 0 ? (
            <EmptyPredictionState 
              searchQuery={searchQuery}
              activeFilter={activeFilter}
            />
          ) : (
            <PredictionContentView
              viewMode={viewMode}
              predictions={sortedPredictions}
              onPredictionSelect={handlePredictionSelect}
              onEditClick={onEditClick}
              searchQuery={searchQuery}
              cardStyle={cardStyle}
            />
          )}
        </div>
      </div>

      {/* Prediction Breakdown Modal */}
      <PredictionBreakdownModal
        isOpen={showBreakdownModal}
        prediction={selectedPrediction}
        onClose={handleCloseModal}
        onEdit={handleEditFromModal}
      />
    </div>
  );
};

export default PredictionsView;
