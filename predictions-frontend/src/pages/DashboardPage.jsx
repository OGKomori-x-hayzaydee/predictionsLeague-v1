import SlotBar from '../components/ui/SlotBar';
import KickerLabel from '../components/ui/KickerLabel';
import StationRail from '../components/dashboard/StationRail';
import SpotlightCard from '../components/dashboard/SpotlightCard';
import DashboardSidebar from '../components/dashboard/DashboardSidebar';
import LoadingState from '../components/common/LoadingState';
import { useFixtures } from '../hooks/useFixtures';
import { useNextMatch } from '../hooks/useNextMatch';

export default function DashboardPage() {
  const { fixtures, stats, isLoading } = useFixtures();
  const { nextMatch, timeDisplay, isLive } = useNextMatch();

  const total = stats?.total ?? fixtures.length;
  const filed = stats?.predicted ?? fixtures.filter((f) => f.predicted).length;
  const progressPct = total > 0 ? Math.round((filed / total) * 100) : 0;

  return (
    <div className="animate-rise-in">
      <SlotBar kicker="Season" />

      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-8 md:grid-cols-[1fr_320px] md:px-6">
        <div className="space-y-6">
          <div>
            <h1 className="font-dmSerif text-2xl text-text-primary md:text-3xl">
              {isLoading ? 'Loading your gameweek…' : `${filed} of ${total} filed`}
            </h1>
            <div className="relative mt-3 h-2 overflow-hidden rounded-full bg-surface-card-3">
              <div
                className="h-full rounded-full bg-gradient-to-r from-brand-teal-mid to-brand-indigo transition-all"
                style={{ width: `${progressPct}%` }}
              />
            </div>
          </div>

          <div>
            <KickerLabel as="div" className="mb-2">This gameweek</KickerLabel>
            {isLoading ? <LoadingState message="Loading fixtures..." /> : <StationRail fixtures={fixtures} />}
          </div>

          <SpotlightCard match={nextMatch} timeDisplay={timeDisplay} isLive={isLive} />
        </div>

        <DashboardSidebar />
      </div>
    </div>
  );
}
