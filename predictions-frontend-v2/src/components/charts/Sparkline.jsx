/**
 * Hand-rolled inline-SVG line chart, matching the prototype's approach
 * (no charting library). Reused across Profile/Record/Leagues.
 */
export default function Sparkline({ data, width = 320, height = 64, stroke = 'var(--brand-teal)', fill = true }) {
  if (!data || data.length < 2) {
    return (
      <div
        className="flex items-center justify-center font-mono text-[11px] text-text-muted-3"
        style={{ height }}
      >
        Not enough settled gameweeks yet
      </div>
    );
  }

  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const stepX = width / (data.length - 1);
  const points = data.map((v, i) => [i * stepX, height - ((v - min) / range) * height]);
  const pointsStr = points.map(([x, y]) => `${x},${y}`).join(' ');
  const areaStr = `0,${height} ${pointsStr} ${width},${height}`;

  return (
    <svg viewBox={`0 0 ${width} ${height}`} width="100%" height={height} preserveAspectRatio="none">
      {fill && <polygon points={areaStr} fill={stroke} opacity="0.12" />}
      <polyline
        points={pointsStr}
        fill="none"
        stroke={stroke}
        strokeWidth="2"
        strokeLinejoin="round"
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}
