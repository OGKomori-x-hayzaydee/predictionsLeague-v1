/**
 * React Query Hooks for Chip Data
 * Provides cached, reactive chip state management
 * 
 * Note: Only uses GET /chips/status endpoint.
 * Backend handles validation and recording internally when predictions are submitted.
 */

import { useQuery, useQueryClient } from '@tanstack/react-query';
import { chipAPI } from '../services/api/chipAPI';
import { CHIP_CONFIG } from '../utils/chipManager';
import { 
  getActiveGameweekChips, 
  getActiveChipsDetailed,
  isChipActiveInGameweek,
  calculateActivationGameweek,
  getChipActivationStatus
} from '../utils/chipActivation';

// Query keys
export const CHIP_QUERY_KEYS = {
  STATUS: 'chip-status'
};

/**
 * Hook to fetch and cache chip status
 * @param {Object} options - Query options
 * @returns {Object} Query result with chip data
 */
export const useChipStatus = (options = {}) => {
  const {
    enabled = true,
    refetchInterval = false,
    staleTime = 30 * 1000, // 30 seconds
    cacheTime = 5 * 60 * 1000 // 5 minutes
  } = options;

  return useQuery({
    queryKey: [CHIP_QUERY_KEYS.STATUS],
    queryFn: async () => {
      const result = await chipAPI.getChipStatus();
      
      if (!result.success) {
        throw new Error(result.error?.message || 'Failed to fetch chip status');
      }
      
      // Merge backend data with frontend CHIP_CONFIG to add missing fields (scope, etc.)
      const enhancedData = {
        ...result.data,
        chips: (result.data?.chips || []).map(backendChip => {
          // Try direct match first, then try various conversions
          let chipId = backendChip.chipId;
          let config = CHIP_CONFIG[chipId];
          
          // If not found, try converting from various backend formats
          if (!config && chipId) {
            // Convert UPPER_SNAKE_CASE or snake_case to camelCase
            const normalized = chipId
              .toLowerCase()
              .replace(/_([a-z])/g, (g) => g[1].toUpperCase());
            
            config = CHIP_CONFIG[normalized];
            if (config) {
              chipId = normalized;
            }
          }
          
          if (!config) {
            console.warn(`⚠️ Unknown chip from backend:`, backendChip.chipId);
            return { ...backendChip, scope: 'unknown' };
          }
          
          // Merge backend state with frontend config
          return {
            ...config,
            ...backendChip,
            id: chipId,
            chipId,
            // Ensure critical fields from config aren't overwritten
            scope: config.scope,
            name: config.name,
            description: config.description,
            icon: config.icon,
            color: config.color
          };
        })
      };
      
      // Add Double Down - Always available, no backend tracking needed
      const hasDoubleDown = enhancedData.chips.some(chip => 
        chip.chipId === 'doubleDown' || chip.id === 'doubleDown'
      );
      
      if (!hasDoubleDown) {
        const doubleDownConfig = CHIP_CONFIG.doubleDown;
        enhancedData.chips.push({
          ...doubleDownConfig,
          id: 'doubleDown',
          chipId: 'doubleDown',
          available: true,
          reason: 'Available',
          usageCount: 0,
          seasonLimit: null,
          remainingUses: null,
          cooldownExpires: null,
          remainingGameweeks: 0
        });
      }
      
      // Add logging to track chip status
      console.log('🎯 CHIP DETAILS:', enhancedData.chips);
      console.log('✅ Chip status fetched successfully', {
        chipsCount: enhancedData.chips.length,
        availableCount: enhancedData.chips.filter(c => c.available).length,
        currentGameweek: enhancedData.currentGameweek,
        currentSeason: enhancedData.currentSeason
      });
      
      return enhancedData;
    },
    enabled,
    refetchInterval,
    staleTime,
    cacheTime,
    retry: 2,
    onError: (error) => {
      console.error('❌ useChipStatus error:', error);
    }
  });
};

/**
 * Helper hook that combines status and provides computed values
 * This is the main hook used throughout the app
 * 
 * @returns {Object} Enhanced chip data with helpers
 */
export const useChips = () => {
  const queryClient = useQueryClient();
  const { data, isLoading, error, refetch } = useChipStatus();

  /**
   * Manually refresh chip status
   * Use this after prediction submission to update chip availability
   */
  const refresh = () => {
    queryClient.invalidateQueries([CHIP_QUERY_KEYS.STATUS]);
    return refetch();
  };

  // Calculate active gameweek chips
  const currentGameweek = data?.currentGameweek || 1;
  const activeGameweekChipIds = data?.chips 
    ? getActiveGameweekChips(data.chips, currentGameweek)
    : [];
  const activeGameweekChipsDetailed = data?.chips
    ? getActiveChipsDetailed(data.chips, currentGameweek)
    : [];

  return {
    // Data
    chips: data?.chips || [],
    currentGameweek,
    currentSeason: data?.currentSeason || '2025',
    
    // Active chip tracking (derived from cooldown state)
    activeGameweekChips: activeGameweekChipIds, // Array of chip IDs active this gameweek
    activeGameweekChipsDetailed, // Array of objects with full details
    hasActiveGameweekChips: activeGameweekChipIds.length > 0,
    
    // Helpers
    getChip: (chipId) => data?.chips?.find(c => c.chipId === chipId) || null,
    isAvailable: (chipId) => {
      const chip = data?.chips?.find(c => c.chipId === chipId);
      return chip?.available || false;
    },
    getAvailableChips: () => data?.chips?.filter(c => c.available) || [],
    getUnavailableChips: () => data?.chips?.filter(c => !c.available) || [],
    
    // Activation helpers
    isChipActive: (chipId) => {
      const chip = data?.chips?.find(c => c.chipId === chipId);
      return chip ? isChipActiveInGameweek(chip, currentGameweek) : false;
    },
    getActivationGameweek: (chipId) => {
      const chip = data?.chips?.find(c => c.chipId === chipId);
      return chip ? calculateActivationGameweek(chip, currentGameweek) : null;
    },
    getChipStatus: (chipId) => {
      const chip = data?.chips?.find(c => c.chipId === chipId);
      return chip ? getChipActivationStatus(chip, currentGameweek) : null;
    },
    
    // Actions
    refresh,
    
    // State
    isLoading,
    error
  };
};
