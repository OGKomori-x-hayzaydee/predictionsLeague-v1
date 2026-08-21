import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Ticket } from '@phosphor-icons/react';
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
  // default, and always paired with an unmissable banner below so real vs.
  // illustrative data is never ambiguous.
  const [previewMode, setPreviewMode] = useState(false);

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

  // "Full prediction" (Season ticket card) -> Search tab, pre-queried to
  // this exact fixture and auto-expanded/scrolled/glowing there — a real,
  // bookmarkable deep link rather than local component state.
  const handleViewFull = (prediction) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set('tab', 'search');
      next.set('q', `${prediction.homeTeam} ${prediction.awayTeam}`);
      next.set('highlight', String(prediction.id ?? prediction.matchId ?? ''));
      return next;
    });
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

  const insight = useMemo(() => computeScorelineInsight(computeScorelineHitRates(effectivePredictions)), [effectivePredictions]);

  const slotRight = hasHistory ? `${stats.totalCompleted} calls filed · ${stats.seasonPoints} pts` : undefined;

  return (
    <div className="flex flex-col animate-rise-in md:h-[calc(100vh-2.75rem)] md:overflow-hidden">
      <div className="hidden items-center md:flex">
        <div className="flex-1">
          <SlotBar kicker="My Record" tabs={TABS} activeTab={activeTab} onTabChange={setActiveTab} right={slotRight} />
        </div>
        {hasRealHistory && (
          <button
            onClick={() => setPreviewMode((v) => !v)}
            className={`mr-[22px] shrink-0 rounded-7 border px-2.5 py-1 font-outfit text-2xs tracking-wide transition-colors ${
              previewMode
                ? 'border-brand-amber/50 text-brand-amber'
                : 'border-border-card text-text-muted-3 hover:text-brand-teal'
            }`}
          >
            {previewMode ? 'EXIT PREVIEW' : 'PREVIEW EXAMPLE DATA'}
          </button>
        )}
      </div>

      {/* Mobile pill tab strip — the mobile shell has no equivalent of
          SlotBar's underline-tab chrome (matches the reference screenshots'
          rounded segmented control instead), so this replaces it entirely
          below `md`. */}
      <div className="flex items-center justify-center gap-2 px-4 pb-1 pt-4 md:hidden">
        <div className="flex flex-1 max-w-sm gap-0.5 rounded-9 border border-border-card bg-surface-card-4 p-[3px]">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`flex-1 rounded-7 px-2.5 py-2 text-caption font-medium transition-colors ${
                activeTab === t.id ? 'bg-surface-nav-active text-brand-teal' : 'text-text-muted-2'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
        {hasRealHistory && (
          <button
            onClick={() => setPreviewMode((v) => !v)}
            aria-label="Toggle preview with example data"
            className={`shrink-0 rounded-9 border p-2.5 ${
              previewMode ? 'border-brand-amber/50 text-brand-amber' : 'border-border-card text-text-muted-3'
            }`}
          >
            <Ticket size={14} />
          </button>
        )}
      </div>

      {previewMode && (
        <div className="mx-4 mt-3 flex items-center justify-between gap-3 rounded-9 border border-brand-amber/40 bg-[color-mix(in_srgb,var(--brand-amber)_10%,transparent)] px-4 py-2.5 md:mx-[26px]">
          <span className="font-outfit text-2xs tracking-[0.1em] text-brand-amber">
            PREVIEW · Example data, not your real record
          </span>
          <button
            onClick={() => setPreviewMode(false)}
            className="shrink-0 font-outfit text-2xs tracking-wide text-brand-amber underline decoration-dotted underline-offset-2 hover:text-brand-amber-mid"
          >
            Exit preview
          </button>
        </div>
      )}

      <div className="md:min-h-0 md:flex-1">
        {loading ? (
          <LoadingState message="Loading your record..." />
        ) : !hasHistory ? (
          <div className="flex min-h-[50vh] flex-col items-center justify-center gap-3 px-6 text-center">
            <span
              aria-hidden="true"
              className="mb-1 flex h-14 w-14 items-center justify-center rounded-14 border border-dashed border-border-control text-2xl text-text-muted-4"
            >
              <Ticket size={28} />
            </span>
            <span className="font-dmSerif text-2xl text-text-primary">No predictions on record yet</span>
            <p className="max-w-sm text-sm text-text-muted-2">
              Once you file your first prediction it'll show up here, gameweek by gameweek, with the points
              breakdown behind every call.
            </p>
            <div className="mt-1 flex flex-wrap items-center justify-center gap-3">
              <Link
                to="/fixtures"
                className="rounded-9 bg-brand-indigo-mid px-4 py-2 text-sm text-white transition-colors hover:bg-brand-indigo-hover"
              >
                Go to Fixtures
              </Link>
              <button
                onClick={() => setPreviewMode(true)}
                className="font-outfit text-2xs tracking-wide text-text-muted-2 underline decoration-dotted underline-offset-2 hover:text-brand-teal"
              >
                Preview with example data →
              </button>
            </div>
          </div>
        ) : (
          <div className="md:grid md:h-full md:min-h-0 md:grid-cols-[1fr_320px] md:items-stretch">
            <div className="min-w-0 px-4 py-5 md:min-h-0 md:overflow-y-auto md:px-[26px] md:py-6">
              {activeTab === 'season' && (
                <SeasonTab
                  predictions={effectivePredictions}
                  stats={stats}
                  selectedGameweek={selectedGameweek}
                  onSelectGameweek={setSelectedGameweek}
                  onViewFull={handleViewFull}
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
                className="mt-4 flex w-full items-center justify-between rounded-md border border-border-card bg-surface-card/70 px-4 py-[13px] text-sm text-text-secondary md:hidden"
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
