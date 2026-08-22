import ChipToken from '../ui/ChipToken';
import { CHIP_HUES, CHIP_TAGS, DEFAULT_CHIP_HUE } from './chipHues';
import { hasSeasonCap } from '../../utils/chipStatus';

const CHIP_LIST = [
  { id: 'doubleDown', name: 'Double Down', desc: 'Doubles everything this match returns.' },
  { id: 'wildcard', name: 'Wildcard', desc: 'Triples one match. One a season.' },
  { id: 'scorerFocus', name: 'Scorer Focus', desc: 'Each named scorer pays 4 instead of 2.' },
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
      <span className="font-outfit text-xs uppercase tracking-[0.16em] text-text-muted">
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
                  ? 'border-brand-amber bg-brand-amber/10 shadow-[0_0_0_2px_color-mix(in_srgb,var(--brand-amber)_20%,transparent)]'
                  : isUsed
                    ? 'border-border-card bg-surface-header/50 opacity-60'
                    : 'border-border-card bg-surface-card hover:border-border-control'
              }`}
            >
              <div className="flex shrink-0 flex-col items-center gap-1">
                <ChipToken
                  tag={CHIP_TAGS[c.id]}
                  hue={isSelected ? 'var(--brand-amber)' : hue}
                  size={36}
                  muted={isUsed && !isSelected}
                />
                <span
                  className={`font-outfit text-2xs ${
                    isSelected ? 'text-brand-amber' : 'text-text-muted'
                  }`}
                >
                  {left}
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
