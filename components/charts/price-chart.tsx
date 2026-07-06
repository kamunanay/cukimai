'use client';

import { useEffect, useRef, useState } from 'react';
import { createChart, ColorType, IChartApi, Time } from 'lightweight-charts';

export default function PriceChart({ symbol, timeframe = '1D' }: { symbol: string; timeframe?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const [selectedTF, setSelectedTF] = useState(timeframe);

  useEffect(() => {
    if (!containerRef.current) return;

    const chart = createChart(containerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: 'rgba(0,0,0,0)' },
        textColor: 'rgba(255,255,255,0.5)',
      },
      grid: {
        vertLines: { color: 'rgba(255,255,255,0.05)' },
        horzLines: { color: 'rgba(255,255,255,0.05)' },
      },
      width: containerRef.current.clientWidth,
      height: 320,
      rightPriceScale: { borderColor: 'rgba(255,255,255,0.1)' },
      timeScale: { borderColor: 'rgba(255,255,255,0.1)', timeVisible: true },
    });

    chartRef.current = chart;

    const lineSeries = chart.addLineSeries({
      color: '#f5c842',
      lineWidth: 2,
      crosshairMarkerVisible: true,
      crosshairMarkerRadius: 6,
    });

    const count = selectedTF === '1H' ? 24 : selectedTF === '4H' ? 36 : selectedTF === '1D' ? 30 : selectedTF === '1W' ? 60 : 90;
    const data: { time: Time; value: number }[] = [];
    const now = Date.now();
    const interval = selectedTF === '1H' ? 60 * 60 * 1000 : selectedTF === '4H' ? 4 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000;
    let price = 16320;

    for (let i = 0; i < count; i++) {
      const change = (Math.random() - 0.48) * 200;
      price += change;
      data.push({
        time: (now - (count - i) * interval) / 1000 as Time,
        value: price,
      });
    }

    lineSeries.setData(data);

    const resize = () => {
      if (containerRef.current && chartRef.current) {
        chartRef.current.applyOptions({ width: containerRef.current.clientWidth });
      }
    };

    window.addEventListener('resize', resize);

    return () => {
      window.removeEventListener('resize', resize);
      if (chartRef.current) {
        chartRef.current.remove();
        chartRef.current = null;
      }
    };
  }, [symbol, selectedTF]);

  const timeframes = ['1H', '4H', '1D', '1W', '1M'];

  return (
    <div className="glass rounded-2xl p-4">
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <span className="text-sm font-medium text-white/60">{symbol}</span>
        <div className="flex gap-1 flex-wrap">
          {timeframes.map((tf) => (
            <button
              key={tf}
              onClick={() => setSelectedTF(tf)}
              className={`text-xs px-3 py-1 rounded-full transition-all ${
                selectedTF === tf ? 'bg-gold/20 text-gold' : 'text-white/30 hover:text-white/60'
              }`}
            >
              {tf}
            </button>
          ))}
        </div>
      </div>
      <div ref={containerRef} />
    </div>
  );
}
