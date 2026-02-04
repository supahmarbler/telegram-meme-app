import { useQuery } from '@tanstack/react-query';
import { referralsAPI } from '../../api/endpoints/referrals';
import { useUserStore } from '../../store/userStore';
import { REFRESH_INTERVALS } from '../../utils/constants';

export function useUserBalance() {
  const updateBalance = useUserStore((state) => state.updateBalance);

  return useQuery({
    queryKey: ['userBalance'],
    queryFn: async () => {
      const data = await referralsAPI.getUserBalance();
      updateBalance(data.memescore, data.rewardPoints, data.referredUsersCount);
      return data;
    },
    refetchInterval: REFRESH_INTERVALS.BALANCE,
  });
}
