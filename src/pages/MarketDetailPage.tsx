import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useMarket } from '../hooks/api/useMarkets';
import { usePlaceBet } from '../hooks/api/usePlaceBet';
import { useTelegramHaptic } from '../hooks/telegram/useTelegramHaptic';
import { useUserStore } from '../store/userStore';
import { AppLayout } from '../components/layout/AppLayout';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { useUIStore } from '../store/uiStore';

export function MarketDetailPage() {
  const { marketId } = useParams<{ marketId: string }>();
  const navigate = useNavigate();
  const { data: market, isLoading } = useMarket(Number(marketId));
  const placeBetMutation = usePlaceBet();
  const { impactOccurred, notificationOccurred } = useTelegramHaptic();
  const memescore = useUserStore((state) => state.memescore);
  const openModal = useUIStore((state) => state.openModal);
  const closeModal = useUIStore((state) => state.closeModal);

  const [amount, setAmount] = useState('');
  const [selectedOutcome, setSelectedOutcome] = useState<'yes' | 'no' | null>(null);

  if (isLoading) {
    return (
      <AppLayout showTabBar={false}>
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading market...</p>
        </div>
      </AppLayout>
    );
  }

  if (!market) {
    return (
      <AppLayout showTabBar={false}>
        <div className="text-center py-12">
          <p className="text-gray-400">Market not found</p>
          <Button onClick={() => navigate('/markets')} className="mt-4">
            Back to Markets
          </Button>
        </div>
      </AppLayout>
    );
  }

  const handleBetClick = (outcome: 'yes' | 'no') => {
    if (!amount || parseFloat(amount) <= 0) {
      useUIStore.getState().showToast('Please enter a valid amount', 'error');
      return;
    }

    if (parseFloat(amount) > memescore) {
      useUIStore.getState().showToast('Insufficient balance', 'error');
      return;
    }

    setSelectedOutcome(outcome);
    impactOccurred('medium');
    openModal('confirm-bet');
  };

  const handleConfirmBet = () => {
    if (!selectedOutcome) return;

    placeBetMutation.mutate(
      {
        marketId: market.id,
        outcome: selectedOutcome,
        amount: parseFloat(amount),
      },
      {
        onSuccess: () => {
          notificationOccurred('success');
          setAmount('');
          setSelectedOutcome(null);
          closeModal();
        },
        onError: () => {
          notificationOccurred('error');
        },
      }
    );
  };

  const estimatedShares = selectedOutcome && amount
    ? parseFloat(amount) / (selectedOutcome === 'yes' ? market.priceYes : market.priceNo)
    : 0;

  return (
    <AppLayout showTabBar={false}>
      <div className="p-4 pb-8 max-w-2xl mx-auto">
        <Button
          variant="secondary"
          size="sm"
          onClick={() => navigate('/markets')}
          className="mb-4"
        >
          ← Back
        </Button>

        {market.imageUrl && (
          <img
            src={market.imageUrl}
            alt={market.title}
            className="w-full h-64 object-cover rounded-xl mb-4 shadow-xl"
          />
        )}

        <h1 className="text-3xl font-bebas mb-4 text-white tracking-wide leading-tight">{market.title}</h1>

        {market.description && (
          <p className="text-gray-300 mb-6 leading-relaxed">{market.description}</p>
        )}

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-gradient-to-br from-green-900 to-green-800 p-4 rounded-xl shadow-lg border border-green-700">
            <div className="text-sm text-green-300 mb-1 font-bold uppercase">YES</div>
            <div className="text-4xl font-black text-white">
              {(market.priceYes * 100).toFixed(0)}%
            </div>
            <div className="text-xs text-green-400 mt-2 font-semibold">
              {market.volumeYes.toLocaleString()} volume
            </div>
          </div>

          <div className="bg-gradient-to-br from-red-900 to-red-800 p-4 rounded-xl shadow-lg border border-red-700">
            <div className="text-sm text-red-300 mb-1 font-bold uppercase">NO</div>
            <div className="text-4xl font-black text-white">
              {(market.priceNo * 100).toFixed(0)}%
            </div>
            <div className="text-xs text-red-400 mt-2 font-semibold">
              {market.volumeNo.toLocaleString()} volume
            </div>
          </div>
        </div>

        {market.userPosition && (market.userPosition.sharesYes > 0 || market.userPosition.sharesNo > 0) && (
          <div className="bg-gradient-to-br from-blue-900 to-blue-800 p-4 rounded-xl mb-6 shadow-lg border border-blue-700">
            <h3 className="font-black text-white uppercase mb-3">Your Position</h3>
            <div className="space-y-2 text-sm">
              {market.userPosition.sharesYes > 0 && (
                <div className="flex justify-between text-blue-200">
                  <span className="font-semibold">YES Shares:</span>
                  <span className="font-bold text-white">{market.userPosition.sharesYes.toFixed(2)}</span>
                </div>
              )}
              {market.userPosition.sharesNo > 0 && (
                <div className="flex justify-between text-blue-200">
                  <span className="font-semibold">NO Shares:</span>
                  <span className="font-bold text-white">{market.userPosition.sharesNo.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between pt-2 border-t border-blue-700 text-blue-200">
                <span className="font-semibold">Current Value:</span>
                <span className="font-bold text-white">{market.userPosition.currentValue.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-blue-200">
                <span className="font-semibold">P/L:</span>
                <span className={`font-bold ${market.userPosition.profitLoss >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {market.userPosition.profitLoss >= 0 ? '+' : ''}
                  {market.userPosition.profitLoss.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        )}

        <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-4 rounded-xl border border-gray-700 mb-6 shadow-lg">
          <label className="block text-sm font-bold mb-2 text-gray-300 uppercase tracking-wide">
            Bet Amount (Memescore)
          </label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter amount"
            className="w-full px-4 py-3 border-2 border-gray-600 rounded-xl bg-gray-900 text-white font-bold text-lg focus:border-blue-500 focus:outline-none"
            min="1"
            max={memescore}
          />
          <div className="text-xs text-gray-400 mt-2 font-semibold">
            Available: {memescore.toLocaleString()}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Button
            variant="success"
            size="lg"
            onClick={() => handleBetClick('yes')}
            disabled={!amount || placeBetMutation.isPending}
          >
            Bet YES
          </Button>
          <Button
            variant="danger"
            size="lg"
            onClick={() => handleBetClick('no')}
            disabled={!amount || placeBetMutation.isPending}
          >
            Bet NO
          </Button>
        </div>

        <Modal id="confirm-bet" title="Confirm Bet" onClose={() => setSelectedOutcome(null)}>
          <div className="space-y-4">
            <div className="bg-gray-800 p-4 rounded-xl border border-gray-700">
              <div className="flex justify-between mb-3 text-gray-300">
                <span className="font-semibold">Outcome:</span>
                <span className={`font-black text-lg ${selectedOutcome === 'yes' ? 'text-green-400' : 'text-red-400'}`}>
                  {selectedOutcome?.toUpperCase()}
                </span>
              </div>
              <div className="flex justify-between mb-3 text-gray-300">
                <span className="font-semibold">Amount:</span>
                <span className="font-bold text-white">{parseFloat(amount).toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-gray-300">
                <span className="font-semibold">Expected Shares:</span>
                <span className="font-bold text-white">{estimatedShares.toFixed(2)}</span>
              </div>
            </div>

            <div className="flex space-x-3">
              <Button variant="secondary" onClick={closeModal} className="flex-1">
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={handleConfirmBet}
                isLoading={placeBetMutation.isPending}
                className="flex-1"
              >
                Confirm
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </AppLayout>
  );
}
