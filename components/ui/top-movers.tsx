'use client';

import { useQuery } from '@tanstack/react-query';
import { getCryptoPrices } from '../../services/crypto';
import { cn } from '../../lib/utils';
import { motion } from 'framer-motion';

export default function TopMovers() {
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

  const getData = (id: string) => {
    const d = data?.[id];
    return {
      price: d?.usd || 0,
      change: d?.usd_24h_change || 0,
    };
  };

  const sorted = [...cryptos]
    .map(c => ({ ...c, ...getData(c.id) }))
    .sort((a, b) => b.change - a.change);

  const gainers = sorted.filter(c => c.change >= 0).slice(0, 3);
  const losers = sorted.filter(c => c.change < 0).slice(0, 3);

  const renderItem = (item: any, isGainer: boolean) => (
    <motion.div
      key={item.symbol}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center justify-between glass rounded-xl px-4 py-3"
    >
      <div>
        <div className="font-medium text-white">{item.symbol}</div>
        <div className="text-xs text-white/30">{item.name}</div>
      </div>
      <div className="text-right">
        <div className="text-white">${item.price.toLocaleString()}</div>
        <div className={cn(
          'text-xs font-medium',
          isGainer ? 'text-green-400' : 'text-red-400'
        )}>
          {isGainer ? '+' : ''}{item.change.toFixed(2)}%
        </div>
      </div>
    </motion.div>
  );

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="glass rounded-2xl p-4">
          <div className="text-sm text-white/40 mb-3">🏆 Top Gainers</div>
          {[1, 2, 3].map(i => (
            <div key={i} className="h-14 bg-white/5 rounded-xl animate-pulse mb-2" />
          ))}
        </div>
        <div className="glass rounded-2xl p-4">
          <div className="text-sm text-white/40 mb-3">📉 Top Losers</div>
          {[1, 2, 3].map(i => (
            <div key={i} className="h-14 bg-white/5 rounded-xl animate-pulse mb-2" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="glass rounded-2xl p-4">
        <div className="text-sm text-white/40 mb-3 flex items-center gap-2">
          <span>🏆</span> Top Gainers
        </div>
        {gainers.length > 0 ? gainers.map(g => renderItem(g, true)) : (
          <div className="text-white/20 text-sm text-center py-4">No gainers</div>
        )}
      </div>
      <div className="glass rounded-2xl p-4">
        <div className="text-sm text-white/40 mb-3 flex items-center gap-2">
          <span>📉</span> Top Losers
        </div>
        {losers.length > 0 ? losers.map(l => renderItem(l, false)) : (
          <div className="text-white/20 text-sm text-center py-4">No losers</div>
        )}
      </div>
    </div>
  );
}
