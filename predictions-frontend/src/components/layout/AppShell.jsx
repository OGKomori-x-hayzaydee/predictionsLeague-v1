import { Outlet } from 'react-router-dom';
import TopNav from './TopNav';
import MobileTopBar from './MobileTopBar';
import BottomTabBar from './BottomTabBar';

/**
 * Authenticated app shell (foundation spec §5-§6). Desktop gets a two-tier
 * chrome: TopNav's 64px masthead (auto-hides to 52px on Fixtures, see
 * TopNav.jsx) sits above each screen's own SlotBar (ui/SlotBar.jsx, 56px,
 * kicker/tabs/reel-nav) as the first thing it renders inside the Outlet —
 * the shell itself doesn't know about per-screen context. Mobile gets a
 * single-tier 52px MobileTopBar with no slot-bar equivalent; GW-reel/tabs
 * context is rebuilt per-screen inside the scrollable content instead.
 * Both top bars are sticky; BottomTabBar is fixed to the viewport bottom
 * on mobile only.
 */
export default function AppShell() {
  return (
    <div className="min-h-screen bg-surface-app">
      <TopNav />
      <MobileTopBar />
      <main className="pb-20 md:pb-0">
        <Outlet />
      </main>
      <BottomTabBar />
    </div>
  );
}
