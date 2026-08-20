/**
 * Circular "poker chip" token badge used for prediction chips (Double Down,
 * Wildcard, etc). `color` should be a CSS color value driving the rim.
 */
export default function TokenBadge({ label, color = 'var(--brand-teal)', size = 40, muted = false, className = '' }) {
  return (
    <div
      className={`relative inline-flex shrink-0 items-center justify-center rounded-full ${muted ? 'opacity-40 grayscale' : ''} ${className}`}
      style={{
        width: size,
        height: size,
        background: `repeating-conic-gradient(${color} 0deg 16deg, var(--surface-card-4) 16deg 34deg)`,
      }}
    >
      <span
        className="flex items-center justify-center rounded-full border border-border-card bg-surface-card-2 font-outfit font-semibold text-text-primary"
        style={{ width: size * 0.7, height: size * 0.7, fontSize: Math.max(size * 0.3, 9) }}
      >
        {label}
      </span>
    </div>
  );
}
