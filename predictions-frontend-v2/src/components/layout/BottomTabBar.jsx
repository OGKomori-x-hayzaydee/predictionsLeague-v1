import { NavLink } from 'react-router-dom';
import { NAV_ITEMS } from './navItems';

/**
 * Mobile primary navigation — confirmed from the full v2 prototype artifact:
 * a persistent 5-item bottom tab bar (Home/Fixtures/Record/Chips/Leagues),
 * no hamburger/drawer. Settings and Profile live in MobileTopBar instead.
 */
export default function BottomTabBar() {
  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-30 flex items-stretch border-t border-border-hairline bg-surface-header/95 backdrop-blur-md md:hidden"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      {NAV_ITEMS.map(({ id, label, path, Icon }) => (
        <NavLink
          key={id}
          to={path}
          className={({ isActive }) =>
            `flex flex-1 flex-col items-center gap-1 py-2.5 text-[10px] font-mono uppercase tracking-wide transition-colors ${
              isActive ? 'text-brand-teal' : 'text-text-muted-3'
            }`
          }
        >
          <Icon width={18} height={18} />
          {label}
        </NavLink>
      ))}
    </nav>
  );
}
