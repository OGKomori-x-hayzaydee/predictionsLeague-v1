import React, { useState, useContext, useMemo } from "react";
import { motion } from "framer-motion";
import GameweekChipsPanel from "../panels/GameweekChipsPanel";
import ViewToggleBar from "../ui/ViewToggleBar";
import ViewToggleBarOption1 from "../ui/ViewToggleBarOption1";
import ViewToggleBarOption2 from "../ui/ViewToggleBarOption2";
import ViewToggleBarOption3 from "../ui/ViewToggleBarOption3";
import ViewToggleBarHybrid from "../ui/ViewToggleBarHybrid";
import ContentView from "../fixtures/ContentView";
import FixtureFilters from "../fixtures/FixtureFilters";
import { ThemeContext } from "../../context/ThemeContext";
import { useUserPreferences } from "../../context/UserPreferencesContext";
import { backgrounds, text } from "../../utils/themeUtils";
import { useFixtures } from "../../hooks/useFixtures";
import { fixtureFilters } from "../../services/api/externalFixturesAPI";
import { useUserPredictions } from "../../hooks/useClientSideFixtures";
import { spacing, padding, textScale } from "../../utils/mobileScaleUtils";
import { usePersistentFilters } from "../../hooks/usePersistentState";

const FixturesView = ({ handleFixtureSelect, toggleChipInfoModal }) => {
  // Get theme context and user preferences
  const { theme } = useContext(ThemeContext);
  const { preferences, updatePreference } = useUserPreferences();

  // Fetch fixtures using the external API only
  const {
    fixtures: liveFixtures,
    isLoading: fixturesLoading,
    isError: fixturesError,
    error: fixturesErrorDetails,
    dataQuality,
    stats
  } = useFixtures({
    fallbackToSample: false // Use only external API data
  });

  // Fetch user predictions to determine which fixtures have predictions
  const {
    data: userPredictions = [],
    isLoading: predictionsLoading,
    refetch: refetchPredictions,
  } = useUserPredictions({
    status: 'all',
    staleTime: 2 * 60 * 1000,
  });

  // Create a Set of matchIds that have predictions for quick lookup
  const predictedMatchIds = useMemo(() => {
    return new Set(userPredictions.map(p => p.matchId));
  }, [userPredictions]);

  // API Status and Error Handling  
  const hasApiError = fixturesError;
  const predictionsAvailable = dataQuality?.predictionsAPIAvailable ?? false;

  // Calculate current gameweek from fixtures data or use default
  const currentGameweekFromData = useMemo(() => {
    if (!liveFixtures || liveFixtures.length === 0) return 38;
    
    // Get the earliest upcoming gameweek from fixtures
    const upcomingGameweeks = liveFixtures
      .map(fixture => fixture.gameweek)
      .filter(Boolean)
      .sort((a, b) => a - b);
    
    return upcomingGameweeks[0] || 38;
  }, [liveFixtures]);

  const [currentGameweek, setCurrentGameweek] = useState(currentGameweekFromData);

  // Update current gameweek when data changes
  React.useEffect(() => {
    setCurrentGameweek(currentGameweekFromData);
  }, [currentGameweekFromData]);
  
  const [viewMode, setViewMode] = useState(preferences.defaultFixturesView);
  
  // Use persistent filters that survive navigation
  const {
    activeFilter,
    setActiveFilter,
    dateFilter,
    setDateFilter,
    searchQuery,
    setSearchQuery,
    sortBy,
    setSortBy,
    showFilters,
    setShowFilters,
    filterTeam,
    setFilterTeam
  } = usePersistentFilters('fixtures', {
    activeFilter: 'all',
    dateFilter: 'all',
    searchQuery: '',
    sortBy: 'date',
    showFilters: false,
    filterTeam: 'all'
  });

  // Wrapper function to update both state and preferences
  const handleViewModeChange = (newViewMode) => {
    setViewMode(newViewMode);
    updatePreference("defaultFixturesView", newViewMode);
  };
  
  // First, enhance ALL fixtures with prediction status from backend data (before filtering)
  const enhancedFixtures = useMemo(() => {
    if (!liveFixtures) return [];
    
    return liveFixtures.map(fixture => {
      const hasPrediction = predictedMatchIds.has(fixture.id);
      const userPrediction = hasPrediction 
        ? userPredictions.find(p => p.matchId === fixture.id)
        : null;
      
      return {
        ...fixture,
        hasPrediction,
        userPrediction,
        predicted: hasPrediction // Add predicted flag for compatibility
      };
    });
  }, [liveFixtures, predictedMatchIds, userPredictions]);

  // Then filter the enhanced fixtures
  const filteredFixtures = useMemo(() => {
    if (!enhancedFixtures) return [];
    
    let filtered = fixtureFilters.applyFilters(enhancedFixtures, {
      date: dateFilter,
      status: activeFilter,
      search: searchQuery
    });
    
    // Apply team filter
    if (filterTeam && filterTeam !== 'all') {
      filtered = filtered.filter(fixture => 
        fixture.homeTeam === filterTeam || fixture.awayTeam === filterTeam
      );
    }
    
    return filtered;
  }, [enhancedFixtures, dateFilter, activeFilter, searchQuery, filterTeam]);

  // Sort the filtered fixtures
  const sortedFixtures = useMemo(() => {
    if (!filteredFixtures) return [];
    
    return [...filteredFixtures].sort((a, b) => {
      if (sortBy === "date" || sortBy === "date-asc") {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        return sortBy === "date" ? dateB - dateA : dateA - dateB; // Default: newest first
      } else if (sortBy === "gameweek" || sortBy === "gameweek-asc") {
        const comparison = (b.gameweek || 0) - (a.gameweek || 0);
        return sortBy === "gameweek" ? comparison : -comparison; // Default: high to low
      } else if (sortBy === "team" || sortBy === "team-desc") {
        const comparison = (a.homeTeam || "").localeCompare(b.homeTeam || "");
        return sortBy === "team" ? comparison : -comparison; // Default: A-Z
      } else if (sortBy === "competition" || sortBy === "competition-desc") {
        const comparison = (a.competition || "").localeCompare(b.competition || "");
        return sortBy === "competition" ? comparison : -comparison; // Default: A-Z
      }
      return 0;
    });
  }, [filteredFixtures, sortBy]);

  // Handle fixture selection - Smart Click: Edit if predicted, Create if not
  const onFixtureSelect = async (fixture) => {
    // Check if user has already predicted this fixture
    const existingPrediction = fixture.userPrediction;
    
    if (existingPrediction) {
      // Refetch predictions to get fresh chip data before editing
      let freshPrediction = existingPrediction;
      
      if (refetchPredictions) {
        const refetchResult = await refetchPredictions();
        const freshPredictions = refetchResult.data || userPredictions;
        
        // Find the fresh version of this specific prediction
        freshPrediction = freshPredictions.find(p => p.matchId === existingPrediction.matchId) || existingPrediction;
      }
      
      // Edit mode: Open modal with FRESH prediction data
      handleFixtureSelect(fixture, [], {
        isEditing: true,
        initialValues: {
          homeScore: freshPrediction.homeScore,
          awayScore: freshPrediction.awayScore,
          homeScorers: freshPrediction.homeScorers || [],
          awayScorers: freshPrediction.awayScorers || [],
          chips: freshPrediction.chips || [],
        }
      });
    } else {
      // Create mode: Open modal for new prediction
      handleFixtureSelect(fixture, []);
    }
  };

  // Loading state
  if (fixturesLoading) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1
              className={`${
                theme === "dark" ? "text-teal-100" : "text-teal-700"
              } text-3xl font-bold font-dmSerif`}
            >
              Fixtures
            </h1>
            <p className={`${text.secondary[theme]} font-outfit`}>
              Loading fixtures...
            </p>
          </div>
        </div>
        <div
          className={`${
            theme === "dark"
              ? "backdrop-blur-xl border-slate-700/50 bg-slate-900/60"
              : "border-slate-200 bg-white/80 backdrop-blur-sm shadow-sm"
          } rounded-xl border mb-5 overflow-hidden font-outfit p-8`}
        >
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-500"></div>
            <span className={`${text.secondary[theme]} ml-3`}>
              Loading fixtures from external API...
            </span>
          </div>
        </div>
      </div>
    );
  }

  // Error state - now always show if there's an error since we're not using fallback
  if (fixturesError) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1
              className={`${
                theme === "dark" ? "text-teal-100" : "text-teal-700"
              } text-3xl font-bold font-dmSerif`}
            >
              Fixtures
            </h1>
            <p className={`${text.secondary[theme]} font-outfit`}>
              Error loading fixtures
            </p>
          </div>
        </div>
        <div
          className={`${
            theme === "dark"
              ? "backdrop-blur-xl border-slate-700/50 bg-slate-900/60"
              : "border-slate-200 bg-white/80 backdrop-blur-sm shadow-sm"
          } rounded-xl border mb-5 overflow-hidden font-outfit p-8`}
        >
          <div className="text-center">
            <div className="text-red-500 mb-2">⚠️ Error Loading Fixtures</div>
            <p className={`${text.secondary[theme]} text-sm`}>
              {fixturesErrorDetails?.message || 'Unable to load fixtures data'}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={spacing.normal}>
      {/* HERO SECTION - Prominent header with clear hierarchy */}
      <div className="flex flex-row justify-between items-center gap-3 mb-4 sm:mb-6">
        <div>
          <h1
            className={`${
              theme === "dark" ? "text-teal-100" : "text-teal-700"
            } text-2xl sm:text-3xl font-bold font-dmSerif mb-0.5`}
          >
            Fixtures
          </h1>
          <p className={`${text.secondary[theme]} font-outfit text-xs sm:text-sm opacity-70`}>
            View and predict upcoming fixtures
          </p>
        </div>

        {/* View toggle controls - HYBRID: Bottom Sheet (mobile) + Dropdown (desktop) */}
        <ViewToggleBarHybrid viewMode={viewMode} setViewMode={handleViewModeChange} />
        
        {/* TESTING OTHER OPTIONS (uncomment to test individually): */}
        {/* <ViewToggleBarOption1 viewMode={viewMode} setViewMode={handleViewModeChange} /> */}
        {/* <ViewToggleBarOption2 viewMode={viewMode} setViewMode={handleViewModeChange} /> */}
        {/* <ViewToggleBarOption3 viewMode={viewMode} setViewMode={handleViewModeChange} /> */}
      </div>
      {/* CHIP STRATEGY SECTION - Elevated card with shadow */}
      <motion.div
        initial={{ height: "auto" }}
        animate={{ height: "auto" }}
        transition={{ duration: 0.3 }}
        className="mb-4 sm:mb-5"
      >
        <GameweekChipsPanel
          currentGameweek={currentGameweek}
          toggleChipInfoModal={toggleChipInfoModal}
          activeMatchChips={[]}
          upcomingFixtures={liveFixtures || []}
          userPredictions={userPredictions}
          refetchPredictions={refetchPredictions}
        />
      </motion.div>

      {/* API STATUS BANNER - Attention-grabbing warning */}
      {(hasApiError || !predictionsAvailable) && (
        <div
          className={`${
            theme === "dark"
              ? "backdrop-blur-xl border-amber-700/50 bg-amber-900/20 shadow-lg shadow-amber-900/20"
              : "border-amber-200 bg-amber-50/80 backdrop-blur-sm shadow-md shadow-amber-500/10"
          } rounded-xl border mb-4 sm:mb-5 overflow-hidden font-outfit p-3 sm:p-4`}
        >
          <div className="flex items-center gap-3">
            <div className="text-amber-500 text-lg">
              {hasApiError ? "⚠️" : "ℹ️"}
            </div>
            <div className="flex-1">
              <div className={`${text.primary[theme]} font-semibold text-sm`}>
                {hasApiError && "External Fixtures API Unavailable"}
                {!predictionsAvailable && !hasApiError && "Predictions Service Unavailable"}
              </div>
              <div className={`${text.secondary[theme]} text-xs mt-1 opacity-80`}>
                {hasApiError && "Unable to connect to external fixtures API. Please check your connection or try again later."}
                {!predictionsAvailable && "User predictions will be available when backend is connected."}
              </div>
            </div>
            {dataQuality?.totalFixtures > 0 && (
              <div className={`${text.secondary[theme]} text-xs text-right`}>
                <div>{dataQuality.totalFixtures} fixtures</div>
                {stats && (
                  <div className="text-green-600 font-medium">
                    {Math.round(dataQuality.predictionRate * 100)}% predicted
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* MAIN FIXTURES CONTAINER - Primary content card with elevation */}
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
          <FixtureFilters
            activeFilter={activeFilter}
            setActiveFilter={setActiveFilter}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            dateFilter={dateFilter}
            setDateFilter={setDateFilter}
            sortBy={sortBy}
            setSortBy={setSortBy}
            showFilters={showFilters}
            setShowFilters={setShowFilters}
            filterTeam={filterTeam}
            setFilterTeam={setFilterTeam}
            fixtures={enhancedFixtures || []}
          />
        </div>

        {/* FIXTURES CONTENT - Main focus area with breathing room */}
        <div className={padding.cardCompact}>
          <ContentView
            viewMode={viewMode}
            fixtures={sortedFixtures}
            onFixtureSelect={onFixtureSelect}
            searchQuery={searchQuery}
          />
        </div>
      </div>
    </div>
  );
};

export default FixturesView;
