/**
 * The gameweek "fixture spine" — current-gameweek fixtures merged with each
 * one's prediction status, plus a "selected fixture" cursor. This is the
 * shared shape behind Dashboard's station rail + fixture-preview card; the
 * Fixtures screen's GW-reel is a plausible future consumer of the same
 * fixtures/selection data, so this hook intentionally returns semantic data
 * only (no styling/colors) rather than Dashboard-specific presentation.
 *
 * Built entirely on real hook data (useFixtures' external-fixtures +
 * user-predictions merge) and pure scoring arithmetic (calculateCeilingPoints)
 * — no fabricated/derived-intelligence fields.
 */
import { useState, useMemo, useCallback } from 'react';
import { useFixtures } from './useFixtures';
import { calculateCeilingPoints } from '../utils/pointsCalculation';
import { reelPresentation } from '../utils/matchResult';

export function useFixtureSpine() {
  const { fixtures, stats, isLoading, isError, error } = useFixtures();
  // null = user hasn't picked a station yet — default to the first still-open
  // (unpredicted) fixture, derived at render time so it settles naturally
  // once fixtures load without an effect fighting the user's own clicks.
  const [selectedIndex, setSelectedIndex] = useState(null);

  const effectiveIndex = useMemo(() => {
    if (fixtures.length === 0) return 0;
    if (selectedIndex !== null) return Math.min(selectedIndex, fixtures.length - 1);
    const firstOpen = fixtures.findIndex((f) => !f.predicted);
    return firstOpen > -1 ? firstOpen : 0;
  }, [fixtures, selectedIndex]);

  const selectedFixture = fixtures[effectiveIndex] || null;

  const stations = useMemo(
    () =>
      fixtures.map((fixture, index) => {
        const predicted = !!fixture.predicted;
        const prediction = fixture.userPrediction;
        const { scoreLabel, scoreTone } = reelPresentation(fixture, prediction, {
          isSelected: index === effectiveIndex,
        });
        return {
          id: fixture.id ?? `${fixture.homeTeam}-${fixture.awayTeam}-${fixture.date}`,
          index,
          date: fixture.date,
          homeTeam: fixture.homeTeam,
          awayTeam: fixture.awayTeam,
          predicted,
          scoreLabel,
          scoreTone,
          isSelected: index === effectiveIndex,
          onSelect: () => setSelectedIndex(index),
        };
      }),
    [fixtures, effectiveIndex]
  );

  const filedCount = stats?.predicted ?? fixtures.filter((f) => f.predicted).length;
  const total = stats?.total ?? fixtures.length;

  const tableMaxPoints = useMemo(
    () =>
      fixtures.reduce((sum, fixture) => {
        if (!fixture.predicted || !fixture.userPrediction) return sum;
        return sum + calculateCeilingPoints(fixture.userPrediction);
      }, 0),
    [fixtures]
  );

  const selectedCeiling =
    selectedFixture?.predicted && selectedFixture?.userPrediction
      ? calculateCeilingPoints(selectedFixture.userPrediction)
      : 0;

  const selectPrev = useCallback(
    () => setSelectedIndex(Math.max(0, effectiveIndex - 1)),
    [effectiveIndex]
  );
  const selectNext = useCallback(
    () => setSelectedIndex(Math.min(fixtures.length - 1, effectiveIndex + 1)),
    [effectiveIndex, fixtures.length]
  );

  return {
    fixtures,
    stations,
    selectedIndex: effectiveIndex,
    setSelectedIndex,
    selectPrev,
    selectNext,
    canSelectPrev: effectiveIndex > 0,
    canSelectNext: effectiveIndex < fixtures.length - 1,
    selectedFixture,
    selectedCeiling,
    filedCount,
    total,
    tableMaxPoints,
    isLoading,
    isError,
    error,
  };
}

export default useFixtureSpine;
