# Telegram Meme Prediction App

A Telegram mini app for meme predictions with viral referral system.

## Tech Stack

- React 18 + TypeScript
- Vite
- TailwindCSS
- Zustand (State Management)
- TanStack Query (Data Fetching)
- @telegram-apps/sdk-react (Telegram Integration)
- React Router (Navigation)

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

### Build

```bash
npm run build
```

## Environment Variables

Create a `.env` file:

```bash
VITE_API_BASE_URL=https://api.v2.meme.com
VITE_TELEGRAM_BOT_USERNAME=meme_prediction_bot
VITE_APP_NAME=Meme Prediction
```

## Features

- Telegram Authentication with referral tracking
- View Active Prediction Markets
- Place YES/NO Bets
- View Your Positions
- Referral System with sharing
- Balance Header with auto-refresh

## Deployment

Deploy to Vercel for best results.
