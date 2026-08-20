/**
 * Sample "AI overview" content for the Dashboard fixture-preview card —
 * predicted score, confidence, recent head-to-head record, and crowd picks.
 * There is no real odds/model/crowd-data service behind this yet (this app
 * has no team-form/odds/AI backend — see predictionsLeague-v1 dashboard
 * comments elsewhere), so everything below is deterministic *sample* data
 * seeded from the fixture itself: stable across re-renders and navigation,
 * different per fixture, but not a real prediction. Swap this module out
 * once a real data source exists — FixturePreviewCard is the only consumer.
 */

function seedFromString(str) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function mulberry32(seed) {
  let a = seed;
  return function rand() {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const FORM_LETTERS = ['W', 'D', 'L'];
const randomForm = (rand, length) =>
  Array.from({ length }, () => FORM_LETTERS[Math.floor(rand() * FORM_LETTERS.length)]).join('');

const BLURB_TEMPLATES = [
  () => `Both attacks are running hot and neither back line has kept a clean sheet recently — the model is unusually unsure here.`,
  ({ home, away }) => `${home} have the platform to control this at home, but ${away} have found a knack for nicking points on the road.`,
  () => `A tight one on paper — recent meetings have been decided by fine margins either way.`,
  ({ home, away }) => `${away} arrive out of form, but ${home}'s home record this season doesn't fully back the favourite tag.`,
];

/**
 * @param {{ id?: string|number, homeTeam: string, awayTeam: string, date?: string }} fixture
 */
export function getMatchInsight(fixture) {
  if (!fixture) return null;
  const seedKey = `${fixture.id ?? ''}|${fixture.homeTeam}|${fixture.awayTeam}|${fixture.date ?? ''}`;
  const rand = mulberry32(seedFromString(seedKey));

  const predictedHome = Math.floor(rand() * 3);
  const predictedAway = Math.floor(rand() * 3);
  const confidence = Math.round(18 + rand() * 30); // deliberately unconfident-looking, 18-48%

  const blurb = BLURB_TEMPLATES[Math.floor(rand() * BLURB_TEMPLATES.length)]({
    home: fixture.homeTeam,
    away: fixture.awayTeam,
  });

  const homeForm = randomForm(rand, 5);
  const awayForm = randomForm(rand, 5);

  const meetings = Array.from({ length: 5 }, () => FORM_LETTERS[Math.floor(rand() * 3)]);
  const homeWins = meetings.filter((r) => r === 'W').length;
  const draws = meetings.filter((r) => r === 'D').length;
  const awayWins = meetings.filter((r) => r === 'L').length;
  const goalsFor = 4 + Math.floor(rand() * 8);
  const goalsAgainst = 4 + Math.floor(rand() * 8);

  const rawHome = 0.8 + rand();
  const rawDraw = 0.6 + rand() * 0.8;
  const rawAway = 0.8 + rand();
  const sum = rawHome + rawDraw + rawAway;
  const homePct = Math.round((rawHome / sum) * 100);
  const drawPct = Math.round((rawDraw / sum) * 100);
  const awayPct = 100 - homePct - drawPct;
  const mostPicked = `${1 + Math.floor(rand() * 2)}-${Math.floor(rand() * 2)}`;

  return {
    predictedHome,
    predictedAway,
    confidence,
    blurb,
    homeForm,
    awayForm,
    meetings,
    meetingsSummary: `${fixture.homeTeam} ${homeWins} · drawn ${draws} · ${fixture.awayTeam} ${awayWins} · goals ${goalsFor}-${goalsAgainst}`,
    meetingsNote: `${goalsFor + goalsAgainst} goals in the last five meetings.`,
    crowd: [
      { label: `${fixture.homeTeam} win`, pct: homePct },
      { label: 'Draw', pct: drawPct },
      { label: `${fixture.awayTeam} win`, pct: awayPct },
    ],
    mostPicked,
  };
}

export default getMatchInsight;
