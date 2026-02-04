import { TELEGRAM_BOT_USERNAME } from './constants';

export interface TelegramInitData {
  userId?: number;
  username?: string;
  firstName?: string;
  lastName?: string;
  photoUrl?: string;
  authDate?: number;
  hash?: string;
  startParam?: string;
}

export function parseInitData(initData: string): TelegramInitData {
  const params = new URLSearchParams(initData);
  const userStr = params.get('user');

  if (!userStr) {
    return {
      startParam: params.get('start_param') || undefined,
    };
  }

  try {
    const user = JSON.parse(userStr);
    return {
      userId: user.id,
      username: user.username,
      firstName: user.first_name,
      lastName: user.last_name,
      photoUrl: user.photo_url,
      authDate: parseInt(params.get('auth_date') || '0'),
      hash: params.get('hash') || undefined,
      startParam: params.get('start_param') || undefined,
    };
  } catch (error) {
    console.error('Failed to parse Telegram init data:', error);
    return {
      startParam: params.get('start_param') || undefined,
    };
  }
}

export function getReferralIdFromStartParam(startParam?: string): number | undefined {
  if (!startParam) return undefined;

  // Format: ref_123456
  const match = startParam.match(/^ref_(\d+)$/);
  if (match) {
    return parseInt(match[1], 10);
  }

  return undefined;
}

export function generateReferralLink(userId: number): string {
  return `https://t.me/${TELEGRAM_BOT_USERNAME}/app?startapp=ref_${userId}`;
}

export function generateShareUrl(userId: number): string {
  const url = generateReferralLink(userId);
  const text = "🎮 Join me on Meme Prediction!";
  return `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`;
}
