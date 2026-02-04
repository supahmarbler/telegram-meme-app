/**
 * Development Mode Utilities
 *
 * Handles graceful fallback when running outside Telegram
 */

let isDevelopmentMode = false;

export function setDevelopmentMode(value: boolean) {
  isDevelopmentMode = value;
  if (value) {
    console.log('🔧 Running in development mode (outside Telegram)');
  }
}

export function getDevelopmentMode(): boolean {
  return isDevelopmentMode;
}

export const MOCK_TELEGRAM_USER = {
  userId: 123456789,
  username: 'dev_user',
  firstName: 'Dev',
  lastName: 'User',
  photoUrl: undefined,
};
