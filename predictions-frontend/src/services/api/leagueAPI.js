import api from './baseAPI.js';

// League API endpoints
const leagueAPI = {
  // Get all leagues for current user
  getUserLeagues: async () => {
    try {
      const response = await api.get('/leagues/user');

      // Map LeagueOverview response to frontend-compatible format
      const leagues = (response.data || []).map(league => ({
        id: league.id,
        name: league.name,
        description: league.description,
        members: league.members,
        position: league.position,
        points: league.points,
        joinCode: league.joinCode,
        isAdmin: league.isAdmin,
        type: league.type,
        createdAt: league.createdAt,
        firstGameweek: league.firstGameweek,
        // Backward compatibility aliases
        userPosition: league.position,
        numberOfMembers: league.members
      }));

      return leagues;
    } catch (error) {
      console.error('Failed to fetch user leagues:', error.message);
      return [];
    }
  },

  // Create new league
  createLeague: async (leagueData) => {
    try {
      const requestBody = {
        name: leagueData.name,
        description: leagueData.description,
        publicity: leagueData.isPrivate ? 'PRIVATE' : 'PUBLIC',
        firstGameweek: leagueData.firstGameweek
      };

      const response = await api.post('/leagues/create', requestBody);
      return response.data.league;
    } catch (error) {
      console.error('Failed to create league:', error.message);
      throw new Error(`Failed to create league: ${error.message}`);
    }
  },

  // Join league by code
  joinLeague: async (joinCode) => {
    try {
      const response = await api.post(`/leagues/${joinCode}/join`);
      return response.data.league;
    } catch (error) {
      console.error('Failed to join league:', error.message);
      throw new Error(`Failed to join league: ${error.message}`);
    }
  },

  // Leave league (regular member)
  leaveLeague: async (leagueId) => {
    try {
      const response = await api.post(`/leagues/${leagueId}/leave`);
      return response.data.message;
    } catch (error) {
      console.error('Failed to leave league:', error.message);
      throw new Error(`Failed to leave league: ${error.message}`);
    }
  },

  // Delete league (admin only)
  deleteLeague: async (leagueId) => {
    try {
      const response = await api.delete(`/leagues/${leagueId}/delete`);
      return response.data.message;
    } catch (error) {
      console.error('Failed to delete league:', error.message);
      throw new Error(`Failed to delete league: ${error.message}`);
    }
  },

  // Get league standings
  getLeagueStandings: async (leagueId) => {
    try {
      const response = await api.get(`/leagues/${leagueId}/standings`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch league standings:', error.message);
      throw new Error(`Failed to load league standings: ${error.message}`);
    }
  },

  // Update league settings (admin only)
  updateLeague: async (leagueId, updates) => {
    try {
      const requestBody = {
        id: leagueId,
        name: updates.name,
        description: updates.description,
        firstGameweek: updates.firstGameweek
      };

      const response = await api.put('/leagues/update', requestBody);
      return response.data;
    } catch (error) {
      console.error('Failed to update league:', error.message);
      throw new Error(`Failed to update league: ${error.message}`);
    }
  },

  // Get league predictions (all member predictions for league fixtures)
  // Gameweek parameter is required - backend always needs a specific gameweek
  getLeaguePredictions: async (leagueId, gameweek) => {
    try {
      if (!gameweek) {
        throw new Error('Gameweek parameter is required');
      }

      const url = `/leagues/${leagueId}/predictions/${gameweek}`;
      const response = await api.get(url);

      // Map predictions to ensure compatibility with frontend expectations
      const mappedPredictions = (response.data || []).map(prediction => ({
        ...prediction,
        userDisplayName: prediction.username || prediction.userDisplayName || 'Unknown User',
        date: prediction.predictedAt || prediction.date,
        status: prediction.status ? prediction.status.toLowerCase() : 'pending'
      }));

      return mappedPredictions;
    } catch (error) {
      console.error('Failed to fetch league predictions:', error.message);
      throw new Error(`Failed to load league predictions: ${error.message}`);
    }
  },

  // Remove member from league (admin only)
  removeMember: async (leagueId, memberId) => {
    try {
      const requestBody = {
        leagueId: leagueId,
        userId: memberId
      };

      const response = await api.delete('/leagues/remove-user', { data: requestBody });
      return response.data;
    } catch (error) {
      console.error('Failed to remove member:', error.message);
      throw new Error(`Failed to remove member: ${error.message}`);
    }
  },

  // Promote member to admin (admin only)
  promoteMember: async (leagueId, memberId) => {
    try {
      const requestBody = {
        leagueId: leagueId,
        userId: memberId
      };

      const response = await api.put('/leagues/add-admin', requestBody);
      return response.data;
    } catch (error) {
      console.error('Failed to promote member:', error.message);
      throw new Error(`Failed to promote member: ${error.message}`);
    }
  }
};

export default leagueAPI;
