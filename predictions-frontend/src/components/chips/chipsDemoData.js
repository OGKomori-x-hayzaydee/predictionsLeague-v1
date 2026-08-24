/**
 * Illustrative Almanac data — Spine.dc.html SCHIPS (lines 4718-4738) and
 * RULES (4795-4802). Used only when ChipsPage preview is on, so the debrief
 * table, allowance column, and CHIP BY CHIP copy can be inspected without
 * a full season of real chip plays.
 *
 * Predictions use the same field shape as userPredictionsAPI / recordDemoData.
 * Sixteen chip-tagged calls (6 / 1 / 5 / 3 / 1) match the prototype's
 * "sixteen chips played" habit line; net/best/worst still come from
 * computeChipAlmanac so the table is exercising real scoring.
 */

function p(id, gameweek, homeTeam, awayTeam, homeScore, awayScore, homeScorers, awayScorers, actualHomeScore, actualAwayScore, actualHomeScorers, actualAwayScorers, chips = []) {
  return {
    id,
    matchId: id,
    gameweek,
    homeTeam,
    awayTeam,
    homeScore,
    awayScore,
    homeScorers,
    awayScorers,
    actualHomeScore,
    actualAwayScore,
    actualHomeScorers,
    actualAwayScorers,
    chips,
  };
}

/** Prototype SCHIPS.allowance — fictional season caps for preview only. */
export const DEMO_CHIP_ALLOWANCE = {
  doubleDown: 8,
  wildcard: 2,
  scorerFocus: 8,
  defensePlusPlus: 5,
  allInWeek: 2,
};

/** Sidebar blurb — SCHIPS.explain / forWhat, shown in live and preview. */
export const CHIP_ALMANAC_COPY = {
  doubleDown: {
    explain: 'Doubles everything one fixture earns you — the outcome, the scoreline and the scorers.',
    forWhat: 'Best on a fixture you expect to call exactly, not merely correctly.',
  },
  wildcard: {
    explain: 'Triples a single fixture. It can share a match with Double Down.',
    forWhat: 'Eight gameweeks off after you play it. A soft home win with two obvious scorers.',
  },
  scorerFocus: {
    explain: 'Doubles scorer points only in one fixture; the result points are untouched.',
    forWhat: 'High-scoring fixtures where you trust the scorers more than the line.',
  },
  defensePlusPlus: {
    explain: 'Pays five points for every clean sheet you called across the whole week.',
    forWhat: 'Weeks stacked with mismatches, where clean sheets are likely.',
  },
  allInWeek: {
    explain: 'Doubles every point in the gameweek, good and bad.',
    forWhat: 'Four uses a season, no cooldown. A week you have already read well — it doubles mistakes too.',
  },
};

/** Spine.dc.html RULES — Almanac "The rules, plainly". */
export const CHIP_ALMANAC_RULES = [
  'Stack as many chips on a match as cooldowns and caps allow, including both multipliers.',
  'Defence++ and All-In Week can both be on in the same gameweek; each spreads to every slip you file.',
  'Double Down cools down for 1 gameweek; Wildcard 8; Scorer Focus and Defence++ 6. All-In Week has no cooldown.',
  'All-In Week is the only chip with a season cap: four uses. The rest can be replayed after their cooldown.',
  'Multipliers scale scorer points as well as the result, so they reward exact calls.',
  'Defence++ settles before any multiplier is applied.',
  'A chip is reserved when you plan it and only spent when you file that gameweek.',
  'Unplayed chips are worth nothing at the final whistle. They do not carry over.',
];

export const DEMO_CHIP_PREDICTIONS = [
  // Double Down × 6 — GW14 is the high return, GW9 the low
  p(9101, 14, 'Arsenal', 'Manchester United', 2, 0, ['Saka', 'Odegaard'], [], 2, 0, ['Saka', 'Odegaard'], [], ['doubleDown']),
  p(9102, 9, 'Newcastle', 'Everton', 1, 0, [], [], 1, 0, ['Isak'], [], ['doubleDown']),
  p(9103, 3, 'Liverpool', 'Brentford', 2, 1, ['Salah'], [], 2, 1, ['Salah', 'Gakpo'], [], ['doubleDown']),
  p(9104, 7, 'Manchester United', 'Tottenham', 1, 0, [], [], 2, 0, ['Bruno'], [], ['doubleDown']),
  p(9105, 18, 'Brighton', 'Burnley', 3, 0, ['Welbeck', 'Mitoma'], [], 3, 0, ['Welbeck', 'Mitoma', 'Joao Pedro'], [], ['doubleDown']),
  p(9106, 21, 'Fulham', 'West Ham', 1, 0, ['Jimenez'], [], 1, 0, ['Jimenez'], [], ['doubleDown']),

  // Wildcard × 1 — GW6, unplayed since
  p(9107, 6, 'Chelsea', 'Arsenal', 2, 1, ['Palmer', 'Jackson'], ['Saka'], 2, 1, ['Palmer', 'Jackson'], ['Saka'], ['wildcard']),

  // Scorer Focus × 5 — GW11 high, GW17 miss
  p(9108, 11, 'Liverpool', 'Leeds United', 3, 1, ['Salah', 'Gakpo', 'Diaz'], ['Piroe'], 3, 1, ['Salah', 'Gakpo', 'Diaz'], ['Piroe'], ['scorerFocus']),
  p(9109, 17, 'Manchester City', 'Tottenham', 2, 2, ['Haaland', 'Foden'], ['Son'], 0, 1, [], ['Maddison'], ['scorerFocus']),
  p(9110, 5, 'Aston Villa', 'Brentford', 2, 0, ['Watkins'], [], 2, 0, ['Watkins', 'Rogers'], [], ['scorerFocus']),
  p(9111, 10, 'Crystal Palace', 'Nottingham Forest', 1, 0, ['Mateta'], [], 1, 0, ['Mateta'], [], ['scorerFocus']),
  p(9112, 16, 'Newcastle', 'Bournemouth', 2, 0, ['Isak', 'Gordon'], [], 2, 0, ['Isak', 'Gordon'], [], ['scorerFocus']),

  // Defence++ × 3 — GW4 pays, GW19 does not
  p(9113, 4, 'Arsenal', 'Burnley', 2, 0, ['Saka'], [], 2, 0, ['Saka', 'Havertz'], [], ['defensePlusPlus']),
  p(9114, 19, 'Chelsea', 'Liverpool', 1, 1, ['Palmer'], ['Salah'], 3, 2, ['Palmer', 'Jackson', 'Neto'], ['Salah', 'Diaz'], ['defensePlusPlus']),
  p(9115, 12, 'Manchester United', 'Everton', 1, 0, ['Bruno'], [], 1, 0, ['Bruno'], [], ['defensePlusPlus']),

  // All-In Week × 1 — GW8, unplayed since
  p(9116, 8, 'Manchester City', 'Southampton', 3, 0, ['Haaland', 'Foden'], [], 3, 0, ['Haaland', 'Foden', 'De Bruyne'], [], ['allInWeek']),
];
