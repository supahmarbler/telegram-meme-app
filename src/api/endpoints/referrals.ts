import apiClient from '../client';
import type { UserBalance } from '../types';

export const referralsAPI = {
  getUserBalance: async (): Promise<UserBalance> => {
    const response = await apiClient.get<UserBalance>('/farm/user_balance');
    return response.data;
  },
};
