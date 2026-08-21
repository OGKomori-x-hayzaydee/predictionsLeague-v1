/**
 * Client-Side Hybrid Fixtures Hook
 * Combines external fixtures with user predictions client-side
 */

import { useMemo } from 'react';
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

const EMPTY_STATS = {
  total: 0,
  predicted: 0,
  unpredicted: 0,
  predictionRate: 0,
  byCompetition: {},
  byStatus: {}
};

const EMPTY_VALIDATION = {
  validFixtures: 0,
  invalidFixtures: 0,
  fixtureErrors: [],
  predictionErrors: [],
  warnings: []
};

function mergeHybridFixtures(externalFixtures, predictions, { includeUnpredicted, sortByDate, filters }) {
  if (!externalFixtures.length) {
    return {
      fixtures: [],
      stats: EMPTY_STATS,
      validation: EMPTY_VALIDATION,
      meta: {
        totalFixtures: 0,
        predictedFixtures: 0,
        predictionRate: 0,
        processedAt: new Date().toISOString(),
        dataQuality: 1,
        isEmpty: true
      }
    };
  }

  let fixtures = clientSideDataService.dataMerging.mergeFixturesWithPredictions(
    externalFixtures,
    predictions,
    { includeUnpredicted, sortByDate }
  );

  if (filters && Object.keys(filters).length > 0) {
    fixtures = clientSideDataService.dataMerging.filterMergedFixtures(fixtures, filters);
  }

  const stats = clientSideDataService.dataMerging.calculatePredictionStats(fixtures);
  const validation = clientSideDataService.dataValidation.validateMergedFixtures(fixtures);

  return {
    fixtures,
    stats,
    validation,
    meta: {
      totalFixtures: fixtures.length,
      predictedFixtures: stats.predicted,
      predictionRate: stats.predictionRate,
      processedAt: new Date().toISOString(),
      dataQuality: validation.totalFixtures
        ? validation.validFixtures / validation.totalFixtures
        : 1
    }
  };
}

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

  const filterKey = JSON.stringify(filters);
  const merged = useMemo(() => {
    if (userPredictions === undefined) return null;
    return mergeHybridFixtures(
      externalData?.fixtures || [],
      userPredictions || [],
      { includeUnpredicted, sortByDate, filters }
    );
  }, [externalData, userPredictions, includeUnpredicted, sortByDate, filterKey]);

  const isLoading = externalLoading || predictionsLoading || (enabled && merged === null);
  const hasError = externalIsError && !fallbackToSample;
  const error = hasError ? externalError : null;

  const fixtures = merged?.fixtures || [];
  const stats = merged?.stats || null;
  const validation = merged?.validation || null;
  const meta = merged?.meta || null;

  return {
    fixtures,
    stats,
    validation,
    meta,
    isLoading,
    isError: hasError,
    error,
    dataQuality: {
      externalAPIAvailable: !externalIsError,
      predictionsAPIAvailable: !predictionsError,
      usingFallback: externalData?.source === 'fallback-sample',
      totalFixtures: fixtures.length,
      predictedFixtures: stats?.predicted || 0,
      predictionRate: stats?.predictionRate || 0,
      validationScore: validation?.validFixtures / Math.max(validation?.totalFixtures, 1) || 0
    },
    rawData: {
      external: externalData,
      predictions: userPredictions,
      hybrid: merged
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
    queryClient.invalidateQueries({ queryKey: [HYBRID_QUERY_KEYS.USER_PREDICTIONS] });
  };

  const invalidateUserPredictions = () => {
    queryClient.invalidateQueries({ queryKey: [HYBRID_QUERY_KEYS.USER_PREDICTIONS] });
  };

  const refreshHybridData = () => {
    queryClient.invalidateQueries({ queryKey: [HYBRID_QUERY_KEYS.USER_PREDICTIONS] });
    queryClient.invalidateQueries({ queryKey: ['external-fixtures'] });
  };

  const clearHybridCache = () => {
    queryClient.removeQueries({ queryKey: [HYBRID_QUERY_KEYS.USER_PREDICTIONS] });
    queryClient.removeQueries({ queryKey: ['external-fixtures'] });
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
