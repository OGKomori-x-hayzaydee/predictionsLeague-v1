import { useEffect, useState } from 'react';

const STORAGE_KEY = 'chip_plan_v1';

/**
 * Local-only "intent" tracker for the Chips season planner. The backend has
 * no concept of reserving a chip ahead of time (chips are only recorded
 * when a prediction is actually filed, via the chip selector on the
 * Fixtures screen). This map must never be merged into makePrediction —
 * it is a personal scratchpad; empty future-GW fixtures are expected
 * because /fixtures only returns the current gameweek.
 */
export function useChipPlan() {
  const [plan, setPlan] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(plan));
    } catch {
      // ignore quota errors
    }
  }, [plan]);

  const assign = (gameweek, chipId) => {
    setPlan((prev) => ({ ...prev, [gameweek]: chipId }));
  };

  const clear = (gameweek) => {
    setPlan((prev) => {
      const next = { ...prev };
      delete next[gameweek];
      return next;
    });
  };

  const clearAll = () => setPlan({});

  return { plan, assign, clear, clearAll };
}

export default useChipPlan;
