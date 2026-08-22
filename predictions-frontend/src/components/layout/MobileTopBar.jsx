import { useLocation, useNavigate, NavLink } from 'react-router-dom';
import { Gear, Moon, Sun } from '@phosphor-icons/react';
import { useAuthState } from '../../hooks/useAuth';
import Avatar from '../ui/Avatar';
import IconButton from '../ui/buttons/IconButton';
import logo from '../../assets/logo.png';
import { readProfileOverrides } from '../../utils/profileOverrides';
import useTheme from '../../hooks/useTheme';

const TITLES = {
  dashboard: 'Dashboard',
  fixtures: 'Fixtures',
  record: 'My Record',
  chips: 'Chips',
  leagues: 'Leagues',
  profile: 'Profile',
  settings: 'Settings',
};

export default function MobileTopBar() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { user, username } = useAuthState();
  const { isDarkMode, toggleTheme } = useTheme();
  const overrides = readProfileOverrides();
  const displayName = overrides.username || username || user?.firstName || 'You';
  const avatarSrc = user?.avatar || user?.profilePicture || overrides.avatar || overrides.profilePicture;

  const segment = pathname.split('/').filter(Boolean)[0];
  const title = TITLES[segment] || 'predictionsLeague';
  const isProfilePage = segment === 'profile';
  const isSettingsPage = segment === 'settings';

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-2 border-b border-border-hairline bg-surface-header px-3.5 lg:hidden">
      <img src={logo} alt="" className="h-5 shrink-0" />
      <h1 className="min-w-0 flex-1 truncate font-dmSerif text-lg text-text-primary">{title}</h1>

      <div className="flex shrink-0 items-center">
        <IconButton
          label={isDarkMode ? 'Switch to light theme' : 'Switch to dark theme'}
          onClick={toggleTheme}
        >
          {isDarkMode ? <Sun size={20} weight="bold" /> : <Moon size={20} weight="bold" />}
        </IconButton>
        <IconButton
          label="Settings"
          onClick={() => navigate('/settings')}
          active={isSettingsPage}
        >
          <Gear size={22} weight="bold" />
        </IconButton>
        <NavLink
          to="/profile"
          aria-label="Profile"
          className="flex size-11 shrink-0 items-center justify-center"
        >
          <Avatar
            name={displayName}
            src={avatarSrc}
            size={28}
            className={isProfilePage ? 'ring-[1.5px] ring-brand-teal' : ''}
          />
        </NavLink>
      </div>
    </header>
  );
}
