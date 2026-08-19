import TokenBadge from '../ui/TokenBadge';
import KickerLabel from '../ui/KickerLabel';

const COLOR_VARS = {
  teal: 'var(--brand-teal)',
  purple: 'var(--brand-indigo)',
  green: 'var(--brand-teal-deep)',
};

export default function ChipSelector({ chips, selected, onToggle }) {
  if (!chips.length) return null;

  return (
    <div>
      <KickerLabel as="div" className="mb-2">Chips · one per match</KickerLabel>
      <div className="flex flex-wrap gap-3">
        {chips.map((chip) => {
          const isSelected = selected === chip.chipId;
          const disabled = !chip.available && !isSelected;
          return (
            <button
              key={chip.chipId}
              type="button"
              disabled={disabled}
              onClick={() => onToggle(isSelected ? null : chip.chipId)}
              className={`flex flex-col items-center gap-1 rounded-md border px-3 py-2 transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${
                isSelected ? 'border-brand-teal/60 bg-brand-teal/10' : 'border-border-card hover:border-border-control'
              }`}
              title={disabled ? chip.reason || 'Unavailable' : chip.name}
            >
              <TokenBadge label={chip.icon} color={COLOR_VARS[chip.color] || 'var(--brand-teal)'} size={32} />
              <span className="text-[11px] text-text-secondary">{chip.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
