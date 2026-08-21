import { NavLink } from 'react-router-dom';
import { NAV_ITEMS } from './navItems';

// Hand-drawn 24x24 viewBox SVG paths, ported literally from the prototype's
// mobile nav (Spine script ~lines 3687-3695) — not an icon library, since
// the prototype deliberately uses its own custom marks here.
const ICON_PATHS = {
  dashboard: 'M4 11.5 12 4l8 7.5M6 10v9h5v-5h2v5h5v-9',
  fixtures: 'M4 5h16v15H4zM4 9h16M8 3v4M16 3v4',
  record: 'M3 19h18M6 19v-8M12 19V6M18 19v-5',
  chips: 'M4 8h13v11H4zM7 5h13v4',
  leagues: 'M7 4h10v3a5 5 0 0 1-10 0zM9 15h6v3H9zM8 18h8M4 5h3M20 5h-3',
};

/**
 * Mobile bottom nav (foundation spec §6.3) — 5-item CSS grid, hand-drawn
 * inline SVG icons + 8.5px labels, active/inactive is fg-only (no active
 * background pill, unlike desktop's TopNav pill highlight).
 */
export default function BottomTabBar() {
  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-5 border-t border-border-base bg-surface-header md:hidden"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      {NAV_ITEMS.map(({ id, label, path }) => (
        <NavLink
          key={id}
          to={path}
          className={({ isActive }) =>
            `flex min-w-0 flex-col items-center gap-[3px] px-0.5 pb-2 pt-[7px] font-outfit transition-colors ${
              isActive ? 'text-brand-teal' : 'text-text-muted-3'
            }`
          }
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
            <path d={ICON_PATHS[id]} />
          </svg>
          <span className="whitespace-nowrap text-3xs tracking-[0.02em]">{label}</span>
        </NavLink>
      ))}
    </nav>
  );
}
