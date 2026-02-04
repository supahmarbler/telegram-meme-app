import { create } from 'zustand';

interface UserState {
  memescore: number;
  rewardPoints: number;
  referredUsersCount: number;
  updateBalance: (memescore: number, rewardPoints: number, referredUsersCount: number) => void;
  decrementMemescore: (amount: number) => void;
  resetUser: () => void;
}

export const useUserStore = create<UserState>((set) => ({
  memescore: 0,
  rewardPoints: 0,
  referredUsersCount: 0,

  updateBalance: (memescore, rewardPoints, referredUsersCount) => {
    set({ memescore, rewardPoints, referredUsersCount });
  },

  decrementMemescore: (amount) => {
    set((state) => ({
      memescore: Math.max(0, state.memescore - amount),
    }));
  },

  resetUser: () => {
    set({
      memescore: 0,
      rewardPoints: 0,
      referredUsersCount: 0,
    });
  },
}));
