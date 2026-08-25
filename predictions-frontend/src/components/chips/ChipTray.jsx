import { useDraggable } from '@dnd-kit/core';
import ChipToken from '../ui/ChipToken';
import { CHIP_HUES, CHIP_TAGS, DEFAULT_CHIP_HUE, chipStatusLabel } from './chipHues';

function DraggableChip({ chip, size, onFocus }) {
  const hue = CHIP_HUES[chip.chipId] || DEFAULT_CHIP_HUE;
  const tag = CHIP_TAGS[chip.chipId] || chip.icon;
  const status = chipStatusLabel(chip);
  const cooling = !chip.available;

  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: `tray-${chip.chipId}`,
    data: { chipId: chip.chipId },
  });

  const style = transform
    ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`, zIndex: 30 }
    : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      onClick={() => onFocus?.(chip.chipId)}
      className={`flex w-[118px] shrink-0 flex-col items-center gap-2 rounded-lg px-1 py-1.5 transition-transform cursor-grab active:cursor-grabbing ${
        isDragging ? 'scale-105 opacity-70' : ''
      }`}
      title={cooling ? `${status.text} — you can still pick it up; placement is blocked on weeks still in cooldown` : `Drag ${chip.name} onto a gameweek`}
    >
      <ChipToken tag={tag} hue={hue} size={size} muted={cooling} />
      <span className="text-center text-sm leading-tight text-text-secondary">{chip.name}</span>
      <span className={`font-mono text-xs ${status.warn ? 'text-state-error' : 'text-text-muted-2'}`}>{status.text}</span>
    </div>
  );
}

/**
 * Desktop "hand" of real chips — always pick-up-able; cooldown blocks
 * placement on a week (planRules), not dragging out of the tray.
 */
export default function ChipTray({ chips, size = 64, onFocus }) {
  return (
    <div className="flex flex-wrap justify-center gap-8">
      {chips.map((chip) => (
        <DraggableChip key={chip.chipId} chip={chip} size={size} onFocus={onFocus} />
      ))}
    </div>
  );
}
