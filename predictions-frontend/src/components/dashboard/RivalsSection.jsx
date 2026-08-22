import { Link } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import KickerLabel from '../ui/KickerLabel';
import Avatar from '../ui/Avatar';
import leagueAPI from '../../services/api/leagueAPI';
import { overlayOwnAvatar } from '../../utils/profileOverrides';
import { useAuthState } from '../../hooks/useAuth';

/**
 * Real per-league standings (leagueAPI.getLeagueStandings — the same
 * endpoint useLeagueDetail uses for the Leagues screen), windowed to a
 * handful of rows around the current user. Picks the user's first league;
 * a league switcher is out of scope for the Dashboard's compact sidebar.
 */
function useRivals(league) {
  const [standingsRaw, setStandingsRaw] = useState(null);
  const [isLoading, setIsLoading] = useState(!!league);

  useEffect(() => {
    if (!league?.id) {
      setStandingsRaw(null);
      setIsLoading(false);
      return;
    }
    let cancelled = false;
    setIsLoading(true);
    leagueAPI
      .getLeagueStandings(league.id)
      .then((res) => {
        if (cancelled) return;
        const list = Array.from(res?.standings || []).sort(
          (a, b) => (a.position ?? 999) - (b.position ?? 999)
        );
        setStandingsRaw(list);
      })
      .catch(() => !cancelled && setStandingsRaw([]))
      .finally(() => !cancelled && setIsLoading(false));
    return () => {
      cancelled = true;
    };
  }, [league?.id]);

  return { standingsRaw, isLoading };
}

// Top N, or a window centered on the user when they sit outside it — same
// "leaderboard around you" shape as the Leagues screen's podium/rankings.
function windowAroundUser(standings, size = 5) {
  if (!standings || standings.length === 0) return [];
  const idx = standings.findIndex((m) => m.isCurrentUser);
  if (idx === -1 || idx < size) return standings.slice(0, size);
  const half = Math.floor(size / 2);
  let start = Math.max(0, idx - half);
  const end = Math.min(standings.length, start + size);
  start = Math.max(0, end - size);
  return standings.slice(start, end);
}

export default function RivalsSection({ leagues }) {
  const league = leagues?.[0] || null;
  const { user } = useAuthState();
  const { standingsRaw, isLoading } = useRivals(league);
  const standings = useMemo(
    () => overlayOwnAvatar(standingsRaw, user?.avatar || user?.profilePicture) ?? standingsRaw,
    [standingsRaw, user?.avatar, user?.profilePicture]
  );
  const rows = windowAroundUser(standings);
  const maxPoints = rows.length ? Math.max(...rows.map((m) => m.points || 0), 1) : 1;

  return (
    <div className="flex flex-col gap-[11px]">
      <KickerLabel as="div" className="text-xs tracking-[0.16em] text-text-muted-3">
        Rivals{league ? ` · ${league.name}` : ''}
      </KickerLabel>

      {!league && !isLoading && (
        <p className="text-sm leading-relaxed text-text-muted-2">
          Join a league to see how you stack up against your rivals.
        </p>
      )}
      {league && isLoading && <p className="text-sm text-text-muted-2">Loading…</p>}
      {league && !isLoading && rows.length === 0 && (
        <p className="text-sm text-text-muted-2">No standings yet.</p>
      )}

      <div className="flex flex-col gap-[9px]">
        {rows.map((m) => (
          <Link key={m.id ?? m.username} to="/leagues" className="flex items-center gap-[10px]">
            <span
              className={`w-4 shrink-0 font-outfit text-xs ${
                m.isCurrentUser ? 'text-brand-teal' : 'text-text-muted-4'
              }`}
            >
              {m.position}
            </span>
            <Avatar
              name={m.displayName || m.username}
              src={m.avatar}
              size={22}
            />
            <span
              className={`min-w-0 flex-1 truncate text-sm ${
                m.isCurrentUser ? 'font-medium text-brand-teal' : 'text-text-secondary'
              }`}
            >
              {m.isCurrentUser ? 'You' : m.displayName || m.username}
            </span>
            <span className="flex h-1.5 w-16 overflow-hidden rounded-sm bg-surface-track">
              <span
                className="rounded-sm"
                style={{
                  width: `${Math.max(8, ((m.points || 0) / maxPoints) * 100)}%`,
                  background: m.isCurrentUser ? 'var(--brand-teal)' : 'var(--border-control)',
                }}
              />
            </span>
            <span className="w-[34px] shrink-0 text-right font-outfit text-sm text-text-tertiary">
              {m.points}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
