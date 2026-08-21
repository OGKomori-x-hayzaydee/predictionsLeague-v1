import { CHIP_HUES, DEFAULT_CHIP_HUE } from './chipHues';
import { hasSeasonCap } from '../../utils/chipStatus';

const GW_CHIP_LIST = [
  { id: 'defensePlusPlus', name: 'Defence++', tag: 'D+', desc: '+5 for every clean sheet you call right.' },
  { id: 'allInWeek', name: 'All-In Week', tag: 'AI', desc: 'Doubles every point this gameweek, wins and losses.' },
];

function gwChipLeftLabel(chipId, statusChips, { active, currentGameweek }) {
  if (active) return 'active this GW';
  const match = statusChips?.find((c) => (c.chipId || c.id) === chipId);
  if (!match) return 'available';
  if (match.remainingGameweeks > 0) return `${match.remainingGameweeks}gw cooldown`;
  if (match.available === false) {
    const usedGw = match.lastUsedGameweek;
    if (usedGw && Number(usedGw) !== Number(currentGameweek)) {
      return `spent · GW${usedGw}`;
    }
    return match.reason || 'used';
  }
  if (hasSeasonCap(match)) {
    const left = match.remainingUses ?? Math.max(match.seasonLimit - (match.usageCount ?? 0), 0);
    return `${left} left`;
  }
  return 'available';
}

export default function GameweekChipBar({
  chips = [],
  activeIds = [],
  currentGameweek,
  busyId = null,
  onActivate,
}) {
  const otherActiveId = activeIds.find(Boolean) || null;

  return (
    <div className="flex w-full flex-col gap-2">
      <div className="flex flex-col gap-0.5">
        <span className="font-outfit text-xs uppercase tracking-[0.16em] text-[#5b667d]">
          CHIPS · THE WHOLE GAMEWEEK
        </span>
        <span className="font-outfit text-2xs text-[#8fa0b8]">
          Applies to every match this GW, including slips already filed.
        </span>
      </div>
      <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
        {GW_CHIP_LIST.map((c) => {
          const isSelected = activeIds.includes(c.id);
          const hue = CHIP_HUES[c.id] || DEFAULT_CHIP_HUE;
          const statusChip = chips.find((chip) => (chip.chipId || chip.id) === c.id);
          const left = gwChipLeftLabel(c.id, chips, { active: isSelected, currentGameweek });
          const isSpent = !isSelected && statusChip?.available === false;
          const blockedByOther = !isSelected && otherActiveId && otherActiveId !== c.id;
          const isBusy = busyId === c.id;
          const disabled = isSpent || blockedByOther || !!busyId;

          return (
            <button
              key={c.id}
              type="button"
              disabled={disabled && !isSelected}
              onClick={() => {
                if (isSelected || disabled) return;
                onActivate?.(c.id);
              }}
              className={`flex cursor-pointer items-start gap-2.5 rounded-xl border p-3 text-left font-outfit transition-all ${
                isSelected
                  ? 'border-[#fcd34d] bg-[#0d1c2ecc] shadow-[0_0_0_2px_#fcd34d33]'
                  : isSpent || blockedByOther
                    ? 'border-[#1c2942] bg-[#080e1a80] opacity-60'
                    : 'border-[#1c2942] bg-[#080e1ab8] hover:border-[#2f4160]'
              }`}
            >
              <div className="flex flex-col items-center gap-1 shrink-0">
                <div
                  className="flex h-9 w-9 items-center justify-center rounded-full"
                  style={{
                    background: `repeating-conic-gradient(${isSelected ? '#fcd34d' : hue} 0deg 18deg, #08111f 18deg 36deg)`,
                    boxShadow: isSelected ? '0 0 0.75rem #fcd34d40' : 'none',
                  }}
                >
                  <div
                    className="flex h-6 w-6 items-center justify-center rounded-full bg-[#08111f] font-outfit text-2xs font-bold"
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
                  style={{ color: isSelected ? '#fcd34d' : isSpent ? '#5b667d' : '#8fa0b8' }}
                >
                  {isBusy ? 'applying…' : left}
                </span>
              </div>

              <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                <span
                  className={`text-xs font-semibold leading-tight ${
                    isSelected ? 'text-[#fcd34d]' : 'text-white'
                  }`}
                >
                  {c.name}
                </span>
                <span className="text-2xs leading-snug text-[#8fa0b8]" style={{ textWrap: 'pretty' }}>
                  {blockedByOther
                    ? 'One gameweek chip a week.'
                    : c.desc}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
