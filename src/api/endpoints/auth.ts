import apiClient from '../client';
import type { TelegramAuthRequest, TelegramAuthResponse } from '../types';

export const authAPI = {
  telegramVerify: async (data: TelegramAuthRequest): Promise<TelegramAuthResponse> => {
    const response = await apiClient.post<TelegramAuthResponse>(
      '/authentication/telegram_verify',
      data
    );
    return response.data;
  },
};
