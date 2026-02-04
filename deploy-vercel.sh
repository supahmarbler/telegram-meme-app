#!/bin/bash

echo "🚀 Vercel Deployment Helper"
echo ""
echo "This script will help you deploy to Vercel."
echo ""

# Check if vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI not found"
    echo ""
    echo "Install it with:"
    echo "  npm install -g vercel"
    echo ""
    echo "Or deploy via GitHub:"
    echo "  1. Push to GitHub"
    echo "  2. Import in Vercel dashboard"
    echo "  3. Connect repository"
    exit 1
fi

echo "✓ Vercel CLI found"
echo ""

# Update .env for production
echo "📝 Updating .env for production..."
cat > .env.production << 'ENVEOF'
VITE_API_BASE_URL=https://api.v2.meme.com
VITE_TELEGRAM_BOT_USERNAME=meme_prediction_bot
VITE_APP_NAME=Meme Prediction
ENVEOF

echo "✓ Created .env.production"
echo ""

# Build the project
echo "🔨 Building project..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed"
    exit 1
fi

echo "✓ Build successful"
echo ""

# Deploy
echo "🚀 Deploying to Vercel..."
echo ""
echo "Make sure to set environment variables in Vercel:"
echo "  VITE_API_BASE_URL=https://api.v2.meme.com"
echo "  VITE_TELEGRAM_BOT_USERNAME=your_bot_username"
echo "  VITE_APP_NAME=Meme Prediction"
echo ""

read -p "Press Enter to continue with deployment..."

vercel --prod

echo ""
echo "✓ Deployment complete!"
echo ""
echo "Next steps:"
echo "  1. Copy the deployment URL"
echo "  2. Configure Telegram bot with @BotFather"
echo "  3. Set Web App URL to your deployment"
echo "  4. Test in Telegram"
echo ""
