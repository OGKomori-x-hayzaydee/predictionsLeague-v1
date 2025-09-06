/**
 * OAuth Error Boundary Component
 * Catches OAuth-related errors and provides user-friendly feedback
 */
import React from 'react';
import { motion } from 'framer-motion';
import { ExclamationTriangleIcon, UpdateIcon } from '@radix-ui/react-icons';
import oauthStateManager from '../../services/oauth/OAuthStateManager';

class OAuthErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      isRetrying: false,
    };
  }

  static getDerivedStateFromError(error) {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error, errorInfo) {
    console.error('OAuth Error Boundary caught an error:', error, errorInfo);
    
    // Clean up OAuth state on critical error
    oauthStateManager.cancel('Error boundary triggered');
    
    this.setState({
      error,
      errorInfo,
    });
  }

  handleRetry = () => {
    this.setState({ 
      isRetrying: true,
      hasError: false,
      error: null,
      errorInfo: null,
    });
    
    // Clear OAuth state and redirect to login
    oauthStateManager.clearState();
    
    setTimeout(() => {
      window.location.href = '/login';
    }, 500);
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-primary-500 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-primary-500/60 backdrop-blur-md rounded-xl p-8 border border-red-400/30 text-center max-w-lg w-full"
          >
            <div className="flex justify-center mb-4">
              <ExclamationTriangleIcon className="w-16 h-16 text-red-400" />
            </div>
            
            <h2 className="text-xl text-red-200 font-dmSerif mb-2">
              Authentication Error
            </h2>
            
            <p className="text-white/70 font-outfit mb-6">
              Something went wrong during the login process. This usually happens when:
            </p>
            
            <div className="text-left text-sm text-white/60 mb-6 space-y-2">
              <div className="flex items-start space-x-2">
                <span className="text-red-400">•</span>
                <span>The authentication session expired</span>
              </div>
              <div className="flex items-start space-x-2">
                <span className="text-red-400">•</span>
                <span>Network connection was interrupted</span>
              </div>
              <div className="flex items-start space-x-2">
                <span className="text-red-400">•</span>
                <span>Browser cookies are disabled</span>
              </div>
              <div className="flex items-start space-x-2">
                <span className="text-red-400">•</span>
                <span>Third-party login was cancelled</span>
              </div>
            </div>

            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mb-6 text-left">
                <summary className="text-red-300 cursor-pointer mb-2">
                  Technical Details (Development)
                </summary>
                <div className="bg-black/20 p-3 rounded-lg text-xs text-white/80 font-mono overflow-auto max-h-32">
                  <div className="mb-2">
                    <strong>Error:</strong> {this.state.error.toString()}
                  </div>
                  {this.state.errorInfo && (
                    <div>
                      <strong>Component Stack:</strong>
                      <pre className="whitespace-pre-wrap">
                        {this.state.errorInfo.componentStack}
                      </pre>
                    </div>
                  )}
                </div>
              </details>
            )}

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={this.handleRetry}
              disabled={this.state.isRetrying}
              className="w-full bg-red-600 hover:bg-red-700 disabled:bg-red-800 disabled:opacity-50 text-white font-bold py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2"
            >
              {this.state.isRetrying ? (
                <>
                  <UpdateIcon className="w-5 h-5 animate-spin" />
                  <span>Redirecting...</span>
                </>
              ) : (
                <>
                  <UpdateIcon className="w-5 h-5" />
                  <span>Try Again</span>
                </>
              )}
            </motion.button>
            
            <div className="mt-4 text-xs text-white/50">
              You'll be redirected to the login page
            </div>
          </motion.div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default OAuthErrorBoundary;