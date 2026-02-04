# Development Mode Guide

## Overview

The Telegram Mini App now gracefully handles running outside of Telegram by automatically detecting the environment and falling back to development mode when needed.

## How It Works

### Automatic Detection

When the app starts, it attempts to initialize the Telegram SDK. If initialization fails (which happens when running outside Telegram), the app:

1. ✅ Catches the `LaunchParamsRetrieveError`
2. ✅ Sets a development mode flag
3. ✅ Uses mock Telegram user data
4. ✅ Continues functioning normally

### Development Mode Features

When running in development mode (outside Telegram):

- **Mock User Data**
  - User ID: 123456789
  - Username: dev_user
  - Name: Dev User
  
- **Mock Behaviors**
  - Haptic feedback is silently skipped
  - Share links open in new browser tab instead of Telegram
  - All API calls work normally with mock backend
  
- **Visual Indicators**
  - Console logs show "🔧 Running in development mode"
  - Console logs are cleaner (fewer SDK errors)

## Usage

### Testing Locally

Simply run the app in your browser:

```bash
npm run dev
# Open http://localhost:5173
```

The app will automatically detect it's not in Telegram and enable development mode.

### Testing in Telegram

When you open the app in Telegram:
- Development mode is NOT activated
- Real Telegram user data is used
- Native Telegram features work (haptics, sharing, etc.)

## Implementation Details

### Key Files

1. **src/utils/developmentMode.ts**
   - Manages development mode state
   - Provides mock user data
   - Exports helper functions

2. **src/App.tsx**
   - Initializes Telegram SDK with try/catch
   - Detects environment on startup
   - Sets development mode flag

3. **src/hooks/telegram/***
   - All Telegram hooks check development mode
   - Provide fallback behaviors
   - Handle errors gracefully

### Code Example

```typescript
import { getDevelopmentMode, MOCK_TELEGRAM_USER } from './utils/developmentMode';

// Check if in development mode
if (getDevelopmentMode()) {
  // Use mock data
  setUser(MOCK_TELEGRAM_USER);
} else {
  // Use real Telegram data
  const data = initData.raw();
  // ...
}
```

## Benefits

### For Developers

✅ **No More Crashes**: App works in any browser
✅ **Faster Testing**: No need to deploy to test features
✅ **Better DX**: Clear console logs, no SDK errors
✅ **Local Development**: Full app functionality without Telegram

### For Users

✅ **No Broken UI**: Graceful fallback if SDK fails
✅ **Better Performance**: Cleaner error handling
✅ **Consistent Experience**: Same UI in dev and production

## Console Messages

When running in development mode, you'll see:

```
⚠️ Not running in Telegram environment, using development mode
🔧 Running in development mode (outside Telegram)
📱 Using mock Telegram user for development
🔗 Development mode: Opening share URL in new tab
```

When running in Telegram:

```
✅ Telegram SDK initialized successfully
```

## Troubleshooting

### App Still Crashes

If the app crashes in the browser:
1. Clear browser cache
2. Check browser console for errors
3. Restart dev server: `pkill -f vite && npm run dev`

### Development Mode Not Activating

If you're in Telegram but development mode activates:
1. Check Telegram WebApp is properly configured
2. Verify initData is being passed
3. Check browser console for initialization errors

### Features Not Working

If features don't work in development mode:
1. Ensure mock backend is running: `npm run mock-server`
2. Check `.env` points to `http://localhost:3001`
3. Verify authentication completes successfully

## Testing Checklist

- [ ] App loads in regular browser without errors
- [ ] Console shows development mode message
- [ ] Can browse markets
- [ ] Can place bets
- [ ] Can view positions
- [ ] Can open referrals page
- [ ] Share button opens in new tab (instead of crashing)
- [ ] No haptic feedback errors in console
- [ ] All navigation works

## Production Deployment

Development mode only activates when:
- Telegram SDK fails to initialize, OR
- `window.Telegram.WebApp` is not available

In production (inside Telegram):
- Development mode is OFF
- Real Telegram features are used
- Mock data is NOT used

The same codebase works in both environments! 🎉

