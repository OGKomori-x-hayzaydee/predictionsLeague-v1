import React from 'react';
import { motion } from 'framer-motion';
import oauthAPI from '../../services/api/oauthAPI';

/**
 * OAuth Login Button Component
 * Renders a button for OAuth provider login
 */
const OAuthButton = ({ provider, onClick, disabled = false }) => {
  const handleClick = () => {
    if (!disabled && onClick) {
      onClick(provider.id);
    }
  };

  // Handle both component and string icons
  const IconComponent = provider.icon;
  const isComponent = typeof IconComponent === 'function';

  return (
    <motion.button
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      onClick={handleClick}
      disabled={disabled}
      className={`
        w-full flex items-center justify-center gap-3 px-4 py-3 
        rounded-lg border transition-all duration-200 font-outfit
        ${disabled 
          ? 'opacity-50 cursor-not-allowed bg-gray-800 border-gray-700' 
          : 'bg-slate-800/50 hover:bg-slate-700/60 border-slate-600/50 hover:border-teal-400/50 hover:shadow-lg backdrop-blur-sm'
        }
      `}
    >
      <div className="flex items-center justify-center w-5 h-5">
        {isComponent ? (
          <IconComponent size={20} />
        ) : (
          <span className="text-xl">{provider.icon}</span>
        )}
      </div>
      <span className="text-teal-100 font-medium">
        Continue with {provider.name}
      </span>
    </motion.button>
  );
};

/**
 * OAuth Login Section Component
 * Renders all available OAuth providers with divider
 */
const OAuthLoginSection = ({ onOAuthLogin, disabled = false, className = '' }) => {
  const providers = oauthAPI.getAvailableProviders();

  const handleOAuthLogin = (providerId) => {
    if (disabled) return;
    
    try {
      console.log(`🔄 Starting OAuth login with ${providerId}`);
      
      if (onOAuthLogin) {
        onOAuthLogin(providerId);
      } else {
        // Default behavior - redirect to OAuth provider
        oauthAPI.initiateLogin(providerId);
      }
    } catch (error) {
      console.error('❌ OAuth login error:', error);
      // You might want to show a toast notification here
    }
  };

  if (providers.length === 0) {
    return null;
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* OAuth Provider Buttons */}
      <div className="space-y-3">
        {providers.map((provider) => (
          <OAuthButton
            key={provider.id}
            provider={provider}
            onClick={handleOAuthLogin}
            disabled={disabled}
          />
        ))}
      </div>

      {/* Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-white/20" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="bg-primary-500 px-2 text-white/60 font-outfit">
            or continue with email
          </span>
        </div>
      </div>
    </div>
  );
};

/**
 * OAuth Callback Processing Component
 * Shows loading state while processing OAuth callback
 */
export const OAuthCallbackHandler = ({ onSuccess, onError }) => {
  React.useEffect(() => {
    const processCallback = async () => {
      try {
        console.log('🔄 Processing OAuth callback...');
        const result = await oauthAPI.handleCallback();
        
        if (result.success) {
          console.log('✅ OAuth callback successful:', result);
          if (onSuccess) {
            onSuccess(result);
          }
        } else {
          console.error('❌ OAuth callback failed:', result);
          if (onError) {
            onError(result);
          }
        }
      } catch (error) {
        console.error('❌ OAuth callback processing error:', error);
        if (onError) {
          onError({ success: false, error: error.message });
        }
      }
    };

    // Check if this is actually an OAuth callback
    if (oauthAPI.isOAuthCallback()) {
      processCallback();
    } else {
      // Not an OAuth callback, redirect to login
      window.location.href = '/login';
    }
  }, [onSuccess, onError]);

  return (
    <div className="min-h-screen bg-primary-500 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-primary-500/60 backdrop-blur-md rounded-xl p-8 border border-primary-400/20 text-center"
      >
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-400 mx-auto mb-4"></div>
        <h2 className="text-xl text-teal-100 font-dmSerif mb-2">
          Completing your login...
        </h2>
        <p className="text-white/70 font-outfit">
          Please wait while we process your authentication
        </p>
      </motion.div>
    </div>
  );
};

export { OAuthButton, OAuthLoginSection };
export default OAuthLoginSection;
