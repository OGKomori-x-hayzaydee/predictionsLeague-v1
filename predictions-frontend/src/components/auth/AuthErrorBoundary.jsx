import React from 'react';
import PageError from '../ui/PageError';
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
      retryCount: 0,
    };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('AuthErrorBoundary caught an error:', error, errorInfo);

    this.setState({
      error,
      errorInfo,
    });

    if (window.analytics && window.analytics.track) {
      window.analytics.track('Auth Error Boundary Triggered', {
        error: error.message,
        stack: error.stack,
        componentStack: errorInfo.componentStack,
        retryCount: this.state.retryCount,
      });
    }
  }

  handleRetry = () => {
    const newRetryCount = this.state.retryCount + 1;

    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      retryCount: newRetryCount,
    });

    if (newRetryCount >= 3) {
      window.location.reload();
    }
  };

  handleGoHome = () => {
    sessionStorage.removeItem('oauth_user_email');
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      const attemptNote =
        this.state.retryCount > 0 ? ` (Attempt ${this.state.retryCount + 1})` : '';

      return (
        <div className="flex min-h-dvh flex-col items-center justify-center bg-surface-app px-4">
          <PageError
            title="Authentication error"
            body={`Something went wrong during authentication.${attemptNote}`}
            onRetry={this.handleRetry}
            onHome={this.handleGoHome}
          />

          {process.env.NODE_ENV === 'development' && this.state.error && (
            <details className="mt-6 max-w-md text-left">
              <summary className="mb-2 cursor-pointer font-outfit text-sm text-text-muted">
                Error Details (Development)
              </summary>
              <pre className="max-h-32 overflow-auto rounded border border-state-error/30 bg-state-error/10 p-3 text-xs text-state-error">
                {this.state.error.toString()}
                {this.state.errorInfo?.componentStack}
              </pre>
            </details>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}

export default AuthErrorBoundary;
