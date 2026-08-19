/**
 * Custom hook for fixtures data - Simplified for current gameweek only
 * Integrates backend fixtures API with React Query
 */

import React from 'react';
import { useQuery, useQueries, useQueryClient } from '@tanstack/react-query';
import { externalFixturesAPI, fixtureFilters } from '../services/api/externalFixturesAPI';

// Query keys for React Query
const QUERY_KEYS = {
  EXTERNAL_FIXTURES: 'external-fixtures',
  LIVE_FIXTURES: 'live-fixtures'
};

/**
 * Hook for fetching fixtures from external API with caching
 */
export const useExternalFixtures = (options = {}) => {
  const {
    enabled = true,
    fallbackToSample = true,
    refetchInterval = 30 * 60 * 1000, // 30 minutes
    staleTime = 10 * 60 * 1000, // 10 minutes
    cacheTime = 60 * 60 * 1000 // 1 hour
  } = options;

  const query = useQuery({
    queryKey: [QUERY_KEYS.EXTERNAL_FIXTURES],
    queryFn: async () => {
      try {
        const result = await externalFixturesAPI.getFixtures();

        if (!result.success) {
          throw new Error(result.error?.message || 'Failed to fetch external fixtures');
        }

        return result.data;
      } catch (error) {        
        // No fallback - always throw error to show proper error states
        throw error;
      }
    },
    enabled,
    staleTime,
    cacheTime,
    refetchInterval,
    refetchOnWindowFocus: false,
    retry: (failureCount, error) => {
      // Don't retry rate limit errors
      if (error.message.includes('Rate limit')) {
        return false;
      }
      return failureCount < 2;
    }
  });

  return {
    ...query,
    fixtures: query.data?.fixtures || []
  };
};

/**
 * Hook for fetching today's fixtures (client-side filtered from main fixtures)
 */
export const useTodaysFixtures = (options = {}) => {
  const { data: allFixtures, ...query } = useExternalFixtures(options);
  
  const todaysFixtures = React.useMemo(() => {
    if (!allFixtures?.fixtures) return null;
    
    return {
      ...allFixtures,
      fixtures: fixtureFilters.getTodaysFixtures(allFixtures.fixtures)
    };
  }, [allFixtures]);

  return {
    data: todaysFixtures,
    ...query
  };
};



/**
 * Hook for fetching live fixtures with real-time updates
 */
export const useLiveFixtures = (options = {}) => {
  const {
    enabled = true,
    refetchInterval = 30 * 1000 // 30 seconds for live matches
  } = options;

  return useQuery({
    queryKey: [QUERY_KEYS.LIVE_FIXTURES],
    queryFn: async () => {
      const result = await externalFixturesAPI.getLiveFixtures();
      
      if (!result.success) {
        throw new Error(result.error?.message || 'Failed to fetch live fixtures');
      }

      return result.data;
    },
    enabled,
    staleTime: 30 * 1000, // 30 seconds
    cacheTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval,
    refetchOnWindowFocus: true
  });
};





/**
 * Hook for external API status monitoring
 */
export const useExternalAPIStatus = () => {
  const queryClient = useQueryClient();

  const status = externalFixturesAPI.getAPIStatus();

  const invalidateAllQueries = () => {
    queryClient.invalidateQueries([QUERY_KEYS.EXTERNAL_FIXTURES]);
    queryClient.invalidateQueries([QUERY_KEYS.LIVE_FIXTURES]);
  };

  const clearCache = () => {
    queryClient.clear();
  };

  return {
    status,
    invalidateAllQueries,
    clearCache,
    isConfigured: status.configured,
    rateLimitStatus: status.rateLimit
  };
};

/**
 * Utility function to transform external fixtures for compatibility
 */
export const useFixtureCompatibility = () => {
  const transformForLegacyComponents = (externalFixtures) => {
    return externalFixtures.map(fixture => ({
      // Legacy format compatibility
      id: fixture.id,
      home: fixture.homeTeam,
      away: fixture.awayTeam,
      date: fixture.date,
      venue: fixture.venue,
      competition: fixture.competition,
      gameweek: fixture.gameweek,
      referee: fixture.referee,
      predicted: fixture.predicted || false,
      
      // Extended data
      ...fixture
    }));
  };

  const transformFromSample = (sampleFixtures) => {
    return sampleFixtures.map(fixture => ({
      // Convert sample format to external format
      id: fixture.id,
      externalId: fixture.id,
      homeTeam: fixture.home,
      awayTeam: fixture.away,
      home: fixture.home,
      away: fixture.away,
      date: fixture.date,
      venue: fixture.venue,
      competition: fixture.competition,
      gameweek: fixture.gameweek,
      referee: fixture.referee,
      status: 'SCHEDULED',
      predicted: fixture.predicted || false,
      userPrediction: fixture.userPrediction || null,
      source: 'sample-data',
      lastUpdated: new Date().toISOString()
    }));
  };

  return {
    transformForLegacyComponents,
    transformFromSample
  };
};

// Export query keys for external use
export { QUERY_KEYS };

export default {
  useExternalFixtures,
  useTodaysFixtures,
  useLiveFixtures,
  useExternalAPIStatus,
  useFixtureCompatibility,
  QUERY_KEYS
};
