import { useCallback } from 'react';
import { hapticFeedback } from '@telegram-apps/sdk-react';

export function useTelegramHaptic() {
  const impactOccurred = useCallback((style: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft' = 'medium') => {
    try {
      hapticFeedback.impactOccurred(style);
    } catch (error) {
      console.error('Haptic feedback failed:', error);
    }
  }, []);

  const notificationOccurred = useCallback((type: 'error' | 'success' | 'warning') => {
    try {
      hapticFeedback.notificationOccurred(type);
    } catch (error) {
      console.error('Haptic feedback failed:', error);
    }
  }, []);

  const selectionChanged = useCallback(() => {
    try {
      hapticFeedback.selectionChanged();
    } catch (error) {
      console.error('Haptic feedback failed:', error);
    }
  }, []);

  return {
    impactOccurred,
    notificationOccurred,
    selectionChanged,
  };
}
