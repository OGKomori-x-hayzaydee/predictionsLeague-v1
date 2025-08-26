import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { OAuthCallbackHandler } from '../components/auth/OAuthLogin';

/**
 * OAuth Callback Page
 * Handles the OAuth redirect callback from backend
 */
export default function OAuthCallback() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleOAuthSuccess = async (result) => {
    try {
      console.log('🎉 OAuth login successful:', result);
      
      // Update auth context with user data
      // Since backend already set HTTP-only cookies, we just need to update the user state
      await login({ 
        skipApiCall: true, // Don't make another login API call
        userData: result.user 
      });
      
      // Check if user needs to complete onboarding (username + team selection)
      if (result.user.isNewUser || !result.user.username || !result.user.favouriteTeam) {
        console.log('🔄 New user or incomplete profile detected, redirecting to profile completion');
        navigate('/onboarding/select-team', { replace: true });
        return;
      }
      
      // Existing user with complete profile - redirect to intended destination
      const redirectPath = sessionStorage.getItem('oauth_redirect_path') || '/home/dashboard';
      console.log(`🔄 Existing user, redirecting to: ${redirectPath}`);
      
      // Clean up session storage
      sessionStorage.removeItem('oauth_redirect_path');
      sessionStorage.removeItem('oauth_origin_path');
      
      navigate(redirectPath, { replace: true });
      
    } catch (error) {
      console.error('❌ Error processing OAuth success:', error);
      navigate('/login?error=oauth_processing_failed', { replace: true });
    }
  };

  const handleOAuthError = (result) => {
    console.error('❌ OAuth authentication failed:', result);
    
    // Redirect to login with error message
    const errorMessage = result.error || 'OAuth authentication failed';
    navigate(`/login?error=${encodeURIComponent(errorMessage)}`, { replace: true });
  };

  return (
    <OAuthCallbackHandler 
      onSuccess={handleOAuthSuccess}
      onError={handleOAuthError}
    />
  );
}
