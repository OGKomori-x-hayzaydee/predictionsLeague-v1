import { useMemo, useState } from 'react';
import PredictionRow from './PredictionRow';
import { callVerdict } from '../../utils/recordStats';

const OUTCOME_FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'exact', label: 'Exact' },
  { id: 'correct', label: 'Correct' },
  { id: 'wrong', label: 'Wrong' },
];

/**
 * Search/filter view — Spine.dc.html desktop lines 952-1028 (`REC.isSearch`),
 * mobile lines 2806-2859. Free-text team/scoreline search plus an outcome
 * filter over every call the user has ever filed.
 */
export default function SearchTab({ predictions }) {
  const [query, setQuery] = useState('');
  const [outcome, setOutcome] = useState('all');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return predictions
      .filter((p) => {
        if (q) {
          const haystack = `${p.homeTeam} ${p.awayTeam} ${p.homeScore}-${p.awayScore}`.toLowerCase();
          if (!haystack.includes(q)) return false;
        }
        if (outcome === 'all') return true;

        const isSettled = p.actualHomeScore !== null && p.actualHomeScore !== undefined;
        if (!isSettled) return false;
        const v = callVerdict(p);

        if (outcome === 'exact') return v?.verdict === 'EXACT';
        if (outcome === 'correct') return v?.verdict === 'EXACT' || v?.verdict === 'OUTCOME';
        if (outcome === 'wrong') return v?.verdict === 'MISSED';
        return true;
      })
      .sort((a, b) => (b.gameweek ?? 0) - (a.gameweek ?? 0));
  }, [predictions, query, outcome]);

  return (
    <div className="flex flex-col gap-3.5">
      <div className="flex flex-col gap-2.5 sm:flex-row">
        <input
          placeholder="Search a team or a scoreline…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-1 rounded-[10px] border border-border-control bg-surface-card-4 px-3.5 py-2.5 text-[13.5px] text-text-primary outline-none focus:border-brand-teal"
        />
        <div className="flex gap-0.5 rounded-9 border border-border-card bg-surface-card-4 p-[3px]">
          {OUTCOME_FILTERS.map((f) => (
            <button
              key={f.id}
              onClick={() => setOutcome(f.id)}
              className={`rounded-7 px-2.5 py-[7px] font-mono text-[10.5px] tracking-wide transition-colors ${
                outcome === f.id ? 'bg-surface-nav-active text-brand-teal' : 'text-text-muted-2 hover:text-text-primary'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <span className="font-mono text-[10.5px] text-text-muted-4">
        {filtered.length} call{filtered.length === 1 ? '' : 's'}
        {query ? ` matching “${query}”` : ''} · newest weeks first
      </span>

      <div className="flex flex-col gap-2">
        {filtered.length === 0 && <p className="text-sm text-text-muted-2">No matches.</p>}
        {filtered.slice(0, 60).map((p) => (
          <PredictionRow key={p.id || p.matchId} prediction={p} />
        ))}
      </div>
    </div>
  );
}
