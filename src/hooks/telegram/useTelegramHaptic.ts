import { useCallback } from 'react';
import { hapticFeedback } from '@telegram-apps/sdk-react';
import { getDevelopmentMode } from '../../utils/developmentMode';

export function useTelegramHaptic() {
  const impactOccurred = useCallback((style: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft' = 'medium') => {
    if (getDevelopmentMode()) {
      // Silently skip in development mode
      return;
    }

    try {
      hapticFeedback.impactOccurred(style);
    } catch (error) {
      // Silently fail - haptic feedback is not critical
    }
  }, []);

  const notificationOccurred = useCallback((type: 'error' | 'success' | 'warning') => {
    if (getDevelopmentMode()) {
      // Silently skip in development mode
      return;
    }

    try {
      hapticFeedback.notificationOccurred(type);
    } catch (error) {
      // Silently fail - haptic feedback is not critical
    }
  }, []);

  const selectionChanged = useCallback(() => {
    if (getDevelopmentMode()) {
      // Silently skip in development mode
      return;
    }

    try {
      hapticFeedback.selectionChanged();
    } catch (error) {
      // Silently fail - haptic feedback is not critical
    }
  }, []);

  return {
    impactOccurred,
    notificationOccurred,
    selectionChanged,
  };
}
