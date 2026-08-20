import { radarAxes, radarPolygon } from '../../utils/leagueStats';

/**
 * Six-axis "you vs them" radar — Leagues head-to-head RADAR variant (spec
 * foundation §9 pattern candidates; new shared primitive per the Leagues
 * screen's scope note). Pure SVG, theme-safe (labels/spokes use semantic
 * tokens, the two sides keep the prototype's literal teal/red convention
 * since that's the fixed "you"/"rival" meaning, not a themeable surface).
 */
export default function RadarChart({ rows, youLabel = 'You', themLabel = 'Them', className = '' }) {
  const axes = radarAxes(rows.length);
  const you = radarPolygon(rows, 'you');
  const them = radarPolygon(rows, 'them');

  const labelPos = (k) => {
    const a = ((-90 + (k * 360) / rows.length) * Math.PI) / 180;
    const x = 60 + 64 * Math.cos(a);
    const y = 60 + 64 * Math.sin(a);
    const anchor = x < 55 ? 'end' : x > 65 ? 'start' : 'middle';
    return { x: x.toFixed(1), y: y.toFixed(1), anchor };
  };

  return (
    <svg viewBox="-22 -14 168 152" className={className} style={{ width: '100%', maxWidth: 260, height: 'auto' }}>
      <circle cx="60" cy="60" r="52" fill="none" stroke="var(--border-base)" strokeWidth="1" />
      <circle cx="60" cy="60" r="35" fill="none" stroke="var(--border-base)" strokeWidth="1" />
      <circle cx="60" cy="60" r="18" fill="none" stroke="var(--border-base)" strokeWidth="1" />
      {axes.map((ax, i) => (
        <line key={i} x1="60" y1="60" x2={ax.x} y2={ax.y} stroke="var(--border-card)" strokeWidth="1" />
      ))}
      {rows.map((r, k) => {
        const p = labelPos(k);
        return (
          <text
            key={r.label}
            x={p.x}
            y={p.y}
            textAnchor={p.anchor}
            fill="var(--text-muted-1)"
            fontFamily="'IBM Plex Mono',monospace"
            fontSize="6.4"
            letterSpacing="0.6"
          >
            {r.label}
          </text>
        );
      })}
      <polygon points={them} fill="#f8717118" stroke="#f87171" strokeWidth="1.4" strokeLinejoin="round" />
      <polygon points={you} fill="var(--color-brand-teal)" fillOpacity="0.12" stroke="var(--color-brand-teal)" strokeWidth="1.4" strokeLinejoin="round" />
      <text x="60" y="60" textAnchor="middle" fontSize="0" aria-hidden="true">
        {youLabel} vs {themLabel}
      </text>
    </svg>
  );
}
