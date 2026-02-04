import { Card } from '../ui/Card';

interface ReferralCardProps {
  referredUsersCount: number;
  rewardPoints: number;
}

export function ReferralCard({ referredUsersCount, rewardPoints }: ReferralCardProps) {
  return (
    <Card>
      <h3 className="text-lg font-black mb-4 text-white uppercase tracking-wide">Your Referral Stats</h3>

      <div className="grid grid-cols-2 gap-4">
        <div className="text-center p-4 bg-gradient-to-br from-blue-900 to-blue-800 rounded-xl border border-blue-700">
          <div className="text-4xl font-black text-white">
            {referredUsersCount}
          </div>
          <div className="text-sm text-blue-300 mt-2 font-bold uppercase tracking-wide">
            Friends Invited
          </div>
        </div>

        <div className="text-center p-4 bg-gradient-to-br from-green-900 to-green-800 rounded-xl border border-green-700">
          <div className="text-4xl font-black text-white">
            {rewardPoints.toLocaleString()}
          </div>
          <div className="text-sm text-green-300 mt-2 font-bold uppercase tracking-wide">
            Points Earned
          </div>
        </div>
      </div>

      <div className="mt-4 p-3 bg-gradient-to-r from-yellow-900 to-orange-900 rounded-xl border border-yellow-700">
        <p className="text-sm text-yellow-200 font-semibold">
          💡 Invite friends to earn more reward points and bonuses!
        </p>
      </div>
    </Card>
  );
}
