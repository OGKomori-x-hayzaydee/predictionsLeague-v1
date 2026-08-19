import { HomeIcon, CalendarIcon, BarChartIcon, CardStackIcon, TargetIcon, PersonIcon, GearIcon } from '@radix-ui/react-icons';

// Canonical 7-page list, mirroring the prototype's `PAGES` array (Spine
// script ~line 4054) — id/label/route/icon for every authenticated screen,
// including Profile/Settings (which are reached via header icons on both
// breakpoints, not the primary nav bars below). Route paths match the real
// routes registered in src/App.jsx.
export const PAGES = [
  { id: 'dashboard', label: 'Home', path: '/dashboard', Icon: HomeIcon },
  { id: 'fixtures', label: 'Fixtures', path: '/fixtures', Icon: CalendarIcon },
  { id: 'record', label: 'Record', path: '/record', Icon: BarChartIcon },
  { id: 'chips', label: 'Chips', path: '/chips', Icon: CardStackIcon },
  { id: 'leagues', label: 'Leagues', path: '/leagues', Icon: TargetIcon },
  { id: 'profile', label: 'Profile', path: '/profile', Icon: PersonIcon },
  { id: 'settings', label: 'Settings', path: '/settings', Icon: GearIcon },
];

// The 5 primary destinations shared by desktop's pill nav and mobile's
// bottom tab bar — matches the prototype's
// `PAGES.filter(p => p.id !== "settings" && p.id !== "profile")` used for
// both `nav` (desktop) and `mobileNav` (mobile) in renderVals().
export const NAV_ITEMS = PAGES.filter((p) => p.id !== 'profile' && p.id !== 'settings');
