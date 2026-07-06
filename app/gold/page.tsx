'use client';

import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { getGoldPrice } from '../services/gold';
import LivePriceCard from '../components/ui/live-price-card';
import PriceChart from '../components/charts/price-chart';

export default function GoldPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['gold'],
    queryFn: getGoldPrice,
    refetchInterval: 30000,
  });

  return (
    <div className="min-h-screen bg-gradient-primary pt-[88px] px-4 md:px-8 pb-12">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-white">Gold</h1>
          <p className="text-white/40 text-sm mt-1">XAU/USD · Live spot price</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          <LivePriceCard
            title="XAU/USD"
            price={data?.price || 0}
            change={data?.changePercent || 0}
            loading={isLoading}
          />
          <div className="glass rounded-2xl p-5 flex flex-col justify-center">
            <div className="text-sm text-white/40">High</div>
            <div className="text-xl font-bold text-white">${data?.high?.toLocaleString() || '...'}</div>
          </div>
          <div className="glass rounded-2xl p-5 flex flex-col justify-center">
            <div className="text-sm text-white/40">Low</div>
            <div className="text-xl font-bold text-white">${data?.low?.toLocaleString() || '...'}</div>
          </div>
        </div>

        <PriceChart symbol="XAU/USD" />
      </div>
    </div>
  );
}
