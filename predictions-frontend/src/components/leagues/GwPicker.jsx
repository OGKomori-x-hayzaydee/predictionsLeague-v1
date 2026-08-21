/**
 * Gameweek scope picker for the Form book — real gameweeks only (the
 * league's firstGameweek through the current one), no fake multi-season
 * picker since there's only one real season of data.
 */
export default function GwPicker({ options, value, onChange, className = '' }) {
  if (!options || options.length === 0) return null;
  return (
    <div className={`flex gap-[6px] overflow-x-auto ${className}`}>
      {options.map((gw) => (
        <button
          key={gw}
          onClick={() => onChange(gw)}
          className={`shrink-0 rounded-8 px-[10px] py-[6px] font-mono text-2xs transition-colors md:min-h-0 min-h-9 ${
            gw === value ? 'bg-brand-teal-deep text-brand-teal-tint' : 'bg-surface-card-4 text-text-muted-2 hover:text-text-primary'
          }`}
        >
          GW{gw}
        </button>
      ))}
    </div>
  );
}
