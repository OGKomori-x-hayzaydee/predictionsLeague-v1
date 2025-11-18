/**
 * Main Fixtures Hook - Consolidated Interface
 * 
 * This is the primary hook for consuming fixture data in components.
 * It provides a clean, consolidated interface that internally manages:
 * - External fixtures data (via backend proxy)
 * - User predictions data 
 * - Client-side data merging
 * - Error handling and fallbacks
 */

// Re-export specialized hooks for advanced use cases
export { 
  useExternalFixtures,
  useTodaysFixtures, 
  useLiveFixtures,
  useUpcomingFixtures,
  usePremierLeagueAndChampionsLeagueFixtures,
  useMultipleCompetitions,
  useCompetitionInfo,
  useFixturesByTeam,
  useExternalAPIStatus
} from './useExternalFixtures';

export {
  useUserPredictions 
} from './useClientSideFixtures';

// Main fixtures hook - this is what most components should use
export { useClientSideFixtures as useFixtures } from './useClientSideFixtures';

// Backwards compatibility - keep the original name available
export { useClientSideFixtures } from './useClientSideFixtures';

// Default export for convenience
export { useClientSideFixtures as default } from './useClientSideFixtures';

/**
 * Hook Hierarchy & Usage Guide:
 * 
 * 🎯 PRIMARY HOOK (Use this in most components):
 * - useFixtures() - Main hook with external fixtures + user predictions merged
 * 
 * 🔧 SPECIALIZED HOOKS (For specific use cases):
 * - useExternalFixtures() - External fixture data only
 * - useTodaysFixtures() - Today's matches only
 * - useLiveFixtures() - Live/in-progress matches with real-time updates
 * - useUpcomingFixtures() - Future matches only
 * - useUserPredictions() - User prediction data only
 * 
 * 📊 UTILITY HOOKS:
 * - useExternalAPIStatus() - API health monitoring
 * - useMultipleCompetitions() - Multiple competition fixtures
 * - useCompetitionInfo() - Competition metadata
 * - useFixturesByTeam() - Team-specific fixtures
 */
