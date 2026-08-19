/**
 * External Fixtures API Service - Backend Proxy Version
 * Calls backend proxy instead of Football-Data.org directly to avoid CORS issues
 * 
 * Backend API Documentation: See predictions-backend/docs/EXTERNAL_FIXTURES_API_IMPLEMENTATION.md
 * Backend Base URL: Configured via VITE_API_BASE_URL
 * Authentication: Uses existing app authentication
 */

// Configuration
const BACKEND_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';
const FIXTURES_ENDPOINT = '/fixtures';

// Match status constants
const MATCH_STATUS = {
  SCHEDULED: 'SCHEDULED',
  TIMED: 'TIMED', // Backend uses TIMED for scheduled matches
  LIVE: 'LIVE', 
  IN_PLAY: 'IN_PLAY',
  PAUSED: 'PAUSED',
  FINISHED: 'FINISHED',
  POSTPONED: 'POSTPONED',
  CANCELLED: 'CANCELLED',
  SUSPENDED: 'SUSPENDED',
  AWARDED: 'AWARDED'
};



/**
 * Backend API client for fixtures
 * Simplified to use only /fixtures and /fixtures/live endpoints
 */
class BackendFixturesAPIClient {
  constructor() {
    this.baseURL = BACKEND_BASE_URL;
    this.endpoint = FIXTURES_ENDPOINT;
  }

  /**
   * Get user authentication token (if needed for backend)
   */
  getAuthToken() {
    // Try multiple token storage locations
    return localStorage.getItem('token') || 
           localStorage.getItem('authToken') || 
           localStorage.getItem('accessToken') || 
           '';
  }

  /**
   * Make request to backend with auth fallback on 500 error
   */
  async request(path = '') {
    const url = `${this.baseURL}${this.endpoint}${path}`;

    const makeRequest = async (includeAuth = false) => {
      const headers = {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      };

      if (includeAuth) {
        const token = this.getAuthToken();
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }
      }

      console.log('Backend Fixtures API Request:', { url, withAuth: includeAuth });

      return fetch(url, {
        method: 'GET',
        headers
      });
    };

    try {
      // First try without auth
      let response = await makeRequest(false);

      // If 500 error, try with auth (maybe endpoint requires auth)
      if (response.status === 500) {
        console.log('Got 500 error, trying with auth token...');
        response = await makeRequest(true);
      }

      console.log('Response status:', response.status);
      console.log('Response headers:', Object.fromEntries(response.headers.entries()));

      if (!response.ok) {
        let errorData = {};
        const responseText = await response.text();
        console.error('❌ HTTP Error Response:', {
          status: response.status,
          statusText: response.statusText,
          url,
          responseBody: responseText
        });
        
        try {
          errorData = JSON.parse(responseText);
        } catch (e) {
          errorData = { rawResponse: responseText };
        }
        
        // More specific error handling for 500 errors
        if (response.status === 500) {
          console.error('🚨 Server Error (500) - Backend may have an issue processing fixtures request');
          throw new Error(`Server Error: ${errorData.error || errorData.message || 'Internal server error processing fixtures'}`);
        }
        
        throw new Error(`Backend API Error ${response.status}: ${errorData.error || errorData.message || responseText || response.statusText}`);
      }

      const responseText = await response.text();
      console.log('Success response body:', responseText);
      
      let result;
      try {
        result = JSON.parse(responseText);
      } catch (e) {
        console.error('Failed to parse JSON response:', e);
        throw new Error('Invalid JSON response from backend');
      }
      
      console.log('Parsed response:', result);
      
      // Handle different response formats
      if (result.success === false) {
        throw new Error(result.error || 'Backend API request failed');
      }

      // Return data directly if success field exists, otherwise assume raw data
      return result.success ? result.data : result;
    } catch (error) {
      console.error('Backend Fixtures API Request Failed:', {
        url,
        error: error.message
      });
      throw error;
    }
  }
}

// Create singleton instance
const apiClient = new BackendFixturesAPIClient();

/**
 * Data transformation utilities
 */
const transformers = {
  /**
   * Validate and log fixture structure changes
   * This helps detect when backend adds new fields (like live scores, scorers, etc.)
   */
  validateFixtureStructure(fixture, index = 0) {
    const expectedFields = [
      'id', 'homeTeam', 'awayTeam', 'date', 'status', 
      'venue', 'gameweek', 'competition'
    ];
    
    const optionalFields = [
      'homeScore', 'awayScore', 'predicted', 'referee',
      'competitionCode', 'score',
      // NEW FIELDS DETECTED 2025-10-16:
      'homeId', 'awayId', 'homePlayers', 'awayPlayers'
    ];

    // New fields that might be added for live scores
    const potentialLiveFields = [
      'minute', 'period', 'scorers', 'events', 'stats',
      'halfTimeScore', 'penalties', 'extraTime'
    ];

    const fixtureKeys = Object.keys(fixture);
    const unknownFields = fixtureKeys.filter(key => 
      !expectedFields.includes(key) && 
      !optionalFields.includes(key) &&
      !potentialLiveFields.includes(key)
    );

    // Log new fields detected
    if (unknownFields.length > 0) {
      console.warn(`🆕 NEW FIXTURE FIELDS DETECTED (fixture #${index}):`, {
        fields: unknownFields,
        sampleValues: unknownFields.reduce((acc, key) => {
          acc[key] = fixture[key];
          return acc;
        }, {}),
        fullFixture: fixture
      });
    }

    // Log live score fields if present
    const liveFieldsPresent = potentialLiveFields.filter(field => 
      fixture.hasOwnProperty(field) && fixture[field] != null
    );
    
    if (liveFieldsPresent.length > 0) {
      console.info(`⚽ LIVE SCORE DATA DETECTED (fixture #${index}):`, {
        fields: liveFieldsPresent,
        data: liveFieldsPresent.reduce((acc, key) => {
          acc[key] = fixture[key];
          return acc;
        }, {}),
        fixture: {
          id: fixture.id,
          match: `${fixture.homeTeam} vs ${fixture.awayTeam}`,
          status: fixture.status
        }
      });
    }

    // Log if score structure is nested (backend might use score.home/score.away)
    if (fixture.score && typeof fixture.score === 'object') {
      console.info(`📊 NESTED SCORE STRUCTURE DETECTED:`, {
        fixture: `${fixture.homeTeam} vs ${fixture.awayTeam}`,
        scoreStructure: fixture.score
      });
    }

    return true;
  },

  /**
   * Transform backend response to standard format
   * Now with enhanced logging and support for live score fields
   */
  transformFixture(fixture, index = 0) {
    if (!fixture) {
      console.warn('Received undefined fixture in transformer');
      return null;
    }

    // Validate and log structure changes
    transformers.validateFixtureStructure(fixture, index);

    // Ensure date has timezone info (assume UTC if missing)
    let fixtureDate = fixture.date || new Date().toISOString();
    if (fixtureDate && !fixtureDate.includes('Z') && !fixtureDate.includes('+') && !fixtureDate.includes('-', 10)) {
      fixtureDate += 'Z'; // Add UTC timezone if missing
    }

    // Handle nested score structure (backend might use score.home/away)
    let homeScore = fixture.homeScore;
    let awayScore = fixture.awayScore;
    
    if (fixture.score && typeof fixture.score === 'object') {
      homeScore = fixture.score.home ?? homeScore;
      awayScore = fixture.score.away ?? awayScore;
    }

    // Build base fixture object
    const transformedFixture = {
      id: fixture.id || Date.now(),
      homeTeam: fixture.homeTeam || 'TBD',
      awayTeam: fixture.awayTeam || 'TBD',
      date: fixtureDate,
      status: fixture.status || 'SCHEDULED',
      venue: fixture.venue || '',
      gameweek: fixture.gameweek || 1,
      homeScore: homeScore ?? null,
      awayScore: awayScore ?? null,
      competition: fixture.competition || 'Premier League',
      predicted: fixture.predicted || false, // Will be merged with user predictions
      
      // Optional fields
      ...(fixture.referee && { referee: fixture.referee }),
      ...(fixture.competitionCode && { competitionCode: fixture.competitionCode }),
      
      // NEW FIELDS: Team IDs and Player Squads (added 2025-10-16)
      ...(fixture.homeId && { homeId: fixture.homeId }),
      ...(fixture.awayId && { awayId: fixture.awayId }),
      ...(fixture.homePlayers && { homePlayers: fixture.homePlayers }),
      ...(fixture.awayPlayers && { awayPlayers: fixture.awayPlayers }),
    };

    // Add live score fields if present
    if (fixture.minute != null) transformedFixture.minute = fixture.minute;
    if (fixture.period) transformedFixture.period = fixture.period;
    if (fixture.scorers) transformedFixture.scorers = fixture.scorers;
    if (fixture.events) transformedFixture.events = fixture.events;
    if (fixture.stats) transformedFixture.stats = fixture.stats;
    if (fixture.halfTimeScore) transformedFixture.halfTimeScore = fixture.halfTimeScore;
    if (fixture.penalties) transformedFixture.penalties = fixture.penalties;
    if (fixture.extraTime) transformedFixture.extraTime = fixture.extraTime;

    return transformedFixture;
  }
};

/**
 * Main Fixtures API - Simplified for current gameweek Premier League only
 */
export const externalFixturesAPI = {
  // Expose configuration
  MATCH_STATUS,

  /**
   * Get current gameweek fixtures (Premier League only)
   */
  async getFixtures() {
    try {
      const response = await apiClient.request('');

      // Backend returns direct array of fixtures, not wrapped in {fixtures: []}
      const fixturesArray = Array.isArray(response) ? response : (response.fixtures || []);
      
      // Transform fixtures (filter out nulls from failed transforms)
      const transformedFixtures = fixturesArray
        .map((fixture, index) => transformers.transformFixture(fixture, index))
        .filter(fixture => fixture !== null);

      // Deduplicate fixtures by ID (defensive against backend duplicates)
      const uniqueFixtures = transformedFixtures.filter((fixture, index, array) => 
        array.findIndex(f => f.id === fixture.id) === index
      );

      if (uniqueFixtures.length < transformedFixtures.length) {
        console.warn(`⚠️ Removed ${transformedFixtures.length - uniqueFixtures.length} duplicate fixtures`);
      }

      return {
        success: true,
        data: {
          fixtures: uniqueFixtures,
          totalCount: response.totalCount || uniqueFixtures.length,
          gameweek: response.gameweek,
          source: 'backend-api',
          timestamp: response.timestamp || new Date().toISOString()
        }
      };
    } catch (error) {
      console.error('❌ Backend fixtures request failed:', error);
      
      return {
        success: false,
        error: {
          message: error.message,
          type: 'BACKEND_API_ERROR',
          status: error.message.includes('404') ? 404 : null
        }
      };
    }
  },

  /**
   * Get live fixtures (Premier League only)
   */
  async getLiveFixtures() {
    try {
      console.log('⚡ Attempting to fetch live fixtures from backend...');
      const response = await apiClient.request('/live');

      // Backend returns direct array of fixtures, not wrapped in {fixtures: []}
      const fixturesArray = Array.isArray(response) ? response : (response.fixtures || []);
      
      console.log(`⚽ Received ${fixturesArray.length} live fixtures from backend`);
      
      // Log live fixture structures (they may have additional fields)
      if (fixturesArray.length > 0) {
        console.log('⚡ Live fixture sample:', {
          sampleFixture: fixturesArray[0],
          allFields: Object.keys(fixturesArray[0]),
          totalLiveFixtures: fixturesArray.length
        });
      }
      
      const transformedFixtures = fixturesArray
        .map((fixture, index) => transformers.transformFixture(fixture, index))
        .filter(fixture => fixture !== null);

      console.log(`✅ Successfully transformed ${transformedFixtures.length} live fixtures`);

      return {
        success: true,
        data: {
          fixtures: transformedFixtures,
          totalCount: response.totalCount || transformedFixtures.length,
          gameweek: response.gameweek,
          source: 'backend-api',
          timestamp: response.timestamp || new Date().toISOString()
        }
      };
    } catch (error) {
      console.error('❌ Backend live fixtures request failed:', error);
      
      return {
        success: false,
        error: {
          message: error.message,
          type: 'BACKEND_API_ERROR',
          status: error.message.includes('404') ? 404 : null
        }
      };
    }
  },

  /**
   * Get API status (for monitoring)
   */
  getAPIStatus() {
    return {
      configured: true,
      baseURL: BACKEND_BASE_URL,
      endpoint: FIXTURES_ENDPOINT,
      timestamp: new Date().toISOString()
    };
  }
};

/**
 * Client-side filtering utilities for fixtures
 */
export const fixtureFilters = {
  /**
   * Filter fixtures for today's matches
   */
  getTodaysFixtures(fixtures) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    return fixtures.filter(fixture => {
      const fixtureDate = new Date(fixture.date);
      return fixtureDate >= today && fixtureDate < tomorrow;
    });
  },

  /**
   * Filter fixtures by prediction status
   */
  filterByPredictionStatus(fixtures, status) {
    if (status === 'all') return fixtures;
    if (status === 'predicted') return fixtures.filter(f => f.predicted);
    if (status === 'unpredicted') return fixtures.filter(f => !f.predicted);
    return fixtures;
  },

  /**
   * Filter fixtures by search query (team names)
   */
  filterBySearch(fixtures, query) {
    if (!query) return fixtures;
    
    const searchTerm = query.toLowerCase();
    return fixtures.filter(fixture => 
      fixture.homeTeam.toLowerCase().includes(searchTerm) ||
      fixture.awayTeam.toLowerCase().includes(searchTerm)
    );
  },

  /**
   * Combined filtering function
   */
  applyFilters(fixtures, filters = {}) {
    let result = fixtures;

    // Apply date filter
    if (filters.date === 'today') {
      result = this.getTodaysFixtures(result);
    }

    // Apply prediction status filter
    if (filters.status && filters.status !== 'all') {
      result = this.filterByPredictionStatus(result, filters.status);
    }

    // Apply search filter
    if (filters.search) {
      result = this.filterBySearch(result, filters.search);
    }

    return result;
  }
};

export default externalFixturesAPI;
