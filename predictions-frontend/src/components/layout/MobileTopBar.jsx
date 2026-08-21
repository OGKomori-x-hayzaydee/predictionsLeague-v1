import { useLocation, useNavigate, NavLink } from 'react-router-dom';
import { Gear } from '@phosphor-icons/react';
import { useAuthState } from '../../hooks/useAuth';
import Avatar from '../ui/Avatar';
import logo from '../../assets/logo.png';

const TITLES = {
  dashboard: 'Dashboard',
  fixtures: 'Fixtures',
  record: 'My Record',
  chips: 'Chips',
  leagues: 'Leagues',
  profile: 'Profile',
  settings: 'Settings',
};

/**
 * Mobile shell top bar (foundation spec §6.1). Single 52px-tall tier — no
 * mobile equivalent of the desktop slot bar; GW-reel/kicker/tabs context is
 * rebuilt per-screen inside the scrollable content by screen-level agents.
 */
export default function MobileTopBar() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { username } = useAuthState();

  const segment = pathname.split('/').filter(Boolean)[0];
  const title = TITLES[segment] || 'predictionsLeague';
  const isProfilePage = segment === 'profile';
  const isSettingsPage = segment === 'settings';

  return (
    <header className="sticky top-0 z-30 flex h-[52px] items-center gap-[9px] border-b border-border-hairline bg-surface-header px-3.5 md:hidden">
      <img src={logo} alt="" className="h-4 shrink-0" />
      <h1 className="min-w-0 flex-1 truncate font-dmSerif text-base text-text-primary">{title}</h1>

      <div className="flex shrink-0 items-center">
        <button
          onClick={() => navigate('/settings')}
          aria-label="Settings"
          className={`flex h-11 w-11 shrink-0 items-center justify-center bg-transparent transition-colors ${
            isSettingsPage ? 'text-brand-teal' : 'text-text-muted-1'
          }`}
        >
          <Gear width={19} height={19} />
        </button>
        <NavLink
          to="/profile"
          aria-label="Profile"
          className="flex h-11 w-11 shrink-0 items-center justify-center"
        >
          {/* `!` forces these to win over Avatar's own baked-in bg/text classes. */}
          <Avatar
            name={username || 'You'}
            size={28}
            className={`!text-white ring-[1.5px] ${
              isProfilePage ? '!bg-brand-teal-deep ring-brand-teal' : '!bg-brand-indigo-mid ring-transparent'
            }`}
          />
        </NavLink>
      </div>
    </header>
  );
}
