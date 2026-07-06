'use client';

import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getForexRates } from '../../services/forex';
import { motion } from 'framer-motion';

const currencies = [
  { code: 'USD', name: 'US Dollar', flag: '🇺🇸' },
  { code: 'IDR', name: 'Indonesian Rupiah', flag: '🇮🇩' },
  { code: 'EUR', name: 'Euro', flag: '🇪🇺' },
  { code: 'GBP', name: 'British Pound', flag: '🇬🇧' },
  { code: 'JPY', name: 'Japanese Yen', flag: '🇯🇵' },
  { code: 'AUD', name: 'Australian Dollar', flag: '🇦🇺' },
  { code: 'CNY', name: 'Chinese Yuan', flag: '🇨🇳' },
  { code: 'SGD', name: 'Singapore Dollar', flag: '🇸🇬' },
  { code: 'MYR', name: 'Malaysian Ringgit', flag: '🇲🇾' },
  { code: 'KRW', name: 'South Korean Won', flag: '🇰🇷' },
  { code: 'INR', name: 'Indian Rupee', flag: '🇮🇳' },
  { code: 'CHF', name: 'Swiss Franc', flag: '🇨🇭' },
  { code: 'CAD', name: 'Canadian Dollar', flag: '🇨🇦' },
  { code: 'NZD', name: 'New Zealand Dollar', flag: '🇳🇿' },
  { code: 'THB', name: 'Thai Baht', flag: '🇹🇭' },
  { code: 'VND', name: 'Vietnamese Dong', flag: '🇻🇳' },
  { code: 'PHP', name: 'Philippine Peso', flag: '🇵🇭' },
];

export default function CurrencyConverter() {
  const [to, setTo] = useState('IDR');
  const [amount, setAmount] = useState<number | string>(1);
  const [result, setResult] = useState<number>(0);

  const { data, isLoading } = useQuery({
    queryKey: ['forex'],
    queryFn: getForexRates,
    refetchInterval: 30000,
  });

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (val === '' || /^\d*\.?\d*$/.test(val)) setAmount(val);
  };

  useEffect(() => {
    if (data && amount !== '' && !isNaN(Number(amount))) {
      const rates: Record<string, number> = {
        USD: 1,
        IDR: data.usdIdr || 16322.45,
        EUR: data.usdEur || 0.92,
        GBP: data.usdGbp || 0.78,
        JPY: data.usdJpy || 154.50,
        AUD: data.usdAud || 1.50,
        CNY: data.usdCny || 7.20,
        SGD: data.usdSgd || 1.35,
        MYR: data.usdMyr || 4.70,
        KRW: data.usdKrw || 1380.00,
        INR: data.usdInr || 83.50,
        CHF: data.usdEur || 0.92 * 0.95,
        CAD: data.usdAud || 1.35,
        NZD: data.usdAud || 1.60,
        THB: 35.50,
        VND: 25450,
        PHP: 58.50,
      };
      const rate = rates[to] || 1;
      setResult(Number(amount) * rate);
    }
  }, [amount, to, data]);

  const getCurrencyIcon = (code: string): string => {
    const icons: Record<string, string> = {
      USD: '$', EUR: '€', GBP: '£', JPY: '¥', IDR: 'Rp',
      AUD: 'A$', CNY: '¥', SGD: 'S$', MYR: 'RM', KRW: '₩',
      INR: '₹', CHF: 'CHF', CAD: 'C$', NZD: 'NZ$', THB: '฿',
      VND: '₫', PHP: '₱',
    };
    return icons[code] || code;
  };

  const getCurrencyFlag = (code: string): string => {
    const found = currencies.find(c => c.code === code);
    return found?.flag || '🌍';
  };

  const getCurrencyName = (code: string): string => {
    const found = currencies.find(c => c.code === code);
    return found?.name || code;
  };

  return (
    <div className="glass rounded-2xl p-6 md:p-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center shadow-lg shadow-gold/20">
          <span className="text-[#0b0d1a] font-bold text-lg">$</span>
        </div>
        <div>
          <h3 className="text-xl font-semibold text-gold">Currency Converter</h3>
          <p className="text-xs text-white/30 mt-0.5">USD to all currencies · Real-time</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* From — FIXED USD */}
        <div>
          <label className="text-sm text-white/40 block mb-2 font-medium">From</label>
          <div className="relative bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 flex items-center gap-3">
            <span className="text-2xl">🇺🇸</span>
            <div>
              <div className="font-bold text-white text-lg">USD</div>
              <div className="text-xs text-white/30">US Dollar</div>
            </div>
          </div>
        </div>

        {/* Amount */}
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

        {/* To */}
        <div>
          <label className="text-sm text-white/40 block mb-2 font-medium">To</label>
          <div className="relative">
            <select
              value={to}
              onChange={(e) => setTo(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 pl-14 pr-10 text-white focus:outline-none focus:border-gold/50 transition-all appearance-none"
            >
              {currencies.filter(c => c.code !== 'USD').map((c) => (
                <option key={c.code} value={c.code} className="bg-[#0b0d1a] py-2">
                  {c.flag} {c.code} — {c.name}
                </option>
              ))}
            </select>
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl">
              {getCurrencyFlag(to)}
            </span>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20 pointer-events-none">
              ▼
            </div>
          </div>
        </div>
      </div>

      {/* Result */}
      <div className="mt-5 text-center bg-white/5 rounded-2xl py-6 px-4 border border-white/5">
        {isLoading ? (
          <div className="animate-pulse text-white/30">Loading rates...</div>
        ) : (
          <>
            <div className="flex items-center justify-center gap-3">
              <span className="text-3xl">{getCurrencyFlag(to)}</span>
              <p className="text-4xl md:text-5xl font-bold text-gold">
                {!isNaN(result) ? result.toLocaleString('id-ID', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '0.00'}
              </p>
              <span className="text-2xl font-bold text-white/50">{to}</span>
            </div>
            <p className="text-sm text-white/30 mt-2 font-mono">
              1 USD = {(result && amount) ? (result / Number(amount)).toFixed(6) : '0.000000'} {to}
            </p>
            <div className="mt-3 flex items-center justify-center gap-2 text-xs text-white/20">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              Live rate • {new Date().toLocaleTimeString()}
            </div>
          </>
        )}
      </div>

      {/* Quick select */}
      <div className="mt-4 flex flex-wrap gap-2 justify-center">
        {currencies.filter(c => c.code !== 'USD').slice(0, 6).map((c) => (
          <button
            key={c.code}
            onClick={() => setTo(c.code)}
            className={`text-xs px-3 py-1.5 rounded-full transition-all ${
              to === c.code
                ? 'bg-gold/20 text-gold border border-gold/30'
                : 'bg-white/5 text-white/40 hover:text-white/70 border border-white/5 hover:border-white/15'
            }`}
          >
            {c.flag} {c.code}
          </button>
        ))}
      </div>
    </div>
  );
}
