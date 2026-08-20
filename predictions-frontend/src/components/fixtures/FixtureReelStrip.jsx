import TeamCrest from '../ui/TeamCrest';

function formatDay(dateStr) {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return '—';
  const day = d.toLocaleDateString(undefined, { weekday: 'short' }).toUpperCase();
  const time = d.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit', hour12: false });
  return `${day} ${time}`;
}

/**
 * "THE REEL" fixture-thumbnail strip along the bottom of the desktop editor
 * (Spine.dc.html desktop lines 664-679).
 * Contained in a centered max-width container with rem/em units.
 */
export default function FixtureReelStrip({ stations }) {
  if (!stations.length) return null;

  const filedCount = stations.filter((s) => s.predicted).length;
  const totalPoints = stations.reduce((sum, s) => sum + (s.predicted ? (s.ceiling || 15) : 0), 0);

  return (
    <div className="flex flex-col gap-1.5 w-full max-w-5xl mx-auto">
      <div className="flex items-center justify-between">
        <span className="font-mono text-[0.625rem] tracking-widest text-[#5b667d]">THE REEL</span>
        <span className="font-mono text-[0.625rem] tracking-widest text-[#5b667d]">
          {totalPoints > 0 ? `${totalPoints} pts staked across ${filedCount} filed` : `${filedCount} of ${stations.length} filed`}
        </span>
      </div>

      <div className="flex items-stretch gap-2">
        {stations.map((s) => {
          const isSelected = s.isSelected;
          const isPredicted = s.predicted;
          const label = isPredicted ? s.scoreLabel : isSelected ? 'editing' : 'open';
          const scoreColor = isPredicted ? 'text-[#5eead4]' : isSelected ? 'text-[#fcd34d]' : 'text-[#5b667d]';
          const markColor = isPredicted ? 'bg-[#14b8a6]' : isSelected ? 'bg-[#fcd34d]' : 'bg-[#1e2a3f]';
          const dayColor = isSelected ? '#5eead4' : '#7f93ad';
          const bgClass = isSelected ? 'bg-[#0d1c2ecc]' : isPredicted ? 'bg-[#0b1424b8]' : 'bg-[#080e1a80]';
          const borderClass = isSelected
            ? 'border-[#14b8a699] shadow-[0_0_0_1px_#14b8a633]'
            : isPredicted
              ? 'border-[#1e3450]'
              : 'border-[#16203a]';

          return (
            <button
              key={s.id}
              type="button"
              onClick={s.onSelect}
              className={`flex min-w-0 flex-1 cursor-pointer flex-col gap-1 overflow-hidden rounded-lg border p-2 font-outfit transition-all hover:border-[#2b4162] ${bgClass} ${borderClass}`}
            >
              <span className="font-mono text-[0.625rem] tracking-wider" style={{ color: dayColor }}>
                {formatDay(s.date)}
              </span>
              <div className="flex items-center justify-center gap-1.5 py-0.5">
                <TeamCrest team={s.homeTeam} size={18} />
                <TeamCrest team={s.awayTeam} size={18} />
              </div>
              <span className={`text-center font-mono text-xs font-medium ${scoreColor}`}>{label}</span>
              <span className={`h-0.5 w-full rounded-full ${markColor}`} />
            </button>
          );
        })}
      </div>
    </div>
  );
}
