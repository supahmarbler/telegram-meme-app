import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import { predictionsAPI } from '../../api/endpoints/predictions';
import { REFRESH_INTERVALS } from '../../utils/constants';

export function useMarkets(status?: 'OPEN' | 'CLOSED' | 'RESOLVED') {
  return useInfiniteQuery({
    queryKey: ['markets', status],
    queryFn: ({ pageParam = 1 }) =>
      predictionsAPI.getMarkets({ page: pageParam, limit: 20, status }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (lastPage.markets.length < 20) return undefined;
      return lastPage.page + 1;
    },
    refetchInterval: REFRESH_INTERVALS.MARKETS,
  });
}

export function useMarket(marketId: number) {
  return useQuery({
    queryKey: ['market', marketId],
    queryFn: () => predictionsAPI.getMarketById(marketId),
    enabled: !!marketId,
  });
}
