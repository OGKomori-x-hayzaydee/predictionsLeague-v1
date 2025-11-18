import { useState, useEffect } from 'react';
import dashboardAPI from '../services/api/dashboardAPI';
import leagueAPI from '../services/api/leagueAPI';
import { useNextMatch } from './useNextMatch';

// This hook implements progressive loading with real API calls
// It uses the hybrid API approach with dashboard/ endpoints for secondary data

const useDashboardData = () => {
  // Use next match hook for frontend calculation
  const { nextMatch, timeDisplay, isLive, clearCache: clearNextMatchCache } = useNextMatch();
  
  // Essential data state (loads first)
  const [essentialData, setEssentialData] = useState(null);
  const [essentialLoading, setEssentialLoading] = useState(true);
  
  // StatusBar data state (loads with essential data)
  const [statusBarData, setStatusBarData] = useState({
    user: null,
    nextMatchData: null,
  });
  const [statusBarLoading, setStatusBarLoading] = useState(true);
  
  // Secondary data state (loads progressively)
  const [secondaryData, setSecondaryData] = useState({
    recentPredictions: null,
    leagues: null,
    insights: null,
  });
  
  const [secondaryLoading, setSecondaryLoading] = useState({
    predictions: true,
    leagues: true,
    insights: true,
  });

  const [errors, setErrors] = useState({});

  // Fetch essential data first
  useEffect(() => {
    const fetchEssentialData = async () => {
      try {
        setEssentialLoading(true);
        setStatusBarLoading(true);
        
        let userData = null;
        
        try {
          // Try to call real API for essential data (user info only)
          const essentialResponse = await dashboardAPI.getEssentialData();
          
          setEssentialData(essentialResponse);
          userData = essentialResponse.user;
        } catch (apiError) {
          console.warn('⚠️ Dashboard API failed, using guest user:', apiError);
          
          userData = { username: 'Guest', points: 0, rank: 0 };
          
          // Set minimal essential data
          setEssentialData({
            user: userData
          });
        }
        
      } catch (error) {
        console.error('❌ Failed to fetch essential data:', error);
        setErrors(prev => ({ ...prev, essential: error }));
      } finally {
        setEssentialLoading(false);
        setStatusBarLoading(false);
      }
    };

    fetchEssentialData();
  }, []);

  // Update status bar data when next match or user data changes
  useEffect(() => {
    setStatusBarData(prev => ({
      ...prev,
      nextMatchData: nextMatch ? {
        ...nextMatch,
        timeDisplay, // Add the calculated time display
        isLive
      } : null
    }));
  }, [nextMatch, timeDisplay, isLive]);

  // Update status bar data when user data is loaded
  useEffect(() => {
    if (essentialData?.user) {
      setStatusBarData(prev => ({
        ...prev,
        user: essentialData.user
      }));
    }
  }, [essentialData]);

  // Fetch secondary data after essential data is loaded
  useEffect(() => {
    if (!essentialData) return;

    const fetchSecondaryData = async () => {
      // Fetch user leagues
      try {
        const leagues = await leagueAPI.getUserLeagues(); // Use proper leagueAPI instead of dashboardAPI
        setSecondaryData(prev => ({ ...prev, leagues }));
        setSecondaryLoading(prev => ({ ...prev, leagues: false }));
      } catch (error) {
        console.error('❌ Failed to fetch user leagues:', error);
        setErrors(prev => ({ ...prev, leagues: error }));
        setSecondaryLoading(prev => ({ ...prev, leagues: false }));
      }

      // Performance insights - commented out for later implementation
      
      // Set insights loading to false since we're not fetching it
      setSecondaryLoading(prev => ({ ...prev, insights: false }));
    };

    fetchSecondaryData();
  }, [essentialData]);

  // Refresh function to refetch leagues data
  const refreshLeagues = async () => {
    try {
      setSecondaryLoading(prev => ({ ...prev, leagues: true }));
      console.log('🔄 Refreshing leagues data...');
      
      const userLeagues = await leagueAPI.getUserLeagues();
      console.log('✅ Leagues refreshed:', userLeagues);
      
      setSecondaryData(prev => ({ ...prev, leagues: userLeagues }));
      setSecondaryLoading(prev => ({ ...prev, leagues: false }));
      
      // Clear any previous league errors
      setErrors(prev => ({ ...prev, leagues: null }));
    } catch (error) {
      console.error('❌ Failed to refresh leagues:', error.message);
      setErrors(prev => ({ ...prev, leagues: error.message }));
      setSecondaryLoading(prev => ({ ...prev, leagues: false }));
    }
  };

  return {
    // Essential data
    essentialData,
    essentialLoading,
    
    // Status bar data
    statusBarData,
    statusBarLoading,
    
    // Secondary data
    leagues: secondaryData.leagues || [],
    
    // Loading states
    secondaryLoading,
    
    // Error states
    errors,
    
    // Refresh functions
    refreshLeagues,
    clearNextMatchCache,
    
    // Helper to check if any secondary data is still loading
    isSecondaryLoading: Object.values(secondaryLoading).some(loading => loading),
  };
};

export default useDashboardData;
