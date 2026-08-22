import ChipToken from '../ui/ChipToken';
import { CHIP_HUES, CHIP_TAGS, DEFAULT_CHIP_HUE } from './chipHues';
import { hasSeasonCap } from '../../utils/chipStatus';

const GW_CHIP_LIST = [
  { id: 'defensePlusPlus', name: 'Defence++', desc: '+5 for every clean sheet you call right.' },
  { id: 'allInWeek', name: 'All-In Week', desc: 'Doubles every point this gameweek, wins and losses.' },
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
  return (
    <div className="flex min-w-0 w-full flex-col gap-2">
      <span className="font-outfit text-xs uppercase tracking-[0.16em] text-text-muted">
        CHIPS · THE WHOLE GAMEWEEK
      </span>
      <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-2">
        {GW_CHIP_LIST.map((c) => {
          const isSelected = activeIds.includes(c.id);
          const hue = CHIP_HUES[c.id] || DEFAULT_CHIP_HUE;
          const statusChip = chips.find((chip) => (chip.chipId || chip.id) === c.id);
          const left = gwChipLeftLabel(c.id, chips, { active: isSelected, currentGameweek });
          const isSpent = !isSelected && statusChip?.available === false;
          const isBusy = busyId === c.id;
          const disabled = isSpent || !!busyId;

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
                  ? 'border-brand-amber bg-brand-amber/10 shadow-[0_0_0_2px_color-mix(in_srgb,var(--brand-amber)_20%,transparent)]'
                  : isSpent
                    ? 'border-border-card bg-surface-header/50 opacity-60'
                    : 'border-border-card bg-surface-card hover:border-border-control'
              }`}
            >
              <div className="flex shrink-0 flex-col items-center gap-1">
                <ChipToken
                  tag={CHIP_TAGS[c.id]}
                  hue={isSelected ? 'var(--brand-amber)' : hue}
                  size={36}
                  muted={isSpent}
                />
                <span
                  className={`font-outfit text-2xs ${
                    isSelected ? 'text-brand-amber' : 'text-text-muted'
                  }`}
                >
                  {isBusy ? 'applying…' : left}
                </span>
              </div>

              <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                <span
                  className={`text-xs font-semibold leading-tight ${
                    isSelected ? 'text-brand-amber' : 'text-text-primary'
                  }`}
                >
                  {c.name}
                </span>
                <span className="text-2xs leading-snug text-text-muted [text-wrap:pretty]">
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
