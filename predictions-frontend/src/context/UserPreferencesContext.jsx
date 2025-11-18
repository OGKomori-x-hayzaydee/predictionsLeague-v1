import { createContext, useState, useEffect, useContext } from "react";

export const UserPreferencesContext = createContext();

// Custom hook for easier access
export const useUserPreferences = () => {
  const context = useContext(UserPreferencesContext);
  if (!context) {
    throw new Error('useUserPreferences must be used within a UserPreferencesProvider');
  }
  return context;
};

export const UserPreferencesProvider = ({ children }) => {
  // Simplified default preferences - only what's actually used
  const defaultPreferences = {
    // Interface preferences
    defaultDashboardView: 'fixtures',
    defaultFixturesView: 'list',
    defaultPredictionsView: 'list',
    defaultLeaguePredictionsView: 'teams',
    showButtonTitles: true,
    
    // Notification preferences
    notifications: {
      emailAlerts: true,
      predictionReminders: true,
      leagueInvitations: true,
    }
  };

  // Get initial preferences from localStorage or use defaults
  const getInitialPreferences = () => {
    try {
      const savedPreferences = localStorage.getItem("userPreferences");
      if (savedPreferences) {
        const parsed = JSON.parse(savedPreferences);
        // Merge with defaults to ensure all properties exist
        return { ...defaultPreferences, ...parsed };
      }
    } catch (error) {
      console.error("Error parsing user preferences from localStorage:", error);
    }
    return defaultPreferences;
  };

  const [preferences, setPreferences] = useState(getInitialPreferences);

  // Update a specific preference
  const updatePreference = (key, value) => {
    setPreferences(prev => ({
      ...prev,
      [key]: value
    }));
  };

  // Update nested preference (e.g., notifications.email)
  const updateNestedPreference = (section, key, value) => {
    setPreferences(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value
      }
    }));
  };

  // Reset all preferences to defaults
  const resetPreferences = () => {
    setPreferences(defaultPreferences);
  };

  // Save to localStorage whenever preferences change
  useEffect(() => {
    try {
      localStorage.setItem("userPreferences", JSON.stringify(preferences));
    } catch (error) {
      console.error("Error saving user preferences to localStorage:", error);
    }
  }, [preferences]);

  const value = {
    preferences,
    updatePreference,
    updateNestedPreference,
    resetPreferences,
    defaultPreferences
  };

  return (
    <UserPreferencesContext.Provider value={value}>
      {children}
    </UserPreferencesContext.Provider>
  );
};
