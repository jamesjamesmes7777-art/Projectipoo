import { useEffect, useState } from 'react';
import { TrendingUp, TrendingDown, Activity } from 'lucide-react';

interface StockData {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePct: number;
  bid: number;
  ask: number;
  prevClose: number;
  dayLow: number;
  dayHigh: number;
  market: string;
  currency: string;
  lastUpdated: string;
}

function fmt(n: number, decimals = 2) {
  return n.toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
}

export default function StockTicker() {
  const [data, setData] = useState<StockData | null>(null);
  const [prev, setPrev] = useState<number | null>(null);
  const [flash, setFlash] = useState<'up' | 'down' | null>(null);

  useEffect(() => {
    async function fetchPrice() {
      try {
        const res = await fetch('/api/stock-price');
        if (!res.ok) return;
        const json: StockData = await res.json();
        setData(d => {
          if (d) {
            setPrev(d.price);
            if (json.price > d.price) setFlash('up');
            else if (json.price < d.price) setFlash('down');
          }
          return json;
        });
      } catch {
        // silently ignore
      }
    }
    fetchPrice();
    const id = setInterval(fetchPrice, 15_000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (!flash) return;
    const t = setTimeout(() => setFlash(null), 600);
    return () => clearTimeout(t);
  }, [flash]);

  const isUp = data ? data.change >= 0 : true;
  const color = isUp ? 'text-emerald-400' : 'text-red-400';
  const borderColor = isUp ? 'border-emerald-500/20' : 'border-red-500/20';
  const bgColor = isUp ? 'bg-emerald-500/5' : 'bg-red-500/5';

  const flashClass =
    flash === 'up'
      ? 'bg-emerald-500/20'
      : flash === 'down'
      ? 'bg-red-500/20'
      : '';

  if (!data) {
    return (
      <div className="w-full bg-black border-y border-slate-800/60 py-3 px-4">
        <div className="max-w-7xl mx-auto flex items-center gap-3">
          <span className="w-1.5 h-1.5 rounded-full bg-slate-700 animate-pulse" />
          <span className="text-xs text-slate-600">Loading price…</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`w-full bg-black border-y ${borderColor} py-0`}>
      <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8`}>
        <div className={`flex flex-wrap items-center gap-x-6 gap-y-2 py-3 transition-colors duration-300 rounded-sm ${flashClass}`}>

          {/* Symbol + live dot */}
          <div className="flex items-center gap-2 min-w-0">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-50" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-400" />
            </span>
            <span className="font-black text-white text-sm tracking-wider">SPCX</span>
            <span className="hidden sm:block text-slate-600 text-xs font-medium truncate max-w-[160px]">
              Space Exploration Technologies
            </span>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-1.5">
            <span className={`font-black text-xl tabular-nums tracking-tight transition-colors duration-300 ${color}`}>
              ${fmt(data.price)}
            </span>
            <span className="text-slate-500 text-xs">USD</span>
          </div>

          {/* Change */}
          <div className={`flex items-center gap-1 ${color}`}>
            {isUp
              ? <TrendingUp className="w-3.5 h-3.5" />
              : <TrendingDown className="w-3.5 h-3.5" />}
            <span className="text-xs font-bold tabular-nums">
              {isUp ? '+' : ''}{fmt(data.change)} ({isUp ? '+' : ''}{fmt(data.changePct)}%)
            </span>
          </div>

          {/* Separator */}
          <div className="hidden md:block h-4 w-px bg-slate-800" />

          {/* Bid / Ask */}
          <div className="hidden md:flex items-center gap-3 text-xs">
            <span className="text-slate-500">
              Bid <span className="text-slate-300 font-semibold tabular-nums">${fmt(data.bid)}</span>
            </span>
            <span className="text-slate-500">
              Ask <span className="text-slate-300 font-semibold tabular-nums">${fmt(data.ask)}</span>
            </span>
          </div>

          {/* Day range */}
          <div className="hidden lg:flex items-center gap-3 text-xs">
            <span className="text-slate-500">
              Day Range{' '}
              <span className="text-slate-300 font-semibold tabular-nums">
                ${fmt(data.dayLow)} – ${fmt(data.dayHigh)}
              </span>
            </span>
          </div>

          {/* Prev close */}
          <div className="hidden lg:flex items-center gap-1 text-xs text-slate-500">
            Prev Close <span className="text-slate-400 font-semibold tabular-nums ml-1">${fmt(data.prevClose)}</span>
          </div>

          {/* Market badge */}
          <div className="ml-auto flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/60 border border-slate-800 text-[10px] font-semibold text-slate-500 uppercase tracking-widest whitespace-nowrap">
            <Activity className="w-3 h-3 text-slate-600" />
            {data.market}
          </div>
        </div>
      </div>
    </div>
  );
}
