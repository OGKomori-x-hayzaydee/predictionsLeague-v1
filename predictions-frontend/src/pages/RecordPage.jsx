import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Ticket } from '@phosphor-icons/react';
import SlotBar from '../components/ui/SlotBar';
import SegmentedControl from '../components/ui/SegmentedControl';
import EmptyState from '../components/ui/EmptyState';
import Button from '../components/ui/buttons/Button';
import PageSkeleton from '../components/ui/PageSkeleton';
import SeasonTab from '../components/record/SeasonTab';
import AllTimeTab from '../components/record/AllTimeTab';
import SearchTab from '../components/record/SearchTab';
import RecordSidebar from '../components/record/RecordSidebar';
import RecordMobileSheet from '../components/record/RecordMobileSheet';
import userPredictionsAPI from '../services/api/userPredictionsAPI';
import { computeProfileStats, computeChipAlmanac } from '../utils/profileStats';
import { calculatePoints } from '../utils/pointsCalculation';
import { DEMO_PREDICTIONS, DEMO_SEASON_HISTORY, DEMO_RANK_TRAJECTORY, DEMO_RANK_NOTE } from '../components/record/recordDemoData';
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
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'season';
  const highlightId = searchParams.get('highlight');
  const searchQuery = searchParams.get('q') || '';

  const [selectedGameweek, setSelectedGameweek] = useState(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(true);
  // Opt-in only (see plan: "hybrid" data-gates + preview) — never shown by
  // default. The preview button's amber state is the only on-screen cue.
  const [previewMode, setPreviewMode] = useState(() => searchParams.get('preview') === '1');

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

  const hasRealHistory = predictions.length > 0;
  const effectivePredictions = previewMode ? DEMO_PREDICTIONS : predictions;
  const hasHistory = effectivePredictions.length > 0;

  const stats = useMemo(() => computeProfileStats(effectivePredictions), [effectivePredictions]);

  const setActiveTab = (id) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set('tab', id);
      next.delete('q');
      next.delete('highlight');
      return next;
    });
    setSelectedGameweek(null);
  };

  // Scope for the sidebar/sheet: a single selected gameweek (Season tab
  // drawer open), career-wide (All-time tab), or the season default —
  // matches the prototype's slotFor()/buildRecord() scope switching, all
  // computed from the same real prediction array.
  const scopeProps = useMemo(() => {
    const worst = computeBestWorstWeeks(stats.pointsByGameweek).worst;

    if (activeTab === 'season' && selectedGameweek) {
      const weekPredictions = effectivePredictions.filter((p) => p.gameweek === selectedGameweek);
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
      const rate = computeScoringRate(effectivePredictions);
      return {
        scopeLabel: 'CAREER POINTS',
        scopeVal: stats.seasonPoints,
        scopeVerdict: `${rate.pct}% of your calls have scored, across every week on record.`,
        scopePct: rate.pct,
        scopeFoot: stats.bestWeek && worst ? `BEST WEEK ${stats.bestWeek.points} · WORST ${worst.points}` : undefined,
        bandsLabel: 'POINTS PER CALL, CAREER',
        bands: computePointsBands(effectivePredictions),
        chipScope: 'CAREER',
        chipReturn: computeChipAlmanac(effectivePredictions),
      };
    }

    const rate = computeScoringRate(effectivePredictions);
    return {
      scopeLabel: 'SEASON POINTS',
      scopeVal: stats.seasonPoints,
      scopeVerdict: `${rate.pct}% of your calls have scored this season.`,
      scopePct: rate.pct,
      scopeFoot: stats.bestWeek && worst ? `BEST WEEK ${stats.bestWeek.points} · WORST ${worst.points}` : undefined,
      bandsLabel: 'POINTS PER CALL, SEASON',
      bands: computePointsBands(effectivePredictions),
      chipScope: 'THIS SEASON',
      chipReturn: computeChipAlmanac(effectivePredictions),
    };
  }, [activeTab, selectedGameweek, effectivePredictions, stats]);

  const insight = useMemo(
    () => computeScorelineInsight(computeScorelineHitRates(effectivePredictions)),
    [effectivePredictions]
  );

  useEffect(() => {
    if (loading || selectedGameweek != null) return;
    const weeks = stats.pointsByGameweek;
    if (weeks.length) setSelectedGameweek(weeks[weeks.length - 1].gameweek);
  }, [loading, stats.pointsByGameweek, selectedGameweek]);

  const slotRight = hasHistory ? `${stats.totalCompleted} calls filed · ${stats.seasonPoints} pts` : undefined;

  return (
    <div className="flex flex-col animate-rise-in lg:h-[calc(100dvh-var(--shell-nav-h))] lg:overflow-hidden">
      <SlotBar kicker="My Record" tabs={TABS} activeTab={activeTab} onTabChange={setActiveTab} right={slotRight} />
      {previewMode && (
        <div className="border-b border-brand-amber/40 bg-brand-amber/10 px-4 py-2 text-center font-outfit text-2xs tracking-wide text-brand-amber">
          EXAMPLE DATA
        </div>
      )}

      {/* Mobile pill tab strip — the mobile shell has no equivalent of
          SlotBar's underline-tab chrome (matches the reference screenshots'
          rounded segmented control instead), so this replaces it entirely
          below `md`. */}
      <div className="flex items-center justify-center gap-2 px-4 pb-1 pt-4 lg:hidden">
        <SegmentedControl grow className="max-w-sm flex-1" value={activeTab} onChange={setActiveTab} options={TABS} />
        {hasRealHistory && previewMode && (
          <button
            onClick={() => setPreviewMode((v) => !v)}
            aria-label="Exit example data"
            className="inline-flex size-11 shrink-0 items-center justify-center rounded-md border border-brand-amber/50 text-brand-amber"
          >
            <Ticket size={14} />
          </button>
        )}
      </div>

      <div className="lg:min-h-0 lg:flex-1">
        {loading ? (
          <PageSkeleton rail />
        ) : !hasHistory ? (
          <EmptyState
            kicker="Record"
            title="No predictions on record yet"
            body="Once you file your first prediction it'll show up here, gameweek by gameweek, with the points breakdown behind every call."
            action={
              <div className="mt-1 flex flex-wrap items-center justify-center gap-3">
                <Link to="/fixtures">
                  <Button>Go to Fixtures</Button>
                </Link>
                <button
                  type="button"
                  onClick={() => setPreviewMode(true)}
                  className="font-outfit text-2xs tracking-wide text-text-muted underline decoration-dotted underline-offset-2 hover:text-brand-teal"
                >
                  Preview with example data →
                </button>
              </div>
            }
          />
        ) : (
          <div className="lg:grid lg:h-full lg:min-h-0 lg:grid-cols-[minmax(0,1fr)_minmax(16rem,var(--rail-max))] lg:items-stretch">
            <div className="min-w-0 px-4 py-5 md:min-h-0 md:overflow-y-auto md:px-[26px] md:py-6">
              {activeTab === 'season' && (
                <SeasonTab
                  predictions={effectivePredictions}
                  stats={stats}
                  selectedGameweek={selectedGameweek}
                  onSelectGameweek={setSelectedGameweek}
                  previewMode={previewMode}
                />
              )}
              {activeTab === 'allTime' && (
                <AllTimeTab
                  predictions={effectivePredictions}
                  stats={stats}
                  previewMode={previewMode}
                  demoSeasonHistory={DEMO_SEASON_HISTORY}
                  demoRankTrajectory={DEMO_RANK_TRAJECTORY}
                  demoRankNote={DEMO_RANK_NOTE}
                />
              )}
              {activeTab === 'search' && (
                <SearchTab predictions={effectivePredictions} initialQuery={searchQuery} highlightId={highlightId} />
              )}

              <button
                onClick={() => setSheetOpen(true)}
                className="mt-4 flex w-full items-center justify-between rounded-md border border-border-card bg-surface-card/70 px-4 py-[13px] text-sm text-text-secondary lg:hidden"
              >
                Hit rate, bands &amp; chip return
                <span className="font-outfit text-2xs text-brand-teal">VIEW &rsaquo;</span>
              </button>
            </div>

            <RecordSidebar {...scopeProps} insight={insight} />
          </div>
        )}
      </div>

      <RecordMobileSheet open={sheetOpen} onClose={() => setSheetOpen(false)} {...scopeProps} insight={insight} />
    </div>
  );
}
