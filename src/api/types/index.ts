export interface TelegramAuthRequest {
  telegramUserId: number;
  telegramUsername?: string;
  initData: string;
  referredByUserId?: number;
}

export interface TelegramAuthResponse {
  accessToken: string;
  refreshToken: string;
  userId: number;
  isNewUser: boolean;
}

export interface UserPosition {
  marketId: number;
  sharesYes: number;
  sharesNo: number;
  averagePriceYes: number;
  averagePriceNo: number;
  currentValue: number;
  profitLoss: number;
}

// API Response types (from backend)
export interface ApiPredictionMarket {
  market_id: number;
  title: string;
  description: string;
  image_url?: string;
  label_yes: string;
  label_no: string;
  ending_date: string;
  status: 'OPEN' | 'CLOSED' | 'RESOLVED';
  result?: string | null;
  total_yes_shares: number;
  total_no_shares: number;
  liquidity: number;
  users_trading_count: number;
  user_position?: UserPosition | null;
}

// Internal types (used by frontend)
export interface PredictionMarket {
  id: number;
  title: string;
  description: string;
  imageUrl?: string;
  labelYes: string;
  labelNo: string;
  endDate: string;
  status: 'OPEN' | 'CLOSED' | 'RESOLVED';
  totalLiquidity: number;
  priceYes: number;
  priceNo: number;
  volumeYes: number;
  volumeNo: number;
  userPosition?: UserPosition;
}

// API Response
export interface ApiGetMarketsResponse {
  items: ApiPredictionMarket[];
}

// Internal Response
export interface GetMarketsResponse {
  markets: PredictionMarket[];
  total: number;
  page: number;
  limit: number;
}

export interface PlaceBetRequest {
  marketId: number;
  outcome: 'yes' | 'no';
  amount: number;
}

export interface PlaceBetResponse {
  success: boolean;
  shares: number;
  newPrice: number;
  newBalance: number;
  transactionId: string;
}

export interface UserBalance {
  memescore: number;
  rewardPoints: number;
  referredUsersCount: number;
  rewardPointsFromReferrals: number;
}

export interface ReferralStats {
  referredUsersCount: number;
  pointsEarned: number;
  totalReferrals: number;
}

// Helper function to map API response to internal structure
export function mapApiMarketToMarket(apiMarket: ApiPredictionMarket): PredictionMarket {
  const totalShares = apiMarket.total_yes_shares + apiMarket.total_no_shares;

  return {
    id: apiMarket.market_id,
    title: apiMarket.title,
    description: apiMarket.description,
    imageUrl: apiMarket.image_url,
    labelYes: apiMarket.label_yes || 'YES',
    labelNo: apiMarket.label_no || 'NO',
    endDate: apiMarket.ending_date,
    status: apiMarket.status,
    totalLiquidity: apiMarket.liquidity,
    // Calculate prices from shares
    priceYes: totalShares > 0 ? apiMarket.total_yes_shares / totalShares : 0.5,
    priceNo: totalShares > 0 ? apiMarket.total_no_shares / totalShares : 0.5,
    volumeYes: apiMarket.total_yes_shares,
    volumeNo: apiMarket.total_no_shares,
    userPosition: apiMarket.user_position || undefined,
  };
}
