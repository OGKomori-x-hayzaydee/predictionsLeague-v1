// src/services/api/dashboardAPI.js
import { apiCall } from './baseAPI';

const dashboardAPI = {
  // Critical data - loads first (includes user data for StatusBar)
  getEssentialData: async () => {
    try {
      const response = await apiCall({
        method: 'GET',
        url: '/dashboard/me',
      });
      
      if (response.success) {
        return response.data;
      } else {
        throw new Error(response.error?.message || 'Failed to fetch essential data');
      }
    } catch (error) {
      console.error('Failed to fetch essential dashboard data:', error);
      throw error;
    }
  },

  getUserLeagues: async (limit = 5) => {
    try {
      const response = await apiCall({
        method: 'GET',
        url: `/dashboard/leagues/user?limit=${limit}`,
      });
      
      if (response.success) {
        return response.data;
      } else {
        console.error('Failed to fetch user leagues:', response.error);
        return [];
      }
    } catch (error) {
      console.error('Failed to fetch user leagues:', error);
      return [];
    }
  },

  // Recent scored predictions (all gameweeks) — used to build the
  // Dashboard's "LAST GAMEWEEK" ledger by filtering to the most recently
  // completed gameweek client-side.
  getRecentPredictions: async () => {
    try {
      const response = await apiCall({
        method: 'GET',
        url: '/dashboard/predictions/recent',
      });

      if (response.success) {
        return response.data || [];
      } else {
        console.error('Failed to fetch recent predictions:', response.error);
        return [];
      }
    } catch (error) {
      console.error('Failed to fetch recent predictions:', error);
      return [];
    }
  },

  getPerformanceInsights: async () => {
    try {
      const response = await apiCall({
        method: 'GET',
        url: '/dashboard/user/insights',
      });
      
      if (response.success) {
        return response.data;
      } else {
        console.error('Failed to fetch performance insights:', response.error);
        return [];
      }
    } catch (error) {
      console.error('Failed to fetch performance insights:', error);
      return [];
    }
  }
};

export default dashboardAPI;