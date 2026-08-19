import { motion } from "framer-motion";
import { useContext, useMemo, useState, useEffect } from "react";
import {
  InfoCircledIcon,
  LightningBoltIcon,
  TargetIcon,
  CalendarIcon,
  MagicWandIcon,
  PersonIcon,
  RocketIcon,
} from "@radix-ui/react-icons";
import StatCard from "../common/StatCard";
import StatCardOption1 from "../common/StatCardOption1";
import StatCardOption2 from "../common/StatCardOption2";
import StatCardOption3 from "../common/StatCardOption3";
import StatCardSkeleton from "../common/StatCardSkeleton";
import PanelSkeleton from "../common/PanelSkeleton";
import DashboardEmptyState from "../common/DashboardEmptyState";
import UpcomingMatchesPanel from "../panels/UpcomingMatchesPanel";
import RecentPredictionsPanel from "../panels/RecentPredictionsPanel";
import TodaysMatchesPanel from "../panels/TodaysMatchesPanel";
import LeaguesTable from "../tables/LeaguesTable";
import { ThemeContext } from "../../context/ThemeContext";
import { useChipManagement } from "../../context/ChipManagementContext";
import { text } from "../../utils/themeUtils";
import { generatePerformanceInsights, getInsightColorClass } from "../../utils/performanceInsights";
import InsightDetailModal from "../common/InsightDetailModal";
import PredictionBreakdownModal from "../predictions/PredictionBreakdownModal";
import { normalizeTeamName } from "../../utils/teamUtils";
import { useExternalFixtures } from "../../hooks/useExternalFixtures";
import { useUserPredictions } from "../../hooks/useClientSideFixtures";
// Responsive utilities
import { ResponsiveGrid, ResponsiveText, ResponsiveStack } from "../common";
import { textScale, margins, patterns } from "../../utils/mobileScaleUtils";

const DashboardView = ({
  recentPredictions,
  leagues,
  goToPredictions,
  handleEditPrediction,
  handleFixtureSelect,
  navigateToSection,
  // Essential data with new backend structure
  essentialData,
  // Loading states for progressive loading
  essentialLoading = false,
  secondaryLoading = {
    predictions: false,
    leagues: false,
    insights: false,
  },
  // Error states
  errors = {},
}) => {
  // Memoize hook options to prevent unnecessary re-renders
  const externalFixturesOptions = useMemo(() => ({
    fallbackToSample: true,
    staleTime: 15 * 60 * 1000, // 15 minutes for dashboard
    cacheTime: 30 * 60 * 1000, // 30 minutes
  }), []);

  // Fetch external fixtures for real upcoming matches data
  const {
    fixtures: externalFixtures,
    isLoading: externalFixturesLoading,
    isError: externalFixturesError,
    error: externalFixturesErrorDetails,
    refetch: refetchFixtures,
  } = useExternalFixtures(externalFixturesOptions);

  // Fetch user predictions for Recent Predictions panel
  const {
    data: userPredictions = [],
    isLoading: predictionsLoading,
    error: predictionsError,
    refetch: refetchPredictions,
  } = useUserPredictions({
    status: 'all',
    staleTime: 2 * 60 * 1000, // 2 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
  });

  // Get most recent 3 predictions for the panel
  const recentPredictionsData = useMemo(() => {
    if (!userPredictions || userPredictions.length === 0) return [];
    
    return [...userPredictions]
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 3);
  }, [userPredictions]);



  // State for processed upcoming fixtures
  const [upcomingFixtures, setUpcomingFixtures] = useState([]);
  const [todaysMatches, setTodaysMatches] = useState([]);
  const [selectedInsight, setSelectedInsight] = useState(null);
  const [selectedPrediction, setSelectedPrediction] = useState(null);
  const [showBreakdownModal, setShowBreakdownModal] = useState(false);

  // Get chip management context
  const { availableChips, currentGameweek } = useChipManagement();

  // Memoize fixtures array to prevent useEffect from running on reference changes
  const memoizedExternalFixtures = useMemo(() => externalFixtures, [
    externalFixtures?.length,
    externalFixtures?.[0]?.id, // Use first fixture ID as a stable reference
    externalFixturesLoading // Include loading state for more stability
  ]);

  // Process external fixtures to get upcoming matches for dashboard
  useEffect(() => {
    // Don't process if still loading or if we already have processed fixtures
    if (externalFixturesLoading || (upcomingFixtures.length > 0 && memoizedExternalFixtures?.length > 0)) {
      return;
    }
    
    const processFixtures = async () => {
      if (!memoizedExternalFixtures || !Array.isArray(memoizedExternalFixtures)) {
        console.log('📊 DashboardView - No valid fixtures data, setting empty array');
        setUpcomingFixtures([]);
        return;
      }
      
      const now = new Date();
      const upcoming = memoizedExternalFixtures
        .filter(fixture => {
          const fixtureDate = new Date(fixture.date);
          const isUpcoming = fixtureDate > now && 
            (fixture.status === 'SCHEDULED' || fixture.status === 'TIMED');
          
          return isUpcoming;
        })
        .sort((a, b) => {
          // Ensure consistent date sorting - earliest first
          const dateA = new Date(a.date);
          const dateB = new Date(b.date);
          return dateA.getTime() - dateB.getTime();
        })
        .slice(0, 3); // Get next 3 matches for dashboard (earliest first)
      
      const processedFixtures = upcoming.map(fixture => {
        // Find matching prediction if exists
        const userPrediction = userPredictions?.find(p => p.matchId === fixture.id);
        
        return {
          id: fixture.id,
          gameweek: fixture.gameweek,
          homeTeam: normalizeTeamName(fixture.homeTeam),
          awayTeam: normalizeTeamName(fixture.awayTeam),
          date: fixture.date,
          venue: fixture.venue || "Stadium",
          competition: fixture.competition || "Premier League",
          status: fixture.status,
          // Preserve player data for goalscorer selection
          homePlayers: fixture.homePlayers || [],
          awayPlayers: fixture.awayPlayers || [],
          // Include prediction data for edit mode
          userPrediction: userPrediction || null,
          hasPrediction: !!userPrediction,
          predicted: !!userPrediction, // For button display logic
        };
      });
      
      setUpcomingFixtures(processedFixtures);
      
      // Filter today's matches (live or finished today)
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      
      console.log('🔍 Today\'s Matches Filter:', {
        todayStart: today.toISOString(),
        tomorrowStart: tomorrow.toISOString(),
        totalFixtures: memoizedExternalFixtures.length,
        fixtureStatuses: memoizedExternalFixtures.map(f => ({ id: f.id, status: f.status, date: f.date }))
      });
      
      const todaysFixtures = memoizedExternalFixtures
        .filter(fixture => {
          const fixtureDate = new Date(fixture.date);
          const now = new Date();
          const isToday = fixtureDate >= today && fixtureDate < tomorrow;
          
          // Check for live or finished status (multiple possible formats)
          const statusLower = fixture.status?.toLowerCase() || '';
          const hasLiveStatus = 
            // Live statuses
            statusLower === 'live' || 
            statusLower === 'in_progress' || 
            statusLower === 'in_play' ||
            statusLower === 'playing';
          
          const hasFinishedStatus =
            // Finished statuses
            statusLower === 'completed' || 
            statusLower === 'finished' || 
            statusLower === 'ft' ||
            statusLower === 'full_time' ||
            statusLower === 'fulltime';
          
          // WORKAROUND: If status is TIMED/SCHEDULED but kickoff has passed, treat as live
          const kickoffPassed = fixtureDate < now;
          const isScheduledStatus = statusLower === 'timed' || statusLower === 'scheduled';
          const isProbablyLive = isScheduledStatus && kickoffPassed && isToday;
          
          const isLiveOrFinished = hasLiveStatus || hasFinishedStatus || isProbablyLive;
          
          // Removed verbose fixture checking logs
          
          return isToday && isLiveOrFinished;
        })
        .sort((a, b) => {
          // Sort by status first (live first), then by date
          const statusOrder = { 'live': 1, 'in_progress': 1, 'LIVE': 1, 'completed': 2, 'finished': 2, 'FT': 2 };
          const statusA = statusOrder[a.status] || 3;
          const statusB = statusOrder[b.status] || 3;
          
          if (statusA !== statusB) {
            return statusA - statusB;
          }
          
          return new Date(a.date) - new Date(b.date);
        })
        .map(fixture => ({
          id: fixture.id,
          gameweek: fixture.gameweek,
          homeTeam: normalizeTeamName(fixture.homeTeam),
          awayTeam: normalizeTeamName(fixture.awayTeam),
          date: fixture.date,
          venue: fixture.venue || "Stadium",
          competition: fixture.competition || "Premier League",
          status: fixture.status,
          homeScore: fixture.homeScore,
          awayScore: fixture.awayScore,
          // Check if user has made a prediction for this match
          predicted: userPredictions?.some(p => p.fixtureId === fixture.id),
          userPrediction: userPredictions?.find(p => p.fixtureId === fixture.id),
        }));
      
      console.log('📊 Today\'s matches result:', {
        count: todaysFixtures.length,
        matches: todaysFixtures.map(f => ({ home: f.homeTeam, away: f.awayTeam, status: f.status }))
      });
      
      setTodaysMatches(todaysFixtures);
    };

    processFixtures();
  }, [memoizedExternalFixtures, externalFixturesError, externalFixturesLoading, userPredictions]);

  // Auto-refresh for live matches (every 60 seconds)
  useEffect(() => {
    // Only set up refresh if there are live matches
    const hasLiveMatches = todaysMatches.some(m => {
      const statusLower = m.status?.toLowerCase() || '';
      return statusLower === 'live' || 
             statusLower === 'in_progress' || 
             statusLower === 'in_play' ||
             statusLower === 'playing';
    });

    if (!hasLiveMatches) {
      return;
    }

    console.log('⚽ Setting up auto-refresh for live matches (60s interval)');
    
    const refreshInterval = setInterval(() => {
      console.log('🔄 Auto-refreshing fixtures for live match updates...');
      refetchFixtures();
    }, 60 * 1000); // 60 seconds

    return () => {
      console.log('⏹️ Clearing auto-refresh interval');
      clearInterval(refreshInterval);
    };
  }, [todaysMatches, refetchFixtures]);

  // Handler for viewing existing predictions (opens breakdown modal)
  const handleViewPrediction = (match) => {
    if (match.userPrediction) {
      console.log('👁️ Opening prediction breakdown for match:', match.id);
      setSelectedPrediction(match.userPrediction);
      setShowBreakdownModal(true);
    }
  };

  // Handler for closing breakdown modal
  const handleCloseBreakdown = () => {
    setShowBreakdownModal(false);
    setSelectedPrediction(null);
  };

  // Handler for editing from breakdown modal
  const handleEditFromBreakdown = async (prediction) => {
    console.log('✏️ Edit triggered from breakdown modal:', prediction);
    handleCloseBreakdown();
    
    // 🔄 CRITICAL FIX: Refetch predictions to get fresh chip data before editing
    console.log('🔄 Refetching predictions to ensure fresh chip data for edit...');
    let freshPrediction = prediction;
    
    if (refetchPredictions) {
      const refetchResult = await refetchPredictions();
      const freshPredictions = refetchResult.data || userPredictions;
      
      // Find the fresh version of this specific prediction
      freshPrediction = freshPredictions.find(p => p.matchId === prediction.matchId) || prediction;
      
      console.log('✅ Fresh prediction data fetched:', {
        matchId: freshPrediction.matchId,
        match: `${freshPrediction.homeTeam} vs ${freshPrediction.awayTeam}`,
        staleChips: prediction.chips || [],
        freshChips: freshPrediction.chips || [],
        chipsChanged: JSON.stringify(prediction.chips) !== JSON.stringify(freshPrediction.chips)
      });
    } else {
      console.warn('⚠️ refetchPredictions not available, using potentially stale chip data');
    }
    
    console.log('🔍 Searching for match in upcomingFixtures:', {
      matchId: freshPrediction.matchId,
      upcomingFixturesCount: upcomingFixtures.length,
      upcomingFixtureIds: upcomingFixtures.map(f => f.id)
    });
    
    // Find the match in upcomingFixtures (which has player data)
    const match = upcomingFixtures.find(f => f.id === freshPrediction.matchId);
    
    if (match && handleFixtureSelect) {
      console.log('✅ Found match in upcomingFixtures, opening edit modal directly:', {
        matchId: match.id,
        hasPlayers: !!(match.homePlayers?.length || match.awayPlayers?.length),
        homePlayersCount: match.homePlayers?.length || 0,
        awayPlayersCount: match.awayPlayers?.length || 0
      });
      
      // We have the full match data with players, call handleFixtureSelect directly with FRESH data
      handleFixtureSelect(match, [], {
        isEditing: true,
        initialValues: {
          homeScore: freshPrediction.homeScore,
          awayScore: freshPrediction.awayScore,
          homeScorers: freshPrediction.homeScorers || [],
          awayScorers: freshPrediction.awayScorers || [],
          chips: freshPrediction.chips || [],  // ✅ Now using fresh chips
        }
      });
    } else {
      console.warn('⚠️ Match not found in upcomingFixtures or handleFixtureSelect not available, trying handleEditPrediction');
      // Fall back to parent handler which will try to find fixture
      if (handleEditPrediction) {
        handleEditPrediction(freshPrediction);  // Pass fresh prediction
      }
    }
  };

  // Helper function to format match data for the predictions modal (create mode only)
  const formatMatchForPrediction = (match) => {
    console.log('🔧 formatMatchForPrediction:', {
      matchId: match.id,
      hasHomePlayers: !!match.homePlayers,
      hasAwayPlayers: !!match.awayPlayers,
      homePlayersCount: match.homePlayers?.length || 0,
      awayPlayersCount: match.awayPlayers?.length || 0,
    });
    
    return {
      id: match.id,
      homeTeam: normalizeTeamName(match.homeTeam || match.home),
      awayTeam: normalizeTeamName(match.awayTeam || match.away), 
      date: match.date,
      venue: match.venue || "Stadium",
      gameweek: match.gameweek || essentialData?.season?.currentGameweek || 1,
      competition: match.competition || "Premier League",
      // Include player data for goalscorer selection
      homePlayers: match.homePlayers || [],
      awayPlayers: match.awayPlayers || [],
    };
  };

  // Helper functions to format backend data for display
  const formatWeeklyPoints = (weeklyPoints) => {
    if (!weeklyPoints) return { value: "0", subtitle: "This week", badge: null, trend: null };
    
    return {
      value: weeklyPoints.value?.toString() || "0",
      subtitle: "This week",
      badge: weeklyPoints.difference ? {
        text: `${weeklyPoints.difference > 0 ? '+' : ''}${weeklyPoints.difference} from last GW`,
        type: weeklyPoints.difference > 0 ? "success" : weeklyPoints.difference < 0 ? "warning" : "neutral",
      } : null,
      trend: weeklyPoints.difference ? {
        value: `${weeklyPoints.difference > 0 ? '+' : ''}${weeklyPoints.difference}`,
        direction: weeklyPoints.difference > 0 ? "up" : weeklyPoints.difference < 0 ? "down" : "same"
      } : null
    };
  };

  const formatAccuracyRate = (accuracyRate) => {
    if (!accuracyRate) return { value: "0%", subtitle: "No predictions", badge: null };
    
    return {
      value: `${accuracyRate.percentage?.toFixed(0) || 0}%`,
      subtitle: `${accuracyRate.correct || 0} correct predictions`,
      badge: null
    };
  };

  // Helper function to check if user has enough predictions for insights
  const hasEnoughPredictionsForInsights = () => {
    // Check if user has made predictions in 5+ gameweeks
    const totalPredictions = essentialData?.stats?.accuracyRate?.total || 0;
    const currentGameweek = essentialData?.season?.currentGameweek || 1;
    
    // Rough estimate: if they have 15+ total predictions and we're past gameweek 5
    // (assuming ~3 predictions per gameweek on average)
    return totalPredictions >= 15 && currentGameweek >= 5;
  };

  // Generate performance insights based on prediction history
  const getPerformanceInsights = () => {
    if (!hasEnoughPredictionsForInsights()) {
      return [];
    }
    
    // TODO: Fetch real prediction history from API
    // For now, return empty array until API endpoint is available
    const predictionHistory = [];
    const stats = essentialData?.stats || {};
    
    return generatePerformanceInsights(predictionHistory, stats);
  };

  const formatGlobalRank = (globalRank) => {
    if (!globalRank) return { value: "N/A", subtitle: "No ranking", badge: null };
    
    const formatRank = (rank) => {
      if (rank !== undefined && rank !== null && rank >= 1000) {
        return `${(rank / 1000).toFixed(1)}K`;
      }
      return rank?.toString() || "N/A";
    };

    return {
      value: formatRank(globalRank.value),
      subtitle: `Top ${globalRank.percentile?.toFixed(0) || "N/A"}% worldwide`,
      badge: null, // Can add trend data here if available from backend
    };
  };

  // Calculate season progress
  const calculateSeasonProgress = (season) => {
    if (!season || !season.currentGameweek || !season.totalGameweeks) return 0;
    return ((season.currentGameweek / season.totalGameweeks) * 100).toFixed(1);
  };

  // Calculate available chips stats from chip management context
  const getAvailableChipsStats = useMemo(() => {
    if (!availableChips || availableChips.length === 0) {
      return {
        value: "0",
        subtitle: "No chips available",
      };
    }

    const available = availableChips.filter(chip => chip.available);
    const onCooldown = availableChips.filter(chip => !chip.available && chip.remainingGameweeks > 0);
    
    if (available.length === 0) {
      return {
        value: "0",
        subtitle: onCooldown.length > 0 ? `${onCooldown.length} on cooldown` : "No chips ready",
      };
    }

    // Show count of available chips
    return {
      value: available.length.toString(),
      subtitle: available.length === availableChips.length 
        ? "All chips ready" 
        : `${onCooldown.length} on cooldown`,
    };
  }, [availableChips]);

  // Get theme context
  const { theme } = useContext(ThemeContext);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };
  return (
    <ResponsiveStack
      space="normal"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      as={motion.div}
    >
      {/*Header */}
      <motion.div variants={itemVariants} className="relative">
        <div className={`flex items-center justify-between ${margins.bottom.normal}`}>
          <div>
            <ResponsiveText
              variant="h1"
              as="h1"
              className={`${
                theme === "dark" ? "text-teal-100" : "text-teal-700"
              } font-bold font-dmSerif ${margins.bottom.tight}`}
            >
              Welcome back
            </ResponsiveText>
            <ResponsiveText 
              variant="body" 
              className={`${text.secondary[theme]} font-outfit`}
            >
              Let's check your performance and make some predictions
            </ResponsiveText>
          </div>
        </div>
        {/* Progress indicator */}
        <div
          className={`${
            theme === "dark"
              ? "bg-slate-800/30 border-slate-700/50"
              : "bg-white border-slate-200 shadow-sm"
          } rounded-xl p-3 border backdrop-blur-sm`}
        >
          {essentialLoading ? (
            <div className="animate-pulse">
              <div className="flex items-center justify-between mb-1.5">
                <div
                  className={`w-24 h-3 ${
                    theme === "dark" ? "bg-slate-700/50" : "bg-slate-200"
                  } rounded`}
                />
                <div
                  className={`w-16 h-3 ${
                    theme === "dark" ? "bg-slate-700/50" : "bg-slate-200"
                  } rounded`}
                />
              </div>
              <div
                className={`w-full ${
                  theme === "dark" ? "bg-slate-700/50" : "bg-slate-200"
                } rounded-full h-1.5`}
              />
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between mb-1.5">
                <span
                  className={`${
                    theme === "dark" ? "text-white/80" : "text-slate-700"
                  } text-xs font-medium font-outfit`}
                >
                  Season Progress
                </span>
                <span
                  className={`${
                    theme === "dark" ? "text-teal-400" : "text-teal-600"
                  } text-xs font-semibold font-outfit`}
                >
                  GW {essentialData?.season?.currentGameweek || 1} of {essentialData?.season?.totalGameweeks || 38}
                </span>
              </div>
              <div
                className={`w-full ${
                  theme === "dark" ? "bg-slate-700/50" : "bg-slate-200"
                } rounded-full h-1.5`}
              >
                <div
                  className="bg-gradient-to-r from-teal-500 to-indigo-500 h-1.5 rounded-full transition-all duration-1000 ease-out"
                  style={{ width: `${calculateSeasonProgress(essentialData?.season)}%` }}
                />
              </div>
            </>
          )}
        </div>
      </motion.div>{" "}
      {/* Enhanced Stats Cards */}
      <ResponsiveGrid
        variant="stats"
        gap="normal"
        as={motion.div}
        variants={itemVariants}
      >
        {essentialLoading ? (
          // Show skeleton cards while loading essential data
          <>
            <StatCardSkeleton />
            <StatCardSkeleton />
            <StatCardSkeleton />
            <StatCardSkeleton />
          </>
        ) : (
          <>
            {/* Weekly Points - Purple accent */}
            <StatCardOption3
              title="Weekly Points"
              {...formatWeeklyPoints(essentialData?.stats?.weeklyPoints)}
              icon={<MagicWandIcon />}
              accentColor="purple"
            />

            {/* Accuracy Rate - Teal accent */}
            <StatCardOption3
              title="Accuracy Rate"
              {...formatAccuracyRate(essentialData?.stats?.accuracyRate)}
              icon={<TargetIcon />}
              accentColor="teal"
            />

            {/* Available Chips - Amber accent */}
            <StatCardOption3
              title="Available Chips"
              value={getAvailableChipsStats.value}
              subtitle={getAvailableChipsStats.subtitle}
              badge={{
                icon: <InfoCircledIcon />,
                type: "neutral",
              }}
              icon={<LightningBoltIcon />}
              accentColor="amber"
            />

            {/* Global Rank - Blue accent */}
            <StatCardOption3
              title="Global Rank"
              {...formatGlobalRank(essentialData?.stats?.globalRank)}
              icon={<PersonIcon />}
              accentColor="blue"
            />
          </>
        )}
      </ResponsiveGrid>{" "}

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        {/* Main Content - 2/3 width on xl screens */}
        <div className="xl:col-span-2 space-y-5">
          {/* Today's Matches Panel - Live or Finished Today */}
          {todaysMatches && todaysMatches.length > 0 && (
            <motion.div variants={itemVariants}>
              <TodaysMatchesPanel
                matches={todaysMatches}
                onViewAll={() => navigateToSection("fixtures")}
                onViewPrediction={(prediction) => {
                  // TODO: Open prediction detail modal
                  console.log('View prediction:', prediction);
                }}
              />
            </motion.div>
          )}
          
          {/* Upcoming Matches Panel - Using Real External Fixtures Data */}
          <motion.div variants={itemVariants}>
            {externalFixturesLoading ? (
              <PanelSkeleton title="Upcoming Matches" rows={3} />
            ) : upcomingFixtures && upcomingFixtures.length > 0 ? (
              <UpcomingMatchesPanel
                matches={upcomingFixtures}
                onViewAll={() => navigateToSection("fixtures")}
                onPredictMatch={(match) =>
                  goToPredictions(formatMatchForPrediction(match))
                }
                onViewPrediction={handleViewPrediction}
              />
            ) : externalFixturesError ? (
              <DashboardEmptyState
                type="matches"
                title="Unable to load fixtures"
                message="There was an issue loading upcoming matches. Please try again later."
                action={{
                  label: "View All Fixtures",
                  onClick: () => navigateToSection("fixtures")
                }}
              />
            ) : (
              <DashboardEmptyState
                type="matches"
                action={{
                  label: "View All Fixtures",
                  onClick: () => navigateToSection("fixtures")
                }}
              />
            )}
          </motion.div>

          {/* Recent Predictions Panel */}
          <motion.div variants={itemVariants}>
            {predictionsLoading ? (
              <PanelSkeleton title="Recent Predictions" rows={3} />
            ) : recentPredictionsData && recentPredictionsData.length > 0 ? (
              <RecentPredictionsPanel
                predictions={recentPredictionsData}
                onViewAll={() => navigateToSection("predictions")}
              />
            ) : (
              <DashboardEmptyState
                type="predictions"
                action={{
                  label: "Make Predictions",
                  onClick: () => navigateToSection("fixtures")
                }}
              />
            )}
          </motion.div>
        </div>

        {/* Sidebar - 1/3 width on xl screens */}
        <div className="space-y-5">
          {/* My Leagues */}
          <motion.div variants={itemVariants}>
            {secondaryLoading.leagues ? (
              <PanelSkeleton title="My Leagues" rows={3} />
            ) : leagues && leagues.length > 0 ? (
              <LeaguesTable
                leagues={leagues}
                onViewAll={() => navigateToSection("leagues")}
                onViewLeague={(leagueId) =>
                  navigateToSection("leagues", { leagueId })
                }
              />
            ) : (
              <DashboardEmptyState
                type="leagues"
                action={{
                  label: "Browse Leagues",
                  onClick: () => navigateToSection("leagues")
                }}
              />
            )}
          </motion.div>
          {/* Performance Insights */}
          <motion.div variants={itemVariants}>
            {secondaryLoading.insights ? (
              <div
                className={`${
                  theme === "dark"
                    ? "bg-slate-800/30 border-slate-700/50"
                    : "bg-white border-slate-200 shadow-sm"
                } backdrop-blur-sm rounded-xl p-5 border font-outfit`}
              >
                <div className="animate-pulse">
                  <div className="flex items-center gap-2 mb-3">
                    <div
                      className={`w-4 h-4 ${
                        theme === "dark" ? "bg-slate-700/50" : "bg-slate-200"
                      } rounded`}
                    />
                    <div
                      className={`w-32 h-4 ${
                        theme === "dark" ? "bg-slate-700/50" : "bg-slate-200"
                      } rounded`}
                    />
                  </div>
                  <div className="space-y-3">
                    {[1, 2, 3].map((index) => (
                      <div
                        key={index}
                        className={`flex items-center justify-between p-2.5 ${
                          theme === "dark" ? "bg-slate-700/30" : "bg-slate-100"
                        } rounded-lg`}
                      >
                        <div className="flex items-center gap-2.5">
                          <div
                            className={`w-1.5 h-1.5 ${
                              theme === "dark" ? "bg-slate-600/50" : "bg-slate-300"
                            } rounded-full`}
                          />
                          <div
                            className={`w-24 h-3 ${
                              theme === "dark" ? "bg-slate-600/50" : "bg-slate-300"
                            } rounded`}
                          />
                        </div>
                        <div
                          className={`w-8 h-3 ${
                            theme === "dark" ? "bg-slate-600/50" : "bg-slate-300"
                          } rounded`}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : hasEnoughPredictionsForInsights() ? (
              <div
                className={`${
                  theme === "dark"
                    ? "bg-slate-800/30 border-slate-700/50"
                    : "bg-white border-slate-200 shadow-sm"
                } backdrop-blur-sm rounded-xl p-5 border font-outfit`}
              >
                <div className="flex items-center gap-2 mb-3">
                  <LightningBoltIcon
                    className={`w-4 h-4 ${
                      theme === "dark" ? "text-amber-400" : "text-amber-500"
                    }`}
                  />
                  <h3
                    className={`${
                      theme === "dark" ? "text-teal-200" : "text-teal-700"
                    } font-semibold font-outfit text-md`}
                  >
                    Performance Insights
                  </h3>
                </div>
                <div className="space-y-3">
                  {getPerformanceInsights().length > 0 ? (
                    getPerformanceInsights().map((insight, index) => {
                      const colorClasses = getInsightColorClass(insight.color, theme);
                      return (
                        <div
                          key={insight.id || index}
                          className={`flex items-center justify-between p-2.5 ${
                            theme === "dark" ? "bg-slate-700/30" : "bg-slate-100"
                          } rounded-lg group cursor-pointer hover:bg-opacity-80 transition-colors`}
                          title={insight.description}
                          onClick={() => setSelectedInsight(insight)}
                        >
                          <div className="flex items-center gap-2.5">
                            <div className={`w-1.5 h-1.5 ${colorClasses.dot} rounded-full`}></div>
                            <span
                              className={`${
                                theme === "dark" ? "text-white/80" : "text-slate-700"
                              } text-xs`}
                            >
                              {insight.title}
                            </span>
                          </div>
                          <span
                            className={`${colorClasses.text} text-xs font-medium`}
                          >
                            {insight.value}
                          </span>
                        </div>
                      );
                    })
                  ) : (
                    // Fallback to static insights if generation fails
                    <>
                      <div
                        className={`flex items-center justify-between p-2.5 ${
                          theme === "dark" ? "bg-slate-700/30" : "bg-slate-100"
                        } rounded-lg`}
                      >
                        <div className="flex items-center gap-2.5">
                          <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
                          <span
                            className={`${
                              theme === "dark" ? "text-white/80" : "text-slate-700"
                            } text-xs`}
                          >
                            Strong home predictions
                          </span>
                        </div>
                        <span
                          className={`${
                            theme === "dark" ? "text-green-400" : "text-green-600"
                          } text-xs font-medium`}
                        >
                          +23%
                        </span>
                      </div>

                      <div
                        className={`flex items-center justify-between p-2.5 ${
                          theme === "dark" ? "bg-slate-700/30" : "bg-slate-100"
                        } rounded-lg`}
                      >
                        <div className="flex items-center gap-2.5">
                          <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
                          <span
                            className={`${
                              theme === "dark" ? "text-white/80" : "text-slate-700"
                            } text-xs`}
                          >
                            Arsenal specialist
                          </span>
                        </div>
                        <span
                          className={`${
                            theme === "dark" ? "text-blue-400" : "text-blue-600"
                          } text-xs font-medium`}
                        >
                          87%
                        </span>
                      </div>

                      <div
                        className={`flex items-center justify-between p-2.5 ${
                          theme === "dark" ? "bg-slate-700/30" : "bg-slate-100"
                        } rounded-lg`}
                      >
                        <div className="flex items-center gap-2.5">
                          <div className="w-1.5 h-1.5 bg-amber-400 rounded-full"></div>
                          <span
                            className={`${
                              theme === "dark" ? "text-white/80" : "text-slate-700"
                            } text-xs`}
                          >
                            Weekend warrior
                          </span>
                        </div>
                        <span
                          className={`${
                            theme === "dark" ? "text-amber-400" : "text-amber-600"
                          } text-xs font-medium`}
                        >
                          +18%
                        </span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            ) : (
              <DashboardEmptyState
                type="insights"
                title="Insights Coming Soon"
                message="Keep making predictions! Performance insights will unlock after you complete 5+ gameweeks of predictions."
              />
            )}
          </motion.div>
        </div>
      </div>

      {/* Insight Detail Modal */}
      <InsightDetailModal
        insight={selectedInsight}
        isOpen={!!selectedInsight}
        onClose={() => setSelectedInsight(null)}
      />

      {/* Prediction Breakdown Modal */}
      {showBreakdownModal && selectedPrediction && (
        <PredictionBreakdownModal
          prediction={selectedPrediction}
          isOpen={showBreakdownModal}
          onClose={handleCloseBreakdown}
          onEdit={handleEditFromBreakdown}
        />
      )}
    </ResponsiveStack>
  );
};

export default DashboardView;
