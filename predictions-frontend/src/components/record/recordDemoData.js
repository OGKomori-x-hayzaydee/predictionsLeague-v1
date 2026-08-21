/**
 * Illustrative "preview mode" data for the My Record page — used only when
 * the user explicitly opts into "Preview with example data" (see
 * RecordPage.jsx's `previewMode` state), never shown by default. Every
 * screen that consumes real predictions (`userPredictionsAPI.getAllUserPredictions`)
 * can swap in `DEMO_PREDICTIONS` here instead, so Season/All-time/Search all
 * render identically whether the data is real or illustrative. RecordPage's
 * preview button turns amber while this set is showing.
 *
 * Deliberately varied across EXACT / OUTCOME / MISSED verdicts, chip usage,
 * and gameweeks so every state (verdict colors, chip footer, "no scorer
 * named", goal-difference penalties) has at least one example to show.
 * Field shape mirrors exactly what userPredictionsAPI.js normalizes real
 * predictions into — see pointsCalculation.js for how these are scored.
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

export const DEMO_PREDICTIONS = [
  // GW23 — the "current" week, richest mix
  p(9001, 23, 'Arsenal', 'Chelsea', 1, 0, ['Saka'], [], 1, 1, ['Havertz'], ['Jackson'], []),
  p(9002, 23, 'Liverpool', 'Manchester City', 2, 1, ['Salah', 'Gakpo'], ['Haaland'], 2, 1, ['Salah', 'Gakpo'], ['Haaland'], ['doubleDown']),
  p(9003, 23, 'Manchester United', 'Tottenham', 0, 0, [], [], 2, 2, ['Bruno', 'Hojlund'], ['Son', 'Maddison'], []),
  p(9004, 23, 'Newcastle', 'Everton', 1, 0, ['Isak'], [], 0, 2, [], ['Calvert-Lewin', 'McNeil'], []),
  p(9005, 23, 'Brighton', 'Wolves', 2, 1, ['Welbeck'], ['Cunha'], 3, 1, ['Welbeck', 'Mitoma', 'Joao Pedro'], ['Cunha'], []),
  p(9006, 23, 'Fulham', 'West Ham', 1, 0, ['Jimenez'], [], 2, 0, ['Iwobi', 'Muniz'], [], ['scorerFocus']),

  // GW22 — best week on record
  p(9007, 22, 'Arsenal', 'Chelsea', 1, 1, ['Saka', 'Palmer'], [], 2, 2, ['Havertz', 'Odegaard', 'Jackson'], ['Neto'], []),
  p(9008, 22, 'Liverpool', 'Manchester City', 0, 1, [], ['Haaland'], 0, 1, [], ['Haaland'], []),
  p(9009, 22, 'Manchester United', 'Tottenham', 0, 0, ['goalless'], [], 0, 2, [], ['Maddison', 'Solanke'], []),
  p(9010, 22, 'Newcastle', 'Everton', 0, 2, [], ['Calvert-Lewin', 'McNeil'], 0, 2, [], ['Calvert-Lewin', 'McNeil'], []),
  p(9011, 22, 'Brighton', 'Wolves', 3, 1, ['Welbeck', 'Mitoma', 'Joao Pedro', 'Cunha'], [], 1, 2, ['Mitoma'], ['Cunha'], []),
  p(9012, 22, 'Fulham', 'West Ham', 1, 0, ['Jimenez'], [], 2, 0, ['Iwobi', 'Muniz'], [], ['doubleDown']),

  // GW12 — worst week on record
  p(9013, 12, 'Bournemouth', 'Southampton', 0, 2, ['Archer', 'Armstrong'], [], 0, 0, [], [], []),
  p(9014, 12, 'Leeds United', 'Burnley', 0, 0, ['goalless'], [], 1, 1, ['Rutter', 'Brun Larsen'], [], []),
  p(9015, 12, 'Nottingham Forest', 'Crystal Palace', 0, 1, [], [], 2, 0, [], [], []),
  p(9016, 12, 'Brentford', 'Aston Villa', 1, 1, [], [], 1, 2, [], [], []),

  // Sprinkled across other weeks for a fuller season-ridge and search list
  p(9017, 8, 'Chelsea', 'Arsenal', 2, 1, ['Palmer', 'Jackson'], ['Saka'], 2, 1, ['Palmer', 'Jackson'], ['Saka'], ['wildcard']),
  p(9018, 15, 'Manchester City', 'Liverpool', 1, 1, ['Haaland'], ['Salah'], 3, 3, ['Haaland', 'Foden', 'De Bruyne'], ['Salah', 'Gakpo', 'Diaz'], []),
  p(9019, 18, 'Tottenham', 'Newcastle', 2, 0, ['Son', 'Maddison'], [], 2, 0, ['Son', 'Maddison'], [], ['defensePlusPlus']),
  p(9020, 20, 'Everton', 'Fulham', 0, 0, [], [], 0, 0, [], [], []),
];

/**
 * Synthetic prior-season summary rows for the All-time tab's season-by-
 * season comparison — aggregate totals only (no per-match data, since we
 * have no real multi-season backend), used only in preview mode.
 */
export const DEMO_SEASON_HISTORY = [
  { season: '2022/23', points: 709, avgPerWeek: 31, rank: 9, totalTeams: 12 },
  { season: '2023/24', points: 721, avgPerWeek: 31, rank: 6, totalTeams: 12 },
];

/** Synthetic rank-over-time points (most recent last) for the rank-trajectory sparkline, preview mode only. */
export const DEMO_RANK_TRAJECTORY = [9, 8, 8, 7, 7, 6, 6, 5, 5, 4, 4, 4];

export const DEMO_RANK_NOTE =
  "You have not been outside the top six since Gameweek 6 of last season — the climb has been steady rather than sudden.";
