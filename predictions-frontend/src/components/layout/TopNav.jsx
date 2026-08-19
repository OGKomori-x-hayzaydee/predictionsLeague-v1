import { NavLink, useNavigate } from 'react-router-dom';
import { GearIcon } from '@radix-ui/react-icons';
import { NAV_ITEMS } from './navItems';
import { useAuthState } from '../../hooks/useAuth';
import useDashboardData from '../../hooks/useDashboardData';
import KickerLabel from '../ui/KickerLabel';
import Avatar from '../ui/Avatar';
import { IconButton } from '../ui/buttons';
import logo from '../../assets/logo.png';

/**
 * Desktop app masthead. Always visible (no auto-hide-on-hover, unlike the
 * prototype — see plan §2: real discoverability/accessibility risk for
 * near-zero benefit). Hidden below md; MobileTopBar covers small screens.
 */
export default function TopNav() {
  const navigate = useNavigate();
  const { user, username } = useAuthState();
  const { essentialData } = useDashboardData();

  const points = essentialData?.user?.points ?? essentialData?.stats?.weeklyPoints?.value ?? null;
  const rank = essentialData?.stats?.globalRank?.value ?? null;

  return (
    <header className="hidden border-b border-border-hairline bg-surface-header md:block">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-6 px-6">
        <button
          onClick={() => navigate('/dashboard')}
          className="flex shrink-0 items-center gap-2"
          aria-label="predictionsLeague home"
        >
          <img src={logo} alt="" className="h-7 w-7" />
          <span className="font-dmSerif text-lg text-text-primary">predictionsLeague</span>
        </button>

        <nav className="mx-auto flex items-center gap-1 rounded-full border border-border-card bg-surface-card-2 p-1">
          {NAV_ITEMS.map(({ id, label, path, Icon }) => (
            <NavLink
              key={id}
              to={path}
              className={({ isActive }) =>
                `flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm transition-colors ${
                  isActive
                    ? 'bg-brand-teal/15 text-brand-teal'
                    : 'text-text-muted-2 hover:text-text-primary'
                }`
              }
            >
              <Icon />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-4">
          {points !== null && (
            <div className="text-right leading-tight">
              <KickerLabel as="div">Season</KickerLabel>
              <div className="font-dmSerif text-base text-text-primary">{points} pts</div>
            </div>
          )}
          {rank !== null && (
            <div className="text-right leading-tight">
              <KickerLabel as="div">Rank</KickerLabel>
              <div className="font-dmSerif text-base text-text-primary">{rank}</div>
            </div>
          )}

          <IconButton onClick={() => navigate('/settings')} aria-label="Settings">
            <GearIcon />
          </IconButton>

          <NavLink to="/profile" aria-label="Profile">
            {({ isActive }) => (
              <Avatar name={username || user?.firstName || 'You'} size={34} className={isActive ? 'ring-2 ring-brand-teal' : ''} />
            )}
          </NavLink>
        </div>
      </div>
    </header>
  );
}
