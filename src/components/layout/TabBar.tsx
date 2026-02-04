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
    <nav className="bg-gray-900 border-t border-gray-700 fixed bottom-0 left-0 right-0 z-10">
      <div className="flex items-center justify-around h-16">
        {tabs.map((tab) => {
          const isActive = location.pathname.startsWith(tab.path);
          return (
            <Link
              key={tab.path}
              to={tab.path}
              className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
                isActive
                  ? 'text-blue-500'
                  : 'text-gray-500 hover:text-gray-400'
              }`}
            >
              <span className="text-2xl mb-0.5">{tab.icon}</span>
              <span className="text-xs font-archivo font-medium">{tab.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
