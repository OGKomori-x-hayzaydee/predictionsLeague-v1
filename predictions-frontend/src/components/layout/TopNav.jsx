import { useState } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { GearIcon } from '@radix-ui/react-icons';
import { NAV_ITEMS } from './navItems';
import { useAuthState } from '../../hooks/useAuth';
import useDashboardData from '../../hooks/useDashboardData';
import KickerLabel from '../ui/KickerLabel';
import Avatar from '../ui/Avatar';
import logo from '../../assets/logo.png';

/**
 * Desktop app masthead (foundation spec §5.1). 56px tall normally; on the
 * Fixtures page it auto-hides to 44px @ 42% opacity until hovered, matching
 * the prototype's barWake/barSleep behavior (S.wake there, local `wake`
 * state here since this app has no global page-state object).
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

  return (
    <header
      onMouseEnter={() => setWake(true)}
      onMouseLeave={() => setWake(false)}
      className={`sticky top-0 z-30 hidden border-b border-border-hairline bg-surface-header transition-[height,opacity] duration-300 ease-in-out md:block ${
        dim ? 'h-11 opacity-[0.42]' : 'h-14 opacity-100'
      }`}
    >
      <div className="relative flex h-full items-center gap-[26px] px-[22px]">
        <button
          onClick={() => navigate('/dashboard')}
          className="flex shrink-0 items-center gap-[9px]"
          aria-label="predictionsLeague home"
        >
          <img src={logo} alt="" className="h-[21px]" />
          <span className="font-dmSerif text-[15px] text-brand-teal-pale">predictionsLeague</span>
        </button>

        <nav className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center gap-[3px]">
          {NAV_ITEMS.map(({ id, label, path }) => (
            <NavLink
              key={id}
              to={path}
              className={({ isActive }) =>
                `whitespace-nowrap rounded-sm px-3 py-[7px] font-outfit text-sm transition-colors ${
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

        <div className="ml-auto flex shrink-0 items-center gap-[18px]">
          {points !== null && (
            <div className="flex flex-col items-end leading-tight">
              <KickerLabel as="span" className="text-[9.5px] tracking-[0.12em] text-text-muted-4">
                Season
              </KickerLabel>
              <span className="font-dmSerif text-base text-brand-teal-pale">{points}</span>
            </div>
          )}
          {rank !== null && (
            <div className="flex flex-col items-end leading-tight">
              <KickerLabel as="span" className="text-[9.5px] tracking-[0.12em] text-text-muted-4">
                Rank
              </KickerLabel>
              <span className="font-dmSerif text-base text-text-primary">
                {rank}
                <span className="text-[11px] text-text-muted-3">/12</span>
              </span>
            </div>
          )}

          <button
            onClick={() => navigate('/settings')}
            aria-label="Settings"
            className={`flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-sm border bg-transparent transition-colors ${
              isSettingsPage
                ? 'border-brand-teal-mid/40 text-brand-teal'
                : 'border-border-card text-text-muted-4 hover:border-brand-teal-mid/40 hover:text-brand-teal'
            }`}
          >
            <GearIcon width={14} height={14} />
          </button>

          <NavLink to="/profile" aria-label="Profile">
            {/* `!` forces these to win over Avatar's own baked-in bg/text
                classes regardless of Tailwind's generated rule order. */}
            <Avatar
              name={username || user?.firstName || 'You'}
              size={30}
              className={isProfilePage ? '!bg-brand-teal-deep !text-white' : '!bg-brand-indigo-mid !text-white'}
            />
          </NavLink>
        </div>
      </div>
    </header>
  );
}
