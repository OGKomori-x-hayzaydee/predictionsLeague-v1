/**
 * Test script for external fixtures API
 * Run with: node test-external-api.js
 */

import { externalFixturesAPI } from './src/services/api/externalFixturesAPI.js';
import { clientSideDataService } from './src/utils/clientSideDataMerging.js';

async function testExternalAPI() {
  console.log('🧪 Testing External Fixtures API Integration\n');

  // Test 1: API Configuration
  console.log('1️⃣ Testing API Configuration:');
  console.log('✅ API Base URL:', externalFixturesAPI.baseURL);
  console.log('✅ Target Teams:', externalFixturesAPI.TARGET_TEAMS);
  console.log('✅ Target Competitions:', externalFixturesAPI.TARGET_COMPETITIONS);
  
  // Test 2: API Key Check
  console.log('\n2️⃣ Testing API Key:');
  if (process.env.VITE_FOOTBALL_DATA_API_KEY) {
    console.log('✅ API Key is configured');
  } else {
    console.log('⚠️ API Key not found - will use mock/empty data');
  }

  // Test 3: Data Structure Validation
  console.log('\n3️⃣ Testing Data Structures:');
  
  // Mock external fixture
  const mockExternalFixture = {
    id: 'test-1',
    homeTeam: 'Chelsea',
    awayTeam: 'Arsenal',
    date: '2025-01-15T15:00:00Z',
    competition: 'Premier League',
    status: 'SCHEDULED'
  };

  // Mock user prediction
  const mockUserPrediction = {
    id: 'pred-1',
    homeTeam: 'Chelsea',
    awayTeam: 'Arsenal',
    date: '2025-01-15T15:00:00Z',
    homeScore: 2,
    awayScore: 1,
    submittedAt: '2025-01-10T12:00:00Z'
  };

  console.log('✅ Mock External Fixture:', mockExternalFixture);
  console.log('✅ Mock User Prediction:', mockUserPrediction);

  // Test 4: Data Merging
  console.log('\n4️⃣ Testing Data Merging:');
  try {
    const mergeResult = await clientSideDataService.processMergedData(
      [mockExternalFixture],
      [mockUserPrediction]
    );
    
    console.log('✅ Data merge successful:', mergeResult.success);
    console.log('✅ Merged fixtures count:', mergeResult.data?.fixtures?.length || 0);
    console.log('✅ Prediction stats:', mergeResult.data?.stats);
  } catch (error) {
    console.log('❌ Data merge failed:', error.message);
  }

  // Test 5: API Call (without key - should handle gracefully)
  console.log('\n5️⃣ Testing API Call Handling:');
  try {
    const result = await externalFixturesAPI.getFixtures({
      competitions: ['PL'],
      dateFrom: '2025-01-01',
      dateTo: '2025-01-31'
    });
    console.log('✅ API call result:', result);
  } catch (error) {
    console.log('⚠️ API call failed (expected without key):', error.message);
  }

  console.log('\n🎉 Testing Complete!');
}

// Run tests
testExternalAPI().catch(console.error);
