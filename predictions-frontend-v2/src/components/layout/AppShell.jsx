import { Outlet } from 'react-router-dom';
import TopNav from './TopNav';
import MobileTopBar from './MobileTopBar';
import BottomTabBar from './BottomTabBar';

/**
 * Authenticated app shell: persistent chrome (desktop top nav / mobile top
 * bar + bottom tab bar) wrapping whichever screen is routed into the
 * Outlet. Each screen owns its own SlotBar (kicker/tabs/reel-nav) as the
 * first thing it renders — the shell doesn't know about per-screen context.
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
