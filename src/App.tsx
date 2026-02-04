import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { init } from '@telegram-apps/sdk-react';
import { LoadingPage } from './pages/LoadingPage';
import { MarketsPage } from './pages/MarketsPage';
import { MarketDetailPage } from './pages/MarketDetailPage';
import { PositionsPage } from './pages/PositionsPage';
import { ReferralsPage } from './pages/ReferralsPage';
import { useAuthStore } from './store/authStore';
import { ROUTES } from './utils/constants';
import { setDevelopmentMode } from './utils/developmentMode';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    let isTelegramEnvironment = false;

    try {
      // Try to initialize Telegram SDK
      init();
      isTelegramEnvironment = true;
      console.log('✅ Telegram SDK initialized successfully');
    } catch (error: any) {
      // Check if it's a LaunchParamsRetrieveError or any SDK initialization error
      if (
        error?.message?.includes('LaunchParams') ||
        error?.name === 'LaunchParamsRetrieveError' ||
        error?.message?.includes('Telegram') ||
        !window.Telegram?.WebApp
      ) {
        console.warn('⚠️ Not running in Telegram environment, using development mode');
        setDevelopmentMode(true);
      } else {
        console.error('❌ Unexpected error initializing Telegram SDK:', error);
        setDevelopmentMode(true);
      }
    }

    // Also check if we're actually in Telegram environment
    if (!window.Telegram?.WebApp && !isTelegramEnvironment) {
      console.warn('⚠️ Telegram WebApp not detected, using development mode');
      setDevelopmentMode(true);
    }

    setIsInitialized(true);
  }, []);

  // Don't render routes until we've determined if we're in Telegram or not
  if (!isInitialized) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Initializing...
          </h2>
        </div>
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path={ROUTES.LOADING} element={<LoadingPage />} />
          <Route
            path={ROUTES.MARKETS}
            element={isAuthenticated ? <MarketsPage /> : <Navigate to={ROUTES.LOADING} />}
          />
          <Route
            path={ROUTES.MARKET_DETAIL}
            element={isAuthenticated ? <MarketDetailPage /> : <Navigate to={ROUTES.LOADING} />}
          />
          <Route
            path={ROUTES.POSITIONS}
            element={isAuthenticated ? <PositionsPage /> : <Navigate to={ROUTES.LOADING} />}
          />
          <Route
            path={ROUTES.REFERRALS}
            element={isAuthenticated ? <ReferralsPage /> : <Navigate to={ROUTES.LOADING} />}
          />
          <Route path="/" element={<Navigate to={ROUTES.LOADING} />} />
          <Route path="*" element={<Navigate to={ROUTES.LOADING} />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
