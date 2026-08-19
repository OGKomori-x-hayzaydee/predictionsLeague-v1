/**
 * Chip API Service
 * Handles all chip-related backend communication
 * 
 * Backend endpoint:
 * - GET /chips/status
 * 
 * Note: Backend handles validation, recording usage, and history internally.
 * Frontend only needs to fetch status.
 */

import { apiCall } from './baseAPI';

/**
 * Chip API Service
 */
export const chipAPI = {
  /**
   * Get current chip status for the user
   * Returns availability, cooldowns, usage counts, etc.
   * 
   * Backend returns:
   * {
   *   chips: [
   *     {
   *       chipId: "wildcard",
   *       available: true/false,
   *       reason: "On cooldown" / "Available" / "Season limit reached",
   *       remainingGameweeks: 3, // For cooldowns
   *       seasonUsageCount: 2,
   *       seasonLimit: null,
   *       lastUsedGameweek: 5,
   *       config: { ... chip config ... }
   *     }
   *   ],
   *   currentGameweek: 8,
   *   currentSeason: "2025"
   * }
   */
  async getChipStatus() {
    try {
      const response = await apiCall({
        method: 'GET',
        url: '/chips/status'
      });

      console.log('🔍 RAW CHIP STATUS RESPONSE:', {
        fullResponse: JSON.parse(JSON.stringify(response)),
        hasData: !!response.data,
        dataType: typeof response.data,
        dataKeys: response.data ? Object.keys(response.data) : [],
        chipsArray: response.data?.chips,
        chipsCount: response.data?.chips?.length || 0,
        currentGameweek: response.data?.currentGameweek,
        currentSeason: response.data?.currentSeason
      });

      // Log each chip in detail
      if (response.data?.chips) {
        console.log('🎯 CHIP DETAILS:', response.data.chips.map(chip => ({
          chipId: chip.chipId,
          name: chip.name,
          available: chip.available,
          reason: chip.reason,
          scope: chip.scope,
          usageCount: chip.usageCount,
          seasonLimit: chip.seasonLimit,
          remainingUses: chip.remainingUses,
          cooldownExpires: chip.cooldownExpires,
          remainingGameweeks: chip.remainingGameweeks,
          lastUsedGameweek: chip.lastUsedGameweek // For chips without cooldowns
        })));
      }

      console.log('✅ Chip status fetched successfully', {
        chipsCount: response.data?.chips?.length || 0,
        availableCount: response.data?.chips?.filter(c => c.available)?.length || 0,
        currentGameweek: response.data?.currentGameweek
      });

      return {
        success: true,
        data: response.data,
        error: null
      };
    } catch (error) {
      console.error('❌ Failed to fetch chip status', {
        error: error.message,
        stack: error.stack
      });

      return {
        success: false,
        data: null,
        error: {
          message: error.message,
          type: 'CHIP_STATUS_ERROR',
          timestamp: new Date().toISOString()
        }
      };
    }
  }
};

export default chipAPI;
