/**
 * Real gameweek-difficulty signal for the chip-strategy screen.
 *
 * The v2 prototype's soft/ok/firm/hard gauge (spec §1.8) is driven by a
 * hand-authored `diff` float per gameweek with hardcoded fixture narration
 * ("City v Arsenal, the hardest week of the run-in") for a hypothetical
 * 15-week run-in. There is no backend source for that: predictions-backend
 * has no standings/table/odds/rating data anywhere (checked
 * MatchRepository, TeamRepository, LeagueStanding — the latter is about
 * *user* prediction-league standings, not the real Premier League table).
 *
 * What IS real, app-wide, and independent of any single user's history:
 * predictions-backend only ever imports a fixture into `matches` if the
 * home OR away side is one of six clubs (TeamEntity.isBigSixTeam — see
 * APIService.updateFixtures(), `if (home.getIsBigSixTeam() ||
 * away.getIsBigSixTeam())`). That fixed six-club roster is the
 * real, non-fabricated classification this gauge keys off of.
 * A gameweek where several of those fixtures pit two Big Six sides against
 * each other (both teams from the six-club list) is a genuinely harder
 * week to call than one full of Big Six vs. lower-table fixtures — that's
 * "opponent strength", the class of signal this task explicitly allows.
 *
 * This only produces a real reading for a gameweek whose fixtures are
 * actually known (in practice: the current gameweek — the fixtures
 * endpoint only ever returns the current round, see FixtureService /
 * externalFixturesAPI doc comments). Every other week in the season
 * strip has no real fixture list yet, so callers must render an honest
 * "not released yet" placeholder for those instead of calling this.
 */

// Same six-club roster the backend tracks fixtures for.
export const BIG_SIX = ['Arsenal', 'Chelsea', 'Liverpool', 'Man City', 'Man United', 'Spurs'];

const TIER_ORDER = ['soft', 'ok', 'firm', 'hard'];

export const TIER_STYLE = {
  soft: { color: 'var(--brand-teal)', label: 'SOFT' },
  ok: { color: 'var(--brand-teal-pale)', label: 'OK' },
  firm: { color: 'var(--brand-amber)', label: 'FIRM' },
  hard: { color: 'var(--state-error)', label: 'HARD' },
};

function tierFromScore(score) {
  if (score < 0.36) return 'soft';
  if (score < 0.5) return 'ok';
  if (score < 0.62) return 'firm';
  return 'hard';
}

/**
 * @param {Array} fixtures - real fixtures for one gameweek ({homeTeam, awayTeam})
 * @param {(name: string) => string} normalizeTeamName
 * @returns {{tier: string, score: number, clashCount: number, total: number, style: object} | null}
 */
export function computeGameweekDifficulty(fixtures, normalizeTeamName) {
  if (!fixtures || fixtures.length === 0) return null;

  let weightSum = 0;
  let clashCount = 0;
  fixtures.forEach((f) => {
    const home = normalizeTeamName(f.homeTeam);
    const away = normalizeTeamName(f.awayTeam);
    const homeBig = BIG_SIX.includes(home);
    const awayBig = BIG_SIX.includes(away);
    if (homeBig && awayBig) {
      weightSum += 1;
      clashCount += 1;
    } else if (homeBig || awayBig) {
      weightSum += 0.42;
    } else {
      // Shouldn't happen given the backend's import filter, but don't let
      // an unexpected fixture silently skew the score to look harder.
      weightSum += 0.2;
    }
  });

  const score = weightSum / fixtures.length;
  const tier = tierFromScore(score);
  return { tier, score, clashCount, total: fixtures.length, style: TIER_STYLE[tier] };
}

export function isFixtureClash(fixture, normalizeTeamName) {
  const home = normalizeTeamName(fixture.homeTeam);
  const away = normalizeTeamName(fixture.awayTeam);
  return BIG_SIX.includes(home) && BIG_SIX.includes(away);
}

export { TIER_ORDER };
