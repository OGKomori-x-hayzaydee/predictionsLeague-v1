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
 * footer (Spine.dc.html desktop lines 664-679) — driven by useFixtureSpine's
 * `stations`, restyled as small crest tiles rather than Dashboard's taller
 * station plates (StationRail.jsx) since this screen's footer strip has its
 * own compact recipe in the prototype. Desktop-only; mobile has no
 * equivalent (prev/next arrows only, see foundation spec §6.1 note).
 */
export default function FixtureReelStrip({ stations }) {
  if (!stations.length) return null;

  return (
    <div className="flex items-stretch gap-[7px]">
      {stations.map((s) => {
        const label = s.predicted ? s.scoreLabel : s.isSelected ? 'editing' : 'open';
        const scoreColor = s.predicted ? 'text-brand-teal' : s.isSelected ? 'text-brand-amber' : 'text-text-muted-5';
        const markColor = s.predicted ? 'bg-brand-teal-deep' : s.isSelected ? 'bg-brand-amber' : 'bg-surface-card-4';
        const bgClass = s.isSelected ? 'bg-brand-teal/10' : s.predicted ? 'bg-surface-card-4/60' : 'bg-surface-card/60';
        const borderClass = s.isSelected
          ? 'border-brand-teal-mid/40'
          : s.predicted
            ? 'border-border-card'
            : 'border-border-base';

        return (
          <button
            key={s.id}
            type="button"
            onClick={s.onSelect}
            className={`flex min-w-0 flex-1 flex-col gap-[5px] overflow-hidden rounded-[10px] border px-[7px] py-2 font-outfit transition-colors hover:border-brand-teal-mid/40 ${bgClass} ${borderClass}`}
          >
            <span className={`font-mono text-[9.5px] tracking-[0.08em] ${s.isSelected ? 'text-brand-teal' : 'text-text-muted-4'}`}>
              {formatDay(s.date)}
            </span>
            <span className="flex items-center justify-center gap-[5px]">
              <TeamCrest team={s.homeTeam} size={17} />
              <TeamCrest team={s.awayTeam} size={17} />
            </span>
            <span className={`text-center font-mono text-[11px] ${scoreColor}`}>{label}</span>
            <span className={`h-[2px] rounded-full ${markColor}`} />
          </button>
        );
      })}
    </div>
  );
}
