import Avatar from '../ui/Avatar';

const PLACE_ORDER = [1, 0, 2]; // visual order: 2nd, 1st, 3rd
const PLACE_SIZE = { 0: 64, 1: 52, 2: 46 };
const PLACE_HEIGHT = { 0: 96, 1: 68, 2: 52 };

export default function Podium({ standings }) {
  const top3 = standings.slice(0, 3);
  if (top3.length === 0) return null;

  return (
    <div className="flex items-end justify-center gap-4 py-6">
      {PLACE_ORDER.filter((i) => top3[i]).map((i) => {
        const member = top3[i];
        return (
          <div key={member.id || member.username} className="flex flex-col items-center gap-2">
            <Avatar name={member.displayName || member.username} size={PLACE_SIZE[i]} />
            <span className="max-w-[80px] truncate text-xs text-text-secondary">
              {member.displayName || member.username}
            </span>
            <div
              className={`flex w-20 items-start justify-center rounded-t-md pt-2 font-dmSerif text-lg ${
                i === 0 ? 'bg-brand-amber/15 text-brand-amber' : 'bg-surface-card-3 text-text-muted-1'
              }`}
              style={{ height: PLACE_HEIGHT[i] }}
            >
              {i + 1}
            </div>
          </div>
        );
      })}
    </div>
  );
}
