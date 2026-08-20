import { useState } from 'react';
import SlotBar from '../components/ui/SlotBar';
import LoadingState from '../components/common/LoadingState';
import LeagueHome from '../components/leagues/LeagueHome';
import LeagueMasthead from '../components/leagues/LeagueMasthead';
import Podium from '../components/leagues/Podium';
import PositionChart from '../components/leagues/PositionChart';
import HeadToHeadCarousel from '../components/leagues/HeadToHeadCarousel';
import RecordsGrid from '../components/leagues/RecordsGrid';
import ActivityFeed from '../components/leagues/ActivityFeed';
import FormBookGrid from '../components/leagues/FormBookGrid';
import FormBookMobile from '../components/leagues/FormBookMobile';
import useLeagues from '../hooks/useLeagues';
import useLeagueDetail from '../hooks/useLeagueDetail';
import { ordinal, leagueTone, standingsNeighbors, moveSince, buildPodiumNote } from '../utils/leagueStats';
import leagueAPI from '../services/api/leagueAPI';

const DETAIL_TABS = [
  { id: 'overview', label: 'Overview' },
  { id: 'grid', label: 'Form book' },
];

export default function LeaguesPage() {
  const { myLeagues, isLoading, joinLeague, createLeague, refreshMyLeagues } = useLeagues();
  const [selected, setSelected] = useState(null);

  if (selected) {
    return <LeagueDetailView overview={selected} onBack={() => setSelected(null)} />;
  }

  const best = myLeagues.reduce((a, b) => ((b.position ?? Infinity) < (a?.position ?? Infinity) ? b : a), null);

  return (
    <div className="animate-rise-in">
      <SlotBar
        kicker="LEAGUES"
        right={myLeagues.length ? `${myLeagues.length} league${myLeagues.length === 1 ? '' : 's'} · best ${ordinal(best?.position)}` : undefined}
      />
      <LeagueHome
        myLeagues={myLeagues}
        isLoading={isLoading}
        onOpen={setSelected}
        onJoin={async (code) => {
          await leagueAPI.joinLeague(code);
          refreshMyLeagues();
        }}
        onCreate={async (name) => {
          await createLeague({ name, isPrivate: true, firstGameweek: 1 });
        }}
      />
    </div>
  );
}

function LeagueDetailView({ overview, onBack }) {
  const lg = useLeagueDetail(overview.id, overview);
  const tone = leagueTone(overview.id);
  const neighbours = standingsNeighbors(lg.standings, lg.you);
  const move = moveSince(lg.history, lg.you?.username);
  const podiumLabel = lg.latestSettledGw ? `GAMEWEEK ${lg.latestSettledGw} · LAST SETTLED WEEK` : 'GAMEWEEK PODIUM';
  const podiumNote = buildPodiumNote({
    latestSettledGw: lg.latestSettledGw,
    podium: lg.podium,
    you: lg.you,
    youGwTotal: lg.youGwTotal,
    youGwRank: lg.youGwRank,
  });

  const openInFormBook = (username) => {
    lg.setActiveTab('grid');
    lg.setSel({ type: 'member', id: username });
    lg.setPodiumExpand(null);
  };

  if (lg.loading) {
    return (
      <div className="animate-rise-in">
        <SlotBar kicker="ALL LEAGUES" onBack={onBack} />
        <LoadingState message="Loading league…" />
      </div>
    );
  }

  const memberCountLabel = `${lg.standings.length} member${lg.standings.length === 1 ? '' : 's'}`;

  return (
    <div className="animate-rise-in">
      <div className="hidden md:block">
        <SlotBar
          kicker="ALL LEAGUES"
          onBack={onBack}
          tabs={DETAIL_TABS}
          activeTab={lg.activeTab}
          onTabChange={lg.setActiveTab}
          right={lg.you ? `${overview.name} · ${ordinal(lg.you.position)} of ${lg.standings.length}` : overview.name}
        />
      </div>

      <div className="flex flex-col gap-3 px-4 pt-4 md:hidden">
        <LeagueMasthead
          overview={overview}
          you={lg.you}
          tone={tone}
          memberCount={memberCountLabel}
          neighbours={neighbours}
          move={move}
          onBack={onBack}
        />
        <div className="flex rounded-11 border border-border-card bg-surface-card-4 p-[3px]">
          {DETAIL_TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => lg.setActiveTab(t.id)}
              className={`min-h-[38px] flex-1 rounded-8 font-mono text-[10.5px] tracking-[0.1em] ${
                lg.activeTab === t.id ? 'bg-surface-nav-active text-brand-teal' : 'text-text-muted-2'
              }`}
            >
              {t.label.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {lg.activeTab === 'overview' ? (
        <>
          <div className="hidden md:grid md:min-h-0 md:grid-cols-[1fr_322px]">
            <div className="flex min-w-0 flex-col gap-[14px] overflow-y-auto p-[20px_24px_24px]">
              <LeagueMasthead overview={overview} you={lg.you} tone={tone} memberCount={memberCountLabel} neighbours={neighbours} move={move} />
              <Podium
                podium={lg.podium}
                label={podiumLabel}
                note={podiumNote}
                bestCall={lg.bestCall}
                expandedUsername={lg.podiumExpand}
                onToggleExpand={(u) => lg.setPodiumExpand(lg.podiumExpand === u ? null : u)}
                onOpenInFormBook={openInFormBook}
              />
              <HeadToHeadCarousel rivals={lg.rivals} vsIdx={lg.vsIdx} setVsIdx={lg.setVsIdx} vsVariant={lg.vsVariant} setVsVariant={lg.setVsVariant} />
              <PositionChart series={lg.positionSeries} line={lg.positionLine} gws={lg.settledGws} moveLabel={move.label} moveTone={move.tone} tone={tone.var} />
              <RecordsGrid records={lg.records} />
            </div>
            <ActivityFeed feed={lg.feed} className="border-l border-border-hairline bg-surface-bar p-5" />
          </div>

          <div className="flex flex-col gap-[13px] px-4 pb-6 pt-3 md:hidden">
            <PositionChart series={lg.positionSeries} line={lg.positionLine} gws={lg.settledGws} moveLabel={move.label} moveTone={move.tone} tone={tone.var} />
            <Podium
              podium={lg.podium}
              label={podiumLabel}
              note={podiumNote}
              bestCall={lg.bestCall}
              expandedUsername={lg.podiumExpand}
              onToggleExpand={(u) => lg.setPodiumExpand(lg.podiumExpand === u ? null : u)}
              onOpenInFormBook={openInFormBook}
            />
            <RecordsGrid records={lg.records} />
            <HeadToHeadCarousel rivals={lg.rivals} vsIdx={lg.vsIdx} setVsIdx={lg.setVsIdx} vsVariant={lg.vsVariant} setVsVariant={lg.setVsVariant} />
            <ActivityFeed feed={lg.feed} className="rounded-16 border border-border-base bg-surface-card p-[14px_12px]" />
          </div>
        </>
      ) : (
        <>
          <FormBookGrid
            formBook={lg.formBook}
            sel={lg.sel}
            setSel={lg.setSel}
            mode={lg.mode}
            setMode={lg.setMode}
            gwOptions={lg.gwOptions}
            selectedGw={lg.selectedGw}
            setSelectedGw={lg.setSelectedGw}
          />
          <div className="px-4 pb-6 pt-3 md:hidden">
            <FormBookMobile
              formBook={lg.formBook}
              sel={lg.sel}
              setSel={lg.setSel}
              mobGrid={lg.mobGrid}
              setMobGrid={lg.setMobGrid}
              gwOptions={lg.gwOptions}
              selectedGw={lg.selectedGw}
              setSelectedGw={lg.setSelectedGw}
            />
          </div>
        </>
      )}
    </div>
  );
}
