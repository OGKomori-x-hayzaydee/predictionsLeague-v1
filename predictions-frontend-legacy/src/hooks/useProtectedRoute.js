import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';

/**
 * Custom hook for protecting routes and checking permissions
 */
export const useProtectedRoute = (requiredRoles = []) => {
  const { isAuthenticated, isLoading, user } = useAuth();
  
  // Check if user has required roles
  const hasRequiredRole = (roles) => {
    if (!roles || roles.length === 0) return true;
    if (!user || !user.roles) return false;
    
    return roles.some(role => user.roles.includes(role));
  };
  
  // Check access permissions
  const checkAccess = () => {
    if (isLoading) {
      return { allowed: false, loading: true };
    }
    
    if (!isAuthenticated) {
      return { 
        allowed: false, 
        loading: false, 
        redirectTo: '/login',
        reason: 'authentication_required'
      };
    }
    
    if (!hasRequiredRole(requiredRoles)) {
      return { 
        allowed: false, 
        loading: false, 
        redirectTo: '/dashboard',
        reason: 'insufficient_permissions'
      };
    }
    
    return { allowed: true, loading: false };
  };
  
  return {
    isAuthenticated,
    isLoading,
    user,
    hasRequiredRole,
    checkAccess,
  };
};

/**
 * Higher-order component for route protection
 */
export const withAuth = (Component, requiredRoles = []) => {
  return (props) => {
    const { checkAccess } = useProtectedRoute(requiredRoles);
    const access = checkAccess();
    
    if (access.loading) {
      return <div>Loading...</div>; // Or your loading component
    }
    
    if (!access.allowed) {
      return <Navigate to={access.redirectTo} replace />;
    }
    
    return <Component {...props} />;
  };
};

export default useProtectedRoute;
