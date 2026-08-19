import { useDroppable } from '@dnd-kit/core';
import TokenBadge from '../ui/TokenBadge';

const COLOR_VARS = {
  teal: 'var(--brand-teal)',
  purple: 'var(--brand-indigo)',
  green: 'var(--brand-teal-deep)',
  amber: 'var(--brand-amber)',
};

export default function GameweekRow({ gameweek, plannedChip, chipLookup, onClear }) {
  const { setNodeRef, isOver } = useDroppable({ id: `gw-${gameweek}`, data: { gameweek } });
  const chip = plannedChip ? chipLookup[plannedChip] : null;

  return (
    <div
      ref={setNodeRef}
      className={`flex items-center gap-3 rounded-md border px-4 py-3 transition-colors ${
        isOver ? 'border-brand-teal bg-brand-teal/10' : 'border-border-card bg-surface-card-2'
      }`}
    >
      <span className="w-12 font-mono text-xs text-text-muted-2">GW{gameweek}</span>
      <span className="flex-1 text-sm text-text-muted-1">
        {chip ? `${chip.name} planned` : 'Drop a chip here to plan this week'}
      </span>
      {chip && (
        <div className="flex items-center gap-2">
          <TokenBadge label={chip.icon} color={COLOR_VARS[chip.color] || 'var(--brand-teal)'} size={24} />
          <button
            onClick={() => onClear(gameweek)}
            className="font-mono text-xs text-text-muted-3 hover:text-state-error"
            aria-label="Unassign"
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
}
