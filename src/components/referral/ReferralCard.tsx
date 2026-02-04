import { Card } from '../ui/Card';

interface ReferralCardProps {
  referredUsersCount: number;
  rewardPoints: number;
}

export function ReferralCard({ referredUsersCount, rewardPoints }: ReferralCardProps) {
  return (
    <Card>
      <h3 className="text-lg font-bold mb-4">Your Referral Stats</h3>

      <div className="grid grid-cols-2 gap-4">
        <div className="text-center p-4 bg-blue-50 dark:bg-blue-900 rounded-lg">
          <div className="text-3xl font-bold text-blue-600 dark:text-blue-300">
            {referredUsersCount}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Friends Invited
          </div>
        </div>

        <div className="text-center p-4 bg-green-50 dark:bg-green-900 rounded-lg">
          <div className="text-3xl font-bold text-green-600 dark:text-green-300">
            {rewardPoints.toLocaleString()}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Points Earned
          </div>
        </div>
      </div>

      <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900 rounded-lg">
        <p className="text-sm text-yellow-800 dark:text-yellow-200">
          💡 Invite friends to earn more reward points and bonuses!
        </p>
      </div>
    </Card>
  );
}
