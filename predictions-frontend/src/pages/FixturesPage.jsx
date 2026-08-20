import { useState, useEffect, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import SlotBar from '../components/ui/SlotBar';
import LoadingState from '../components/common/LoadingState';
import FixtureEditor from '../components/fixtures/FixtureEditor';
import FixtureSlip from '../components/fixtures/FixtureSlip';
import FixtureReelStrip from '../components/fixtures/FixtureReelStrip';
import FilingCeremony from '../components/fixtures/FilingCeremony';
import AiTeamReadPanel from '../components/fixtures/AiTeamReadPanel';
import useFixtureSpine from '../hooks/useFixtureSpine';
import useDashboardData from '../hooks/useDashboardData';
import { useNextMatch } from '../hooks/useNextMatch';
import { useChipManagement } from '../context/ChipManagementContext';
import userPredictionsAPI from '../services/api/userPredictionsAPI';
import { calculateCeilingPoints } from '../utils/pointsCalculation';

function formatKickoff(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return '';
  const day = d.toLocaleDateString(undefined, { weekday: 'short' });
  const time = d.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit', hour12: false });
  return `${day} ${time}`;
}

const EMPTY_DRAFT = { homeScore: 0, awayScore: 0, homeScorers: [], awayScorers: [], chip: null };

const MIN_CENTER_MS = 520;
const STAMP_HOLD_MS = 980;
const RETURN_MS = 700;

/**
 * Fixtures Page — Complete recreation of Spine.dc.html lines 319-751.
 */
export default function FixturesPage() {
  const queryClient = useQueryClient();
  const { getMatchChips } = useChipManagement();
  const matchChips = getMatchChips();

  const {
    fixtures,
    stations,
    selectedIndex,
    selectedFixture,
    selectedCeiling,
    selectPrev,
    selectNext,
    canSelectPrev,
    canSelectNext,
    isLoading,
    isError,
    error,
  } = useFixtureSpine();

  const { essentialData } = useDashboardData();
  const { timeDisplay, isLive } = useNextMatch();

  const [draft, setDraft] = useState(EMPTY_DRAFT);
  const [editorOpen, setEditorOpen] = useState(false);
  const [aiOpen, setAiOpen] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [filePhase, setFilePhase] = useState('idle');
  const fileTimersRef = useRef([]);

  useEffect(() => {
    return () => fileTimersRef.current.forEach(clearTimeout);
  }, []);

  useEffect(() => {
    const existing = selectedFixture?.userPrediction;
    setDraft({
      homeScore: existing?.homeScore ?? 0,
      awayScore: existing?.awayScore ?? 0,
      homeScorers: existing?.homeScorers ?? [],
      awayScorers: existing?.awayScorers ?? [],
      chip: existing?.chips?.[0] ?? null,
    });
    setEditorOpen(false);
    setSubmitError(null);
    fileTimersRef.current.forEach(clearTimeout);
    fileTimersRef.current = [];
    setFilePhase('idle');
  }, [selectedFixture?.id]);

  const currentGameweek = essentialData?.season?.currentGameweek;
  const deadlineFormatted = essentialData?.season?.deadlineFormatted;
  const showDeadlineCountdown =
    !!timeDisplay && !isLive && timeDisplay !== 'Loading...' && timeDisplay !== 'No matches';
  const gameweekLabel = currentGameweek ? `GW${currentGameweek}` : 'GW24';

  const isPredicted = !!selectedFixture?.predicted;
  const filedNow = isPredicted && !editorOpen;
  const showEditor = !filedNow;

  const liveCeiling = calculateCeilingPoints({
    homeScore: draft.homeScore,
    awayScore: draft.awayScore,
    homeScorers: draft.homeScorers,
    awayScorers: draft.awayScorers,
    chips: draft.chip ? [draft.chip] : [],
  });
  const activePrediction = filedNow ? selectedFixture.userPrediction : draft;
  const activeCeiling = filedNow ? selectedCeiling : liveCeiling;

  const handleSubmit = async () => {
    if (!selectedFixture || filePhase !== 'idle') return;
    setSubmitting(true);
    setSubmitError(null);
    setFilePhase('center');

    const minCenter = new Promise((resolve) => {
      fileTimersRef.current.push(setTimeout(resolve, MIN_CENTER_MS));
    });

    try {
      const [result] = await Promise.all([
        userPredictionsAPI.makePrediction(
          {
            homeScore: draft.homeScore,
            awayScore: draft.awayScore,
            homeScorers: (draft.homeScorers || []).filter(Boolean),
            awayScorers: (draft.awayScorers || []).filter(Boolean),
            chips: draft.chip ? [draft.chip] : [],
          },
          selectedFixture,
          !!selectedFixture.predicted
        ),
        minCenter,
      ]);

      if (!result.success) {
        setFilePhase('idle');
        setSubmitError(result.error?.message || 'Could not file this prediction.');
        return;
      }

      queryClient.invalidateQueries({ queryKey: ['user-predictions'] });
      queryClient.invalidateQueries({ queryKey: ['hybrid-fixtures'] });
      setFilePhase('stamp');
      fileTimersRef.current.push(
        setTimeout(() => {
          setFilePhase('return');
        }, STAMP_HOLD_MS)
      );
      fileTimersRef.current.push(
        setTimeout(() => {
          setFilePhase('idle');
          setEditorOpen(false);
        }, STAMP_HOLD_MS + RETURN_MS)
      );
    } catch (err) {
      setFilePhase('idle');
      setSubmitError(err?.message || 'Could not file this prediction.');
    } finally {
      setSubmitting(false);
    }
  };

  const statusPill = selectedFixture
    ? isPredicted
      ? { label: 'FILED', bg: '#0f766e26', border: '#14b8a666', fg: '#5eead4' }
      : { label: 'OPEN', bg: '#78350f26', border: '#b4530966', fg: '#fbbf24' }
    : undefined;

  const editorProps = {
    fixture: selectedFixture,
    draft,
    onChangeHomeScore: (v) => setDraft((d) => ({ ...d, homeScore: v })),
    onChangeAwayScore: (v) => setDraft((d) => ({ ...d, awayScore: v })),
    onChangeHomeScorers: (v) => setDraft((d) => ({ ...d, homeScorers: v })),
    onChangeAwayScorers: (v) => setDraft((d) => ({ ...d, awayScorers: v })),
    onChangeChip: (v) => setDraft((d) => ({ ...d, chip: v })),
    matchChips,
    aiOpen,
    onToggleAi: () => setAiOpen((v) => !v),
    ceiling: liveCeiling,
    onSubmit: handleSubmit,
    submitting,
    error: submitError,
  };

  return (
    <div className="relative min-h-[calc(100vh-56px)] overflow-hidden animate-rise-in" style={{ background: 'radial-gradient(58% 64% at 50% 0%, #1a2740 0%, #0a0f1a 55%, #05070c 100%)' }}>
      {/* Top SlotBar */}
      <div className="hidden md:block">
        <SlotBar
          kicker="THE REEL"
          reelNav={
            fixtures.length
              ? {
                  counter: `${selectedIndex + 1} / ${fixtures.length}`,
                  title: selectedFixture ? `${selectedFixture.homeTeam} v ${selectedFixture.awayTeam}` : '',
                  canPrev: canSelectPrev,
                  canNext: canSelectNext,
                  onPrev: selectPrev,
                  onNext: selectNext,
                  status: statusPill,
                }
              : undefined
          }
          right={`${stations.filter((s) => s.predicted).length} of ${fixtures.length} filed`}
          deadline={showDeadlineCountdown ? timeDisplay : undefined}
        />
      </div>

      {isLoading && <LoadingState message="Loading fixtures..." />}

      {!isLoading && isError && (
        <p className="px-6 py-10 text-center text-sm text-text-muted-2">
          Couldn&apos;t load fixtures{error?.message ? `: ${error.message}` : '.'}
        </p>
      )}

      {!isLoading && !isError && !selectedFixture && (
        <p className="px-6 py-10 text-center text-sm text-text-muted-2">No fixtures to predict right now.</p>
      )}

      {!isLoading && !isError && selectedFixture && (
        <>
          {/* Desktop Layout */}
          <div
            className={`hidden md:grid md:items-start transition-[grid-template-columns] duration-300 ${
              showEditor ? 'md:grid-cols-[1fr_380px]' : 'md:grid-cols-1'
            }`}
          >
            {/* Center Area */}
            <div className="flex min-w-0 flex-col gap-6 px-8 py-6 pb-28">
              {showEditor ? (
                <FixtureEditor {...editorProps} />
              ) : (
                /* Resting Filed State (Picture 3) */
                <div className="mx-auto flex w-full max-w-[640px] flex-col items-center gap-6 py-4">
                  <FixtureSlip
                    fixture={selectedFixture}
                    prediction={activePrediction}
                    filed={true}
                    ceiling={activeCeiling}
                    variant="resting"
                    onEdit={() => setEditorOpen(true)}
                    gameweekLabel={gameweekLabel}
                    deadlineLabel={deadlineFormatted}
                  />

                  <div className="w-full">
                    <AiTeamReadPanel
                      fixture={selectedFixture}
                      open={aiOpen}
                      onToggle={() => setAiOpen((v) => !v)}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Right Live Preview Slip (Picture 5 - only when editing) */}
            {showEditor && (
              <div className="sticky top-6 flex flex-col gap-4 pr-6 pt-6">
                <FixtureSlip
                  fixture={selectedFixture}
                  prediction={activePrediction}
                  filed={isPredicted}
                  ceiling={activeCeiling}
                  variant="rail"
                  onFile={handleSubmit}
                  gameweekLabel={gameweekLabel}
                  deadlineLabel={deadlineFormatted}
                />
              </div>
            )}
          </div>

          {/* Sticky Bottom Reel Bar (Desktop) */}
          <div className="hidden md:block fixed inset-x-0 bottom-0 z-30 border-t border-[#16203180] bg-[#050b14cc] px-6 py-3 backdrop-blur-md">
            <FixtureReelStrip stations={stations} />
          </div>

          {/* Mobile Layout */}
          <div className="flex flex-col gap-4 px-4 pb-8 pt-4 md:hidden">
            <div className="flex items-center justify-between gap-2.5">
              <button
                type="button"
                onClick={selectPrev}
                disabled={!canSelectPrev}
                aria-label="Previous fixture"
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-9 border border-border-control bg-surface-card-4/70 text-text-muted-1 disabled:opacity-30"
              >
                &#8249;
              </button>
              <div className="flex flex-col items-center gap-0.5">
                <span className="font-mono text-[10.5px] tracking-[0.14em] text-brand-teal">
                  {selectedIndex + 1} / {fixtures.length}
                </span>
                <span className="font-mono text-[10px] tracking-[0.1em] text-text-muted-1">
                  {[formatKickoff(selectedFixture.date), selectedFixture.venue].filter(Boolean).join(' · ')}
                </span>
              </div>
              <button
                type="button"
                onClick={selectNext}
                disabled={!canSelectNext}
                aria-label="Next fixture"
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-9 border border-border-control bg-surface-card-4/70 text-text-muted-1 disabled:opacity-30"
              >
                &#8250;
              </button>
            </div>

            {showEditor ? (
              <FixtureEditor {...editorProps} />
            ) : (
              <div className="flex flex-col gap-4">
                <FixtureSlip
                  fixture={selectedFixture}
                  prediction={activePrediction}
                  filed={true}
                  ceiling={activeCeiling}
                  variant="resting"
                  onEdit={() => setEditorOpen(true)}
                  gameweekLabel={gameweekLabel}
                  deadlineLabel={deadlineFormatted}
                />
                <AiTeamReadPanel
                  fixture={selectedFixture}
                  open={aiOpen}
                  onToggle={() => setAiOpen((v) => !v)}
                />
              </div>
            )}
          </div>
        </>
      )}

      {/* Spotlight Filing Ceremony */}
      <FilingCeremony
        phase={filePhase}
        fixture={selectedFixture}
        prediction={draft}
        ceiling={liveCeiling}
        gameweekLabel={gameweekLabel}
      />
    </div>
  );
}
