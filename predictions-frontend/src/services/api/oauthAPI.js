/**
 * OAuth API service for frontend OAuth2 integration
 * Works with Spring Security OAuth2 backend redirects
 */
import GoogleIcon from '../../components/icons/GoogleIcon.jsx';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

export const oauthAPI = {
  /**
   * OAuth provider configuration
   * These URLs should match the backend OAuth2 endpoints
   */
  providers: {
    google: {
      name: 'Google',
      loginUrl: `${API_BASE_URL}/oauth2/authorization/google`,
      icon: GoogleIcon, // Official Google icon component
    },
  },

  /**
   * Initiate OAuth login by redirecting to backend OAuth endpoint
   * @param {string} provider - OAuth provider name (google, github, facebook)
   * @param {string} redirectPath - Frontend path to redirect to after successful login
   */
  initiateLogin(provider, redirectPath = '/home/dashboard') {
    if (!this.providers[provider]) {
      throw new Error(`Unsupported OAuth provider: ${provider}`);
    }

    // Store intended redirect path in sessionStorage for post-login redirect
    if (redirectPath) {
      sessionStorage.setItem('oauth_redirect_path', redirectPath);
    }

    // Store current location for fallback
    sessionStorage.setItem('oauth_origin_path', window.location.pathname);

    // Redirect to backend OAuth2 authorization endpoint
    // Backend will handle OAuth flow and redirect back to frontend success URL
    const oauthUrl = `${this.providers[provider].loginUrl}?redirect_uri=${encodeURIComponent(window.location.origin + '/auth/oauth/callback')}`;
    
    console.log(`🔄 Initiating OAuth login with ${provider}:`, oauthUrl);
    window.location.href = oauthUrl;
  },

  /**
   * Handle OAuth callback - called when user returns from OAuth provider
   * The backend should have already set HTTP-only cookies at this point
   */
  async handleCallback() {
    try {
      console.log('🔄 Processing OAuth callback...');
      
      // Check if we have authentication cookies (backend should have set them)
      // We'll use the existing auth check endpoint to verify authentication
      const response = await fetch(`${API_BASE_URL}/auth/me`, {
        method: 'GET',
        credentials: 'include', // Include HTTP-only cookies
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const userData = await response.json();
        console.log('✅ OAuth authentication successful:', userData);
        
        // Get redirect path from storage
        const redirectPath = sessionStorage.getItem('oauth_redirect_path') || '/home/dashboard';
        const originPath = sessionStorage.getItem('oauth_origin_path') || '/';
        
        // Clean up storage
        sessionStorage.removeItem('oauth_redirect_path');
        sessionStorage.removeItem('oauth_origin_path');
        
        return {
          success: true,
          user: userData,
          redirectPath,
        };
      } else {
        throw new Error('OAuth authentication failed');
      }
    } catch (error) {
      console.error('❌ OAuth callback error:', error);
      
      // Clean up storage on error
      sessionStorage.removeItem('oauth_redirect_path');
      sessionStorage.removeItem('oauth_origin_path');
      
      return {
        success: false,
        error: error.message,
        redirectPath: '/login',
      };
    }
  },

  /**
   * Get list of available OAuth providers for UI rendering
   */
  getAvailableProviders() {
    return Object.entries(this.providers).map(([key, config]) => ({
      id: key,
      name: config.name,
      icon: config.icon,
    }));
  },

  /**
   * Check if current URL is an OAuth callback
   */
  isOAuthCallback() {
    return window.location.pathname === '/auth/oauth/callback';
  },

  /**
   * Extract OAuth error from URL parameters (if any)
   */
  getOAuthError() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('error') || urlParams.get('error_description');
  },
};

export default oauthAPI;
