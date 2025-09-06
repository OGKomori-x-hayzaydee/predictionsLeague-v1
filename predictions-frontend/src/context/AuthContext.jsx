import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { getTokens, setTokens, clearTokens } from '../services/api/baseAPI.js';
import baseAPI from '../services/api/baseAPI.js';
import authAPI from '../services/api/authAPI.js';
import authService from '../services/auth/AuthService.js';

// Auth states
const AUTH_STATES = {
  LOADING: 'LOADING',
  AUTHENTICATED: 'AUTHENTICATED',
  UNAUTHENTICATED: 'UNAUTHENTICATED',
};

// Auth actions
const AUTH_ACTIONS = {
  SET_LOADING: 'SET_LOADING',
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  LOGOUT: 'LOGOUT',
  UPDATE_USER: 'UPDATE_USER',
  SET_ERROR: 'SET_ERROR',
  CLEAR_ERROR: 'CLEAR_ERROR',
};

// Initial state
const initialState = {
  status: AUTH_STATES.LOADING,
  user: null,
  error: null,
  isAuthenticated: false,
};

// Auth reducer
const authReducer = (state, action) => {
  switch (action.type) {
    case AUTH_ACTIONS.SET_LOADING:
      return {
        ...state,
        status: AUTH_STATES.LOADING,
        error: null,
      };
      
    case AUTH_ACTIONS.LOGIN_SUCCESS:
      return {
        ...state,
        status: AUTH_STATES.AUTHENTICATED,
        user: action.payload.user,
        isAuthenticated: true,
        error: null,
      };
      
    case AUTH_ACTIONS.LOGOUT:
      return {
        ...state,
        status: AUTH_STATES.UNAUTHENTICATED,
        user: null,
        isAuthenticated: false,
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
        error: action.payload,
        isAuthenticated: false,
      };
      
    case AUTH_ACTIONS.CLEAR_ERROR:
      return {
        ...state,
        error: null,
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
  
  // Check authentication status on app load
  useEffect(() => {
    const checkAuthStatus = async () => {
      // Check if we have auth state in localStorage (from HTTP-only cookies)
      const { isAuthenticated } = getTokens();
      
      if (isAuthenticated) {
        try {
          // Use centralized auth service to check authentication
          const authResult = await authService.checkAuth({ 
            source: 'auth-context-init' 
          });
          
          if (authResult.isAuthenticated && authResult.user) {
            dispatch({
              type: AUTH_ACTIONS.LOGIN_SUCCESS,
              payload: { user: authResult.user },
            });
          } else {
            // Clear invalid auth state
            dispatch({ type: AUTH_ACTIONS.LOGOUT });
          }
        } catch (error) {
          // Session invalid, clear auth state
          console.log('Auth check failed:', error);
          dispatch({ type: AUTH_ACTIONS.LOGOUT });
        }
      } else {
        dispatch({ type: AUTH_ACTIONS.LOGOUT });
      }
    };
    
    checkAuthStatus();
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
    console.log("🔄 AuthContext.logout: Starting logout...");
    try {
      console.log("📞 AuthContext.logout: Calling authAPI.logout...");
      await authAPI.logout();
      console.log("✅ AuthContext.logout: API call successful, dispatching logout action...");
      dispatch({ type: AUTH_ACTIONS.LOGOUT });
      console.log("🎯 AuthContext.logout: Logout action dispatched");
      return { success: true };
    } catch (error) {
      console.error("❌ AuthContext.logout: Error occurred:", error);
      // Even if API call fails, clear local state
      dispatch({ type: AUTH_ACTIONS.LOGOUT });
      console.log("🎯 AuthContext.logout: Logout action dispatched despite error");
      return { success: false, error: error.message };
    }
  };
  
  // Register function
  const register = async (userData) => {
    dispatch({ type: AUTH_ACTIONS.SET_LOADING });
    
    try {
      const response = await authAPI.register(userData);
      
      if (response.success) {
        dispatch({
          type: AUTH_ACTIONS.LOGIN_SUCCESS,
          payload: { user: response.user },
        });
        
        return { success: true };
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
  
  // Context value
  const value = {
    // State
    ...state,
    
    // Auth status helpers
    isLoading: state.status === AUTH_STATES.LOADING,
    isAuthenticated: state.isAuthenticated,
    
    // Actions
    login,
    logout,
    register,
    updateUser,
    clearError,
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
