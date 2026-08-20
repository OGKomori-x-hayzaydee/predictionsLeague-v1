import { useState, useEffect, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import SlotBar from '../components/ui/SlotBar';
import LoadingState from '../components/common/LoadingState';
import FixtureEditor from '../components/fixtures/FixtureEditor';
import FixtureSlip from '../components/fixtures/FixtureSlip';
import FixtureReelStrip from '../components/fixtures/FixtureReelStrip';
import FilingCeremony from '../components/fixtures/FilingCeremony';
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

// FilingCeremony's phase timeline, literal from Spine.dc.html's fileIt():
// center holds at least this long (matched to the real request in parallel),
// then stamp holds STAMP_HOLD_MS, then return holds RETURN_MS, then idle.
const MIN_CENTER_MS = 520;
const STAMP_HOLD_MS = 1500 - 520;
const RETURN_MS = 2200 - 1500;

/**
 * Fixtures — the prediction-filing flow. GW-reel navigation via SlotBar's
 * `reelNav` mode (desktop, Spine.dc.html lines 63-89/664-679) and inline
 * prev/next (mobile, lines 2350-2357). Built on useFixtureSpine (shared with
 * Dashboard) for the fixture list/selection/ceiling, plus a local draft
 * state for the in-progress scoreline/scorers/chip so the live ceiling
 * preview (rail + editor footer) stays in sync while editing.
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

  // Reset the draft + editor state whenever the selected fixture changes
  // (prev/next, or a fresh load) — mirrors the prototype's per-fixture `ed`
  // state keyed by index. Intentionally keyed on the fixture id only (not
  // the whole userPrediction object) so this doesn't re-fire on every
  // background refetch of the same fixture while it's being edited.
  // eslint-disable-next-line react-hooks/exhaustive-deps
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
    // Navigating away (prev/next) cancels any in-flight filing ceremony,
    // matching the prototype's prev()/next() also resetting phase to idle.
    fileTimersRef.current.forEach(clearTimeout);
    fileTimersRef.current = [];
    setFilePhase('idle');
  }, [selectedFixture?.id]);

  const currentGameweek = essentialData?.season?.currentGameweek;
  const deadlineFormatted = essentialData?.season?.deadlineFormatted;
  const showDeadlineCountdown =
    !!timeDisplay && !isLive && timeDisplay !== 'Loading...' && timeDisplay !== 'No matches';
  const gameweekLabel = currentGameweek ? `GW${currentGameweek}` : undefined;

  // "Filed and resting" only when the fixture is actually filed AND the
  // editor hasn't been opened — the instant a filed fixture is reopened for
  // editing it reads as in-progress again until re-submitted, matching the
  // prototype's `e.filed` flag clearing on any edit.
  const filedNow = !!selectedFixture?.predicted && !editorOpen;
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

  // The filing ceremony: center (card floats up, dims in) -> stamp (lands,
  // FILED badge pops) -> return (drifts up, fades) -> idle. Phase only
  // advances center -> stamp once the real request actually succeeds — the
  // prototype's fixed 520ms is instead a *minimum* center time, raced
  // against the network call, so a slow request just holds "center" longer
  // rather than stamping early.
  const handleSubmit = async () => {
    if (!selectedFixture || filePhase !== 'idle') return;
    setSubmitting(true);
    setSubmitError(null);
    setFilePhase('center');
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
            homeScorers: draft.homeScorers.filter(Boolean),
            awayScorers: draft.awayScorers.filter(Boolean),
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
      setFilePhase('stamp');
      fileTimersRef.current.push(setTimeout(() => setFilePhase('return'), STAMP_HOLD_MS));
      fileTimersRef.current.push(setTimeout(() => setFilePhase('idle'), STAMP_HOLD_MS + RETURN_MS));
    } catch (err) {
      setFilePhase('idle');
      setEditorOpen(true);
      setSubmitError(err?.message || 'Could not file this prediction.');
    } finally {
      setSubmitting(false);
    }
  };

  const statusPill = selectedFixture
    ? filedNow
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
    <div className="animate-rise-in">
      <div className="hidden md:block">
        <SlotBar
          kicker="Fixtures"
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
          {/* Desktop — foundation spec §5.3, fixtures grid 1fr 316px */}
          <div className="hidden md:grid md:grid-cols-[1fr_316px] md:items-start">
            <div className="flex min-w-0 flex-col gap-6 px-6 py-6">
              {showEditor ? (
                <FixtureEditor {...editorProps} />
              ) : (
                <div className="flex justify-center py-6">
                  <FixtureSlip
                    fixture={selectedFixture}
                    prediction={activePrediction}
                    filed={filedNow}
                    ceiling={activeCeiling}
                    variant="main"
                    onEdit={() => setEditorOpen(true)}
                    gameweekLabel={gameweekLabel}
                    deadlineLabel={deadlineFormatted}
                  />
                </div>
              )}

              <div className="flex flex-col gap-2 border-t border-border-hairline pt-4">
                <span className="font-mono text-[10px] tracking-[0.16em] text-text-muted-4">THE REEL</span>
                <FixtureReelStrip stations={stations} />
              </div>
            </div>

            <div className="flex flex-col gap-4 border-l border-border-hairline bg-surface-bar px-5 py-6">
              <FixtureSlip
                fixture={selectedFixture}
                prediction={activePrediction}
                filed={filedNow}
                ceiling={activeCeiling}
                variant="rail"
                onEdit={showEditor ? undefined : () => setEditorOpen(true)}
                gameweekLabel={gameweekLabel}
                deadlineLabel={deadlineFormatted}
              />
            </div>
          </div>

          {/* Mobile — no shell-level slot bar (foundation spec §6.1); the
              GW-reel prev/next is rebuilt inline here instead. */}
          <div className="flex flex-col gap-4 px-4 pb-6 pt-4 md:hidden">
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
              <FixtureSlip
                fixture={selectedFixture}
                prediction={activePrediction}
                filed={filedNow}
                ceiling={activeCeiling}
                variant="mobile"
                onEdit={() => setEditorOpen(true)}
                gameweekLabel={gameweekLabel}
                deadlineLabel={deadlineFormatted}
              />
            )}
          </div>
        </>
      )}

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
