import { useState, useEffect, useMemo } from 'react';
import dashboardAPI from '../services/api/dashboardAPI';
import leagueAPI from '../services/api/leagueAPI';
import { useNextMatch } from './useNextMatch';
import { useUserPredictions } from './useClientSideFixtures';
import { lastFullySettledGameweek, VERDICT_LABELS, pointsLabel } from '../utils/matchResult';
import { callVerdict } from '../utils/recordStats';

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

  // LAST GAMEWEEK ledger: last *fully settled* GW (every filed row has
  // actuals), all fixtures that week, subtitle from verdict/points.
  // Backend `correct` is exact-scoreline only — never use it as "scored".
  const ledger = useMemo(() => {
    const empty = { entries: [], gameweek: null, total: 0, bestGameweek: null, bestTotal: 0 };
    const settled = lastFullySettledGameweek(recentPredictions || []);
    if (!settled.gameweek || !settled.rows.length) return empty;

    const gwTotals = new Map();
    (recentPredictions || []).forEach((p) => {
      if (p.gameweek == null) return;
      if (p.actualHomeScore == null || p.actualAwayScore == null) return;
      gwTotals.set(p.gameweek, (gwTotals.get(p.gameweek) || 0) + (p.points || 0));
    });

    const entries = settled.rows.map((p) => {
      const verdict = callVerdict(p);
      const label = verdict ? VERDICT_LABELS[verdict.verdict] || verdict.verdict : null;
      const pts = pointsLabel(p.points);
      return {
        id: p.matchId,
        match: `${p.homeTeam} ${p.actualHomeScore}–${p.actualAwayScore} ${p.awayTeam}`,
        detail: label ? `${label} · ${pts}` : pts,
        pts: p.points,
        mark:
          verdict?.verdict === 'EXACT'
            ? 'var(--color-brand-teal)'
            : verdict?.verdict === 'OUTCOME'
              ? 'var(--color-brand-indigo)'
              : 'var(--color-brand-amber-mid)',
      };
    });

    const total = gwTotals.get(settled.gameweek) || settled.rows.reduce((s, p) => s + (p.points || 0), 0);

    let bestGameweek = null;
    let bestTotal = -Infinity;
    gwTotals.forEach((sum, gw) => {
      if (sum > bestTotal) {
        bestTotal = sum;
        bestGameweek = gw;
      }
    });

    return { entries, gameweek: settled.gameweek, total, bestGameweek, bestTotal };
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
