import TeamCrest from '../ui/TeamCrest';

function formatDay(dateStr) {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return '—';
  const day = d.toLocaleDateString(undefined, { weekday: 'short' }).toUpperCase();
  const time = d.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit', hour12: false });
  return `${day} ${time}`;
}

function scoreToneClass(tone, predicted, isSelected) {
  if (tone === 'exact') return 'text-brand-teal';
  if (tone === 'outcome') return 'text-brand-indigo';
  if (tone === 'miss' || tone === 'live') return 'text-brand-amber';
  if (tone === 'filed') return 'text-brand-indigo';
  if (predicted) return 'text-brand-indigo';
  if (isSelected) return 'text-brand-teal';
  return 'text-text-muted-5';
}

function plateClasses(isSelected, predicted) {
  if (isSelected) return 'bg-brand-teal/10 border-brand-teal-mid/40';
  if (predicted) return 'bg-surface-card-4 border-border-card';
  return 'border-transparent';
}

function DesktopStation({ station }) {
  const { homeTeam, awayTeam, predicted, scoreLabel, scoreTone, isSelected, onSelect, date } = station;
  const dayColor = isSelected ? 'text-brand-teal' : 'text-text-muted-5';
  const scoreColor = scoreToneClass(scoreTone, predicted, isSelected);
  const tickW = isSelected ? 'w-[3px]' : 'w-[2px]';
  const tickH = isSelected ? 'h-[34px]' : predicted ? 'h-[22px]' : 'h-[12px]';
  const tickBg = isSelected ? 'bg-brand-teal' : predicted ? 'bg-brand-indigo-mid' : 'bg-border-control/60';

  return (
    <button
      onClick={onSelect}
      className="flex flex-1 cursor-pointer flex-col items-center gap-[6px] border-0 bg-none p-0 pb-1 font-outfit"
    >
      <span className={`font-outfit text-2xs leading-none ${dayColor}`}>{formatDay(date)}</span>
      <span className={`flex items-center gap-[5px] rounded-[8px] border px-[7px] py-[6px] ${plateClasses(isSelected, predicted)}`}>
        <TeamCrest team={homeTeam} size={18} />
        <TeamCrest team={awayTeam} size={18} />
      </span>
      <span className={`rounded-sm ${tickW} ${tickH} ${tickBg}`} />
      <span className={`font-outfit text-2xs leading-none tracking-[0.06em] ${scoreColor}`}>{scoreLabel || '—'}</span>
    </button>
  );
}

function MobileStation({ station }) {
  const { homeTeam, awayTeam, predicted, scoreLabel, scoreTone, isSelected, onSelect, date } = station;
  const dayColor = isSelected ? 'text-brand-teal' : 'text-text-muted-5';
  const scoreColor = scoreToneClass(scoreTone, predicted, isSelected);

  return (
    <button
      onClick={onSelect}
      style={{ scrollSnapAlign: 'center' }}
      className="flex w-[58px] shrink-0 cursor-pointer flex-col items-center gap-1.5 border-0 bg-none p-0 font-outfit"
    >
      <span className={`font-outfit text-3xs ${dayColor}`}>{formatDay(date)}</span>
      <span className={`flex items-center gap-1 rounded-[8px] border px-1.5 py-1.5 ${plateClasses(isSelected, predicted)}`}>
        <TeamCrest team={homeTeam} size={16} />
        <TeamCrest team={awayTeam} size={16} />
      </span>
      <span className={`font-outfit text-2xs ${scoreColor}`}>{scoreLabel || '—'}</span>
    </button>
  );
}

/**
 * Per-fixture "station" rail — the pattern the prototype's "Spine" file is
 * named after (Spine.dc.html desktop lines 114-129, mobile lines 2232-2255).
 * Driven entirely by useFixtureSpine's `stations` (semantic data only); this
 * component owns presentation/colors. Compacted spacing to keep the rail
 * tight and allow the fixture card below to breathe.
 */
export default function StationRail({ stations, variant = 'desktop', onPrev, onNext, canPrev, canNext }) {
  if (!stations.length) {
    return (
      <div className="rounded-[14px] border border-dashed border-border-card p-6 text-center text-sm text-text-muted-2">
        No fixtures for this gameweek yet.
      </div>
    );
  }

  if (variant === 'mobile') {
    return (
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-1">
          <button
            onClick={onPrev}
            disabled={!canPrev}
            aria-label="Previous fixture"
            className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-border-control bg-surface-card-4/70 text-text-muted-1 disabled:opacity-40"
          >
            &#8249;
          </button>
          <div className="scrollbar-none flex flex-1 gap-2 overflow-x-auto pb-0.5" style={{ scrollSnapType: 'x mandatory' }}>
            {stations.map((station) => (
              <MobileStation key={station.id} station={station} />
            ))}
          </div>
          <button
            onClick={onNext}
            disabled={!canNext}
            aria-label="Next fixture"
            className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-border-control bg-surface-card-4/70 text-text-muted-1 disabled:opacity-40"
          >
            &#8250;
          </button>
        </div>
        <div className="flex justify-center gap-1 pt-0.5">
          {stations.map((station) => (
            <span
              key={station.id}
              className={`h-1 rounded-full transition-all ${
                station.isSelected ? 'w-3.5 bg-brand-teal' : 'w-1 bg-border-card'
              }`}
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="relative pb-1">
      <div className="absolute inset-x-0 top-[52px] h-px bg-[#1d2a41]" />
      <div className="relative flex items-end justify-between gap-0.5">
        {stations.map((station) => (
          <DesktopStation key={station.id} station={station} />
        ))}
      </div>
    </div>
  );
}
