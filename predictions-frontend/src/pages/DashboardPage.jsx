import { useState } from 'react';
import SlotBar from '../components/ui/SlotBar';
import KickerLabel from '../components/ui/KickerLabel';
import StationRail from '../components/dashboard/StationRail';
import FixturePreviewCardFoil from '../components/dashboard/FixturePreviewCardFoil';
import ResultsCarousel from '../components/dashboard/ResultsCarousel';
import DashboardSidebar from '../components/dashboard/DashboardSidebar';
import DashboardMobileSheet from '../components/dashboard/DashboardMobileSheet';
import LoadingState from '../components/common/LoadingState';
import PageSkeleton from '../components/ui/PageSkeleton';
import useFixtureSpine from '../hooks/useFixtureSpine';
import useDashboardData from '../hooks/useDashboardData';
import useLastSettledGameweek from '../hooks/useLastSettledGameweek';
import { useNextMatch } from '../hooks/useNextMatch';

export default function DashboardPage() {
  const [sheetOpen, setSheetOpen] = useState(false);

  const {
    stations,
    selectedFixture,
    selectedCeiling,
    filedCount,
    total,
    tableMaxPoints,
    selectPrev,
    selectNext,
    canSelectPrev,
    canSelectNext,
    isLoading: fixturesLoading,
  } = useFixtureSpine();

  const {
    essentialData,
    ledger,
    ledgerGameweek,
    ledgerTotal,
    ledgerBestGameweek,
    ledgerBestTotal,
    ledgerLoading,
    leagues,
  } = useDashboardData();
  const { timeDisplay, isLive } = useNextMatch();
  const lastGw = useLastSettledGameweek();

  const currentGameweek = essentialData?.season?.currentGameweek;
  const deadlineFormatted = essentialData?.season?.deadlineFormatted;
  const showDeadlineCountdown =
    !!timeDisplay && !isLive && timeDisplay !== 'Loading...' && timeDisplay !== 'No matches';

  const stillOpen = Math.max(total - filedCount, 0);
  const openLine = deadlineFormatted
    ? `${stillOpen} still open · deadline ${deadlineFormatted}`
    : `${stillOpen} still open`;
  const progressPct = total > 0 ? Math.round((filedCount / total) * 100) : 0;
  const ledgerFooter = !ledgerGameweek
    ? null
    : ledgerBestGameweek && ledgerBestGameweek !== ledgerGameweek
      ? `GW${ledgerGameweek} total ${ledgerTotal} · best week GW${ledgerBestGameweek} on ${ledgerBestTotal}`
      : `GW${ledgerGameweek} total ${ledgerTotal} pts`;

  if (fixturesLoading && !selectedFixture) {
    return <PageSkeleton rail />;
  }

  return (
    <div className="flex flex-col animate-rise-in lg:h-[calc(100dvh-var(--shell-nav-h))] lg:overflow-hidden">
      <SlotBar
        kicker={currentGameweek ? `GAMEWEEK ${currentGameweek}` : 'GAMEWEEK'}
        right={`${filedCount} of ${total} filed`}
        deadline={showDeadlineCountdown ? timeDisplay : undefined}
      />

      <div className="hidden min-h-0 flex-1 lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(16rem,var(--rail-max))] lg:items-stretch">
        <div className="flex min-h-0 min-w-0 flex-col gap-4 overflow-y-auto px-6 pb-12 pt-5">
          <div className="flex items-end justify-between gap-4">
            <p className="text-sm text-text-muted">{openLine}</p>
            {showDeadlineCountdown && (
              <span className="font-outfit text-sm text-brand-amber">{timeDisplay} to deadline</span>
            )}
          </div>

          <div className="relative h-1 overflow-hidden rounded-full bg-surface-track">
            <div
              className="absolute inset-0 rounded-full bg-brand-teal-mid transition-all"
              style={{ width: `${progressPct}%` }}
            />
          </div>

          <div>
            {fixturesLoading ? (
              <LoadingState compact message="Loading fixtures..." />
            ) : (
              <StationRail stations={stations} variant="desktop" />
            )}
          </div>

          <FixturePreviewCardFoil
            fixture={selectedFixture}
            ceiling={selectedCeiling}
            variant="desktop"
            deadlineLabel={deadlineFormatted}
            tableMax={tableMaxPoints}
          />

          <div className="mt-2">
            <ResultsCarousel
              predictions={lastGw.predictions}
              gameweek={lastGw.gameweek}
              isLoading={lastGw.isLoading}
            />
          </div>
        </div>

        <DashboardSidebar ledger={ledger} ledgerFooter={ledgerFooter} ledgerLoading={ledgerLoading} leagues={leagues} />
      </div>

      <div className="flex flex-col gap-4 px-4 pb-6 pt-4 lg:hidden">
        {showDeadlineCountdown && (
          <p className="text-sm text-brand-amber">{timeDisplay} to deadline</p>
        )}
        <div className="flex flex-col gap-1">
          <p className="font-outfit text-xs uppercase tracking-[0.14em] text-brand-teal">
            {fixturesLoading ? 'Loading your gameweek' : `${filedCount} of ${total} filed`}
          </p>
          <span className="text-caption text-text-secondary">{openLine}</span>
        </div>

        <div className="relative h-1 overflow-hidden rounded-full bg-surface-track">
          <div
            className="absolute inset-0 rounded-full bg-brand-teal-mid"
            style={{ width: `${progressPct}%` }}
          />
        </div>

        <div className="flex flex-col gap-2">
          <KickerLabel>This gameweek</KickerLabel>
          {fixturesLoading ? (
            <LoadingState compact message="Loading fixtures..." />
          ) : (
            <StationRail
              stations={stations}
              variant="mobile"
              onPrev={selectPrev}
              onNext={selectNext}
              canPrev={canSelectPrev}
              canNext={canSelectNext}
            />
          )}
        </div>

        <FixturePreviewCardFoil
          fixture={selectedFixture}
          ceiling={selectedCeiling}
          variant="mobile"
          deadlineLabel={deadlineFormatted}
          tableMax={tableMaxPoints}
        />

        <button
          type="button"
          onClick={() => setSheetOpen(true)}
          className="flex min-h-11 items-center justify-between rounded-lg border border-border-card bg-surface-card px-4 py-3 text-sm text-text-secondary"
        >
          Ledger, chips &amp; rivals
          <span className="font-outfit text-xs text-brand-teal">VIEW ›</span>
        </button>
      </div>

      <DashboardMobileSheet
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
        ledger={ledger}
        ledgerFooter={ledgerFooter}
        ledgerLoading={ledgerLoading}
        leagues={leagues}
      />
    </div>
  );
}
