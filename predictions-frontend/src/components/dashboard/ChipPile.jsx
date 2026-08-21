import ChipToken from '../ui/ChipToken';

/**
 * Physical chip pile for the fixture-preview spines. One token sits flush;
 * two or more stack with an 8px down-right offset so the rim of the lower
 * chip peeks out. Empty state is a dashed token — never a text pill.
 */
export default function ChipPile({ chips = [], size = 56, className = '', style }) {
  const label = chips.length
    ? chips.map((c) => c.name).join(', ')
    : 'No chip';

  if (!chips.length) {
    return (
      <span className={className} style={style} title={label} aria-label={label}>
        <ChipToken dashed size={size} />
      </span>
    );
  }

  if (chips.length === 1) {
    const chip = chips[0];
    return (
      <span className={className} style={style} title={label} aria-label={label}>
        <ChipToken tag={chip.tag} hue={chip.hue} size={size} />
      </span>
    );
  }

  const peek = 8;
  return (
    <span
      className={`relative inline-block shrink-0 ${className}`}
      style={{ width: size, height: size, ...style }}
      title={label}
      aria-label={label}
    >
      {chips.map((chip, i) => (
        <span
          key={chip.id}
          className="absolute left-0 top-0"
          style={{
            transform: `translate(${i * peek}px, ${i * peek}px)`,
            zIndex: chips.length - i,
          }}
        >
          <ChipToken tag={chip.tag} hue={chip.hue} size={size} />
        </span>
      ))}
    </span>
  );
}
