import { useEffect, useState } from 'react';
import { Ticket } from '@phosphor-icons/react';
import SlotBar from '../components/ui/SlotBar';
import LoadingState from '../components/common/LoadingState';
import LeagueHome from '../components/leagues/LeagueHome';
import LeagueManageView from '../components/leagues/LeagueManageView';
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
import { useNextMatch } from '../hooks/useNextMatch';
import { ordinal, leagueTone, standingsNeighbors, moveSince, buildPodiumNote } from '../utils/leagueStats';
import leagueAPI from '../services/api/leagueAPI';
import { DEMO_LEAGUES, getDemoLeaguePack } from '../components/leagues/leaguesDemoData';

const DETAIL_TABS = [
  { id: 'overview', label: 'Overview' },
  { id: 'grid', label: 'Form book' },
];

const MANAGE_TAB = { id: 'manage', label: 'Manage' };

const PREVIEW_BTN =
  'shrink-0 rounded-7 border px-3 py-1.5 font-outfit text-caption tracking-wide transition-colors';

export default function LeaguesPage() {
  const { myLeagues, isLoading, createLeague, refreshMyLeagues } = useLeagues();
  const [selected, setSelected] = useState(null);
  const [previewMode, setPreviewMode] = useState(false);
  const { timeDisplay, isLive } = useNextMatch();

  const deadline =
    timeDisplay && !isLive && timeDisplay !== 'Loading...' && timeDisplay !== 'No matches'
      ? timeDisplay
      : undefined;

  const leagues = previewMode ? DEMO_LEAGUES : myLeagues;
  const best = leagues.reduce((a, b) => ((b.position ?? Infinity) < (a?.position ?? Infinity) ? b : a), null);

  const togglePreview = () => {
    setPreviewMode((v) => !v);
    setSelected(null);
  };

  const openLeague = (league) => setSelected(league);

  const backToHome = () => setSelected(null);

  const previewButtonClass = `${PREVIEW_BTN} ${
    previewMode ? 'border-brand-amber/50 text-brand-amber' : 'border-border-card text-text-muted-3 hover:text-brand-teal'
  }`;

  const joinCreate = {
    onJoin: async (code) => {
      await leagueAPI.joinLeague(code);
      setPreviewMode(false);
      refreshMyLeagues();
    },
    onCreate: async (name) => {
      await createLeague({ name, isPrivate: true, firstGameweek: 1 });
      setPreviewMode(false);
    },
  };

  return (
    <div className="flex flex-col animate-rise-in md:h-[calc(100vh-var(--shell-nav-h))] md:overflow-hidden">
      {selected ? (
        <LeagueDetailView
          key={selected.id}
          overview={selected}
          onBack={backToHome}
          canManage={!!selected.isAdmin && !previewMode}
          onUpdated={(patch) => {
            setSelected((current) => (current ? { ...current, ...patch } : current));
            refreshMyLeagues();
          }}
          onDeleted={() => {
            setSelected(null);
            refreshMyLeagues();
          }}
          deadline={deadline}
          previewMode={previewMode}
          onTogglePreview={togglePreview}
          previewButtonClass={previewButtonClass}
        />
      ) : (
        <>
          <div className="hidden md:block">
            <SlotBar
              kicker="LEAGUES"
              right={leagues.length ? `${leagues.length} league${leagues.length === 1 ? '' : 's'} · best ${ordinal(best?.position)}` : undefined}
              deadline={deadline}
              trailing={
                <button onClick={togglePreview} className={previewButtonClass}>
                  {previewMode ? 'EXIT PREVIEW' : 'PREVIEW EXAMPLE DATA'}
                </button>
              }
            />
          </div>

          <div className="flex items-center justify-between gap-2 px-4 pt-4 md:hidden">
            <span className="font-outfit text-3xs tracking-widest text-brand-teal">LEAGUES</span>
            <button
              onClick={togglePreview}
              aria-label="Toggle preview with example data"
              className={`rounded-9 border p-2.5 ${previewMode ? 'border-brand-amber/50 text-brand-amber' : 'border-border-card text-text-muted-3'}`}
            >
              <Ticket size={14} />
            </button>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto">
            <LeagueHome
              myLeagues={leagues}
              isLoading={!previewMode && isLoading}
              onOpen={openLeague}
              onPreview={() => setPreviewMode(true)}
              previewMode={previewMode}
              {...joinCreate}
            />
          </div>
        </>
      )}
    </div>
  );
}

function LeagueDetailView({ overview, onBack, canManage, onUpdated, onDeleted, deadline, previewMode, onTogglePreview, previewButtonClass }) {
  const demoPack = previewMode ? getDemoLeaguePack(overview.id) : null;
  const lg = useLeagueDetail(previewMode ? null : overview.id, overview, demoPack);
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

  const tabs = canManage ? [...DETAIL_TABS, MANAGE_TAB] : DETAIL_TABS;

  const setTab = (id) => {
    if (id === 'manage' && !canManage) return;
    lg.setActiveTab(id);
  };

  useEffect(() => {
    if (!canManage && lg.activeTab === 'manage') lg.setActiveTab('overview');
  }, [canManage, lg.activeTab, lg.setActiveTab]);

  const openInFormBook = (username) => {
    lg.setActiveTab('grid');
    lg.setSel({ type: 'member', id: username });
    lg.setPodiumExpand(null);
  };

  const slotRight = lg.you
    ? `${overview.name} · ${ordinal(lg.you.position)} of ${lg.standings.length}`
    : overview.name;

  if (lg.loading) {
    return (
      <div className="flex min-h-0 flex-1 flex-col">
        <SlotBar kicker="ALL LEAGUES" onBack={onBack} deadline={deadline} />
        <LoadingState message="Loading league…" />
      </div>
    );
  }

  const memberCountLabel = `${lg.standings.length} member${lg.standings.length === 1 ? '' : 's'}`;

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="hidden md:block">
        <SlotBar
          kicker="ALL LEAGUES"
          onBack={onBack}
          tabs={tabs}
          activeTab={lg.activeTab}
          onTabChange={setTab}
          right={slotRight}
          deadline={deadline}
          trailing={
            <button onClick={onTogglePreview} className={previewButtonClass}>
              {previewMode ? 'EXIT PREVIEW' : 'PREVIEW EXAMPLE DATA'}
            </button>
          }
        />
      </div>

      <div className="flex flex-col gap-3 px-4 pt-4 md:hidden">
        {lg.activeTab === 'manage' ? (
          <div className="flex items-start gap-3">
            <button
              onClick={onBack}
              aria-label="Back to all leagues"
              className="flex size-11 shrink-0 items-center justify-center rounded-11 border border-border-control bg-surface-card-4/60 text-sm text-text-secondary"
            >
              &#8249;
            </button>
            <div className="flex min-w-0 flex-1 flex-col gap-[5px]">
              <h2 className="font-dmSerif text-2xl leading-[1.15] text-text-primary">Manage</h2>
              <span className="text-xs leading-[1.6] text-text-muted-2 [text-wrap:pretty]">
                Invite people, keep the roster, or close this league. Scoring and privacy were set when it was created.
              </span>
            </div>
          </div>
        ) : (
          <LeagueMasthead
            overview={overview}
            you={lg.you}
            tone={tone}
            memberCount={memberCountLabel}
            neighbours={neighbours}
            move={move}
            onBack={onBack}
          />
        )}
        <div className="flex items-center gap-2">
          <div className="flex min-w-0 flex-1 rounded-11 border border-border-card bg-surface-card-4 p-0.5">
            {tabs.map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`min-h-10 flex-1 rounded-sm font-outfit text-2xs tracking-widest ${
                  lg.activeTab === t.id ? 'bg-surface-nav-active text-brand-teal' : 'text-text-muted-2'
                }`}
              >
                {t.label.toUpperCase()}
              </button>
            ))}
          </div>
          <button
            onClick={onTogglePreview}
            aria-label="Toggle preview with example data"
            className={`shrink-0 rounded-9 border p-2.5 ${previewMode ? 'border-brand-amber/50 text-brand-amber' : 'border-border-card text-text-muted-3'}`}
          >
            <Ticket size={14} />
          </button>
        </div>
      </div>

      {lg.activeTab === 'overview' ? (
        <>
          <div className="hidden min-h-0 flex-1 md:grid md:grid-cols-[minmax(0,1fr)_24rem]">
            <div className="flex min-h-0 min-w-0 flex-col gap-3.5 overflow-y-auto px-6 py-5">
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
            <ActivityFeed feed={lg.feed} className="min-h-0 border-l border-border-hairline bg-surface-bar p-5" />
          </div>

          <div className="flex flex-col gap-3 px-4 pb-6 pt-3 md:hidden">
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
            <ActivityFeed feed={lg.feed} className="rounded-16 border border-border-base bg-surface-card p-3.5" />
          </div>
        </>
      ) : lg.activeTab === 'manage' && canManage ? (
        <LeagueManageView
          overview={overview}
          onUpdated={onUpdated}
          onDeleted={onDeleted}
        />
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
            currentGameweek={lg.currentGameweek}
            settledGws={lg.settledGws}
            leagueName={overview.name}
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
              currentGameweek={lg.currentGameweek}
              settledGws={lg.settledGws}
            />
          </div>
        </>
      )}
    </div>
  );
}
