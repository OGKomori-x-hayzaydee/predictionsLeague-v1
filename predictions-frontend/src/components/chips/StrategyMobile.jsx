import { useState } from 'react';
import { Prohibit, X } from '@phosphor-icons/react';
import ChipToken from '../ui/ChipToken';
import { CHIP_HUES, CHIP_TAGS, DEFAULT_CHIP_HUE, chipStatusLabel } from './chipHues';
import { whyCannotPlan } from './planRules';
import { isGameweekChip } from '../../utils/chipManager';
import FixtureSlip from '../fixtures/FixtureSlip';

/**
 * Mobile Strategy view — Spine.dc.html buildChipsMobile() (script
 * ~5633-5708) uses tap-select-then-tap-week instead of desktop's drag,
 * since there's no drag surface on a touch scroll list. Same real data as
 * StrategyTab (chips, plan, current-gameweek difficulty/fixtures), passed
 * down as props so both views share one source of truth.
 */
export default function StrategyMobile({
  availableChips,
  currentGameweek,
  weeks,
  plan,
  chipLookup,
  currentDifficulty,
  currentGwFixtures,
  normalizeTeamName,
  onAssign,
  onRemove,
  onClear,
}) {
  const [selectedChipId, setSelectedChipId] = useState(null);
  const [expandedWeek, setExpandedWeek] = useState(null);

  const plannedCount = Object.keys(plan).length;
  const inHandCount = availableChips.filter((c) => c.available).length;
  const selectedChip = selectedChipId ? chipLookup[selectedChipId] : null;

  const handleWeekTap = (gw) => {
    if (selectedChip) {
      const reason = whyCannotPlan(selectedChip, gw, currentGameweek);
      if (reason) return;
      onAssign(gw, selectedChipId);
      setSelectedChipId(null);
      setExpandedWeek(gw);
      return;
    }
    setExpandedWeek((w) => (w === gw ? null : gw));
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-3 rounded-14 border border-border-base bg-surface-card-2 px-[15px] py-[13px]">
        <span className="flex flex-1 flex-col gap-0.5">
          <span className="font-mono text-2xs tracking-[0.13em] text-text-muted-2">YOUR PLAN</span>
          <span className="text-2xs text-text-muted-2">
            {plannedCount} chip{plannedCount === 1 ? '' : 's'} planned · {inHandCount} still in hand
          </span>
        </span>
      </div>

      <div className="flex flex-col gap-2">
        <span className="font-mono text-2xs tracking-[0.1em] text-text-muted-2">Chips in hand · tap one, then tap a week</span>
        <div className="flex gap-2 overflow-x-auto pb-0.5">
          {availableChips.map((chip) => {
            const hue = CHIP_HUES[chip.chipId] || DEFAULT_CHIP_HUE;
            const tag = CHIP_TAGS[chip.chipId] || chip.icon;
            const status = chipStatusLabel(chip);
            const on = selectedChipId === chip.chipId;
            return (
              <button
                key={chip.chipId}
                type="button"
                onClick={() => setSelectedChipId((s) => (s === chip.chipId ? null : chip.chipId))}
                className={`flex shrink-0 items-center gap-3 rounded-14 border px-3.5 py-3 text-left transition-colors ${
                  on ? 'border-brand-teal-mid/50 bg-brand-teal/10' : 'border-border-card bg-surface-card-4'
                } ${!chip.available ? 'opacity-70' : ''}`}
              >
                <ChipToken tag={tag} hue={hue} size={32} muted={!chip.available} />
                <span className="flex flex-col gap-0.5 whitespace-nowrap">
                  <span className="text-sm text-text-secondary">{chip.name}</span>
                  <span className={`font-mono text-2xs ${status.warn ? 'text-state-error' : 'text-text-muted-2'}`}>{status.text}</span>
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {selectedChip && (
        <div className="flex items-center gap-[10px] rounded-md border border-brand-teal-mid/40 bg-brand-teal/10 px-[13px] py-[11px]">
          <span className="flex-1 text-caption leading-snug text-brand-teal-tint">Placing {selectedChip.name} — tap a week below</span>
          <button
            onClick={() => setSelectedChipId(null)}
            className="rounded-full border border-border-card bg-surface-card-4 px-3 py-1.5 font-mono text-3xs tracking-[0.1em] text-text-muted-1"
          >
            CANCEL
          </button>
        </div>
      )}

      <div className="flex flex-col gap-2">
        {weeks.map((gw) => {
          const isCurrent = gw === currentGameweek;
          const plannedChipId = plan[gw];
          const plannedChip = plannedChipId ? chipLookup[plannedChipId] : null;
          const difficulty = isCurrent ? currentDifficulty : null;
          const open = expandedWeek === gw;
          const reason = selectedChip ? whyCannotPlan(selectedChip, gw, currentGameweek) : null;

          const hue = plannedChip ? CHIP_HUES[plannedChip.chipId] || DEFAULT_CHIP_HUE : null;
          const gwArmed = plannedChip && isGameweekChip(plannedChip.chipId);
          const matchArmed = plannedChip && !isGameweekChip(plannedChip.chipId);

          return (
            <div
              key={gw}
              className={`flex flex-col overflow-hidden rounded-14 border ${
                plannedChip ? 'border-brand-teal-mid/30 bg-surface-card-3' : 'border-border-card bg-surface-card-2'
              }`}
              style={gwArmed ? { boxShadow: `inset 0 0 0 1px ${hue}` } : undefined}
            >
              <button type="button" onClick={() => handleWeekTap(gw)} className="flex min-h-16 items-center gap-3 px-4 py-3.5 text-left">
                <span className="w-14 shrink-0 font-mono text-sm text-text-muted-1">
                  GW{gw}
                  {isCurrent && <span className="ml-1 text-brand-teal">NOW</span>}
                </span>
                <span className="flex min-w-0 flex-1 flex-col gap-1.5">
                  <span className="font-mono text-xs tracking-[0.08em] text-text-muted-2">
                    {difficulty ? difficulty.style.label : 'FIXTURES TBD'}
                  </span>
                  <span className="flex h-1.5 overflow-hidden rounded-[3px] bg-surface-card-4">
                    <span
                      className="h-full rounded-[3px]"
                      style={{
                        width: difficulty ? `${Math.round(18 + difficulty.score * 72)}%` : '10%',
                        background: difficulty ? difficulty.style.color : 'var(--border-base)',
                      }}
                    />
                  </span>
                  {selectedChip && (
                    <span className={`flex items-center gap-1 font-mono text-xs ${reason ? 'text-state-error' : 'text-brand-teal'}`}>
                      {reason ? <Prohibit size={12} /> : null}
                      {reason || `tap to place ${selectedChip.name}`}
                    </span>
                  )}
                </span>
                <span className="flex shrink-0 items-center gap-1.5">
                  {plannedChip && (
                    <ChipToken tag={CHIP_TAGS[plannedChip.chipId] || plannedChip.icon} hue={CHIP_HUES[plannedChip.chipId] || DEFAULT_CHIP_HUE} size={28} />
                  )}
                  <span
                    className="font-mono text-sm text-text-muted-4 transition-transform"
                    style={{ transform: open ? 'rotate(180deg)' : 'none' }}
                  >
                    ▾
                  </span>
                </span>
              </button>

              {open && (
                <div className="flex flex-col gap-3 border-t border-border-base px-4 py-4">
                  {isCurrent ? (
                    currentGwFixtures.length > 0 ? (
                      <div className="flex gap-3 overflow-x-auto pb-1">
                        {currentGwFixtures.map((f) => (
                          <div key={f.id} className="relative shrink-0">
                            <FixtureSlip
                              fixture={{
                                ...f,
                                homeTeam: normalizeTeamName(f.homeTeam),
                                awayTeam: normalizeTeamName(f.awayTeam),
                              }}
                              prediction={f.userPrediction}
                              variant="scored"
                              density="compact"
                              gameweekLabel={`GW${gw}`}
                            />
                            {matchArmed && (
                              <div className="absolute -right-1 -top-1 rotate-[8deg]" title={plannedChip.name}>
                                <ChipToken
                                  tag={CHIP_TAGS[plannedChip.chipId] || plannedChip.icon}
                                  hue={hue}
                                  size={26}
                                />
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <span className="text-sm text-text-muted-2">Fixtures for this gameweek aren&apos;t in yet.</span>
                    )
                  ) : (
                    <span className="text-sm text-text-muted-2">Fixtures for GW{gw} haven&apos;t been released yet.</span>
                  )}
                  {plannedChip && (
                    <div className="flex items-center gap-3 rounded-12 border border-border-base bg-surface-app px-3 py-3">
                      <ChipToken tag={CHIP_TAGS[plannedChip.chipId] || plannedChip.icon} hue={CHIP_HUES[plannedChip.chipId] || DEFAULT_CHIP_HUE} size={28} />
                      <span className="flex-1 text-sm text-text-secondary">{plannedChip.name} planned this week</span>
                      <button type="button" onClick={() => onRemove(gw)} className="font-mono text-xs text-text-muted-3" aria-label="Remove">
                        <X size={14} />
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {plannedCount > 0 && (
        <button
          onClick={onClear}
          className="self-center rounded-full border border-border-control px-[22px] py-3 font-mono text-2xs tracking-[0.1em] text-text-muted-2"
        >
          CLEAR THE PLAN
        </button>
      )}
    </div>
  );
}
