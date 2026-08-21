import { useState } from 'react';

const STORAGE_KEY = 'dash-results-variant';
const VALID = ['A', 'B', 'C'];

const OPTIONS = [
  { id: 'A', label: 'A · tape' },
  { id: 'B', label: 'B · ridge' },
  { id: 'C', label: 'C · well' },
];

export function useDashResultsVariant() {
  const [variant, setVariant] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return VALID.includes(stored) ? stored : 'A';
    } catch {
      return 'A';
    }
  });

  const select = (next) => {
    if (!VALID.includes(next)) return;
    setVariant(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* private mode / quota */
    }
  };

  return [variant, select];
}

/**
 * Temporary compare control for the dashboard results carousel.
 * Not product UI — labelled as a preview picker so it can be shelved
 * once one variant is chosen.
 */
export default function ResultsPreviewSwitcher({ value, onChange }) {
  return (
    <div
      role="group"
      aria-label="Results carousel variants"
      className="inline-flex rounded-md border border-dashed border-[#2a3a52] bg-[#070d18]/80 p-0.5"
    >
      {OPTIONS.map((opt) => {
        const active = value === opt.id;
        return (
          <button
            key={opt.id}
            type="button"
            onClick={() => onChange(opt.id)}
            className={`cursor-pointer rounded px-2 py-1 font-outfit text-2xs tracking-[0.04em] transition-colors ${
              active
                ? 'bg-[#122036] text-brand-teal'
                : 'text-[#66748c] hover:text-[#c8d2e0]'
            }`}
            aria-pressed={active}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
