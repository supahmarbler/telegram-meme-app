import type { ReactNode } from 'react';
import { Header } from './Header';
import { TabBar } from './TabBar';
import { ToastContainer } from '../ui/Toast';

interface AppLayoutProps {
  children: ReactNode;
  showTabBar?: boolean;
}

export function AppLayout({ children, showTabBar = true }: AppLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <Header />
      <main className={`${showTabBar ? 'pb-16' : ''}`}>{children}</main>
      {showTabBar && <TabBar />}
      <ToastContainer />
    </div>
  );
}
