'use client';

import { cn } from '../../lib/utils';
import { motion } from 'framer-motion';

interface LivePriceCardProps {
  title: string;
  price: number | string;
  change: number;
  loading?: boolean;
  className?: string;
  currency?: string;
}

export default function LivePriceCard({
  title,
  price,
  change,
  loading = false,
  className,
  currency = '$',
}: LivePriceCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -4 }}
      transition={{ duration: 0.3 }}
      className={cn(
        'glass rounded-2xl p-5 transition-all duration-300 cursor-pointer',
        'hover:border-white/10 hover:bg-white/6',
        className
      )}
    >
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-white/60">{title}</span>
        <span className={cn(
          'text-xs font-medium px-2 py-1 rounded-full',
          change >= 0 ? 'text-green-400 bg-green-400/10' : 'text-red-400 bg-red-400/10'
        )}>
          {change >= 0 ? '+' : ''}{change.toFixed(2)}%
        </span>
      </div>
      <div className="mt-2">
        {loading ? (
          <div className="h-8 w-24 bg-white/5 rounded animate-pulse" />
        ) : (
          <span className="text-2xl font-bold text-white">
            {currency}{typeof price === 'number' ? price.toLocaleString() : price}
          </span>
        )}
      </div>
    </motion.div>
  );
}
