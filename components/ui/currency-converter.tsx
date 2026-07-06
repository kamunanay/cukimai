'use client';

import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getForexRates } from '../../services/forex';

const currencies = ['USD', 'IDR', 'EUR', 'GBP', 'JPY', 'AUD', 'CNY', 'SGD', 'MYR', 'KRW', 'INR'];

export default function CurrencyConverter() {
  const [from, setFrom] = useState('USD');
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
        IDR: data.usdIdr,
        EUR: data.usdEur,
        GBP: data.usdGbp,
        JPY: data.usdJpy,
        AUD: data.usdAud,
        CNY: data.usdCny,
        SGD: data.usdSgd,
        MYR: data.usdMyr,
        KRW: data.usdKrw,
        INR: data.usdInr,
      };
      const fromRate = rates[from] || 1;
      const toRate = rates[to] || 1;
      setResult((Number(amount) * toRate) / fromRate);
    }
  }, [amount, from, to, data]);

  return (
    <div className="glass rounded-2xl p-6">
      <h3 className="text-lg font-semibold mb-4 text-gold">Currency Converter</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="text-sm text-white/40 block mb-1">From</label>
          <select
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-gold/50"
          >
            {currencies.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label className="text-sm text-white/40 block mb-1">Amount</label>
          <input
            type="text"
            inputMode="decimal"
            value={amount}
            onChange={handleAmountChange}
            placeholder="Enter amount"
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-gold/50"
          />
        </div>
        <div>
          <label className="text-sm text-white/40 block mb-1">To</label>
          <select
            value={to}
            onChange={(e) => setTo(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-gold/50"
          >
            {currencies.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>
      <div className="mt-4 text-center">
        {isLoading ? (
          <div className="animate-pulse text-white/30">Loading...</div>
        ) : (
          <>
            <p className="text-3xl font-bold text-gold">
              {!isNaN(result) ? result.toFixed(2) : '0.00'} {to}
            </p>
            <p className="text-sm text-white/30 mt-1">
              1 {from} = {result && amount ? (result / Number(amount)).toFixed(6) : '0.000000'} {to}
            </p>
          </>
        )}
      </div>
    </div>
  );
}
