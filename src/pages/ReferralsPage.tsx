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
        <h1 className="text-3xl font-bebas mb-6 text-white tracking-wider">REFERRALS</h1>

        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-400">Loading stats...</p>
          </div>
        ) : (
          <div className="space-y-6">
            <ReferralCard
              referredUsersCount={referredUsersCount}
              rewardPoints={rewardPoints}
            />

            {userId && <ShareButton userId={userId} />}

            <div className="bg-gradient-to-br from-blue-900 to-blue-800 p-4 rounded-xl border border-blue-700 shadow-lg">
              <h3 className="font-black mb-3 text-white uppercase tracking-wide">How it works</h3>
              <ul className="space-y-3 text-sm text-blue-200">
                <li className="flex items-start">
                  <span className="mr-2 text-xl">1️⃣</span>
                  <span className="font-semibold">Share your unique referral link with friends</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-xl">2️⃣</span>
                  <span className="font-semibold">When they sign up, you both get bonus points</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-xl">3️⃣</span>
                  <span className="font-semibold">Earn extra rewards for every friend who joins</span>
                </li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
