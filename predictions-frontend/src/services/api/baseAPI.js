import axios from 'axios';
import { showToast } from '../notificationService.js';

// Create base axios instance
const baseAPI = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: parseInt(import.meta.env.VITE_API_TIMEOUT) || 10000,
  withCredentials: true, // Enable HTTP-only cookies
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Token management - Updated for HTTP-only cookies
let authToken = null; // Keep for any client-side token needs
let refreshToken = null; // Keep for compatibility

// Token storage utilities - Modified for HTTP-only cookie approach
export const setTokens = (accessToken, refreshTokenValue) => {
  // With HTTP-only cookies, tokens are managed by the browser automatically
  // We may still store some client-side data for UI purposes (like user info)
  authToken = accessToken;
  refreshToken = refreshTokenValue;
  
  // Store only non-sensitive data in localStorage for UI purposes
  if (accessToken) {
    // Don't store actual tokens - they're in HTTP-only cookies
    localStorage.setItem('isAuthenticated', 'true');
  } else {
    localStorage.removeItem('isAuthenticated');
  }
};

export const getTokens = () => {
  // With HTTP-only cookies, we can't access tokens directly
  // Return auth status instead
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  return { 
    authToken: isAuthenticated ? 'http-only' : null, 
    refreshToken: isAuthenticated ? 'http-only' : null,
    isAuthenticated 
  };
};

export const clearTokens = () => {
  authToken = null;
  refreshToken = null;
  localStorage.removeItem('isAuthenticated');
  // Note: HTTP-only cookies will be cleared by logout endpoint
};

// Request interceptor - Updated for HTTP-only cookies
baseAPI.interceptors.request.use(
  (config) => {
    // With HTTP-only cookies, authentication is handled automatically
    // No need to manually add Authorization headers
    
    // Add request ID for debugging
    config.metadata = { startTime: new Date() };
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle responses and errors
baseAPI.interceptors.response.use(
  (response) => {
    // Log API call duration in development
    if (import.meta.env.DEV && response.config.metadata) {
      const duration = new Date() - response.config.metadata.startTime;
      console.log(`API Call: ${response.config.method?.toUpperCase()} ${response.config.url} - ${duration}ms`);
    }
    
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    // Handle network errors
    if (!error.response) {
      showToast('Network error. Please check your connection.', 'error');
      return Promise.reject(error);
    }
    
    const { status, data } = error.response;
    
    // Handle different error status codes
    switch (status) {
      case 401:
        // Unauthorized - try to refresh token using HTTP-only cookies
        if (!originalRequest._retry && originalRequest.url !== '/auth/refresh') {
          originalRequest._retry = true;
          
          try {
            // With HTTP-only cookies, we call refresh without passing tokens
            // The browser will automatically send the refresh cookie
            const response = await baseAPI.post('/auth/refresh');
            
            if (response.status === 200) {
              // Refresh successful, retry the original request
              return baseAPI(originalRequest);
            }
          } catch (refreshError) {
            // Refresh failed, clear auth state and redirect to login
            clearTokens();
            window.location.href = '/login';
            return Promise.reject(error);
          }
        }
        
        // If retry failed or this is already a retry, redirect to login
        clearTokens();
        window.location.href = '/login';
        break;
        
      case 403:
        showToast('Access denied. You don\'t have permission to perform this action.', 'error');
        break;
        
      case 404:
        showToast('Resource not found.', 'error');
        break;
        
      case 422:
        // Validation errors - let the component handle these
        break;
        
      case 500:
        showToast('Server error. Please try again later.', 'error');
        break;
        
      default:
        showToast(data?.message || 'An unexpected error occurred.', 'error');
    }
    
    return Promise.reject(error);
  }
);

// API call wrapper with consistent error handling
export const apiCall = async (config) => {
  try {
    const response = await baseAPI(config);
    return {
      success: true,
      data: response.data,
      status: response.status,
    };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data || error.message,
      status: error.response?.status,
    };
  }
};

export default baseAPI;
