import { DndContext } from '@dnd-kit/core';
import ChipTray from './ChipTray';
import GameweekRow from './GameweekRow';
import KickerLabel from '../ui/KickerLabel';
import { useChipManagement } from '../../context/ChipManagementContext';
import { useChipPlan } from '../../hooks/useChipPlan';

export default function PlanTab() {
  const { availableChips, currentGameweek } = useChipManagement();
  const { plan, assign, clear } = useChipPlan();

  const chipLookup = Object.fromEntries(availableChips.map((c) => [c.chipId, c]));
  const gameweeks = Array.from({ length: 15 }, (_, i) => currentGameweek + i).filter((gw) => gw <= 38);

  const plannedCount = Object.keys(plan).length;

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over) return;
    const chipId = active.data.current?.chipId;
    const gameweek = over.data.current?.gameweek;
    if (chipId && gameweek) assign(gameweek, chipId);
  };

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <div className="space-y-6">
        <KickerLabel as="div">
          {gameweeks.length} weeks left · {plannedCount} planned
        </KickerLabel>

        <ChipTray chips={availableChips} />

        <div className="space-y-2">
          {gameweeks.map((gw) => (
            <GameweekRow
              key={gw}
              gameweek={gw}
              plannedChip={plan[gw]}
              chipLookup={chipLookup}
              onClear={clear}
            />
          ))}
        </div>
      </div>
    </DndContext>
  );
}
