import { useNavigate } from 'react-router-dom';
import KickerLabel from '../ui/KickerLabel';
import { useChips } from '../../hooks/useChips';
import { CHIP_HUES, DEFAULT_CHIP_HUE, CHIP_BADGES } from './chipHues';

/**
 * Real "left" label derived from the backend's own chip-status fields
 * (available / seasonLimit / usageCount / remainingGameweeks) — no
 * guessing, just presenting what /chips/status already returns.
 */
function chipLeftLabel(chip) {
  if (chip.available === false) {
    if (chip.remainingGameweeks > 0) return `${chip.remainingGameweeks}gw cooldown`;
    return chip.reason || 'Unavailable';
  }
  if (typeof chip.seasonLimit === 'number') {
    const left = Math.max(chip.seasonLimit - (chip.usageCount ?? 0), 0);
    return `${left} left`;
  }
  return 'Available';
}

export default function ChipStockSection() {
  const navigate = useNavigate();
  const { chips, isLoading } = useChips();

  return (
    <div className="flex flex-col gap-[11px]">
      <KickerLabel as="div" className="tracking-[0.16em] text-text-muted-3">
        Chips in hand
      </KickerLabel>
      {isLoading && <p className="text-xs text-text-muted-2">Loading…</p>}
      {!isLoading && chips.length === 0 && (
        <p className="text-xs text-text-muted-2">No chips yet.</p>
      )}
      <div className="flex flex-col gap-[10px]">
        {chips.map((chip) => {
          const hue = CHIP_HUES[chip.id] || DEFAULT_CHIP_HUE;
          const left = chipLeftLabel(chip);
          return (
            <button
              key={chip.chipId || chip.id}
              onClick={() => navigate('/chips')}
              className="flex cursor-pointer items-center gap-[10px] text-left"
            >
              <span
                className="flex h-[26px] w-[26px] shrink-0 items-center justify-center rounded-[7px] font-outfit text-2xs font-semibold"
                style={{ background: `${hue}1f`, border: `1px solid ${hue}55`, color: hue }}
              >
                {CHIP_BADGES[chip.id] || chip.icon}
              </span>
              <span className="min-w-0 flex-1 truncate text-caption text-[#b6c1d1]">{chip.name}</span>
              <span
                className={`shrink-0 font-outfit text-2xs ${
                  chip.available === false ? 'text-brand-amber-mid' : 'text-text-muted-3'
                }`}
              >
                {left}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
