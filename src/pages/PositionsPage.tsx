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
        <h1 className="text-3xl font-bebas mb-6 text-white tracking-wider">YOUR POSITIONS</h1>

        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-400">Loading positions...</p>
          </div>
        ) : marketsWithPositions.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-300 text-lg mb-2 font-bold">
              No active positions yet
            </p>
            <p className="text-sm text-gray-400 mb-6">
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
                  <h3 className="font-black text-lg mb-3 line-clamp-2 text-white uppercase tracking-tight">{market.title}</h3>

                  <div className="space-y-2 mb-3">
                    {hasYesShares && (
                      <div className="flex items-center justify-between bg-gradient-to-r from-green-900 to-green-800 p-3 rounded-xl border border-green-700">
                        <span className="text-sm font-bold text-green-300 uppercase tracking-wide">YES Shares</span>
                        <span className="font-black text-white text-lg">
                          {position.sharesYes.toFixed(2)}
                        </span>
                      </div>
                    )}

                    {hasNoShares && (
                      <div className="flex items-center justify-between bg-gradient-to-r from-red-900 to-red-800 p-3 rounded-xl border border-red-700">
                        <span className="text-sm font-bold text-red-300 uppercase tracking-wide">NO Shares</span>
                        <span className="font-black text-white text-lg">
                          {position.sharesNo.toFixed(2)}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-gray-700">
                    <div>
                      <div className="text-xs text-gray-400 uppercase tracking-wide font-semibold">Current Value</div>
                      <div className="font-black text-white text-lg">{position.currentValue.toLocaleString()}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-gray-400 uppercase tracking-wide font-semibold">P/L</div>
                      <div
                        className={`font-black text-lg ${
                          position.profitLoss >= 0 ? 'text-green-400' : 'text-red-400'
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
