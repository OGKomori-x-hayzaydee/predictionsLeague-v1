import { useEffect, useMemo, useState } from 'react';
import { isGameweekFullySettled } from '../utils/matchResult';

const OPENED_PREFIX = 'gw-roundup-opened:';
const PLAYED_PREFIX = 'gw-roundup-played:';
const DAY_MS = 24 * 60 * 60 * 1000;

function readNum(key) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? Number(raw) : null;
  } catch {
    return null;
  }
}

/**
 * GW Roundup window: candidate is currentGameweek - 1, only if that week is
 * fully settled. First sight in this browser starts a 24h clock.
 */
export default function useWrappedWindow({ currentGameweek, predictions = [] }) {
  const candidate = currentGameweek != null && currentGameweek > 1 ? currentGameweek - 1 : null;

  const rows = useMemo(
    () => (predictions || []).filter((p) => candidate != null && Number(p.gameweek) === Number(candidate)),
    [predictions, candidate]
  );

  const settled = candidate != null && isGameweekFullySettled(rows);

  const storageKey = candidate != null ? `${OPENED_PREFIX}${candidate}` : null;
  const playedKey = candidate != null ? `${PLAYED_PREFIX}${candidate}` : null;

  const [openedAt, setOpenedAt] = useState(() => (storageKey ? readNum(storageKey) : null));
  const [played, setPlayed] = useState(() => (playedKey ? Boolean(readNum(playedKey)) : false));

  useEffect(() => {
    if (!settled || !storageKey) return;
    if (openedAt != null) return;
    const now = Date.now();
    try {
      localStorage.setItem(storageKey, String(now));
    } catch {
      /* ignore */
    }
    setOpenedAt(now);
  }, [settled, storageKey, openedAt]);

  const within24h = openedAt == null || Date.now() - openedAt < DAY_MS;
  const available = Boolean(settled && candidate && within24h);

  const markPlayed = () => {
    if (!playedKey) return;
    try {
      localStorage.setItem(playedKey, String(Date.now()));
    } catch {
      /* ignore */
    }
    setPlayed(true);
  };

  return {
    candidate,
    rows,
    available,
    played,
    markPlayed,
  };
}
