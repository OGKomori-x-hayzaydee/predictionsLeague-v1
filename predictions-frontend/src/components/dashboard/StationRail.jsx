import { useNavigate } from 'react-router-dom';
import TeamCrest from '../ui/TeamCrest';
import KickerLabel from '../ui/KickerLabel';

/**
 * Horizontal per-fixture "station" rail — the pattern the prototype's
 * "Spine" file is named after. One tile per gameweek fixture with a
 * filed/open tick.
 */
export default function StationRail({ fixtures }) {
  const navigate = useNavigate();

  if (!fixtures.length) {
    return (
      <div className="rounded-md border border-dashed border-border-card p-6 text-center text-sm text-text-muted-2">
        No fixtures for this gameweek yet.
      </div>
    );
  }

  return (
    <div className="scrollbar-none -mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
      {fixtures.map((fixture) => {
        const day = fixture.date
          ? new Date(fixture.date).toLocaleDateString(undefined, { weekday: 'short' })
          : '—';
        return (
          <button
            key={fixture.id || `${fixture.homeTeam}-${fixture.awayTeam}-${fixture.date}`}
            onClick={() => navigate('/fixtures')}
            className={`flex w-24 shrink-0 flex-col items-center gap-1.5 rounded-md border p-2.5 transition-colors ${
              fixture.predicted
                ? 'border-brand-teal/40 bg-brand-teal/5'
                : 'border-border-card bg-surface-card-2 hover:border-border-control'
            }`}
          >
            <KickerLabel>{day}</KickerLabel>
            <div className="flex items-center gap-1">
              <TeamCrest team={fixture.homeTeam} size={18} />
              <TeamCrest team={fixture.awayTeam} size={18} />
            </div>
            <span className={`font-mono text-[10px] ${fixture.predicted ? 'text-brand-teal' : 'text-text-muted-3'}`}>
              {fixture.predicted ? 'Filed' : 'Open'}
            </span>
          </button>
        );
      })}
    </div>
  );
}
