'use client';

import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';
import { getForexRates } from '../services/forex';
import { getCryptoPrices } from '../services/crypto';
import { getGoldPrice } from '../services/gold';
import LivePriceCard from '../components/ui/live-price-card';
import MarketStatus from '../components/ui/market-status';
import Heatmap from '../components/ui/heatmap';
import TopMovers from '../components/ui/top-movers';
import { formatNumber } from '../lib/utils';

const GalaxyScene = dynamic(() => import('../components/three/galaxy-scene'), { ssr: false });

export default function HomePage() {
  const router = useRouter();

  const { data: forexData, isLoading: forexLoading } = useQuery({
    queryKey: ['forex'],
    queryFn: getForexRates,
    refetchInterval: 30000,
  });

  const { data: cryptoData, isLoading: cryptoLoading } = useQuery({
    queryKey: ['crypto'],
    queryFn: getCryptoPrices,
    refetchInterval: 30000,
  });

  const { data: goldData, isLoading: goldLoading } = useQuery({
    queryKey: ['gold'],
    queryFn: getGoldPrice,
    refetchInterval: 30000,
  });

  const handleCoinClick = (symbol: string) => {
    const map: Record<string, string> = {
      '$': '/forex',
      '€': '/forex',
      '£': '/forex',
      '¥': '/forex',
      'Rp': '/forex',
      '₿': '/crypto',
      '⟠': '/crypto',
      'Au': '/gold',
    };
    const path = map[symbol] || '/';
    router.push(path);
  };

  return (
    <div className="min-h-screen bg-gradient-primary">
      {/* Hero Section — Fullscreen 3D Galaxy */}
      <div className="relative w-screen h-screen overflow-hidden">
        <GalaxyScene onCoinClick={handleCoinClick} />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#0b0d1a]/90 pointer-events-none" />

        {/* Logo C — Top Center */}
        <div className="absolute top-8 left-1/2 -translate-x-1/2 pointer-events-none">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center shadow-2xl shadow-gold/20">
              <span className="text-[#0b0d1a] text-2xl font-bold">C</span>
            </div>
            <span className="text-2xl font-bold text-gold tracking-tight">CUKIMAI</span>
          </div>
        </div>

        {/* Market Status — Top Right */}
        <div className="absolute top-8 right-8 pointer-events-none">
          <MarketStatus />
        </div>

        {/* Hero Text — Bottom Center */}
        <div className="absolute bottom-24 left-0 right-0 text-center pointer-events-none">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-3xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-b from-white via-white/80 to-white/20 bg-clip-text text-transparent tracking-tight"
          >
            World Financial Galaxy
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-white/40 text-sm md:text-base tracking-[0.2em] uppercase mt-3 font-light"
          >
            Drag to explore · Click any coin
          </motion.p>
        </div>
      </div>

      {/* Below Hero — Market Data Sections */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-16">
        {/* Live Price Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <div className="flex items-center gap-2 text-gold text-xs font-medium tracking-wider uppercase mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse" />
            Live Market
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <LivePriceCard
              title="Forex"
              price={forexData?.usdIdr ? formatNumber(forexData.usdIdr) : '...'}
              change={0.14}
              loading={forexLoading}
              currency="Rp "
            />
            <LivePriceCard
              title="Bitcoin"
              price={cryptoData?.bitcoin?.usd || 0}
              change={cryptoData?.bitcoin?.usd_24h_change || 0}
              loading={cryptoLoading}
            />
            <LivePriceCard
              title="Ethereum"
              price={cryptoData?.ethereum?.usd || 0}
              change={cryptoData?.ethereum?.usd_24h_change || 0}
              loading={cryptoLoading}
            />
            <LivePriceCard
              title="Gold"
              price={goldData?.price || 0}
              change={goldData?.changePercent || 0}
              loading={goldLoading}
            />
          </div>
        </motion.div>

        {/* Global Market Heatmap */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <div className="text-sm text-white/40 font-medium tracking-wider uppercase mb-4">
            Global Market Heatmap
          </div>
          <Heatmap />
        </motion.div>

        {/* Top Movers */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <div className="text-sm text-white/40 font-medium tracking-wider uppercase mb-4">
            Top Movers
          </div>
          <TopMovers />
        </motion.div>
      </div>
    </div>
  );
}
