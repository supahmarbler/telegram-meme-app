# Deployment Guide

## Prerequisites

- Vercel account (free tier works)
- Telegram Bot Token from [@BotFather](https://t.me/BotFather)
- Backend API endpoint (`https://api.v2.meme.com`)

## Step 1: Deploy to Vercel

### Option A: GitHub Integration (Recommended)

1. Push your code to GitHub:
```bash
git remote add origin <your-github-repo-url>
git push -u origin main
```

2. Go to [Vercel](https://vercel.com) and click "New Project"

3. Import your GitHub repository

4. Configure the project:
   - **Framework Preset**: Vite
   - **Root Directory**: `./`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

5. Add environment variables:
   - `VITE_API_BASE_URL` = `https://api.v2.meme.com`
   - `VITE_TELEGRAM_BOT_USERNAME` = `your_bot_username`
   - `VITE_APP_NAME` = `Meme Prediction`

6. Click "Deploy"

### Option B: Vercel CLI

```bash
npm install -g vercel
vercel login
vercel --prod
```

Follow the prompts and set environment variables when asked.

## Step 2: Configure Telegram Bot

1. Open [@BotFather](https://t.me/BotFather) on Telegram

2. Create a new bot or use existing:
```
/newbot
```

3. Set the Web App URL:
```
/setmenubutton
```
- Select your bot
- Click "Configure Menu Button"
- URL: `https://your-app.vercel.app` (from Vercel deployment)

4. Test the bot:
- Open your bot in Telegram
- Click the menu button
- The app should load

## Step 3: Test Referral Links

Referral links format: `https://t.me/YOUR_BOT_USERNAME/app?startapp=ref_123456`

Test:
1. Generate a referral link from the app
2. Share it with another Telegram account
3. Click the link and verify the referral is tracked

## Step 4: Backend Integration

Ensure your backend has implemented:

### Required Endpoint (New):
```
POST /authentication/telegram_verify
Request: {
  telegramUserId: number,
  telegramUsername?: string,
  initData: string,
  referredByUserId?: number
}
Response: {
  accessToken: string,
  refreshToken: string,
  userId: number,
  isNewUser: boolean
}
```

### Existing Endpoints:
- `GET /prediction_markets/get_markets` - List markets
- `POST /prediction_markets/buy` - Place bet
- `GET /farm/user_balance` - User balance + referral stats

## Step 5: Domain Setup (Optional)

1. In Vercel project settings, go to "Domains"
2. Add your custom domain
3. Update DNS records as instructed
4. Update Telegram bot Web App URL to your custom domain

## Monitoring

After deployment:

1. **Check Vercel Logs**:
   - Go to your project in Vercel
   - Click "Logs" to see real-time activity

2. **Monitor API Calls**:
   - Ensure JWT tokens are working
   - Check for 401 errors
   - Verify referral tracking

3. **Test on Multiple Devices**:
   - iOS Telegram client
   - Android Telegram client
   - Telegram Web
   - Desktop Telegram

## Troubleshooting

### App doesn't load in Telegram
- Check Web App URL in BotFather
- Ensure HTTPS is enabled
- Verify the URL is correct

### Authentication fails
- Check backend `/authentication/telegram_verify` endpoint
- Verify initData signature validation
- Check JWT token generation

### Referrals not tracked
- Verify `startapp` parameter parsing
- Check backend referral tracking logic
- Test with different Telegram accounts

### Build fails
- Check environment variables in Vercel
- Ensure all dependencies are installed
- Review build logs in Vercel

## Performance Optimization

Current bundle size: ~384KB (123KB gzipped)

To optimize further:
1. Enable code splitting in Vite
2. Lazy load pages
3. Optimize images
4. Use Vercel Edge Functions for serverless API

## Security Checklist

- [ ] Environment variables are set in Vercel (not in code)
- [ ] Backend validates Telegram initData signature
- [ ] JWT tokens have expiration
- [ ] API endpoints require authentication
- [ ] HTTPS is enabled on all endpoints

## Next Steps

Phase 2 features to implement:
- Sell shares / withdraw positions
- Claim rewards from closed markets
- Leaderboards
- Push notifications
- Group features
- Charts and analytics

