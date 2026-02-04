import { useMutation, useQueryClient } from '@tanstack/react-query';
import { predictionsAPI } from '../../api/endpoints/predictions';
import type { PlaceBetRequest } from '../../api/types';
import { useUserStore } from '../../store/userStore';
import { useUIStore } from '../../store/uiStore';

export function usePlaceBet() {
  const queryClient = useQueryClient();
  const decrementMemescore = useUserStore((state) => state.decrementMemescore);
  const showToast = useUIStore((state) => state.showToast);

  return useMutation({
    mutationFn: (data: PlaceBetRequest) => predictionsAPI.placeBet(data),
    onMutate: async (variables) => {
      // Optimistically update balance
      decrementMemescore(variables.amount);
    },
    onSuccess: (data, variables) => {
      showToast(
        `Successfully bought ${data.shares.toFixed(2)} ${variables.outcome.toUpperCase()} shares!`,
        'success'
      );

      // Invalidate markets to refresh data
      queryClient.invalidateQueries({ queryKey: ['markets'] });
      queryClient.invalidateQueries({ queryKey: ['market', variables.marketId] });
      queryClient.invalidateQueries({ queryKey: ['userBalance'] });
    },
    onError: (error: any, variables) => {
      console.error('Place bet failed:', error);

      // Revert optimistic update
      useUserStore.getState().updateBalance(
        useUserStore.getState().memescore + variables.amount,
        useUserStore.getState().rewardPoints,
        useUserStore.getState().referredUsersCount
      );

      showToast(
        error.response?.data?.message || 'Failed to place bet. Please try again.',
        'error'
      );
    },
  });
}
