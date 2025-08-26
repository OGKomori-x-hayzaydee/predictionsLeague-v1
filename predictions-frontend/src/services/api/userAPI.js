import baseAPI, { apiCall } from './baseAPI.js';
import { handleApiError } from '../../utils/apiErrorHandler.js';

/**
 * User API service
 * Handles all user-related API calls (profile, preferences, etc.)
 */
export const userAPI = {
  /**
   * Get current user profile
   * @returns {Promise<Object>} User profile data
   */
  async getProfile() {
    try {
      const response = await apiCall({
        method: 'GET',
        url: '/users/profile',
      });

      if (response.success) {
        return {
          success: true,
          user: response.data,
        };
      } else {
        throw new Error(response.error?.message || 'Failed to get user profile');
      }
    } catch (error) {
      handleApiError(error, { customMessage: 'Failed to load profile information.' });
      throw error;
    }
  },

  /**
   * Update user profile
   * @param {Object} userData - User profile data to update
   * @param {string} userData.username - Username
   * @param {string} userData.email - Email address
   * @param {string} userData.firstName - First name
   * @param {string} userData.lastName - Last name
   * @param {string} userData.favoriteTeam - Favorite team
   * @param {string} userData.bio - User bio/description
   * @returns {Promise<Object>} Updated user profile
   */
  async updateProfile(userData) {
    try {
      const response = await apiCall({
        method: 'PUT',
        url: '/users/profile',
        data: {
          username: userData.username,
          email: userData.email,
          firstName: userData.firstName,
          lastName: userData.lastName,
          favoriteTeam: userData.favoriteTeam,
          bio: userData.bio,
        },
      });

      if (response.success) {
        return {
          success: true,
          user: response.data,
        };
      } else {
        throw new Error(response.error?.message || 'Failed to update profile');
      }
    } catch (error) {
      handleApiError(error, { customMessage: 'Failed to update profile. Please try again.' });
      throw error;
    }
  },

  /**
   * Upload profile picture
   * @param {File} file - Profile picture file
   * @returns {Promise<Object>} Upload response with image URL
   */
  async uploadProfilePicture(file) {
    try {
      const formData = new FormData();
      formData.append('profilePicture', file);

      const response = await apiCall({
        method: 'POST',
        url: '/users/profile/picture',
        data: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.success) {
        return {
          success: true,
          imageUrl: response.data.imageUrl,
          user: response.data.user,
        };
      } else {
        throw new Error(response.error?.message || 'Failed to upload profile picture');
      }
    } catch (error) {
      handleApiError(error, { customMessage: 'Failed to upload profile picture. Please try again.' });
      throw error;
    }
  },

  /**
   * Delete profile picture
   * @returns {Promise<Object>} Delete response
   */
  async deleteProfilePicture() {
    try {
      const response = await apiCall({
        method: 'DELETE',
        url: '/users/profile/picture',
      });

      if (response.success) {
        return {
          success: true,
          user: response.data,
        };
      } else {
        throw new Error(response.error?.message || 'Failed to delete profile picture');
      }
    } catch (error) {
      handleApiError(error, { customMessage: 'Failed to delete profile picture. Please try again.' });
      throw error;
    }
  },

  /**
   * Get user preferences
   * @returns {Promise<Object>} User preferences
   */
  async getPreferences() {
    try {
      const response = await apiCall({
        method: 'GET',
        url: '/users/preferences',
      });

      if (response.success) {
        return {
          success: true,
          preferences: response.data,
        };
      } else {
        throw new Error(response.error?.message || 'Failed to get user preferences');
      }
    } catch (error) {
      handleApiError(error, { customMessage: 'Failed to load preferences.' });
      throw error;
    }
  },

  /**
   * Update user preferences
   * @param {Object} preferences - User preferences to update
   * @param {string} preferences.theme - Theme preference (light, dark, auto)
   * @param {boolean} preferences.emailNotifications - Email notification preference
   * @param {boolean} preferences.pushNotifications - Push notification preference
   * @param {string} preferences.language - Language preference
   * @param {string} preferences.timezone - Timezone preference
   * @param {boolean} preferences.privatePredictions - Private predictions setting
   * @returns {Promise<Object>} Updated preferences
   */
  async updatePreferences(preferences) {
    try {
      const response = await apiCall({
        method: 'PUT',
        url: '/users/preferences',
        data: preferences,
      });

      if (response.success) {
        return {
          success: true,
          preferences: response.data,
        };
      } else {
        throw new Error(response.error?.message || 'Failed to update preferences');
      }
    } catch (error) {
      handleApiError(error, { customMessage: 'Failed to update preferences. Please try again.' });
      throw error;
    }
  },

  /**
   * Get user statistics
   * @returns {Promise<Object>} User statistics
   */
  async getStatistics() {
    try {
      const response = await apiCall({
        method: 'GET',
        url: '/users/statistics',
      });

      if (response.success) {
        return {
          success: true,
          statistics: response.data,
        };
      } else {
        throw new Error(response.error?.message || 'Failed to get user statistics');
      }
    } catch (error) {
      handleApiError(error, { customMessage: 'Failed to load statistics.' });
      throw error;
    }
  },

  /**
   * Get user's prediction history
   * @param {Object} options - Query options
   * @param {number} options.page - Page number (default: 1)
   * @param {number} options.limit - Items per page (default: 20)
   * @param {string} options.season - Season filter
   * @param {string} options.competition - Competition filter
   * @returns {Promise<Object>} Prediction history
   */
  async getPredictionHistory(options = {}) {
    try {
      const { page = 1, limit = 20, season, competition } = options;
      
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });
      
      if (season) params.append('season', season);
      if (competition) params.append('competition', competition);

      const response = await apiCall({
        method: 'GET',
        url: `/users/predictions/history?${params.toString()}`,
      });

      if (response.success) {
        return {
          success: true,
          predictions: response.data.predictions,
          pagination: response.data.pagination,
        };
      } else {
        throw new Error(response.error?.message || 'Failed to get prediction history');
      }
    } catch (error) {
      handleApiError(error, { customMessage: 'Failed to load prediction history.' });
      throw error;
    }
  },

  /**
   * Change user password
   * @param {Object} passwordData - Password change data
   * @param {string} passwordData.currentPassword - Current password
   * @param {string} passwordData.newPassword - New password
   * @param {string} passwordData.confirmPassword - Confirm new password
   * @returns {Promise<Object>} Password change response
   */
  async changePassword(passwordData) {
    try {
      const response = await apiCall({
        method: 'PUT',
        url: '/users/change-password',
        data: {
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
          confirmPassword: passwordData.confirmPassword,
        },
      });

      if (response.success) {
        return {
          success: true,
          message: 'Password changed successfully',
        };
      } else {
        throw new Error(response.error?.message || 'Failed to change password');
      }
    } catch (error) {
      handleApiError(error, { customMessage: 'Failed to change password. Please try again.' });
      throw error;
    }
  },

  /**
   * Delete user account
   * @param {string} password - Current password for confirmation
   * @returns {Promise<Object>} Account deletion response
   */
  async deleteAccount(password) {
    try {
      const response = await apiCall({
        method: 'DELETE',
        url: '/users/account',
        data: { password },
      });

      if (response.success) {
        return {
          success: true,
          message: 'Account deleted successfully',
        };
      } else {
        throw new Error(response.error?.message || 'Failed to delete account');
      }
    } catch (error) {
      handleApiError(error, { customMessage: 'Failed to delete account. Please try again.' });
      throw error;
    }
  },

  /**
   * Get user's leagues
   * @returns {Promise<Object>} User's leagues
   */
  async getUserLeagues() {
    try {
      const response = await apiCall({
        method: 'GET',
        url: '/users/leagues',
      });

      if (response.success) {
        return {
          success: true,
          leagues: response.data,
        };
      } else {
        throw new Error(response.error?.message || 'Failed to get user leagues');
      }
    } catch (error) {
      handleApiError(error, { customMessage: 'Failed to load your leagues.' });
      throw error;
    }
  },
};

export default userAPI;
