import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOAuthCallback } from '../hooks/useOAuthCallback';
import { useAuth } from '../context/AuthContext';

export default function OAuthCallback() {
  const { isProcessing, error } = useOAuthCallback();
  const { authState, getRequiredRoute } = useAuth();
  const navigate = useNavigate();

  // Handle navigation based on AuthContext state
  useEffect(() => {
    if (!isProcessing && !error) {
      const requiredRoute = getRequiredRoute();
      
      if (requiredRoute) {
        console.log('OAuth Callback - AuthContext determined route:', requiredRoute);
        setTimeout(() => navigate(requiredRoute, { replace: true }), 100);
      } else {
        // No specific route required, go to dashboard
        console.log('OAuth Callback - No specific route required, going to dashboard');
        setTimeout(() => navigate('/home/dashboard', { replace: true }), 100);
      }
    }
  }, [isProcessing, error, authState, getRequiredRoute, navigate]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-primary-500">
        <div className="text-center">
          <div className="text-red-400 mb-4">{error}</div>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-400 mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-primary-500">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-300 mx-auto mb-4"></div>
        <div className="text-white">
          {isProcessing ? 'Processing OAuth login...' : 'Redirecting...'}
        </div>
      </div>
    </div>
  );
}