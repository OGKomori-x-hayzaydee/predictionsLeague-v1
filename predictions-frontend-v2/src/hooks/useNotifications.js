import { useEffect, useState, useCallback } from 'react';
import { notificationManager } from '../services/notificationService';

/**
 * Hook for accessing the notification system
 * Provides methods for all notification types and recent activity
 */
export const useNotifications = () => {
  const [recentActivities, setRecentActivities] = useState(
    notificationManager.getRecentActivities()
  );

  // Subscribe to activity updates
  useEffect(() => {
    const unsubscribe = notificationManager.subscribe((activities) => {
      setRecentActivities(activities);
    }, 'activity');

    return unsubscribe;
  }, []);

  // Memoized notification methods
  const auth = useCallback(() => notificationManager.auth, []);
  const profile = useCallback(() => notificationManager.profile, []);  
  const predictions = useCallback(() => notificationManager.predictions, []);
  const leagues = useCallback(() => notificationManager.leagues, []);
  const settings = useCallback(() => notificationManager.settings, []);
  const achievements = useCallback(() => notificationManager.achievements, []);
  const system = useCallback(() => notificationManager.system, []);

  // Generic notification method
  const notify = useCallback((config) => {
    return notificationManager.notify(config);
  }, []);

  // Legacy support
  const showToast = useCallback((message, type = 'info', duration = 3000) => {
    return notificationManager.showToast(message, type, duration);
  }, []);

  return {
    // Notification methods
    auth: auth(),
    profile: profile(),
    predictions: predictions(), 
    leagues: leagues(),
    settings: settings(),
    achievements: achievements(),
    system: system(),
    notify,
    showToast, // Legacy support

    // Recent activity
    recentActivities,
    
    // Utility
    getRecentActivities: () => notificationManager.getRecentActivities()
  };
};

/**
 * Simplified hook for just recent activities
 */
export const useRecentActivity = () => {
  const [activities, setActivities] = useState(
    notificationManager.getRecentActivities()
  );

  useEffect(() => {
    const unsubscribe = notificationManager.subscribe((newActivities) => {
      setActivities(newActivities);
    }, 'activity');

    return unsubscribe;
  }, []);

  return activities;
};

export default useNotifications;