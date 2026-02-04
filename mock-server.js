/**
 * Mock Backend Server for Development
 * Run with: node mock-server.js
 *
 * Simulates the meme.com backend API endpoints
 */

import express from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Mock data
let users = {};
let markets = [];
let userBalances = {};

// Initialize mock markets (real data from meme.com API - fetched 2026-02-04)
function initializeMockMarkets() {
  markets = [
    {
      market_id: 72,
      title: "Will Beeple Tweet a Dick Butt by End of February",
      description: "Will @Beeple post on X a Dick Butt or a Dick Butt related image or mention before February 28th, 2026 23:59UTC",
      image_url: "https://cdn-v2.meme.com//uploaded_images/prediction_market/2026-02-03/1770130407619.webp",
      label_yes: "YES",
      label_no: "NO",
      ending_date: "2026-02-28T22:59:00Z",
      status: "OPEN",
      result: null,
      total_yes_shares: 5890322.492,
      total_no_shares: 4053379.809,
      liquidity: 2000000.0,
      users_trading_count: 415,
      user_position: null
    },
    {
      market_id: 71,
      title: "$POPCAT or $MOODENG higher token price on Feb 9th EOD.",
      description: "According to CoinGecko live charts, which will have a higher token price $POPCAT or $MOODENG (solana) on February 9th, 2026 11:59 PM UTC",
      image_url: "https://cdn-v2.meme.com//uploaded_images/prediction_market/2026-02-02/1770050838807.webp",
      label_yes: "$POPCAT",
      label_no: "$MOODENG",
      ending_date: "2026-02-10T00:00:00Z",
      status: "OPEN",
      result: null,
      total_yes_shares: 14382376.735,
      total_no_shares: 11780156.5,
      liquidity: 2000000.0,
      users_trading_count: 505,
      user_position: null
    },
    {
      market_id: 70,
      title: "Will $BITCOIN be over a $25m MC EOD Feb 5th",
      description: "According to CoinGecko live chart, will $BITCOIN be @ or above a $25m MC Feb 5th, 2026 11:59 PM UTC",
      image_url: "https://cdn-v2.meme.com//uploaded_images/prediction_market/2026-02-02/1770044344228.webp",
      label_yes: "YES",
      label_no: "NO",
      ending_date: "2026-02-06T00:00:00Z",
      status: "OPEN",
      result: null,
      total_yes_shares: 13408546.037,
      total_no_shares: 14517216.103,
      liquidity: 2000000.0,
      users_trading_count: 752,
      user_position: null
    },
    {
      market_id: 69,
      title: "$TURBO vs. $WHITEWHALE higher MC on Feb 7th EOD",
      description: "According to CoinGecko, which will be higher marketcap February 7th, 2025 @ 11:59 PM UTC",
      image_url: "https://cdn-v2.meme.com//uploaded_images/prediction_market/2026-01-30/1769807198057.webp",
      label_yes: "$TURBO",
      label_no: "$WHITEWHALE",
      ending_date: "2026-02-08T00:00:00Z",
      status: "OPEN",
      result: null,
      total_yes_shares: 7148650.173,
      total_no_shares: 7016193.927,
      liquidity: 5000000.0,
      users_trading_count: 529,
      user_position: null
    },
    {
      market_id: 68,
      title: "Memecoin on Las Vegas Sphere in 2026",
      description: "By midnight December 31st, 2026 2 00:00UTC will a memecoinbe displayed on the Las Vegas Sphere in Nevada USA.",
      image_url: "https://cdn-v2.meme.com//uploaded_images/prediction_market/2026-01-30/1769795685691.webp",
      label_yes: "YES",
      label_no: "NO",
      ending_date: "2027-01-01T00:00:00Z",
      status: "OPEN",
      result: null,
      total_yes_shares: 8522112.774,
      total_no_shares: 3794049.201,
      liquidity: 5000000.0,
      users_trading_count: 829,
      user_position: null
    }
  ];
}

initializeMockMarkets();

// Middleware to log requests
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// POST /authentication/telegram_verify
app.post('/authentication/telegram_verify', (req, res) => {
  const { telegramUserId, telegramUsername, referredByUserId } = req.body;

  console.log('Auth request:', { telegramUserId, telegramUsername, referredByUserId });

  if (!telegramUserId) {
    return res.status(400).json({ error: 'telegramUserId is required' });
  }

  const userId = telegramUserId;
  const isNewUser = !users[userId];

  // Create or update user
  users[userId] = {
    userId,
    telegramUsername,
    referredByUserId,
    createdAt: users[userId]?.createdAt || new Date().toISOString()
  };

  // Initialize user balance if new
  if (isNewUser) {
    userBalances[userId] = {
      memescore: 10000, // Starting balance
      rewardPoints: 0,
      referredUsersCount: 0,
      rewardPointsFromReferrals: 0
    };

    // Award referrer if exists
    if (referredByUserId && userBalances[referredByUserId]) {
      userBalances[referredByUserId].referredUsersCount += 1;
      userBalances[referredByUserId].rewardPoints += 100;
      userBalances[referredByUserId].rewardPointsFromReferrals += 100;
    }
  }

  // Generate mock JWT token
  const accessToken = `mock_token_${userId}_${Date.now()}`;
  const refreshToken = `mock_refresh_${userId}_${Date.now()}`;

  res.json({
    accessToken,
    refreshToken,
    userId,
    isNewUser
  });
});

// GET /prediction_markets/get_markets
app.get('/prediction_markets/get_markets', (req, res) => {
  const { page = 1, limit = 20, status = 'OPEN' } = req.query;

  const filteredMarkets = markets.filter(m => m.status === status);
  const start = (page - 1) * limit;
  const end = start + parseInt(limit);
  const paginatedMarkets = filteredMarkets.slice(start, end);

  // Add user positions if authenticated
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.replace('Bearer ', '');
    const userIdMatch = token.match(/mock_token_(\d+)_/);

    if (userIdMatch) {
      const userId = userIdMatch[1];
      paginatedMarkets.forEach(market => {
        // Mock user positions for testing
        if (Math.random() > 0.7) {
          market.userPosition = {
            marketId: market.id,
            sharesYes: Math.random() > 0.5 ? Math.random() * 100 : 0,
            sharesNo: Math.random() > 0.5 ? Math.random() * 100 : 0,
            averagePriceYes: market.priceYes,
            averagePriceNo: market.priceNo,
            currentValue: Math.random() * 500,
            profitLoss: (Math.random() - 0.5) * 200
          };
        }
      });
    }
  }

  res.json({
    items: paginatedMarkets
  });
});

// POST /prediction_markets/buy
app.post('/prediction_markets/buy', (req, res) => {
  const { marketId, outcome, amount } = req.body;
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const token = authHeader.replace('Bearer ', '');
  const userIdMatch = token.match(/mock_token_(\d+)_/);

  if (!userIdMatch) {
    return res.status(401).json({ error: 'Invalid token' });
  }

  const userId = userIdMatch[1];
  const market = markets.find(m => m.market_id === marketId);

  if (!market) {
    return res.status(404).json({ error: 'Market not found' });
  }

  if (!userBalances[userId]) {
    return res.status(400).json({ error: 'User balance not found' });
  }

  if (userBalances[userId].memescore < amount) {
    return res.status(400).json({ error: 'Insufficient balance' });
  }

  // Calculate shares
  const price = outcome === 'yes' ? market.priceYes : market.priceNo;
  const shares = amount / price;

  // Update user balance
  userBalances[userId].memescore -= amount;

  // Update market
  if (outcome === 'yes') {
    market.volumeYes += amount;
    market.priceYes = Math.min(0.99, market.priceYes + 0.01);
    market.priceNo = 1 - market.priceYes;
  } else {
    market.volumeNo += amount;
    market.priceNo = Math.min(0.99, market.priceNo + 0.01);
    market.priceYes = 1 - market.priceNo;
  }

  market.totalLiquidity += amount;

  res.json({
    success: true,
    shares: shares,
    newPrice: price,
    newBalance: userBalances[userId].memescore,
    transactionId: `tx_${Date.now()}`
  });
});

// GET /farm/user_balance
app.get('/farm/user_balance', (req, res) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const token = authHeader.replace('Bearer ', '');
  const userIdMatch = token.match(/mock_token_(\d+)_/);

  if (!userIdMatch) {
    return res.status(401).json({ error: 'Invalid token' });
  }

  const userId = userIdMatch[1];
  const balance = userBalances[userId] || {
    memescore: 10000,
    rewardPoints: 0,
    referredUsersCount: 0,
    rewardPointsFromReferrals: 0
  };

  res.json(balance);
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`\n🚀 Mock Backend Server running at http://localhost:${PORT}`);
  console.log(`\nAvailable endpoints:`);
  console.log(`  POST /authentication/telegram_verify`);
  console.log(`  GET  /prediction_markets/get_markets`);
  console.log(`  POST /prediction_markets/buy`);
  console.log(`  GET  /farm/user_balance`);
  console.log(`  GET  /health\n`);
  console.log(`📊 Mock data initialized:`);
  console.log(`  - ${markets.length} markets`);
  console.log(`  - ${Object.keys(users).length} users`);
  console.log(`\n🔧 To use this server, update .env:`);
  console.log(`  VITE_API_BASE_URL=http://localhost:${PORT}\n`);
});
