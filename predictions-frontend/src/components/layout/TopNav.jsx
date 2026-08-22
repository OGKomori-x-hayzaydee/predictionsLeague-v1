import { useEffect, useState } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { Gear } from '@phosphor-icons/react';
import { NAV_ITEMS } from './navItems';
import { useAuthState } from '../../hooks/useAuth';
import useDashboardData from '../../hooks/useDashboardData';
import Avatar from '../ui/Avatar';
import IconButton from '../ui/buttons/IconButton';
import logo from '../../assets/logo.png';
import { readProfileOverrides } from '../../utils/profileOverrides';

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
  const overrides = readProfileOverrides();
  const avatarSrc =
    user?.avatar || user?.profilePicture || overrides.avatar || overrides.profilePicture || essentialData?.user?.avatar;
  const displayName = overrides.username || username || user?.firstName || 'You';

  useEffect(() => {
    const mq = window.matchMedia('(pointer: coarse)');
    const apply = () => {
      if (mq.matches && isFixturesPage) setWake(true);
    };
    apply();
    mq.addEventListener('change', apply);
    return () => mq.removeEventListener('change', apply);
  }, [isFixturesPage]);

  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--shell-nav-h', dim ? '3.25rem' : '4rem');
    return () => root.style.removeProperty('--shell-nav-h');
  }, [dim]);

  return (
    <header
      onMouseEnter={() => setWake(true)}
      onMouseLeave={() => {
        if (!window.matchMedia('(pointer: coarse)').matches) setWake(false);
      }}
      onFocusCapture={() => setWake(true)}
      onBlurCapture={(e) => {
        if (window.matchMedia('(pointer: coarse)').matches) return;
        if (!e.currentTarget.contains(e.relatedTarget)) setWake(false);
      }}
      className={`sticky top-0 z-30 hidden border-b border-border-hairline bg-surface-header transition-[height,opacity] duration-300 ease-in-out lg:block ${
        dim
          ? 'h-[3.25rem] opacity-[0.42] hover:h-16 hover:opacity-100 focus-within:h-16 focus-within:opacity-100 [@media(pointer:coarse)]:h-16 [@media(pointer:coarse)]:opacity-100'
          : 'h-16 opacity-100'
      }`}
    >
      <div className="flex h-full items-center gap-6 px-6">
        <button
          type="button"
          onClick={() => navigate('/dashboard')}
          className="flex shrink-0 items-center gap-2"
          aria-label="predictionsLeague home"
        >
          <img src={logo} alt="" className="h-7" />
          <span className="font-dmSerif text-lg text-brand-teal">predictionsLeague</span>
        </button>

        <nav className="flex min-w-0 flex-1 items-center justify-center gap-1 overflow-x-auto">
          {NAV_ITEMS.map(({ id, label, path }) => (
            <NavLink
              key={id}
              to={path}
              className={({ isActive }) =>
                `whitespace-nowrap rounded-md px-4 py-2 font-outfit text-base no-underline transition-colors ${
                  isActive
                    ? 'bg-surface-nav-active text-brand-teal hover:text-brand-teal'
                    : 'text-text-muted hover:text-brand-teal'
                }`
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-2">
          <IconButton
            label="Settings"
            onClick={() => navigate('/settings')}
            active={isSettingsPage}
            className="border border-border-control"
          >
            <Gear size={22} weight="bold" />
          </IconButton>

          <NavLink to="/profile" aria-label="Profile" className="flex size-11 items-center justify-center">
            <Avatar
              name={displayName}
              src={avatarSrc}
              size={36}
              className={isProfilePage ? 'ring-[1.5px] ring-brand-teal' : ''}
            />
          </NavLink>
        </div>
      </div>
    </header>
  );
}
