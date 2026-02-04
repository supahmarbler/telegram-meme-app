# Testing Guide

## ✅ Current Status

**Development Environment: RUNNING**

- Frontend: http://localhost:5173
- Mock Backend: http://localhost:3001
- Both servers are active and communicating

## Mock Backend Features

The mock server (`mock-server.js`) provides:

1. **Telegram Authentication** - Returns JWT tokens
2. **Markets API** - 3 sample meme prediction markets
3. **Place Bets** - Simulates bet placement with balance updates
4. **User Balance** - Tracks memescore and referrals
5. **Referral System** - Awards points for referrals

### Sample Markets Available:
- "Will Dogecoin reach $1 by end of 2026?"
- "Will Pepe become top 10 crypto?"
- "Will Shiba Inu burn 50% supply this year?"

## How to Test Locally

### 1. Start Both Servers

```bash
# Terminal 1: Mock Backend
npm run mock-server

# Terminal 2: Frontend
npm run dev

# Or start both together:
npm run dev:full
```

### 2. Open the App

Open http://localhost:5173 in your browser

### 3. Test Authentication Flow

The app automatically logs you in with a mock Telegram user:
- User ID: 123456789
- Username: dev_user
- Starting Balance: 10,000 memescore

### 4. Test Features

#### View Markets
1. You should see 3 prediction markets
2. Each shows YES/NO odds
3. Check the "My Bets" tab (initially empty)

#### Place a Bet
1. Click on any market
2. Enter an amount (e.g., 100)
3. Click "Bet YES" or "Bet NO"
4. Confirm in the modal
5. Check that:
   - Toast notification appears
   - Balance updates in header
   - You're redirected back to markets

#### View Positions
1. Click the "Positions" tab
2. Should see your recent bet
3. Shows shares owned and P/L

#### Test Referrals
1. Click the "Referrals" tab
2. Click "Share Referral Link"
3. Click "Copy Link"
4. Link format: `https://t.me/meme_prediction_bot/app?startapp=ref_123456789`

### 5. Test Referral Flow

To test referrals with the mock backend:

```bash
# Simulate new user signup with referral
curl -X POST http://localhost:3001/authentication/telegram_verify \
  -H 'Content-Type: application/json' \
  -d '{"telegramUserId": 999999, "telegramUsername": "referred_user", "referredByUserId": 123456789}'
```

Then refresh the Referrals page to see updated count.

## API Testing

### Test Auth Endpoint
```bash
curl -X POST http://localhost:3001/authentication/telegram_verify \
  -H 'Content-Type: application/json' \
  -d '{"telegramUserId": 123456789, "telegramUsername": "test_user"}'
```

### Test Markets Endpoint
```bash
curl http://localhost:3001/prediction_markets/get_markets
```

### Test User Balance
```bash
curl http://localhost:3001/farm/user_balance \
  -H 'Authorization: Bearer mock_token_123456789_1234567890'
```

### Test Place Bet
```bash
curl -X POST http://localhost:3001/prediction_markets/buy \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer mock_token_123456789_1234567890' \
  -d '{"marketId": 1, "outcome": "yes", "amount": 100}'
```

## Browser DevTools Testing

Open Chrome/Firefox DevTools:

1. **Network Tab**
   - Watch API calls to http://localhost:3001
   - Verify JWT tokens are sent in headers
   - Check response times

2. **Console**
   - Should see no errors
   - Telegram SDK warnings are expected in dev mode

3. **Application/Storage**
   - Check LocalStorage for `auth-storage`
   - Verify JWT token is persisted

## Testing Checklist

### Basic Flow
- [ ] App loads without errors
- [ ] Markets page displays 3 markets
- [ ] Can click on a market to see details
- [ ] Can enter bet amount
- [ ] Can place YES bet
- [ ] Can place NO bet
- [ ] Balance updates after bet
- [ ] Toast notification appears
- [ ] Positions page shows active bets

### Navigation
- [ ] Markets tab works
- [ ] Positions tab works
- [ ] Referrals tab works
- [ ] Back button works in market detail
- [ ] Tab bar highlights active tab

### Features
- [ ] Referral link can be copied
- [ ] Balance auto-refreshes (check after 30 seconds)
- [ ] Markets auto-refresh (check after 60 seconds)
- [ ] Modal opens/closes properly
- [ ] Form validation works (try negative amounts)
- [ ] Insufficient balance error shows

### Error Handling
- [ ] Try betting more than balance
- [ ] Try betting 0 or negative amount
- [ ] Check error messages display

### Dark Mode
- [ ] App respects system dark mode
- [ ] Colors are readable in both modes

## Next Steps

Once local testing is complete:

1. **Deploy to Vercel** (see DEPLOYMENT.md)
2. **Update .env** to point to real backend:
   ```
   VITE_API_BASE_URL=https://api.v2.meme.com
   ```
3. **Configure Telegram Bot** with deployed URL
4. **Test in Telegram** clients (iOS, Android, Desktop)

## Troubleshooting

### Frontend won't load
```bash
pkill -f "vite"
npm run dev
```

### Mock backend not responding
```bash
pkill -f "mock-server"
npm run mock-server
```

### CORS errors
- Mock server has CORS enabled by default
- If issues persist, check browser console

### API calls failing
- Check .env file points to http://localhost:3001
- Verify mock server is running on port 3001
- Check for port conflicts

## Mock Server Logs

View real-time logs:
```bash
tail -f /tmp/mock-server.log
```

## Performance Testing

Current bundle size: **123.33 KB gzipped**
Target: < 200 KB gzipped ✓

Test on throttled connection:
1. Chrome DevTools > Network
2. Set throttling to "Slow 3G"
3. Reload and verify load time < 5 seconds

