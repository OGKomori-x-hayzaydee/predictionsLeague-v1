import { Link } from 'react-router-dom';
import KickerLabel from '../ui/KickerLabel';
import TokenBadge from '../ui/TokenBadge';
import Card from '../ui/Card';
import useLeagues from '../../hooks/useLeagues';
import { useChips } from '../../hooks/useChips';

export default function DashboardSidebar() {
  const { myLeagues, isLoading: leaguesLoading } = useLeagues();
  const { chips, isLoading: chipsLoading } = useChips();

  return (
    <div className="space-y-4">
      <Card className="p-4">
        <div className="mb-3 flex items-center justify-between">
          <KickerLabel>Leagues</KickerLabel>
          <Link to="/leagues" className="text-xs text-brand-teal">View all</Link>
        </div>
        {leaguesLoading && <p className="text-xs text-text-muted-2">Loading…</p>}
        {!leaguesLoading && (!myLeagues || myLeagues.length === 0) && (
          <p className="text-xs text-text-muted-2">You haven&apos;t joined a league yet.</p>
        )}
        <ul className="space-y-2">
          {(myLeagues || []).slice(0, 4).map((league) => (
            <li key={league.id || league.name} className="flex items-center justify-between text-sm">
              <span className="truncate text-text-secondary">{league.name}</span>
              <span className="font-mono text-xs text-text-muted-2">
                #{league.position ?? '—'} · {league.points ?? 0}pts
              </span>
            </li>
          ))}
        </ul>
      </Card>

      <Card className="p-4">
        <div className="mb-3 flex items-center justify-between">
          <KickerLabel>Chips in hand</KickerLabel>
          <Link to="/chips" className="text-xs text-brand-teal">Plan</Link>
        </div>
        {chipsLoading && <p className="text-xs text-text-muted-2">Loading…</p>}
        <div className="flex flex-wrap gap-2">
          {chips.map((chip) => (
            <div key={chip.chipId} className="flex flex-col items-center gap-1" title={chip.name}>
              <TokenBadge
                label={chip.icon || chip.name?.[0]}
                color={chip.color || 'var(--brand-teal)'}
                size={34}
                muted={!chip.available}
              />
              <span className="font-mono text-[9px] text-text-muted-3">
                {(chip.seasonLimit ?? 0) - (chip.usageCount ?? 0)} left
              </span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
