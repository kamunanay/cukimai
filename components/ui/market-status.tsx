'use client';

import { useState, useEffect } from 'react';

export default function MarketStatus() {
  const [time, setTime] = useState('');

  useEffect(() => {
    const update = () => {
      setTime(new Date().toLocaleString('en-US', {
        timeZone: 'UTC',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      }));
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center gap-3 glass rounded-full px-4 py-2 text-xs">
      <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
      <span className="text-white/60 font-medium tracking-wider">LIVE MARKET</span>
      <span className="w-px h-4 bg-white/10" />
      <span className="text-white/30 font-mono">{time} UTC</span>
    </div>
  );
}
