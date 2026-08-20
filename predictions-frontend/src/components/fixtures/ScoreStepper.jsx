/**
 * Score entry control — chevron-up / big DM Serif digit / chevron-down,
 * matching Spine.dc.html's score column (desktop lines 344-348, mobile
 * lines 2457-2461). Amber accent (`#fcd34d` → `text-brand-amber`) on the
 * chevrons and caret, single-digit 0-9 like the prototype's maxLength=1
 * input.
 */
export default function ScoreStepper({ team, value, onChange, size = 'lg' }) {
  const bump = (delta) => onChange(Math.max(0, Math.min(9, value + delta)));

  const setDigit = (raw) => {
    const digits = String(raw).replace(/[^0-9]/g, '');
    const v = digits === '' ? 0 : Math.max(0, Math.min(9, parseInt(digits.slice(-1), 10)));
    onChange(v);
  };

  const big = size === 'lg';

  return (
    <div className="flex flex-col items-center gap-[5px]">
      <button
        type="button"
        onClick={() => bump(1)}
        aria-label={`Increase ${team} score`}
        className="p-0.5 leading-none text-brand-amber transition-colors hover:text-brand-amber-pale"
      >
        <svg width={big ? 20 : 14} height={big ? 20 : 14} viewBox="0 0 15 15" fill="none">
          <path d="m3 9.5 4.5-4.5L12 9.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      <input
        value={String(value)}
        onChange={(e) => setDigit(e.target.value)}
        inputMode="numeric"
        maxLength={1}
        aria-label={`${team} goals`}
        className={`w-full rounded-[10px] border-0 bg-transparent text-center font-dmSerif leading-[0.86] text-text-primary caret-brand-amber outline-none focus:bg-surface-card-4/60 ${
          big ? 'text-6xl md:text-[82px]' : 'text-[30px]'
        }`}
      />

      <button
        type="button"
        onClick={() => bump(-1)}
        aria-label={`Decrease ${team} score`}
        className="p-0.5 leading-none text-brand-amber transition-colors hover:text-brand-amber-pale"
      >
        <svg width={big ? 20 : 14} height={big ? 20 : 14} viewBox="0 0 15 15" fill="none">
          <path d="m3 5.5 4.5 4.5L12 5.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    </div>
  );
}
