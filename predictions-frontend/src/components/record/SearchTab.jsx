import { useEffect, useMemo, useState } from 'react';
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
 *
 * `initialQuery`/`highlightId` come from RecordPage's URL-driven "Full
 * prediction" deep link (Season card -> here): when set, the query box is
 * seeded so the result reads as an actual filtered query (not just a scroll
 * target), and the matching row force-expands + scrolls into view + glows
 * (see PredictionRow's `highlighted` prop).
 */
export default function SearchTab({ predictions, initialQuery = '', highlightId }) {
  const [query, setQuery] = useState(initialQuery);
  const [outcome, setOutcome] = useState('all');

  // Only re-seed when a *new* deep link arrives (initialQuery changes),
  // never overwriting the user's own subsequent typing.
  useEffect(() => {
    if (initialQuery) setQuery(initialQuery);
  }, [initialQuery]);

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
          className="flex-1 rounded-[10px] border border-border-control bg-surface-card-4 px-4 py-3 text-sm text-text-primary outline-none focus:border-brand-teal"
        />
        {/* Desktop: segmented pill filter. Mobile: a compact dropdown
            (matches the reference screenshots — a full pill row doesn't fit
            comfortably next to the search box at phone widths). */}
        <div className="hidden gap-0.5 rounded-9 border border-border-card bg-surface-card-4 p-1 sm:flex">
          {OUTCOME_FILTERS.map((f) => (
            <button
              key={f.id}
              onClick={() => setOutcome(f.id)}
              className={`rounded-7 px-3.5 py-2.5 font-outfit text-xs tracking-wide transition-colors ${
                outcome === f.id ? 'bg-surface-nav-active text-brand-teal' : 'text-text-muted-2 hover:text-text-primary'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
        <select
          value={outcome}
          onChange={(e) => setOutcome(e.target.value)}
          className="rounded-9 border border-border-card bg-surface-card-4 px-3 py-2.5 font-outfit text-2xs tracking-wide text-text-secondary outline-none sm:hidden"
        >
          {OUTCOME_FILTERS.map((f) => (
            <option key={f.id} value={f.id}>
              {f.id === 'all' ? 'All calls' : f.label}
            </option>
          ))}
        </select>
      </div>

      <span className="font-outfit text-2xs text-text-muted-4">
        {filtered.length} call{filtered.length === 1 ? '' : 's'}
        {query ? ` matching “${query}”` : ''} · newest weeks first
      </span>

      <div className="flex flex-col gap-2">
        {filtered.length === 0 && <p className="text-sm text-text-muted-2">No matches.</p>}
        {filtered.slice(0, 60).map((p) => {
          const id = p.id || p.matchId;
          return <PredictionRow key={id} prediction={p} highlighted={highlightId != null && String(id) === String(highlightId)} />;
        })}
      </div>
    </div>
  );
}
