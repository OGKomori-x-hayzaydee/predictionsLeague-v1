export default function SegmentedControl({ options, value, onChange, grow = false, className = '' }) {
  return (
    <div
      role="tablist"
      className={`flex gap-0.5 rounded-md border border-border-card bg-surface-bar p-1 ${className}`}
    >
      {options.map((opt) => (
        <button
          key={opt.id}
          type="button"
          role="tab"
          aria-selected={value === opt.id}
          onClick={() => onChange(opt.id)}
          className={`${grow ? 'min-h-11 flex-1' : 'min-h-11'} rounded-sm px-3.5 py-2 font-outfit text-sm tracking-wide focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-teal ${
            value === opt.id ? 'bg-surface-nav-active text-brand-teal' : 'text-text-muted hover:text-text-primary'
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
