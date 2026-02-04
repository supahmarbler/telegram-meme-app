import { useEffect, useState } from 'react';
import { initData } from '@telegram-apps/sdk-react';
import { parseInitData } from '../../utils/telegram';
import type { TelegramInitData } from '../../utils/telegram';

export function useTelegramUser() {
  const [user, setUser] = useState<TelegramInitData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const data = initData.raw();
      if (data) {
        const parsedUser = parseInitData(data);
        setUser(parsedUser);
      } else {
        // Development mode fallback
        if (import.meta.env.DEV) {
          setUser({
            userId: 123456789,
            username: 'dev_user',
            firstName: 'Dev',
            lastName: 'User',
          });
        }
      }
    } catch (error) {
      console.error('Failed to get Telegram user:', error);

      // Development mode fallback
      if (import.meta.env.DEV) {
        setUser({
          userId: 123456789,
          username: 'dev_user',
          firstName: 'Dev',
          lastName: 'User',
        });
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { user, isLoading };
}
