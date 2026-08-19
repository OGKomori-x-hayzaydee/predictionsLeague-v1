import React from 'react';
import LoadingState from '../common/LoadingState';

/**
 * Enhanced Error Boundary for OAuth and Auth Components
 * Provides graceful error handling with recovery options
 */
class AuthErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null, 
      errorInfo: null,
      retryCount: 0 
    };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log the error for debugging
    console.error('AuthErrorBoundary caught an error:', error, errorInfo);
    
    this.setState({
      error,
      errorInfo,
    });

    // Report to error tracking service if available
    if (window.analytics && window.analytics.track) {
      window.analytics.track('Auth Error Boundary Triggered', {
        error: error.message,
        stack: error.stack,
        componentStack: errorInfo.componentStack,
        retryCount: this.state.retryCount
      });
    }
  }

  handleRetry = () => {
    const newRetryCount = this.state.retryCount + 1;
    
    // Clear error state to retry
    this.setState({ 
      hasError: false, 
      error: null, 
      errorInfo: null,
      retryCount: newRetryCount
    });

    // If retry count is high, reload the page
    if (newRetryCount >= 3) {
      console.log('AuthErrorBoundary - Multiple retries failed, reloading page');
      window.location.reload();
    }
  };

  handleGoHome = () => {
    // Clear any OAuth state and redirect to home
    sessionStorage.removeItem('oauth_user_email');
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      // Render fallback UI
      return (
        <div className="min-h-screen bg-primary-500 flex items-center justify-center">
          <div className="max-w-md mx-auto text-center p-6">
            <div className="text-red-400 mb-4">
              <svg className="w-16 h-16 mx-auto mb-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            
            <h2 className="text-xl font-semibold text-white mb-2">
              Authentication Error
            </h2>
            
            <p className="text-white/70 mb-6">
              Something went wrong during authentication. 
              {this.state.retryCount > 0 && ` (Attempt ${this.state.retryCount + 1})`}
            </p>

            <div className="space-y-3">
              <button
                onClick={this.handleRetry}
                className="w-full px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
                disabled={this.state.retryCount >= 2}
              >
                {this.state.retryCount >= 2 ? 'Reloading...' : 'Try Again'}
              </button>
              
              <button
                onClick={this.handleGoHome}
                className="w-full px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                Go to Home
              </button>
            </div>

            {/* Show error details in development */}
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mt-6 text-left">
                <summary className="text-white/50 cursor-pointer mb-2">
                  Error Details (Development)
                </summary>
                <pre className="text-xs text-red-300 bg-red-900/20 p-3 rounded overflow-auto max-h-32">
                  {this.state.error.toString()}
                  {this.state.errorInfo.componentStack}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default AuthErrorBoundary;
