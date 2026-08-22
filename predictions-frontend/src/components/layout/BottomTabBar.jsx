import { NavLink } from 'react-router-dom';
import { NAV_ITEMS } from './navItems';

const ICON_PATHS = {
  dashboard: 'M4 11.5 12 4l8 7.5M6 10v9h5v-5h2v5h5v-9',
  fixtures: 'M4 5h16v15H4zM4 9h16M8 3v4M16 3v4',
  record: 'M3 19h18M6 19v-8M12 19V6M18 19v-5',
  chips: 'M4 8h13v11H4zM7 5h13v4',
  leagues: 'M7 4h10v3a5 5 0 0 1-10 0zM9 15h6v3H9zM8 18h8M4 5h3M20 5h-3',
};

export default function BottomTabBar() {
  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-5 border-t border-border-base bg-surface-header lg:hidden"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      {NAV_ITEMS.map(({ id, label, path }) => (
        <NavLink
          key={id}
          to={path}
          className={({ isActive }) =>
            `flex min-h-11 min-w-0 flex-col items-center gap-1 px-0.5 pb-2.5 pt-2 font-outfit no-underline transition-colors ${
              isActive ? 'text-brand-teal hover:text-brand-teal' : 'text-text-muted hover:text-brand-teal'
            }`
          }
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
            <path d={ICON_PATHS[id]} />
          </svg>
          <span className="whitespace-nowrap text-xs tracking-[0.02em]">{label}</span>
        </NavLink>
      ))}
    </nav>
  );
}
