import KickerLabel from '../ui/KickerLabel';

/**
 * One dropdown slot per goal scored, matching the prototype's
 * scorer-count-driven pattern. `players` is the team's squad list
 * ({name, position}[]) carried on the fixture object.
 */
export default function ScorerSelect({ team, goalCount, players, scorers, onChange }) {
  if (goalCount === 0) return null;

  const setScorer = (index, name) => {
    const next = [...scorers];
    next[index] = name;
    onChange(next.slice(0, goalCount));
  };

  return (
    <div>
      <KickerLabel as="div" className="mb-2">{team} scorers</KickerLabel>
      <div className="space-y-2">
        {Array.from({ length: goalCount }).map((_, i) => (
          <select
            key={i}
            value={scorers[i] || ''}
            onChange={(e) => setScorer(i, e.target.value)}
            className="w-full rounded-md border border-border-control bg-surface-card-2 px-3 py-2 text-sm text-text-primary outline-none focus:border-brand-teal"
          >
            <option value="">Goal {i + 1} — select scorer</option>
            {(players || []).map((p) => (
              <option key={p.name} value={p.name}>{p.name}</option>
            ))}
          </select>
        ))}
      </div>
    </div>
  );
}
