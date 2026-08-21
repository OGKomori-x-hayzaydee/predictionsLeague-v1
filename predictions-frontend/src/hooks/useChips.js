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

      // chipAPI already normalizes seasonLimit/remainingUses/ids.
      // Re-assert static CHIP_CONFIG fields so backend 0 cannot overwrite unlimited.
      const chips = (result.data?.chips || []).map((chip) => {
        const config = CHIP_CONFIG[chip.chipId];
        if (!config) return chip;
        return {
          ...chip,
          scope: config.scope,
          name: config.name,
          description: config.description,
          icon: config.icon,
          color: config.color,
          seasonLimit: chip.seasonLimit ?? config.seasonLimit ?? null,
        };
      });

      return {
        ...result.data,
        chips,
      };
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
    queryClient.invalidateQueries({ queryKey: [CHIP_QUERY_KEYS.STATUS] });
    return refetch();
  };

  // Status payload often omits currentGameweek; callers should fall back
  // to fixtures/dashboard season week rather than assuming GW 1.
  const reportedGameweek = data?.currentGameweek;
  const currentGameweek = reportedGameweek || 1;
  const activeGameweekChipIds = data?.chips 
    ? getActiveGameweekChips(data.chips, currentGameweek)
    : [];
  const activeGameweekChipsDetailed = data?.chips
    ? getActiveChipsDetailed(data.chips, currentGameweek)
    : [];

  return {
    // Data
    chips: data?.chips || [],
    currentGameweek: reportedGameweek ?? null,
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
