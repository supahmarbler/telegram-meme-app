import { useState, Fragment } from 'react';
import { useMarkets } from '../hooks/api/useMarkets';
import { AppLayout } from '../components/layout/AppLayout';
import { MarketCard } from '../components/market/MarketCard';
import { Button } from '../components/ui/Button';

type FilterTab = 'active' | 'my-bets';

export function MarketsPage() {
  const [activeTab, setActiveTab] = useState<FilterTab>('active');
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = useMarkets('OPEN');

  const allMarkets = data?.pages.flatMap((page) => page.markets) || [];
  const displayedMarkets = activeTab === 'my-bets'
    ? allMarkets.filter((m) => m.userPosition && (m.userPosition.sharesYes > 0 || m.userPosition.sharesNo > 0))
    : allMarkets;

  return (
    <AppLayout>
      <div className="pb-4">
        {/* Filter Tabs */}
        <div className="sticky top-[57px] bg-gray-900 border-b border-gray-700 z-10">
          <div className="flex">
            <button
              onClick={() => setActiveTab('active')}
              className={`flex-1 py-2.5 px-4 font-archivo font-semibold transition-all ${
                activeTab === 'active'
                  ? 'text-blue-500 border-b-2 border-blue-500'
                  : 'text-gray-400 hover:text-gray-300'
              }`}
            >
              Active
            </button>
            <button
              onClick={() => setActiveTab('my-bets')}
              className={`flex-1 py-2.5 px-4 font-archivo font-semibold transition-all ${
                activeTab === 'my-bets'
                  ? 'text-blue-500 border-b-2 border-blue-500'
                  : 'text-gray-400 hover:text-gray-300'
              }`}
            >
              My Bets
            </button>
          </div>
        </div>

        {/* Markets List */}
        <div className="p-4 space-y-4">
          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-blue-500 mx-auto mb-4"></div>
              <p className="text-gray-400">Loading markets...</p>
            </div>
          ) : displayedMarkets.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-300 text-lg mb-2 font-bold">
                {activeTab === 'my-bets' ? 'No active bets yet' : 'No markets available'}
              </p>
              {activeTab === 'my-bets' && (
                <p className="text-sm text-gray-400">
                  Browse active markets to place your first bet!
                </p>
              )}
            </div>
          ) : (
            <>
              {displayedMarkets.map((market) => (
                <Fragment key={market.id}>
                  <MarketCard market={market} />
                </Fragment>
              ))}

              {hasNextPage && (
                <div className="text-center pt-4">
                  <Button
                    onClick={() => fetchNextPage()}
                    isLoading={isFetchingNextPage}
                    variant="secondary"
                  >
                    Load More
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
