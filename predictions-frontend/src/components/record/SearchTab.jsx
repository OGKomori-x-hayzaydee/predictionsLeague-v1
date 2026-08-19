import { useMemo, useState } from 'react';
import PredictionRow from './PredictionRow';

const OUTCOME_FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'exact', label: 'Exact' },
  { id: 'correct', label: 'Correct' },
  { id: 'wrong', label: 'Wrong' },
];

export default function SearchTab({ predictions }) {
  const [query, setQuery] = useState('');
  const [outcome, setOutcome] = useState('all');

  const filtered = useMemo(() => {
    return predictions.filter((p) => {
      const matchesQuery =
        !query ||
        `${p.homeTeam} ${p.awayTeam}`.toLowerCase().includes(query.toLowerCase());

      if (!matchesQuery) return false;
      if (outcome === 'all') return true;

      const isSettled = p.actualHomeScore !== null && p.actualHomeScore !== undefined;
      if (!isSettled) return false;

      const exact = p.homeScore === p.actualHomeScore && p.awayScore === p.actualAwayScore;
      if (outcome === 'exact') return exact;

      const actualWinner =
        p.actualHomeScore === p.actualAwayScore ? 'draw' : p.actualHomeScore > p.actualAwayScore ? 'home' : 'away';
      const predictedWinner = p.homeScore === p.awayScore ? 'draw' : p.homeScore > p.awayScore ? 'home' : 'away';
      const correctOutcome = actualWinner === predictedWinner;

      if (outcome === 'correct') return correctOutcome;
      if (outcome === 'wrong') return !correctOutcome;
      return true;
    });
  }, [predictions, query, outcome]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          placeholder="Search by team…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-1 rounded-md border border-border-control bg-surface-card-2 px-3 py-2 text-sm text-text-primary outline-none focus:border-brand-teal"
        />
        <div className="flex gap-1">
          {OUTCOME_FILTERS.map((f) => (
            <button
              key={f.id}
              onClick={() => setOutcome(f.id)}
              className={`rounded-full px-3 py-1.5 font-mono text-[11px] uppercase tracking-wide transition-colors ${
                outcome === f.id ? 'bg-brand-teal/15 text-brand-teal' : 'text-text-muted-2 hover:text-text-primary'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        {filtered.length === 0 && <p className="text-sm text-text-muted-2">No matches.</p>}
        {filtered.map((p) => (
          <PredictionRow key={p.id || p.matchId} prediction={p} />
        ))}
      </div>
    </div>
  );
}
