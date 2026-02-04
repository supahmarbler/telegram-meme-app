import { useNavigate } from 'react-router-dom';
import type { PredictionMarket } from '../../api/types';

interface MarketCardProps {
  market: PredictionMarket;
}

export function MarketCard({ market }: MarketCardProps) {
  const navigate = useNavigate();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleDateString('en-US', { month: 'short' });
    return `${day} ${month}`;
  };

  const formatVolume = (volume: number) => {
    if (volume >= 1000000) {
      return `${(volume / 1000000).toFixed(0)}M`;
    } else if (volume >= 1000) {
      return `${(volume / 1000).toFixed(0)}K`;
    }
    return volume.toString();
  };

  const priceYesPercent = Math.round(market.priceYes * 100);
  const priceNoPercent = Math.round(market.priceNo * 100);

  return (
    <div
      onClick={() => navigate(`/markets/${market.id}`)}
      className="rounded-2xl p-1.5 cursor-pointer hover:scale-[1.01] transition-transform shadow-xl"
      style={{
        background: 'linear-gradient(360deg, #212936 0%, #4E596C 100%)',
        boxShadow: '0px 4px 44px 0px rgba(255, 255, 255, 0.07), 0px 4px 12px 0px rgba(0, 0, 0, 0.72)'
      }}
    >
      {/* Inner card body */}
      <div
        className="bg-[#191f29] rounded-xl p-3.5"
        style={{
          border: '1px solid rgba(136, 136, 136, 0.3)'
        }}
      >
        {/* Market Image */}
        {market.imageUrl && (
          <div className="mb-3">
            <img
              src={market.imageUrl}
              alt={market.title}
              className="w-full h-40 object-cover rounded-lg"
            />
          </div>
        )}

        {/* Market Title */}
        <h3 className="text-white font-bebas text-2xl mb-3 leading-tight tracking-wide">
          {market.title}
        </h3>

        {/* Progress Bar with Percentages */}
        <div className="mb-3">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-white font-archivo font-normal text-xs">{priceYesPercent}%</span>

            {/* Progress Bar */}
            <div
              className="relative flex-1 rounded-full overflow-hidden"
              style={{
                height: '12px',
                border: '0.7px solid rgba(255, 255, 255, 0.3)'
              }}
            >
              <div
                className="absolute top-0 left-0 h-full transition-all duration-300"
                style={{
                  width: `${priceYesPercent}%`,
                  background: 'linear-gradient(270deg, #FFFAC0 4.33%, #AED8FF 24.52%, #71BAFF 62.02%)',
                  boxShadow: 'inset 0 0 4px rgba(0, 0, 0, 0.5)',
                  borderTopLeftRadius: '999px',
                  borderBottomLeftRadius: '999px'
                }}
              />
              <div
                className="absolute top-0 right-0 h-full transition-all duration-300"
                style={{
                  width: `${priceNoPercent}%`,
                  background: 'linear-gradient(90deg, #8398FF 24.52%, #4023C3 62.02%)',
                  boxShadow: 'inset 0 0 4px rgba(0, 0, 0, 0.5)',
                  borderTopRightRadius: '999px',
                  borderBottomRightRadius: '999px'
                }}
              />
            </div>

            <span className="text-white font-archivo font-normal text-xs">{priceNoPercent}%</span>
          </div>
        </div>

        {/* Option Buttons */}
        <div className="grid grid-cols-2 gap-2 mb-3">
          <div
            className="rounded-lg px-3 flex items-center justify-center shadow-md h-[38px]"
            style={{ background: '#71BAFF8A', border: 'none' }}
          >
            <span
              className="text-white font-jersey text-lg tracking-wider uppercase"
              style={{ transform: 'translateY(1px)' }}
            >
              {market.labelYes}
            </span>
          </div>
          <div
            className="rounded-lg px-3 flex items-center justify-center shadow-md h-[38px]"
            style={{ background: '#234BC29E', border: '2.16px solid #C8DBFF52' }}
          >
            <span className="text-white font-jersey text-lg tracking-wider uppercase">
              {market.labelNo}
            </span>
          </div>
        </div>

        {/* Bottom Info */}
        <div className="flex items-center justify-between text-gray-400 text-xs font-archivo">
          <div className="flex items-center space-x-2">
            {/* Trading Count */}
            <span className="font-semibold">
              +{market.volumeYes > 0 ? formatVolume(market.volumeYes + market.volumeNo) : '0'}
            </span>
          </div>

          <div className="flex items-center space-x-2">
            {/* Volume */}
            <span className="font-semibold">
              {formatVolume(market.totalLiquidity)}
            </span>

            {/* Date */}
            <div className="flex items-center space-x-1">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" strokeWidth="2" />
                <path strokeLinecap="round" strokeWidth="2" d="M12 6v6l4 2" />
              </svg>
              <span>{formatDate(market.endDate)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
