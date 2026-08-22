/**
 * Circular "poker chip" token for prediction chips (Double Down, Wildcard,
 * etc) — the v2 prototype's recurring recipe: a segmented conic-gradient
 * rim in the chip's hue around a solid inner circle whose border/text is
 * also the hue color (Spine.dc.html lines 1103-1104, 1120, 1230 etc, at
 * sizes from 21px to 56px). Shared primitive for chip grids and rails.
 */
export default function ChipToken({ tag, hue = 'var(--brand-teal)', size = 40, muted = false, dashed = false, className = '', style }) {
  const inner = Math.round(size * 0.72);
  const fontSize = Math.max(Math.round(size * 0.26), 9);

  if (dashed) {
    return (
      <span
        className={`inline-flex shrink-0 items-center justify-center rounded-full border-[1.5px] border-dashed border-border-control bg-surface-card-4 ${className}`}
        style={{ width: size, height: size, ...style }}
      >
        <span
          className="flex items-center justify-center rounded-full border border-dashed border-border-base font-outfit text-text-muted-3"
          style={{ width: inner, height: inner, fontSize }}
        >
          {tag}
        </span>
      </span>
    );
  }

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
        className="flex items-center justify-center rounded-full bg-surface-card-4 font-outfit font-semibold"
        style={{ width: inner, height: inner, border: `1.5px solid ${hue}`, color: hue, fontSize }}
      >
        {tag}
      </span>
    </span>
  );
}
