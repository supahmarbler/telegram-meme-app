import { useUserStore } from '../../store/userStore';
import { useUserBalance } from '../../hooks/api/useUserBalance';

export function Header() {
  const memescore = useUserStore((state) => state.memescore);
  useUserBalance(); // Auto-refresh balance

  return (
    <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3 sticky top-0 z-10">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900 dark:text-white">
          Meme Prediction
        </h1>
        <div className="flex items-center space-x-2 bg-blue-100 dark:bg-blue-900 px-3 py-1.5 rounded-full">
          <span className="text-xl">🎮</span>
          <span className="font-bold text-blue-900 dark:text-blue-100">
            {memescore.toLocaleString()}
          </span>
        </div>
      </div>
    </header>
  );
}
