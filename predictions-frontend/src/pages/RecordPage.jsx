import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import SlotBar from '../components/ui/SlotBar';
import LoadingState from '../components/common/LoadingState';
import SeasonTab from '../components/record/SeasonTab';
import AllTimeTab from '../components/record/AllTimeTab';
import SearchTab from '../components/record/SearchTab';
import RecordSidebar from '../components/record/RecordSidebar';
import RecordMobileSheet from '../components/record/RecordMobileSheet';
import userPredictionsAPI from '../services/api/userPredictionsAPI';
import { computeProfileStats, computeChipAlmanac } from '../utils/profileStats';
import { calculatePoints } from '../utils/pointsCalculation';
import {
  computePointsBands,
  computeScoringRate,
  computeBestWorstWeeks,
  computeScorelineHitRates,
  computeScorelineInsight,
} from '../utils/recordStats';

const TABS = [
  { id: 'season', label: 'Season' },
  { id: 'allTime', label: 'All-time' },
  { id: 'search', label: 'Search' },
];

export default function RecordPage() {
  const [activeTab, setActiveTab] = useState('season');
  const [selectedGameweek, setSelectedGameweek] = useState(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    userPredictionsAPI
      .getAllUserPredictions({ status: 'all' })
      .then((res) => !cancelled && setPredictions(res.data || []))
      .catch(() => {})
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, []);

  const stats = useMemo(() => computeProfileStats(predictions), [predictions]);
  const hasHistory = predictions.length > 0;

  // Scope for the sidebar/sheet: a single selected gameweek (Season tab
  // drawer open), career-wide (All-time tab), or the season default —
  // matches the prototype's slotFor()/buildRecord() scope switching, all
  // computed from the same real prediction array.
  const scopeProps = useMemo(() => {
    const worst = computeBestWorstWeeks(stats.pointsByGameweek).worst;

    if (activeTab === 'season' && selectedGameweek) {
      const weekPredictions = predictions.filter((p) => p.gameweek === selectedGameweek);
      const weekTotal = weekPredictions.reduce((t, p) => t + (calculatePoints(p) ?? 0), 0);
      const rate = computeScoringRate(weekPredictions);
      return {
        scopeLabel: `GAMEWEEK ${selectedGameweek}`,
        scopeVal: weekTotal,
        scopeVerdict: stats.avgPerWeek
          ? `${weekTotal >= stats.avgPerWeek ? 'Above' : 'Below'} your season average of ${stats.avgPerWeek}.`
          : `${rate.pct}% of this week's calls scored.`,
        scopePct: rate.pct,
        scopeFoot: stats.bestWeek ? `BEST WEEK ${stats.bestWeek.points}` : undefined,
        bandsLabel: `POINTS PER CALL, GW${selectedGameweek}`,
        bands: computePointsBands(weekPredictions),
        chipScope: `GW${selectedGameweek}`,
        chipReturn: computeChipAlmanac(weekPredictions),
      };
    }

    if (activeTab === 'allTime') {
      const rate = computeScoringRate(predictions);
      return {
        scopeLabel: 'CAREER POINTS',
        scopeVal: stats.seasonPoints,
        scopeVerdict: `${rate.pct}% of your calls have scored, across every week on record.`,
        scopePct: rate.pct,
        scopeFoot: stats.bestWeek && worst ? `BEST WEEK ${stats.bestWeek.points} · WORST ${worst.points}` : undefined,
        bandsLabel: 'POINTS PER CALL, CAREER',
        bands: computePointsBands(predictions),
        chipScope: 'CAREER',
        chipReturn: computeChipAlmanac(predictions),
      };
    }

    const rate = computeScoringRate(predictions);
    return {
      scopeLabel: 'SEASON POINTS',
      scopeVal: stats.seasonPoints,
      scopeVerdict: `${rate.pct}% of your calls have scored this season.`,
      scopePct: rate.pct,
      scopeFoot: stats.bestWeek && worst ? `BEST WEEK ${stats.bestWeek.points} · WORST ${worst.points}` : undefined,
      bandsLabel: 'POINTS PER CALL, SEASON',
      bands: computePointsBands(predictions),
      chipScope: 'THIS SEASON',
      chipReturn: computeChipAlmanac(predictions),
    };
  }, [activeTab, selectedGameweek, predictions, stats]);

  const insight = useMemo(() => computeScorelineInsight(computeScorelineHitRates(predictions)), [predictions]);

  const slotRight = hasHistory ? `${stats.totalCompleted} calls filed · ${stats.seasonPoints} pts` : undefined;

  return (
    <div className="animate-rise-in">
      <SlotBar
        kicker="My Record"
        tabs={TABS}
        activeTab={activeTab}
        onTabChange={(id) => {
          setActiveTab(id);
          setSelectedGameweek(null);
        }}
        right={slotRight}
      />

      {loading ? (
        <LoadingState message="Loading your record..." />
      ) : !hasHistory ? (
        <div className="flex min-h-[50vh] flex-col items-center justify-center gap-3 px-6 text-center">
          <span className="font-dmSerif text-2xl text-text-primary">No predictions on record yet</span>
          <p className="max-w-sm text-sm text-text-muted-2">
            Once you file your first prediction it'll show up here, gameweek by gameweek, with the points
            breakdown behind every call.
          </p>
          <Link
            to="/fixtures"
            className="mt-1 rounded-9 bg-brand-indigo-mid px-4 py-2 text-sm text-white transition-colors hover:bg-brand-indigo-hover"
          >
            Go to Fixtures
          </Link>
        </div>
      ) : (
        <div className="md:grid md:min-h-0 md:grid-cols-[1fr_320px] md:items-stretch">
          <div className="min-w-0 px-4 py-5 md:px-[26px] md:py-5">
            {activeTab === 'season' && (
              <SeasonTab
                predictions={predictions}
                stats={stats}
                selectedGameweek={selectedGameweek}
                onSelectGameweek={setSelectedGameweek}
              />
            )}
            {activeTab === 'allTime' && <AllTimeTab predictions={predictions} stats={stats} />}
            {activeTab === 'search' && <SearchTab predictions={predictions} />}

            <button
              onClick={() => setSheetOpen(true)}
              className="mt-4 flex w-full items-center justify-between rounded-md border border-border-card bg-surface-card/70 px-4 py-[13px] text-sm text-text-secondary md:hidden"
            >
              Hit rate, bands &amp; chip return
              <span className="font-mono text-[11px] text-brand-teal">VIEW &rsaquo;</span>
            </button>
          </div>

          <RecordSidebar {...scopeProps} insight={insight} />
        </div>
      )}

      <RecordMobileSheet open={sheetOpen} onClose={() => setSheetOpen(false)} {...scopeProps} insight={insight} />
    </div>
  );
}
