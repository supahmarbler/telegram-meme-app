import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
  token: string | null;
  refreshToken: string | null;
  userId: number | null;
  expiresAt: number | null;
  isAuthenticated: boolean;
  setAuth: (token: string, refreshToken: string, userId: number, expiresAt?: number) => void;
  logout: () => void;
  isTokenExpired: () => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,
      refreshToken: null,
      userId: null,
      expiresAt: null,
      isAuthenticated: false,

      setAuth: (token, refreshToken, userId, expiresAt) => {
        set({
          token,
          refreshToken,
          userId,
          expiresAt: expiresAt || Date.now() + 24 * 60 * 60 * 1000, // Default 24 hours
          isAuthenticated: true,
        });
      },

      logout: () => {
        set({
          token: null,
          refreshToken: null,
          userId: null,
          expiresAt: null,
          isAuthenticated: false,
        });
      },

      isTokenExpired: () => {
        const { expiresAt } = get();
        if (!expiresAt) return true;
        return Date.now() >= expiresAt;
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);
