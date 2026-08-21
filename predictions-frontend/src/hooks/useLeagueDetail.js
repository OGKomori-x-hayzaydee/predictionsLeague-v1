import { useEffect, useMemo, useState, useCallback } from 'react';
import leagueAPI from '../services/api/leagueAPI';
import dashboardAPI from '../services/api/dashboardAPI';
import {
  MAX_HISTORY_GAMEWEEKS,
  aggregateLeagueSeason,
  computeStandingsHistory,
  buildRecords,
  buildHeadToHead,
  buildActivityFeed,
  buildFormBook,
  sparkPoints,
} from '../utils/leagueStats';

/**
 * Everything the League-detail view (masthead, podium, position chart,
 * head-to-head, records, activity feed, form book) needs for one league —
 * real standings plus a bounded window of real per-gameweek prediction
 * summaries, reduced client-side (see utils/leagueStats.js for why: the
 * backend has no dedicated historical-standings/H2H table, but the raw
 * PredictionEntity rows behind LeaguePredictionSummary are enough to derive
 * the same shape of insight honestly).
 */
export default function useLeagueDetail(leagueId, overview, demoPack = null) {
  const [standings, setStandings] = useState(demoPack?.standings ?? null);
  const [standingsLoading, setStandingsLoading] = useState(!demoPack);
  const [currentGameweek, setCurrentGameweek] = useState(demoPack?.currentGameweek ?? null);
  const [predictionsByGw, setPredictionsByGw] = useState(demoPack?.predictionsByGw ?? {});
  const [gwOrder, setGwOrder] = useState(demoPack?.gwOrder ?? []);
  const [seasonLoading, setSeasonLoading] = useState(!demoPack);

  const [activeTab, setActiveTab] = useState('overview');
  const [selectedGw, setSelectedGwState] = useState(demoPack?.selectedGw ?? demoPack?.currentGameweek ?? null);
  const [mode, setMode] = useState('score');
  const [sel, setSel] = useState(null); // { type: 'member' | 'fixture', id }
  const [vsIdx, setVsIdx] = useState(0);
  const [vsVariant, setVsVariant] = useState('tape');
  const [podiumExpand, setPodiumExpand] = useState(null);
  const [mobGrid, setMobGrid] = useState('member');
  const [scopeOpen, setScopeOpen] = useState(false);

  // Preview pack short-circuits every fetch — same shapes as the live
  // standings + per-gameweek prediction summaries, so the reducers below
  // don't know or care which source filled the state.
  useEffect(() => {
    if (!demoPack) return;
    setStandings(demoPack.standings);
    setStandingsLoading(false);
    setPredictionsByGw(demoPack.predictionsByGw);
    setGwOrder(demoPack.gwOrder);
    setCurrentGameweek(demoPack.currentGameweek);
    setSeasonLoading(false);
    setSelectedGwState(demoPack.selectedGw ?? demoPack.currentGameweek);
  }, [demoPack]);

  // Standings — real, always fetched (skipped in preview).
  useEffect(() => {
    if (demoPack || !leagueId) return;
    let cancelled = false;
    setStandingsLoading(true);
    leagueAPI
      .getLeagueStandings(leagueId)
      .then((res) => {
        if (cancelled) return;
        const list = Array.from(res?.standings || []).sort((a, b) => (a.position ?? 999) - (b.position ?? 999));
        setStandings(list);
      })
      .catch(() => !cancelled && setStandings([]))
      .finally(() => !cancelled && setStandingsLoading(false));
    return () => { cancelled = true; };
  }, [leagueId, demoPack]);

  // Current gameweek — reused from the same essential-data endpoint the
  // Dashboard uses, so this hook doesn't invent its own notion of "now".
  useEffect(() => {
    if (demoPack) return;
    let cancelled = false;
    dashboardAPI
      .getEssentialData()
      .then((data) => !cancelled && setCurrentGameweek(data?.season?.currentGameweek ?? null))
      .catch(() => !cancelled && setCurrentGameweek(null));
    return () => { cancelled = true; };
  }, [demoPack]);

  // A bounded window of real per-gameweek prediction summaries for the
  // whole league, fetched once standings + currentGameweek are known.
  useEffect(() => {
    if (demoPack || !leagueId || !currentGameweek) return;
    const first = overview?.firstGameweek || 1;
    const start = Math.max(first, currentGameweek - MAX_HISTORY_GAMEWEEKS + 1);
    const order = [];
    for (let gw = start; gw <= currentGameweek; gw++) order.push(gw);
    if (order.length === 0) {
      setSeasonLoading(false);
      return;
    }
    let cancelled = false;
    setSeasonLoading(true);
    Promise.all(order.map((gw) => leagueAPI.getLeaguePredictions(leagueId, gw).catch(() => [])))
      .then((results) => {
        if (cancelled) return;
        const byGw = {};
        order.forEach((gw, i) => { byGw[gw] = results[i] || []; });
        setPredictionsByGw(byGw);
        setGwOrder(order);
      })
      .finally(() => !cancelled && setSeasonLoading(false));
    return () => { cancelled = true; };
  }, [leagueId, currentGameweek, overview?.firstGameweek, demoPack]);

  // Default the grid's gameweek scope to "now" once we know it.
  useEffect(() => {
    if (currentGameweek && selectedGw == null) setSelectedGwState(currentGameweek);
  }, [currentGameweek, selectedGw]);

  const setSelectedGw = useCallback((gw) => {
    setSelectedGwState(gw);
    setSel(null);
  }, []);

  const you = useMemo(() => (standings || []).find((m) => m.isCurrentUser) || null, [standings]);

  const seasonAgg = useMemo(() => {
    if (!standings || standings.length === 0) return null;
    return aggregateLeagueSeason({ predictionsByGw, gwOrder, standings });
  }, [predictionsByGw, gwOrder, standings]);

  const settledGws = seasonAgg?.settledGws || [];
  const latestSettledGw = settledGws.length ? Math.max(...settledGws) : null;
  const pendingGw = currentGameweek && !settledGws.includes(currentGameweek) ? currentGameweek : null;

  const history = useMemo(() => {
    if (!seasonAgg) return [];
    return computeStandingsHistory({ gwTotals: seasonAgg.gwTotals, settledGws, usernames: seasonAgg.usernames });
  }, [seasonAgg, settledGws]);

  const positionSeries = useMemo(() => {
    if (!you) return [];
    return history.map((h) => h.ranks[you.username]).filter((v) => v != null);
  }, [history, you]);

  const positionLine = useMemo(() => sparkPoints(positionSeries, 100, 30, { invert: true }), [positionSeries]);

  const gwRanking = useMemo(() => {
    if (!seasonAgg || latestSettledGw == null || !standings) return [];
    return [...standings]
      .map((m) => ({ ...m, gwTotal: seasonAgg.gwTotals[m.username]?.[latestSettledGw] ?? 0 }))
      .sort((a, b) => b.gwTotal - a.gwTotal);
  }, [seasonAgg, latestSettledGw, standings]);

  const podium = useMemo(() => gwRanking.slice(0, 3), [gwRanking]);

  const youGwTotal = useMemo(() => (you ? seasonAgg?.gwTotals[you.username]?.[latestSettledGw] ?? 0 : null), [seasonAgg, you, latestSettledGw]);
  const youGwRank = useMemo(() => {
    if (!you || gwRanking.length === 0) return null;
    const idx = gwRanking.findIndex((m) => m.username === you.username);
    return idx >= 0 ? idx + 1 : null;
  }, [gwRanking, you]);

  const records = useMemo(() => {
    if (!seasonAgg) return [];
    return buildRecords({
      standings,
      gwTotals: seasonAgg.gwTotals,
      bestCall: seasonAgg.bestCall,
      settledGws,
      gwFiledCount: seasonAgg.gwFiledCount,
      fixturesByGw: seasonAgg.fixturesByGw,
      history,
    });
  }, [seasonAgg, standings, settledGws, history]);

  const feed = useMemo(() => {
    if (!seasonAgg || !standings) return [];
    return buildActivityFeed({ standings, chipPlays: seasonAgg.chipPlays, leagueName: overview?.name || 'the league' });
  }, [seasonAgg, standings, overview?.name]);

  const rivals = useMemo(() => {
    if (!seasonAgg || !you || !standings) return [];
    return standings
      .filter((m) => !m.isCurrentUser)
      .map((rival) =>
        buildHeadToHead({
          rival,
          you,
          gwTotals: seasonAgg.gwTotals,
          exactCount: seasonAgg.exactCount,
          drawCallCount: seasonAgg.drawCallCount,
          chipPlays: seasonAgg.chipPlays,
          settledGws,
        })
      );
  }, [seasonAgg, you, standings, settledGws]);

  const formBook = useMemo(() => {
    if (!standings || selectedGw == null) return null;
    return buildFormBook({ predictionsByGw, gw: selectedGw, standings, mode });
  }, [predictionsByGw, selectedGw, standings, mode]);

  const gwOptions = useMemo(() => {
    if (!currentGameweek) return [];
    const first = overview?.firstGameweek || 1;
    const opts = [];
    for (let gw = first; gw <= currentGameweek; gw++) opts.push(gw);
    return opts;
  }, [overview?.firstGameweek, currentGameweek]);

  useEffect(() => {
    if (!you || sel) return;
    setSel({ type: 'member', id: you.username });
  }, [you, sel]);

  return {
    loading: standingsLoading,
    seasonLoading,
    standings: standings || [],
    you,
    currentGameweek,
    settledGws,
    latestSettledGw,
    pendingGw,
    history,
    positionSeries,
    positionLine,
    podium,
    youGwTotal,
    youGwRank,
    records,
    feed,
    rivals,
    fixturesByGw: seasonAgg?.fixturesByGw || {},
    bestCall: seasonAgg?.bestCall || {},

    activeTab, setActiveTab,
    selectedGw, setSelectedGw,
    gwOptions,
    mode, setMode,
    formBook,
    sel, setSel,
    vsIdx, setVsIdx,
    vsVariant, setVsVariant,
    podiumExpand, setPodiumExpand,
    mobGrid, setMobGrid,
    scopeOpen, setScopeOpen,
  };
}
