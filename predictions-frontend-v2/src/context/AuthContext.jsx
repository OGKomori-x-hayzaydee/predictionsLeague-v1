import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { getTokens, setTokens, clearTokens } from '../services/api/baseAPI.js';
import baseAPI from '../services/api/baseAPI.js';
import authAPI from '../services/api/authAPI.js';
import authService from '../services/auth/AuthService.js';
import { AUTH_STATES as ENHANCED_AUTH_STATES } from '../constants/authStates.js';
import { notificationManager } from '../services/notificationService.js';

// Legacy auth states (keep for backward compatibility)
const AUTH_STATES = {
  LOADING: 'LOADING',
  AUTHENTICATED: 'AUTHENTICATED',
  UNAUTHENTICATED: 'UNAUTHENTICATED',
};

// Auth actions (legacy + enhanced)
const AUTH_ACTIONS = {
  // Legacy actions (keep for backward compatibility)
  SET_LOADING: 'SET_LOADING',
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  LOGOUT: 'LOGOUT',
  UPDATE_USER: 'UPDATE_USER',
  SET_ERROR: 'SET_ERROR',
  CLEAR_ERROR: 'CLEAR_ERROR',
  
  // Enhanced OAuth actions
  INIT_START: 'INIT_START',
  INIT_SUCCESS: 'INIT_SUCCESS', 
  INIT_FAILURE: 'INIT_FAILURE',
  OAUTH_CALLBACK_START: 'OAUTH_CALLBACK_START',
  OAUTH_DATA_RECEIVED: 'OAUTH_DATA_RECEIVED',
  OAUTH_USER_TYPE_DETERMINED: 'OAUTH_USER_TYPE_DETERMINED',
  OAUTH_PROFILE_COMPLETION_START: 'OAUTH_PROFILE_COMPLETION_START',
  OAUTH_PROFILE_COMPLETION_SUCCESS: 'OAUTH_PROFILE_COMPLETION_SUCCESS',
  TOKEN_REFRESH_START: 'TOKEN_REFRESH_START',
  TOKEN_REFRESH_SUCCESS: 'TOKEN_REFRESH_SUCCESS',
  TOKEN_REFRESH_FAILURE: 'TOKEN_REFRESH_FAILURE',
  AUTH_ERROR: 'AUTH_ERROR',
};

// Initial state (enhanced and optimized)
const initialState = {
  // Legacy properties (keep for backward compatibility)
  status: AUTH_STATES.LOADING,
  user: null,
  error: null,
  isAuthenticated: false,
  
  // Enhanced properties for OAuth support
  authState: ENHANCED_AUTH_STATES.INITIALIZING,
  oauthData: {
    email: null,
    provider: null,
    providerId: null,
    isReturningUser: null
  },
  lastAuthCheck: null,
  
  // Capability flags (computed from authState)
  canAccessProtectedRoutes: false,
  needsProfileCompletion: false,
  needsEmailVerification: false
};

// Auth reducer (enhanced)
const authReducer = (state, action) => {
  switch (action.type) {
    // Legacy actions (preserve exact behavior)
    case AUTH_ACTIONS.SET_LOADING:
      return {
        ...state,
        status: AUTH_STATES.LOADING,
        authState: ENHANCED_AUTH_STATES.INITIALIZING,
        error: null,
      };
      
    case AUTH_ACTIONS.LOGIN_SUCCESS:
      const newState = {
        ...state,
        status: AUTH_STATES.AUTHENTICATED,
        authState: ENHANCED_AUTH_STATES.AUTHENTICATED,
        user: action.payload.user,
        isAuthenticated: true,
        canAccessProtectedRoutes: true,
        needsProfileCompletion: false,
        error: null,
        lastAuthCheck: Date.now(),
      };
      return newState;
      
    case AUTH_ACTIONS.LOGOUT:
      return {
        ...state,
        status: AUTH_STATES.UNAUTHENTICATED,
        authState: ENHANCED_AUTH_STATES.UNAUTHENTICATED,
        user: null,
        isAuthenticated: false,
        canAccessProtectedRoutes: false,
        oauthData: { email: null, provider: null, providerId: null, isReturningUser: null },
        error: null,
      };
      
    case AUTH_ACTIONS.UPDATE_USER:
      return {
        ...state,
        user: { ...state.user, ...action.payload },
      };
      
    case AUTH_ACTIONS.SET_ERROR:
      return {
        ...state,
        status: AUTH_STATES.UNAUTHENTICATED,
        authState: ENHANCED_AUTH_STATES.AUTH_ERROR,
        error: action.payload,
        isAuthenticated: false,
        canAccessProtectedRoutes: false,
      };
      
    case AUTH_ACTIONS.CLEAR_ERROR:
      return {
        ...state,
        error: null,
      };

    // New OAuth actions
    case AUTH_ACTIONS.INIT_START:
      return {
        ...state,
        authState: ENHANCED_AUTH_STATES.INITIALIZING,
        error: null,
      };

    case AUTH_ACTIONS.INIT_SUCCESS:
      return {
        ...state,
        authState: ENHANCED_AUTH_STATES.UNAUTHENTICATED,
        status: AUTH_STATES.UNAUTHENTICATED,
        lastAuthCheck: Date.now(),
      };

    case AUTH_ACTIONS.INIT_FAILURE:
      return {
        ...state,
        authState: ENHANCED_AUTH_STATES.AUTH_ERROR,
        status: AUTH_STATES.UNAUTHENTICATED,
        error: action.payload.error,
      };

    case AUTH_ACTIONS.OAUTH_CALLBACK_START:
      return {
        ...state,
        authState: ENHANCED_AUTH_STATES.OAUTH_CALLBACK,
        error: null,
      };

    case AUTH_ACTIONS.OAUTH_DATA_RECEIVED:
      return {
        ...state,
        oauthData: {
          ...state.oauthData,
          ...action.payload,
        },
      };

    case AUTH_ACTIONS.OAUTH_USER_TYPE_DETERMINED:
      return {
        ...state,
        authState: action.payload.needsOnboarding 
          ? ENHANCED_AUTH_STATES.OAUTH_PENDING 
          : ENHANCED_AUTH_STATES.AUTHENTICATED,
        needsProfileCompletion: action.payload.needsOnboarding,
      };

    case AUTH_ACTIONS.OAUTH_PROFILE_COMPLETION_START:
      return {
        ...state,
        error: null,
      };

    case AUTH_ACTIONS.OAUTH_PROFILE_COMPLETION_SUCCESS:
      return {
        ...state,
        authState: ENHANCED_AUTH_STATES.AUTHENTICATED,
        status: AUTH_STATES.AUTHENTICATED,
        user: action.payload.user,
        isAuthenticated: true,
        canAccessProtectedRoutes: true,
        needsProfileCompletion: false,
        oauthData: { email: null, provider: null, providerId: null, isReturningUser: null }, // Clear OAuth data
        lastAuthCheck: Date.now(),
      };

    case AUTH_ACTIONS.AUTH_ERROR:
      return {
        ...state,
        authState: ENHANCED_AUTH_STATES.AUTH_ERROR,
        status: AUTH_STATES.UNAUTHENTICATED,
        error: action.payload.error,
        isAuthenticated: false,
        canAccessProtectedRoutes: false,
      };
      
    default:
      return state;
  }
};

// Create context
const AuthContext = createContext(null);

// Auth provider component
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);
  
  // Enhanced initialization to handle all OAuth scenarios
  useEffect(() => {
    const initializeAuth = async () => {
      dispatch({ type: AUTH_ACTIONS.INIT_START });
      
      try {
        // Check if we're in an OAuth callback
        const currentPath = window.location.pathname;
        const urlParams = new URLSearchParams(window.location.search);
        
        if (currentPath === '/auth/callback') {
          // OAuth callback will be handled by useOAuthCallback hook
          // Just set initial state and let the callback handler take over
          dispatch({ type: AUTH_ACTIONS.INIT_SUCCESS });
          return;
        }
        
        // Check for existing OAuth session data
        const oauthEmail = sessionStorage.getItem('oauth_user_email');
        if (oauthEmail) {
          dispatch({ 
            type: AUTH_ACTIONS.OAUTH_DATA_RECEIVED, 
            payload: { email: oauthEmail } 
          });
        }
        
        // Always attempt server verification (ignore localStorage)
        // Let HTTP-only cookies be the source of truth
        try {
          const authResult = await authService.checkAuth({ 
            source: 'auth-context-enhanced-init-always-verify' 
          });
          
          if (authResult.isAuthenticated && authResult.user) {
            dispatch({
              type: AUTH_ACTIONS.LOGIN_SUCCESS,
              payload: { user: authResult.user },
            });
            return;
          }
        } catch (error) {
          // Server auth check failed, continue to determine state
        }
        
        // No valid JWT found - determine user state
        if (oauthEmail) {
          // OAuth user without JWT - needs onboarding
          dispatch({ 
            type: AUTH_ACTIONS.OAUTH_USER_TYPE_DETERMINED, 
            payload: { needsOnboarding: true } 
          });
        } else {
          // Regular unauthenticated user
          dispatch({ type: AUTH_ACTIONS.INIT_SUCCESS });
        }
        
      } catch (error) {
        console.error('AuthContext - Initialization failed:', error);
        dispatch({ 
          type: AUTH_ACTIONS.INIT_FAILURE, 
          payload: { error: error.message || 'Initialization failed' } 
        });
      }
    };
    
    initializeAuth();
  }, []);
  
  // Login function
  const login = async (credentials) => {
    dispatch({ type: AUTH_ACTIONS.SET_LOADING });
    
    try {
      // Special handling for OAuth callback login (no API call needed)
      if (credentials?.skipApiCall && credentials?.userData) {
        dispatch({
          type: AUTH_ACTIONS.LOGIN_SUCCESS,
          payload: { user: credentials.userData },
        });
        
        return { success: true };
      }
      
      // Normal login flow
      const response = await authAPI.login(credentials);
      
      if (response.success) {
        dispatch({
          type: AUTH_ACTIONS.LOGIN_SUCCESS,
          payload: { user: response.user },
        });
        
        // Show login notification
        notificationManager.auth.loginSuccess(response.user);
        
        return { success: true };
      } else {
        throw new Error(response.error || 'Login failed');
      }
    } catch (error) {
      dispatch({
        type: AUTH_ACTIONS.SET_ERROR,
        payload: error.message || 'Login failed',
      });
      
      return { success: false, error: error.message };
    }
  };
  
  // Logout function
  const logout = async () => {
    try {
      await authAPI.logout();
      dispatch({ type: AUTH_ACTIONS.LOGOUT });
      
      // Show logout notification
      notificationManager.auth.logoutSuccess();
      
      return { success: true };
    } catch (error) {
      // Even if API call fails, clear local state
      dispatch({ type: AUTH_ACTIONS.LOGOUT });
      
      // Still show logout notification since user is logged out locally
      notificationManager.auth.logoutSuccess();
      
      return { success: false, error: error.message };
    }
  };
  
  // Register function (for incomplete registration)
  const register = async (userData) => {
    dispatch({ type: AUTH_ACTIONS.SET_LOADING });
    
    try {
      const response = await authAPI.register(userData);
      
      if (response.success) {
        // Don't update auth state yet since registration is incomplete
        // User needs to verify email and complete profile first
        // Set back to unauthenticated (not loading) since registration succeeded but user isn't logged in yet
        dispatch({ 
          type: AUTH_ACTIONS.LOGOUT // This sets status to UNAUTHENTICATED and clears loading
        });
        
        // Show register notification
        notificationManager.auth.registerSuccess(userData);
        
        // Add a small delay to ensure state update is processed
        await new Promise(resolve => setTimeout(resolve, 50));
        
        return { success: true, message: response.message };
      } else {
        throw new Error(response.error || 'Registration failed');
      }
    } catch (error) {
      dispatch({
        type: AUTH_ACTIONS.SET_ERROR,
        payload: error.message || 'Registration failed',
      });
      
      return { success: false, error: error.message };
    }
  };
  
  // Update user profile
  const updateUser = (userData) => {
    dispatch({
      type: AUTH_ACTIONS.UPDATE_USER,
      payload: userData,
    });
  };
  
  // Clear error
  const clearError = () => {
    dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR });
  };

  // Enhanced OAuth helper methods (Phase 2 - full implementation)
  const handleOAuthCallback = async (urlParams) => {
    dispatch({ type: AUTH_ACTIONS.OAUTH_CALLBACK_START });
    
    try {
      const email = urlParams.get('email');
      
      // Store email in session storage if provided by backend (SAME as current)
      if (email) {
        sessionStorage.setItem('oauth_user_email', email);
        
        // Store in AuthContext state too
        dispatch({ 
          type: AUTH_ACTIONS.OAUTH_DATA_RECEIVED, 
          payload: { email } 
        });
      }
      
      // Check if user already has JWT (same logic as current loader)
      try {
        const userResponse = await authAPI.getCurrentUser();
        
        if (userResponse.success && userResponse.user) {
          // User already authenticated - returning user flow
          dispatch({ 
            type: AUTH_ACTIONS.LOGIN_SUCCESS, 
            payload: { user: userResponse.user } 
          });
          return { success: true, needsOnboarding: false };
        }
      } catch (authError) {
        // No JWT or invalid JWT - proceed with OAuth flow
      }
      
      // No JWT found - user needs onboarding (SAME decision logic as current)
      if (email) {
        dispatch({ 
          type: AUTH_ACTIONS.OAUTH_USER_TYPE_DETERMINED, 
          payload: { needsOnboarding: true } 
        });
        return { success: true, needsOnboarding: true };
      } else {
        throw new Error('No email provided in OAuth callback');
      }
      
    } catch (error) {
      console.error('AuthContext - OAuth callback error:', error);
      dispatch({ 
        type: AUTH_ACTIONS.AUTH_ERROR, 
        payload: { error: error.message || 'OAuth processing failed' } 
      });
      return { success: false, error: error.message };
    }
  };

  const completeOAuthProfile = async (profileData) => {
    dispatch({ type: AUTH_ACTIONS.OAUTH_PROFILE_COMPLETION_START });
    
    try {
      // Prepare profile data with email (IDENTICAL to current OAuthOnboarding logic)
      const dataWithEmail = { ...profileData };
      
      // Include email from AuthContext state or sessionStorage (SAME as current)
      const email = state.oauthData.email || sessionStorage.getItem('oauth_user_email');
      if (email) {
        dataWithEmail.email = email;
      }
      
      // Call the SAME API as current implementation
      const result = await authAPI.completeOAuthProfile(dataWithEmail);
      
      if (result.success) {
        // Clear session storage (SAME as current)
        sessionStorage.removeItem('oauth_user_email');
        
        // Update auth state (SAME as current)
        dispatch({
          type: AUTH_ACTIONS.LOGIN_SUCCESS,
          payload: { user: result.user },
        });
        
        return { success: true, user: result.user };
      } else {
        throw new Error(result.error || 'Failed to complete profile');
      }
      
    } catch (error) {
      console.error('AuthContext - Profile completion error:', error);
      dispatch({ 
        type: AUTH_ACTIONS.AUTH_ERROR, 
        payload: { error: error.message || 'Profile completion failed' } 
      });
      
      // Re-throw for component-level error handling (form validation, etc.)
      throw error;
    }
  };

  const getRequiredRoute = () => {
    // Determine where user should go based on current auth state
    switch(state.authState) {
      case ENHANCED_AUTH_STATES.OAUTH_PENDING:
      case ENHANCED_AUTH_STATES.OAUTH_PROFILE_INCOMPLETE:
        return '/auth/finish-onboarding';
      case ENHANCED_AUTH_STATES.UNAUTHENTICATED:
      case ENHANCED_AUTH_STATES.TOKEN_EXPIRED:
        return '/login';
      case ENHANCED_AUTH_STATES.AUTH_ERROR:
        return '/login?error=authentication_failed';
      case ENHANCED_AUTH_STATES.AUTHENTICATED:
        return null; // Stay on current route
      case ENHANCED_AUTH_STATES.INITIALIZING:
      case ENHANCED_AUTH_STATES.OAUTH_CALLBACK:
        return null; // Still processing
      default:
        return '/login'; // Fallback
    }
  };

  const checkCurrentUser = async () => {
    // Helper method to check current user authentication (like the old loader)
    try {
      const response = await authAPI.getCurrentUser();
      return response.success ? response : null;
    } catch (error) {
      return null;
    }
  };

  // Enhanced state helper methods
  const canAccessDashboard = () => {
    return state.authState === ENHANCED_AUTH_STATES.AUTHENTICATED;
  };

  const needsOnboarding = () => {
    return state.authState === ENHANCED_AUTH_STATES.OAUTH_PENDING || 
           state.authState === ENHANCED_AUTH_STATES.OAUTH_PROFILE_INCOMPLETE;
  };

  const canAccessProtectedRoutes = () => {
    return state.canAccessProtectedRoutes;
  };

  const isOAuthUser = () => {
    return state.oauthData.email !== null;
  };

  const isInitialized = () => {
    return state.authState !== ENHANCED_AUTH_STATES.INITIALIZING;
  };

  const hasInitializationError = () => {
    return state.authState === ENHANCED_AUTH_STATES.AUTH_ERROR;
  };
  
  // Context value
  const value = {
    // State
    ...state,
    
    // Auth status helpers (enhanced)
    isLoading: state.status === AUTH_STATES.LOADING || 
              state.authState === ENHANCED_AUTH_STATES.INITIALIZING ||
              state.authState === ENHANCED_AUTH_STATES.OAUTH_CALLBACK ||
              state.isLoading,
    isAuthenticated: state.isAuthenticated,
    
    // Enhanced state helpers
    canAccessDashboard,
    needsOnboarding,
    canAccessProtectedRoutes,
    isOAuthUser,
    isInitialized,
    hasInitializationError,
    
    // Actions (legacy)
    dispatch,
    AUTH_ACTIONS,
    login,
    logout,
    register,
    updateUser,
    clearError,
    
    // Enhanced OAuth actions (Phase 2 - full implementations)
    handleOAuthCallback,
    completeOAuthProfile,
    getRequiredRoute,
    checkCurrentUser,
  };
  
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};

export default AuthContext;
