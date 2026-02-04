import { useUserStore } from '../../store/userStore';
import { useUserBalance } from '../../hooks/api/useUserBalance';

export function Header() {
  const memescore = useUserStore((state) => state.memescore);
  useUserBalance(); // Auto-refresh balance

  return (
    <header className="bg-gray-900 border-b border-gray-700 px-4 py-3 sticky top-0 z-10">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bebas text-white tracking-wider">
          MEME PREDICTION
        </h1>
        <div className="flex items-center space-x-2 bg-blue-600 px-3 py-1.5 rounded-full">
          <span className="text-lg">🎮</span>
          <span className="font-archivo font-bold text-white">
            {memescore.toLocaleString()}
          </span>
        </div>
      </div>
    </header>
  );
}
