export default function ScoreStepper({ team, value, onChange }) {
  const bump = (delta) => onChange(Math.max(0, Math.min(9, value + delta)));

  const setDigit = (raw) => {
    const digits = String(raw).replace(/[^0-9]/g, '');
    const v = digits === '' ? 0 : Math.max(0, Math.min(9, parseInt(digits.slice(-1), 10)));
    onChange(v);
  };

  return (
    <div className="flex flex-col items-center gap-1">
      <button
        type="button"
        onClick={() => bump(1)}
        aria-label={`Increase ${team} score`}
        className="inline-flex size-11 cursor-pointer items-center justify-center leading-none text-brand-amber transition-colors hover:text-brand-amber-pale"
      >
        <svg className="h-5 w-5" viewBox="0 0 15 15" fill="none">
          <path d="m3 9.5 4.5-4.5L12 9.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      <input
        value={String(value)}
        onChange={(e) => setDigit(e.target.value)}
        inputMode="numeric"
        maxLength={1}
        aria-label={`${team} goals`}
        className="w-24 rounded-md border-0 bg-transparent text-center font-dmSerif text-6xl leading-none text-text-primary caret-brand-amber outline-none focus:bg-surface-elevated lg:w-28 lg:text-7xl"
      />

      <button
        type="button"
        onClick={() => bump(-1)}
        aria-label={`Decrease ${team} score`}
        className="inline-flex size-11 cursor-pointer items-center justify-center leading-none text-brand-amber transition-colors hover:text-brand-amber-pale"
      >
        <svg className="h-5 w-5" viewBox="0 0 15 15" fill="none">
          <path d="m3 5.5 4.5 4.5L12 5.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    </div>
  );
}
