import { calculatePoints, getPointsBreakdown } from './pointsCalculation';
import { callVerdict } from './recordStats';
import {
  MATCH_STATUS,
  isLiveMatch,
  isFinishedMatch,
  formatMatchMinute,
} from './fixtureUtils';

export const VERDICT_LABELS = { EXACT: 'EXACT', OUTCOME: 'CORRECT', MISSED: 'MISSED' };

export const BREAKDOWN_LABELS = {
  perfectPrediction: 'Exact scoreline called, scorers matched',
  exactScore: 'Exact scoreline called',
  correctDraw: 'Correct draw',
  correctOutcome: 'Right winner',
  goalscorers: 'Named scorers correctly',
  scorerFocus: 'Scorer Focus applied',
  goalDiffPenalty: 'Goal-difference penalty',
  wildcard: 'Wildcard applied',
  doubleDown: 'Double Down applied',
  allInWeek: 'All-In Week applied',
  defensePlusPlus: 'Defence++ clean sheet bonus',
};

export const SCORE_TONE = {
  exact: 'exact',
  outcome: 'outcome',
  miss: 'miss',
  live: 'live',
  filed: 'filed',
  editing: 'editing',
  muted: 'muted',
  open: 'open',
};

/**
 * Kickoff has happened (or the match is otherwise no longer open to file).
 */
export function isKickoffPassed(status, date) {
  if (isLiveMatch(status) || isFinishedMatch(status)) return true;
  if (status === MATCH_STATUS.SUSPENDED) return true;
  if (!date) return false;
  const t = new Date(date).getTime();
  return !Number.isNaN(t) && t <= Date.now();
}

function hasPair(home, away) {
  return home !== null && home !== undefined && away !== null && away !== undefined;
}

/**
 * Prefer prediction actuals (MatchEntity via /predictions/user), then fixture scores
 * (Redis live/finish poller). Scheduled 0–0 placeholders are ignored unless live/finished.
 */
export function resolveActualScores(fixture, prediction) {
  if (hasPair(prediction?.actualHomeScore, prediction?.actualAwayScore)) {
    return { home: prediction.actualHomeScore, away: prediction.actualAwayScore, source: 'prediction' };
  }
  const liveOrFinished = isLiveMatch(fixture?.status) || isFinishedMatch(fixture?.status);
  if (liveOrFinished && hasPair(fixture?.homeScore, fixture?.awayScore)) {
    return { home: fixture.homeScore, away: fixture.awayScore, source: 'fixture' };
  }
  return { home: null, away: null, source: null };
}

function scoringPayload(prediction, actual, fixture) {
  if (!prediction || !hasPair(actual.home, actual.away)) return null;
  return {
    ...prediction,
    actualHomeScore: actual.home,
    actualAwayScore: actual.away,
    actualHomeScorers: prediction.actualHomeScorers || fixture?.actualHomeScorers || [],
    actualAwayScorers: prediction.actualAwayScorers || fixture?.actualAwayScorers || [],
  };
}

function resolvePoints(prediction, scored) {
  if (!scored) return null;
  if (prediction?.points != null && prediction.status !== 'pending') return prediction.points;
  return calculatePoints(scored);
}

export function scorerWasCorrect(name, actualHomeScorers = [], actualAwayScorers = []) {
  if (!name) return false;
  return [...(actualHomeScorers || []), ...(actualAwayScorers || [])].includes(name);
}

export function verdictTone(verdict) {
  if (verdict?.verdict === 'EXACT') return SCORE_TONE.exact;
  if (verdict?.verdict === 'OUTCOME') return SCORE_TONE.outcome;
  if (verdict?.verdict === 'MISSED') return SCORE_TONE.miss;
  return SCORE_TONE.muted;
}

const STAMP_AMBER = {
  fg: 'var(--brand-amber)',
  border: 'color-mix(in srgb, var(--brand-amber) 40%, transparent)',
};
const STAMP_TEAL = {
  fg: 'var(--brand-teal)',
  border: 'color-mix(in srgb, var(--brand-teal-mid) 60%, transparent)',
};
const STAMP_INDIGO = {
  fg: 'var(--brand-indigo)',
  border: 'color-mix(in srgb, var(--brand-indigo-mid) 60%, transparent)',
};
const STAMP_MUTED = {
  fg: 'var(--text-muted)',
  border: 'var(--border-card)',
};

export function stampStyle(verdict, { live = false, awaiting = false } = {}) {
  if (live) {
    return { ...STAMP_AMBER, label: null };
  }
  if (awaiting) {
    return { ...STAMP_MUTED, label: 'AWAITING' };
  }
  if (verdict?.verdict === 'EXACT') {
    return { ...STAMP_TEAL, label: 'EXACT' };
  }
  if (verdict?.verdict === 'OUTCOME') {
    return { ...STAMP_INDIGO, label: 'CORRECT' };
  }
  if (verdict?.verdict === 'MISSED') {
    return { ...STAMP_AMBER, label: 'MISSED' };
  }
  return { ...STAMP_MUTED, label: 'SCORED' };
}

/**
 * Single view-model for Fixtures receipts, the reel, and the dashboard carousel.
 */
export function buildResultView(fixture, prediction) {
  const status = fixture?.status;
  const live = isLiveMatch(status);
  const finished = isFinishedMatch(status);
  const kickedOff = isKickoffPassed(status, fixture?.date);
  const actual = resolveActualScores(fixture, prediction);
  const awaiting = kickedOff && !hasPair(actual.home, actual.away);
  const settled = finished && hasPair(actual.home, actual.away);
  const scored = settled ? scoringPayload(prediction, actual, fixture) : null;
  const verdict = scored ? callVerdict(scored) : null;
  const breakdown = scored ? getPointsBreakdown(scored) : null;
  const points = resolvePoints(prediction, scored);
  const minuteLabel = live ? formatMatchMinute(fixture?.minute) : '';
  const stamp = stampStyle(verdict, { live, awaiting });
  if (live) {
    stamp.label = minuteLabel ? `LIVE ${minuteLabel}` : 'LIVE';
  }

  return {
    live,
    finished,
    kickedOff,
    awaiting,
    settled,
    hasCall: !!prediction && prediction.homeScore != null,
    actualHome: actual.home,
    actualAway: actual.away,
    callHome: prediction?.homeScore,
    callAway: prediction?.awayScore,
    minuteLabel,
    points,
    verdict,
    breakdown,
    stamp,
    tone: live ? SCORE_TONE.live : verdictTone(verdict),
    scoringPrediction: scored,
  };
}

export function reelPresentation(fixture, prediction, { isSelected = false } = {}) {
  const result = buildResultView(fixture, prediction);
  const predicted = !!prediction;

  if (result.live) {
    return {
      result,
      scoreLabel: hasPair(result.actualHome, result.actualAway)
        ? `${result.actualHome}–${result.actualAway}`
        : 'LIVE',
      scoreTone: SCORE_TONE.live,
    };
  }

  if (result.finished) {
    if (result.awaiting) {
      return { result, scoreLabel: 'FT', scoreTone: SCORE_TONE.muted };
    }
    return {
      result,
      scoreLabel: `${result.actualHome}–${result.actualAway}`,
      scoreTone: predicted ? result.tone : SCORE_TONE.muted,
    };
  }

  if (predicted && prediction) {
    return {
      result,
      scoreLabel: `${prediction.homeScore}–${prediction.awayScore}`,
      scoreTone: SCORE_TONE.filed,
    };
  }

  if (isSelected) {
    return { result, scoreLabel: 'editing', scoreTone: SCORE_TONE.editing };
  }

  return { result, scoreLabel: null, scoreTone: SCORE_TONE.open };
}

export function lastSettledGameweek(predictions = []) {
  const settled = (predictions || []).filter((p) => hasPair(p.actualHomeScore, p.actualAwayScore));
  if (!settled.length) return { gameweek: null, rows: [] };
  const gameweek = Math.max(...settled.map((p) => Number(p.gameweek) || 0));
  const rows = (predictions || [])
    .filter((p) => Number(p.gameweek) === gameweek)
    .slice()
    .sort((a, b) => new Date(a.date || a.matchDate || 0) - new Date(b.date || b.matchDate || 0));
  return { gameweek, rows };
}

export function pointsLabel(points) {
  if (points == null) return '—';
  if (points > 0) return `+${points}`;
  return String(points);
}

/** Shape a /predictions/user row as fixture + prediction for the scored slip. */
export function predictionAsReceiptPair(prediction) {
  const settled = hasPair(prediction?.actualHomeScore, prediction?.actualAwayScore);
  return {
    fixture: {
      id: prediction.matchId ?? prediction.id,
      homeTeam: prediction.homeTeam,
      awayTeam: prediction.awayTeam,
      date: prediction.date || prediction.matchDate,
      status: settled ? MATCH_STATUS.FINISHED : MATCH_STATUS.TIMED,
      homeScore: prediction.actualHomeScore,
      awayScore: prediction.actualAwayScore,
      actualHomeScorers: prediction.actualHomeScorers,
      actualAwayScorers: prediction.actualAwayScorers,
      gameweek: prediction.gameweek,
    },
    prediction,
  };
}

export function recordSearchPath(prediction) {
  const highlight = prediction?.matchId ?? prediction?.id ?? '';
  const q = `${prediction?.homeTeam || ''} ${prediction?.awayTeam || ''}`.trim();
  const params = new URLSearchParams({ tab: 'search', highlight: String(highlight) });
  if (q) params.set('q', q);
  return `/record?${params.toString()}`;
}
