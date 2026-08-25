import { useMemo, useState } from 'react';
import { DndContext, useDroppable } from '@dnd-kit/core';
import { Prohibit, X } from '@phosphor-icons/react';
import ChipToken from '../ui/ChipToken';
import ChipTray from './ChipTray';
import AllowanceRail from './AllowanceRail';
import StrategyMobile from './StrategyMobile';
import { CHIP_HUES, CHIP_TAGS, DEFAULT_CHIP_HUE } from './chipHues';
import { computeGameweekDifficulty } from './difficultyTiers';
import { canPlan, whyCannotPlan } from './planRules';
import { useChipManagement } from '../../context/ChipManagementContext';
import { useChipPlan } from '../../hooks/useChipPlan';
import { useExternalFixtures } from '../../hooks/useExternalFixtures';
import { normalizeTeamName } from '../../utils/teamUtils';
import { isGameweekChip } from '../../utils/chipManager';
import FixtureSlip from '../fixtures/FixtureSlip';
import LoadingState from '../common/LoadingState';

const SEASON_END_GW = 38;
const SEASON_WINDOW = 15;

function PlannedFixtureGrid({ gw, fixtures, plannedChip }) {
  const hue = plannedChip ? CHIP_HUES[plannedChip.chipId] || DEFAULT_CHIP_HUE : null;
  const matchArmed = plannedChip && !isGameweekChip(plannedChip.chipId);

  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-3">
      {fixtures.map((f) => (
        <div key={f.id || f.matchId} className="relative w-fit justify-self-center">
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
                size={28}
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function WeekCard({ gw, isCurrent, isSelected, plannedChip, difficulty, onSelect, dragChip, currentGameweek }) {
  const { setNodeRef, isOver } = useDroppable({ id: `chip-week-${gw}`, data: { gameweek: gw } });
  const barPct = difficulty ? Math.round(18 + difficulty.score * 72) : 12;
  const barColor = difficulty ? difficulty.style.color : 'var(--border-base)';
  const label = difficulty ? difficulty.style.label : '—';
  const active = isSelected || !!plannedChip;
  const rejectReason = dragChip ? whyCannotPlan(dragChip, gw, currentGameweek) : null;
  const reject = isOver && !!rejectReason;
  const gwArmed = plannedChip && isGameweekChip(plannedChip.chipId);
  const hue = plannedChip ? CHIP_HUES[plannedChip.chipId] || DEFAULT_CHIP_HUE : null;

  return (
    <button
      ref={setNodeRef}
      type="button"
      onClick={() => onSelect(gw)}
      title={reject ? rejectReason : undefined}
      className={`flex flex-1 flex-col items-center gap-2 rounded-xl border px-1 py-3.5 transition-colors ${
        reject
          ? 'border-state-error bg-state-error/10'
          : isOver
            ? 'border-brand-teal bg-brand-teal/10'
            : isSelected
              ? 'border-brand-teal-mid/50 bg-surface-card-2'
              : plannedChip
                ? 'border-border-card bg-surface-card-3'
                : 'border-border-card bg-transparent hover:border-border-control'
      }`}
      style={gwArmed && !reject ? { boxShadow: `inset 0 0 0 1px ${hue}` } : undefined}
    >
      <span className={`font-mono text-sm ${active ? 'text-brand-teal' : 'text-text-muted-2'}`}>{gw}</span>
      <span className="flex h-8 items-center justify-center">
        {reject ? (
          <Prohibit size={22} className="text-state-error" weight="bold" />
        ) : plannedChip ? (
          <ChipToken tag={CHIP_TAGS[plannedChip.chipId] || plannedChip.icon} hue={CHIP_HUES[plannedChip.chipId] || DEFAULT_CHIP_HUE} size={34} />
        ) : null}
      </span>
      <span className="flex w-7 flex-col justify-end overflow-hidden rounded-[3px] bg-surface-card-4" style={{ height: 72 }}>
        <span className="rounded-[3px]" style={{ height: `${barPct}%`, background: barColor }} />
      </span>
      <span className="font-mono text-2xs tracking-[0.06em]" style={{ color: active ? 'var(--text-primary)' : 'var(--text-muted-2)' }}>
        {label}
      </span>
      {isCurrent && <span className="font-mono text-2xs text-brand-teal">NOW</span>}
    </button>
  );
}

function WeekFocus({ gw, isCurrentWeek, fixtures, plannedChip, availableChips, currentGameweek, difficulty, onAssign, onRemove }) {
  const hue = plannedChip ? CHIP_HUES[plannedChip.chipId] || DEFAULT_CHIP_HUE : null;
  const gwArmed = plannedChip && isGameweekChip(plannedChip.chipId);

  return (
    <div
      className="flex flex-col gap-5 rounded-md border border-border-card bg-surface-card p-6"
      style={gwArmed ? { boxShadow: `inset 0 0 0 1px ${hue}` } : undefined}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-1.5">
          <span className="font-mono text-xs tracking-[0.16em] text-brand-teal">
            GAMEWEEK {gw}
            {difficulty ? ` · ${difficulty.style.label}` : ''}
            {gwArmed ? ` · ${plannedChip.name}` : ''}
          </span>
          <h3 className="font-dmSerif text-2xl leading-tight text-text-primary">
            {plannedChip ? `${plannedChip.name} on gameweek ${gw}` : `Nothing planned for gameweek ${gw}`}
          </h3>
        </div>
        {plannedChip && (
          <button type="button" onClick={() => onRemove(gw)} className="flex shrink-0 items-center gap-1 font-mono text-sm text-text-muted-3 hover:text-state-error">
            Remove <X size={14} />
          </button>
        )}
      </div>

      {isCurrentWeek ? (
        fixtures.length > 0 ? (
          <PlannedFixtureGrid gw={gw} fixtures={fixtures} plannedChip={plannedChip} />
        ) : (
          <p className="text-sm text-text-muted-2">Fixtures for this gameweek aren&apos;t in yet.</p>
        )
      ) : (
        <p className="text-sm leading-relaxed text-text-muted-2">
          Fixtures for GW{gw} haven&apos;t been released yet — the difficulty read fills in once they are.
        </p>
      )}

      <div className="flex flex-wrap gap-2.5 border-t border-border-base pt-4">
        {availableChips.map((chip) => {
          const reason = whyCannotPlan(chip, gw, currentGameweek);
          const isPlanned = plannedChip?.chipId === chip.chipId;
          return (
            <button
              key={chip.chipId}
              type="button"
              onClick={() => !reason && onAssign(gw, chip.chipId)}
              title={reason || undefined}
              className={`inline-flex items-center gap-1.5 rounded-full border px-3.5 py-2 font-mono text-xs transition-colors ${
                isPlanned
                  ? 'border-brand-teal-mid/50 bg-brand-teal/10 text-brand-teal'
                  : reason
                    ? 'border-border-base text-text-muted-4'
                    : 'border-border-control text-text-secondary hover:border-brand-teal-mid/40'
              }`}
            >
              {reason ? <Prohibit size={12} className="text-state-error" /> : null}
              {CHIP_TAGS[chip.chipId] || chip.icon} {chip.name}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default function StrategyTab() {
  const { availableChips, currentGameweek, isLoading: chipsLoading } = useChipManagement();
  const { plan, assign, clear, clearAll } = useChipPlan();
  const { fixtures, isLoading: fixturesLoading } = useExternalFixtures();
  const [selectedGw, setSelectedGw] = useState(null);
  const [railOpen, setRailOpen] = useState(false);
  const [dragChipId, setDragChipId] = useState(null);

  const chipLookup = useMemo(() => Object.fromEntries(availableChips.map((c) => [c.chipId, c])), [availableChips]);

  const weeks = useMemo(() => {
    const list = [];
    for (let gw = currentGameweek; gw <= Math.min(currentGameweek + SEASON_WINDOW - 1, SEASON_END_GW); gw++) list.push(gw);
    return list;
  }, [currentGameweek]);

  const currentGwFixtures = useMemo(() => fixtures.filter((f) => f.gameweek === currentGameweek), [fixtures, currentGameweek]);
  const currentDifficulty = useMemo(() => computeGameweekDifficulty(currentGwFixtures, normalizeTeamName), [currentGwFixtures]);

  const plannedCount = Object.keys(plan).length;
  const inHandCount = availableChips.filter((c) => c.available).length;

  const handleDragStart = (event) => {
    setDragChipId(event.active.data.current?.chipId || null);
  };

  const handleDragEnd = (event) => {
    setDragChipId(null);
    const { active, over } = event;
    if (!over) return;
    const chipId = active.data.current?.chipId;
    const gameweek = over.data.current?.gameweek;
    if (!chipId || !gameweek) return;
    if (!canPlan(chipLookup[chipId], gameweek, currentGameweek)) return;
    assign(gameweek, chipId);
    setSelectedGw(gameweek);
  };

  const handleDragCancel = () => setDragChipId(null);

  const handleAssign = (gw, chipId) => {
    if (!canPlan(chipLookup[chipId], gw, currentGameweek)) return;
    assign(gw, chipId);
  };

  if (chipsLoading) return <LoadingState message="Loading your chips..." />;

  const activeGw = selectedGw ?? weeks[0];

  return (
    <>
      {/* Desktop — foundation spec §5.3; drag chips from the hand onto a week */}
      <div className="hidden flex-col gap-7 md:flex">
        <div className="flex items-end justify-between gap-6">
          <div className="flex min-w-0 flex-1 flex-col gap-1.5">
            <span className="font-mono text-xs tracking-[0.16em] text-brand-teal">
              {plannedCount === 0 ? `${weeks.length} WEEKS AHEAD · ${inHandCount} CHIPS IN HAND` : `${plannedCount} PLANNED · ${inHandCount} STILL IN HAND`}
            </span>
            <h2 className="font-dmSerif text-4xl leading-tight text-text-primary">
              {plannedCount === 0 ? 'Which week deserves a chip?' : 'Your run-in, one chip at a time'}
            </h2>
          </div>
        </div>

        <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd} onDragCancel={handleDragCancel}>
          <div className="flex flex-col items-center gap-3">
            <span className="font-mono text-xs tracking-[0.16em] text-text-muted-3">YOUR HAND</span>
            <ChipTray chips={availableChips} />
          </div>

          <div className="flex items-stretch gap-1.5">
            {weeks.map((gw) => (
              <WeekCard
                key={gw}
                gw={gw}
                isCurrent={gw === currentGameweek}
                isSelected={activeGw === gw}
                plannedChip={plan[gw] ? chipLookup[plan[gw]] : null}
                difficulty={gw === currentGameweek ? currentDifficulty : null}
                onSelect={setSelectedGw}
                dragChip={dragChipId ? chipLookup[dragChipId] : null}
                currentGameweek={currentGameweek}
              />
            ))}
          </div>
        </DndContext>

        {fixturesLoading && activeGw === currentGameweek ? (
          <LoadingState message="Loading this week's fixtures..." />
        ) : (
          <WeekFocus
            gw={activeGw}
            isCurrentWeek={activeGw === currentGameweek}
            fixtures={currentGwFixtures}
            plannedChip={plan[activeGw] ? chipLookup[plan[activeGw]] : null}
            availableChips={availableChips}
            currentGameweek={currentGameweek}
            difficulty={activeGw === currentGameweek ? currentDifficulty : null}
            onAssign={handleAssign}
            onRemove={clear}
          />
        )}

        {plannedCount > 0 && (
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="font-mono text-2xs tracking-[0.13em] text-text-muted-3">
                YOUR PLAN · {plannedCount} CHIP{plannedCount === 1 ? '' : 'S'} ACROSS {plannedCount} WEEK{plannedCount === 1 ? '' : 'S'}
              </span>
              <button onClick={clearAll} className="font-mono text-2xs text-text-muted-2 hover:text-state-error">
                CLEAR THE PLAN
              </button>
            </div>
            <div className="flex flex-col gap-1.5">
              {Object.keys(plan)
                .map(Number)
                .sort((a, b) => a - b)
                .map((gw) => {
                  const chip = chipLookup[plan[gw]];
                  if (!chip) return null;
                  const difficulty = gw === currentGameweek ? currentDifficulty : null;
                  return (
                    <button
                      key={gw}
                      onClick={() => setSelectedGw(gw)}
                      className="flex items-center gap-3.5 rounded-11 border border-border-card bg-surface-card/60 px-[15px] py-3 text-left"
                    >
                      <span className="w-11 font-mono text-2xs text-brand-teal">GW{gw}</span>
                      <span className="w-[190px] truncate text-caption text-text-secondary">{chip.name}</span>
                      <span className="flex-1 text-caption text-text-muted-2">
                        {difficulty ? `${difficulty.style.label.toLowerCase()} week` : 'fixtures not out yet'}
                      </span>
                    </button>
                  );
                })}
            </div>
          </div>
        )}

        <AllowanceRail availableChips={availableChips} currentGameweek={currentGameweek} open={railOpen} onToggle={() => setRailOpen((o) => !o)} />
      </div>

      {/* Mobile — Spine.dc.html buildChipsMobile(), tap-select instead of drag */}
      <div className="md:hidden">
        <StrategyMobile
          availableChips={availableChips}
          currentGameweek={currentGameweek}
          weeks={weeks}
          plan={plan}
          chipLookup={chipLookup}
          currentDifficulty={currentDifficulty}
          currentGwFixtures={currentGwFixtures}
          normalizeTeamName={normalizeTeamName}
          onAssign={handleAssign}
          onRemove={clear}
          onClear={clearAll}
        />
      </div>
    </>
  );
}
