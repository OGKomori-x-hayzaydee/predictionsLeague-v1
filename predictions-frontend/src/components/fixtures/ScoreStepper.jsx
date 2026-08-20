/**
 * Score entry control — matching Spine.dc.html lines 344-348.
 * Uses rem/em units and standard Tailwind tokens for all sizing.
 */
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
        className="cursor-pointer p-1 leading-none text-[#fcd34d] transition-colors hover:text-[#fde68a]"
      >
        <svg className="w-5 h-5" viewBox="0 0 15 15" fill="none">
          <path d="m3 9.5 4.5-4.5L12 9.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      <input
        value={String(value)}
        onChange={(e) => setDigit(e.target.value)}
        inputMode="numeric"
        maxLength={1}
        aria-label={`${team} goals`}
        className="w-24 md:w-28 rounded-xl border-0 bg-transparent text-center font-dmSerif text-6xl md:text-7xl leading-none text-white caret-[#fcd34d] outline-none focus:bg-[#0d1c2e99]"
      />

      <button
        type="button"
        onClick={() => bump(-1)}
        aria-label={`Decrease ${team} score`}
        className="cursor-pointer p-1 leading-none text-[#fcd34d] transition-colors hover:text-[#fde68a]"
      >
        <svg className="w-5 h-5" viewBox="0 0 15 15" fill="none">
          <path d="m3 5.5 4.5 4.5L12 5.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    </div>
  );
}
