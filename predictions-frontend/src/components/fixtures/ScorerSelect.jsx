import { useState } from 'react';

/**
 * Per-goal scorer slot + popover, matching Spine.dc.html's autocomplete
 * dropdown (desktop lines 349-380, mobile lines 2484-2513) — `slotIn`
 * entrance on the popover/rows and a `shimmer` skeleton for a genuine
 * loading state (when `players` hasn't resolved yet, e.g. mid-fetch),
 * never a fabricated delay. Options are the fixture's real squad
 * (name + position from the backend `Player` DTO); there is no
 * likely-to-score model on this backend, so the meta column shows the
 * player's real position instead of an invented percentage, and
 * "already" for a name picked in another slot on the same side.
 */
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
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={`${team} scorer slot`}
        className={`flex w-full items-center gap-[7px] rounded-9 border px-[10px] py-[7px] text-left font-outfit text-[12.5px] transition-colors hover:border-brand-teal-mid/40 ${
          value
            ? 'border-brand-teal-mid/40 bg-brand-teal-deep/15 text-brand-teal'
            : 'border-border-card bg-surface-card-4/80 text-text-muted-2'
        }`}
      >
        <span
          className={`h-1.5 w-1.5 shrink-0 rounded-full border-[1.5px] ${
            value ? 'border-brand-teal' : 'border-text-muted-5'
          }`}
        />
        <span className="min-w-0 flex-1 truncate">{value || 'Pick scorer'}</span>
        <svg width="11" height="11" viewBox="0 0 15 15" fill="none" className="shrink-0 opacity-70">
          <path d="m4 6 3.5 3.5L11 6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {open && (
        <>
          {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions, jsx-a11y/click-events-have-key-events */}
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div
            className={`absolute top-[calc(100%+6px)] z-20 flex max-h-[236px] w-[196px] max-w-[calc(100vw-32px)] flex-col gap-0.5 overflow-auto rounded-11 border border-border-dropdown bg-[#0a1220f2] p-1.5 shadow-dropdown animate-[slotIn_.18s_ease_both] ${
              align === 'right' ? 'right-0' : 'left-0'
            }`}
          >
            {loading ? (
              <div className="flex flex-col gap-1.5 p-1.5">
                {SKELETON_WIDTHS.map((w, i) => (
                  <span
                    key={i}
                    style={{ width: w, backgroundSize: '180px 100%' }}
                    className="h-[11px] animate-[shimmer_1.1s_linear_infinite] rounded-xs bg-[linear-gradient(90deg,#131f33,#1e2d45,#131f33)]"
                  />
                ))}
                <span className="mt-0.5 font-mono text-[10px] tracking-[0.1em] text-text-muted-5">
                  LOADING SQUAD…
                </span>
              </div>
            ) : (
              <>
                {options.length === 0 && (
                  <div className="px-2 py-2 font-mono text-[10px] text-text-muted-5">
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
                      className={`flex items-center gap-2 rounded-7 px-[9px] py-[7px] text-left font-outfit text-[12.5px] transition-colors hover:bg-[#132238] ${
                        picked ? 'bg-brand-teal-deep/15 text-brand-teal' : 'text-text-tertiary'
                      }`}
                    >
                      <span className="min-w-0 flex-1 truncate">{p.name}</span>
                      <span className={`shrink-0 font-mono text-[10px] ${dup ? 'text-text-muted-4' : 'text-brand-indigo'}`}>
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
                    className="flex items-center gap-2 rounded-7 px-[9px] py-[7px] text-left font-outfit text-[12.5px] text-text-muted-2 transition-colors hover:bg-[#132238]"
                  >
                    <span className="min-w-0 flex-1 truncate">{o.name}</span>
                    <span className="shrink-0 font-mono text-[10px] text-text-muted-4">{o.meta}</span>
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

/**
 * One slot per goal scored. `players` is the team's squad list
 * ({name, position}[]) carried on the fixture object by the backend.
 */
export default function ScorerSelect({ team, goalCount, players, scorers, onChange, align = 'left' }) {
  if (goalCount === 0) return null;

  const setScorer = (index, name) => {
    const next = [...scorers];
    next[index] = name;
    onChange(next.slice(0, goalCount));
  };

  return (
    <div className="flex w-full flex-col gap-[6px]">
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
