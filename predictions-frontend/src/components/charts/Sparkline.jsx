import { useId } from 'react';

/**
 * Hand-rolled inline-SVG line chart, matching the prototype's approach
 * (no charting library). Reused across Profile/Record/Leagues.
 *
 * Optional `average` draws a dashed lavender reference line; `labels` are
 * HTML (not SVG text) so they don't stretch under preserveAspectRatio=none.
 */
export default function Sparkline({
  data,
  width = 320,
  height = 64,
  stroke = 'var(--brand-teal)',
  fill = true,
  average,
  labels,
  grid = false,
  glow = false,
}) {
  const rawId = useId().replace(/:/g, '');
  const glowId = `spark-glow-${rawId}`;

  if (!data || data.length < 2) {
    return (
      <div
        className="flex items-center justify-center font-outfit text-2xs text-text-muted-3"
        style={{ height }}
      >
        Not enough settled gameweeks yet
      </div>
    );
  }

  const domain = average == null ? data : [...data, average];
  const max = Math.max(...domain);
  const min = Math.min(...domain);
  const range = max - min || 1;
  const padY = height * 0.08;
  const chartH = height - padY * 2;
  const stepX = width / (data.length - 1);
  const yOf = (v) => padY + chartH - ((v - min) / range) * chartH;
  const points = data.map((v, i) => [i * stepX, yOf(v)]);
  const pointsStr = points.map(([x, y]) => `${x},${y}`).join(' ');
  const areaStr = `0,${height} ${pointsStr} ${width},${height}`;
  const gridYs = grid ? [0.25, 0.5, 0.75].map((t) => padY + chartH * t) : [];
  const edgeLabels = (labels || []).filter(Boolean).slice(0, 3);

  return (
    <div>
      <svg viewBox={`0 0 ${width} ${height}`} width="100%" height={height} preserveAspectRatio="none">
        {glow && (
          <defs>
            <filter id={glowId} x="-8%" y="-40%" width="116%" height="180%">
              <feGaussianBlur stdDeviation="2.2" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
        )}
        {gridYs.map((y) => (
          <line
            key={y}
            x1="0"
            y1={y}
            x2={width}
            y2={y}
            stroke="var(--border-base)"
            strokeWidth="1"
            vectorEffect="non-scaling-stroke"
          />
        ))}
        {average != null && (
          <line
            x1="0"
            y1={yOf(average)}
            x2={width}
            y2={yOf(average)}
            stroke="var(--brand-indigo)"
            strokeWidth="1.25"
            strokeDasharray="5 6"
            opacity="0.7"
            vectorEffect="non-scaling-stroke"
          />
        )}
        {fill && <polygon points={areaStr} fill={stroke} opacity="0.12" />}
        <polyline
          points={pointsStr}
          fill="none"
          stroke={stroke}
          strokeWidth="2"
          strokeLinejoin="round"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
          filter={glow ? `url(#${glowId})` : undefined}
        />
      </svg>
      {edgeLabels.length > 0 && (
        <div className="mt-1.5 flex justify-between font-outfit text-3xs tracking-[0.08em] text-text-muted-4">
          {edgeLabels.map((label) => (
            <span key={label}>{label}</span>
          ))}
        </div>
      )}
    </div>
  );
}
