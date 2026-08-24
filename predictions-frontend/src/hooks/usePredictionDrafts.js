import { useCallback } from 'react';
import { matchChipsFromIds } from '../utils/gameweekChipState';
import { useSessionState } from './usePersistentState';

export function draftFromFiled(existing) {
  return {
    homeScore: existing?.homeScore ?? 0,
    awayScore: existing?.awayScore ?? 0,
    homeScorers: existing?.homeScorers ?? [],
    awayScorers: existing?.awayScorers ?? [],
    chips: matchChipsFromIds(existing?.chips),
  };
}

function normalizeDraft(draft) {
  return {
    homeScore: draft?.homeScore ?? 0,
    awayScore: draft?.awayScore ?? 0,
    homeScorers: [...(draft?.homeScorers || [])],
    awayScorers: [...(draft?.awayScorers || [])],
    chips: [...(draft?.chips || [])].slice().sort(),
  };
}

export function draftsEqual(a, b) {
  return JSON.stringify(normalizeDraft(a)) === JSON.stringify(normalizeDraft(b));
}

function snapshotDraft(draft) {
  return {
    homeScore: draft?.homeScore ?? 0,
    awayScore: draft?.awayScore ?? 0,
    homeScorers: draft?.homeScorers || [],
    awayScorers: draft?.awayScorers || [],
    chips: draft?.chips || [],
  };
}

/**
 * Per-fixture unfiled prediction drafts, keyed by user + gameweek in
 * sessionStorage so switching reel stations or leaving /fixtures keeps work.
 */
export default function usePredictionDrafts({ userId, gameweek }) {
  const ready = Boolean(userId) && gameweek != null;
  const storageKey = ready
    ? `prediction-drafts:${userId}:${gameweek}`
    : 'prediction-drafts:pending';
  const [map, setMap] = useSessionState(storageKey, {});

  const readDraft = useCallback(
    (key) => {
      if (!ready || !key) return null;
      return map[key] ?? null;
    },
    [map, ready]
  );

  const writeDraft = useCallback(
    (key, draft) => {
      if (!ready || !key) return;
      const next = snapshotDraft(draft);
      setMap((prev) => {
        if (prev[key] && draftsEqual(prev[key], next)) return prev;
        return { ...prev, [key]: next };
      });
    },
    [ready, setMap]
  );

  const clearDraft = useCallback(
    (key) => {
      if (!ready || !key) return;
      setMap((prev) => {
        if (!(key in prev)) return prev;
        const next = { ...prev };
        delete next[key];
        return next;
      });
    },
    [ready, setMap]
  );

  return { readDraft, writeDraft, clearDraft };
}
