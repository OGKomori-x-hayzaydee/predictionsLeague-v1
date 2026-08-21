import { CHIP_HUES, DEFAULT_CHIP_HUE, chipStatusLabel } from './chipHues';
import { hasSeasonCap } from '../../utils/chipStatus';

const SEASON_END_GW = 38;

/**
 * Real season-allowance summary (desktop only — the prototype's mobile
 * Chips screen has no equivalent rail block). Only All-In Week actually
 * carries a season cap in CHIP_CONFIG (seasonLimit: 4); the rest are
 * cooldown-gated with no cap, so this renders whichever constraint really
 * applies per chip instead of inventing a uniform "allowance" for all five.
 */
export default function AllowanceRail({ availableChips, currentGameweek, open, onToggle }) {
  const weeksLeft = Math.max(SEASON_END_GW - currentGameweek, 0);
  const withAllowance = availableChips.filter((c) => c.available || (hasSeasonCap(c) && (c.remainingUses ?? 0) > 0) || !hasSeasonCap(c));

  if (!open) {
    return (
      <button onClick={onToggle} className="flex h-[50px] w-full items-center gap-3 border-t border-border-base px-1 text-left">
        <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-brand-teal" />
        <span className="font-mono text-2xs text-text-muted-1">
          {withAllowance.length} chip type{withAllowance.length === 1 ? '' : 's'} still usable · {weeksLeft} gameweeks left in the season
        </span>
        <span className="ml-auto font-mono text-2xs text-text-muted-4">ALLOWANCE</span>
      </button>
    );
  }

  return (
    <div className="flex flex-col gap-3 border-t border-border-base py-4">
      <div className="flex items-center gap-2">
        <span className="font-mono text-2xs tracking-[0.14em] text-text-muted-3">ALLOWANCE, REMAINING SEASON</span>
        <button onClick={onToggle} className="ml-auto font-mono text-2xs text-text-muted-4">HIDE</button>
      </div>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
        {availableChips.map((chip) => {
          const status = chipStatusLabel(chip);
          const hue = CHIP_HUES[chip.chipId] || DEFAULT_CHIP_HUE;
          return (
            <div key={chip.chipId} className="flex flex-col gap-1.5 min-w-0">
              <div className="flex items-baseline gap-1.5">
                <span className="truncate text-xs text-text-muted-1">{chip.name}</span>
                <span className={`ml-auto shrink-0 font-mono text-2xs ${status.warn ? 'text-state-error' : 'text-text-muted-2'}`}>
                  {status.text}
                </span>
              </div>
              {hasSeasonCap(chip) ? (
                <span className="flex gap-[3px]">
                  {Array.from({ length: chip.seasonLimit }).map((_, i) => (
                    <span
                      key={i}
                      className="h-[5px] flex-1 rounded-[2px]"
                      style={{ background: i < (chip.usageCount ?? 0) ? 'var(--border-control)' : hue }}
                    />
                  ))}
                </span>
              ) : (
                <span className="h-[5px] rounded-[2px]" style={{ background: chip.available ? hue : 'var(--border-control)' }} />
              )}
            </div>
          );
        })}
      </div>
      <span className="font-mono text-2xs text-text-muted-4">
        Bright = usable now or has season allowance left · dark = on cooldown or exhausted
      </span>
    </div>
  );
}
