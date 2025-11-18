/**
 * Client-Side Hybrid Fixtures Hook
 * Combines external fixtures with user predictions client-side
 */

import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useExternalFixtures } from './useExternalFixtures';
import { clientSideDataService } from '../utils/clientSideDataMerging';
import { userPredictionsAPI } from '../services/api/userPredictionsAPI';

// Query keys
const HYBRID_QUERY_KEYS = {
  HYBRID_FIXTURES: 'hybrid-fixtures',
  USER_PREDICTIONS: 'user-predictions',
  PREDICTION_STATUS: 'prediction-status'
};

/**
 * Hook for user predictions data
 */
export const useUserPredictions = (options = {}) => {
  const {
    status = 'upcoming',
    enabled = true,
    staleTime = 2 * 60 * 1000, // 2 minutes
    cacheTime = 10 * 60 * 1000 // 10 minutes
  } = options;

  return useQuery({
    queryKey: [HYBRID_QUERY_KEYS.USER_PREDICTIONS, status],
    queryFn: async () => {
      try {
        // This would call the backend API for user predictions
        // For now, return empty array as backend is not implemented yet
        const result = await userPredictionsAPI.getAllUserPredictions({ status });
        
        if (!result.success) {
          throw new Error(result.error?.message || 'Failed to fetch user predictions');
        }

        return result.data || [];
      } catch (error) {
        console.warn('User predictions API not available, using empty predictions', {
          error: error.message
        });
        // Return empty array if backend not available
        return [];
      }
    },
    enabled,
    staleTime,
    cacheTime,
    retry: false // Don't retry if backend not available
  });
};

/**
 * Main hook for hybrid fixtures (external + user predictions)
 */
export const useClientSideFixtures = (options = {}) => {
  const {
    enabled = true,
    fallbackToSample = true,
    includeUnpredicted = true,
    sortByDate = true,
    filters = {}
  } = options;

  // Fetch external fixtures (simplified to current gameweek only)
  const {
    data: externalData,
    isLoading: externalLoading,
    error: externalError,
    isError: externalIsError
  } = useExternalFixtures({
    enabled,
    fallbackToSample
  });

  // Fetch user predictions
  const {
    data: userPredictions,
    isLoading: predictionsLoading,
    error: predictionsError
  } = useUserPredictions({
    enabled
  });

  // Combine the data using React Query
  const hybridQuery = useQuery({
    queryKey: [
      HYBRID_QUERY_KEYS.HYBRID_FIXTURES, 
      { filters }
    ],
    queryFn: async () => {
      console.log('🔍 useClientSideFixtures - externalData:', externalData);
      console.log('🔍 useClientSideFixtures - externalData?.fixtures:', externalData?.fixtures);
      console.log('🔍 useClientSideFixtures - externalData?.fixtures?.length:', externalData?.fixtures?.length);
      
      const externalFixtures = externalData?.fixtures || [];
      const predictions = userPredictions || [];
      
      console.log('📊 Processing:', { 
        externalFixturesCount: externalFixtures.length, 
        predictionsCount: predictions.length 
      });

      // Handle empty external fixtures case
      if (externalFixtures.length === 0) {
        console.log('No external fixtures available, returning empty state');
        return {
          success: true,
          data: {
            fixtures: [],
            stats: {
              total: 0,
              predicted: 0,
              unpredicted: 0,
              predictionRate: 0,
              byCompetition: {},
              byStatus: {}
            },
            validation: { validFixtures: 0, invalidFixtures: 0, fixtureErrors: [], predictionErrors: [], warnings: [] },
            meta: {
              totalFixtures: 0,
              predictedFixtures: 0,
              predictionRate: 0,
              processedAt: new Date().toISOString(),
              dataQuality: 1,
              isEmpty: true
            }
          }
        };
      }

      // Process the merged data
      const result = await clientSideDataService.processMergedData(
        externalFixtures,
        predictions,
        { includeUnpredicted, sortByDate }
      );

      // Apply additional filters if provided
      if (Object.keys(filters).length > 0) {
        const filteredFixtures = clientSideDataService.dataMerging.filterMergedFixtures(
          result.data.fixtures,
          filters
        );

        result.data.fixtures = filteredFixtures;
        result.data.stats = clientSideDataService.dataMerging.calculatePredictionStats(filteredFixtures);
        result.data.meta.totalFixtures = filteredFixtures.length;
      }

      return result;
    },
    enabled: enabled && !externalLoading && userPredictions !== undefined,
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 30 * 60 * 1000, // 30 minutes
    refetchOnWindowFocus: false
  });

  // Determine loading state
  const isLoading = externalLoading || predictionsLoading || hybridQuery.isLoading;
  
  // Determine error state
  const hasError = externalIsError && !fallbackToSample;
  const error = hasError ? externalError : hybridQuery.error;

  // Extract data
  const data = hybridQuery.data?.success ? hybridQuery.data.data : null;
  const fixtures = data?.fixtures || [];
  const stats = data?.stats || null;
  const validation = data?.validation || null;
  const meta = data?.meta || null;

  return {
    // Data
    fixtures,
    stats,
    validation,
    meta,
    
    // State
    isLoading,
    isError: hasError || hybridQuery.isError,
    error,
    
    // Data quality indicators
    dataQuality: {
      externalAPIAvailable: !externalIsError,
      predictionsAPIAvailable: !predictionsError,
      usingFallback: externalData?.source === 'fallback-sample',
      totalFixtures: fixtures.length,
      predictedFixtures: stats?.predicted || 0,
      predictionRate: stats?.predictionRate || 0,
      validationScore: validation?.validFixtures / Math.max(validation?.totalFixtures, 1) || 0
    },
    
    // Raw data for debugging
    rawData: {
      external: externalData,
      predictions: userPredictions,
      hybrid: hybridQuery.data
    }
  };
};

/**
 * Hook for today's hybrid fixtures
 */
export const useTodaysHybridFixtures = (options = {}) => {
  const today = new Date().toISOString().split('T')[0];
  
  return useClientSideFixtures({
    dateFrom: today,
    dateTo: today,
    competitions: ['PL', 'CL'], // Only PL and CL
    ...options
  });
};

/**
 * Hook for upcoming hybrid fixtures (next 7 days)
 */
export const useUpcomingHybridFixtures = (options = {}) => {
  const today = new Date();
  const nextWeek = new Date();
  nextWeek.setDate(today.getDate() + 7);

  return useClientSideFixtures({
    dateFrom: today.toISOString().split('T')[0],
    dateTo: nextWeek.toISOString().split('T')[0],
    status: 'SCHEDULED',
    ...options
  });
};

/**
 * Hook for Premier League and Champions League hybrid fixtures
 */
export const usePremierLeagueAndChampionsLeagueHybridFixtures = (options = {}) => {
  return useClientSideFixtures({
    competitions: ['PL', 'CL'],
    ...options
  });
};

/**
 * Hook for predicted fixtures only
 */
export const usePredictedFixtures = (options = {}) => {
  return useClientSideFixtures({
    includeUnpredicted: false,
    filters: { predicted: true },
    ...options
  });
};

/**
 * Hook for unpredicted fixtures only
 */
export const useUnpredictedFixtures = (options = {}) => {
  return useClientSideFixtures({
    filters: { predicted: false },
    ...options
  });
};

/**
 * Hook for fixtures by team
 */
export const useTeamHybridFixtures = (teamName, options = {}) => {
  return useClientSideFixtures({
    filters: { teams: [teamName] },
    enabled: !!teamName,
    ...options
  });
};

/**
 * Hook for fixtures by gameweek
 */
export const useGameweekHybridFixtures = (gameweek, options = {}) => {
  return useClientSideFixtures({
    filters: { gameweek },
    enabled: !!gameweek,
    ...options
  });
};

/**
 * Hook for hybrid fixtures management utilities
 */
export const useHybridFixturesUtils = () => {
  const queryClient = useQueryClient();

  const invalidateAllHybridData = () => {
    queryClient.invalidateQueries([HYBRID_QUERY_KEYS.HYBRID_FIXTURES]);
    queryClient.invalidateQueries([HYBRID_QUERY_KEYS.USER_PREDICTIONS]);
  };

  const invalidateUserPredictions = () => {
    queryClient.invalidateQueries([HYBRID_QUERY_KEYS.USER_PREDICTIONS]);
  };

  const refreshHybridData = () => {
    queryClient.refetchQueries([HYBRID_QUERY_KEYS.HYBRID_FIXTURES]);
  };

  const clearHybridCache = () => {
    queryClient.removeQueries([HYBRID_QUERY_KEYS.HYBRID_FIXTURES]);
    queryClient.removeQueries([HYBRID_QUERY_KEYS.USER_PREDICTIONS]);
  };

  const preloadHybridFixtures = async (options = {}) => {
    await queryClient.prefetchQuery({
      queryKey: [HYBRID_QUERY_KEYS.HYBRID_FIXTURES, options],
      queryFn: () => {
        // This would trigger the data fetching for the specified options
        return null;
      },
      staleTime: 10 * 60 * 1000
    });
  };

  return {
    invalidateAllHybridData,
    invalidateUserPredictions,
    refreshHybridData,
    clearHybridCache,
    preloadHybridFixtures
  };
};

/**
 * Hook for hybrid fixtures statistics
 */
export const useHybridFixturesStats = (options = {}) => {
  const { fixtures, stats, isLoading, isError } = useClientSideFixtures(options);

  // Enhanced statistics
  const enhancedStats = stats ? {
    ...stats,
    
    // Prediction insights
    predictionInsights: {
      mostPredictedCompetition: Object.entries(stats.byCompetition)
        .sort(([,a], [,b]) => b.predicted - a.predicted)[0]?.[0] || null,
      
      highestPredictionRate: Math.max(
        ...Object.values(stats.byCompetition).map(comp => comp.predictionRate)
      ),
      
      upcomingDeadlines: fixtures
        .filter(f => !f.predicted && f.status === 'SCHEDULED')
        .sort((a, b) => new Date(a.date) - new Date(b.date))
        .slice(0, 5)
        .map(f => ({
          id: f.id,
          homeTeam: f.homeTeam,
          awayTeam: f.awayTeam,
          date: f.date,
          competition: f.competition
        }))
    },
    
    // Performance metrics
    performance: {
      dataFreshness: new Date().toISOString(),
      averageResponseTime: null, // Could track this
      cacheHitRate: null // Could track this
    }
  } : null;

  return {
    stats: enhancedStats,
    isLoading,
    isError,
    hasData: !!stats
  };
};

// Export query keys for external use
export { HYBRID_QUERY_KEYS };

export default {
  useClientSideFixtures,
  useUserPredictions,
  useTodaysHybridFixtures,
  useUpcomingHybridFixtures,
  usePremierLeagueAndChampionsLeagueHybridFixtures,
  usePredictedFixtures,
  useUnpredictedFixtures,
  useTeamHybridFixtures,
  useGameweekHybridFixtures,
  useHybridFixturesUtils,
  useHybridFixturesStats,
  HYBRID_QUERY_KEYS
};
