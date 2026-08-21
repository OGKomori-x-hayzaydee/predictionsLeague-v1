import { useEffect, useRef, useState } from 'react';

const CURRENT_SEASON = '2025/26';
const SEASONS = ['2025/26', '2024/25', '2023/24'];
const GW_COUNT = 24;

/**
 * Form-book season + gameweek picker — pill trigger, popover with season
 * chips and a 1–24 grid (same pattern as the Spine prototype).
 */
export default function GwPicker({ options, value, onChange, currentGameweek, settledGws = [], className = '' }) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState(value);
  const rootRef = useRef(null);

  useEffect(() => {
    if (open) setDraft(value);
  }, [open, value]);

  useEffect(() => {
    if (!open) return undefined;
    const onDoc = (e) => {
      if (!rootRef.current?.contains(e.target)) setOpen(false);
    };
    const onKey = (e) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onDoc);
    window.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDoc);
      window.removeEventListener('keydown', onKey);
    };
  }, [open]);

  if (!options || options.length === 0) return null;

  const available = new Set(options);
  const settled = new Set(settledGws);
  const latest = currentGameweek ?? Math.max(...options);
  const pending = options.filter((gw) => !settled.has(gw));
  const settledCount = settled.size || options.filter((gw) => gw < latest).length;

  const commit = (gw) => {
    setDraft(gw);
    onChange(gw);
  };

  return (
    <div ref={rootRef} className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="dialog"
        className="flex min-h-10 items-center gap-2 rounded-full border border-border-control bg-surface-card-4 px-3.5 py-2 font-outfit text-caption text-brand-teal"
      >
        <span className="size-1.5 shrink-0 rounded-full bg-brand-teal" />
        <span>{CURRENT_SEASON} · GW{value}</span>
        <span className="text-2xs leading-none text-text-muted-3">{open ? '▴' : '▾'}</span>
      </button>

      {open && (
        <div
          role="dialog"
          aria-label="Choose season and gameweek"
          className="absolute left-0 right-0 z-30 mt-2 rounded-16 border border-border-card bg-surface-modal p-4 shadow-dropdown md:left-auto md:right-0 md:w-[28rem] md:p-5"
        >
          <span className="font-outfit text-2xs tracking-widest text-text-muted-3">SEASON</span>
          <div className="mt-2 grid grid-cols-3 gap-2">
            {SEASONS.map((season) => {
              const on = season === CURRENT_SEASON;
              return (
                <button
                  key={season}
                  type="button"
                  disabled={!on}
                  className={`min-h-11 rounded-12 border font-outfit text-caption ${
                    on
                      ? 'border-brand-teal text-brand-teal'
                      : 'border-border-base text-text-muted-4'
                  }`}
                >
                  {season}
                </button>
              );
            })}
          </div>

          <span className="mt-4 block font-outfit text-2xs tracking-widest text-text-muted-3">
            GAMEWEEK · {settledCount} SETTLED{pending.length ? `, ${pending.length} PENDING` : ''}
          </span>
          <div className="mt-2 grid grid-cols-12 gap-1">
            {Array.from({ length: GW_COUNT }, (_, i) => i + 1).map((gw) => {
              const canPick = available.has(gw);
              const isSel = gw === draft;
              const isPending = canPick && !settled.has(gw) && gw === latest;
              return (
                <button
                  key={gw}
                  type="button"
                  disabled={!canPick}
                  onClick={() => canPick && commit(gw)}
                  className={`flex size-8 items-center justify-center rounded-full font-outfit text-caption md:size-9 ${
                    isSel
                      ? 'bg-brand-teal text-primary-800'
                      : isPending
                        ? 'border border-border-control text-text-primary'
                        : canPick
                          ? 'text-text-muted-2 hover:text-text-primary'
                          : 'text-text-muted-5'
                  }`}
                >
                  {gw}
                </button>
              );
            })}
          </div>

          <div className="mt-3 flex justify-end">
            <button
              type="button"
              onClick={() => {
                if (draft != null) onChange(draft);
                setOpen(false);
              }}
              className="font-outfit text-2xs tracking-widest text-brand-teal"
            >
              DONE
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
