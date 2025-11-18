import baseAPI from './baseAPI';

export const statusBarAPI = {
  // Get user profile data for status bar
  getUserProfile: async () => {
    try {
      const response = await baseAPI.get('/api/user/profile');
      return response.data.data;
    } catch (error) {
      console.error('Failed to fetch user profile:', error);
      throw error;
    }
  },

  // Get user stats (points, rank, predictions count)
  getUserStats: async () => {
    try {
      const response = await baseAPI.get('/api/user/stats');
      return response.data.data;
    } catch (error) {
      console.error('Failed to fetch user stats:', error);
      throw error;
    }
  },

  // Get next match timing and pending predictions
  getNextMatchInfo: async () => {
    try {
      const response = await baseAPI.get('/api/matches/next');
      return response.data.data;
    } catch (error) {
      console.error('Failed to fetch next match info:', error);
      throw error;
    }
  },

  // Get all status bar data in one call (alternative approach)
  getStatusBarData: async () => {
    try {
      const response = await baseAPI.get('/api/user/status-bar');
      return response.data.data;
    } catch (error) {
      console.error('Failed to fetch status bar data:', error);
      throw error;
    }
  }
};

export default statusBarAPI;
