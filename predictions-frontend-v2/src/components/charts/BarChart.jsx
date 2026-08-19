export default function BarChart({ data, labels, height = 96, color = 'var(--brand-teal)' }) {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center font-mono text-[11px] text-text-muted-3" style={{ height }}>
        No settled gameweeks yet
      </div>
    );
  }

  const max = Math.max(1, ...data.map((v) => Math.abs(v)));

  return (
    <div className="flex items-end gap-1" style={{ height }}>
      {data.map((v, i) => {
        const barHeight = Math.max(2, (Math.abs(v) / max) * (height - 14));
        return (
          <div key={i} className="flex flex-1 flex-col items-center justify-end gap-1">
            <div
              className="w-full rounded-t"
              style={{ height: barHeight, background: v < 0 ? 'var(--state-error)' : color }}
              title={String(v)}
            />
            {labels && <span className="font-mono text-[8px] text-text-muted-3">{labels[i]}</span>}
          </div>
        );
      })}
    </div>
  );
}
