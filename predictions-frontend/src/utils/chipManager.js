/**
 * Client-Side Chip Management System
 * Handles chip cooldowns, usage limits, and availability tracking
 */

/**
 * Compatibility Rules Configuration
 * Set STRICT_MODE = true to enforce restrictions (potential paywall feature)
 * Set STRICT_MODE = false for permissive rules (free tier)
 */
export const COMPATIBILITY_RULES = {
  STRICT_MODE: false, // Set to true to enforce restrictions below
  
  // Strict mode restrictions (disabled by default):
  PREVENT_MULTIPLIER_STACKING: false,    // If true: Can't use Wildcard + Double Down
  PREVENT_MULTIPLE_GAMEWEEK_CHIPS: false, // If true: Only one gameweek chip at a time
  MAX_CHIPS_PER_PREDICTION: null,         // If set: Limit total chips (e.g., 2)
  
  // These would apply in strict mode:
  INCOMPATIBLE_PAIRS: [
    // ['wildcard', 'doubleDown'],  // Uncomment to prevent multiplier stacking
  ],
  
  INCOMPATIBLE_SCOPES: [
    // 'gameweek',  // Uncomment to prevent multiple gameweek chips
  ]
};

/**
 * Chip Configuration with cooldown and usage rules
 */
export const CHIP_CONFIG = {
  doubleDown: {
    id: "doubleDown",
    name: "Double Down",
    type: "match",
    description: "Double all points earned from one selected match",
    icon: "2x",
    color: "teal",
    cooldown: 0, // Available every gameweek - no cooldown
    seasonLimit: null, // Unlimited uses
    gameweekLimit: 1, // Can only be used once per gameweek
    scope: "match" // Applied per match
  },
  wildcard: {
    id: "wildcard",
    name: "Wildcard",
    type: "match",
    description: "Triple all points earned from one selected match",
    icon: "3x",
    color: "purple",
    cooldown: 7, // Can't use for 7 gameweeks after usage
    seasonLimit: null, // Unlimited uses (respecting cooldown)
    scope: "match"
  },
  scorerFocus: {
    id: "scorerFocus",
    name: "Scorer Focus",
    type: "match",
    description: "Doubles all points from goalscorer predictions in one match",
    icon: "⚽",
    color: "green",
    cooldown: 5, // Can't use for 5 gameweeks after usage
    seasonLimit: null,
    scope: "match"
  },
  defensePlusPlus: {
    id: "defensePlusPlus",
    name: "Defense++",
    type: "gameweek",
    description: "Earn 10 bonus points if you correctly predict clean sheets across all matches where you predicted them",
    icon: "🛡️",
    color: "blue",
    cooldown: 5, // Can't use for 5 gameweeks after usage
    seasonLimit: null,
    scope: "gameweek"
  },
  allInWeek: {
    id: "allInWeek",
    name: "All-In Week",
    type: "gameweek",
    description: "Doubles the entire gameweek score (including deductions)",
    icon: "🎯",
    color: "red",
    cooldown: 0, // No cooldown
    seasonLimit: 4, // Can only use 4 times per season
    scope: "gameweek"
  }
};

import { chipAPI } from '../services/api/chipAPI';

/**
 * ChipManager Class - Backend-driven chip state management
 * NOW A THIN WRAPPER around chipAPI.js
 * 
 * NOTE: No caching here - React Query handles all caching at the hook level
 */
export class ChipManager {
  constructor(userId) {
    this.userId = userId;
  }

  /**
   * Fetch chip state from backend
   * @returns {Promise<Object>} Chip state from server
   */
  async fetchState() {
    try {
      const result = await chipAPI.getChipStatus();
      
      if (!result.success) {
        throw new Error(result.error?.message || 'Failed to fetch chip state');
      }
      
      return result.data;
    } catch (error) {
      console.error('❌ Failed to fetch chip state:', error);
      throw error;
    }
  }

  /**
   * Get chip availability for a specific gameweek
   * @param {string} chipId - Chip identifier
   * @param {number} currentGameweek - Current gameweek number (optional - uses backend's current GW)
   * @returns {Promise<Object>} Availability status with reason
   */
  async getChipAvailability(chipId, currentGameweek = null) {
    try {
      const state = await this.fetchState();
      const chip = state.chips.find(c => c.chipId === chipId);
      
      if (!chip) {
        return { available: false, reason: 'Unknown chip' };
      }

      return {
        available: chip.available,
        reason: chip.available ? 'Available' : chip.reason || 'Unavailable',
        usageCount: chip.usageCount,
        seasonLimit: chip.seasonLimit,
        remainingUses: chip.remainingUses,
        cooldownExpires: chip.cooldownExpires,
        remainingGameweeks: chip.remainingGameweeks
      };
    } catch (error) {
      console.error('❌ getChipAvailability error:', error);
      return { available: false, reason: 'Error fetching chip data' };
    }
  }

  /**
   * Get all available chips for a gameweek
   * @param {number} currentGameweek - Current gameweek number (optional)
   * @param {string} scope - Filter by scope: 'match' or 'gameweek'
   * @returns {Promise<Array>} Array of available chip objects with availability info
   */
  async getAvailableChips(currentGameweek = null, scope = null) {
    try {
      const state = await this.fetchState();
      
      let chips = state.chips || [];
      
      // Filter by scope if specified
      if (scope) {
        chips = chips.filter(chip => chip.scope === scope);
      }
      
      return chips;
    } catch (error) {
      console.error('❌ getAvailableChips error:', error);
      return [];
    }
  }

  /**
   * Local compatibility check (frontend-only validation)
   * Used for UI feedback before submission
   * @param {Array} chipIds - Array of chip IDs to check
   * @returns {Object} Compatibility check result
   */
  checkChipCompatibilityLocal(chipIds) {
    // If not in strict mode, allow all combinations
    if (!COMPATIBILITY_RULES.STRICT_MODE) {
      return {
        compatible: true,
        reason: 'All chip combinations allowed',
        strictMode: false
      };
    }

    // STRICT MODE CHECKS (for premium/paywall features)
    
    // Check max chips limit
    if (COMPATIBILITY_RULES.MAX_CHIPS_PER_PREDICTION !== null) {
      if (chipIds.length > COMPATIBILITY_RULES.MAX_CHIPS_PER_PREDICTION) {
        return {
          compatible: false,
          reason: `Maximum ${COMPATIBILITY_RULES.MAX_CHIPS_PER_PREDICTION} chips per prediction`,
          conflictingChips: chipIds,
          strictMode: true
        };
      }
    }

    // Check for incompatible pairs
    if (COMPATIBILITY_RULES.PREVENT_MULTIPLIER_STACKING) {
      if (chipIds.includes('wildcard') && chipIds.includes('doubleDown')) {
        return {
          compatible: false,
          reason: 'Wildcard and Double Down cannot be used together (Premium feature)',
          conflictingChips: ['wildcard', 'doubleDown'],
          strictMode: true,
          upgradeMessage: 'Upgrade to stack multipliers!'
        };
      }
    }

    // Check for multiple gameweek chips
    if (COMPATIBILITY_RULES.PREVENT_MULTIPLE_GAMEWEEK_CHIPS) {
      const gameweekChips = chipIds.filter(id => CHIP_CONFIG[id]?.scope === 'gameweek');
      if (gameweekChips.length > 1) {
        return {
          compatible: false,
          reason: 'Cannot use multiple gameweek chips together (Premium feature)',
          conflictingChips: gameweekChips,
          strictMode: true,
          upgradeMessage: 'Upgrade to use multiple gameweek chips!'
        };
      }
    }

    // Check explicit incompatible pairs
    for (const [chip1, chip2] of COMPATIBILITY_RULES.INCOMPATIBLE_PAIRS) {
      if (chipIds.includes(chip1) && chipIds.includes(chip2)) {
        return {
          compatible: false,
          reason: `${CHIP_CONFIG[chip1]?.name} and ${CHIP_CONFIG[chip2]?.name} cannot be used together`,
          conflictingChips: [chip1, chip2],
          strictMode: true
        };
      }
    }

    return {
      compatible: true,
      reason: 'Chips can be used together',
      strictMode: true
    };
  }
}

/**
 * Get chip manager instance (singleton per user)
 */
const chipManagers = new Map();

export function getChipManager(userId) {
  if (!userId) {
    throw new Error('User ID required for chip manager');
  }

  if (!chipManagers.has(userId)) {
    chipManagers.set(userId, new ChipManager(userId));
  }

  return chipManagers.get(userId);
}

/**
 * Helper function to format chip cooldown display
 */
export function formatCooldownDisplay(cooldownInfo) {
  if (!cooldownInfo || !cooldownInfo.remainingGameweeks) {
    return null;
  }

  const gw = cooldownInfo.remainingGameweeks;
  return `${gw} GW${gw > 1 ? 's' : ''}`;
}

/**
 * Helper function to format season limit display
 */
export function formatSeasonLimitDisplay(chipId, usageCount) {
  const config = CHIP_CONFIG[chipId];
  if (!config || config.seasonLimit === null) {
    return null;
  }

  const remaining = config.seasonLimit - usageCount;
  return `${remaining}/${config.seasonLimit} left`;
}

/**
 * Toggle strict mode for chip compatibility
 * Use this for premium/paywall features
 * @param {boolean} enabled - Whether to enable strict mode
 */
export function setStrictMode(enabled) {
  COMPATIBILITY_RULES.STRICT_MODE = enabled;
  console.log(`🔒 Chip strict mode ${enabled ? 'ENABLED' : 'DISABLED'}`);
  
  if (enabled) {
    console.log('   Restrictions active:');
    if (COMPATIBILITY_RULES.PREVENT_MULTIPLIER_STACKING) {
      console.log('   - Cannot stack multipliers (Wildcard + Double Down)');
    }
    if (COMPATIBILITY_RULES.PREVENT_MULTIPLE_GAMEWEEK_CHIPS) {
      console.log('   - Only one gameweek chip at a time');
    }
    if (COMPATIBILITY_RULES.MAX_CHIPS_PER_PREDICTION) {
      console.log(`   - Max ${COMPATIBILITY_RULES.MAX_CHIPS_PER_PREDICTION} chips per prediction`);
    }
  } else {
    console.log('   ✅ All chip combinations allowed');
  }
}

/**
 * Enable premium chip restrictions (for paywall)
 */
export function enablePremiumRestrictions() {
  COMPATIBILITY_RULES.STRICT_MODE = true;
  COMPATIBILITY_RULES.PREVENT_MULTIPLIER_STACKING = true;
  COMPATIBILITY_RULES.PREVENT_MULTIPLE_GAMEWEEK_CHIPS = true;
  COMPATIBILITY_RULES.MAX_CHIPS_PER_PREDICTION = 2;
  
  console.log('💎 Premium chip restrictions enabled');
}

/**
 * Disable all restrictions (free tier)
 */
export function disablePremiumRestrictions() {
  COMPATIBILITY_RULES.STRICT_MODE = false;
  COMPATIBILITY_RULES.PREVENT_MULTIPLIER_STACKING = false;
  COMPATIBILITY_RULES.PREVENT_MULTIPLE_GAMEWEEK_CHIPS = false;
  COMPATIBILITY_RULES.MAX_CHIPS_PER_PREDICTION = null;
  
  console.log('🆓 Free tier - all chip combinations allowed');
}

/**
 * Export all chip IDs for convenience
 */
export const CHIP_IDS = Object.keys(CHIP_CONFIG);

/**
 * Check if a chip is a match-scoped chip
 * @param {string} chipId - Chip identifier
 * @returns {boolean} True if chip is match-scoped
 */
export function isMatchChip(chipId) {
  const chip = CHIP_CONFIG[chipId];
  return chip?.scope === 'match';
}

/**
 * Check if a chip is a gameweek-scoped chip
 * @param {string} chipId - Chip identifier
 * @returns {boolean} True if chip is gameweek-scoped
 */
export function isGameweekChip(chipId) {
  const chip = CHIP_CONFIG[chipId];
  return chip?.scope === 'gameweek';
}

/**
 * Count match chips in a chip array
 * @param {Array<string>} chipIds - Array of chip IDs
 * @returns {number} Number of match chips
 */
export function countMatchChips(chipIds) {
  if (!Array.isArray(chipIds)) return 0;
  return chipIds.filter(isMatchChip).length;
}

/**
 * Count gameweek chips in a chip array
 * @param {Array<string>} chipIds - Array of chip IDs
 * @returns {number} Number of gameweek chips
 */
export function countGameweekChips(chipIds) {
  if (!Array.isArray(chipIds)) return 0;
  return chipIds.filter(isGameweekChip).length;
}

export default ChipManager;
