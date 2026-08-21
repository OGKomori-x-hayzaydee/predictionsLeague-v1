import { House, CalendarBlank, ChartBar, Cards, Target, User, Gear } from '@phosphor-icons/react';

// Canonical 7-page list, mirroring the prototype's `PAGES` array (Spine
// script ~line 4054) — id/label/route/icon for every authenticated screen,
// including Profile/Settings (which are reached via header icons on both
// breakpoints, not the primary nav bars below). Route paths match the real
// routes registered in src/App.jsx.
export const PAGES = [
  { id: 'dashboard', label: 'Dashboard', path: '/dashboard', Icon: House },
  { id: 'fixtures', label: 'Fixtures', path: '/fixtures', Icon: CalendarBlank },
  { id: 'record', label: 'My Record', path: '/record', Icon: ChartBar },
  { id: 'chips', label: 'Chips', path: '/chips', Icon: Cards },
  { id: 'leagues', label: 'Leagues', path: '/leagues', Icon: Target },
  { id: 'profile', label: 'Profile', path: '/profile', Icon: User },
  { id: 'settings', label: 'Settings', path: '/settings', Icon: Gear },
];

// The 5 primary destinations shared by desktop's pill nav and mobile's
// bottom tab bar — matches the prototype's
// `PAGES.filter(p => p.id !== "settings" && p.id !== "profile")` used for
// both `nav` (desktop) and `mobileNav` (mobile) in renderVals().
export const NAV_ITEMS = PAGES.filter((p) => p.id !== 'profile' && p.id !== 'settings');
