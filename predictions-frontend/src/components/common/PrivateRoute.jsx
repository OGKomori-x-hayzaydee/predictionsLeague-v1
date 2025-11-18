import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import LoadingState from './LoadingState.jsx';

/**
 * PrivateRoute component - Enhanced with OAuth support
 * Uses AuthContext for smart routing decisions
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - The component to render if authenticated
 * @param {string} props.redirectTo - Where to redirect if not authenticated (default: determined by AuthContext)
 * @param {Array<string>} props.requiredRoles - Array of roles required to access this route
 * @param {React.ReactNode} props.fallback - Custom loading component
 */
const PrivateRoute = ({ 
  children, 
  redirectTo = null, 
  requiredRoles = [], 
  fallback = null 
}) => {
  const { 
    canAccessDashboard, 
    getRequiredRoute, 
    authState, 
    isLoading: contextIsLoading,
    isAuthenticated, // Legacy property for backward compatibility
    user 
  } = useAuth();
  const location = useLocation();
  
  // Show loading state while AuthContext is processing
  if (contextIsLoading) {
    return fallback || <LoadingState message="Checking authentication..." />;
  }
  
  // Use AuthContext to determine if user can access protected routes
  if (!canAccessDashboard()) {
    // Get smart routing decision from AuthContext
    const requiredRoute = getRequiredRoute();
    const targetRoute = redirectTo || requiredRoute || '/login';
    
    return (
      <Navigate 
        to={targetRoute} 
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
 * PublicRoute component - Enhanced with OAuth support
 * For routes that should only be accessible when NOT authenticated
 */
export const PublicRoute = ({ 
  children, 
  redirectTo = '/home/dashboard', 
  fallback = null 
}) => {
  const { 
    canAccessDashboard, 
    authState, 
    isLoading: contextIsLoading,
    isAuthenticated // Legacy property for backward compatibility
  } = useAuth();
  
  // Show loading state while AuthContext is processing
  if (contextIsLoading) {
    return fallback || <LoadingState message="Loading..." />;
  }
  
  // Redirect to dashboard if user can access protected routes
  if (canAccessDashboard()) {
    console.log('🔓 PublicRoute - User authenticated, redirecting to:', redirectTo);
    return <Navigate to={redirectTo} replace />;
  }
  
  // User is not fully authenticated, show the public route
  return children;
};

/**
 * ConditionalRoute component - Enhanced with OAuth support
 * Renders different content based on auth status
 */
export const ConditionalRoute = ({ 
  authenticatedComponent, 
  unauthenticatedComponent, 
  fallback = null 
}) => {
  const { 
    canAccessDashboard, 
    isLoading: contextIsLoading,
    isAuthenticated // Legacy property for backward compatibility
  } = useAuth();
  
  // Show loading state while AuthContext is processing
  if (contextIsLoading) {
    return fallback || <LoadingState message="Loading..." />;
  }
  
  return canAccessDashboard() ? authenticatedComponent : unauthenticatedComponent;
};

export default PrivateRoute;
