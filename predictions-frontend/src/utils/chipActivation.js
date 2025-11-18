/**
 * Chip Activation Calculator
 * Derives which gameweek chips are currently active based on cooldown state
 * 
 * Logic:
 * - If remainingGameweeks < cooldown period → chip is currently in cooldown
 * - If chip is in cooldown → it was activated in (currentGameweek - (cooldown - remainingGameweeks))
 * - If activation gameweek === currentGameweek → chip is ACTIVE this gameweek
 */

import { CHIP_CONFIG } from './chipManager';

/**
 * Calculate which gameweek a chip was activated based on cooldown state or lastUsedGameweek
 * @param {Object} chip - Chip object from /chips/status
 * @param {number} currentGameweek - Current gameweek number
 * @returns {number|null} - Gameweek when chip was activated, or null if not active
 */
export function calculateActivationGameweek(chip, currentGameweek) {
  const { chipId, remainingGameweeks, available, lastUsedGameweek } = chip;

  // Get chip config to check cooldown period
  const config = CHIP_CONFIG[chipId];
  if (!config) {
    return null;
  }

  // 🔧 PRIMARY SOURCE: Use lastUsedGameweek if provided by backend
  // This is the most reliable source of truth
  if (lastUsedGameweek !== undefined && lastUsedGameweek !== null) {
    // Only return it if the chip is actually in cooldown or was used this gameweek
    // Don't return old usage if chip is now available again
    if (!available || lastUsedGameweek === currentGameweek) {
      return lastUsedGameweek;
    }
  }

  // 🔧 FIX: For chips with no cooldown (e.g., All-In Week), can't determine activation from cooldown
  if (config.cooldown === 0) {
    return null;
  }

  // FALLBACK: Cooldown-based calculation (less reliable due to currentGameweek inconsistencies)
  // If chip is available, it's not in cooldown
  if (available) {
    return null;
  }

  // If remaining gameweeks is undefined or null, can't calculate
  if (remainingGameweeks === undefined || remainingGameweeks === null) {
    return null;
  }

  // Calculate: If cooldown is 5 and remaining is 4, chip was used 1 gameweek ago
  const gameweeksSinceActivation = config.cooldown - remainingGameweeks;
  const activationGameweek = currentGameweek - gameweeksSinceActivation;

  // Validate the calculation makes sense
  if (activationGameweek < 1 || activationGameweek > currentGameweek) {
    console.warn('⚠️ Invalid activation gameweek calculated:', {
      chipId,
      currentGameweek,
      cooldown: config.cooldown,
      remainingGameweeks,
      calculated: activationGameweek,
      lastUsedGameweek
    });
    return null;
  }

  return activationGameweek;
}

/**
 * Check if a chip is currently active in the current gameweek
 * @param {Object} chip - Chip object from /chips/status
 * @param {number} currentGameweek - Current gameweek number
 * @returns {boolean} - True if chip is active this gameweek
 */
export function isChipActiveInGameweek(chip, currentGameweek) {
  const activationGameweek = calculateActivationGameweek(chip, currentGameweek);
  
  if (activationGameweek === null) {
    return false;
  }
  
  // Chip is active if it was activated THIS gameweek
  return activationGameweek === currentGameweek;
}

/**
 * Get all chips that are currently active in the current gameweek
 * @param {Array} chips - Array of chip objects from /chips/status
 * @param {number} currentGameweek - Current gameweek number
 * @returns {Array} - Array of active chip IDs
 */
export function getActiveGameweekChips(chips, currentGameweek) {
  if (!chips || !Array.isArray(chips)) {
    return [];
  }
  
  const activeChips = chips
    .filter(chip => {
      const config = CHIP_CONFIG[chip.chipId];
      // Only check gameweek-scoped chips
      if (!config || config.scope !== 'gameweek') {
        return false;
      }
      
      return isChipActiveInGameweek(chip, currentGameweek);
    })
    .map(chip => chip.chipId);
  
  console.log('🎯 Active gameweek chips calculated:', {
    currentGameweek,
    totalChips: chips.length,
    gameweekChips: chips.filter(c => CHIP_CONFIG[c.chipId]?.scope === 'gameweek').length,
    activeChips,
    activeChipCount: activeChips.length,
    calculations: chips
      .filter(c => CHIP_CONFIG[c.chipId]?.scope === 'gameweek')
      .map(c => {
        const activationGW = calculateActivationGameweek(c, currentGameweek);
        const isActive = isChipActiveInGameweek(c, currentGameweek);
        return {
          chipId: c.chipId,
          available: c.available,
          remainingGameweeks: c.remainingGameweeks,
          lastUsedGameweek: c.lastUsedGameweek,
          cooldown: CHIP_CONFIG[c.chipId]?.cooldown,
          activationGW,
          isActive,
          reason: !isActive ? (c.available ? 'Available' : `Last used GW${c.lastUsedGameweek || '?'}`) : `Active in GW${activationGW}`
        };
      })
  });
  
  return activeChips;
}

/**
 * Get detailed info about active chips
 * @param {Array} chips - Array of chip objects from /chips/status
 * @param {number} currentGameweek - Current gameweek number
 * @returns {Array} - Array of objects with chip details
 */
export function getActiveChipsDetailed(chips, currentGameweek) {
  if (!chips || !Array.isArray(chips)) {
    return [];
  }
  
  return chips
    .filter(chip => {
      const config = CHIP_CONFIG[chip.chipId];
      // Only gameweek-scoped chips can be "active"
      return config?.scope === 'gameweek' && isChipActiveInGameweek(chip, currentGameweek);
    })
    .map(chip => {
      const config = CHIP_CONFIG[chip.chipId];
      const activationGameweek = calculateActivationGameweek(chip, currentGameweek);
      
      return {
        chipId: chip.chipId,
        name: config.name,
        description: config.description,
        icon: config.icon,
        color: config.color,
        activatedInGameweek: activationGameweek,
        remainingGameweeks: chip.remainingGameweeks,
        expiresInGameweek: currentGameweek + chip.remainingGameweeks
      };
    });
}

/**
 * Check if a specific chip is active right now (for any scope)
 * For match-scoped chips, this checks if it was used on a specific match
 * For gameweek-scoped chips, this checks if it's active this gameweek
 * 
 * @param {string} chipId - Chip ID to check
 * @param {Array} predictionChips - Chips applied to a specific prediction
 * @param {Array} allChips - All chips from /chips/status
 * @param {number} currentGameweek - Current gameweek number
 * @returns {boolean}
 */
export function isChipActiveForPrediction(chipId, predictionChips, allChips, currentGameweek) {
  const config = CHIP_CONFIG[chipId];
  
  if (!config) {
    return false;
  }
  
  // For match-scoped chips, check if it's in the prediction's chips array
  if (config.scope === 'match') {
    return predictionChips?.includes(chipId) || false;
  }
  
  // For gameweek-scoped chips, check if it's active this gameweek
  if (config.scope === 'gameweek') {
    const chip = allChips?.find(c => c.chipId === chipId);
    if (!chip) return false;
    
    return isChipActiveInGameweek(chip, currentGameweek);
  }
  
  return false;
}

/**
 * Get human-readable status for chip activation
 * @param {Object} chip - Chip object from /chips/status
 * @param {number} currentGameweek - Current gameweek number
 * @returns {Object} - Status object
 */
export function getChipActivationStatus(chip, currentGameweek) {
  const config = CHIP_CONFIG[chip.chipId];
  const activationGameweek = calculateActivationGameweek(chip, currentGameweek);
  const isActive = isChipActiveInGameweek(chip, currentGameweek);
  
  if (!config) {
    return {
      status: 'unknown',
      message: 'Unknown chip'
    };
  }
  
  if (chip.available) {
    return {
      status: 'available',
      message: 'Ready to use',
      color: 'green'
    };
  }
  
  if (isActive) {
    return {
      status: 'active',
      message: `Active this gameweek (GW ${currentGameweek})`,
      color: 'blue',
      activationGameweek
    };
  }
  
  if (chip.remainingGameweeks > 0) {
    return {
      status: 'cooldown',
      message: `Cooldown: ${chip.remainingGameweeks} gameweek${chip.remainingGameweeks === 1 ? '' : 's'} remaining`,
      color: 'amber',
      remainingGameweeks: chip.remainingGameweeks,
      activationGameweek
    };
  }
  
  // Season limit reached
  if (chip.remainingUses === 0) {
    return {
      status: 'exhausted',
      message: 'Season limit reached',
      color: 'red'
    };
  }
  
  return {
    status: 'unavailable',
    message: chip.reason || 'Unavailable',
    color: 'gray'
  };
}
