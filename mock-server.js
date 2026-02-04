/**
 * Mock Backend Server for Development
 * Run with: node mock-server.js
 *
 * Simulates the meme.com backend API endpoints
 */

import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// Mock data
let users = {};
let markets = [];
let userBalances = {};

// Initialize mock markets
function initializeMockMarkets() {
  markets = [
    {
      id: 1,
      title: "Will Dogecoin reach $1 by end of 2026?",
      description: "Predict if DOGE will hit $1 USD",
      imageUrl: "https://picsum.photos/seed/doge/400/300",
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      status: "active",
      totalLiquidity: 150000,
      priceYes: 0.35,
      priceNo: 0.65,
      volumeYes: 52500,
      volumeNo: 97500,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 2,
      title: "Will Pepe become top 10 crypto?",
      description: "Will PEPE enter top 10 by market cap?",
      imageUrl: "https://picsum.photos/seed/pepe/400/300",
      endDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
      status: "active",
      totalLiquidity: 89000,
      priceYes: 0.42,
      priceNo: 0.58,
      volumeYes: 37380,
      volumeNo: 51620,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 3,
      title: "Will Shiba Inu burn 50% supply this year?",
      description: "Predict if SHIB will burn half its tokens",
      imageUrl: "https://picsum.photos/seed/shib/400/300",
      endDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString(),
      status: "active",
      totalLiquidity: 120000,
      priceYes: 0.28,
      priceNo: 0.72,
      volumeYes: 33600,
      volumeNo: 86400,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
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
  const { page = 1, limit = 20, status = 'active' } = req.query;

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
    markets: paginatedMarkets,
    total: filteredMarkets.length,
    page: parseInt(page),
    limit: parseInt(limit)
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
  const market = markets.find(m => m.id === marketId);

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
