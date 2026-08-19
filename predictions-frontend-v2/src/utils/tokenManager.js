/**
 * Token management utility
 * Handles secure storage and retrieval of authentication tokens
 */

const TOKEN_KEYS = {
  ACCESS_TOKEN: 'authToken',
  REFRESH_TOKEN: 'refreshToken',
  TOKEN_EXPIRY: 'tokenExpiry',
};

/**
 * Check if we're in a browser environment
 */
const isBrowser = typeof window !== 'undefined';

/**
 * Set authentication tokens in localStorage
 */
export const setTokens = (accessToken, refreshToken, expiresIn = null) => {
  if (!isBrowser) return;
  
  try {
    if (accessToken) {
      localStorage.setItem(TOKEN_KEYS.ACCESS_TOKEN, accessToken);
      
      // Calculate expiry time if provided
      if (expiresIn) {
        const expiryTime = Date.now() + (expiresIn * 1000);
        localStorage.setItem(TOKEN_KEYS.TOKEN_EXPIRY, expiryTime.toString());
      }
    }
    
    if (refreshToken) {
      localStorage.setItem(TOKEN_KEYS.REFRESH_TOKEN, refreshToken);
    }
  } catch (error) {
    console.error('Error storing tokens:', error);
  }
};

/**
 * Get authentication tokens from localStorage
 */
export const getTokens = () => {
  if (!isBrowser) return { accessToken: null, refreshToken: null };
  
  try {
    const accessToken = localStorage.getItem(TOKEN_KEYS.ACCESS_TOKEN);
    const refreshToken = localStorage.getItem(TOKEN_KEYS.REFRESH_TOKEN);
    
    return { accessToken, refreshToken };
  } catch (error) {
    console.error('Error retrieving tokens:', error);
    return { accessToken: null, refreshToken: null };
  }
};

/**
 * Get access token only
 */
export const getAccessToken = () => {
  const { accessToken } = getTokens();
  return accessToken;
};

/**
 * Get refresh token only
 */
export const getRefreshToken = () => {
  const { refreshToken } = getTokens();
  return refreshToken;
};

/**
 * Clear all authentication tokens
 */
export const clearTokens = () => {
  if (!isBrowser) return;
  
  try {
    localStorage.removeItem(TOKEN_KEYS.ACCESS_TOKEN);
    localStorage.removeItem(TOKEN_KEYS.REFRESH_TOKEN);
    localStorage.removeItem(TOKEN_KEYS.TOKEN_EXPIRY);
  } catch (error) {
    console.error('Error clearing tokens:', error);
  }
};

/**
 * Check if access token is expired
 */
export const isTokenExpired = () => {
  if (!isBrowser) return true;
  
  try {
    const expiryTime = localStorage.getItem(TOKEN_KEYS.TOKEN_EXPIRY);
    if (!expiryTime) return false; // No expiry set, assume valid
    
    return Date.now() > parseInt(expiryTime);
  } catch (error) {
    console.error('Error checking token expiry:', error);
    return true; // Assume expired on error
  }
};

/**
 * Check if we have a valid access token
 */
export const hasValidToken = () => {
  const { accessToken } = getTokens();
  return accessToken && !isTokenExpired();
};

/**
 * Get time until token expires (in milliseconds)
 */
export const getTimeUntilExpiry = () => {
  if (!isBrowser) return 0;
  
  try {
    const expiryTime = localStorage.getItem(TOKEN_KEYS.TOKEN_EXPIRY);
    if (!expiryTime) return Infinity; // No expiry set
    
    return Math.max(0, parseInt(expiryTime) - Date.now());
  } catch (error) {
    console.error('Error calculating time until expiry:', error);
    return 0;
  }
};

/**
 * Decode JWT token payload (without verification)
 * Note: This is for client-side info only, never trust this for security
 */
export const decodeTokenPayload = (token) => {
  if (!token) return null;
  
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    
    const payload = parts[1];
    const decoded = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
    return JSON.parse(decoded);
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
};

/**
 * Get user info from access token
 */
export const getUserFromToken = () => {
  const { accessToken } = getTokens();
  if (!accessToken) return null;
  
  const payload = decodeTokenPayload(accessToken);
  return payload ? {
    id: payload.sub || payload.userId,
    username: payload.username,
    email: payload.email,
    roles: payload.roles || [],
    exp: payload.exp,
    iat: payload.iat,
  } : null;
};

export default {
  setTokens,
  getTokens,
  getAccessToken,
  getRefreshToken,
  clearTokens,
  isTokenExpired,
  hasValidToken,
  getTimeUntilExpiry,
  decodeTokenPayload,
  getUserFromToken,
};
