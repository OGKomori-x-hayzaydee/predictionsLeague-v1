import { useDraggable } from '@dnd-kit/core';
import ChipToken from '../ui/ChipToken';
import { CHIP_HUES, CHIP_TAGS, DEFAULT_CHIP_HUE, chipStatusLabel } from './chipHues';

function DraggableChip({ chip, size, onFocus }) {
  const hue = CHIP_HUES[chip.chipId] || DEFAULT_CHIP_HUE;
  const tag = CHIP_TAGS[chip.chipId] || chip.icon;
  const status = chipStatusLabel(chip);
  const disabled = !chip.available;

  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: `tray-${chip.chipId}`,
    data: { chipId: chip.chipId },
    disabled,
  });

  const style = transform
    ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`, zIndex: 30 }
    : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...(disabled ? {} : listeners)}
      {...(disabled ? {} : attributes)}
      onClick={() => onFocus?.(chip.chipId)}
      className={`flex w-[102px] shrink-0 flex-col items-center gap-1.5 rounded-lg px-1 py-1 transition-transform ${
        disabled ? 'cursor-not-allowed opacity-40' : 'cursor-grab active:cursor-grabbing'
      } ${isDragging ? 'scale-105 opacity-70' : ''}`}
      title={disabled ? status.text : `Drag ${chip.name} onto a gameweek`}
    >
      <ChipToken tag={tag} hue={hue} size={size} muted={disabled} />
      <span className="text-center text-[12.5px] leading-tight text-text-secondary">{chip.name}</span>
      <span className={`font-mono text-[10px] ${status.warn ? 'text-state-error' : 'text-text-muted-2'}`}>{status.text}</span>
    </div>
  );
}

/**
 * Desktop "hand" of real chips — drag onto a week card in the season grid
 * (StrategyTab renders the droppable week cards and owns the DndContext).
 */
export default function ChipTray({ chips, size = 56, onFocus }) {
  return (
    <div className="flex flex-wrap justify-center gap-6">
      {chips.map((chip) => (
        <DraggableChip key={chip.chipId} chip={chip} size={size} onFocus={onFocus} />
      ))}
    </div>
  );
}
