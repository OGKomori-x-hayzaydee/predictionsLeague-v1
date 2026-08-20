import { calculatePoints, getPointsBreakdown } from './pointsCalculation';

/**
 * Record-screen-only derived stats — kept separate from utils/profileStats.js
 * (shared with Profile/Chips screens being built in parallel this session)
 * so this screen's additions never risk a merge conflict with theirs.
 *
 * Everything here is computed from the same real prediction-history array
 * (`userPredictionsAPI.getAllUserPredictions`) already used elsewhere — no
 * fabricated/mocked figures.
 */

function isSettled(p) {
  return p.actualHomeScore !== null && p.actualHomeScore !== undefined &&
    p.actualAwayScore !== null && p.actualAwayScore !== undefined;
}

/**
 * Classifies a settled fixture's *actual* result into the prototype's
 * scoreline-shape buckets (one-goal win / draw / scoreless draw / two-plus).
 */
export function scorelineTypeOf(homeScore, awayScore) {
  if (homeScore === awayScore) return homeScore === 0 ? 'Scoreless draws' : 'Draws';
  return Math.abs(homeScore - awayScore) === 1 ? 'One-goal wins' : 'Two goals or more';
}

/**
 * Whether a settled prediction called the exact scoreline, the right
 * outcome only (draw/winner) or missed entirely — mirrors the prototype's
 * `c.exact` / `c.same` flags, driving the EXACT / OUTCOME / MISSED verdict
 * badge and its color.
 */
export function callVerdict(prediction) {
  if (!isSettled(prediction)) return null;
  const b = getPointsBreakdown(prediction) || {};
  if (b.perfectPrediction !== undefined || b.exactScore !== undefined) {
    return { verdict: 'EXACT', exact: true, colorVar: 'var(--brand-teal)' };
  }
  if (b.correctDraw !== undefined || b.correctOutcome !== undefined) {
    return { verdict: 'OUTCOME', exact: false, colorVar: 'var(--brand-indigo)' };
  }
  return { verdict: 'MISSED', exact: false, colorVar: 'var(--text-muted-4)' };
}

/** Hit rate (share of calls that earned any points) grouped by the actual scoreline's shape. */
export function computeScorelineHitRates(predictions = []) {
  const completed = predictions.filter(isSettled);
  const types = ['One-goal wins', 'Draws', 'Scoreless draws', 'Two goals or more'];
  const colors = ['var(--brand-teal)', 'var(--brand-indigo-mid)', 'var(--brand-indigo-pale)', 'var(--brand-teal-mid)'];
  return types.map((type, i) => {
    const set = completed.filter((p) => scorelineTypeOf(p.actualHomeScore, p.actualAwayScore) === type);
    const hits = set.filter((p) => (calculatePoints(p) ?? 0) > 0).length;
    const pct = set.length ? Math.round((hits / set.length) * 100) : 0;
    return { type, pct, n: set.length, color: colors[i] };
  });
}

const BAND_DEFS = [
  { label: '20+', lo: 20, hi: Infinity, color: 'var(--brand-teal)' },
  { label: '15–19', lo: 15, hi: 19, color: 'var(--brand-teal-mid)' },
  { label: '10–14', lo: 10, hi: 14, color: 'var(--brand-indigo-mid)' },
  { label: '5–9', lo: 5, hi: 9, color: 'var(--brand-indigo-pale)' },
  { label: '0–4', lo: 0, hi: 4, color: 'var(--text-muted-4)' },
];

/** Distribution of per-call points into the prototype's five bands. */
export function computePointsBands(predictions = []) {
  const completed = predictions.filter(isSettled);
  const perCall = completed.map((p) => calculatePoints(p) ?? 0);
  const counts = BAND_DEFS.map((b) => perCall.filter((v) => v >= b.lo && v <= b.hi).length);
  const max = Math.max(1, ...counts);
  return BAND_DEFS.map((b, i) => ({
    label: b.label,
    n: counts[i],
    pct: Math.round((counts[i] / max) * 100),
    color: b.color,
  }));
}

/** Share of settled calls (within the given scope) that earned any points at all. */
export function computeScoringRate(predictions = []) {
  const completed = predictions.filter(isSettled);
  const hits = completed.filter((p) => (calculatePoints(p) ?? 0) > 0).length;
  return { pct: completed.length ? Math.round((hits / completed.length) * 100) : 0, hits, total: completed.length };
}

/** Best/worst settled gameweek by total points, from computeProfileStats' pointsByGameweek. */
export function computeBestWorstWeeks(pointsByGameweek = []) {
  if (!pointsByGameweek.length) return { best: null, worst: null };
  const best = pointsByGameweek.reduce((a, b) => (b.points > a.points ? b : a));
  const worst = pointsByGameweek.reduce((a, b) => (b.points < a.points ? b : a));
  return { best, worst };
}

/**
 * A single real, computed observation about scoreline-type performance —
 * not narrative flavor text. Picks the strongest and weakest hit-rate
 * buckets (each needs at least 2 calls to be meaningful) and phrases one
 * sentence from them. Returns null when there isn't enough settled history
 * to say anything honest.
 */
export function computeScorelineInsight(scorelineHitRates) {
  const withData = scorelineHitRates.filter((s) => s.n >= 2);
  if (withData.length < 2) return null;
  const best = withData.reduce((a, b) => (b.pct > a.pct ? b : a));
  const worst = withData.reduce((a, b) => (b.pct < a.pct ? b : a));
  if (best.type === worst.type) return null;
  return {
    title: `Strongest on ${best.type.toLowerCase()}`,
    body: `You've scored on ${best.pct}% of your ${best.type.toLowerCase()} calls (${best.n} settled), against ${worst.pct}% on ${worst.type.toLowerCase()} (${worst.n} settled) — that's where the season is leaking.`,
  };
}
