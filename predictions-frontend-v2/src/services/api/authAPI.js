import baseAPI, { apiCall, setTokens, clearTokens } from './baseAPI.js';
import { handleApiError } from '../../utils/apiErrorHandler.js';
import { mapTeamToBackendFormat } from '../../utils/teamUtils.js';

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
   * Complete user profile (for regular signup flow)
   * @param {Object} profileData - Profile completion data
   * @param {string} profileData.username - Chosen username
   * @param {string} profileData.favouriteTeam - Selected favorite team
   * @param {string} [profileData.email] - User's email address (optional - backend can identify from session)
   * @returns {Promise<Object>} Profile completion response
   */
  async completeProfile(profileData) {
    try {
      console.log('CompleteProfile - Input data:', profileData);
      console.log('CompleteProfile - Email present?', !!profileData.email);
      console.log('CompleteProfile - Email value:', profileData.email);
      
      const mappedTeam = mapTeamToBackendFormat(profileData.favouriteTeam);
      console.log('CompleteProfile - Team mapping:', {
        original: profileData.favouriteTeam,
        mapped: mappedTeam
      });
      
      const requestData = {
        username: profileData.username,
        favouriteTeam: mappedTeam,
      };
      
      // Include email only if provided (backend can identify user from session if not provided)
      if (profileData.email) {
        requestData.email = profileData.email;
        console.log('CompleteProfile - Email added to request:', requestData.email);
      } else {
        console.log('CompleteProfile - No email provided, backend will identify from session');
      }
      
      console.log('CompleteProfile - Final request data:', requestData);
      
      const response = await apiCall({
        method: 'POST',
        url: '/auth/finish-registration',
        data: requestData,
      });

      console.log('CompleteProfile - API response received:', response);

      if (response.success) {
        console.log('CompleteProfile - Success! Setting tokens and returning user data');
        console.log('CompleteProfile - Response data:', response.data);
        
        // Profile completion successful - user is now fully authenticated
        setTokens('http-only', 'http-only'); // Mark as authenticated
        console.log('CompleteProfile - Tokens set to http-only');
        
        // Handle case where backend doesn't return user object
        let userData = response.data.user;
        if (!userData) {
          console.log('CompleteProfile - No user data in response, constructing from request');
          // Construct user data from what we know
          userData = {
            username: requestData.username,
            email: requestData.email,
            favouriteTeam: requestData.favouriteTeam,
          };
        }
        console.log('CompleteProfile - Final user data:', userData);
        
        return {
          success: true,
          user: userData,
          message: response.data.message || response.data || 'Profile completed successfully'
        };
      } else {
        console.error('CompleteProfile - API returned success: false', response.error);
        throw new Error(response.error?.message || 'Profile completion failed');
      }
    } catch (error) {
      console.error('CompleteProfile - Error caught:', error);
      handleApiError(error, { customMessage: 'Failed to complete profile. Please try again.' });
      throw error;
    }
  },

  /**
   * Register new user (initial incomplete registration)
   */
  async register(userData) {
    try {
      console.log('AuthAPI.register - Starting registration with data:', {
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        hasPassword: !!userData.password
      });

      // Frontend validation: Check if passwords match
      if (userData.password !== userData.confirmPassword) {
        throw new Error('Passwords do not match');
      }

      // Only send basic user data to backend (no username/favouriteTeam yet)
      const requestData = {
        email: userData.email,
        password: userData.password,
        firstName: userData.firstName,
        lastName: userData.lastName,
        // username and favouriteTeam will be added later via completeProfile
      };

      console.log('AuthAPI.register - Making API call to /auth/register');
      
      const response = await apiCall({
        method: 'POST',
        url: '/auth/register',
        data: requestData,
      });

      console.log('AuthAPI.register - API response:', response);

      if (response.success) {
        console.log('AuthAPI.register - Registration successful');
        // For incomplete registration, don't set tokens yet
        // User needs to verify email and complete profile first
        return {
          success: true,
          message: response.data.message || 'Registration initiated. Please verify your email.',
          // Don't return user data yet since registration is incomplete
        };
      } else {
        console.error('AuthAPI.register - Registration failed:', response.error);
        throw new Error(response.error?.message || 'Registration failed');
      }
    } catch (error) {
      console.error('AuthAPI.register - Error caught:', error);
      handleApiError(error, { customMessage: 'Registration failed. Please try again.' });
      throw error;
    }
  },

  /**
   * Logout user
   */
  async logout() {
    try {
      const response = await apiCall({
        method: 'POST',
        url: '/auth/logout',
      });

      // Clear tokens regardless of response
      clearTokens();

      return {
        success: true,
        message: 'Logged out successfully',
      };
    } catch (error) {
      // Clear tokens even if logout API call fails
      clearTokens();
      
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
   * Uses the /dashboard/me endpoint
   * @returns {Promise<Object>} Current user data
   */
  async getCurrentUser() {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/dashboard/me`, {
        method: 'GET',
        credentials: 'include', // Include HTTP-only cookies
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const responseData = await response.json();
        
        // Extract the user object from the response structure
        const user = responseData.user || responseData;
        
        // Update localStorage to reflect successful authentication
        setTokens('http-only', 'http-only');
        
        // Return the extracted user object
        return {
          success: true,
          user: user,
        };
      } else {
        throw new Error(`Authentication check failed: ${response.status}`);
      }
    } catch (error) {
      // Don't log 401 errors - they're expected for OAuth users during onboarding
      if (!error.message?.includes('401') && !error.message?.includes('Authentication check failed: 401')) {
        console.error('AuthAPI.getCurrentUser - Unexpected error:', error);
      }
      // Still throw the error so AuthContext can handle it appropriately
      throw error;
    }
  },

  /**
   * Calls the backend endpoint to finish user onboarding
   * @param {Object} profileData - Profile completion data
   * @param {string} profileData.username - Chosen username
   * @param {string} profileData.favouriteTeam - Selected favorite team
   * @param {string} [profileData.email] - User's email address (optional - from OAuth callback)
   * @returns {Promise<Object>} Profile completion response
   */
  async completeOAuthProfile(profileData) {
    try {
      console.log('CompleteOAuthProfile - Input data:', profileData);
      
      const requestData = {
        username: profileData.username,
        favouriteTeam: mapTeamToBackendFormat(profileData.favouriteTeam) // Convert to backend format
      };
      
      // Include email if provided from OAuth callback
      if (profileData.email) {
        requestData.email = profileData.email;
        console.log('CompleteOAuthProfile - Email included:', profileData.email);
      } else {
        console.log('CompleteOAuthProfile - No email provided, backend will identify from session');
      }
      
      console.log('CompleteOAuthProfile - Final request data:', requestData);
      
      const response = await apiCall({
        method: 'POST',
        url: '/auth/finish-registration',
        data: requestData
      });

      if (response.success) {
        // Mark as authenticated with complete profile
        setTokens('http-only', 'http-only');
        
        return {
          success: true,
          user: response.data.user,
          message: response.data.message || 'Profile completed successfully'
        };
      } else {
        throw new Error(response.error?.message || 'Profile completion failed');
      }
    } catch (error) {
      handleApiError(error, { customMessage: 'Failed to complete profile. Please try again.' });
      throw error;
    }
  },
};

export default authAPI;