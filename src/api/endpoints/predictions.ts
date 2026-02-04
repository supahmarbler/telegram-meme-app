import apiClient from '../client';
import type {
  GetMarketsResponse,
  ApiGetMarketsResponse,
  PlaceBetRequest,
  PlaceBetResponse,
  PredictionMarket
} from '../types';
import { mapApiMarketToMarket } from '../types';

export const predictionsAPI = {
  getMarkets: async (params?: {
    page?: number;
    limit?: number;
    status?: 'OPEN' | 'CLOSED' | 'RESOLVED';
  }): Promise<GetMarketsResponse> => {
    const response = await apiClient.get<ApiGetMarketsResponse>('/prediction_markets/get_markets', {
      params: {
        page: params?.page,
        limit: params?.limit,
        status: params?.status,
      },
    });

    // Map API response to internal structure
    const markets = response.data.items.map(mapApiMarketToMarket);

    return {
      markets,
      total: markets.length,
      page: params?.page || 1,
      limit: params?.limit || 20,
    };
  },

  getMarketById: async (marketId: number): Promise<PredictionMarket> => {
    const response = await apiClient.get<PredictionMarket>(`/prediction_markets/${marketId}`);
    return response.data;
  },

  placeBet: async (data: PlaceBetRequest): Promise<PlaceBetResponse> => {
    const response = await apiClient.post<PlaceBetResponse>('/prediction_markets/buy', data);
    return response.data;
  },
};
