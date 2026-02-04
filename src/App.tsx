import { useEffect } from 'react';
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

  useEffect(() => {
    try {
      init();
    } catch (error) {
      console.error('Failed to initialize Telegram SDK:', error);
    }
  }, []);

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
