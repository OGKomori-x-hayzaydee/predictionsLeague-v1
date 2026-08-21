/**
 * Shared segmented control — same idiom as TopNav active state and the
 * Spine prototype: dark track, #152a3a wash + teal text when selected.
 */
export default function SegmentedControl({ options, value, onChange, grow = false, className = '' }) {
  return (
    <div className={`flex gap-0.5 rounded-9 border border-border-card bg-surface-card-4 p-1 ${className}`}>
      {options.map((opt) => (
        <button
          key={opt.id}
          type="button"
          onClick={() => onChange(opt.id)}
          className={`${grow ? 'min-h-10 flex-1' : 'min-h-9'} rounded-7 px-3.5 py-2 font-outfit text-caption tracking-wide ${
            value === opt.id ? 'bg-surface-nav-active text-brand-teal' : 'text-text-muted-2 hover:text-text-primary'
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
