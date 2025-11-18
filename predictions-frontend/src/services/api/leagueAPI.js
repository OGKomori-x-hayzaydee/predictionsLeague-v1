import api from './baseAPI.js';

// League API endpoints
const leagueAPI = {
  // Get all leagues for current user
  getUserLeagues: async () => {
    try {
      console.log('Fetching user leagues...');
      const response = await api.get('/leagues/user');
      console.log('Raw API response:', response.data);
      
      // Map LeagueOverview response to frontend-compatible format
      const leagues = (response.data || []).map(league => ({
        id: league.id, // Already correct from LeagueOverview
        name: league.name,
        description: league.description,
        members: league.members,
        position: league.position, // User's position in this league
        points: league.points, // User's points in this league
        joinCode: league.joinCode,
        isAdmin: league.isAdmin,
        type: league.type, // Publicity enum
        createdAt: league.createdAt,
        // Backward compatibility aliases
        userPosition: league.position,
        numberOfMembers: league.members
      }));
      
      console.log('User leagues fetched:', leagues.length, 'leagues');
      console.log('Mapped leagues with IDs:', leagues.map(l => ({ id: l.id, name: l.name })));
      return leagues;
    } catch (error) {
      console.error('Failed to fetch user leagues:', error.message);
      return [];
    }
  },

  // Note: getLeagueDetails removed - league header data now included in getUserLeagues response
  // This eliminates redundant API calls for league detail views

  // Create new league
  createLeague: async (leagueData) => {
    try {
      const requestBody = {
        name: leagueData.name,
        description: leagueData.description,
        publicity: leagueData.isPrivate ? 'PRIVATE' : 'PUBLIC'
      };
      
      console.log('Creating league:', requestBody);
      const response = await api.post('/leagues/create', requestBody);
      console.log('League created successfully:', response.data.league?.id);
      return response.data.league;
    } catch (error) {
      console.error('Failed to create league:', error.message);
      throw new Error(`Failed to create league: ${error.message}`);
    }
  },

  // Join league by code
  joinLeague: async (joinCode) => {
    try {
      console.log('Joining league with code:', joinCode);
      const response = await api.post(`/leagues/${joinCode}/join`);
      console.log('League joined successfully:', response.data.league?.id);
      return response.data.league;
    } catch (error) {
      console.error('Failed to join league:', error.message);
      throw new Error(`Failed to join league: ${error.message}`);
    }
  },

  // Leave league (regular member)
  leaveLeague: async (leagueId) => {
    try {
      console.log('Leaving league...', { leagueId });
      const response = await api.post(`/leagues/${leagueId}/leave`);
      console.log('Left league successfully');
      return response.data.message;
    } catch (error) {
      console.error('Failed to leave league:', error.message);
      throw new Error(`Failed to leave league: ${error.message}`);
    }
  },

  // Delete league (admin only)
  deleteLeague: async (leagueId) => {
    try {
      console.log('Deleting league...', { leagueId });
      const response = await api.delete(`/leagues/${leagueId}/delete`);
      console.log('League deleted successfully');
      return response.data.message;
    } catch (error) {
      console.error('Failed to delete league:', error.message);
      throw new Error(`Failed to delete league: ${error.message}`);
    }
  },

  // Get league standings
  getLeagueStandings: async (leagueId) => {
    try {
      console.log('🔍 [API DEBUG] Fetching league standings...', { leagueId });
      const response = await api.get(`/leagues/${leagueId}/standings`);
      
      console.log('📊 [API DEBUG] Raw API response:', response);
      console.log('📊 [API DEBUG] Response data:', response.data);
      console.log('📊 [API DEBUG] Standings array length:', response.data?.standings?.length || 0);
      
      if (response.data?.standings) {
        response.data.standings.forEach((standing, index) => {
          console.log(`👤 [API DEBUG] Standing ${index + 1}:`, {
            id: standing.id,
            displayName: standing.displayName,
            isAdmin: standing.isAdmin,
            isAdminExists: 'isAdmin' in standing,
            isAdminType: typeof standing.isAdmin,
            allFields: Object.keys(standing)
          });
        });
      }
      
      console.log('✅ [API DEBUG] League standings fetched:', response.data?.standings?.length || 0, 'members');
      // Return the direct format: { leagueId, standings }
      return response.data;
    } catch (error) {
      console.error('❌ [API DEBUG] Failed to fetch league standings:', error.message, { leagueId });
      throw new Error(`Failed to load league standings: ${error.message}`);
    }
  },

  // Update league settings (admin only)
  updateLeague: async (leagueId, updates) => {
    try {
      console.log('Updating league settings...', { leagueId, updates });
      const requestBody = {
        id: leagueId,
        name: updates.name,
        description: updates.description
      };
      
      const response = await api.put('/leagues/update', requestBody);
      console.log('League updated successfully:', response.data);
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
      
      console.log('📊 Fetching league predictions...', { leagueId, gameweek });
      
      // Always use gameweek in URL path
      const url = `/leagues/${leagueId}/predictions/${gameweek}`;
      
      const response = await api.get(url);
      
      console.log('✅ League predictions fetched:', {
        predictionsCount: response.data?.length || 0,
        leagueId,
        gameweek
      });
      
      // Log detailed prediction structure to debug undefined values
      console.log('📋 First prediction sample:', response.data?.[0]);
      
      // Map predictions to ensure compatibility with frontend expectations
      // Backend returns 'username' → map to 'userDisplayName'
      // Backend returns 'predictedAt' → map to 'date' for sorting
      // Backend returns 'PENDING'/'COMPLETE' → normalize to lowercase
      const mappedPredictions = (response.data || []).map(prediction => ({
        ...prediction,
        userDisplayName: prediction.username || prediction.userDisplayName || 'Unknown User',
        date: prediction.predictedAt || prediction.date, // Map predictedAt to date for sorting
        status: prediction.status ? prediction.status.toLowerCase() : 'pending' // Normalize status to lowercase
      }));
      
      console.log('✅ Mapped predictions with userDisplayName, date, and status:', {
        count: mappedPredictions.length,
        sampleNames: mappedPredictions.slice(0, 3).map(p => p.userDisplayName),
        sampleDates: mappedPredictions.slice(0, 3).map(p => p.date),
        sampleStatuses: mappedPredictions.slice(0, 3).map(p => p.status),
        allUniqueUsernames: [...new Set(mappedPredictions.map(p => p.username))],
        allUniqueUserDisplayNames: [...new Set(mappedPredictions.map(p => p.userDisplayName))]
      });
      
      // Log full details of first few predictions to debug grouping
      console.log('📋 First 3 predictions for grouping debug:', 
        mappedPredictions.slice(0, 3).map(p => ({
          username: p.username,
          userDisplayName: p.userDisplayName,
          homeTeam: p.homeTeam,
          awayTeam: p.awayTeam
        }))
      );
      
      return mappedPredictions;
    } catch (error) {
      console.error('❌ Failed to fetch league predictions:', {
        error: error.message,
        leagueId,
        gameweek
      });
      throw new Error(`Failed to load league predictions: ${error.message}`);
    }
  },

  // Remove member from league (admin only)
  removeMember: async (leagueId, memberId) => {
    try {
      console.log('🗑️ [REMOVE MEMBER] Starting removal process...', { leagueId, memberId });
      console.log('🗑️ [REMOVE MEMBER] Member ID type:', typeof memberId, 'Value:', memberId);
      console.log('🗑️ [REMOVE MEMBER] League ID type:', typeof leagueId, 'Value:', leagueId);
      
      const requestBody = {
        leagueId: leagueId,  // Changed from leagueid to leagueId (camelCase)
        userId: memberId     // Changed from userid to userId (camelCase)
      };
      
      console.log('🗑️ [REMOVE MEMBER] Request URL:', '/leagues/remove-user');
      console.log('🗑️ [REMOVE MEMBER] Request Method:', 'DELETE');
      console.log('🗑️ [REMOVE MEMBER] Request Body:', JSON.stringify(requestBody));
      
      const response = await api.delete('/leagues/remove-user', { data: requestBody });
      console.log('✅ [REMOVE MEMBER] Member removed successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ [REMOVE MEMBER] Failed to remove member:', error.message, { leagueId, memberId });
      console.error('❌ [REMOVE MEMBER] Full error object:', error);
      console.error('❌ [REMOVE MEMBER] Error response:', error.response?.data);
      console.error('❌ [REMOVE MEMBER] Error status:', error.response?.status);
      throw new Error(`Failed to remove member: ${error.message}`);
    }
  },

  // Promote member to admin (admin only)
  promoteMember: async (leagueId, memberId) => {
    try {
      console.log('⬆️ [PROMOTE MEMBER] Starting promotion process...', { leagueId, memberId });
      console.log('⬆️ [PROMOTE MEMBER] Member ID type:', typeof memberId, 'Value:', memberId);
      console.log('⬆️ [PROMOTE MEMBER] League ID type:', typeof leagueId, 'Value:', leagueId);
      
      const requestBody = {
        leagueId: leagueId,  // Changed from leagueid to leagueId (camelCase)
        userId: memberId     // Changed from userid to userId (camelCase)
      };
      
      console.log('⬆️ [PROMOTE MEMBER] Request URL:', '/leagues/add-admin');
      console.log('⬆️ [PROMOTE MEMBER] Request Method:', 'PUT');
      console.log('⬆️ [PROMOTE MEMBER] Request Body:', JSON.stringify(requestBody));
      
      const response = await api.put('/leagues/add-admin', requestBody);
      console.log('✅ [PROMOTE MEMBER] Member promoted successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ [PROMOTE MEMBER] Failed to promote member:', error.message, { leagueId, memberId });
      console.error('❌ [PROMOTE MEMBER] Full error object:', error);
      console.error('❌ [PROMOTE MEMBER] Error response:', error.response?.data);
      console.error('❌ [PROMOTE MEMBER] Error status:', error.response?.status);
      throw new Error(`Failed to promote member: ${error.message}`);
    }
  }
};

export default leagueAPI;

