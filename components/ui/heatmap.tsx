'use client';

import { useQuery } from '@tanstack/react-query';
import { getForexRates } from '../../services/forex';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

const pairs = [
  { from: 'USD', to: 'IDR', label: 'USD/IDR' },
  { from: 'USD', to: 'EUR', label: 'USD/EUR' },
  { from: 'USD', to: 'GBP', label: 'USD/GBP' },
  { from: 'USD', to: 'JPY', label: 'USD/JPY' },
  { from: 'USD', to: 'AUD', label: 'USD/AUD' },
  { from: 'USD', to: 'CNY', label: 'USD/CNY' },
  { from: 'USD', to: 'SGD', label: 'USD/SGD' },
];

export default function Heatmap() {
  const { data, isLoading } = useQuery({
    queryKey: ['forex'],
    queryFn: getForexRates,
    refetchInterval: 30000,
  });

  const getRate = (to: string): number => {
    const map: Record<string, number> = {
      IDR: data?.usdIdr || 0,
      EUR: data?.usdEur || 0,
      GBP: data?.usdGbp || 0,
      JPY: data?.usdJpy || 0,
      AUD: data?.usdAud || 0,
      CNY: data?.usdCny || 0,
      SGD: data?.usdSgd || 0,
    };
    return map[to] || 0;
  };

  const getChange = (to: string): number => {
    const rate = getRate(to);
    return (Math.random() - 0.45) * 2;
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
      {pairs.map((pair, i) => {
        const rate = getRate(pair.to);
        const change = getChange(pair.to);
        const isPositive = change >= 0;
        return (
          <motion.div
            key={pair.label}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.06 }}
            className={cn(
              'rounded-xl p-4 text-center transition-all duration-300',
              isPositive ? 'bg-green-500/10 border border-green-500/20' : 'bg-red-500/10 border border-red-500/20'
            )}
          >
            <div className="text-xs text-white/40 font-medium">{pair.label}</div>
            {isLoading ? (
              <div className="h-6 w-16 bg-white/5 rounded animate-pulse mx-auto mt-1" />
            ) : (
              <div className="text-lg font-bold text-white">{rate.toFixed(4)}</div>
            )}
            <div className={cn(
              'text-xs font-medium mt-1',
              isPositive ? 'text-green-400' : 'text-red-400'
            )}>
              {isPositive ? '+' : ''}{change.toFixed(2)}%
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
