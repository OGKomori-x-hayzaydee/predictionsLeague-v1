import { useLocation, useNavigate, NavLink } from 'react-router-dom';
import { GearIcon } from '@radix-ui/react-icons';
import { useAuthState } from '../../hooks/useAuth';
import { IconButton } from '../ui/buttons';
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

export default function MobileTopBar() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { username } = useAuthState();

  const segment = pathname.split('/').filter(Boolean)[0];
  const title = TITLES[segment] || 'predictionsLeague';

  return (
    <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-border-hairline bg-surface-header/95 px-4 py-3 backdrop-blur-md md:hidden">
      <img src={logo} alt="" className="h-6 w-6 shrink-0" />
      <h1 className="truncate font-dmSerif text-base text-text-primary">{title}</h1>

      <div className="ml-auto flex shrink-0 items-center gap-2">
        <IconButton onClick={() => navigate('/settings')} aria-label="Settings">
          <GearIcon />
        </IconButton>
        <NavLink to="/profile" aria-label="Profile">
          <Avatar name={username || 'You'} size={30} />
        </NavLink>
      </div>
    </header>
  );
}
