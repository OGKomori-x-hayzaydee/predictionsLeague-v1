import { calculatePoints, getPointsBreakdown } from './pointsCalculation';
import { CHIP_CONFIG } from './chipManager';

/**
 * Aggregates a raw prediction-history array (userAPI.getPredictionHistory /
 * userPredictionsAPI.getAllUserPredictions) into the stats the Profile
 * screen's headline tiles and "Record" tab need. No dedicated backend
 * endpoint provides this shape — see plan §4 (Team/monthly performance
 * stats row) for why computing from raw history beats the backend's
 * narrower stats endpoints.
 */
export function computeProfileStats(predictions = []) {
  const completed = predictions.filter(
    (p) => p.actualHomeScore !== null && p.actualHomeScore !== undefined
  );

  const seasonPoints = completed.reduce((sum, p) => sum + (calculatePoints(p) ?? 0), 0);

  const exact = completed.filter((p) => {
    const b = getPointsBreakdown(p);
    return b && (b.perfectPrediction !== undefined || b.exactScore !== undefined);
  });
  const exactCallsPct = completed.length ? Math.round((exact.length / completed.length) * 100) : 0;

  const byGameweek = {};
  completed.forEach((p) => {
    const gw = p.gameweek;
    if (gw === undefined || gw === null) return;
    byGameweek[gw] = (byGameweek[gw] || 0) + (calculatePoints(p) ?? 0);
  });
  const gameweeks = Object.keys(byGameweek);
  const avgPerWeek = gameweeks.length ? Math.round(seasonPoints / gameweeks.length) : 0;

  let bestWeek = null;
  gameweeks.forEach((gw) => {
    if (!bestWeek || byGameweek[gw] > bestWeek.points) {
      bestWeek = { gameweek: Number(gw), points: byGameweek[gw] };
    }
  });

  const chipsPlayed = completed.filter((p) => (p.chips || []).length > 0).length;

  // "Where the points come from" breakdown, bucketed to mirror the
  // prototype's categories (Exact scorelines / Right winner only / Chip
  // multipliers / Named scorers / Correct draws / Goal-difference penalties).
  const breakdown = {
    exactScorelines: { calls: 0, points: 0 },
    correctWinnerOnly: { calls: 0, points: 0 },
    correctDraws: { calls: 0, points: 0 },
    namedScorers: { calls: 0, points: 0 },
    chipMultipliers: { calls: 0, points: 0 },
    goalDifferencePenalties: { calls: 0, points: 0 },
  };

  completed.forEach((p) => {
    const b = getPointsBreakdown(p);
    if (!b) return;
    const base = (b.perfectPrediction ?? 0) + (b.exactScore ?? 0);
    if (base > 0) {
      breakdown.exactScorelines.calls += 1;
      breakdown.exactScorelines.points += base;
    }
    if (b.correctOutcome) {
      breakdown.correctWinnerOnly.calls += 1;
      breakdown.correctWinnerOnly.points += b.correctOutcome;
    }
    if (b.correctDraw) {
      breakdown.correctDraws.calls += 1;
      breakdown.correctDraws.points += b.correctDraw;
    }
    if (b.goalscorers) {
      breakdown.namedScorers.calls += 1;
      breakdown.namedScorers.points += b.goalscorers;
    }
    if (b.goalDiffPenalty) {
      breakdown.goalDifferencePenalties.calls += 1;
      breakdown.goalDifferencePenalties.points += b.goalDiffPenalty;
    }
    if ((p.chips || []).length > 0) {
      const preChipPoints =
        (b.perfectPrediction ?? 0) +
        (b.exactScore ?? 0) +
        (b.correctDraw ?? 0) +
        (b.correctOutcome ?? 0) +
        (b.goalscorers ?? 0) +
        (b.goalDiffPenalty ?? 0);
      const total = calculatePoints(p) ?? 0;
      const chipBonus = total - preChipPoints;
      if (chipBonus !== 0) {
        breakdown.chipMultipliers.calls += 1;
        breakdown.chipMultipliers.points += chipBonus;
      }
    }
  });

  return {
    seasonPoints,
    exactCalls: exact.length,
    exactCallsPct,
    totalCompleted: completed.length,
    avgPerWeek,
    bestWeek,
    chipsPlayed,
    breakdown,
    // rank-by-week sparkline input
    pointsByGameweek: gameweeks
      .map((gw) => ({ gameweek: Number(gw), points: byGameweek[gw] }))
      .sort((a, b) => a.gameweek - b.gameweek),
  };
}

/**
 * Per-team prediction accuracy, computed client-side from raw history
 * rather than the backend's `/profile/statistics/team-performance`
 * endpoint (which only covers the 6 "big six" teams it hardcodes) — see
 * plan §4. Covers every team that appears in the user's fixtures.
 */
export function computeTeamAccuracy(predictions = []) {
  const completed = predictions.filter(
    (p) => p.actualHomeScore !== null && p.actualHomeScore !== undefined
  );
  const byTeam = {};

  completed.forEach((p) => {
    const actualWinner =
      p.actualHomeScore === p.actualAwayScore ? 'draw' : p.actualHomeScore > p.actualAwayScore ? 'home' : 'away';
    const predictedWinner =
      p.homeScore === p.awayScore ? 'draw' : p.homeScore > p.awayScore ? 'home' : 'away';
    const correct = actualWinner === predictedWinner;

    [p.homeTeam, p.awayTeam].forEach((team) => {
      if (!team) return;
      if (!byTeam[team]) byTeam[team] = { team, predictions: 0, correct: 0 };
      byTeam[team].predictions += 1;
      if (correct) byTeam[team].correct += 1;
    });
  });

  return Object.values(byTeam)
    .map((t) => ({ ...t, accuracy: t.predictions ? Math.round((t.correct / t.predictions) * 100) : 0 }))
    .sort((a, b) => b.predictions - a.predictions);
}

/**
 * Hit rate grouped by outcome type (exact / correct winner / correct draw
 * / wrong), mirroring the prototype's "hit rate by scoreline type" bars.
 */
export function computeHitRateByOutcome(predictions = []) {
  const completed = predictions.filter(
    (p) => p.actualHomeScore !== null && p.actualHomeScore !== undefined
  );

  const buckets = { exact: 0, correctWinner: 0, correctDraw: 0, wrong: 0 };
  completed.forEach((p) => {
    const exact = p.homeScore === p.actualHomeScore && p.awayScore === p.actualAwayScore;
    const actualDraw = p.actualHomeScore === p.actualAwayScore;
    const predictedDraw = p.homeScore === p.awayScore;
    const actualWinner = actualDraw ? 'draw' : p.actualHomeScore > p.actualAwayScore ? 'home' : 'away';
    const predictedWinner = predictedDraw ? 'draw' : p.homeScore > p.awayScore ? 'home' : 'away';

    if (exact) buckets.exact += 1;
    else if (actualDraw && predictedDraw) buckets.correctDraw += 1;
    else if (predictedWinner === actualWinner) buckets.correctWinner += 1;
    else buckets.wrong += 1;
  });

  return { ...buckets, total: completed.length };
}

/**
 * Per-chip usage log for the Chips "Almanac" tab — real usage/return, not
 * the prototype's mock debrief table.
 */
export function computeChipAlmanac(predictions = []) {
  const completed = predictions.filter(
    (p) => p.actualHomeScore !== null && p.actualHomeScore !== undefined && (p.chips || []).length > 0
  );

  const byChip = {};
  Object.keys(CHIP_CONFIG).forEach((id) => {
    byChip[id] = { chipId: id, ...CHIP_CONFIG[id], usageCount: 0, totalReturn: 0, log: [] };
  });

  completed.forEach((p) => {
    const b = getPointsBreakdown(p);
    if (!b) return;
    const preChipPoints =
      (b.perfectPrediction ?? 0) +
      (b.exactScore ?? 0) +
      (b.correctDraw ?? 0) +
      (b.correctOutcome ?? 0) +
      (b.goalscorers ?? 0) +
      (b.goalDiffPenalty ?? 0);
    const total = calculatePoints(p) ?? 0;
    const chipBonus = total - preChipPoints;

    (p.chips || []).forEach((chipId) => {
      if (!byChip[chipId]) return;
      byChip[chipId].usageCount += 1;
      byChip[chipId].totalReturn += chipBonus;
      byChip[chipId].log.push({ gameweek: p.gameweek, points: chipBonus });
    });
  });

  return Object.values(byChip).sort((a, b) => b.usageCount - a.usageCount);
}
