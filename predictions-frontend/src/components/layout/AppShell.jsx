import { Outlet } from 'react-router-dom';
import TopNav from './TopNav';
import MobileTopBar from './MobileTopBar';
import BottomTabBar from './BottomTabBar';

export default function AppShell() {
  return (
    <div className="min-h-dvh bg-surface-app">
      <TopNav />
      <MobileTopBar />
      <main className="pb-20 lg:pb-0">
        <Outlet />
      </main>
      <BottomTabBar />
    </div>
  );
}
