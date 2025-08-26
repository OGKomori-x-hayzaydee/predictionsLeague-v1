import api from './baseAPI.js';

// League API endpoints
const leagueAPI = {
  // Get all leagues for current user
  getUserLeagues: async () => {
    try {
      const response = await api.get('/leagues/user');
      return {
        success: true,
        leagues: response.data.leagues || mockUserLeagues
      };
    } catch (error) {
      console.warn('Backend unavailable, using mock data:', error.message);
      return {
        success: true,
        leagues: mockUserLeagues
      };
    }
  },

  // Get league details by ID
  getLeagueDetails: async (leagueId) => {
    try {
      const response = await api.get(`/leagues/${leagueId}`);
      return {
        success: true,
        league: response.data.league
      };
    } catch (error) {
      console.warn('Backend unavailable, using mock data:', error.message);
      const mockLeague = mockUserLeagues.find(l => l.id === leagueId) || mockUserLeagues[0];
      return {
        success: true,
        league: {
          ...mockLeague,
          standings: mockLeagueStandings,
          recentActivity: mockRecentActivity
        }
      };
    }
  },

  // Create new league
  createLeague: async (leagueData) => {
    try {
      const response = await api.post('/leagues', leagueData);
      return {
        success: true,
        league: response.data.league
      };
    } catch (error) {
      console.warn('Backend unavailable, using mock data:', error.message);
      // Simulate league creation
      const newLeague = {
        id: `league-${Date.now()}`,
        ...leagueData,
        memberCount: 1,
        joinCode: Math.random().toString(36).substring(2, 8).toUpperCase(),
        createdBy: 'temp-user-123',
        createdAt: new Date().toISOString(),
        status: 'active'
      };
      return {
        success: true,
        league: newLeague
      };
    }
  },

  // Join league by code
  joinLeague: async (joinCode) => {
    try {
      const response = await api.post('/leagues/join', { joinCode });
      return {
        success: true,
        league: response.data.league
      };
    } catch (error) {
      console.warn('Backend unavailable, using mock data:', error.message);
      // Simulate joining a league
      if (joinCode === 'DEMO123') {
        return {
          success: true,
          league: {
            id: 'league-demo',
            name: 'Demo League',
            description: 'A demo league for testing',
            memberCount: 25,
            joinCode: 'DEMO123',
            status: 'active'
          }
        };
      } else {
        return {
          success: false,
          error: 'Invalid join code'
        };
      }
    }
  },

  // Leave league
  leaveLeague: async (leagueId) => {
    try {
      const response = await api.delete(`/leagues/${leagueId}/leave`);
      return {
        success: true,
        message: response.data.message
      };
    } catch (error) {
      console.warn('Backend unavailable, using mock data:', error.message);
      return {
        success: true,
        message: 'Successfully left the league'
      };
    }
  },

  // Get league standings
  getLeagueStandings: async (leagueId) => {
    try {
      const response = await api.get(`/leagues/${leagueId}/standings`);
      return {
        success: true,
        standings: response.data.standings
      };
    } catch (error) {
      console.warn('Backend unavailable, using mock data:', error.message);
      return {
        success: true,
        standings: mockLeagueStandings
      };
    }
  },

  // Update league settings (admin only)
  updateLeague: async (leagueId, updates) => {
    try {
      const response = await api.put(`/leagues/${leagueId}`, updates);
      return {
        success: true,
        league: response.data.league
      };
    } catch (error) {
      console.warn('Backend unavailable, using mock data:', error.message);
      return {
        success: true,
        league: { id: leagueId, ...updates }
      };
    }
  },

  // Get featured leagues
  getFeaturedLeagues: async () => {
    try {
      const response = await api.get('/leagues/featured');
      return {
        success: true,
        leagues: response.data.leagues
      };
    } catch (error) {
      console.warn('Backend unavailable, using mock data:', error.message);
      return {
        success: true,
        leagues: mockFeaturedLeagues
      };
    }
  }
};

// Mock data for development
const mockUserLeagues = [
  {
    id: 'league-1',
    name: 'Premier League Predictions',
    description: 'Predict Premier League matches with friends',
    memberCount: 42,
    currentRank: 3,
    totalPoints: 284,
    joinCode: 'PL2024',
    isOwner: true,
    status: 'active',
    createdAt: '2024-08-01T00:00:00Z',
    gameweek: 15,
    nextDeadline: '2024-12-14T11:30:00Z'
  },
  {
    id: 'league-2',
    name: 'Office Fantasy League',
    description: 'Workplace predictions competition',
    memberCount: 18,
    currentRank: 7,
    totalPoints: 156,
    joinCode: 'OFFICE24',
    isOwner: false,
    status: 'active',
    createdAt: '2024-09-15T00:00:00Z',
    gameweek: 15,
    nextDeadline: '2024-12-14T11:30:00Z'
  },
  {
    id: 'league-3',
    name: 'Champions League Elite',
    description: 'European competition predictions',
    memberCount: 156,
    currentRank: 23,
    totalPoints: 198,
    joinCode: 'UCL2024',
    isOwner: false,
    status: 'active',
    createdAt: '2024-09-01T00:00:00Z',
    gameweek: 6,
    nextDeadline: '2024-12-10T17:45:00Z'
  }
];

const mockFeaturedLeagues = [
  {
    id: 'featured-1',
    name: "Global Premier League Predictions",
    type: "public",
    members: 10843,
    description: "Official global league for all Premier League prediction enthusiasts.",
    sponsor: null,
    hasAwards: true,
    difficulty: "Beginner",
    category: "Premier League"
  },
  {
    id: 'featured-2',
    name: "Champions League Elite",
    type: "public",
    members: 3421,
    description: "Test your European football knowledge in this elite league.",
    sponsor: null,
    hasAwards: true,
    difficulty: "Advanced",
    category: "Champions League"
  },
  {
    id: 'featured-3',
    name: "Weekend Warriors",
    type: "public",
    members: 892,
    description: "For those who live for match day predictions.",
    sponsor: null,
    hasAwards: false,
    difficulty: "Intermediate",
    category: "Mixed"
  },
  {
    id: 'featured-4',
    name: "Official NBC Sports League",
    type: "public",
    members: 24567,
    description: "NBC Sports official prediction challenge with weekly prizes!",
    sponsor: "NBC Sports",
    hasAwards: true,
    difficulty: "Beginner",
    category: "Premier League"
  },
  {
    id: 'featured-5',
    name: "Sky Sports Super 6",
    type: "public",
    members: 31245,
    description: "Predict six matches each week with a chance to win £250,000.",
    sponsor: "Sky Sports",
    hasAwards: true,
    difficulty: "Expert",
    category: "Premier League"
  }
];

const mockLeagueStandings = [
  {
    rank: 1,
    user: { id: '1', username: 'TacticalGenius', avatar: null },
    points: 324,
    predictions: 45,
    accuracy: 71.1,
    change: 'up'
  },
  {
    rank: 2,
    user: { id: '2', username: 'ScorePredictor', avatar: null },
    points: 298,
    predictions: 44,
    accuracy: 65.9,
    change: 'down'
  },
  {
    rank: 3,
    user: { id: 'temp-user-123', username: 'DemoUser', avatar: null },
    points: 284,
    predictions: 43,
    accuracy: 62.8,
    change: 'up'
  },
  {
    rank: 4,
    user: { id: '4', username: 'FootballFan92', avatar: null },
    points: 271,
    predictions: 42,
    accuracy: 64.3,
    change: 'same'
  },
  {
    rank: 5,
    user: { id: '5', username: 'PredictionMaster', avatar: null },
    points: 265,
    predictions: 41,
    accuracy: 63.4,
    change: 'down'
  }
];

const mockRecentActivity = [
  {
    user: 'TacticalGenius',
    action: 'Perfect prediction for Arsenal vs Chelsea',
    points: 25,
    time: '2 hours ago'
  },
  {
    user: 'ScorePredictor',
    action: 'Joined the league',
    points: null,
    time: '1 day ago'
  },
  {
    user: 'DemoUser',
    action: 'Correct result for Liverpool vs City',
    points: 15,
    time: '2 days ago'
  },
  {
    user: 'FootballFan92',
    action: 'Made predictions for GW16',
    points: null,
    time: '3 days ago'
  }
];

export default leagueAPI;
