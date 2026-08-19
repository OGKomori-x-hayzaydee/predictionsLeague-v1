export default function BarRow({ label, value, max, note, color = 'var(--brand-teal)' }) {
  const pct = max > 0 ? Math.min(100, Math.max(0, (value / max) * 100)) : 0;
  return (
    <div className="space-y-1.5">
      <div className="flex items-baseline justify-between text-sm">
        <span className="text-text-secondary">{label}</span>
        <span className="font-mono text-xs text-text-muted-2">{note}</span>
      </div>
      <div className="h-2 rounded-full bg-surface-card-3">
        <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: color }} />
      </div>
    </div>
  );
}
