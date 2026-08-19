import { HomeIcon, CalendarIcon, BarChartIcon, CardStackIcon, TargetIcon } from '@radix-ui/react-icons';

// The 5 primary destinations — identical set on desktop's pill nav and
// mobile's bottom tab bar (confirmed from the v2 prototype: mobile has no
// hamburger/drawer, only these 5 in a persistent bottom bar). Settings and
// Profile are reached via icons in the header on both breakpoints, not
// listed here.
export const NAV_ITEMS = [
  { id: 'dashboard', label: 'Home', path: '/dashboard', Icon: HomeIcon },
  { id: 'fixtures', label: 'Fixtures', path: '/fixtures', Icon: CalendarIcon },
  { id: 'record', label: 'Record', path: '/record', Icon: BarChartIcon },
  { id: 'chips', label: 'Chips', path: '/chips', Icon: CardStackIcon },
  { id: 'leagues', label: 'Leagues', path: '/leagues', Icon: TargetIcon },
];
