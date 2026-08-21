/**
 * Gameweek scope picker for the Form book.
 */
export default function GwPicker({ options, value, onChange, className = '' }) {
  if (!options || options.length === 0) return null;
  return (
    <div className={`flex gap-1.5 overflow-x-auto ${className}`}>
      {options.map((gw) => (
        <button
          key={gw}
          onClick={() => onChange(gw)}
          className={`min-h-9 shrink-0 rounded-sm px-2.5 py-1.5 font-outfit text-2xs transition-colors md:min-h-0 ${
            gw === value ? 'bg-brand-teal-deep text-brand-teal-tint' : 'bg-surface-card-4 text-text-muted-2 hover:text-text-primary'
          }`}
        >
          GW{gw}
        </button>
      ))}
    </div>
  );
}
