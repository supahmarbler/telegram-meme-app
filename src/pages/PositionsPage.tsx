import { useNavigate } from 'react-router-dom';
import { useMarkets } from '../hooks/api/useMarkets';
import { AppLayout } from '../components/layout/AppLayout';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

export function PositionsPage() {
  const navigate = useNavigate();
  const { data, isLoading } = useMarkets('OPEN');

  const allMarkets = data?.pages.flatMap((page) => page.markets) || [];
  const marketsWithPositions = allMarkets.filter(
    (m) => m.userPosition && (m.userPosition.sharesYes > 0 || m.userPosition.sharesNo > 0)
  );

  return (
    <AppLayout>
      <div className="p-4 pb-20">
        <h1 className="text-2xl font-bold mb-6">Your Positions</h1>

        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">Loading positions...</p>
          </div>
        ) : marketsWithPositions.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-400 text-lg mb-2">
              No active positions yet
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-500 mb-6">
              Browse markets and place your first bet!
            </p>
            <Button onClick={() => navigate('/markets')}>
              Explore Markets
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {marketsWithPositions.map((market) => {
              const position = market.userPosition!;
              const hasYesShares = position.sharesYes > 0;
              const hasNoShares = position.sharesNo > 0;

              return (
                <Card key={market.id} onClick={() => navigate(`/markets/${market.id}`)}>
                  <h3 className="font-bold text-lg mb-3 line-clamp-2">{market.title}</h3>

                  <div className="space-y-2 mb-3">
                    {hasYesShares && (
                      <div className="flex items-center justify-between bg-green-50 dark:bg-green-900 p-2 rounded">
                        <span className="text-sm">YES Shares</span>
                        <span className="font-bold text-green-600 dark:text-green-400">
                          {position.sharesYes.toFixed(2)}
                        </span>
                      </div>
                    )}

                    {hasNoShares && (
                      <div className="flex items-center justify-between bg-red-50 dark:bg-red-900 p-2 rounded">
                        <span className="text-sm">NO Shares</span>
                        <span className="font-bold text-red-600 dark:text-red-400">
                          {position.sharesNo.toFixed(2)}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-gray-700">
                    <div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">Current Value</div>
                      <div className="font-bold">{position.currentValue.toLocaleString()}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-gray-500 dark:text-gray-400">P/L</div>
                      <div
                        className={`font-bold ${
                          position.profitLoss >= 0 ? 'text-green-600' : 'text-red-600'
                        }`}
                      >
                        {position.profitLoss >= 0 ? '+' : ''}
                        {position.profitLoss.toLocaleString()}
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
