/**
 * Enhanced Authentication States
 * Supports both regular auth and OAuth transition states
 */

export const AUTH_STATES = {
  // Initial/Loading states
  INITIALIZING: 'initializing',           // App startup, checking existing auth
  
  // Unauthenticated states  
  UNAUTHENTICATED: 'unauthenticated',     // No auth at all
  
  // OAuth transition states
  OAUTH_CALLBACK: 'oauth_callback',       // Just returned from OAuth provider
  OAUTH_PENDING: 'oauth_pending',         // Has OAuth data but no JWT
  OAUTH_PROFILE_INCOMPLETE: 'oauth_profile_incomplete', // Needs onboarding
  
  // Authenticated states
  AUTHENTICATED: 'authenticated',         // Has valid JWT + complete profile
  TOKEN_EXPIRED: 'token_expired',         // JWT expired, needs refresh
  
  // Error states
  AUTH_ERROR: 'auth_error'                // Something went wrong
};

// Helper functions for state checking
export const isAuthenticatedState = (state) => state === AUTH_STATES.AUTHENTICATED;
export const isOAuthPendingState = (state) => state === AUTH_STATES.OAUTH_PENDING || state === AUTH_STATES.OAUTH_PROFILE_INCOMPLETE;
export const isUnauthenticatedState = (state) => state === AUTH_STATES.UNAUTHENTICATED || state === AUTH_STATES.TOKEN_EXPIRED;
export const isLoadingState = (state) => state === AUTH_STATES.INITIALIZING || state === AUTH_STATES.OAUTH_CALLBACK;
export const isErrorState = (state) => state === AUTH_STATES.AUTH_ERROR;
