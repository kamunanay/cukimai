'use client';

import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { getForexRates } from '../services/forex';
import LivePriceCard from '../components/ui/live-price-card';
import PriceChart from '../components/charts/price-chart';
import CurrencyConverter from '../components/ui/currency-converter';

export default function ForexPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['forex'],
    queryFn: getForexRates,
    refetchInterval: 30000,
  });

  const pairs = [
    { from: 'USD', to: 'IDR', rate: data?.usdIdr, label: 'USD/IDR' },
    { from: 'USD', to: 'EUR', rate: data?.usdEur, label: 'USD/EUR' },
    { from: 'USD', to: 'GBP', rate: data?.usdGbp, label: 'USD/GBP' },
    { from: 'USD', to: 'JPY', rate: data?.usdJpy, label: 'USD/JPY' },
    { from: 'USD', to: 'AUD', rate: data?.usdAud, label: 'USD/AUD' },
    { from: 'USD', to: 'CNY', rate: data?.usdCny, label: 'USD/CNY' },
    { from: 'USD', to: 'SGD', rate: data?.usdSgd, label: 'USD/SGD' },
    { from: 'USD', to: 'MYR', rate: data?.usdMyr, label: 'USD/MYR' },
    { from: 'USD', to: 'KRW', rate: data?.usdKrw, label: 'USD/KRW' },
    { from: 'USD', to: 'INR', rate: data?.usdInr, label: 'USD/INR' },
  ];

  return (
    <div className="min-h-screen bg-gradient-primary pt-[88px] px-4 md:px-8 pb-12">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-white">Forex</h1>
          <p className="text-white/40 text-sm mt-1">Live currency rates · Base USD</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-8">
          {pairs.map((pair, i) => (
            <motion.div
              key={pair.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
            >
              <LivePriceCard
                title={pair.label}
                price={pair.rate || 0}
                change={0.1}
                loading={isLoading}
                currency=""
              />
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <PriceChart symbol="USD/IDR" />
          <CurrencyConverter />
        </div>
      </div>
    </div>
  );
}
