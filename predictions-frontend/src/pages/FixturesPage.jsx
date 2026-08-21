import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
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
import useFilingSequence from '../hooks/useFilingSequence';
import userPredictionsAPI from '../services/api/userPredictionsAPI';
import { HYBRID_QUERY_KEYS } from '../hooks/useClientSideFixtures';
import { CHIP_QUERY_KEYS } from '../hooks/useChips';
import { extractMatchId, transformChipsFromBackend } from '../utils/backendMappings';
import { calculateCeilingPoints } from '../utils/pointsCalculation';
import {
  FILE_PHASES,
  RAIL_WIDTH_PX,
  CONTENT_LAYOUT_TRANSITION,
  AI_PANEL_VARIANTS,
  AI_PANEL_DELAY_MS,
} from '../components/fixtures/filingChoreography';

function formatKickoff(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return '';
  const day = d.toLocaleDateString(undefined, { weekday: 'short' });
  const time = d.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit', hour12: false });
  return `${day} ${time}`;
}

const EMPTY_DRAFT = { homeScore: 0, awayScore: 0, homeScorers: [], awayScorers: [], chip: null };

function chipsFromDraft(draft) {
  return draft?.chip ? [draft.chip] : [];
}

function draftAsFiledPrediction(draft, fixture) {
  const chips = chipsFromDraft(draft);
  return {
    matchId: extractMatchId(fixture) ?? fixture.id,
    homeScore: draft.homeScore,
    awayScore: draft.awayScore,
    homeScorers: (draft.homeScorers || []).filter(Boolean),
    awayScorers: (draft.awayScorers || []).filter(Boolean),
    chips,
    homeTeam: fixture.homeTeam,
    awayTeam: fixture.awayTeam,
    date: fixture.date,
    matchDate: fixture.date,
    status: 'pending',
  };
}

function upsertUserPredictionCache(queryClient, prediction) {
  queryClient.setQueryData([HYBRID_QUERY_KEYS.USER_PREDICTIONS, 'upcoming'], (prev) => {
    const list = Array.isArray(prev) ? prev : [];
    const matchId = Number(prediction.matchId);
    const idx = list.findIndex((p) => Number(p.matchId) === matchId || (prediction.id && p.id === prediction.id));
    if (idx >= 0) {
      const next = [...list];
      next[idx] = { ...next[idx], ...prediction };
      return next;
    }
    return [...list, prediction];
  });
}

/**
 * Fixtures Page — desktop editor with a corner-anchored live-preview slip
 * that morphs in place into the "FILED" ceremony (see FloatingSlipCard),
 * matching Spine.dc.html's buildReel() choreography instead of a detached
 * centered modal. The phase machine itself (idle/center/stamp/return) and
 * its timings live in `useFilingSequence` + `filingChoreography.js` so this
 * component only has to react to `filePhase`, not re-derive it.
 */
export default function FixturesPage() {
  const queryClient = useQueryClient();
  const { availableChips } = useChipManagement();

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

  // Positioned ancestor `FloatingSlipCard` measures itself against, to
  // compute a true pane-centered translate instead of a fixed vw/vh guess
  // (see filingChoreography.js's getCardTarget doc comment).
  const paneRef = useRef(null);
  const [draft, setDraft] = useState(EMPTY_DRAFT);
  const [editorOpen, setEditorOpen] = useState(false);
  const [aiOpen, setAiOpen] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const { phase: filePhase, isSlow, isFiling, file, reset: resetFiling } = useFilingSequence();
  // Optimistic "just filed" snapshot for the *currently open* fixture, so the
  // resting-slip reveal isn't gated behind the invalidated queries' network
  // round-trip — matching the prototype's instant local state flip.
  const [optimisticFiled, setOptimisticFiled] = useState(null);

  // Navigation-interrupt fix: fixture switching (chevrons/reel strip) is
  // disabled while `isFiling`, so by the time this effect can ever run for
  // a *different* fixture, no filing sequence is in flight — `resetFiling`
  // here is just a defensive clear of the idle phase state, not a mid-flight
  // cancellation.
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
    resetFiling();
  }, [selectedFixture?.id, resetFiling]);

  const currentGameweek = essentialData?.season?.currentGameweek;
  const deadlineFormatted = essentialData?.season?.deadlineFormatted;
  const showDeadlineCountdown =
    !!timeDisplay && !isLive && timeDisplay !== 'Loading...' && timeDisplay !== 'No matches';
  const gameweekLabel = currentGameweek ? `GW${currentGameweek}` : 'GW24';

  // Guard against both sides being null/undefined at once (e.g. before
  // fixtures have loaded) — `undefined === undefined` would otherwise read
  // as a spurious match and crash the very next line on `optimisticFiled.prediction`.
  const hasOptimisticFiling = !!optimisticFiled && !!selectedFixture && optimisticFiled.id === selectedFixture.id;
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
    chips: chipsFromDraft(draft),
  });

  const restingPrediction = hasOptimisticFiling
    ? optimisticFiled.prediction
    : selectedFixture?.userPrediction;
  const restingCeiling = restingPrediction ? calculateCeilingPoints({
    ...restingPrediction,
    chips: restingPrediction.chips || chipsFromDraft(restingPrediction),
  }) : 0;

  const livePrediction = { ...draft, chips: chipsFromDraft(draft) };
  const activePrediction = filedNow ? restingPrediction : livePrediction;
  const activeCeiling = filedNow ? restingCeiling : liveCeiling;

  // Drives the corner live-preview card: shown once there's something to
  // preview pre-filing, or for the whole non-idle filing sequence — matches
  // buildReel()'s `shown = (!filed && anyPicked) || phase !== "idle"`.
  const previewVisible = !isPredicted && hasLivePrediction;
  const railShown = previewVisible || isFiling;

  const handleSubmit = async () => {
    if (!selectedFixture || isFiling) return;
    setSubmitting(true);
    setSubmitError(null);
    // Close the editor immediately (prototype's `fixEditOpen:false` at t=0) —
    // harmless pre-filing since `showEditor` stays true until `isPredicted`
    // flips, but it's what lets the resting slip + AI panel be the thing
    // revealed once the dim/card fade away at the end of the sequence.
    setEditorOpen(false);

    try {
      const result = await file(
        () =>
          userPredictionsAPI.makePrediction(
            {
              homeScore: draft.homeScore,
              awayScore: draft.awayScore,
              homeScorers: (draft.homeScorers || []).filter(Boolean),
              awayScorers: (draft.awayScorers || []).filter(Boolean),
              chips: chipsFromDraft(draft),
            },
            selectedFixture,
            !!selectedFixture.predicted
          ),
        {
          onFiled: () => {
            const filed = draftAsFiledPrediction(draft, selectedFixture);
            upsertUserPredictionCache(queryClient, filed);
            queryClient.invalidateQueries({ queryKey: [CHIP_QUERY_KEYS.STATUS] });
            setOptimisticFiled({
              id: selectedFixture.id,
              prediction: { ...draft, chips: filed.chips },
            });
          },
        }
      );

      if (!result?.success) {
        setEditorOpen(true);
        setSubmitError(result?.error?.message || 'Could not file this prediction.');
      } else if (result.data) {
        const filed = draftAsFiledPrediction(draft, selectedFixture);
        const fromApi = result.data;
        upsertUserPredictionCache(queryClient, {
          ...filed,
          ...fromApi,
          chips: Array.isArray(fromApi.chips)
            ? transformChipsFromBackend(fromApi.chips)
            : filed.chips,
        });
      }
    } catch (err) {
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
    matchChips: availableChips,
    aiOpen,
    onToggleAi: () => setAiOpen((v) => !v),
  };

  const buttonLabel = submitting || isFiling
    ? 'Filing…'
    : isPredicted
      ? 'Filed · amend to re-file'
      : totalGoals === 0
        ? 'Review & file 0–0'
        : 'Review & file';

  // Only animate the AI panel's entrance right after an active filing
  // sequence (matches aiSlideAnimDesk/aiSlideAnimMob: "none" once idle so a
  // normal page load into an already-filed fixture doesn't replay it).
  // `initial` is only read once, at mount, so this correctly captures
  // "was a filing sequence in flight when this panel first appeared?"
  // without needing to be re-evaluated on every subsequent phase change.
  const aiPanelWasFiling = filePhase !== FILE_PHASES.IDLE;

  return (
    <div
      className="relative flex h-[calc(100vh-var(--shell-nav-h))] flex-col overflow-hidden animate-rise-in"
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
                  // Navigation-interrupt fix: briefly block fixture-switching
                  // while a filing sequence is in flight, rather than letting
                  // it hard-cut an in-progress API call + animation.
                  canPrev: canSelectPrev && !isFiling,
                  canNext: canSelectNext && !isFiling,
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
          <div ref={paneRef} className="relative hidden md:flex flex-1 min-h-0 flex-col overflow-hidden">
            {/*
              Layout-thrash fix: this outer div's own paddingRight toggles
              instantly (no CSS transition) between 0 and RAIL_WIDTH_PX — as
              a `flex-1`/`stretch` element its own outer rect never changes
              size, so that's cheap. The *smoothing* comes from Framer
              Motion's `layout` prop on the two children below, whose
              available width genuinely narrows in response: `layout`
              measures their rect once before/after the change and
              transform-interpolates between the two (one reflow at each
              end, zero per-frame reflows during the ~460ms transition,
              unlike the old continuous `padding-right` CSS transition).
            */}
            <div
              className="flex flex-1 min-h-0 flex-col"
              style={{ paddingRight: railShown ? RAIL_WIDTH_PX : 0 }}
            >
              {/* Scrollable content */}
              <motion.div
                layout
                transition={CONTENT_LAYOUT_TRANSITION}
                className="flex flex-1 min-h-0 flex-col overflow-y-auto px-6 py-2"
              >
                <div
                  className={`mx-auto flex w-full max-w-[76rem] flex-col items-center ${
                    showEditor ? '' : 'my-auto'
                  }`}
                >
                  {showEditor ? (
                    <FixtureEditor {...editorProps} />
                  ) : (
                    /* Resting Filed State */
                    <div className="mx-auto flex w-full max-w-[46.2rem] flex-col items-center gap-4 py-2">
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

                      <motion.div
                        className="w-full"
                        initial={aiPanelWasFiling ? 'hidden' : false}
                        animate="visible"
                        variants={AI_PANEL_VARIANTS}
                        transition={{ duration: 0.5, ease: 'easeOut', delay: AI_PANEL_DELAY_MS.desktop / 1000 }}
                      >
                        <AiTeamReadPanel open={aiOpen} onToggle={() => setAiOpen((v) => !v)} />
                      </motion.div>
                    </div>
                  )}
                </div>
              </motion.div>

              {/* Fixed Bottom Footer Dock (Button + Contained Reel Strip) */}
              <motion.div
                layout
                transition={CONTENT_LAYOUT_TRANSITION}
                className="flex flex-none flex-col gap-2.5 border-t border-[#16203180] bg-[#050b14cc] px-6 py-3 backdrop-blur-md"
              >
                <div className="w-full max-w-[76rem] mx-auto flex flex-col gap-2.5">
                  {showEditor && (
                    <div className="flex flex-col items-center justify-center">
                      {submitError && <p className="mb-1 text-xs text-state-error">{submitError}</p>}
                      <button
                        type="button"
                        onClick={handleSubmit}
                        disabled={submitting || isFiling}
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
                  <FixtureReelStrip stations={stations} locked={isFiling} />
                </div>
              </motion.div>
            </div>

            <FloatingSlipCard
              fixture={selectedFixture}
              prediction={isFiling || previewVisible ? livePrediction : restingPrediction}
              ceiling={isFiling || previewVisible ? liveCeiling : restingCeiling}
              filed={isPredicted}
              phase={filePhase}
              visible={previewVisible}
              isSlow={isSlow}
              gameweekLabel={gameweekLabel}
              paneRef={paneRef}
            />
          </div>

          {/* Mobile Layout */}
          <div className="flex flex-1 flex-col gap-4 overflow-y-auto px-4 pb-8 pt-3 md:hidden">
            <div className="flex items-center justify-between gap-2.5">
              <button
                type="button"
                onClick={selectPrev}
                disabled={!canSelectPrev || isFiling}
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
                disabled={!canSelectNext || isFiling}
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
                  disabled={submitting || isFiling}
                  className="flex cursor-pointer items-center justify-center gap-2 rounded-full bg-brand-indigo-mid px-6 py-3 font-outfit text-sm font-semibold text-white shadow-lg disabled:opacity-60"
                >
                  {buttonLabel} &rarr;
                </button>
                {submitError && <p className="text-center text-xs text-state-error">{submitError}</p>}
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {/* Mobile intentionally has no FloatingSlipCard/backdrop
                    ceremony at all (unchanged from the pre-rewrite
                    behaviour) — it relies on the disabled "Filing…" submit
                    button through `center`, then a plain switch to this
                    resting view once filed, with only the AI panel's
                    entrance animated. Preserved as-is; not in scope to add
                    a new mobile overlay as part of this port. */}
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
                <motion.div
                  initial={aiPanelWasFiling ? 'hidden' : false}
                  animate="visible"
                  variants={AI_PANEL_VARIANTS}
                  transition={{ duration: 0.5, ease: 'easeOut', delay: AI_PANEL_DELAY_MS.mobile / 1000 }}
                >
                  <AiTeamReadPanel open={aiOpen} onToggle={() => setAiOpen((v) => !v)} />
                </motion.div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
