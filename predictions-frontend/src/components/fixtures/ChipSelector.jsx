import KickerLabel from '../ui/KickerLabel';
import TokenBadge from '../ui/TokenBadge';
import { CHIP_HUES, DEFAULT_CHIP_HUE } from './chipHues';

/**
 * Real "left" label derived from the backend's own chip-status fields
 * (available / seasonLimit / usageCount / remainingGameweeks) — mirrors
 * components/dashboard/ChipStockSection.jsx's chipLeftLabel, no guessing.
 */
function chipLeftLabel(chip) {
  if (chip.available === false) {
    if (chip.remainingGameweeks > 0) return `${chip.remainingGameweeks}gw cooldown`;
    return chip.reason || 'unavailable';
  }
  if (typeof chip.seasonLimit === 'number') {
    const left = Math.max(chip.seasonLimit - (chip.usageCount ?? 0), 0);
    return `${left} left`;
  }
  return 'available';
}

/**
 * One-per-match chip picker, matching Spine.dc.html's chip grid (desktop
 * lines 438-456, mobile lines 2549-2563). Only match-scoped chips are
 * offered here (gameweek-scoped chips apply across the whole gameweek
 * from the Chips screen, not per-fixture) — same real constraint the
 * previous implementation of this component already respected.
 */
export default function ChipSelector({ chips, selected, onToggle }) {
  if (!chips.length) return null;

  return (
    <div className="flex w-full flex-col gap-2">
      <KickerLabel as="div" className="tracking-[0.16em] text-text-muted-4">
        Chips · one per match
      </KickerLabel>
      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 md:grid-cols-5">
        {chips.map((chip) => {
          const id = chip.chipId || chip.id;
          const isSelected = selected === id;
          const disabled = !chip.available && !isSelected;
          const hue = CHIP_HUES[id] || DEFAULT_CHIP_HUE;
          const left = chipLeftLabel(chip);

          return (
            <button
              key={id}
              type="button"
              disabled={disabled}
              onClick={() => onToggle(isSelected ? null : id)}
              title={disabled ? chip.reason || 'Unavailable' : chip.description}
              className={`flex flex-col items-center gap-1 rounded-11 border px-2.5 py-[11px] text-center transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${
                isSelected ? '' : 'border-border-card hover:border-border-control'
              }`}
              style={
                isSelected
                  ? { borderColor: `${hue}80`, background: `${hue}17`, boxShadow: `0 0 0 4px ${hue}2e` }
                  : { background: 'rgba(11,20,36,0.4)' }
              }
            >
              <TokenBadge label={chip.icon} color={hue} size={40} muted={disabled} />
              <span className="font-mono text-[9.5px]" style={{ color: disabled ? 'var(--text-muted-4)' : hue }}>
                {left}
              </span>
              <span className="text-[12px] font-medium leading-tight" style={isSelected ? { color: hue } : undefined}>
                {chip.name}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
