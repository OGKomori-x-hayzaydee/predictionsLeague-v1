import { useState } from 'react';
import SlotBar from '../components/ui/SlotBar';
import KickerLabel from '../components/ui/KickerLabel';
import StatTile from '../components/ui/StatTile';
import StationRail from '../components/dashboard/StationRail';
import FixturePreviewCard from '../components/dashboard/FixturePreviewCard';
import DashboardSidebar from '../components/dashboard/DashboardSidebar';
import DashboardMobileSheet from '../components/dashboard/DashboardMobileSheet';
import LoadingState from '../components/common/LoadingState';
import useFixtureSpine from '../hooks/useFixtureSpine';
import useDashboardData from '../hooks/useDashboardData';
import { useNextMatch } from '../hooks/useNextMatch';

export default function DashboardPage() {
  const [aiOpen, setAiOpen] = useState(true);
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

  const { essentialData, ledger, ledgerGameweek, ledgerTotal, ledgerLoading } = useDashboardData();
  const { timeDisplay, isLive } = useNextMatch();

  const currentGameweek = essentialData?.season?.currentGameweek;
  const deadlineFormatted = essentialData?.season?.deadlineFormatted;
  const showDeadlineCountdown =
    !!timeDisplay && !isLive && timeDisplay !== 'Loading...' && timeDisplay !== 'No matches';

  const stillOpen = Math.max(total - filedCount, 0);
  const openLine = deadlineFormatted
    ? `${stillOpen} still open · deadline ${deadlineFormatted}`
    : `${stillOpen} still open`;
  const progressPct = total > 0 ? Math.round((filedCount / total) * 100) : 0;
  const ledgerFooter = ledgerGameweek ? `GW${ledgerGameweek} total ${ledgerTotal} pts` : null;

  return (
    <div className="animate-rise-in">
      <div className="hidden md:block">
        <SlotBar
          kicker={currentGameweek ? `Gameweek ${currentGameweek}` : 'Gameweek'}
          right={`${filedCount} of ${total} filed`}
          deadline={showDeadlineCountdown ? timeDisplay : undefined}
        />
      </div>

      {/* Desktop — foundation spec §5.3, dash grid 1fr 320px */}
      <div className="hidden md:grid md:grid-cols-[1fr_320px] md:items-stretch">
        <div className="flex min-w-0 flex-col gap-0 px-6 pb-6 pt-5">
          <div className="flex items-end justify-between gap-6">
            <div className="flex min-w-0 flex-1 flex-col gap-1.5">
              <h1 className="font-dmSerif text-4xl text-text-primary">
                {fixturesLoading ? 'Loading your gameweek…' : `${filedCount} of ${total} filed`}
              </h1>
              <span className="text-sm text-text-muted-1">{openLine}</span>
            </div>
            <div className="flex flex-none flex-col items-end gap-1.5">
              <KickerLabel as="span" className="tracking-[0.13em] text-text-muted-3">
                Max on the table
              </KickerLabel>
              <span className="font-dmSerif text-[29px] leading-none text-brand-amber">
                {tableMaxPoints}
                <span className="text-sm text-[#8a7a4a]"> pts</span>
              </span>
            </div>
          </div>

          <div className="relative mt-4 h-[5px] overflow-hidden rounded-full bg-surface-card-3">
            <div
              className="absolute inset-0 rounded-full bg-gradient-to-r from-brand-teal-mid to-brand-indigo-mid transition-all"
              style={{ width: `${progressPct}%` }}
            />
            <div className="absolute top-0 bottom-0 w-[60px] bg-gradient-to-r from-transparent via-white/30 to-transparent animate-[sweep_3.4s_linear_infinite]" />
          </div>

          <div className="mt-[26px]">
            {fixturesLoading ? (
              <LoadingState message="Loading fixtures..." />
            ) : (
              <StationRail stations={stations} variant="desktop" />
            )}
          </div>

          <div className="mt-5">
            <FixturePreviewCard
              fixture={selectedFixture}
              ceiling={selectedCeiling}
              variant="desktop"
              deadlineLabel={deadlineFormatted}
            />
          </div>
        </div>

        <DashboardSidebar ledger={ledger} ledgerFooter={ledgerFooter} ledgerLoading={ledgerLoading} />
      </div>

      {/* Mobile — Spine.dc.html mobile dashboard lines 2215-2345 */}
      <div className="flex flex-col gap-4 px-4 pb-[26px] pt-4 md:hidden">
        <div className="flex flex-col gap-1">
          <h1 className="font-dmSerif text-[25px] leading-tight text-text-primary">
            {fixturesLoading ? 'Loading your gameweek…' : `${filedCount} of ${total} filed`}
          </h1>
          <span className="text-[12.5px] text-text-muted-1">{openLine}</span>
        </div>

        <div className="relative h-[5px] overflow-hidden rounded-full bg-surface-card-3">
          <div
            className="absolute inset-0 rounded-full bg-gradient-to-r from-brand-teal-mid to-brand-indigo-mid"
            style={{ width: `${progressPct}%` }}
          />
        </div>

        <StatTile
          label="Max on the table"
          value={
            <>
              {tableMaxPoints}
              <span className="ml-1 text-xs text-[#8a7a4a]">pts</span>
            </>
          }
          accent="var(--color-brand-amber)"
        />

        <div className="flex flex-col gap-2">
          <KickerLabel as="span" className="tracking-[0.14em] text-text-muted-4">
            This gameweek
          </KickerLabel>
          {fixturesLoading ? (
            <LoadingState message="Loading fixtures..." />
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

        <FixturePreviewCard
          fixture={selectedFixture}
          ceiling={selectedCeiling}
          variant="mobile"
          aiOpen={aiOpen}
          onToggleAi={() => setAiOpen((v) => !v)}
          deadlineLabel={deadlineFormatted}
        />

        <button
          onClick={() => setSheetOpen(true)}
          className="flex items-center justify-between rounded-md border border-border-card bg-surface-card/70 px-4 py-[13px] text-sm text-text-secondary"
        >
          Rivals, chips in hand &amp; last gameweek
          <span className="font-mono text-[11px] text-brand-teal">VIEW &rsaquo;</span>
        </button>
      </div>

      <DashboardMobileSheet
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
        ledger={ledger}
        ledgerFooter={ledgerFooter}
        ledgerLoading={ledgerLoading}
      />
    </div>
  );
}
