/**
 * Illustrative preview data for the Leagues screen — used only when the
 * user opts into "Preview with example data" (see LeaguesPage.jsx). Field
 * shapes match what leagueAPI normalizes, so leagueStats.js can reduce
 * this the same way it reduces live standings + LeaguePredictionSummary[].
 *
 * Three leagues, 6–8 members each, distinct per-member calls across a
 * settled GW22 / GW23 and an open GW24 so every form-book cell state
 * (exact / draw / winner / miss / sealed / not-filed / chip) has an example.
 */

import { calculatePoints } from '../../utils/pointsCalculation';

const YOU = 'ayodeji';

function daysAgo(days) {
  return new Date(Date.now() - days * 86400000).toISOString();
}

function clamp(n) {
  return Math.max(0, Math.min(4, n));
}

function fx(matchId, homeTeam, awayTeam, actualHomeScore, actualAwayScore, actualHomeScorers = [], actualAwayScorers = []) {
  return { matchId, homeTeam, awayTeam, actualHomeScore, actualAwayScore, actualHomeScorers, actualAwayScorers };
}

const GW22 = [
  fx(2201, 'Arsenal', 'Chelsea', 2, 2, ['Havertz', 'Odegaard'], ['Jackson', 'Neto']),
  fx(2202, 'Liverpool', 'Man City', 0, 1, [], ['Haaland']),
  fx(2203, 'Man United', 'Tottenham', 0, 2, [], ['Maddison', 'Solanke']),
  fx(2204, 'Newcastle', 'Everton', 0, 2, [], ['Calvert-Lewin', 'McNeil']),
  fx(2205, 'Brighton Hove', 'Wolverhampton', 1, 2, ['Mitoma'], ['Cunha']),
  fx(2206, 'Fulham', 'West Ham', 2, 0, ['Iwobi', 'Muniz'], []),
  fx(2207, 'Brentford', 'Aston Villa', 1, 2, ['Wissa'], ['Watkins', 'Rogers']),
  fx(2208, 'Crystal Palace', 'Nottingham', 1, 0, ['Mateta'], []),
  fx(2209, 'Burnley', 'Leeds United', 0, 0, [], []),
  fx(2210, 'Bournemouth', 'Sunderland', 2, 1, ['Kluivert', 'Evanilson'], ['Isidor']),
];

const GW23 = [
  fx(2301, 'Arsenal', 'Aston Villa', 2, 1, ['Saka', 'Havertz'], ['Watkins']),
  fx(2302, 'Liverpool', 'Man City', 2, 1, ['Salah', 'Gakpo'], ['Haaland']),
  fx(2303, 'Man United', 'Tottenham', 0, 2, [], ['Son', 'Maddison']),
  fx(2304, 'Newcastle', 'Everton', 1, 0, ['Isak'], []),
  fx(2305, 'Brighton Hove', 'Wolverhampton', 3, 1, ['Welbeck', 'Mitoma', 'Joao Pedro'], ['Cunha']),
  fx(2306, 'Fulham', 'West Ham', 2, 0, ['Iwobi', 'Muniz'], []),
  fx(2307, 'Chelsea', 'Bournemouth', 1, 1, ['Palmer'], ['Kluivert']),
  fx(2308, 'Crystal Palace', 'Brentford', 2, 1, ['Mateta', 'Sarr'], ['Wissa']),
  fx(2309, 'Nottingham', 'Leeds United', 1, 0, ['Wood'], []),
  fx(2310, 'Burnley', 'Sunderland', 0, 0, [], []),
];

const GW24 = [
  fx(2401, 'Arsenal', 'Man United', null, null),
  fx(2402, 'Liverpool', 'Everton', null, null),
  fx(2403, 'Man City', 'Tottenham', null, null),
  fx(2404, 'Chelsea', 'Newcastle', null, null),
  fx(2405, 'Aston Villa', 'Brighton Hove', null, null),
  fx(2406, 'West Ham', 'Fulham', null, null),
  fx(2407, 'Brentford', 'Wolverhampton', null, null),
  fx(2408, 'Crystal Palace', 'Bournemouth', null, null),
  fx(2409, 'Nottingham', 'Burnley', null, null),
  fx(2410, 'Leeds United', 'Sunderland', null, null),
];

/** Crafted GW23 sheet for "you" in The Owls — mixed exact / winner / miss + a 2x. */
const OWLS_YOU_GW23 = [
  [2, 1],
  [2, 1],
  [1, 1],
  [1, 0],
  [2, 1],
  [2, 0],
  [1, 1],
  [1, 0],
  [1, 1],
  [0, 0],
];

function callFor(memberIndex, fixtureIndex, actualH, actualA, crafted) {
  if (crafted) return crafted[fixtureIndex];
  const h = clamp((actualH ?? 1) + ((memberIndex * 7 + fixtureIndex * 11) % 5) - 2);
  const a = clamp((actualA ?? 1) + ((memberIndex * 3 + fixtureIndex * 5) % 4) - 1);
  if (memberIndex > 0 && h === actualH && a === actualA) {
    return [clamp(h + (memberIndex % 2 === 0 ? 1 : 0)), clamp(a + (memberIndex % 2))];
  }
  return [h, a];
}

function chipsFor(memberIndex, fixtureIndex, gw) {
  if (gw === 23 && memberIndex === 0 && fixtureIndex === 1) return ['doubleDown'];
  if (gw === 23 && memberIndex === 1 && fixtureIndex === 0) return ['doubleDown'];
  if (gw === 23 && memberIndex === 2 && fixtureIndex === 4) return ['wildcard'];
  if (gw === 22 && memberIndex === 4 && fixtureIndex === 5) return ['scorerFocus'];
  if (gw === 22 && memberIndex === 0 && fixtureIndex === 1) return ['doubleDown'];
  return [];
}

function pred({ member, fixture, gw, homeScore, awayScore, chips, days }) {
  const settled = fixture.actualHomeScore != null;
  const row = {
    matchId: fixture.matchId,
    username: member.username,
    homeTeam: fixture.homeTeam,
    awayTeam: fixture.awayTeam,
    homeScore,
    awayScore,
    homeScorers: [],
    awayScorers: [],
    actualHomeScore: fixture.actualHomeScore,
    actualAwayScore: fixture.actualAwayScore,
    actualHomeScorers: fixture.actualHomeScorers || [],
    actualAwayScorers: fixture.actualAwayScorers || [],
    gameweek: gw,
    chips,
    predictedAt: daysAgo(days),
    status: settled ? 'complete' : 'pending',
  };
  if (settled) {
    row.correct = homeScore === fixture.actualHomeScore && awayScore === fixture.actualAwayScore;
    row.points = calculatePoints(row);
  } else {
    row.correct = null;
    row.points = null;
  }
  return row;
}

function member(username, displayName, { you = false, admin = false, joinedDays } = {}) {
  return {
    id: username,
    username,
    displayName,
    isCurrentUser: you,
    isAdmin: admin,
    joinedAt: daysAgo(joinedDays),
    predictions: 0,
  };
}

function filedCountFor(memberIndex, gw) {
  if (gw !== 24) return 10;
  if (memberIndex === 0) return 4;
  return Math.min(10, 3 + ((memberIndex * 3) % 8));
}

function buildPredictions(members, fixtures, gw, { craftedYou } = {}) {
  const out = [];
  members.forEach((m, mi) => {
    const filed = filedCountFor(mi, gw);
    fixtures.forEach((f, fi) => {
      if (fi >= filed) return;
      const [homeScore, awayScore] = callFor(mi, fi, f.actualHomeScore, f.actualAwayScore, mi === 0 ? craftedYou : null);
      out.push(
        pred({
          member: m,
          fixture: f,
          gw,
          homeScore,
          awayScore,
          chips: chipsFor(mi, fi, gw),
          days: gw === 24 ? 0.04 + mi * 0.02 : gw === 23 ? 3 + mi * 0.1 : 10 + mi * 0.1,
        })
      );
    });
  });
  return out;
}

function finalise(id, name, members, { isAdmin, rankDelta, createdAt, firstGameweek = 22 }) {
  const predictionsByGw = {
    22: buildPredictions(members, GW22, 22),
    23: buildPredictions(members, GW23, 23, { craftedYou: id === 'demo-owls' ? OWLS_YOU_GW23 : null }),
    24: buildPredictions(members, GW24, 24),
  };

  const totals = {};
  members.forEach((m) => { totals[m.username] = 0; });
  [22, 23].forEach((gw) => {
    predictionsByGw[gw].forEach((p) => {
      totals[p.username] += p.points ?? 0;
    });
  });

  const ranked = [...members].sort((a, b) => totals[b.username] - totals[a.username]);
  const standings = ranked.map((m, i) => ({
    ...m,
    position: i + 1,
    points: totals[m.username],
  }));

  const you = standings.find((m) => m.isCurrentUser);

  const overview = {
    id,
    name,
    description: '',
    members: standings.length,
    position: you?.position ?? null,
    points: you?.points ?? 0,
    joinCode: 'DEMO',
    isAdmin,
    type: 'PRIVATE',
    createdAt,
    firstGameweek,
    userPosition: you?.position ?? null,
    numberOfMembers: standings.length,
    rankDelta,
  };

  return {
    overview,
    standings,
    predictionsByGw,
    gwOrder: [22, 23, 24],
    currentGameweek: 24,
    selectedGw: 23,
  };
}

const OWLS_MEMBERS = [
  member('ayodeji', 'Ayodeji', { you: true, joinedDays: 620 }),
  member('onyeka', 'Onyeka', { joinedDays: 610 }),
  member('bisi', 'Bisi', { joinedDays: 600 }),
  member('tunde', 'Tunde', { joinedDays: 580 }),
  member('kemi', 'Kemi', { joinedDays: 540 }),
  member('femi', 'Femi', { joinedDays: 400 }),
  member('zainab', 'Zainab', { joinedDays: 210 }),
  member('musa', 'Musa', { joinedDays: 90 }),
];

const WORK_MEMBERS = [
  member('ayodeji', 'Ayodeji', { you: true, joinedDays: 400 }),
  member('dami', 'Dami', { admin: true, joinedDays: 410 }),
  member('ola', 'Ola', { joinedDays: 390 }),
  member('chioma', 'Chioma', { joinedDays: 360 }),
  member('ife', 'Ife', { joinedDays: 200 }),
  member('segun', 'Segun', { joinedDays: 120 }),
];

const FAMILY_MEMBERS = [
  member('ayodeji', 'Ayodeji', { you: true, admin: true, joinedDays: 700 }),
  member('tunde', 'Tunde', { joinedDays: 690 }),
  member('kemi', 'Kemi', { joinedDays: 690 }),
  member('bisi', 'Bisi', { joinedDays: 500 }),
  member('ngozi', 'Ngozi', { joinedDays: 300 }),
  member('dayo', 'Dayo', { joinedDays: 80 }),
];

const PACKS = {
  'demo-owls': finalise('demo-owls', 'The Owls', OWLS_MEMBERS, {
    isAdmin: false,
    rankDelta: 5,
    createdAt: '2023-08-12T10:00:00.000Z',
  }),
  'demo-work': finalise('demo-work', 'Work five-a-side', WORK_MEMBERS, {
    isAdmin: false,
    rankDelta: 4,
    createdAt: '2024-09-02T10:00:00.000Z',
  }),
  'demo-family': finalise('demo-family', 'Family', FAMILY_MEMBERS, {
    isAdmin: true,
    rankDelta: 3,
    createdAt: '2023-08-01T10:00:00.000Z',
  }),
};

export const DEMO_LEAGUES = Object.values(PACKS).map((p) => p.overview);

export function getDemoLeaguePack(id) {
  return PACKS[id] || null;
}

export const DEMO_CURRENT_GAMEWEEK = 24;
