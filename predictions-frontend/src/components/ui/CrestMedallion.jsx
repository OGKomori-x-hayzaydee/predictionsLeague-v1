import TeamCrest from './TeamCrest';

/**
 * Crest housed in the same segmented conic-gradient rim recipe as
 * ChipToken (see ChipToken.jsx) — so a team crest and a filed chip read as
 * the same physical "coin" object. Kept as its own component rather than
 * extending ChipToken itself, since ChipToken's `tag`/`hue` contract is
 * specific to prediction chips; this one hosts an image instead of text.
 */
export default function CrestMedallion({ team, hue = 'var(--brand-teal)', size = 60, muted = false, className = '', style }) {
  const inner = Math.round(size * 0.78);
  const crestSize = Math.round(inner * 0.62);

  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center rounded-full ${muted ? 'opacity-40 grayscale' : ''} ${className}`}
      style={{
        width: size,
        height: size,
        background: `repeating-conic-gradient(${hue} 0deg 15deg, var(--surface-card-4) 15deg 30deg)`,
        ...style,
      }}
    >
      <span
        className="flex items-center justify-center rounded-full bg-surface-card-4"
        style={{ width: inner, height: inner, border: `1.5px solid ${hue}` }}
      >
        <TeamCrest team={team} size={crestSize} />
      </span>
    </span>
  );
}
