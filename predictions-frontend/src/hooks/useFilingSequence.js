import { useCallback, useEffect, useRef, useState } from 'react';
import {
  FILE_PHASES,
  FILING_TIMINGS,
  SLOW_NETWORK_GRACE_MS,
} from '../components/fixtures/filingChoreography';

/**
 * Owns the prediction-filing phase machine (idle -> center -> stamp ->
 * return -> idle) and its timers, so the choreography logic lives in one
 * place instead of being re-derived by every consumer. See
 * `filingChoreography.js` for the phase/timing reference.
 *
 * Framer Motion's `animate` prop naturally interrupts/retargets an
 * in-flight animation whenever the target changes, so simply calling
 * `setPhase` mid-transition (e.g. an error bouncing `center` straight back
 * to `idle`) is already interrupt-safe — no manual cancellation needed on
 * the animation side. What *does* need explicit handling is the
 * `setTimeout` chain that advances phases on its own schedule; `reset()`
 * and the unmount cleanup both clear every pending timer so a fixture
 * switch or unmount can never fire a stale phase change.
 */
export function useFilingSequence() {
  const [phase, setPhase] = useState(FILE_PHASES.IDLE);
  const [isSlow, setIsSlow] = useState(false);
  const timersRef = useRef([]);

  const clearTimers = useCallback(() => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
  }, []);

  useEffect(() => clearTimers, [clearTimers]);

  const reset = useCallback(() => {
    clearTimers();
    setIsSlow(false);
    setPhase(FILE_PHASES.IDLE);
  }, [clearTimers]);

  /**
   * Runs the full filing sequence for one `submitFn` (a () => Promise<{
   * success, error? }> call). Resolves with that result once the API call
   * settles — the caller is responsible for applying its own side effects
   * (optimistic state, query invalidation, error messaging) around the
   * await, and for passing an `onFiled` callback to run in the same tick
   * as the `stamp` phase flip on success (matching the prototype's
   * `setEntry(i,{filed:true})` + `phase:"stamp"` happening together).
   */
  const file = useCallback(
    async (submitFn, { onFiled } = {}) => {
      clearTimers();
      setIsSlow(false);
      setPhase(FILE_PHASES.CENTER);

      const minCenter = new Promise((resolve) => {
        timersRef.current.push(setTimeout(resolve, FILING_TIMINGS.center));
      });
      const slowTimer = setTimeout(
        () => setIsSlow(true),
        FILING_TIMINGS.center + SLOW_NETWORK_GRACE_MS
      );
      timersRef.current.push(slowTimer);

      try {
        const [result] = await Promise.all([submitFn(), minCenter]);
        clearTimeout(slowTimer);
        setIsSlow(false);

        if (!result?.success) {
          setPhase(FILE_PHASES.IDLE);
          return result;
        }

        onFiled?.(result);
        setPhase(FILE_PHASES.STAMP);
        timersRef.current.push(
          setTimeout(() => setPhase(FILE_PHASES.RETURN), FILING_TIMINGS.stamp)
        );
        timersRef.current.push(
          setTimeout(
            () => setPhase(FILE_PHASES.IDLE),
            FILING_TIMINGS.stamp + FILING_TIMINGS.return
          )
        );
        return result;
      } catch (err) {
        clearTimeout(slowTimer);
        setIsSlow(false);
        setPhase(FILE_PHASES.IDLE);
        throw err;
      }
    },
    [clearTimers]
  );

  return {
    phase,
    isSlow,
    isFiling: phase !== FILE_PHASES.IDLE,
    file,
    reset,
  };
}

export default useFilingSequence;
