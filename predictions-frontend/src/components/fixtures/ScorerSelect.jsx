import { useEffect, useState } from 'react';

const EXTRA_OPTIONS = [
  { name: 'Own goal', meta: 'no scorer pts' },
  { name: 'Not sure yet', meta: 'decide later' },
];
const SKELETON_WIDTHS = ['78%', '62%', '84%', '55%', '70%'];

function ScorerSlot({ team, value, players, taken, align, onPick }) {
  const [open, setOpen] = useState(false);
  const loading = players === undefined;
  const options = loading ? [] : players || [];

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (event) => {
      if (event.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <div className="relative w-full">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-label={`${team} scorer slot`}
        className={`flex min-h-11 w-full cursor-pointer items-center gap-2 rounded-lg border px-3 py-1.5 text-left font-outfit text-xs md:text-sm transition-colors hover:border-brand-teal-mid ${
          value
            ? 'border-brand-teal-mid/40 bg-brand-teal-deep/15 text-brand-teal'
            : 'border-border-base bg-surface-header/70 text-text-muted'
        }`}
      >
        <span
          className={`h-2 w-2 shrink-0 rounded-full border-[1.5px] ${
            value ? 'border-brand-teal' : 'border-text-disabled'
          }`}
        />
        <span className="min-w-0 flex-1 truncate">{value || 'Pick scorer'}</span>
        <svg className="h-3 w-3 shrink-0 opacity-70" viewBox="0 0 15 15" fill="none">
          <path d="m4 6 3.5 3.5L11 6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {open && (
        <>
          {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions, jsx-a11y/click-events-have-key-events */}
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div
            role="listbox"
            className={`absolute top-[calc(100%+0.375rem)] z-30 flex max-h-56 w-48 max-w-[calc(100vw-2rem)] flex-col gap-0.5 overflow-auto rounded-xl border border-border-card bg-surface-card/95 p-1.5 shadow-2xl animate-[slotIn_.18s_ease_both] ${
              align === 'right' ? 'right-0' : 'left-0'
            }`}
          >
            {loading ? (
              <div className="flex flex-col gap-1.5 p-2">
                {SKELETON_WIDTHS.map((w, i) => (
                  <span
                    key={i}
                    style={{ width: w, backgroundSize: '11rem 100%' }}
                    className="h-3 rounded-xs bg-surface-track"
                  />
                ))}
                <span className="mt-1 font-outfit text-2xs tracking-[0.1em] text-text-muted">
                  LOADING SQUAD…
                </span>
              </div>
            ) : (
              <>
                {options.length === 0 && (
                  <div className="px-2.5 py-2 font-outfit text-xs text-text-muted">
                    No squad data available
                  </div>
                )}
                {options.map((p) => {
                  const dup = taken.includes(p.name) && p.name !== value;
                  const picked = p.name === value;
                  return (
                    <button
                      key={p.name}
                      type="button"
                      role="option"
                      aria-selected={picked}
                      onClick={() => {
                        onPick(p.name);
                        setOpen(false);
                      }}
                      className={`flex min-h-11 cursor-pointer items-center gap-2 rounded-md px-2.5 py-1.5 text-left font-outfit text-xs transition-colors hover:bg-surface-elevated ${
                        picked ? 'bg-brand-teal-deep/15 text-brand-teal' : 'text-text-secondary'
                      }`}
                    >
                      <span className="min-w-0 flex-1 truncate">{p.name}</span>
                      <span className={`shrink-0 font-outfit text-2xs ${dup ? 'text-text-muted' : 'text-brand-indigo'}`}>
                        {dup ? 'already' : p.position || ''}
                      </span>
                    </button>
                  );
                })}
                {EXTRA_OPTIONS.map((o) => (
                  <button
                    key={o.name}
                    type="button"
                    role="option"
                    aria-selected={value === o.name}
                    onClick={() => {
                      onPick(o.name);
                      setOpen(false);
                    }}
                    className="flex min-h-11 cursor-pointer items-center gap-2 rounded-md px-2.5 py-1.5 text-left font-outfit text-xs text-text-muted transition-colors hover:bg-surface-elevated"
                  >
                    <span className="min-w-0 flex-1 truncate">{o.name}</span>
                    <span className="shrink-0 font-outfit text-2xs text-text-muted">{o.meta}</span>
                  </button>
                ))}
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default function ScorerSelect({ team, goalCount, players, scorers, onChange, align = 'left' }) {
  if (goalCount === 0) return null;

  const setScorer = (index, name) => {
    const next = [...scorers];
    next[index] = name;
    onChange(next.slice(0, goalCount));
  };

  return (
    <div className="flex w-full flex-col gap-1.5">
      {Array.from({ length: goalCount }).map((_, i) => {
        const taken = scorers.filter((v, j) => j !== i && v);
        return (
          <ScorerSlot
            key={i}
            team={team}
            value={scorers[i] || ''}
            players={players}
            taken={taken}
            align={align}
            onPick={(name) => setScorer(i, name)}
          />
        );
      })}
    </div>
  );
}
