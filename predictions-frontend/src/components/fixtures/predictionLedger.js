import { CHIP_CONFIG } from '../../utils/chipManager';

/**
 * Real-data ledger rows for the prediction slip ("SCORELINE ONLY"/"EXACT +
 * ALL NAMED", scorer bonus, chip tag) — mirrors calculateCeilingPoints's
 * arithmetic (utils/pointsCalculation.js) for display purposes only, kept
 * local to fixtures rather than added to that shared util so the two files
 * stay decoupled.
 */
export function buildLedgerRows({ homeScore = 0, awayScore = 0, homeScorers = [], awayScorers = [], chips = [] }) {
  const totalGoals = homeScore + awayScore;
  const named = [...homeScorers, ...awayScorers].filter(Boolean);
  const perfect = totalGoals === 0 || named.length === totalGoals;
  const base = perfect ? 15 : 10;
  const chipIds = [...new Set(chips || [])];
  const rows = [
    {
      label: totalGoals === 0 ? 'EXACT 0–0' : perfect ? 'EXACT + ALL NAMED' : 'SCORELINE ONLY',
      value: `+${base}`,
    },
  ];

  if (named.length > 0) {
    const per = chipIds.includes('scorerFocus') ? 4 : 2;
    rows.push({
      label: `${named.length} ${named.length === 1 ? 'SCORER' : 'SCORERS'}`,
      value: `+${named.length * per}`,
    });
  }

  for (const chipId of chipIds) {
    const chip = CHIP_CONFIG[chipId];
    if (chip) rows.push({ label: chip.name.toUpperCase(), value: chip.icon });
  }

  return rows;
}

export function namedScorers(homeScorers = [], awayScorers = []) {
  const out = [...(homeScorers || []), ...(awayScorers || [])].filter(Boolean);
  // #region agent log
  fetch('http://127.0.0.1:7884/ingest/5b69a062-42cb-4709-b82f-88feef295885',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'ea7fb4'},body:JSON.stringify({sessionId:'ea7fb4',runId:'post-fix',hypothesisId:'B',location:'predictionLedger.js:namedScorers',message:'namedScorers io',data:{home:homeScorers||[],away:awayScorers||[],out,homeLen:(homeScorers||[]).length,awayLen:(awayScorers||[]).length,sameRef:homeScorers!=null&&homeScorers===awayScorers},timestamp:Date.now()})}).catch(()=>{});
  // #endregion
  return out;
}

/** One entry per distinct name, first-seen order. Braces become count > 1. */
export function collapseScorerCounts(names = []) {
  const counts = new Map();
  for (const name of names) {
    if (!name) continue;
    counts.set(name, (counts.get(name) || 0) + 1);
  }
  return Array.from(counts, ([name, count]) => ({
    name,
    count,
    label: count > 1 ? `${name} ×${count}` : name,
  }));
}

// Placeholder scorer options (ScorerSelect.jsx's EXTRA_OPTIONS) that don't
// count as a "named" scorer in the sentence below.
const EXTRA_SCORER_NAMES = ['Own goal', 'Not sure yet'];

/**
 * "Liverpool 2, Man City 1 — Liverpool to win, with Salah, Gakpo and Haaland
 * on the scoresheet." — the in-progress slip's descriptive read, matching
 * Spine.dc.html's `sentence` (script ~line 4274). Distinct from slipHeadline
 * above (the terser "edge past" newspaper style used once a prediction is
 * actually filed) — this is the live draft preview shown while filing.
 */
export function slipSentence(homeTeam, awayTeam, homeScore, awayScore, homeScorers = [], awayScorers = []) {
  const outcome =
    homeScore === awayScore ? 'a draw' : homeScore > awayScore ? `${homeTeam} to win` : `${awayTeam} to win`;
  const named = [...(homeScorers || []), ...(awayScorers || [])].filter(
    (n) => n && !EXTRA_SCORER_NAMES.includes(n)
  );
  const scorersClause = named.length
    ? `, with ${
        named.length > 2 ? `${named.slice(0, 2).join(', ')} and ${named[2]}` : named.join(' and ')
      } on the scoresheet.`
    : '.';
  return `${homeTeam} ${homeScore}, ${awayTeam} ${awayScore} — ${outcome}${scorersClause}`;
}

/**
 * "Arsenal edge past Chelsea, 2-1" style headline, matching Spine.dc.html's
 * headlineFor() (script ~line 4150) — pure string formatting over the
 * user's own real scoreline, not a fabricated read.
 */
export function slipHeadline(homeTeam, awayTeam, homeScore, awayScore) {
  if (homeScore == null || awayScore == null) return `${homeTeam} v ${awayTeam}`;
  if (homeScore === awayScore) {
    return homeScore === 0
      ? `${homeTeam} and ${awayTeam} play out a stalemate`
      : `${homeTeam} and ${awayTeam} share a ${homeScore}-${awayScore} thriller`;
  }
  const winner = homeScore > awayScore ? homeTeam : awayTeam;
  const loser = homeScore > awayScore ? awayTeam : homeTeam;
  const winnerScore = Math.max(homeScore, awayScore);
  const loserScore = Math.min(homeScore, awayScore);
  const margin = winnerScore - loserScore;
  const score = homeScore > awayScore ? `${homeScore}-${awayScore}` : `${awayScore}-${homeScore}`;
  if (loserScore === 0) return `${winner} shut out ${loser}, ${winnerScore}-0`;
  if (margin >= 3) return `${winner} run riot past ${loser}, ${score}`;
  if (margin === 2) return `${winner} see off ${loser}, ${score}`;
  return `${winner} edge past ${loser}, ${score}`;
}
