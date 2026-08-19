/**
 * React Query Hook for Chip Validation
 * Provides memoized validation of predictions against active gameweek chips
 */

import { useQuery } from '@tanstack/react-query';
import { validatePredictionsWithActiveChips, isDismissed } from '../utils/chipValidation';

/**
 * Hook to validate predictions have all active gameweek chips applied
 * Uses React Query for automatic memoization and caching
 * 
 * @param {Array} predictions - User's predictions
 * @param {Array<string>} activeGameweekChips - Active chip IDs (from chip management)
 * @param {number} currentGameweek - Current gameweek number
 * @returns {Object} - React Query result with validation data
 */
export const useChipValidation = (predictions, activeGameweekChips, currentGameweek) => {
  return useQuery({
    // Query key includes all dependencies
    queryKey: [
      'chip-validation',
      predictions?.length || 0, // Use length to avoid array reference changes
      activeGameweekChips?.join(',') || '', // Serialize array to string
      currentGameweek
    ],
    
    // Query function is a pure calculation (no API call)
    queryFn: () => {
      const validationResult = validatePredictionsWithActiveChips(
        predictions,
        activeGameweekChips,
        currentGameweek
      );
      
      // Check if user dismissed this notification
      const dismissed = isDismissed(currentGameweek, activeGameweekChips);
      
      return {
        ...validationResult,
        dismissed,
        // Helper to check if banner should show
        shouldShow: validationResult.needsSync && !dismissed
      };
    },
    
    // Only run validation if we have the necessary data
    enabled: !!(
      predictions && 
      predictions.length > 0 && 
      activeGameweekChips && 
      activeGameweekChips.length > 0 &&
      currentGameweek > 0
    ),
    
    // Cache validation result for 5 minutes
    staleTime: 5 * 60 * 1000,
    
    // Keep cached for 10 minutes after component unmounts
    cacheTime: 10 * 60 * 1000,
    
    // Don't refetch on window focus (validation is data-driven)
    refetchOnWindowFocus: false,
    
    // Don't refetch on reconnect (validation is client-side)
    refetchOnReconnect: false,
    
    // Retry disabled (not a network request)
    retry: false
  });
};

/**
 * Query key factory for manual invalidation
 */
export const chipValidationKeys = {
  all: ['chip-validation'],
  forGameweek: (gameweek) => ['chip-validation', { gameweek }],
  forChips: (chips) => ['chip-validation', { chips: chips.join(',') }]
};
