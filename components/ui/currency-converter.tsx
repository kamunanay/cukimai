'use client';

import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getForexRates } from '../../services/forex';
import { getCryptoPrices } from '../../services/crypto';
import { motion } from 'framer-motion';

const fiatCurrencies = ['USD', 'IDR', 'EUR', 'GBP', 'JPY', 'AUD', 'CNY', 'SGD', 'MYR', 'KRW', 'INR'];
const cryptoCurrencies = ['BTC', 'ETH', 'SOL', 'XRP', 'BNB'];
const allCurrencies = [...cryptoCurrencies, ...fiatCurrencies];

export default function CurrencyConverter() {
  const [from, setFrom] = useState('BTC');
  const [to, setTo] = useState('USD');
  const [amount, setAmount] = useState<number | string>(1);
  const [result, setResult] = useState<number>(0);
  const [isReversed, setIsReversed] = useState(false);

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

  const isLoading = forexLoading || cryptoLoading;

  const getRate = (currency: string): number => {
    // Crypto
    if (currency === 'BTC') return cryptoData?.bitcoin?.usd || 67812.45;
    if (currency === 'ETH') return cryptoData?.ethereum?.usd || 3456.78;
    if (currency === 'SOL') return cryptoData?.solana?.usd || 187.65;
    if (currency === 'XRP') return cryptoData?.ripple?.usd || 0.6123;
    if (currency === 'BNB') return cryptoData?.bnb?.usd || 598.72;

    // Fiat (semua dalam USD)
    const rates: Record<string, number> = {
      USD: 1,
      IDR: forexData?.usdIdr || 16322.45,
      EUR: forexData?.usdEur || 0.92,
      GBP: forexData?.usdGbp || 0.78,
      JPY: forexData?.usdJpy || 154.50,
      AUD: forexData?.usdAud || 1.50,
      CNY: forexData?.usdCny || 7.20,
      SGD: forexData?.usdSgd || 1.35,
      MYR: forexData?.usdMyr || 4.70,
      KRW: forexData?.usdKrw || 1380.00,
      INR: forexData?.usdInr || 83.50,
    };
    return rates[currency] || 1;
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (val === '' || /^\d*\.?\d*$/.test(val)) setAmount(val);
  };

  const handleSwap = () => {
    const temp = from;
    setFrom(to);
    setTo(temp);
    setIsReversed(!isReversed);
  };

  useEffect(() => {
    if (amount !== '' && !isNaN(Number(amount))) {
      const fromRate = getRate(from);
      const toRate = getRate(to);
      const converted = (Number(amount) * fromRate) / toRate;
      setResult(converted);
    }
  }, [amount, from, to, forexData, cryptoData]);

  const getCurrencyIcon = (currency: string): string => {
    const icons: Record<string, string> = {
      BTC: '₿',
      ETH: '⟠',
      SOL: '◎',
      XRP: '✕',
      BNB: '◆',
      USD: '$',
      EUR: '€',
      GBP: '£',
      JPY: '¥',
      IDR: 'Rp',
      AUD: 'A$',
      CNY: '¥',
      SGD: 'S$',
      MYR: 'RM',
      KRW: '₩',
      INR: '₹',
    };
    return icons[currency] || currency;
  };

  return (
    <div className="glass rounded-2xl p-6 md:p-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center shadow-lg shadow-gold/20">
          <span className="text-[#0b0d1a] font-bold text-lg">⟳</span>
        </div>
        <div>
          <h3 className="text-xl font-semibold text-gold">Currency Converter</h3>
          <p className="text-xs text-white/30 mt-0.5">Real-time · Includes Crypto</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="text-sm text-white/40 block mb-2 font-medium">From</label>
          <div className="relative">
            <select
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 pl-12 text-white focus:outline-none focus:border-gold/50 transition-all appearance-none"
            >
              <optgroup label="Cryptocurrency">
                {cryptoCurrencies.map((c) => (
                  <option key={c} value={c} className="bg-[#0b0d1a]">{c}</option>
                ))}
              </optgroup>
              <optgroup label="Fiat Currency">
                {fiatCurrencies.map((c) => (
                  <option key={c} value={c} className="bg-[#0b0d1a]">{c}</option>
                ))}
              </optgroup>
            </select>
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg">
              {getCurrencyIcon(from)}
            </span>
          </div>
        </div>

        <div>
          <label className="text-sm text-white/40 block mb-2 font-medium">Amount</label>
          <input
            type="text"
            inputMode="decimal"
            value={amount}
            onChange={handleAmountChange}
            placeholder="Enter amount"
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-white text-center text-xl focus:outline-none focus:border-gold/50 transition-all"
          />
        </div>

        <div>
          <label className="text-sm text-white/40 block mb-2 font-medium">To</label>
          <div className="relative">
            <select
              value={to}
              onChange={(e) => setTo(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 pl-12 text-white focus:outline-none focus:border-gold/50 transition-all appearance-none"
            >
              <optgroup label="Cryptocurrency">
                {cryptoCurrencies.map((c) => (
                  <option key={c} value={c} className="bg-[#0b0d1a]">{c}</option>
                ))}
              </optgroup>
              <optgroup label="Fiat Currency">
                {fiatCurrencies.map((c) => (
                  <option key={c} value={c} className="bg-[#0b0d1a]">{c}</option>
                ))}
              </optgroup>
            </select>
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg">
              {getCurrencyIcon(to)}
            </span>
          </div>
        </div>
      </div>

      {/* Swap Button */}
      <div className="flex justify-center my-4">
        <motion.button
          whileHover={{ scale: 1.1, rotate: 180 }}
          transition={{ duration: 0.3 }}
          onClick={handleSwap}
          className="w-12 h-12 rounded-full glass flex items-center justify-center text-gold hover:border-gold/30 transition-all"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 4v12m0 0l4-4m-4 4l-4-4" />
          </svg>
        </motion.button>
      </div>

      {/* Result */}
      <div className="mt-2 text-center bg-white/5 rounded-2xl py-6 px-4 border border-white/5">
        {isLoading ? (
          <div className="animate-pulse text-white/30">Loading rates...</div>
        ) : (
          <>
            <p className="text-4xl md:text-5xl font-bold text-gold">
              {!isNaN(result) ? result.toFixed(6) : '0.000000'} {to}
            </p>
            <p className="text-sm text-white/30 mt-2 font-mono">
              1 {from} = {(result && amount) ? (result / Number(amount)).toFixed(8) : '0.00000000'} {to}
            </p>
            <div className="mt-3 flex items-center justify-center gap-2 text-xs text-white/20">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              Live rate • {new Date().toLocaleTimeString()}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
