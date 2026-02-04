import { Link, useLocation } from 'react-router-dom';
import { ROUTES } from '../../utils/constants';

interface Tab {
  path: string;
  icon: string;
  label: string;
}

const tabs: Tab[] = [
  { path: ROUTES.MARKETS, icon: '🎲', label: 'Markets' },
  { path: ROUTES.POSITIONS, icon: '📊', label: 'Positions' },
  { path: ROUTES.REFERRALS, icon: '👥', label: 'Referrals' },
];

export function TabBar() {
  const location = useLocation();

  return (
    <nav className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 fixed bottom-0 left-0 right-0 z-10">
      <div className="flex items-center justify-around h-16">
        {tabs.map((tab) => {
          const isActive = location.pathname.startsWith(tab.path);
          return (
            <Link
              key={tab.path}
              to={tab.path}
              className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
                isActive
                  ? 'text-blue-600 dark:text-blue-400'
                  : 'text-gray-500 dark:text-gray-400'
              }`}
            >
              <span className="text-2xl mb-1">{tab.icon}</span>
              <span className="text-xs font-medium">{tab.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
