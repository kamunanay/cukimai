'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { getForexRates } from '../services/forex';
import LivePriceCard from '../components/ui/live-price-card';
import PriceChart from '../components/charts/price-chart';
import CurrencyConverter from '../components/ui/currency-converter';

export default function ForexPage() {
  const [selectedPair, setSelectedPair] = useState<string>('USD/IDR');

  const { data, isLoading } = useQuery({
    queryKey: ['forex'],
    queryFn: getForexRates,
    refetchInterval: 30000,
  });

  const pairs = [
    { label: 'USD/IDR', rate: data?.usdIdr },
    { label: 'USD/EUR', rate: data?.usdEur },
    { label: 'USD/GBP', rate: data?.usdGbp },
    { label: 'USD/JPY', rate: data?.usdJpy },
    { label: 'USD/AUD', rate: data?.usdAud },
    { label: 'USD/CNY', rate: data?.usdCny },
    { label: 'USD/SGD', rate: data?.usdSgd },
    { label: 'USD/MYR', rate: data?.usdMyr },
    { label: 'USD/KRW', rate: data?.usdKrw },
    { label: 'USD/INR', rate: data?.usdInr },
  ];

  const handlePairClick = (label: string) => {
    setSelectedPair(label);
  };

  return (
    <div className="min-h-screen bg-gradient-primary pt-[88px] px-4 md:px-8 pb-12">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-white">Forex</h1>
          <p className="text-white/40 text-sm mt-1">
            Live currency rates · Base USD · Click pair to view chart
          </p>
        </motion.div>

        {/* Price Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 mb-8">
          {pairs.map((pair, i) => (
            <motion.div
              key={pair.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
              onClick={() => handlePairClick(pair.label)}
              className={`cursor-pointer transition-all duration-300 rounded-xl ${
                selectedPair === pair.label
                  ? 'ring-2 ring-gold shadow-gold/20'
                  : 'hover:scale-[1.02]'
              }`}
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

        {/* Chart & Converter */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <PriceChart symbol={selectedPair} />
          </div>
          <CurrencyConverter />
        </div>
      </div>
    </div>
  );
}
