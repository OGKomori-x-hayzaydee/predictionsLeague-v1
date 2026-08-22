import { useEffect, useRef, useState } from 'react';

const CURRENT_SEASON = '2025/26';
const SEASONS = ['2025/26', '2024/25', '2023/24'];
const GW_COUNT = 24;

/**
 * Form-book season + gameweek picker — pill trigger, popover with season
 * chips and a 1–24 square grid (Spine prototype).
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

  const pick = (gw) => {
    setDraft(gw);
    onChange(gw);
    setOpen(false);
  };

  return (
    <div ref={rootRef} className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="dialog"
        className="flex min-h-11 items-center gap-2.5 rounded-full border border-border-control bg-surface-card-4 px-3.5 py-2 font-outfit text-caption tracking-wide text-brand-teal"
      >
        <span className="size-1.5 shrink-0 rounded-full bg-brand-teal" />
        <span>{CURRENT_SEASON} · GW{value}</span>
        <svg
          width="12"
          height="12"
          viewBox="0 0 15 15"
          fill="none"
          className={`text-text-muted-3 ${open ? 'rotate-180' : ''}`}
          aria-hidden
        >
          <path d="m3.5 6 4 4 4-4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {open && (
        <div
          role="dialog"
          aria-label="Choose season and gameweek"
          className="absolute left-0 right-0 z-30 mt-2 flex flex-col gap-4 rounded-14 border border-border-card bg-surface-modal p-[18px] shadow-dropdown md:left-auto md:right-0 md:w-[470px]"
        >
          <div className="flex flex-col gap-2">
            <span className="font-outfit text-2xs tracking-widest text-text-muted-4">SEASON</span>
            <div className="flex gap-1.5">
              {SEASONS.map((season) => {
                const on = season === CURRENT_SEASON;
                return (
                  <button
                    key={season}
                    type="button"
                    disabled={!on}
                    className="flex-1 rounded-9 py-2 text-center font-outfit text-caption"
                    style={{
                      background: on ? 'color-mix(in srgb, var(--brand-teal-deep) 15%, transparent)' : 'var(--surface-card-4)',
                      border: `1px solid ${on ? 'color-mix(in srgb, var(--brand-teal-mid) 40%, transparent)' : 'var(--border-card)'}`,
                      color: on ? 'var(--color-brand-teal)' : 'var(--text-muted-4)',
                    }}
                  >
                    {season}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <span className="font-outfit text-2xs tracking-widest text-text-muted-4">
              GAMEWEEK · {settledCount} SETTLED{pending.length ? `, ${pending.length} PENDING` : ''}
            </span>
            <div className="grid grid-cols-12 gap-1">
              {Array.from({ length: GW_COUNT }, (_, i) => i + 1).map((gw) => {
                const canPick = available.has(gw);
                const isSel = gw === draft;
                const isLive = canPick;
                return (
                  <button
                    key={gw}
                    type="button"
                    disabled={!canPick}
                    onClick={() => canPick && pick(gw)}
                    className="rounded-6 py-1.5 text-center font-outfit text-caption"
                    style={{
                      background: isSel ? 'var(--brand-teal-deep)' : isLive ? 'var(--surface-nav-active)' : 'transparent',
                      color: isSel ? 'var(--surface-app)' : isLive ? 'var(--brand-teal)' : 'var(--text-muted)',
                    }}
                  >
                    {gw}
                  </button>
                );
              })}
            </div>
          </div>

          <button
            type="button"
            onClick={() => setOpen(false)}
            className="self-end font-outfit text-2xs tracking-widest text-brand-teal"
          >
            DONE
          </button>
        </div>
      )}
    </div>
  );
}
