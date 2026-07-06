'use client';

import dynamic from 'next/dynamic';

const PremiumCoin3D = dynamic(
  () => import('../three/premium-coin').then(m => m.PremiumCoin3D),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full flex items-center justify-center bg-[#0a0a1a] rounded-2xl border border-white/5">
        <div className="text-gold/50 animate-pulse text-sm">Loading 3D Coin...</div>
      </div>
    ),
  }
);

interface CoinDisplayProps {
  symbol: string;
  label: string;
  color?: string;
  isCrypto?: boolean;
  isGold?: boolean;
  className?: string;
  autoRotate?: boolean;
}

export default function CoinDisplay({
  symbol,
  label,
  color = '#f5c842',
  isCrypto = false,
  isGold = false,
  className = '',
  autoRotate = true,
}: CoinDisplayProps) {
  return (
    <div
      className={`w-full max-w-[450px] mx-auto aspect-square rounded-2xl overflow-hidden bg-gradient-to-b from-[#0a0a1a] to-[#1a1a2e] shadow-2xl shadow-gold/10 border border-white/5 ${className}`}
    >
      <PremiumCoin3D
        symbol={symbol}
        label={label}
        color={color}
        isCrypto={isCrypto}
        isGold={isGold}
        autoRotate={autoRotate}
      />
    </div>
  );
}
