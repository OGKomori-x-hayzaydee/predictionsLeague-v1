/**
 * Hook for managing team logos
 * Provides caching, preloading, and batch operations
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import { getTeamLogo, getTeamLogoSync, preloadAllLogos, PREMIER_LEAGUE_TEAMS } from '../utils/teamLogos';

const LOGO_CACHE_KEY = 'team_logos_cache_v2';
const CACHE_EXPIRY = 7 * 24 * 60 * 60 * 1000; // 7 days

export const useTeamLogos = (options = {}) => {
  const {
    preload = false,
    teams = [],
    cacheEnabled = true
  } = options;

  const [logoCache, setLogoCache] = useState(new Map());
  const [isPreloading, setIsPreloading] = useState(false);
  const [preloadProgress, setPreloadProgress] = useState(0);

  // Load cache from localStorage on mount
  useEffect(() => {
    if (!cacheEnabled) return;

    try {
      const cached = localStorage.getItem(LOGO_CACHE_KEY);
      if (cached) {
        const { data, timestamp } = JSON.parse(cached);
        const age = Date.now() - timestamp;
        
        if (age < CACHE_EXPIRY) {
          setLogoCache(new Map(Object.entries(data)));
          console.log('✅ Loaded team logos from cache:', Object.keys(data).length);
        } else {
          localStorage.removeItem(LOGO_CACHE_KEY);
          console.log('🗑️ Expired logo cache removed');
        }
      }
    } catch (error) {
      console.warn('Failed to load logo cache:', error);
      localStorage.removeItem(LOGO_CACHE_KEY);
    }
  }, [cacheEnabled]);

  // Save cache to localStorage when it changes
  useEffect(() => {
    if (!cacheEnabled || logoCache.size === 0) return;

    try {
      const cacheData = {
        data: Object.fromEntries(logoCache),
        timestamp: Date.now()
      };
      localStorage.setItem(LOGO_CACHE_KEY, JSON.stringify(cacheData));
    } catch (error) {
      console.warn('Failed to save logo cache:', error);
    }
  }, [logoCache, cacheEnabled]);

  // Get logo for a single team
  const getLogoForTeam = useCallback(async (teamName, logoOptions = {}) => {
    if (!teamName) return null;

    // Check cache first
    const cacheKey = `${teamName}_${JSON.stringify(logoOptions)}`;
    if (logoCache.has(cacheKey)) {
      return logoCache.get(cacheKey);
    }

    try {
      const logo = await getTeamLogo(teamName, logoOptions);
      
      // Update cache
      setLogoCache(prev => new Map(prev).set(cacheKey, logo));
      
      return logo;
    } catch (error) {
      console.warn(`Failed to get logo for ${teamName}:`, error);
      return getTeamLogoSync(teamName, { ...logoOptions, useFallback: true });
    }
  }, [logoCache]);

  // Get logo synchronously (from cache or immediate fallback)
  const getLogoSync = useCallback((teamName, logoOptions = {}) => {
    if (!teamName) return null;

    const cacheKey = `${teamName}_${JSON.stringify(logoOptions)}`;
    if (logoCache.has(cacheKey)) {
      return logoCache.get(cacheKey);
    }

    return getTeamLogoSync(teamName, logoOptions);
  }, [logoCache]);

  // Preload logos for all teams or specified teams
  const preloadLogos = useCallback(async (teamList = PREMIER_LEAGUE_TEAMS) => {
    setIsPreloading(true);
    setPreloadProgress(0);

    try {
      const results = [];
      for (let i = 0; i < teamList.length; i++) {
        const team = teamList[i];
        try {
          const logo = await getTeamLogo(team);
          setLogoCache(prev => new Map(prev).set(team, logo));
          results.push({ team, success: true, logo });
        } catch (error) {
          results.push({ team, success: false, error: error.message });
        }
        
        setPreloadProgress(Math.round(((i + 1) / teamList.length) * 100));
      }

      console.log('🎯 Logo preload completed:', {
        total: teamList.length,
        successful: results.filter(r => r.success).length,
        failed: results.filter(r => !r.success).length
      });

      return results;
    } catch (error) {
      console.error('Logo preload failed:', error);
      return [];
    } finally {
      setIsPreloading(false);
    }
  }, []);

  // Preload on mount if enabled
  useEffect(() => {
    if (preload) {
      preloadLogos(teams.length > 0 ? teams : undefined);
    }
  }, [preload, teams, preloadLogos]);

  // Clear cache
  const clearCache = useCallback(() => {
    setLogoCache(new Map());
    localStorage.removeItem(LOGO_CACHE_KEY);
    console.log('🧹 Logo cache cleared');
  }, []);

  // Get logos for multiple teams
  const getLogosForTeams = useCallback(async (teamList) => {
    const results = {};
    
    await Promise.all(
      teamList.map(async (team) => {
        try {
          results[team] = await getLogoForTeam(team);
        } catch (error) {
          results[team] = getTeamLogoSync(team, { useFallback: true });
        }
      })
    );

    return results;
  }, [getLogoForTeam]);

  // Stats about cached logos
  const cacheStats = useMemo(() => ({
    size: logoCache.size,
    teams: Array.from(logoCache.keys()),
    coverage: logoCache.size / PREMIER_LEAGUE_TEAMS.length * 100
  }), [logoCache]);

  return {
    getLogoForTeam,
    getLogoSync,
    getLogosForTeams,
    preloadLogos,
    clearCache,
    
    // State
    isPreloading,
    preloadProgress,
    cacheStats,
    
    // Utils
    logoCache: Object.fromEntries(logoCache),
    hasCachedLogo: (teamName) => logoCache.has(teamName)
  };
};

export default useTeamLogos;