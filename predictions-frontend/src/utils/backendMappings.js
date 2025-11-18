/**
 * Backend Integration Mappings
 * Handles translation between frontend display formats and backend expected formats
 */

/**
 * Chip mapping from frontend camelCase to backend UPPER_CASE
 */
export const CHIP_MAPPING = {
  // Frontend chip IDs → Backend enum values
  doubleDown: 'DOUBLE_DOWN',
  wildcard: 'WILDCARD', 
  scorerFocus: 'SCORER_FOCUS',
  defensePlusPlus: 'DEFENSE_PLUS_PLUS',
  allInWeek: 'ALL_IN_WEEK'
};

/**
 * Reverse chip mapping for backend responses
 */
export const REVERSE_CHIP_MAPPING = Object.fromEntries(
  Object.entries(CHIP_MAPPING).map(([frontend, backend]) => [backend, frontend])
);

/**
 * Team name mapping from frontend display names to backend expected names
 */
export const TEAM_NAME_MAPPING = {
  // Frontend display names → Backend standardized names
  'Liverpool': 'Liverpool',
  'Liverpool FC': 'Liverpool',
  'Bournemouth': 'Bournemouth',
  'AFC Bournemouth': 'Bournemouth',
  'Aston Villa': 'Aston Villa',
  'Newcastle': 'Newcastle',
  'Newcastle United': 'Newcastle',
  'Brighton': 'Brighton Hove',
  'Brighton & Hove Albion': 'Brighton Hove',
  'Brighton Hove': 'Brighton Hove',
  'Fulham': 'Fulham',
  'Fulham FC': 'Fulham',
  'Sunderland': 'Sunderland',
  'Sunderland AFC': 'Sunderland',
  'West Ham': 'West Ham',
  'West Ham United': 'West Ham',
  'Tottenham': 'Tottenham',
  'Tottenham Hotspur': 'Tottenham',
  'Spurs': 'Tottenham',
  'Burnley': 'Burnley',
  'Burnley FC': 'Burnley',
  'Wolverhampton': 'Wolverhampton',
  'Wolves': 'Wolverhampton',
  'Wolverhampton Wanderers': 'Wolverhampton',
  'Man City': 'Man City',
  'Manchester City': 'Man City',
  'Man. City': 'Man City',
  'Nottingham': 'Nottingham',
  'Nottingham Forest': 'Nottingham',
  'Brentford': 'Brentford',
  'Brentford FC': 'Brentford',
  'Chelsea': 'Chelsea',
  'Chelsea FC': 'Chelsea',
  'Crystal Palace': 'Crystal Palace',
  'Man United': 'Man United',
  'Manchester United': 'Man United',
  'Man Utd': 'Man United',
  'Man. United': 'Man United',
  'Arsenal': 'Arsenal',
  'Arsenal FC': 'Arsenal',
  'Leeds United': 'Leeds United',
  'Leeds': 'Leeds United',
  'Everton': 'Everton',
  'Everton FC': 'Everton'
};

/**
 * Reverse team name mapping for backend responses
 */
export const REVERSE_TEAM_NAME_MAPPING = Object.fromEntries(
  Object.entries(TEAM_NAME_MAPPING).map(([frontend, backend]) => [backend, frontend])
);

/**
 * Transform frontend chip array to backend format
 * @param {string[]} frontendChips - Array of frontend chip IDs
 * @returns {string[]} Array of backend chip enums
 */
export const transformChipsToBackend = (frontendChips = []) => {
  console.log('🔄 transformChipsToBackend INPUT:', {
    frontendChips,
    isArray: Array.isArray(frontendChips),
    length: frontendChips?.length,
    type: typeof frontendChips
  });

  const transformed = frontendChips
    .map(chip => {
      const backendChip = CHIP_MAPPING[chip];
      if (!backendChip) {
        console.warn(`⚠️ [CHIP MAPPING] Unknown chip format: "${chip}" - may already be in backend format or invalid`);
      }
      console.log(`  → Mapping: ${chip} → ${backendChip || chip || 'UNMAPPED'}`);
      // If no mapping found, try to use as-is (defensive - might already be backend format)
      return backendChip || chip;
    })
    .filter(Boolean); // Remove any null/undefined chips

  console.log('🔄 transformChipsToBackend OUTPUT:', {
    transformed,
    count: transformed.length
  });

  return transformed;
};

/**
 * Transform backend chip array to frontend format
 * @param {string[]} backendChips - Array of backend chip enums
 * @returns {string[]} Array of frontend chip IDs
 */
export const transformChipsFromBackend = (backendChips = []) => {
  console.log('🔄 transformChipsFromBackend INPUT:', {
    backendChips,
    isArray: Array.isArray(backendChips),
    length: backendChips?.length
  });

  const transformed = backendChips
    .map(chip => {
      const frontendChip = REVERSE_CHIP_MAPPING[chip];
      if (!frontendChip) {
        console.warn(`⚠️ [CHIP MAPPING] Unknown backend chip: "${chip}" - may already be in frontend format`);
      }
      console.log(`  → Mapping: ${chip} → ${frontendChip || chip || 'UNMAPPED'}`);
      // If no mapping found, try to use as-is (defensive - might already be frontend format)
      return frontendChip || chip;
    })
    .filter(Boolean); // Remove any null/undefined chips

  console.log('🔄 transformChipsFromBackend OUTPUT:', {
    transformed,
    count: transformed.length
  });

  return transformed;
};

/**
 * Transform frontend team name to backend format
 * @param {string} frontendTeamName - Frontend display team name
 * @returns {string} Backend standardized team name
 */
export const transformTeamNameToBackend = (frontendTeamName) => {
  if (!frontendTeamName) return '';
  
  // Try exact match first
  const mapped = TEAM_NAME_MAPPING[frontendTeamName];
  if (mapped) return mapped;
  
  // Try case-insensitive match
  const lowerName = frontendTeamName.toLowerCase();
  const foundKey = Object.keys(TEAM_NAME_MAPPING).find(
    key => key.toLowerCase() === lowerName
  );
  
  if (foundKey) return TEAM_NAME_MAPPING[foundKey];
  
  // Fallback to original name with warning
  console.warn(`Team name not mapped: "${frontendTeamName}". Using as-is.`);
  return frontendTeamName;
};

/**
 * Preferred display names for teams (cleaner versions)
 */
export const DISPLAY_TEAM_NAMES = {
  'Brighton Hove': 'Brighton',
  'Man City': 'Man City',
  'Man United': 'Man United',
  'Nottingham': 'Nottingham Forest',
  'Wolverhampton': 'Wolves',
  // Add other teams if you want custom display names
};

/**
 * Transform backend team name to frontend format
 * @param {string} backendTeamName - Backend standardized team name
 * @returns {string} Frontend display team name
 */
export const transformTeamNameFromBackend = (backendTeamName) => {
  if (!backendTeamName) return '';
  
  // Use preferred display name if available, otherwise use backend name
  return DISPLAY_TEAM_NAMES[backendTeamName] || backendTeamName;
};

/**
 * Extract match ID from fixture data
 * @param {Object} fixture - Frontend fixture object
 * @returns {number|null} Backend match ID
 */
export const extractMatchId = (fixture) => {
  // Priority order for finding match ID:
  // 1. Direct matchId field
  // 2. External fixture ID
  // 3. Generate from fixture data
  
  if (fixture.matchId) return Number(fixture.matchId);
  if (fixture.externalId) return Number(fixture.externalId);
  if (fixture.id && typeof fixture.id === 'number') return fixture.id;
  if (fixture.id && typeof fixture.id === 'string') {
    const numericId = parseInt(fixture.id.replace(/\D/g, ''));
    if (!isNaN(numericId)) return numericId;
  }
  
  console.warn('Could not extract match ID from fixture:', fixture);
  return null;
};

/**
 * Extract gameweek from fixture data
 * @param {Object} fixture - Frontend fixture object
 * @returns {number} Current gameweek number
 */
export const extractGameweek = (fixture) => {
  if (fixture.gameweek) return Number(fixture.gameweek);
  if (fixture.matchday) return Number(fixture.matchday);
  if (fixture.round) return Number(fixture.round);
  
  // Fallback to current date-based gameweek calculation
  // This is a simplified calculation - you might want to use a more sophisticated method
  const currentDate = new Date();
  const seasonStart = new Date('2025-08-15'); // Approximate season start
  const weeksPassed = Math.floor((currentDate - seasonStart) / (7 * 24 * 60 * 60 * 1000));
  const gameweek = Math.max(1, Math.min(38, weeksPassed + 1));
  
  console.warn(`Gameweek not found in fixture, using calculated value: ${gameweek}`);
  return gameweek;
};

/**
 * Transform complete prediction payload from frontend to backend format
 * @param {Object} frontendPrediction - Frontend prediction object
 * @param {Object} fixture - Frontend fixture object
 * @returns {Object} Backend-compatible prediction payload
 */
export const transformPredictionToBackend = (frontendPrediction, fixture) => {
  const matchId = extractMatchId(fixture);
  
  if (!matchId) {
    throw new Error('Cannot submit prediction: Match ID not found');
  }
  
  return {
    matchId: matchId,
    homeScore: Number(frontendPrediction.homeScore) || 0,
    awayScore: Number(frontendPrediction.awayScore) || 0,
    homeScorers: frontendPrediction.homeScorers || [],
    awayScorers: frontendPrediction.awayScorers || [],
    chips: transformChipsToBackend(frontendPrediction.chips || []),
    homeTeam: transformTeamNameToBackend(fixture.homeTeam || fixture.home),
    awayTeam: transformTeamNameToBackend(fixture.awayTeam || fixture.away),
    gameweek: extractGameweek(fixture)
  };
};

/**
 * Validation helper for backend prediction payload
 * @param {Object} backendPayload - Backend prediction payload
 * @returns {Object} Validation result with isValid boolean and errors array
 */
export const validateBackendPayload = (backendPayload) => {
  const errors = [];
  
  if (!backendPayload.matchId || typeof backendPayload.matchId !== 'number') {
    errors.push('matchId is required and must be a number');
  }
  
  if (typeof backendPayload.homeScore !== 'number' || backendPayload.homeScore < 0) {
    errors.push('homeScore must be a non-negative number');
  }
  
  if (typeof backendPayload.awayScore !== 'number' || backendPayload.awayScore < 0) {
    errors.push('awayScore must be a non-negative number');
  }
  
  if (!Array.isArray(backendPayload.homeScorers)) {
    errors.push('homeScorers must be an array');
  }
  
  if (!Array.isArray(backendPayload.awayScorers)) {
    errors.push('awayScorers must be an array');
  }
  
  if (!Array.isArray(backendPayload.chips)) {
    errors.push('chips must be an array');
  }
  
  if (!backendPayload.homeTeam || typeof backendPayload.homeTeam !== 'string') {
    errors.push('homeTeam is required and must be a string');
  }
  
  if (!backendPayload.awayTeam || typeof backendPayload.awayTeam !== 'string') {
    errors.push('awayTeam is required and must be a string');
  }
  
  if (!backendPayload.gameweek || typeof backendPayload.gameweek !== 'number') {
    errors.push('gameweek is required and must be a number');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};