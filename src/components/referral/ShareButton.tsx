import { useTelegramShare } from '../../hooks/telegram/useTelegramShare';
import { useTelegramHaptic } from '../../hooks/telegram/useTelegramHaptic';
import { generateReferralLink } from '../../utils/telegram';
import { useUIStore } from '../../store/uiStore';
import { Button } from '../ui/Button';

interface ShareButtonProps {
  userId: number;
}

export function ShareButton({ userId }: ShareButtonProps) {
  const { shareReferral } = useTelegramShare();
  const { impactOccurred } = useTelegramHaptic();
  const showToast = useUIStore((state) => state.showToast);

  const handleShare = () => {
    impactOccurred('medium');
    shareReferral(userId);
  };

  const handleCopy = async () => {
    const link = generateReferralLink(userId);
    try {
      await navigator.clipboard.writeText(link);
      impactOccurred('light');
      showToast('Referral link copied!', 'success');
    } catch (error) {
      showToast('Failed to copy link', 'error');
    }
  };

  return (
    <div className="space-y-3">
      <Button
        variant="primary"
        size="lg"
        onClick={handleShare}
        className="w-full"
      >
        📤 Share Referral Link
      </Button>
      <Button
        variant="secondary"
        size="md"
        onClick={handleCopy}
        className="w-full"
      >
        📋 Copy Link
      </Button>
    </div>
  );
}
