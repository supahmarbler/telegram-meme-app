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

export interface PredictionMarket {
  id: number;
  title: string;
  description: string;
  imageUrl?: string;
  endDate: string;
  status: 'active' | 'closed' | 'resolved';
  totalLiquidity: number;
  priceYes: number;
  priceNo: number;
  volumeYes: number;
  volumeNo: number;
  userPosition?: UserPosition;
  createdAt: string;
  updatedAt: string;
}

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
