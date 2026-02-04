import apiClient from '../client';
import type { GetMarketsResponse, PlaceBetRequest, PlaceBetResponse, PredictionMarket } from '../types';

export const predictionsAPI = {
  getMarkets: async (params?: {
    page?: number;
    limit?: number;
    status?: 'active' | 'closed' | 'resolved';
  }): Promise<GetMarketsResponse> => {
    const response = await apiClient.get<GetMarketsResponse>('/prediction_markets/get_markets', {
      params: {
        page: params?.page || 1,
        limit: params?.limit || 20,
        status: params?.status,
      },
    });
    return response.data;
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
