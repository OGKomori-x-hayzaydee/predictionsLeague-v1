/**
 * Hook for calculating and caching next match information
 * Uses fixtures data and caches until match time elapses
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useExternalFixtures } from './useExternalFixtures';
import { getNextMatchWithTime, calculateTimeUntilMatch } from '../utils/nextMatchUtils';

const NEXT_MATCH_CACHE_KEY = 'next_match_cache';

/**
 * Hook that provides next match info with smart caching
 */
export const useNextMatch = () => {
  const [cachedNextMatch, setCachedNextMatch] = useState(null);
  const [timeDisplay, setTimeDisplay] = useState('Loading...');
  const [isLive, setIsLive] = useState(false);

  // Get fixtures data (already cached by React Query)
  const { 
    fixtures, 
    isLoading: fixturesLoading, 
    isError: fixturesError,
    dataUpdatedAt 
  } = useExternalFixtures({
    fallbackToSample: true,
    staleTime: 10 * 60 * 1000, // 10 minutes - longer since we just need next match
  });

  // Load cached next match from localStorage
  const loadCachedNextMatch = useCallback(() => {
    try {
      const cached = localStorage.getItem(NEXT_MATCH_CACHE_KEY);
      if (cached) {
        const parsedCache = JSON.parse(cached);
        
        // Check if cache is still valid (before match time)
        const matchTime = new Date(parsedCache.nextMatchTime);
        const now = new Date();
        
        if (matchTime > now) {
          // Silently use cached match - removed verbose logging
          return parsedCache;
        } else {
          // Cached match expired, clearing cache
          localStorage.removeItem(NEXT_MATCH_CACHE_KEY);
        }
      }
    } catch (error) {
      // Failed to load cached next match - clearing
      localStorage.removeItem(NEXT_MATCH_CACHE_KEY);
    }
    return null;
  }, []);

  // Save next match to cache
  const saveCachedNextMatch = useCallback((nextMatch) => {
    try {
      localStorage.setItem(NEXT_MATCH_CACHE_KEY, JSON.stringify(nextMatch));
      console.log('💾 Cached next match:', nextMatch);
    } catch (error) {
      console.warn('Failed to cache next match:', error);
    }
  }, []);

  // Calculate next match from fixtures
  const calculateNextMatch = useCallback(() => {
    if (!fixtures || fixtures.length === 0) {
      return null;
    }

    console.log('🔄 Calculating next match from fixtures...');
    const nextMatch = getNextMatchWithTime(fixtures);
    
    if (nextMatch) {
      // Save to cache
      saveCachedNextMatch(nextMatch);
      console.log('✅ Next match calculated:', nextMatch);
    }
    
    return nextMatch;
  }, [fixtures, saveCachedNextMatch]);

  // Determine current next match (cached or calculated)
  const nextMatch = useMemo(() => {
    // First try cached version
    const cached = cachedNextMatch || loadCachedNextMatch();
    
    // If we have valid cached data, use it
    if (cached) {
      const matchTime = new Date(cached.nextMatchTime);
      if (matchTime > new Date()) {
        return cached;
      }
    }
    
    // Otherwise calculate from fixtures if available
    if (fixtures && fixtures.length > 0) {
      return calculateNextMatch();
    }
    
    return null;
  }, [fixtures, cachedNextMatch, loadCachedNextMatch, calculateNextMatch]);

  // Update time display every minute
  useEffect(() => {
    const updateTimeDisplay = () => {
      if (!nextMatch?.nextMatchTime) {
        setTimeDisplay('No matches');
        setIsLive(false);
        return;
      }

      const timeInfo = calculateTimeUntilMatch(nextMatch.nextMatchTime);
      setTimeDisplay(timeInfo.timeDisplay);
      setIsLive(timeInfo.isLive);

      // If match has started, clear cache and recalculate
      if (timeInfo.isLive && !isLive) {
        console.log('🔴 Match is now live, clearing cache...');
        localStorage.removeItem(NEXT_MATCH_CACHE_KEY);
        setCachedNextMatch(null);
      }
    };

    // Update immediately
    updateTimeDisplay();

    // Update every minute
    const interval = setInterval(updateTimeDisplay, 60 * 1000);

    return () => clearInterval(interval);
  }, [nextMatch, isLive]);

  // Update cached next match when fixtures change
  useEffect(() => {
    if (fixtures && fixtures.length > 0) {
      const calculated = calculateNextMatch();
      if (calculated) {
        setCachedNextMatch(calculated);
      }
    }
  }, [fixtures, calculateNextMatch, dataUpdatedAt]);

  // Clear cache function for manual refresh
  const clearCache = useCallback(() => {
    console.log('🧹 Clearing next match cache...');
    localStorage.removeItem(NEXT_MATCH_CACHE_KEY);
    setCachedNextMatch(null);
  }, []);

  // Return hook data
  return {
    nextMatch,
    timeDisplay,
    isLive,
    isLoading: fixturesLoading && !nextMatch,
    isError: fixturesError && !nextMatch,
    clearCache,
    
    // Additional data for debugging/info
    debug: {
      hasFixtures: fixtures?.length > 0,
      fixturesCount: fixtures?.length || 0,
      isCached: !!cachedNextMatch,
      lastDataUpdate: dataUpdatedAt
    }
  };
};

export default useNextMatch;