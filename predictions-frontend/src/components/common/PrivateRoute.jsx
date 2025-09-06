import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import LoadingState from './LoadingState.jsx';

/**
 * PrivateRoute component - Protects routes that require authentication
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - The component to render if authenticated
 * @param {string} props.redirectTo - Where to redirect if not authenticated (default: '/login')
 * @param {Array<string>} props.requiredRoles - Array of roles required to access this route
 * @param {React.ReactNode} props.fallback - Custom loading component
 */
const PrivateRoute = ({ 
  children, 
  redirectTo = '/login', 
  requiredRoles = [], 
  fallback = null 
}) => {
  const { isAuthenticated, isLoading, user } = useAuth();
  const location = useLocation();
  
  // Add debugging for OAuth callback scenarios
  React.useEffect(() => {
    console.log('🔒 PrivateRoute check:', {
      path: location.pathname,
      isAuthenticated,
      isLoading,
      hasUser: !!user,
      referrer: document.referrer
    });
    
    // Special logging for potential OAuth redirects
    if (document.referrer && document.referrer.includes('google')) {
      console.log('🚨 DETECTED: Potential OAuth redirect hit PrivateRoute!');
      console.log('🚨 This suggests backend redirected to dashboard instead of callback');
      console.log('🚨 Backend should redirect to: /auth/oauth/callback');
      console.log('🚨 But instead redirected to:', location.pathname);
    }
  }, [location.pathname, isAuthenticated, isLoading, user]);
  
  // Show loading state while checking authentication
  if (isLoading) {
    return fallback || <LoadingState message="Checking authentication..." />;
  }
  
  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    console.log('🔒 PrivateRoute: Not authenticated, redirecting to login');
    // Save the attempted location for redirecting after login
    return (
      <Navigate 
        to={redirectTo} 
        state={{ from: location }} 
        replace 
      />
    );
  }
  
  // Check role-based access if required roles are specified
  if (requiredRoles.length > 0 && user) {
    const userRoles = user.roles || [];
    const hasRequiredRole = requiredRoles.some(role => 
      userRoles.includes(role)
    );
    
    if (!hasRequiredRole) {
      // Redirect to unauthorized page or dashboard
      return <Navigate to="/dashboard" replace />;
    }
  }
  
  // User is authenticated and authorized, render the protected component
  return children;
};

/**
 * PublicRoute component - For routes that should only be accessible when NOT authenticated
 * (e.g., login, signup pages)
 */
export const PublicRoute = ({ 
  children, 
  redirectTo = '/dashboard', 
  fallback = null 
}) => {
  const { isAuthenticated, isLoading } = useAuth();
  
  // Show loading state while checking authentication
  if (isLoading) {
    return fallback || <LoadingState message="Loading..." />;
  }
  
  // Redirect to dashboard if already authenticated
  if (isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }
  
  // User is not authenticated, show the public route
  return children;
};

/**
 * ConditionalRoute component - Renders different content based on auth status
 */
export const ConditionalRoute = ({ 
  authenticatedComponent, 
  unauthenticatedComponent, 
  fallback = null 
}) => {
  const { isAuthenticated, isLoading } = useAuth();
  
  // Show loading state while checking authentication
  if (isLoading) {
    return fallback || <LoadingState message="Loading..." />;
  }
  
  return isAuthenticated ? authenticatedComponent : unauthenticatedComponent;
};

export default PrivateRoute;
