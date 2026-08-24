import { useState, useEffect, useMemo } from 'react';
import dashboardAPI from '../services/api/dashboardAPI';
import leagueAPI from '../services/api/leagueAPI';
import { useNextMatch } from './useNextMatch';
import { useUserPredictions } from './useClientSideFixtures';

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

  // Recent scored predictions, used to derive the Dashboard's "LAST
  // GAMEWEEK" ledger (see ledger useMemo below). Sourced from
  // /predictions/user (via useUserPredictions) rather than
  // /dashboard/predictions/recent — that endpoint's DTO never carries the
  // actual match score, only the user's own predicted score, so the ledger
  // could never show a real result from it.
  const { data: recentPredictions, isLoading: recentPredictionsLoading } = useUserPredictions({ status: 'all' });

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

  // Derive the "LAST GAMEWEEK" ledger from recent predictions: the most
  // recently completed gameweek's scored predictions, newest first, capped
  // to 3 rows for the sidebar/sheet, plus the season's best-scoring
  // gameweek. Pure arithmetic over real backend fields (points/correct/
  // gameweek) — no fabricated data.
  //
  // "Completed" is judged by the actual result (actualHomeScore/
  // actualAwayScore) being present, not by `points`: PredictionEntity.points
  // defaults to 0 (never null) until a match settles, so filtering on
  // points-not-null would wrongly treat the *current*, still-open gameweek
  // as "last gameweek" too.
  const ledger = useMemo(() => {
    const completed = (recentPredictions || []).filter(
      (p) => p.actualHomeScore != null && p.actualAwayScore != null && p.gameweek != null
    );
    if (completed.length === 0) {
      return { entries: [], gameweek: null, total: 0, bestGameweek: null, bestTotal: 0 };
    }

    const gwTotals = new Map();
    completed.forEach((p) => {
      gwTotals.set(p.gameweek, (gwTotals.get(p.gameweek) || 0) + (p.points || 0));
    });

    const latestGameweek = Math.max(...gwTotals.keys());
    const gwPredictions = completed
      .filter((p) => p.gameweek === latestGameweek)
      .sort((a, b) => new Date(b.date) - new Date(a.date));

    const entries = gwPredictions.slice(0, 3).map((p) => ({
      id: p.matchId,
      match: `${p.homeTeam} ${p.actualHomeScore}–${p.actualAwayScore} ${p.awayTeam}`,
      detail: p.correct ? 'Correct result' : 'No points',
      pts: p.points,
      mark:
        p.points >= 10
          ? 'var(--color-brand-teal)'
          : p.points > 0
            ? 'var(--color-brand-indigo)'
            : 'var(--color-brand-amber-mid)',
    }));

    const total = gwTotals.get(latestGameweek) || 0;

    let bestGameweek = null;
    let bestTotal = -Infinity;
    gwTotals.forEach((sum, gw) => {
      if (sum > bestTotal) {
        bestTotal = sum;
        bestGameweek = gw;
      }
    });

    return { entries, gameweek: latestGameweek, total, bestGameweek, bestTotal };
  }, [recentPredictions]);

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

    // Ledger ("LAST GAMEWEEK" panel) — derived from recent predictions
    ledger: ledger.entries,
    ledgerGameweek: ledger.gameweek,
    ledgerTotal: ledger.total,
    ledgerBestGameweek: ledger.bestGameweek,
    ledgerBestTotal: ledger.bestTotal,
    ledgerLoading: recentPredictionsLoading,

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
