import { AppLayout } from '../components/layout/AppLayout';
import { ReferralCard } from '../components/referral/ReferralCard';
import { ShareButton } from '../components/referral/ShareButton';
import { useUserStore } from '../store/userStore';
import { useAuthStore } from '../store/authStore';
import { useUserBalance } from '../hooks/api/useUserBalance';

export function ReferralsPage() {
  const userId = useAuthStore((state) => state.userId);
  const { referredUsersCount, rewardPoints } = useUserStore();
  const { isLoading } = useUserBalance();

  return (
    <AppLayout>
      <div className="p-4 pb-20">
        <h1 className="text-2xl font-bold mb-6">Referrals</h1>

        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">Loading stats...</p>
          </div>
        ) : (
          <div className="space-y-6">
            <ReferralCard
              referredUsersCount={referredUsersCount}
              rewardPoints={rewardPoints}
            />

            {userId && <ShareButton userId={userId} />}

            <div className="bg-blue-50 dark:bg-blue-900 p-4 rounded-lg">
              <h3 className="font-bold mb-2">How it works</h3>
              <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                <li className="flex items-start">
                  <span className="mr-2">1️⃣</span>
                  <span>Share your unique referral link with friends</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">2️⃣</span>
                  <span>When they sign up, you both get bonus points</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">3️⃣</span>
                  <span>Earn extra rewards for every friend who joins</span>
                </li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
