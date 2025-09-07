import baseAPI, { apiCall, setTokens, clearTokens } from './baseAPI.js';
import { handleApiError } from '../../utils/apiErrorHandler.js';

/**
 * Authentication API service
 * Handles all authentication-related API calls
 */
export const authAPI = {
  /**
   * Login user with username/email and password
   * @param {Object} credentials - User login credentials
   * @param {string} credentials.username - Username or email
   * @param {string} credentials.password - Password
   * @returns {Promise<Object>} Login response with user data
   */
  async login(credentials) {
    try {
      const response = await apiCall({
        method: 'POST',
        url: '/auth/login',
        data: {
          email: credentials.email || credentials.username,
          password: credentials.password,
        },
      });

      if (response.success) {
        // With HTTP-only cookies, tokens are automatically stored by browser
        // We only need to handle user data and auth state
        const { user } = response.data;
        setTokens('http-only', 'http-only'); // Mark as authenticated
        
        return {
          success: true,
          user,
        };
      } else {
        throw new Error(response.error?.message || 'Login failed');
      }
    } catch (error) {
      handleApiError(error, { customMessage: 'Login failed. Please check your credentials.' });
      throw error;
    }
  },

  /**
   * Register new user
   */
  async register(userData) {
    try {
      // Frontend validation: Check if passwords match
      if (userData.password !== userData.confirmPassword) {
        throw new Error('Passwords do not match');
      }

      // Only send necessary data to backend (no confirmPassword)
      const response = await apiCall({
        method: 'POST',
        url: '/auth/register',
        data: {
          username: userData.username,
          email: userData.email,
          password: userData.password,
          firstName: userData.firstName,
          lastName: userData.lastName,
          favouriteTeam: userData.favouriteTeam,
        },
      });

      if (response.success) {
        // With HTTP-only cookies, tokens are automatically stored by browser
        // We only need to handle user data and auth state
        const { user } = response.data;
        setTokens('http-only', 'http-only'); // Mark as authenticated
        
        return {
          success: true,
          user,
        };
      } else {
        throw new Error(response.error?.message || 'Registration failed');
      }
    } catch (error) {
      handleApiError(error, { customMessage: 'Registration failed. Please try again.' });
      throw error;
    }
  },

  /**
   * Logout user
   */
  async logout() {
    try {
      console.log("🔄 authAPI.logout: Starting logout process...");
      
      const response = await apiCall({
        method: 'POST',
        url: '/auth/logout',
      });

      console.log("📥 authAPI.logout: Backend response:", response);

      // Clear tokens regardless of response
      clearTokens();
      console.log("🧹 authAPI.logout: Tokens cleared");

      return {
        success: true,
        message: 'Logged out successfully',
      };
    } catch (error) {
      console.error("❌ authAPI.logout: Error during logout:", error);
      
      // Clear tokens even if logout API call fails
      clearTokens();
      console.log("🧹 authAPI.logout: Tokens cleared despite error");
      
      handleApiError(error, { silent: true });
      
      return {
        success: true,
        message: 'Logged out successfully',
      };
    }
  },

  /**
   * Send OTP for verification (e.g., email verification, 2FA)
   * @param {Object} otpData - OTP request data
   * @param {string} otpData.email - Email address to send OTP to
   * @param {string} otpData.type - Type of OTP (e.g., 'email_verification', '2fa')
   * @returns {Promise<Object>} OTP send response
   */
  async sendVerifyOtp(otpData) {
    try {
      const response = await apiCall({
        method: 'POST',
        url: '/auth/send-verify-otp',
        data: {
          email: otpData.email,
          type: otpData.type || 'email_verification',
        },
      });

      if (response.success) {
        return {
          success: true,
          message: 'OTP sent successfully',
        };
      } else {
        throw new Error(response.error?.message || 'Failed to send OTP');
      }
    } catch (error) {
      handleApiError(error, { customMessage: 'Failed to send verification code.' });
      throw error;
    }
  },

  /**
   * Verify OTP code
   * @param {Object} verifyData - OTP verification data
   * @param {string} verifyData.email - Email address
   * @param {string} verifyData.otp - OTP code to verify
   * @param {string} verifyData.type - Type of OTP verification
   * @returns {Promise<Object>} OTP verification response
   */
  async verifyOtp(verifyData) {
    try {
      const response = await apiCall({
        method: 'POST',
        url: '/auth/verify-otp',
        data: {
          email: verifyData.email,
          otp: verifyData.otp,
          type: verifyData.type || 'email_verification',
        },
      });

      if (response.success) {
        return {
          success: true,
          message: 'OTP verified successfully',
          data: response.data,
        };
      } else {
        throw new Error(response.error?.message || 'OTP verification failed');
      }
    } catch (error) {
      handleApiError(error, { customMessage: 'Invalid verification code. Please try again.' });
      throw error;
    }
  },

  /**
   * Get current user information
   * Uses existing protected endpoint since /auth/me doesn't exist
   * @returns {Promise<Object>} Current user data
   */
  async getCurrentUser() {
    try {
      // Use existing protected endpoint to verify authentication
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/profile/home`, {
        method: 'GET',
        credentials: 'include', // Include HTTP-only cookies
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const responseText = await response.text();
        console.log('Auth check response:', responseText);
        
        // Extract email from response text "Viewing the HomePage of {email}"
        const emailMatch = responseText.match(/of (.+)$/);
        const email = emailMatch ? emailMatch[1].trim() : null;
        
        if (email) {
          return {
            success: true,
            user: {
              email: email,
              authenticated: true,
              source: 'profile-endpoint'
            },
          };
        } else {
          throw new Error('Could not extract user info from response');
        }
      } else {
        throw new Error(`Authentication check failed: ${response.status}`);
      }
    } catch (error) {
      // Don't show error notifications for auth checks
      console.error('getCurrentUser error:', error);
      throw error;
    }
  },

  /**
   * ADDED: Get user info compatible with OAuth flow
   * Provides better structure for OAuth users during onboarding
   * @returns {Promise<Object>} OAuth-compatible user data
   */
  async getOAuthUserInfo() {
    try {
      console.log('🔄 Getting OAuth-compatible user info');
      
      // First check if user is authenticated using existing endpoint
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/profile/home`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const responseText = await response.text();
        
        // Extract email from response text
        const emailMatch = responseText.match(/of (.+)$/);
        const email = emailMatch ? emailMatch[1].trim() : null;
        
        if (email) {
          // TODO: When your backend provides a proper user info endpoint, use it here
          // For now, provide OAuth-compatible structure with what we have
          return {
            success: true,
            user: {
              email: email,
              authenticated: true,
              source: 'oauth-compatible',
              // Placeholder fields for OAuth users
              // These will be properly populated by your backend
              userID: null, // Will be filled by backend
              username: null, // Will be filled during onboarding  
              firstName: null, // Will be filled by backend
              lastName: null, // Will be filled by backend
              favouriteTeam: null, // Will be filled during onboarding
              profilePicture: null, // Will be filled by backend
              isOAuthUser: true, // Mark as OAuth user
            },
          };
        } else {
          throw new Error('Could not extract user info from response');
        }
      } else {
        throw new Error(`OAuth user info check failed: ${response.status}`);
      }
    } catch (error) {
      console.error('getOAuthUserInfo error:', error);
      throw error;
    }
  },

  /**
   * Calls the backend endpoint to finish user onboarding
   * @param {Object} profileData - Profile completion data
   * @param {string} profileData.username - Chosen username
   * @param {string} profileData.favouriteTeam - Selected favorite team
   * @returns {Promise<Object>} Profile completion response
   */
  async completeOAuthProfile(profileData) {
    try {
      console.log('🔄 Completing OAuth profile');
      
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/oauth2/complete-profile`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: profileData.username,
          favouriteTeam: profileData.favouriteTeam
        })
      });

      if (response.ok) {
        const result = await response.json();
        
        if (result.success) {
          // Mark as authenticated with complete profile
          setTokens('http-only', 'http-only');
          
          return {
            success: true,
            user: result.user,
            message: result.message || 'Profile completed successfully'
          };
        } else {
          throw new Error(result.error || 'Profile completion failed');
        }
      } else {
        const errorData = await response.json().catch(() => ({}));
        
        if (response.status === 409) {
          throw new Error(errorData.error || 'Username already taken');
        } else if (response.status === 400) {
          throw new Error(errorData.error || 'Invalid profile data');
        } else if (response.status === 401) {
          throw new Error('Not authenticated - please sign in again');
        } else {
          throw new Error(errorData.error || 'Failed to complete profile');
        }
      }
    } catch (error) {
      console.error('OAuth profile completion error:', error);
      handleApiError(error, { customMessage: 'Failed to complete profile. Please try again.' });
      throw error;
    }
  },

  /**
   * ADDED: Check if current user needs to complete OAuth onboarding
   * Useful for determining redirect logic
   * @returns {Promise<Object>} Onboarding status
   */
  async checkOAuthOnboardingStatus() {
    try {
      // This would ideally call a dedicated endpoint, but for now we use profile check
      const userInfo = await this.getOAuthUserInfo();
      
      if (userInfo.success && userInfo.user) {
        const user = userInfo.user;
        const needsOnboarding = !user.username || !user.favouriteTeam;
        
        return {
          success: true,
          needsOnboarding,
          user: user,
          missingFields: {
            username: !user.username,
            favouriteTeam: !user.favouriteTeam,
          }
        };
      } else {
        throw new Error('Could not determine onboarding status');
      }
    } catch (error) {
      console.error('OAuth onboarding status check error:', error);
      throw error;
    }
  },
};

export default authAPI;