import { CHIP_HUES, DEFAULT_CHIP_HUE } from './chipHues';
import { hasSeasonCap } from '../../utils/chipStatus';

const CHIP_LIST = [
  { id: 'doubleDown', name: 'Double Down', tag: 'x2', desc: 'Doubles everything this match returns.' },
  { id: 'wildcard', name: 'Wildcard', tag: 'x3', desc: 'Triples one match. One a season.' },
  { id: 'scorerFocus', name: 'Scorer Focus', tag: 'S+', desc: 'Each named scorer pays 4 instead of 2.' },
];

function chipLeftLabel(chipId, statusChips) {
  const match = statusChips?.find((c) => (c.chipId || c.id) === chipId);
  if (!match) return 'available';
  if (match.available === false) {
    if (match.remainingGameweeks > 0) return `${match.remainingGameweeks}gw cooldown`;
    return match.reason || 'used';
  }
  if (hasSeasonCap(match)) {
    const left = match.remainingUses ?? Math.max(match.seasonLimit - (match.usageCount ?? 0), 0);
    return `${left} left`;
  }
  if (match.remainingGameweeks > 0) {
    return `${match.remainingGameweeks}gw cooldown`;
  }
  return 'available';
}

/**
 * Chip selector grid — matching Spine.dc.html lines 438-456.
 * Sized in rem/em units.
 */
export default function ChipSelector({ chips = [], selected = [], onToggle }) {
  const selectedIds = Array.isArray(selected) ? selected : selected ? [selected] : [];

  return (
    <div className="flex min-w-0 w-full flex-col gap-2">
      <span className="font-outfit text-xs uppercase tracking-[0.16em] text-[#5b667d]">
        CHIPS · THIS MATCH
      </span>
      <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3 lg:grid-cols-3">
        {CHIP_LIST.map((c) => {
          const isSelected = selectedIds.includes(c.id);
          const hue = CHIP_HUES[c.id] || DEFAULT_CHIP_HUE;
          const statusChip = chips.find((chip) => (chip.chipId || chip.id) === c.id);
          const left = chipLeftLabel(c.id, chips);
          const isUsed = statusChip?.available === false;

          return (
            <button
              key={c.id}
              type="button"
              disabled={isUsed && !isSelected}
              onClick={() => onToggle(c.id)}
              className={`flex cursor-pointer items-start gap-2.5 rounded-xl border p-3 text-left font-outfit transition-all ${
                isSelected
                  ? 'border-[#fcd34d] bg-[#0d1c2ecc] shadow-[0_0_0_2px_#fcd34d33]'
                  : isUsed
                    ? 'border-[#1c2942] bg-[#080e1a80] opacity-60'
                    : 'border-[#1c2942] bg-[#080e1ab8] hover:border-[#2f4160]'
              }`}
            >
              {/* Token badge */}
              <div className="flex flex-col items-center gap-1 shrink-0">
                <div
                  className="flex w-9 h-9 items-center justify-center rounded-full"
                  style={{
                    background: `repeating-conic-gradient(${isSelected ? '#fcd34d' : hue} 0deg 18deg, #08111f 18deg 36deg)`,
                    boxShadow: isSelected ? `0 0 0.75rem #fcd34d40` : 'none',
                  }}
                >
                  <div
                    className="flex w-6 h-6 items-center justify-center rounded-full bg-[#08111f] font-outfit text-2xs font-bold"
                    style={{
                      border: `1.5px solid ${isSelected ? '#fcd34d' : hue}`,
                      color: isSelected ? '#fcd34d' : hue,
                    }}
                  >
                    {c.tag}
                  </div>
                </div>
                <span
                  className="font-outfit text-2xs"
                  style={{ color: isSelected ? '#fcd34d' : isUsed ? '#5b667d' : '#8fa0b8' }}
                >
                  {left}
                </span>
              </div>

              {/* Info */}
              <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                <span
                  className={`text-xs font-semibold leading-tight ${
                    isSelected ? 'text-[#fcd34d]' : 'text-white'
                  }`}
                >
                  {c.name}
                </span>
                <span className="text-2xs leading-snug text-[#8fa0b8]" style={{ textWrap: 'pretty' }}>
                  {c.desc}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
