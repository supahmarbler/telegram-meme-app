# Quick Start Guide

## 1. Navigate to Project

```bash
cd /Users/johanunger/telegram-meme-app
```

## 2. Install Dependencies (if not already done)

```bash
npm install
```

## 3. Configure Environment

The `.env` file is already created with:
```
VITE_API_BASE_URL=https://api.v2.meme.com
VITE_TELEGRAM_BOT_USERNAME=meme_prediction_bot
VITE_APP_NAME=Meme Prediction
```

Update these values if needed for your specific setup.

## 4. Start Development Server

```bash
npm run dev
```

The app will start at `http://localhost:5173`

## 5. Test in Browser

Since Telegram SDK won't work outside of Telegram, the app includes development mode fallbacks:

- **Mock User**: ID `123456789`, username `dev_user`
- **No Telegram Features**: Haptic feedback, sharing will be mocked
- **API Calls**: Will hit real backend (ensure backend is running)

## 6. Build for Production

```bash
npm run build
```

Output will be in `dist/` folder.

## 7. Preview Production Build

```bash
npm run preview
```

## Common Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linter
npm run lint

# Type check
npx tsc --noEmit
```

## Project Structure at a Glance

```
src/
├── pages/              # 5 main pages
│   ├── LoadingPage.tsx        # Auth flow
│   ├── MarketsPage.tsx        # Main markets list
│   ├── MarketDetailPage.tsx   # Single market + betting
│   ├── PositionsPage.tsx      # User's active bets
│   └── ReferralsPage.tsx      # Referral dashboard
├── components/         # Reusable components
├── hooks/             # Custom hooks
├── api/               # API layer
├── store/             # Zustand stores
└── utils/             # Helpers
```

## Testing Without Backend

If backend is not ready, you can mock API responses by modifying `src/api/client.ts` to return mock data.

## Next Steps

1. Ensure backend `/authentication/telegram_verify` endpoint is implemented
2. Deploy to Vercel (see DEPLOYMENT.md)
3. Configure Telegram bot
4. Test in Telegram clients

## Troubleshooting

### Port already in use
```bash
# Kill process on port 5173
lsof -ti:5173 | xargs kill -9
```

### Build errors
```bash
# Clean node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### TypeScript errors
```bash
# Check types
npx tsc --noEmit
```

## Support

- Check `README.md` for project overview
- Check `DEPLOYMENT.md` for deployment instructions
- Check `IMPLEMENTATION_SUMMARY.md` for technical details

