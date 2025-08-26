import React, { createContext, useContext, useState } from 'react';

// Temporary Auth Context for development without backend
const TempAuthContext = createContext();

// Mock user data for development
const mockUser = {
  id: 'temp-user-123',
  username: 'DemoUser',
  email: 'demo@example.com',
  firstName: 'Demo',
  lastName: 'User',
  favoriteTeam: 'Arsenal',
  memberSince: 'January 2024',
  isAuthenticated: true,
  profilePicture: null,
  preferences: {
    theme: 'dark',
    notifications: true,
    emailUpdates: false,
    language: 'en'
  },
  statistics: {
    totalPoints: 2847,
    currentRank: 42,
    totalPredictions: 156,
    correctPredictions: 89,
    accuracy: 57.1,
    bestGameweek: { week: 15, points: 98 },
    streak: 3
  },
  recentActivity: [
    { action: 'Made prediction for Arsenal vs Chelsea', time: '2 hours ago', points: 15 },
    { action: 'Joined Premier League Predictions', time: '1 day ago', points: null },
    { action: 'Perfect prediction for Liverpool vs City', time: '3 days ago', points: 25 },
    { action: 'Updated profile settings', time: '1 week ago', points: null }
  ]
};

export const TempAuthProvider = ({ children }) => {
  const [user, setUser] = useState(mockUser);
  const [isLoading, setIsLoading] = useState(false);

  // Temporary auth functions (no actual API calls)
  const login = async (credentials) => {
    setIsLoading(true);
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    setUser(mockUser);
    setIsLoading(false);
    return { success: true, user: mockUser };
  };

  const logout = async () => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    setUser(null);
    setIsLoading(false);
  };

  const register = async (userData) => {
    console.log("🔧 TempAuth register called with:", {
      username: userData.username,
      email: userData.email,
      password: userData.password ? "[HIDDEN]" : "empty",
      favoriteTeam: userData.favoriteTeam,
    });
    
    setIsLoading(true);
    console.log("⏳ Setting loading state to true");
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log("⏰ Simulated API delay completed");
    
    const newUser = { ...mockUser, ...userData };
    console.log("👤 Created new user object:", {
      id: newUser.id,
      username: newUser.username,
      email: newUser.email,
      favoriteTeam: newUser.favoriteTeam,
    });
    
    setUser(newUser);
    console.log("✅ User set in context");
    
    setIsLoading(false);
    console.log("✅ Loading state set to false");
    
    const result = { success: true, user: newUser };
    console.log("📤 Returning registration result:", result);
    
    return result;
  };

  const updateProfile = async (updates) => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 800));
    const updatedUser = { ...user, ...updates };
    setUser(updatedUser);
    setIsLoading(false);
    return { success: true, user: updatedUser };
  };

  const updatePreferences = async (preferences) => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    const updatedUser = { 
      ...user, 
      preferences: { ...user.preferences, ...preferences } 
    };
    setUser(updatedUser);
    setIsLoading(false);
    return { success: true, preferences: updatedUser.preferences };
  };

  const refreshToken = async () => {
    // No-op for temp auth
    return { success: true };
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    register,
    updateProfile,
    updatePreferences,
    refreshToken,
    // Additional helper properties
    theme: user?.preferences?.theme || 'dark'
  };

  return (
    <TempAuthContext.Provider value={value}>
      {children}
    </TempAuthContext.Provider>
  );
};

export const useTempAuth = () => {
  const context = useContext(TempAuthContext);
  if (!context) {
    throw new Error('useTempAuth must be used within a TempAuthProvider');
  }
  return context;
};

export default TempAuthContext;
