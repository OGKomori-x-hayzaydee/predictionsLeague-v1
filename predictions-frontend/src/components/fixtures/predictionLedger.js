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
  const chipId = chips?.[0];
  const chip = chipId ? CHIP_CONFIG[chipId] : null;

  const rows = [
    {
      label: totalGoals === 0 ? 'EXACT 0–0' : perfect ? 'EXACT + ALL NAMED' : 'SCORELINE ONLY',
      value: `+${base}`,
    },
  ];

  if (named.length > 0) {
    const per = chipId === 'scorerFocus' ? 4 : 2;
    rows.push({
      label: `${named.length} ${named.length === 1 ? 'SCORER' : 'SCORERS'}`,
      value: `+${named.length * per}`,
    });
  }

  if (chip) {
    rows.push({ label: chip.name.toUpperCase(), value: chip.icon });
  }

  return rows;
}

export function namedScorers(homeScorers = [], awayScorers = []) {
  return [...(homeScorers || []), ...(awayScorers || [])].filter(Boolean);
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
