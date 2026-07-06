'use client';

import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { getCryptoPrices } from '../../services/crypto';
import LivePriceCard from '../../components/ui/live-price-card';
import PriceChart from '../../components/charts/price-chart';

export default function CryptoPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['crypto'],
    queryFn: getCryptoPrices,
    refetchInterval: 30000,
  });

  const cryptos = [
    { id: 'bitcoin', symbol: 'BTC', name: 'Bitcoin' },
    { id: 'ethereum', symbol: 'ETH', name: 'Ethereum' },
    { id: 'solana', symbol: 'SOL', name: 'Solana' },
    { id: 'ripple', symbol: 'XRP', name: 'Ripple' },
    { id: 'bnb', symbol: 'BNB', name: 'BNB' },
  ];

  return (
    <div className="min-h-screen bg-gradient-primary pt-[88px] px-4 md:px-8 pb-12">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-white">Cryptocurrency</h1>
          <p className="text-white/40 text-sm mt-1">Live prices · 24h change</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {cryptos.map((crypto, i) => {
            const price = data?.[crypto.id]?.usd;
            const change = data?.[crypto.id]?.usd_24h_change;
            return (
              <motion.div
                key={crypto.symbol}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
              >
                <LivePriceCard
                  title={crypto.symbol}
                  price={price || 0}
                  change={change || 0}
                  loading={isLoading}
                />
              </motion.div>
            );
          })}
        </div>

        <PriceChart symbol="BTC/USD" />
      </div>
    </div>
  );
}
