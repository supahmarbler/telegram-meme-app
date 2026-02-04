import { useEffect, useState } from 'react';
import { initData } from '@telegram-apps/sdk-react';
import { parseInitData } from '../../utils/telegram';
import type { TelegramInitData } from '../../utils/telegram';
import { getDevelopmentMode, MOCK_TELEGRAM_USER } from '../../utils/developmentMode';

export function useTelegramUser() {
  const [user, setUser] = useState<TelegramInitData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if we're in development mode (outside Telegram)
    if (getDevelopmentMode()) {
      console.log('📱 Using mock Telegram user for development');
      setUser(MOCK_TELEGRAM_USER);
      setIsLoading(false);
      return;
    }

    // Try to get real Telegram user data
    try {
      const data = initData.raw();
      if (data) {
        const parsedUser = parseInitData(data);
        setUser(parsedUser);
      } else {
        // No data but not an error - use mock for testing
        console.warn('⚠️ No Telegram init data, using mock user');
        setUser(MOCK_TELEGRAM_USER);
      }
    } catch (error) {
      console.error('❌ Failed to get Telegram user:', error);
      // Fallback to mock user
      setUser(MOCK_TELEGRAM_USER);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { user, isLoading };
}
