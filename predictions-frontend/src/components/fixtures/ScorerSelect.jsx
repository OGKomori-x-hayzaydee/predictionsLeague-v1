import { useState } from 'react';

const EXTRA_OPTIONS = [
  { name: 'Own goal', meta: 'no scorer pts' },
  { name: 'Not sure yet', meta: 'decide later' },
];
const SKELETON_WIDTHS = ['78%', '62%', '84%', '55%', '70%'];

function ScorerSlot({ team, value, players, taken, align, onPick }) {
  const [open, setOpen] = useState(false);
  const loading = players === undefined;
  const options = loading ? [] : players || [];

  return (
    <div className="relative w-full">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={`${team} scorer slot`}
        className={`flex w-full cursor-pointer items-center gap-2 rounded-lg border px-3 py-1.5 text-left font-outfit text-xs md:text-sm transition-colors hover:border-[#14b8a666] ${
          value
            ? 'border-[#14b8a666] bg-[#0f766e26] text-[#5eead4]'
            : 'border-[#1e3450] bg-[#0b1424b8] text-[#8fa0b8]'
        }`}
      >
        <span
          className={`w-2 h-2 shrink-0 rounded-full border-[1.5px] ${
            value ? 'border-[#5eead4]' : 'border-[#4f5b70]'
          }`}
        />
        <span className="min-w-0 flex-1 truncate">{value || 'Pick scorer'}</span>
        <svg className="w-3 h-3 shrink-0 opacity-70" viewBox="0 0 15 15" fill="none">
          <path d="m4 6 3.5 3.5L11 6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {open && (
        <>
          {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions, jsx-a11y/click-events-have-key-events */}
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div
            className={`absolute top-[calc(100%+0.375rem)] z-30 flex max-h-56 w-48 max-w-[calc(100vw-2rem)] flex-col gap-0.5 overflow-auto rounded-xl border border-[#22344e] bg-[#0a1220f2] p-1.5 shadow-2xl animate-[slotIn_.18s_ease_both] ${
              align === 'right' ? 'right-0' : 'left-0'
            }`}
          >
            {loading ? (
              <div className="flex flex-col gap-1.5 p-2">
                {SKELETON_WIDTHS.map((w, i) => (
                  <span
                    key={i}
                    style={{ width: w, backgroundSize: '11rem 100%' }}
                    className="h-3 animate-[shimmer_1.1s_linear_infinite] rounded-xs bg-[linear-gradient(90deg,#131f33,#1e2d45,#131f33)]"
                  />
                ))}
                <span className="mt-1 font-mono text-[0.625rem] tracking-[0.1em] text-[#4f5b70]">
                  LOADING SQUAD…
                </span>
              </div>
            ) : (
              <>
                {options.length === 0 && (
                  <div className="px-2.5 py-2 font-mono text-xs text-[#4f5b70]">
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
                      onClick={() => {
                        onPick(p.name);
                        setOpen(false);
                      }}
                      className={`flex cursor-pointer items-center gap-2 rounded-md px-2.5 py-1.5 text-left font-outfit text-xs transition-colors hover:bg-[#132238] ${
                        picked ? 'bg-[#0f766e26] text-[#5eead4]' : 'text-[#c8d2e0]'
                      }`}
                    >
                      <span className="min-w-0 flex-1 truncate">{p.name}</span>
                      <span className={`shrink-0 font-mono text-[0.625rem] ${dup ? 'text-[#5b667d]' : 'text-[#818cf8]'}`}>
                        {dup ? 'already' : p.position || ''}
                      </span>
                    </button>
                  );
                })}
                {EXTRA_OPTIONS.map((o) => (
                  <button
                    key={o.name}
                    type="button"
                    onClick={() => {
                      onPick(o.name);
                      setOpen(false);
                    }}
                    className="flex cursor-pointer items-center gap-2 rounded-md px-2.5 py-1.5 text-left font-outfit text-xs text-[#8fa0b8] transition-colors hover:bg-[#132238]"
                  >
                    <span className="min-w-0 flex-1 truncate">{o.name}</span>
                    <span className="shrink-0 font-mono text-[0.625rem] text-[#4f5b70]">{o.meta}</span>
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
