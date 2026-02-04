import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { initData } from '@telegram-apps/sdk-react';
import { useTelegramUser } from '../hooks/telegram/useTelegramUser';
import { useAuth } from '../hooks/api/useAuth';
import { getReferralIdFromStartParam } from '../utils/telegram';
import { useAuthStore } from '../store/authStore';

export function LoadingPage() {
  const navigate = useNavigate();
  const { user, isLoading: isUserLoading } = useTelegramUser();
  const { telegramVerify, isSuccess } = useAuth();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  useEffect(() => {
    if (!isUserLoading && user && !isAuthenticated) {
      const referralId = getReferralIdFromStartParam(user.startParam);

      if (user.userId) {
        telegramVerify({
          telegramUserId: user.userId,
          telegramUsername: user.username,
          initData: initData.raw() || '',
          referredByUserId: referralId,
        });
      }
    }
  }, [isUserLoading, user, isAuthenticated, telegramVerify]);

  useEffect(() => {
    if (isSuccess || isAuthenticated) {
      navigate('/markets');
    }
  }, [isSuccess, isAuthenticated, navigate]);

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-500 mx-auto mb-4"></div>
        <h2 className="text-xl font-black text-white uppercase tracking-tight">
          Loading Meme Prediction...
        </h2>
        <p className="text-gray-400 mt-2 font-semibold">
          Please wait while we set up your account
        </p>
      </div>
    </div>
  );
}
