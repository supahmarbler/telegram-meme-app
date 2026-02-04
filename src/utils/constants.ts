export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.v2.meme.com';
export const TELEGRAM_BOT_USERNAME = import.meta.env.VITE_TELEGRAM_BOT_USERNAME || 'meme_prediction_bot';
export const APP_NAME = import.meta.env.VITE_APP_NAME || 'Meme Prediction';

export const ROUTES = {
  LOADING: '/loading',
  MARKETS: '/markets',
  MARKET_DETAIL: '/markets/:marketId',
  POSITIONS: '/positions',
  REFERRALS: '/referrals',
} as const;

export const REFRESH_INTERVALS = {
  BALANCE: 30000, // 30 seconds
  MARKETS: 60000, // 1 minute
} as const;
