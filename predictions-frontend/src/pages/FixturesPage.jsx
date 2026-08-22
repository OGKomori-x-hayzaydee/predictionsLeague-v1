import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { ArrowLeft, ArrowRight } from '@phosphor-icons/react';
import { motion } from 'framer-motion';
import { useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
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
  inferActiveGameweekChipIds,
  matchChipsFromIds,
  mergeMatchAndGameweekChips,
} from '../utils/gameweekChipState';
import { stampGameweekChipOnPending } from '../utils/stampGameweekChip';
import { showToast } from '../services/notificationService';
import {
  FILE_PHASES,
  CONTENT_LAYOUT_TRANSITION,
  AI_PANEL_VARIANTS,
  getBackdropTarget,
  BACKDROP_TRANSITION,
} from '../components/fixtures/filingChoreography';
import Button from '../components/ui/buttons/Button';
import IconButton from '../components/ui/buttons/IconButton';
import PageError from '../components/ui/PageError';
import EmptyState from '../components/ui/EmptyState';
import usePrefersReducedMotion from '../hooks/usePrefersReducedMotion';
import { buildResultView, recordSearchPath } from '../utils/matchResult';

function formatKickoff(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return '';
  const day = d.toLocaleDateString(undefined, { weekday: 'short' });
  const time = d.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit', hour12: false });
  return `${day} ${time}`;
}

const EMPTY_DRAFT = { homeScore: 0, awayScore: 0, homeScorers: [], awayScorers: [], chips: [] };

const STAMP_TONES = {
  teal: {
    bg: 'color-mix(in srgb, var(--brand-teal) 15%, transparent)',
    border: 'color-mix(in srgb, var(--brand-teal-mid) 40%, transparent)',
    fg: 'var(--brand-teal)',
  },
  indigo: {
    bg: 'color-mix(in srgb, var(--brand-indigo) 15%, transparent)',
    border: 'color-mix(in srgb, var(--brand-indigo-mid) 40%, transparent)',
    fg: 'var(--brand-indigo)',
  },
  muted: {
    bg: 'color-mix(in srgb, var(--text-muted) 15%, transparent)',
    border: 'var(--border-card)',
    fg: 'var(--text-muted)',
  },
  amber: {
    bg: 'color-mix(in srgb, var(--brand-amber) 15%, transparent)',
    border: 'color-mix(in srgb, var(--brand-amber) 40%, transparent)',
    fg: 'var(--brand-amber)',
  },
};

function chipsFromDraft(draft, gwChipIds = []) {
  return mergeMatchAndGameweekChips(draft?.chips, gwChipIds);
}

function fixtureKey(fixture) {
  if (!fixture) return null;
  const matchId = extractMatchId(fixture);
  if (matchId != null) return String(matchId);
  if (fixture.id != null) return String(fixture.id);
  return null;
}

function draftAsFiledPrediction(draft, fixture, gwChipIds = []) {
  const chips = chipsFromDraft(draft, gwChipIds);
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
    gameweek: fixture.gameweek,
    status: 'pending',
    submittedAt: new Date().toISOString(),
  };
}

function upsertUserPredictionCache(queryClient, prediction) {
  queryClient.setQueryData([HYBRID_QUERY_KEYS.USER_PREDICTIONS, 'all'], (prev) => {
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
 * Fixtures Page — desktop editor with an in-flow right-rail slip that
 * lifts to center on file, stamps, and returns to the rail as FILED.
 */
export default function FixturesPage() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { availableChips, currentGameweek: chipGameweek, refreshChips } = useChipManagement();

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

  const paneRef = useRef(null);
  const [draft, setDraft] = useState(EMPTY_DRAFT);
  const [editorOpen, setEditorOpen] = useState(false);
  const [aiOpen, setAiOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const { phase: filePhase, isSlow, isFiling, file, reset: resetFiling } = useFilingSequence();
  const reduceMotion = usePrefersReducedMotion();
  const layoutTransition = reduceMotion || isFiling ? { duration: 0 } : CONTENT_LAYOUT_TRANSITION;
  const backdropTransition = reduceMotion ? { duration: 0 } : BACKDROP_TRANSITION;
  const aiTransition = {
    duration: reduceMotion ? 0 : 0.5,
    ease: 'easeOut',
    delay: 0,
  };
  const [optimisticFiled, setOptimisticFiled] = useState(null);
  const [filedMatchIds, setFiledMatchIds] = useState(() => new Set());
  const [optimisticGwChips, setOptimisticGwChips] = useState([]);
  const [stampingChipId, setStampingChipId] = useState(null);

  useEffect(() => {
    const existing = selectedFixture?.userPrediction;
    setDraft({
      homeScore: existing?.homeScore ?? 0,
      awayScore: existing?.awayScore ?? 0,
      homeScorers: existing?.homeScorers ?? [],
      awayScorers: existing?.awayScorers ?? [],
      chips: matchChipsFromIds(existing?.chips),
    });
    setEditorOpen(false);
    setSubmitError(null);
    setOptimisticFiled(null);
    resetFiling();
  }, [selectedFixture?.id, resetFiling]);

  const currentGameweek = essentialData?.season?.currentGameweek || chipGameweek;
  const deadlineFormatted = essentialData?.season?.deadlineFormatted;
  const showDeadlineCountdown =
    !!timeDisplay && !isLive && timeDisplay !== 'Loading...' && timeDisplay !== 'No matches';
  const gameweekLabel = currentGameweek ? `GW${currentGameweek}` : 'GW24';

  const activeGwChipIds = useMemo(
    () =>
      inferActiveGameweekChipIds({
        statusChips: availableChips,
        fixtures,
        currentGameweek,
        optimisticIds: optimisticGwChips,
      }),
    [availableChips, fixtures, currentGameweek, optimisticGwChips]
  );

  const selectedKey = fixtureKey(selectedFixture);
  const hasOptimisticFiling = !!optimisticFiled && !!selectedFixture && optimisticFiled.id === selectedFixture.id;
  const isPredicted =
    !!selectedFixture?.predicted ||
    hasOptimisticFiling ||
    (selectedKey != null && filedMatchIds.has(selectedKey));
  const filedNow = isPredicted && !editorOpen;
  const resultView = selectedFixture
    ? buildResultView(selectedFixture, hasOptimisticFiling ? optimisticFiled.prediction : selectedFixture.userPrediction)
    : null;
  const matchLocked = !!resultView?.kickedOff;
  const showReceipt = matchLocked;
  const showEditor = !filedNow && !matchLocked;

  const totalGoals = draft.homeScore + draft.awayScore;
  const filedChips = chipsFromDraft(draft, activeGwChipIds);

  const liveCeiling = calculateCeilingPoints({
    homeScore: draft.homeScore,
    awayScore: draft.awayScore,
    homeScorers: draft.homeScorers,
    awayScorers: draft.awayScorers,
    chips: filedChips,
  });

  const restingPrediction = hasOptimisticFiling
    ? optimisticFiled.prediction
    : selectedFixture?.userPrediction;
  const restingCeiling = restingPrediction ? calculateCeilingPoints({
    ...restingPrediction,
    chips: restingPrediction.chips || filedChips,
  }) : 0;

  const livePrediction = {
    ...draft,
    chips: filedChips,
    submittedAt: restingPrediction?.submittedAt,
  };
  const activePrediction = filedNow ? restingPrediction : livePrediction;
  const activeCeiling = filedNow ? restingCeiling : liveCeiling;

  const railShown = showEditor || isFiling;

  const markFixtureFiled = useCallback((fixture, prediction) => {
    const key = fixtureKey(fixture);
    if (key) {
      setFiledMatchIds((prev) => {
        if (prev.has(key)) return prev;
        const next = new Set(prev);
        next.add(key);
        return next;
      });
    }
    setOptimisticFiled({
      id: fixture.id,
      prediction,
    });
  }, []);

  const handleActivateGameweekChip = useCallback(
    async (chipId) => {
      if (!chipId || stampingChipId) return;
      if (activeGwChipIds.includes(chipId)) return;

      setStampingChipId(chipId);
      setOptimisticGwChips((prev) => (prev.includes(chipId) ? prev : [...prev, chipId]));
      try {
        const { stamped, attempted } = await stampGameweekChipOnPending({
          chipId,
          fixtures,
          makePrediction: (payload, fixture, isEditing) =>
            userPredictionsAPI.makePrediction(payload, fixture, isEditing),
          onRowStamped: ({ fixture, chips }) => {
            upsertUserPredictionCache(queryClient, {
              matchId: extractMatchId(fixture) ?? fixture.id,
              ...fixture.userPrediction,
              chips,
              homeTeam: fixture.homeTeam,
              awayTeam: fixture.awayTeam,
              date: fixture.date,
              matchDate: fixture.date,
              gameweek: fixture.gameweek,
              status: 'pending',
            });
          },
        });
        queryClient.invalidateQueries({ queryKey: [CHIP_QUERY_KEYS.STATUS] });
        refreshChips?.();
        if (attempted > 0) {
          showToast(
            stamped > 0
              ? `Applied to ${stamped} filed ${stamped === 1 ? 'slip' : 'slips'} this GW`
              : 'Could not apply to filed slips',
            stamped > 0 ? 'success' : 'error'
          );
        }
      } catch (err) {
        setOptimisticGwChips((prev) => prev.filter((id) => id !== chipId));
        showToast(err?.message || 'Could not apply that chip', 'error');
      } finally {
        setStampingChipId(null);
      }
    },
    [activeGwChipIds, fixtures, queryClient, refreshChips, stampingChipId]
  );

  const handleSubmit = async () => {
    if (!selectedFixture || isFiling) return;
    const editing = isPredicted;
    const chipsToFile = filedChips;
    const filed = draftAsFiledPrediction(draft, selectedFixture, activeGwChipIds);
    setSubmitting(true);
    setSubmitError(null);
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
              chips: chipsToFile,
            },
            selectedFixture,
            editing
          ),
        {
          onFiled: () => {
            upsertUserPredictionCache(queryClient, filed);
            queryClient.invalidateQueries({ queryKey: [CHIP_QUERY_KEYS.STATUS] });
            markFixtureFiled(selectedFixture, { ...draft, chips: filed.chips, submittedAt: filed.submittedAt });
          },
        }
      );

      if (!result?.success) {
        setEditorOpen(true);
        setSubmitError(result?.error?.message || 'Could not file this prediction.');
      } else {
        markFixtureFiled(selectedFixture, { ...draft, chips: filed.chips, submittedAt: filed.submittedAt });
        if (result.data) {
          const fromApi = result.data;
          upsertUserPredictionCache(queryClient, {
            ...filed,
            ...fromApi,
            chips: Array.isArray(fromApi.chips)
              ? transformChipsFromBackend(fromApi.chips)
              : filed.chips,
          });
        }
      }
    } catch (err) {
      setEditorOpen(true);
      setSubmitError(err?.message || 'Could not file this prediction.');
    } finally {
      setSubmitting(false);
    }
  };

  const statusPill = (() => {
    if (!selectedFixture) return undefined;
    if (resultView?.live) {
      return { label: resultView.stamp.label || 'LIVE', ...STAMP_TONES.amber };
    }
    if (resultView?.finished) {
      const label = resultView.stamp.label || 'SCORED';
      if (resultView.verdict?.verdict === 'EXACT') {
        return { label, ...STAMP_TONES.teal };
      }
      if (resultView.verdict?.verdict === 'OUTCOME') {
        return { label, ...STAMP_TONES.indigo };
      }
      if (resultView.verdict?.verdict === 'MISSED') {
        return { label, ...STAMP_TONES.amber };
      }
      return { label, ...STAMP_TONES.muted };
    }
    if (isPredicted) {
      return { label: 'FILED', ...STAMP_TONES.teal };
    }
    return { label: 'OPEN', ...STAMP_TONES.amber };
  })();

  const collapseAiOnEdit = (updater) => {
    setAiOpen(false);
    setDraft(updater);
  };

  const editorProps = {
    fixture: selectedFixture,
    draft,
    onChangeHomeScore: (v) => collapseAiOnEdit((d) => ({ ...d, homeScore: v })),
    onChangeAwayScore: (v) => collapseAiOnEdit((d) => ({ ...d, awayScore: v })),
    onChangeHomeScorers: (v) => collapseAiOnEdit((d) => ({ ...d, homeScorers: v })),
    onChangeAwayScorers: (v) => collapseAiOnEdit((d) => ({ ...d, awayScorers: v })),
    onToggleMatchChip: (chipId) =>
      setDraft((d) => {
        const cur = Array.isArray(d.chips) ? d.chips : [];
        return {
          ...d,
          chips: cur.includes(chipId) ? cur.filter((id) => id !== chipId) : [...cur, chipId],
        };
      }),
    matchChips: availableChips.filter((chip) => chip.scope === 'match'),
    gameweekChips: availableChips.filter((chip) => chip.scope === 'gameweek'),
    activeGameweekChipIds: activeGwChipIds,
    currentGameweek,
    stampingChipId,
    onActivateGameweekChip: handleActivateGameweekChip,
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

  const aiPanelWasFiling = filePhase !== FILE_PHASES.IDLE;

  return (
    <div
      className="relative flex h-[calc(100dvh-var(--shell-nav-h))] flex-col overflow-hidden animate-rise-in bg-surface-app"
    >
      <div className="hidden lg:block flex-none">
        <SlotBar
          kicker="THE REEL"
          reelNav={
            fixtures.length
              ? {
                  counter: `${selectedIndex + 1} / ${fixtures.length}`,
                  title: selectedFixture ? `${selectedFixture.homeTeam} v ${selectedFixture.awayTeam}` : '',
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
        <PageError
          title="Couldn't load fixtures"
          body={error?.message || 'Try again in a moment.'}
        />
      )}

      {!isLoading && !isError && !selectedFixture && (
        <EmptyState kicker="THE REEL" title="No fixtures to predict right now." />
      )}

      {!isLoading && !isError && selectedFixture && (
        <>
          <div ref={paneRef} className="relative hidden lg:flex flex-1 min-h-0 overflow-hidden">
            <motion.div
              className="pointer-events-none absolute inset-0 z-40 bg-surface-inverse"
              initial={false}
              animate={getBackdropTarget(filePhase)}
              transition={backdropTransition}
            />

            <div className="flex min-h-0 min-w-0 flex-1 flex-col">
              <motion.div
                layout={!isFiling && !reduceMotion}
                transition={layoutTransition}
                className="flex flex-1 min-h-0 flex-col overflow-y-auto px-6 py-2"
              >
                <div
                  className={`mx-auto flex w-full max-w-[76rem] flex-col items-center ${
                    showEditor ? '' : 'my-auto'
                  }`}
                >
                  {showEditor ? (
                    <FixtureEditor {...editorProps} />
                  ) : showReceipt ? (
                    <div className="mx-auto flex w-full max-w-[46.2rem] flex-col items-center gap-4 py-2">
                      <FixtureSlip
                        fixture={selectedFixture}
                        prediction={restingPrediction}
                        filed={isPredicted}
                        ceiling={restingCeiling}
                        variant="scored"
                        gameweekLabel={gameweekLabel}
                        onViewFull={() => navigate(recordSearchPath(restingPrediction || selectedFixture))}
                      />
                    </div>
                  ) : (
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
                        transition={aiTransition}
                      >
                        <AiTeamReadPanel open={aiOpen} onToggle={() => setAiOpen((v) => !v)} />
                      </motion.div>
                    </div>
                  )}
                </div>
              </motion.div>

              <motion.div
                layout={!isFiling && !reduceMotion}
                transition={layoutTransition}
                className="flex flex-none flex-col gap-2.5 border-t border-border-hairline bg-surface-header/90 px-6 py-3 backdrop-blur-md"
              >
                <div className="w-full max-w-[76rem] mx-auto flex flex-col gap-2.5">
                  {showEditor && (
                    <div className="flex flex-col items-center justify-center">
                      {submitError && <p className="mb-1 text-xs text-state-error">{submitError}</p>}
                      <Button
                        onClick={handleSubmit}
                        disabled={submitting || isFiling}
                        loading={submitting || isFiling}
                        variant={isPredicted ? 'secondary' : 'primary'}
                        pill
                      >
                        {buttonLabel} →
                      </Button>
                    </div>
                  )}
                  <FixtureReelStrip stations={stations} locked={isFiling} />
                </div>
              </motion.div>
            </div>

            {railShown && (
              <div
                className="relative z-50 hidden w-[var(--rail-max)] shrink-0 flex-col overflow-visible pt-5 pr-6 pl-2 lg:flex"
              >
                <FloatingSlipCard
                  fixture={selectedFixture}
                  prediction={isFiling || showEditor ? livePrediction : restingPrediction}
                  ceiling={isFiling || showEditor ? liveCeiling : restingCeiling}
                  filed={isPredicted}
                  phase={filePhase}
                  visible={showEditor || isFiling}
                  isSlow={isSlow}
                  gameweekLabel={gameweekLabel}
                  paneRef={paneRef}
                />
              </div>
            )}
          </div>

          <div className="flex flex-1 flex-col gap-4 overflow-y-auto px-4 pb-8 pt-3 lg:hidden">
            <div className="flex items-center justify-between gap-2.5">
              <IconButton
                label="Previous fixture"
                onClick={selectPrev}
                disabled={!canSelectPrev || isFiling}
                className="rounded-full border border-border-control"
              >
                <ArrowLeft size={16} weight="bold" />
              </IconButton>
              <div className="flex flex-col items-center gap-0.5">
                <span className="font-outfit text-xs tracking-wider text-brand-teal">
                  {selectedIndex + 1} / {fixtures.length}
                </span>
                <span className="font-outfit text-xs tracking-wide text-text-muted">
                  {[formatKickoff(selectedFixture.date), selectedFixture.venue].filter(Boolean).join(' · ')}
                </span>
                {showDeadlineCountdown && (
                  <span className="text-xs text-brand-amber">{timeDisplay} to deadline</span>
                )}
              </div>
              <IconButton
                label="Next fixture"
                onClick={selectNext}
                disabled={!canSelectNext || isFiling}
                className="rounded-full border border-border-control"
              >
                <ArrowRight size={16} weight="bold" />
              </IconButton>
            </div>

            {showEditor ? (
              <div className="flex flex-col gap-3">
                <FixtureEditor {...editorProps} />
                <Button
                  onClick={handleSubmit}
                  disabled={submitting || isFiling}
                  loading={submitting || isFiling}
                  variant={isPredicted ? 'secondary' : 'primary'}
                  className="w-full"
                >
                  {buttonLabel} →
                </Button>
                {submitError && <p className="text-center text-xs text-state-error">{submitError}</p>}
              </div>
            ) : showReceipt ? (
              <FixtureSlip
                fixture={selectedFixture}
                prediction={restingPrediction}
                filed={isPredicted}
                ceiling={restingCeiling}
                variant="scored"
                gameweekLabel={gameweekLabel}
                onViewFull={() => navigate(recordSearchPath(restingPrediction || selectedFixture))}
              />
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
                <motion.div
                  initial={aiPanelWasFiling ? 'hidden' : false}
                  animate="visible"
                  variants={AI_PANEL_VARIANTS}
                  transition={aiTransition}
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
