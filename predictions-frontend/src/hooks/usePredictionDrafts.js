import { useCallback, useEffect } from 'react';
import { matchChipsFromIds } from '../utils/gameweekChipState';
import { usePersistentState } from './usePersistentState';

const PENDING_KEY = 'prediction-drafts:pending';

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

function readLocal(key, fallback) {
  try {
    const item = window.localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch {
    return fallback;
  }
}

/**
 * Per-fixture unfiled prediction drafts, keyed by user + gameweek in
 * localStorage so switching reel stations or leaving /fixtures keeps work.
 */
export default function usePredictionDrafts({ userId, gameweek }) {
  const ready = Boolean(userId) && gameweek != null;
  const storageKey = ready
    ? `prediction-drafts:${userId}:${gameweek}`
    : PENDING_KEY;
  const [map, setMap] = usePersistentState(storageKey, {});

  useEffect(() => {
    if (!ready) return;
    const pending = readLocal(PENDING_KEY, {});
    if (!pending || typeof pending !== 'object' || !Object.keys(pending).length) return;
    setMap((prev) => ({ ...pending, ...prev }));
    try {
      window.localStorage.removeItem(PENDING_KEY);
    } catch {
      /* ignore */
    }
  }, [ready, setMap]);

  const readDraft = useCallback(
    (key) => {
      if (!key) return null;
      return map[key] ?? null;
    },
    [map]
  );

  const writeDraft = useCallback(
    (key, draft) => {
      if (!key) return;
      const next = snapshotDraft(draft);
      setMap((prev) => {
        if (prev[key] && draftsEqual(prev[key], next)) return prev;
        return { ...prev, [key]: next };
      });
    },
    [setMap]
  );

  const clearDraft = useCallback(
    (key) => {
      if (!key) return;
      setMap((prev) => {
        if (!(key in prev)) return prev;
        const next = { ...prev };
        delete next[key];
        return next;
      });
    },
    [setMap]
  );

  return { readDraft, writeDraft, clearDraft };
}
