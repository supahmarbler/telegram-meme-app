import { useCallback } from 'react';
import { openTelegramLink } from '@telegram-apps/sdk-react';
import { generateShareUrl } from '../../utils/telegram';
import { getDevelopmentMode } from '../../utils/developmentMode';

export function useTelegramShare() {
  const shareReferral = useCallback((userId: number) => {
    const url = generateShareUrl(userId);

    // In development mode (outside Telegram), just open in new tab
    if (getDevelopmentMode()) {
      console.log('🔗 Development mode: Opening share URL in new tab');
      window.open(url, '_blank');
      return;
    }

    // Try to use Telegram's native sharing
    try {
      openTelegramLink(url);
    } catch (error) {
      console.error('❌ Failed to share via Telegram:', error);
      // Fallback to opening the URL directly
      window.open(url, '_blank');
    }
  }, []);

  return { shareReferral };
}
