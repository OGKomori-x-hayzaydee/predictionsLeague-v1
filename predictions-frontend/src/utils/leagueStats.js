/**
 * League-detail derived stats — Leagues screen only.
 *
 * Everything here is pure arithmetic over two real backend shapes:
 *  - LeagueStanding.LeagueMember[] (id/username/displayName/position/points/
 *    predictions/joinedAt/isCurrentUser/isAdmin) — authoritative season
 *    totals, from GET /leagues/{id}/standings.
 *  - LeaguePredictionSummary[] per gameweek (homeTeam/awayTeam/homeScore/
 *    awayScore/actualHomeScore/actualAwayScore/correct/points/chips/predictedAt) — every member's
 *    filed calls for one gameweek, from GET /leagues/{id}/predictions/{gw}.
 *
 * The Leagues prototype (buildLeagues()/buildLeaguesMobile() in the Spine)
 * drives its head-to-head radar, position chart, records and activity feed
 * off a hand-authored 23-week fake history (LG_LEAGUES/LG_M/LG_F23). None of
 * that exists here — instead this module reconstructs the same *shape* of
 * insight (per-gameweek totals, exact-call counts, chip usage, weekly
 * head-to-head, cumulative rank history) by fetching every settled
 * gameweek's real prediction summaries for the league and reducing them.
 * With a young league this will legitimately be sparse — callers must
 * render honest empty states rather than padding it out.
 */

import { CHIP_CONFIG } from './chipManager';
import { extractMatchId, REVERSE_CHIP_MAPPING } from './backendMappings';
import { resolveActualScores } from './matchResult';

/** How many trailing gameweeks of league history to pull (bounded so
 * opening a mature league doesn't fire 30+ parallel requests). */
export const MAX_HISTORY_GAMEWEEKS = 20;

export function ordinal(n) {
  if (n == null) return '—';
  const v = Math.abs(n) % 100;
  if (v >= 11 && v <= 13) return `${n}th`;
  switch (v % 10) {
    case 1: return `${n}st`;
    case 2: return `${n}nd`;
    case 3: return `${n}rd`;
    default: return `${n}th`;
  }
}

export function timeAgo(iso) {
  if (!iso) return '';
  const diffMs = Date.now() - new Date(iso).getTime();
  if (Number.isNaN(diffMs)) return '';
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return 'now';
  if (mins < 60) return `${mins}m`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d`;
  const weeks = Math.floor(days / 7);
  return `${weeks}w`;
}

export function formatMonthYear(iso) {
  if (!iso) return '—';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '—';
  return d.toLocaleDateString('en-GB', { month: 'short', year: 'numeric' });
}

/** A small deterministic accent per league (hash of id) — presentation only,
 * three of the app's own semantic brand tokens so it stays theme-safe. */
const TONES = [
  { var: 'var(--color-brand-teal)', tint: 'color-mix(in srgb, var(--color-brand-teal) 18%, transparent)' },
  { var: 'var(--color-brand-indigo)', tint: 'color-mix(in srgb, var(--color-brand-indigo) 18%, transparent)' },
  { var: 'var(--color-brand-amber)', tint: 'color-mix(in srgb, var(--color-brand-amber) 18%, transparent)' },
];
export function leagueTone(id = '') {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0;
  return TONES[h % TONES.length];
}

/** Outcome verdict for one settled prediction — mirrors the backend's own
 * `correct` (exact scoreline) plus the same outcome-sign comparison
 * PredictionService.getPredictionScore() uses for draw/winner credit. */
export function verdictFor(p) {
  if (p.actualHomeScore == null || p.actualAwayScore == null) return null;
  if (p.correct) return 'exact';
  const co = Math.sign(p.homeScore - p.awayScore);
  const ao = Math.sign(p.actualHomeScore - p.actualAwayScore);
  if (co === ao) return ao === 0 ? 'draw' : 'winner';
  return 'miss';
}

const VERDICT_COLORS = {
  exact: { bg: '#0f766e33', border: '#14b8a680', fg: 'var(--color-brand-teal)' },
  draw: { bg: '#4f46e526', border: '#6366f166', fg: 'var(--color-brand-indigo-pale)' },
  winner: { bg: '#fcd34d17', border: '#fcd34d55', fg: 'var(--color-brand-amber)' },
  miss: { bg: 'var(--surface-card-4)', border: 'var(--border-card)', fg: 'var(--text-muted-3)' },
};
export function verdictColors(v) {
  return VERDICT_COLORS[v] || VERDICT_COLORS.miss;
}

/** First chip on a prediction, as a short badge — real chip data, backend
 * enum names translated through the same maps the rest of the app uses. */
export function chipBadge(chips) {
  if (!chips || chips.length === 0) return null;
  const frontendId = REVERSE_CHIP_MAPPING[chips[0]] || chips[0];
  const cfg = CHIP_CONFIG[frontendId];
  if (!cfg) return { tag: chips[0], name: chips[0] };
  return { tag: cfg.icon, name: cfg.name };
}

/** Polyline points for an SVG viewBox 0 0 w h — same recipe as the
 * prototype's lgSpark, generalised to any [min,max] series (used for the
 * rank-over-time chart, where lower rank is better). */
export function sparkPoints(series, w, h, { invert = false } = {}) {
  if (!series || series.length === 0) return '';
  const max = Math.max(...series);
  const min = Math.min(...series);
  const span = Math.max(1, max - min);
  const step = series.length > 1 ? w / (series.length - 1) : 0;
  return series
    .map((v, i) => {
      const t = (v - min) / span;
      const y = invert ? 1.5 + t * (h - 3) : 1.5 + (1 - t) * (h - 3);
      return `${(i * step).toFixed(2)},${y.toFixed(2)}`;
    })
    .join(' ');
}

/** Six fixed spoke coordinates for the head-to-head radar (unit circle,
 * radius 52, centred at 60,60 — matches the prototype's radar geometry). */
export function radarAxes(count = 6) {
  return Array.from({ length: count }, (_, k) => {
    const a = ((-90 + (k * 360) / count) * Math.PI) / 180;
    return { x: (60 + 52 * Math.cos(a)).toFixed(1), y: (60 + 52 * Math.sin(a)).toFixed(1) };
  });
}

/** Polygon `points` for one side (you/them) of the radar, normalised per
 * axis against the larger of the two values (so the stronger side always
 * reaches the outer ring on that axis). */
export function radarPolygon(rows, side) {
  return rows
    .map((r, k) => {
      const mx = Math.max(r.you, r.them, 1);
      const val = side === 'you' ? r.you : r.them;
      const a = ((-90 + (k * 360) / rows.length) * Math.PI) / 180;
      const rad = 10 + (val / mx) * 42;
      return `${(60 + rad * Math.cos(a)).toFixed(1)},${(60 + rad * Math.sin(a)).toFixed(1)}`;
    })
    .join(' ');
}

/**
 * Reduces the fetched gameweek range into everything the Overview/Form-book
 * views need. `predictionsByGw` is `{ [gw]: LeaguePredictionSummary[] }`.
 */
export function aggregateLeagueSeason({ predictionsByGw, gwOrder, standings }) {
  const usernames = standings.map((m) => m.username);
  const gwTotals = {}; // username -> { gw: points }
  const gwFiledCount = {}; // username -> { gw: count }
  const exactCount = {};
  const drawCallCount = {};
  const chipPlays = {}; // username -> [{gw, matchId, chip, points, homeTeam, awayTeam, predictedAt}]
  const bestCall = {}; // username -> {points, gw, matchId, homeTeam, awayTeam}
  const fixturesByGw = {}; // gw -> [{matchId, homeTeam, awayTeam, actualHomeScore, actualAwayScore}]
  const settledGws = [];

  usernames.forEach((u) => {
    gwTotals[u] = {};
    gwFiledCount[u] = {};
  });

  gwOrder.forEach((gw) => {
    const preds = predictionsByGw[gw] || [];
    const fixMap = new Map();

    preds.forEach((p) => {
      const u = p.username;
      if (!(u in gwTotals)) return;
      gwFiledCount[u][gw] = (gwFiledCount[u][gw] || 0) + 1;

      const pts = p.points ?? 0;
      gwTotals[u][gw] = (gwTotals[u][gw] || 0) + pts;

      const v = verdictFor(p);
      if (v === 'exact') exactCount[u] = (exactCount[u] || 0) + 1;
      if (p.homeScore === p.awayScore) drawCallCount[u] = (drawCallCount[u] || 0) + 1;

      if (p.chips && p.chips.length > 0) {
        chipPlays[u] = chipPlays[u] || [];
        chipPlays[u].push({
          gw,
          matchId: p.matchId,
          chips: p.chips,
          points: pts,
          homeTeam: p.homeTeam,
          awayTeam: p.awayTeam,
          predictedAt: p.predictedAt,
        });
      }

      if (v && (!bestCall[u] || pts > bestCall[u].points)) {
        bestCall[u] = { points: pts, gw, matchId: p.matchId, homeTeam: p.homeTeam, awayTeam: p.awayTeam, chips: p.chips };
      }

      if (!fixMap.has(p.matchId)) {
        fixMap.set(p.matchId, {
          matchId: p.matchId,
          homeTeam: p.homeTeam,
          awayTeam: p.awayTeam,
          actualHomeScore: p.actualHomeScore,
          actualAwayScore: p.actualAwayScore,
        });
      }
    });

    const fixList = Array.from(fixMap.values()).sort((a, b) => a.matchId - b.matchId);
    fixturesByGw[gw] = fixList;
    const isSettled = fixList.length > 0 && fixList.every((f) => f.actualHomeScore != null && f.actualAwayScore != null);
    if (isSettled) settledGws.push(gw);
  });

  return { usernames, gwTotals, gwFiledCount, exactCount, drawCallCount, chipPlays, bestCall, fixturesByGw, settledGws };
}

/** Cumulative-points rank per member for every settled gameweek, in order —
 * the real "position, week by week" series behind the chart and the
 * "longest run at #1" record. */
export function computeStandingsHistory({ gwTotals, settledGws, usernames }) {
  const sorted = [...settledGws].sort((a, b) => a - b);
  const running = {};
  usernames.forEach((u) => { running[u] = 0; });
  return sorted.map((gw) => {
    usernames.forEach((u) => { running[u] += gwTotals[u]?.[gw] ?? 0; });
    const ranked = [...usernames].sort((a, b) => running[b] - running[a]);
    const ranks = {};
    ranked.forEach((u, i) => { ranks[u] = i + 1; });
    return { gw, ranks, cumulative: { ...running } };
  });
}

export function buildRecords({ standings, gwTotals, bestCall, settledGws, gwFiledCount, fixturesByGw, history }) {
  const memberOf = (u) => standings.find((s) => s.username === u);
  const nameOf = (u) => memberOf(u)?.displayName || u;
  const avatarOf = (u) => memberOf(u)?.avatar;
  if (settledGws.length === 0) return [];

  const records = [];

  // Highest single gameweek
  let best = null;
  standings.forEach((m) => {
    settledGws.forEach((gw) => {
      const v = gwTotals[m.username]?.[gw];
      if (v != null && (!best || v > best.val)) best = { val: v, who: m.username, gw };
    });
  });
  if (best) {
    records.push({
      label: 'HIGHEST GAMEWEEK',
      val: String(best.val),
      who: nameOf(best.who),
      avatar: avatarOf(best.who),
      note: `Gameweek ${best.gw}`,
    });
  }

  // Longest run at #1 (needs at least 2 settled weeks to mean anything)
  if (settledGws.length >= 2) {
    let bestUser = null, bestLen = 0, curUser = null, curLen = 0, curStartGw = null, bestStartGw = null, bestEndGw = null;
    history.forEach(({ gw, ranks }) => {
      const leader = Object.keys(ranks).find((u) => ranks[u] === 1);
      if (leader === curUser) curLen += 1;
      else { curUser = leader; curLen = 1; curStartGw = gw; }
      if (curLen > bestLen) { bestLen = curLen; bestUser = curUser; bestStartGw = curStartGw; bestEndGw = gw; }
    });
    if (bestUser) {
      records.push({
        label: 'LONGEST RUN AT THE TOP',
        val: `${bestLen} wk${bestLen === 1 ? '' : 's'}`,
        who: nameOf(bestUser),
        avatar: avatarOf(bestUser),
        note: bestStartGw === bestEndGw ? `Gameweek ${bestStartGw}` : `GW${bestStartGw} to GW${bestEndGw}`,
      });
    }
  }

  // Best single call
  let bestSingle = null;
  Object.entries(bestCall).forEach(([u, c]) => {
    if (!bestSingle || c.points > bestSingle.points) bestSingle = { ...c, who: u };
  });
  if (bestSingle && bestSingle.points > 0) {
    records.push({
      label: 'BEST SINGLE CALL',
      val: `+${bestSingle.points}`,
      who: nameOf(bestSingle.who),
      avatar: avatarOf(bestSingle.who),
      note: `${bestSingle.homeTeam} v ${bestSingle.awayTeam}, GW${bestSingle.gw}`,
    });
  }

  // Worst gameweek among members who filed every fixture that week
  let worst = null;
  standings.forEach((m) => {
    settledGws.forEach((gw) => {
      const total = gwTotals[m.username]?.[gw];
      const filed = gwFiledCount[m.username]?.[gw] || 0;
      const fixtureCount = fixturesByGw[gw]?.length || 0;
      if (total == null || fixtureCount === 0 || filed < fixtureCount) return;
      if (!worst || total < worst.val) worst = { val: total, who: m.username, gw };
    });
  });
  if (worst) {
    records.push({
      label: 'WORST GAMEWEEK',
      val: String(worst.val),
      who: nameOf(worst.who),
      avatar: avatarOf(worst.who),
      note: `Gameweek ${worst.gw}, every call filed`,
    });
  }

  return records;
}

export function buildHeadToHead({ rival, you, gwTotals, exactCount, drawCallCount, chipPlays, settledGws }) {
  const yourExact = exactCount[you.username] || 0;
  const theirExact = exactCount[rival.username] || 0;
  const yourDraws = drawCallCount[you.username] || 0;
  const theirDraws = drawCallCount[rival.username] || 0;
  const yourWeeks = settledGws.map((gw) => gwTotals[you.username]?.[gw] ?? 0);
  const theirWeeks = settledGws.map((gw) => gwTotals[rival.username]?.[gw] ?? 0);
  const yourBest = yourWeeks.length ? Math.max(...yourWeeks) : 0;
  const theirBest = theirWeeks.length ? Math.max(...theirWeeks) : 0;
  const yourChips = (chipPlays[you.username] || []).length;
  const theirChips = (chipPlays[rival.username] || []).length;
  let weeksWonYou = 0, weeksWonThem = 0;
  settledGws.forEach((gw) => {
    const y = gwTotals[you.username]?.[gw] ?? 0;
    const t = gwTotals[rival.username]?.[gw] ?? 0;
    if (y > t) weeksWonYou += 1;
    else if (t > y) weeksWonThem += 1;
  });

  const row = (label, a, b) => {
    const max = Math.max(a, b, 1);
    const tie = a === b, youWin = a > b;
    return {
      label, you: a, them: b,
      youW: `${((a / max) * 100).toFixed(0)}%`, themW: `${((b / max) * 100).toFixed(0)}%`,
      youBar: tie ? 'var(--text-muted-4)' : youWin ? 'var(--color-brand-teal)' : 'var(--border-card)',
      themBar: tie ? 'var(--text-muted-4)' : youWin ? 'var(--border-card)' : '#f87171',
      youFg: tie ? 'var(--text-muted-2)' : youWin ? 'var(--color-brand-teal)' : 'var(--text-muted-4)',
      themFg: tie ? 'var(--text-muted-2)' : youWin ? 'var(--text-muted-4)' : '#f87171',
    };
  };

  const tapeRows = [
    row('SEASON POINTS', you.points ?? 0, rival.points ?? 0),
    row('EXACT SCORELINES', yourExact, theirExact),
    row('DRAWS CALLED', yourDraws, theirDraws),
    row('BEST GAMEWEEK', yourBest, theirBest),
    row('CHIPS PLAYED', yourChips, theirChips),
    row('WEEKS WON H2H', weeksWonYou, weeksWonThem),
  ];

  const radarRows = [
    { label: 'EXACTS', you: yourExact, them: theirExact },
    { label: 'BEST GW', you: yourBest, them: theirBest },
    { label: 'CHIPS', you: yourChips, them: theirChips },
    { label: 'WEEKS WON', you: weeksWonYou, them: weeksWonThem },
    { label: 'DRAWS', you: yourDraws, them: theirDraws },
    { label: 'POINTS', you: you.points ?? 0, them: rival.points ?? 0 },
  ];

  const wins = tapeRows.filter((r) => r.you > r.them).length;
  const ties = tapeRows.filter((r) => r.you === r.them).length;
  const first = (rival.displayName || rival.username).split(' ')[0];
  let verdict;
  if (settledGws.length === 0) {
    verdict = `No settled gameweeks yet — nothing to separate you from ${first} until the first results land.`;
  } else if (wins >= 4) {
    verdict = `You take ${wins} of six categories against ${first}.`;
  } else if (wins === 3 && ties === 0) {
    verdict = `Three apiece with ${first} — this one is still open.`;
  } else if (wins + ties < 6 && wins < 3) {
    verdict = `${first} takes ${6 - wins - ties} of six${ties ? `, ${ties} tied` : ''}.`;
  } else {
    verdict = `Even with ${first} on ${ties} of six categories.`;
  }

  return {
    id: rival.id || rival.username,
    name: rival.displayName || rival.username,
    initial: (rival.displayName || rival.username).charAt(0).toUpperCase(),
    avatar: rival.avatar,
    youAvatar: you.avatar,
    tapeRows,
    radarRows,
    radarYou: radarPolygon(radarRows, 'you'),
    radarThem: radarPolygon(radarRows, 'them'),
    verdict,
    gap: (you.points ?? 0) - (rival.points ?? 0),
  };
}

/** Honest one-line summary of how "you" did in the latest settled
 * gameweek, for the podium card footer — real rank/total, no narrative. */
export function buildPodiumNote({ latestSettledGw, podium, you, youGwTotal, youGwRank }) {
  if (!latestSettledGw || !you || youGwRank == null) return undefined;
  if (youGwRank === 1) return `You took the week on ${youGwTotal} pts.`;
  const winner = podium[0];
  const behind = Math.max(0, (winner?.gwTotal ?? 0) - youGwTotal);
  const winnerName = winner ? (winner.isCurrentUser ? 'yourself' : (winner.displayName || winner.username).split(' ')[0]) : 'the leader';
  return `You finished ${ordinal(youGwRank)} on ${youGwTotal} pts, ${behind} behind ${winnerName}.`;
}

/** Neighbours immediately above/below you in the real standings, plus a
 * one-line honest verdict — no fabricated narrative, just the real gap. */
export function standingsNeighbors(standings, you) {
  if (!you) return { above: null, below: null, gapAbove: 0, gapBelow: 0, verdict: '' };
  const sorted = [...standings].sort((a, b) => (a.position ?? 999) - (b.position ?? 999));
  const idx = sorted.findIndex((m) => m.username === you.username);
  const above = idx > 0 ? sorted[idx - 1] : null;
  const below = idx >= 0 && idx < sorted.length - 1 ? sorted[idx + 1] : null;
  const gapAbove = above ? (above.points ?? 0) - (you.points ?? 0) : 0;
  const gapBelow = below ? (you.points ?? 0) - (below.points ?? 0) : 0;
  const verdict = above
    ? `${gapAbove} point${gapAbove === 1 ? '' : 's'} off ${(above.displayName || above.username).split(' ')[0]}.`
    : 'Top of the league.';
  return { above, below, gapAbove, gapBelow, verdict };
}

/** Movement in cumulative rank across the fetched settled-gameweek window —
 * real (same history the position chart uses), not a "since day one" claim
 * unless the window happens to start at the league's first gameweek. */
export function moveSince(history, username) {
  if (!history || history.length < 2 || !username) return { label: '', tone: 'muted', delta: 0 };
  const first = history[0].ranks[username];
  const last = history[history.length - 1].ranks[username];
  if (first == null || last == null) return { label: '', tone: 'muted', delta: 0 };
  const delta = first - last; // positive = climbed
  const gwLabel = `GW${history[0].gw}`;
  if (delta > 0) return { label: `up ${delta} since ${gwLabel}`, tone: 'up', delta };
  if (delta < 0) return { label: `down ${Math.abs(delta)} since ${gwLabel}`, tone: 'down', delta };
  return { label: `level since ${gwLabel}`, tone: 'muted', delta: 0 };
}

export function buildActivityFeed({ standings, chipPlays, leagueName }) {
  const events = [];
  const nameFor = (m) => (m.isCurrentUser ? 'You' : m.displayName || m.username);

  standings.forEach((m) => {
    if (m.joinedAt) {
      events.push({
        who: nameFor(m),
        avatar: m.avatar,
        text: `joined ${leagueName}`,
        at: m.joinedAt,
        time: timeAgo(m.joinedAt),
        tone: 'var(--text-muted-3)',
      });
    }
  });

  Object.entries(chipPlays).forEach(([username, plays]) => {
    const member = standings.find((s) => s.username === username);
    plays.forEach((p) => {
      const badge = chipBadge(p.chips);
      events.push({
        who: nameFor(member || { username, displayName: username }),
        avatar: member?.avatar,
        text: `played ${badge?.name || 'a chip'} in GW${p.gw}`,
        at: p.predictedAt,
        time: p.predictedAt ? timeAgo(p.predictedAt) : `GW${p.gw}`,
        tone: 'var(--color-brand-amber)',
      });
    });
  });

  events.sort((a, b) => new Date(b.at || 0) - new Date(a.at || 0));
  return events.slice(0, 8);
}

function preferDefined(current, incoming) {
  return incoming != null ? incoming : current ?? null;
}

function preferScorers(current, incoming) {
  if (Array.isArray(incoming) && incoming.length) return incoming;
  return current || [];
}

function formBookMatchId(entry) {
  if (!entry) return null;
  const raw = extractMatchId(entry) ?? entry.matchId ?? entry.id;
  const id = Number(raw);
  return Number.isFinite(id) ? id : null;
}

function upsertFormBookFixture(fixMap, entry) {
  const matchId = formBookMatchId(entry);
  if (matchId == null) return;
  const existing = fixMap.get(matchId);
  fixMap.set(matchId, {
    matchId,
    homeTeam: entry.homeTeam || existing?.homeTeam,
    awayTeam: entry.awayTeam || existing?.awayTeam,
    actualHomeScore: preferDefined(existing?.actualHomeScore, entry.actualHomeScore),
    actualAwayScore: preferDefined(existing?.actualAwayScore, entry.actualAwayScore),
    actualHomeScorers: preferScorers(existing?.actualHomeScorers, entry.actualHomeScorers),
    actualAwayScorers: preferScorers(existing?.actualAwayScorers, entry.actualAwayScorers),
  });
}

/** Real per-gameweek grid for the Form book (desktop 12×N grid / mobile
 * by-member / by-fixture panels) — fixtures + every member's call. */
export function buildFormBook({ predictionsByGw, gw, standings, mode, gwFixtures = [] }) {
  const preds = predictionsByGw[gw] || [];
  const byUserFixture = new Map(); // `${username}|${matchId}` -> prediction
  const fixMap = new Map();

  (gwFixtures || []).forEach((f) => {
    if (f?.gameweek != null && gw != null && Number(f.gameweek) !== Number(gw)) return;
    const actual = resolveActualScores(f, f.userPrediction);
    upsertFormBookFixture(fixMap, {
      matchId: formBookMatchId(f),
      homeTeam: f.homeTeam,
      awayTeam: f.awayTeam,
      actualHomeScore: actual.home,
      actualAwayScore: actual.away,
      actualHomeScorers: f.actualHomeScorers || f.userPrediction?.actualHomeScorers,
      actualAwayScorers: f.actualAwayScorers || f.userPrediction?.actualAwayScorers,
    });
  });

  preds.forEach((p) => {
    const matchId = formBookMatchId(p);
    if (matchId != null) byUserFixture.set(`${p.username}|${matchId}`, p);
    upsertFormBookFixture(fixMap, {
      matchId,
      homeTeam: p.homeTeam,
      awayTeam: p.awayTeam,
      actualHomeScore: p.actualHomeScore,
      actualAwayScore: p.actualAwayScore,
      actualHomeScorers: p.actualHomeScorers,
      actualAwayScorers: p.actualAwayScorers,
    });
  });
  const fixtures = Array.from(fixMap.values()).sort((a, b) => a.matchId - b.matchId);
  const isSettled = fixtures.length > 0 && fixtures.every((f) => f.actualHomeScore != null && f.actualAwayScore != null);

  const rows = [...standings]
    .sort((a, b) => (a.position ?? 999) - (b.position ?? 999))
    .map((m) => {
      let total = 0, filed = 0;
      const cells = fixtures.map((f) => {
        const p = byUserFixture.get(`${m.username}|${f.matchId}`);
        if (!p) return { filed: false, matchId: f.matchId };
        filed += 1;
        const merged = {
          ...p,
          actualHomeScore: p.actualHomeScore ?? f.actualHomeScore,
          actualAwayScore: p.actualAwayScore ?? f.actualAwayScore,
          actualHomeScorers: p.actualHomeScorers?.length ? p.actualHomeScorers : f.actualHomeScorers,
          actualAwayScorers: p.actualAwayScorers?.length ? p.actualAwayScorers : f.actualAwayScorers,
        };
        const v = verdictFor(merged);
        const pts = merged.points ?? 0;
        total += pts;
        const badge = chipBadge(merged.chips);
        return {
          filed: true,
          matchId: f.matchId,
          verdict: v,
          label: mode === 'points' ? (v ? (pts === 0 ? '0' : `+${pts}`) : '—') : `${merged.homeScore}–${merged.awayScore}`,
          points: pts,
          chip: badge?.tag || '',
          chipName: badge?.name || '',
          prediction: merged,
        };
      });
      return {
        id: m.id || m.username,
        username: m.username,
        name: m.isCurrentUser ? 'You' : m.displayName || m.username,
        initial: (m.displayName || m.username).charAt(0).toUpperCase(),
        avatar: m.avatar,
        isCurrentUser: !!m.isCurrentUser,
        position: m.position,
        filed,
        total,
        cells,
      };
    });

  return { gw, isSettled, fixtures, rows };
}

function signed(n) {
  return n > 0 ? `+${n}` : String(n);
}

/** Side-panel content for the selected member in the Form book (desktop
 * right rail / mobile "by member" panel) — real cells from buildFormBook,
 * reshaped for display. Other members' calls stay hidden ("sealed") until
 * the gameweek settles, matching the app's own filing-privacy rule. */
export function buildMemberPanel({ formBook, username }) {
  if (!formBook) return null;
  const member = formBook.rows.find((r) => r.username === username);
  const you = formBook.rows.find((r) => r.isCurrentUser);
  if (!member) return null;

  const exactCount = member.cells.filter((c) => c.verdict === 'exact').length;
  const stats = formBook.isSettled
    ? [
        { label: `GW${formBook.gw}`, val: member.total, fg: 'var(--color-brand-teal)' },
        { label: 'EXACT', val: exactCount, fg: 'var(--text-primary)' },
        !member.isCurrentUser && you
          ? { label: 'V YOU', val: signed(member.total - you.total), fg: member.total > you.total ? '#f87171' : 'var(--color-brand-teal)' }
          : null,
      ].filter(Boolean)
    : [
        { label: 'FILED', val: `${member.filed}/${formBook.fixtures.length}`, fg: member.filed === formBook.fixtures.length ? 'var(--color-brand-teal)' : 'var(--color-brand-amber)' },
      ];

  const sealed = !formBook.isSettled && !member.isCurrentUser;
  const sealedBody = member.filed === formBook.fixtures.length
    ? `${member.name} has filed all ${formBook.fixtures.length}. You'll see every call once this gameweek settles.`
    : `${member.name} has filed ${member.filed} of ${formBook.fixtures.length}. Nothing they've written is visible to anyone until the gameweek settles.`;

  const sheet = formBook.fixtures.map((f, n) => {
    const yourCell = you?.cells[n];
    const theirCell = member.cells[n];
    const theirScore = theirCell?.filed ? `${theirCell.prediction.homeScore}–${theirCell.prediction.awayScore}` : 'sealed';
    const yourScore = yourCell?.filed ? `${yourCell.prediction.homeScore}–${yourCell.prediction.awayScore}` : '—';
    return {
      match: `${f.homeTeam} v ${f.awayTeam}`,
      theirs: member.isCurrentUser ? '—' : sealed ? 'sealed' : theirScore,
      yours: yourScore,
      pts: formBook.isSettled && theirCell?.filed ? signed(theirCell.points) : '',
      isExact: theirCell?.verdict === 'exact',
    };
  });

  return {
    name: member.name,
    initial: member.initial,
    avatar: member.avatar,
    isCurrentUser: member.isCurrentUser,
    stats,
    sealed,
    sealedBody,
    sheetTitle: member.isCurrentUser ? 'YOUR CALLS' : "THEIR CALLS, AGAINST YOURS",
    sheetNote: `GW${formBook.gw}${member.position != null ? ` · #${member.position}` : ''} · ${formBook.isSettled ? 'scored' : 'pending'}`,
    sheet,
  };
}

/** Side-panel content for the selected fixture (desktop right rail / mobile
 * "by fixture" panel) — real per-member calls for one match. */
export function buildFixturePanel({ formBook, matchId }) {
  if (!formBook) return null;
  const idx = formBook.fixtures.findIndex((f) => f.matchId === matchId);
  if (idx < 0) return null;
  const f = formBook.fixtures[idx];

  const filedRows = formBook.rows.filter((r) => r.cells[idx]?.filed);
  const state = formBook.isSettled
    ? `Finished ${f.actualHomeScore}–${f.actualAwayScore} · ${filedRows.length} calls in`
    : `Open · ${filedRows.length} of ${formBook.rows.length} have called it`;

  let spread = [];
  if (formBook.isSettled) {
    const counts = {};
    filedRows.forEach((r) => {
      const c = r.cells[idx];
      const label = `${c.prediction.homeScore}–${c.prediction.awayScore}`;
      counts[label] = (counts[label] || 0) + 1;
    });
    const actualKey = `${f.actualHomeScore}–${f.actualAwayScore}`;
    spread = Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .map(([label, n]) => ({
        label,
        count: `${n} call${n === 1 ? '' : 's'}`,
        pct: `${Math.round((n / Math.max(1, filedRows.length)) * 100)}%`,
        color: label === actualKey ? 'var(--color-brand-teal)' : 'var(--border-control)',
        labelFg: label === actualKey ? 'var(--color-brand-teal)' : 'var(--text-muted-1)',
      }));
  }

  const calls = formBook.rows.map((r) => {
    const c = r.cells[idx];
    return {
      name: r.name,
      username: r.username,
      initial: r.initial,
      avatar: r.avatar,
      isCurrentUser: r.isCurrentUser,
      call: c?.filed ? `${c.prediction.homeScore}–${c.prediction.awayScore}` : 'not filed',
      verdict: c?.verdict || null,
      pts: formBook.isSettled && c?.filed ? signed(c.points) : '',
    };
  });

  return {
    title: `${f.homeTeam} v ${f.awayTeam}`,
    state,
    spread,
    calls,
  };
}
