import { useCallback } from 'react';
import { openTelegramLink } from '@telegram-apps/sdk-react';
import { generateShareUrl } from '../../utils/telegram';

export function useTelegramShare() {
  const shareReferral = useCallback((userId: number) => {
    try {
      const url = generateShareUrl(userId);
      openTelegramLink(url);
    } catch (error) {
      console.error('Failed to share referral:', error);
      // Fallback to opening the URL directly
      const url = generateShareUrl(userId);
      window.open(url, '_blank');
    }
  }, []);

  return { shareReferral };
}
