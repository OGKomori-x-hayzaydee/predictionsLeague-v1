import { useAuth } from '../context/AuthContext';

/**
 * Custom hook for accessing authentication state and methods
 * This is a convenience hook that wraps useAuth
 */
export const useAuthState = () => {
  const auth = useAuth();
  
  return {
    // State
    user: auth.user,
    isAuthenticated: auth.isAuthenticated,
    isLoading: auth.isLoading,
    error: auth.error,
    
    // Computed state
    isGuest: !auth.isAuthenticated && !auth.isLoading,
    userId: auth.user?.id,
    username: auth.user?.username,
    email: auth.user?.email,
    
    // Actions
    login: auth.login,
    logout: auth.logout,
    register: auth.register,
    updateUser: auth.updateUser,
    clearError: auth.clearError,
  };
};

export default useAuthState;
