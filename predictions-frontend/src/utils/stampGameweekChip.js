function isPendingPrediction(prediction) {
  const status = String(prediction?.status || 'pending').toLowerCase();
  return status === 'pending';
}

/**
 * Re-file each pending prediction this GW with `chipId` added to chips[].
 * Uses the existing make-prediction path (no backend activate endpoint).
 */
export async function stampGameweekChipOnPending({
  chipId,
  fixtures = [],
  makePrediction,
  onRowStamped,
} = {}) {
  if (!chipId || typeof makePrediction !== 'function') {
    return { attempted: 0, stamped: 0, results: [] };
  }

  const targets = fixtures.filter((fixture) => {
    const pred = fixture.userPrediction;
    if (!fixture.predicted || !pred) return false;
    if (!isPendingPrediction(pred)) return false;
    return !(pred.chips || []).includes(chipId);
  });

  const results = [];
  for (const fixture of targets) {
    const chips = [...(fixture.userPrediction.chips || [])];
    if (!chips.includes(chipId)) chips.push(chipId);

    try {
      const result = await makePrediction(
        {
          homeScore: fixture.userPrediction.homeScore,
          awayScore: fixture.userPrediction.awayScore,
          homeScorers: fixture.userPrediction.homeScorers || [],
          awayScorers: fixture.userPrediction.awayScorers || [],
          chips,
        },
        fixture,
        true
      );
      if (result?.success) onRowStamped?.({ fixture, chips });
      results.push(result);
    } catch (error) {
      results.push({ success: false, error: { message: error?.message || 'Stamp failed' } });
    }
  }

  return {
    attempted: targets.length,
    stamped: results.filter((result) => result?.success).length,
    results,
  };
}
