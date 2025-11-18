class OAuthAPI {
  constructor() {
    this.oauthBaseUrl = import.meta.env.VITE_OAUTH_BASE_URL; // Your proxy URL
    this.frontendBaseUrl = window.location.origin;
  }

  /**
   * Initiate OAuth login through your proxy
   */
  initiateLogin(provider = 'google', redirectPath = '/home/dashboard') {
    // Preserve existing flow type if already set (e.g., from signup page)
    const existingFlowType = sessionStorage.getItem('oauth_flow_type');
    const flowType = existingFlowType || 'login';
    
    // Store intended destination and OAuth details
    sessionStorage.setItem('oauth_redirect_path', redirectPath);
    sessionStorage.setItem('oauth_flow_type', flowType);
    sessionStorage.setItem('oauth_provider', provider);
    sessionStorage.setItem('oauth_timestamp', Date.now().toString());
    
    // Build OAuth proxy URL - same endpoint for both login and signup
    const oauthUrl = `${this.oauthBaseUrl}/oauth2/start?rd=/oauth2/login`;
    
    // Redirect to your OAuth2 proxy
    window.location.href = oauthUrl;
  }

  /**
   * Initiate OAuth signup specifically - sets flow type to signup
   */
  initiateSignup(provider = 'google') {
    // Explicitly set flow type to signup
    sessionStorage.setItem('oauth_flow_type', 'signup');
    
    // Use the login method but with signup context
    this.initiateLogin(provider, '/auth/oauth/complete');
  }

  /**
   * Handle OAuth callback - user returns from OAuth proxy
   */
  async handleCallback() {
    const redirectPath = sessionStorage.getItem('oauth_redirect_path') || '/home/dashboard';
    const flowType = sessionStorage.getItem('oauth_flow_type') || 'login';
    const provider = sessionStorage.getItem('oauth_provider') || 'google';
    const timestamp = sessionStorage.getItem('oauth_timestamp');
    
    // Security check - callback should happen within reasonable time
    if (timestamp && (Date.now() - parseInt(timestamp)) > 600000) { // 10 minutes
      throw new Error('OAuth session expired - please try again');
    }
    
    // Clean up session storage
    sessionStorage.removeItem('oauth_redirect_path');
    sessionStorage.removeItem('oauth_flow_type');
    sessionStorage.removeItem('oauth_provider');
    sessionStorage.removeItem('oauth_timestamp');
    
    // Return success info
    return {
      success: true,
      redirectPath,
      flowType,
      provider
    };
  }

  /**
   * Check if user returned from OAuth provider
   */
  isOAuthReturn() {
    const hasOAuthState = sessionStorage.getItem('oauth_flow_type') !== null;
    const fromGoogle = document.referrer.includes('accounts.google.com');
    const fromProxy = document.referrer.includes(this.oauthBaseUrl);
    
    return hasOAuthState && (fromGoogle || fromProxy);
  }
}

const oauthAPI = new OAuthAPI();
export default oauthAPI;