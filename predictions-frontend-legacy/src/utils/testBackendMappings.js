/**
 * Test file for backend mapping validations
 * Run this to verify the mappings work correctly
 */

import {
  CHIP_MAPPING,
  TEAM_NAME_MAPPING,
  transformChipsToBackend,
  transformChipsFromBackend,
  transformTeamNameToBackend,
  transformPredictionToBackend,
  validateBackendPayload
} from '../utils/backendMappings';

/**
 * Test chip transformations
 */
export const testChipMappings = () => {
  console.log('🧪 Testing Chip Mappings...');
  
  // Test frontend to backend
  const frontendChips = ['doubleDown', 'wildcard', 'scorerFocus'];
  const backendChips = transformChipsToBackend(frontendChips);
  console.log('Frontend chips:', frontendChips);
  console.log('Backend chips:', backendChips);
  console.log('Expected:', ['DOUBLE_DOWN', 'WILDCARD', 'SCORER_FOCUS']);
  
  // Test backend to frontend
  const backendChipsReverse = ['DEFENSE_PLUS_PLUS', 'ALL_IN_WEEK'];
  const frontendChipsReverse = transformChipsFromBackend(backendChipsReverse);
  console.log('Backend chips (reverse):', backendChipsReverse);
  console.log('Frontend chips (reverse):', frontendChipsReverse);
  console.log('Expected:', ['defensePlusPlus', 'allInWeek']);
};

/**
 * Test team name transformations
 */
export const testTeamMappings = () => {
  console.log('\n🧪 Testing Team Name Mappings...');
  
  const testTeams = [
    'Liverpool FC',
    'Manchester City', 
    'Spurs',
    'Brighton & Hove Albion',
    'Wolves',
    'Man Utd'
  ];
  
  testTeams.forEach(team => {
    const backend = transformTeamNameToBackend(team);
    console.log(`"${team}" → "${backend}"`);
  });
};

/**
 * Test complete prediction transformation
 */
export const testPredictionTransformation = () => {
  console.log('\n🧪 Testing Complete Prediction Transformation...');
  
  const mockFixture = {
    id: 'fixture-123',
    matchId: 42,
    homeTeam: 'Liverpool FC',
    awayTeam: 'Manchester City',
    gameweek: 15,
    date: '2025-10-20T15:00:00Z'
  };
  
  const mockPrediction = {
    homeScore: 2,
    awayScore: 1,
    homeScorers: ['Salah', 'Mané'],
    awayScorers: ['Haaland'],
    chips: ['doubleDown', 'scorerFocus']
  };
  
  try {
    const backendPayload = transformPredictionToBackend(mockPrediction, mockFixture);
    console.log('✅ Frontend Prediction:', mockPrediction);
    console.log('✅ Frontend Fixture:', mockFixture);
    console.log('✅ Backend Payload:', backendPayload);
    
    // Validate the payload
    const validation = validateBackendPayload(backendPayload);
    console.log('✅ Validation Result:', validation);
    
    return backendPayload;
  } catch (error) {
    console.error('❌ Transformation failed:', error.message);
    return null;
  }
};

/**
 * Test edge cases and error handling
 */
export const testEdgeCases = () => {
  console.log('\n🧪 Testing Edge Cases...');
  
  // Test missing match ID
  const fixtureNoId = {
    homeTeam: 'Arsenal',
    awayTeam: 'Chelsea'
  };
  
  const prediction = {
    homeScore: 1,
    awayScore: 0,
    homeScorers: ['Saka'],
    awayScorers: [],
    chips: []
  };
  
  try {
    transformPredictionToBackend(prediction, fixtureNoId);
    console.log('❌ Should have failed for missing match ID');
  } catch (error) {
    console.log('✅ Correctly caught missing match ID:', error.message);
  }
  
  // Test unknown team name
  const unknownTeam = transformTeamNameToBackend('Unknown FC');
  console.log('✅ Unknown team handling:', unknownTeam);
  
  // Test unknown chip
  const unknownChips = transformChipsToBackend(['unknownChip', 'doubleDown']);
  console.log('✅ Unknown chip filtering:', unknownChips);
};

/**
 * Run all tests
 */
export const runAllTests = () => {
  console.log('🚀 Running Backend Mapping Tests...\n');
  
  testChipMappings();
  testTeamMappings();
  testPredictionTransformation();
  testEdgeCases();
  
  console.log('\n✅ All tests completed!');
};

// Example usage:
// import { runAllTests } from './path/to/testBackendMappings';
// runAllTests();