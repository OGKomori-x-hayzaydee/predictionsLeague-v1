import { useDraggable } from '@dnd-kit/core';
import TokenBadge from '../ui/TokenBadge';
import KickerLabel from '../ui/KickerLabel';

const COLOR_VARS = {
  teal: 'var(--brand-teal)',
  purple: 'var(--brand-indigo)',
  green: 'var(--brand-teal-deep)',
  amber: 'var(--brand-amber)',
};

function DraggableChip({ chip }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: `tray-${chip.chipId}`,
    data: { chipId: chip.chipId },
    disabled: !chip.available,
  });

  const style = transform
    ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`, zIndex: 20 }
    : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={`flex flex-col items-center gap-1 rounded-md border border-border-card bg-surface-card-2 px-3 py-2 ${
        chip.available ? 'cursor-grab active:cursor-grabbing' : 'cursor-not-allowed opacity-40'
      } ${isDragging ? 'opacity-60' : ''}`}
      title={chip.available ? `Drag ${chip.name} onto a gameweek` : chip.reason || 'Unavailable'}
    >
      <TokenBadge label={chip.icon} color={COLOR_VARS[chip.color] || 'var(--brand-teal)'} size={40} muted={!chip.available} />
      <span className="text-[11px] text-text-secondary">{chip.name}</span>
      <span className="font-mono text-[9px] text-text-muted-3">
        {(chip.seasonLimit ?? 0) - (chip.usageCount ?? 0)} left
      </span>
    </div>
  );
}

export default function ChipTray({ chips }) {
  return (
    <div>
      <KickerLabel as="div" className="mb-2">Chips in hand · drag one onto a week</KickerLabel>
      <div className="flex flex-wrap gap-3">
        {chips.map((chip) => (
          <DraggableChip key={chip.chipId} chip={chip} />
        ))}
      </div>
    </div>
  );
}
