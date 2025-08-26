import { useState, useEffect } from 'react';
import leagueAPI from '../services/api/leagueAPI.js';
import { showToast } from '../services/notificationService.js';

const useLeagues = () => {
  const [myLeagues, setMyLeagues] = useState([]);
  const [featuredLeagues, setFeaturedLeagues] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch user leagues using the API (with fallback to mock data)
  const fetchMyLeagues = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await leagueAPI.getUserLeagues();
      if (response.success) {
        setMyLeagues(response.leagues);
      } else {
        throw new Error(response.error || 'Failed to fetch leagues');
      }
    } catch (err) {
      setError(err.message);
      console.error('Error fetching leagues:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch featured leagues (with fallback to mock data)
  const fetchFeaturedLeagues = async () => {
    try {
      const response = await leagueAPI.getFeaturedLeagues();
      if (response.success) {
        setFeaturedLeagues(response.leagues);
      } else {
        throw new Error(response.error || 'Failed to fetch featured leagues');
      }
    } catch (err) {
      console.error('Error fetching featured leagues:', err);
      // The leagueAPI already handles fallback to mock data
    }
  };

  // Join a league by code
  const joinLeague = async (joinCode) => {
    try {
      const response = await leagueAPI.joinLeague(joinCode);
      if (response.success) {
        showToast('Successfully joined league!', 'success');
        // Refresh user leagues to include the newly joined league
        await fetchMyLeagues();
        return { success: true };
      } else {
        showToast(response.error || 'Failed to join league', 'error');
        return { success: false, error: response.error };
      }
    } catch (err) {
      showToast('Error joining league', 'error');
      console.error('Error joining league:', err);
      return { success: false, error: err.message };
    }
  };

  // Join a featured league
  const joinFeaturedLeague = async (leagueId) => {
    try {
      // For featured leagues, we use a special code format
      const response = await leagueAPI.joinLeague(`FEATURED_${leagueId}`);
      if (response.success) {
        showToast('Successfully joined featured league!', 'success');
        await fetchMyLeagues();
        return { success: true };
      } else {
        showToast(response.error || 'Failed to join featured league', 'error');
        return { success: false, error: response.error };
      }
    } catch (err) {
      showToast('Error joining featured league', 'error');
      console.error('Error joining featured league:', err);
      return { success: false, error: err.message };
    }
  };

  // Create a new league
  const createLeague = async (leagueData) => {
    try {
      const response = await leagueAPI.createLeague(leagueData);
      if (response.success) {
        showToast('League created successfully!', 'success');
        // Refresh user leagues to include the newly created league
        await fetchMyLeagues();
        return { success: true, league: response.league };
      } else {
        showToast(response.error || 'Failed to create league', 'error');
        return { success: false, error: response.error };
      }
    } catch (err) {
      showToast('Error creating league', 'error');
      console.error('Error creating league:', err);
      return { success: false, error: err.message };
    }
  };

  // Load data on component mount
  useEffect(() => {
    fetchMyLeagues();
    fetchFeaturedLeagues();
  }, []);

  return { 
    myLeagues, 
    featuredLeagues, 
    isLoading, 
    error, 
    joinLeague,
    joinFeaturedLeague,
    createLeague,
    refreshMyLeagues: fetchMyLeagues,
    refreshFeaturedLeagues: fetchFeaturedLeagues
  };
};

export default useLeagues;