import { useNavigate } from 'react-router-dom';
import type { PredictionMarket } from '../../api/types';
import { Card } from '../ui/Card';

interface MarketCardProps {
  market: PredictionMarket;
}

export function MarketCard({ market }: MarketCardProps) {
  const navigate = useNavigate();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = date.getTime() - now.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

    if (days > 0) {
      return `${days}d ${hours}h`;
    } else if (hours > 0) {
      return `${hours}h`;
    } else {
      return 'Ending soon';
    }
  };

  const hasPosition = market.userPosition && (
    market.userPosition.sharesYes > 0 || market.userPosition.sharesNo > 0
  );

  return (
    <Card onClick={() => navigate(`/markets/${market.id}`)}>
      {market.imageUrl && (
        <img
          src={market.imageUrl}
          alt={market.title}
          className="w-full h-48 object-cover rounded-lg mb-3"
        />
      )}

      <div className="space-y-3">
        <div>
          <h3 className="font-bold text-lg line-clamp-2">{market.title}</h3>
          {hasPosition && (
            <span className="inline-block mt-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs px-2 py-1 rounded-full">
              You have a position
            </span>
          )}
        </div>

        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">YES</div>
            <div className="text-lg font-bold text-green-600 dark:text-green-400">
              {(market.priceYes * 100).toFixed(0)}%
            </div>
          </div>

          <div className="flex-1 text-right">
            <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">NO</div>
            <div className="text-lg font-bold text-red-600 dark:text-red-400">
              {(market.priceNo * 100).toFixed(0)}%
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
          <span>⏱ {formatDate(market.endDate)}</span>
          <span>💰 {market.totalLiquidity.toLocaleString()}</span>
        </div>
      </div>
    </Card>
  );
}
