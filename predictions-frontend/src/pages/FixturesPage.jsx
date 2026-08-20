import { useState, useEffect, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import SlotBar from '../components/ui/SlotBar';
import LoadingState from '../components/common/LoadingState';
import FixtureEditor from '../components/fixtures/FixtureEditor';
import FixtureSlip from '../components/fixtures/FixtureSlip';
import FixtureReelStrip from '../components/fixtures/FixtureReelStrip';
import FloatingSlipCard from '../components/fixtures/FloatingSlipCard';
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

// Timings mirror the prototype's fileIt() exactly (script ~line 4139-4148):
// phase flips to "stamp" 520ms after filing starts, "return" 980ms after
// that, and "idle" 700ms after that.
const MIN_CENTER_MS = 520;
const STAMP_HOLD_MS = 980;
const RETURN_MS = 700;

/**
 * Fixtures Page — desktop editor with a corner-anchored live-preview slip
 * that morphs in place into the "FILED" ceremony (see FloatingSlipCard),
 * matching Spine.dc.html's buildReel() choreography instead of a detached
 * centered modal.
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
  // Optimistic "just filed" snapshot for the *currently open* fixture, so the
  // resting-slip reveal isn't gated behind the invalidated queries' network
  // round-trip — matching the prototype's instant local state flip.
  const [optimisticFiled, setOptimisticFiled] = useState(null);
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
    setOptimisticFiled(null);
    fileTimersRef.current.forEach(clearTimeout);
    fileTimersRef.current = [];
    setFilePhase('idle');
  }, [selectedFixture?.id]);

  const currentGameweek = essentialData?.season?.currentGameweek;
  const deadlineFormatted = essentialData?.season?.deadlineFormatted;
  const showDeadlineCountdown =
    !!timeDisplay && !isLive && timeDisplay !== 'Loading...' && timeDisplay !== 'No matches';
  const gameweekLabel = currentGameweek ? `GW${currentGameweek}` : 'GW24';

  const hasOptimisticFiling = optimisticFiled?.id === selectedFixture?.id;
  const isPredicted = !!selectedFixture?.predicted || hasOptimisticFiling;
  const filedNow = isPredicted && !editorOpen;
  const showEditor = !filedNow;

  const totalGoals = draft.homeScore + draft.awayScore;
  const hasLivePrediction = totalGoals > 0 || draft.chip;

  const liveCeiling = calculateCeilingPoints({
    homeScore: draft.homeScore,
    awayScore: draft.awayScore,
    homeScorers: draft.homeScorers,
    awayScorers: draft.awayScorers,
    chips: draft.chip ? [draft.chip] : [],
  });

  const restingPrediction = hasOptimisticFiling
    ? optimisticFiled.prediction
    : selectedFixture?.userPrediction;
  const restingCeiling = restingPrediction ? calculateCeilingPoints(restingPrediction) : 0;

  const activePrediction = filedNow ? restingPrediction : draft;
  const activeCeiling = filedNow ? restingCeiling : liveCeiling;

  // Drives the corner live-preview card: shown once there's something to
  // preview pre-filing, or for the whole non-idle filing sequence — matches
  // buildReel()'s `shown = (!filed && anyPicked) || phase !== "idle"`.
  const previewVisible = !isPredicted && hasLivePrediction;
  const railShown = previewVisible || filePhase !== 'idle';

  const handleSubmit = async () => {
    if (!selectedFixture || filePhase !== 'idle') return;
    setSubmitting(true);
    setSubmitError(null);
    setFilePhase('center');
    // Close the editor immediately (prototype's `fixEditOpen:false` at t=0) —
    // harmless pre-filing since `showEditor` stays true until `isPredicted`
    // flips, but it's what lets the resting slip + AI panel be the thing
    // revealed once the dim/card fade away at the end of the sequence.
    setEditorOpen(false);

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
        setEditorOpen(true);
        setSubmitError(result.error?.message || 'Could not file this prediction.');
        return;
      }

      queryClient.invalidateQueries({ queryKey: ['user-predictions'] });
      queryClient.invalidateQueries({ queryKey: ['hybrid-fixtures'] });
      // Flip the "filed" state and the ceremony's stamp phase in the same
      // tick, so the resting-slip branch mounts exactly as the stamp
      // appears — its AI panel's .98s-delayed slide-in then lands exactly
      // when the stamp begins fading (see STAMP_HOLD_MS below).
      setOptimisticFiled({ id: selectedFixture.id, prediction: { ...draft } });
      setFilePhase('stamp');
      fileTimersRef.current.push(
        setTimeout(() => {
          setFilePhase('return');
        }, STAMP_HOLD_MS)
      );
      fileTimersRef.current.push(
        setTimeout(() => {
          setFilePhase('idle');
        }, STAMP_HOLD_MS + RETURN_MS)
      );
    } catch (err) {
      setFilePhase('idle');
      setEditorOpen(true);
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
  };

  const buttonLabel = submitting || filePhase !== 'idle'
    ? 'Filing…'
    : isPredicted
      ? 'Filed · amend to re-file'
      : totalGoals === 0
        ? 'Review & file 0–0'
        : 'Review & file';

  // Only animate the AI panel's entrance right after an active filing
  // sequence (matches aiSlideAnimDesk/aiSlideAnimMob: "none" once idle so a
  // normal page load into an already-filed fixture doesn't replay it).
  const aiSlideStyleDesktop =
    filePhase === 'idle' ? undefined : { animation: 'slideFromBehind .5s ease .98s both' };
  const aiSlideStyleMobile =
    filePhase === 'idle' ? undefined : { animation: 'slideFromBehind .5s ease 1.5s both' };

  return (
    <div
      className="relative flex h-[calc(100vh-2.75rem)] flex-col overflow-hidden animate-rise-in"
      style={{ background: 'radial-gradient(58% 64% at 50% 0%, #1a2740 0%, #0a0f1a 55%, #05070c 100%)' }}
    >
      {/* Top SlotBar */}
      <div className="hidden md:block flex-none">
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
          {/* Desktop body — its own relative/overflow-hidden scope so the dim
              + floating card only ever cover this fixture's content, never
              the masthead/slotbar above it. */}
          <div className="relative hidden md:flex flex-1 min-h-0 flex-col overflow-hidden">
            <div
              className="flex flex-1 min-h-0 flex-col"
              style={{
                paddingRight: railShown ? '366px' : '0px',
                transition: 'padding-right .46s cubic-bezier(.4,0,.2,1)',
              }}
            >
              {/* Scrollable content */}
              <div className="flex-1 min-h-0 overflow-y-auto px-6 py-2">
                <div className="mx-auto flex w-full max-w-[76rem] flex-col items-center">
                  {showEditor ? (
                    <FixtureEditor {...editorProps} />
                  ) : (
                    /* Resting Filed State */
                    <div className="mx-auto flex w-full max-w-2xl flex-col items-center gap-4 py-2">
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

                      <div className="w-full" style={aiSlideStyleDesktop}>
                        <AiTeamReadPanel
                          fixture={selectedFixture}
                          open={aiOpen}
                          onToggle={() => setAiOpen((v) => !v)}
                          totalGoals={(activePrediction?.homeScore ?? 0) + (activePrediction?.awayScore ?? 0)}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Fixed Bottom Footer Dock (Button + Contained Reel Strip) */}
              <div className="flex flex-none flex-col gap-2.5 border-t border-[#16203180] bg-[#050b14cc] px-6 py-3 backdrop-blur-md">
                <div className="w-full max-w-[76rem] mx-auto flex flex-col gap-2.5">
                  {showEditor && (
                    <div className="flex flex-col items-center justify-center">
                      {submitError && <p className="mb-1 text-xs text-state-error">{submitError}</p>}
                      <button
                        type="button"
                        onClick={handleSubmit}
                        disabled={submitting || filePhase !== 'idle'}
                        className={`flex cursor-pointer items-center gap-2 rounded-full px-8 py-2.5 font-outfit text-sm font-semibold transition-all disabled:opacity-50 ${
                          isPredicted
                            ? 'border border-[#14b8a666] bg-[#0f766e44] text-[#5eead4] hover:bg-[#0f766e66]'
                            : 'bg-brand-indigo-mid text-white shadow-lg hover:bg-brand-indigo-hover'
                        }`}
                      >
                        {buttonLabel} &rarr;
                      </button>
                    </div>
                  )}
                  <FixtureReelStrip stations={stations} />
                </div>
              </div>
            </div>

            <FloatingSlipCard
              fixture={selectedFixture}
              prediction={filePhase !== 'idle' || previewVisible ? draft : restingPrediction}
              ceiling={filePhase !== 'idle' || previewVisible ? liveCeiling : restingCeiling}
              filed={isPredicted}
              phase={filePhase}
              visible={previewVisible}
              gameweekLabel={gameweekLabel}
            />
          </div>

          {/* Mobile Layout */}
          <div className="flex flex-1 flex-col gap-4 overflow-y-auto px-4 pb-8 pt-3 md:hidden">
            <div className="flex items-center justify-between gap-2.5">
              <button
                type="button"
                onClick={selectPrev}
                disabled={!canSelectPrev}
                aria-label="Previous fixture"
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-border-control bg-surface-card-4/70 text-text-muted-1 disabled:opacity-30"
              >
                &#8249;
              </button>
              <div className="flex flex-col items-center gap-0.5">
                <span className="font-mono text-xs tracking-wider text-brand-teal">
                  {selectedIndex + 1} / {fixtures.length}
                </span>
                <span className="font-mono text-xs tracking-wide text-text-muted-1">
                  {[formatKickoff(selectedFixture.date), selectedFixture.venue].filter(Boolean).join(' · ')}
                </span>
              </div>
              <button
                type="button"
                onClick={selectNext}
                disabled={!canSelectNext}
                aria-label="Next fixture"
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-border-control bg-surface-card-4/70 text-text-muted-1 disabled:opacity-30"
              >
                &#8250;
              </button>
            </div>

            {showEditor ? (
              <div className="flex flex-col gap-3">
                <FixtureEditor {...editorProps} />
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={submitting || filePhase !== 'idle'}
                  className="flex cursor-pointer items-center justify-center gap-2 rounded-full bg-brand-indigo-mid px-6 py-3 font-outfit text-sm font-semibold text-white shadow-lg disabled:opacity-60"
                >
                  {buttonLabel} &rarr;
                </button>
                {submitError && <p className="text-center text-xs text-state-error">{submitError}</p>}
              </div>
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
                <div style={aiSlideStyleMobile}>
                  <AiTeamReadPanel
                    fixture={selectedFixture}
                    open={aiOpen}
                    onToggle={() => setAiOpen((v) => !v)}
                    totalGoals={(activePrediction?.homeScore ?? 0) + (activePrediction?.awayScore ?? 0)}
                  />
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
