import { useEffect, useState } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { Gear } from '@phosphor-icons/react';
import { NAV_ITEMS } from './navItems';
import { useAuthState } from '../../hooks/useAuth';
import useDashboardData from '../../hooks/useDashboardData';
import KickerLabel from '../ui/KickerLabel';
import Avatar from '../ui/Avatar';
import logo from '../../assets/logo.png';

/**
 * Desktop app masthead. 64px tall normally; on Fixtures it auto-hides to
 * 52px @ 42% opacity until hovered (barWake/barSleep). Sets --shell-nav-h
 * so page bodies lock to the remaining viewport.
 */
export default function TopNav() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { user, username } = useAuthState();
  const { essentialData } = useDashboardData();
  const [wake, setWake] = useState(false);

  const isFixturesPage = pathname.startsWith('/fixtures');
  const isProfilePage = pathname.startsWith('/profile');
  const isSettingsPage = pathname.startsWith('/settings');
  const dim = isFixturesPage && !wake;

  const points = essentialData?.user?.points ?? essentialData?.stats?.weeklyPoints?.value ?? null;
  const rank = essentialData?.stats?.globalRank?.value ?? null;

  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--shell-nav-h', dim ? '52px' : '4rem');
    return () => root.style.removeProperty('--shell-nav-h');
  }, [dim]);

  return (
    <header
      onMouseEnter={() => setWake(true)}
      onMouseLeave={() => setWake(false)}
      className={`sticky top-0 z-30 hidden border-b border-border-hairline bg-surface-header transition-[height,opacity] duration-300 ease-in-out md:block ${
        dim ? 'h-[52px] opacity-[0.42]' : 'h-16 opacity-100'
      }`}
    >
      <div className="flex h-full items-center gap-[26px] px-[22px]">
        <button
          onClick={() => navigate('/dashboard')}
          className="flex shrink-0 items-center gap-[9px]"
          aria-label="predictionsLeague home"
        >
          <img src={logo} alt="" className="h-7" />
          <span className="font-dmSerif text-lg text-brand-teal-pale">predictionsLeague</span>
        </button>

        <nav className="flex min-w-0 flex-1 items-center justify-center gap-1 overflow-x-auto">
          {NAV_ITEMS.map(({ id, label, path }) => (
            <NavLink
              key={id}
              to={path}
              className={({ isActive }) =>
                `whitespace-nowrap rounded-9 px-4 py-2 font-outfit text-base transition-colors ${
                  isActive
                    ? 'bg-surface-nav-active text-brand-teal'
                    : 'text-text-muted-1 hover:text-brand-teal'
                }`
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-[18px]">
          {points !== null && (
            <div className="flex flex-col items-end leading-tight">
              <KickerLabel as="span" className="text-2xs tracking-[0.12em] text-text-muted-4">
                Season
              </KickerLabel>
              <span className="font-dmSerif text-lg text-brand-teal-pale">{points}</span>
            </div>
          )}
          {rank !== null && (
            <div className="flex flex-col items-end leading-tight">
              <KickerLabel as="span" className="text-2xs tracking-[0.12em] text-text-muted-4">
                Rank
              </KickerLabel>
              <span className="font-dmSerif text-lg text-text-primary">
                {rank}
                <span className="text-caption text-text-muted-3">/12</span>
              </span>
            </div>
          )}

          <button
            onClick={() => navigate('/settings')}
            aria-label="Settings"
            className={`flex size-9 shrink-0 items-center justify-center rounded-9 border bg-transparent transition-colors ${
              isSettingsPage
                ? 'border-brand-teal-mid/40 text-brand-teal'
                : 'border-border-card text-text-muted-4 hover:border-brand-teal-mid/40 hover:text-brand-teal'
            }`}
          >
            <Gear size={18} />
          </button>

          <NavLink to="/profile" aria-label="Profile">
            <Avatar
              name={username || user?.firstName || 'You'}
              size={36}
              className={isProfilePage ? '!bg-brand-teal-deep !text-white' : '!bg-brand-indigo-mid !text-white'}
            />
          </NavLink>
        </div>
      </div>
    </header>
  );
}
