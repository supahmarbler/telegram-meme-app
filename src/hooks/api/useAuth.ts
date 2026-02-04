import { useMutation } from '@tanstack/react-query';
import { authAPI } from '../../api/endpoints/auth';
import type { TelegramAuthRequest } from '../../api/types';
import { useAuthStore } from '../../store/authStore';
import { useUIStore } from '../../store/uiStore';

export function useAuth() {
  const setAuth = useAuthStore((state) => state.setAuth);
  const showToast = useUIStore((state) => state.showToast);

  const telegramVerifyMutation = useMutation({
    mutationFn: (data: TelegramAuthRequest) => authAPI.telegramVerify(data),
    onSuccess: (data) => {
      setAuth(data.accessToken, data.refreshToken, data.userId);
      if (data.isNewUser) {
        showToast('Welcome to Meme Prediction! 🎉', 'success');
      }
    },
    onError: (error: any) => {
      console.error('Authentication failed:', error);
      showToast(
        error.response?.data?.message || 'Authentication failed. Please try again.',
        'error'
      );
    },
  });

  return {
    telegramVerify: telegramVerifyMutation.mutate,
    isLoading: telegramVerifyMutation.isPending,
    isSuccess: telegramVerifyMutation.isSuccess,
    error: telegramVerifyMutation.error,
  };
}
