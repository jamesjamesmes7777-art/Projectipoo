import { useEffect, useRef, useState } from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

/* ── Types ───────────────────────────────────────────────── */
interface Candle {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

interface StockData {
  symbol: string;
  price: number;
  priceEur: number;
  eurRate: number;
  change: number;
  changePct: number;
  changeEur: number;
  bid: number;
  ask: number;
  prevClose: number;
  prevCloseEur: number;
  dayLow: number;
  dayHigh: number;
  market: string;
  lastUpdated: string;
}

/* ── Price formula (must mirror server) ─────────────────── */
const BASE_P    = 160.95;
const DAY_LOW   = 149.34;
const DAY_HIGH  = 176.52;
const INTERVAL  = 5 * 60_000;
const N_CANDLES = 40;

function computePrice(ms: number): number {
  const t  = ms / 60_000;
  const s1 = Math.sin(t / 47.3) * 6.8;
  const s2 = Math.sin(t / 7.9)  * 2.1;
  const s3 = Math.sin(t / 1.8)  * 0.55;
  const raw = BASE_P + s1 + s2 + s3;
  return Math.max(DAY_LOW + 1, Math.min(DAY_HIGH - 1, raw));
}

function buildCandles(livePrice: number): Candle[] {
  const now      = Date.now();
  const curStart = Math.floor(now / INTERVAL) * INTERVAL;
  const result: Candle[] = [];

  for (let i = N_CANDLES - 1; i >= 0; i--) {
    const t0    = curStart - i * INTERVAL;
    const t1    = t0 + INTERVAL;
    const open  = i === N_CANDLES - 1
      ? computePrice(t0)
      : result[result.length - 1]?.close ?? computePrice(t0);
    const close = i === 0 ? livePrice : computePrice(t1);

    const seed  = (t0 / 1000) % 1_000_000;
    const wickU = Math.abs(Math.sin(seed * 1.31 + 0.7)) * 2.2 + 0.35;
    const wickD = Math.abs(Math.sin(seed * 0.87 + 1.1)) * 2.2 + 0.35;
    const high  = Math.max(open, close) + wickU;
    const low   = Math.min(open, close) - wickD;
    const vol   = Math.round(60_000 + Math.abs(Math.sin(seed * 2.1)) * 350_000 +
                             Math.abs(close - open) * 18_000);

    result.push({ time: t0, open, high, low, close, volume: vol });
  }
  return result;
}

function fmt(n: number, d = 2) {
  return n.toLocaleString('en-US', { minimumFractionDigits: d, maximumFractionDigits: d });
}

/* ── SVG chart ───────────────────────────────────────────── */
const PL = 62, PR = 62, PT = 14, PB = 22;

function CandleChart({
  candles, livePrice, isUp,
}: { candles: Candle[]; livePrice: number; isUp: boolean }) {
  const wrapRef  = useRef<HTMLDivElement>(null);
  const [svgW, setSvgW] = useState(900);
  const PRICE_H = 272;
  const VOL_H   = 52;
  const TOTAL_H = PRICE_H + VOL_H;

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const ob = new ResizeObserver(([e]) => setSvgW(e.contentRect.width | 0));
    ob.observe(el);
    setSvgW(el.clientWidth | 0);
    return () => ob.disconnect();
  }, []);

  const cw = svgW - PL - PR;
  const ch = PRICE_H - PT - PB;

  const maxP = Math.max(...candles.map(c => c.high));
  const minP = Math.min(...candles.map(c => c.low));
  const rng  = maxP - minP || 1;
  const hi   = maxP + rng * 0.06;
  const lo   = minP - rng * 0.06;

  const py = (p: number) => PT + ch * (1 - (p - lo) / (hi - lo));
  const slotW = cw / N_CANDLES;
  const bodyW = Math.max(2, slotW * 0.58);
  const cx    = (i: number) => PL + i * slotW + slotW / 2;

  const maxVol = Math.max(...candles.map(c => c.volume));
  const vy = (v: number) => VOL_H * (1 - v / maxVol) * 0.88;

  const GRID = 6;
  const grid = Array.from({ length: GRID }, (_, i) => {
    const p = lo + (hi - lo) * (i / (GRID - 1));
    return { y: py(p), lbl: `$${p.toFixed(2)}` };
  });

  const liveY     = py(livePrice);
  const liveColor = isUp ? '#22c55e' : '#ef4444';
  const liveBg    = isUp ? '#14532d' : '#7f1d1d';

  return (
    <div ref={wrapRef} className="w-full select-none overflow-hidden">
      <svg width={svgW} height={TOTAL_H} style={{ display: 'block' }}>
        {/* chart area bg */}
        <rect x={PL} y={PT} width={cw} height={ch}
          fill="rgba(2,6,23,0.7)" />

        {/* Grid */}
        {grid.map((g, i) => (
          <g key={i}>
            <line x1={PL} y1={g.y} x2={PL + cw} y2={g.y}
              stroke={i === 0 || i === GRID - 1 ? '#1e293b' : '#0f172a'}
              strokeWidth="1" />
            <text x={PL - 6} y={g.y + 4} textAnchor="end"
              fill="#475569" fontSize="10.5" fontFamily="'Courier New', monospace">
              {g.lbl}
            </text>
          </g>
        ))}

        {/* Candles */}
        {candles.map((c, i) => {
          const up     = c.close >= c.open;
          const clr    = up ? '#22c55e' : '#ef4444';
          const fillOp = up ? 0.80 : 0.95;
          const bTop   = py(Math.max(c.open, c.close));
          const bBot   = py(Math.min(c.open, c.close));
          const bH     = Math.max(1.5, bBot - bTop);
          const x      = cx(i);
          const isLast = i === N_CANDLES - 1;
          return (
            <g key={c.time}>
              {/* wick */}
              <line x1={x} y1={py(c.high)} x2={x} y2={py(c.low)}
                stroke={clr} strokeWidth="1.2" opacity={isLast ? 1 : 0.7} />
              {/* body */}
              <rect x={x - bodyW / 2} y={bTop}
                width={bodyW} height={bH}
                fill={clr} fillOpacity={fillOp}
                rx="0.8"
                filter={isLast ? `drop-shadow(0 0 3px ${clr})` : undefined}
              />
            </g>
          );
        })}

        {/* Live price dashed line */}
        <line x1={PL} y1={liveY} x2={PL + cw} y2={liveY}
          stroke={liveColor} strokeWidth="1.2" strokeDasharray="6 3" opacity="0.9" />

        {/* Live price label */}
        <rect x={PL + cw + 6} y={liveY - 11} width={PR - 10} height={22}
          fill={liveBg} stroke={liveColor} strokeWidth="1" rx="3" />
        <text x={PL + cw + 6 + (PR - 10) / 2} y={liveY + 5}
          textAnchor="middle" fill={liveColor} fontSize="10.5" fontWeight="bold"
          fontFamily="'Courier New', monospace">
          {livePrice.toFixed(2)}
        </text>

        {/* X axis */}
        <line x1={PL} y1={PT + ch} x2={PL + cw} y2={PT + ch}
          stroke="#1e293b" strokeWidth="1" />

        {/* Volume bars */}
        {candles.map((c, i) => {
          const up   = c.close >= c.open;
          const fill = up ? 'rgba(34,197,94,0.35)' : 'rgba(239,68,68,0.35)';
          const barH = Math.max(1.5, VOL_H - vy(c.volume));
          const x    = cx(i);
          return (
            <rect key={`v${c.time}`}
              x={x - bodyW / 2} y={PRICE_H + vy(c.volume)}
              width={bodyW} height={barH}
              fill={fill} rx="0.5" />
          );
        })}

        {/* Volume baseline */}
        <line x1={PL} y1={PRICE_H + VOL_H} x2={PL + cw} y2={PRICE_H + VOL_H}
          stroke="#1e293b" strokeWidth="1" />

        {/* "VOL" label */}
        <text x={PL - 6} y={PRICE_H + 14} textAnchor="end"
          fill="#334155" fontSize="9" fontFamily="monospace">VOL</text>
      </svg>
    </div>
  );
}

/* ── Stat row ────────────────────────────────────────────── */
function Stat({ label, value, accent }: { label: string; value: string; accent?: string }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-[9px] text-slate-600 uppercase tracking-widest font-bold">{label}</span>
      <span className={`text-sm font-semibold tabular-nums ${accent ?? 'text-slate-300'}`}>{value}</span>
    </div>
  );
}

/* ── Main export ─────────────────────────────────────────── */
export default function StockChart() {
  const [data,    setData]    = useState<StockData | null>(null);
  const [candles, setCandles] = useState<Candle[]>([]);
  const [flash,   setFlash]   = useState(false);
  const prevPrice = useRef<number | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const r = await fetch('/api/stock-price');
        if (!r.ok) return;
        const d: StockData = await r.json();
        if (prevPrice.current !== null && prevPrice.current !== d.price) {
          setFlash(true);
          setTimeout(() => setFlash(false), 600);
        }
        prevPrice.current = d.price;
        setData(d);
        setCandles(buildCandles(d.price));
      } catch { /* ignore */ }
    }
    fetchData();
    const id = setInterval(fetchData, 15_000);
    return () => clearInterval(id);
  }, []);

  if (!data) {
    return (
      <div className="w-full bg-[#020408] border-y border-slate-800/50 py-8">
        <div className="max-w-7xl mx-auto px-4 flex items-center gap-3 text-slate-600 text-sm">
          <span className="w-2 h-2 rounded-full bg-slate-700 animate-pulse" />
          Loading SPCX…
        </div>
      </div>
    );
  }

  const isUp       = data.change >= 0;
  const priceColor = isUp ? 'text-emerald-400' : 'text-red-400';
  const TrendIcon  = isUp ? TrendingUp : TrendingDown;

  return (
    <section className="w-full bg-[#020408] border-y border-slate-800/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">

        {/* ── Header bar ── */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute h-full w-full rounded-full bg-emerald-400 opacity-40" />
              <span className="relative rounded-full h-2.5 w-2.5 bg-emerald-400" />
            </span>
            <span className="font-black text-white tracking-widest text-sm sm:text-base">SPCX</span>
            <span className="hidden sm:block text-slate-500 text-xs">
              Space Exploration Technologies Corp.
            </span>
            <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800
                             text-slate-500 text-[10px] font-bold uppercase tracking-widest">
              {data.market}
            </span>
          </div>

          {/* Timeframe selector (visual only — chart always shows 5 m) */}
          <div className="flex items-center gap-1">
            {['1m','5m','15m','1h','1D'].map(tf => (
              <button key={tf}
                className={`px-2 py-0.5 rounded text-[11px] font-semibold transition-colors ${
                  tf === '5m'
                    ? 'bg-cyan-900/40 text-cyan-400 border border-cyan-800/50'
                    : 'text-slate-700 hover:text-slate-400'
                }`}>
                {tf}
              </button>
            ))}
          </div>
        </div>

        {/* ── Body: price panel + chart ── */}
        <div className="flex flex-col lg:flex-row gap-5">

          {/* Price panel */}
          <div className="lg:w-52 flex-shrink-0">
            <div className={`transition-opacity duration-200 ${flash ? 'opacity-60' : 'opacity-100'}`}>
              <div className={`font-black tabular-nums leading-none tracking-tight ${priceColor}`}
                   style={{ fontSize: 'clamp(2rem, 4vw, 2.8rem)' }}>
                ${fmt(data.price)}
              </div>
              <div className="text-slate-500 text-xs font-mono mt-0.5 mb-3">USD</div>

              <div className={`flex items-center gap-1.5 text-sm font-bold ${priceColor}`}>
                <TrendIcon className="w-4 h-4" />
                <span>{isUp ? '+' : ''}{fmt(data.change)}</span>
                <span>({isUp ? '+' : ''}{fmt(data.changePct)}%)</span>
              </div>
            </div>

            <div className="hidden lg:grid grid-cols-1 gap-3 mt-5 pt-4 border-t border-slate-800/60">
              <Stat label="Bid"        value={`$${fmt(data.bid)}`}       />
              <Stat label="Ask"        value={`$${fmt(data.ask)}`}       />
              <Stat label="Day Low"    value={`$${fmt(data.dayLow)}`}    />
              <Stat label="Day High"   value={`$${fmt(data.dayHigh)}`}   />
              <Stat label="Prev Close" value={`$${fmt(data.prevClose)}`} />
            </div>
          </div>

          {/* Chart */}
          <div className="flex-1 min-w-0 rounded-lg overflow-hidden border border-slate-800/60
                          bg-[#020810]">
            <CandleChart candles={candles} livePrice={data.price} isUp={isUp} />
          </div>
        </div>

        {/* ── Mobile stats ── */}
        <div className="lg:hidden mt-4 pt-4 border-t border-slate-800/60
                        grid grid-cols-3 sm:grid-cols-5 gap-4">
          <Stat label="Bid"        value={`$${fmt(data.bid)}`}       />
          <Stat label="Ask"        value={`$${fmt(data.ask)}`}       />
          <Stat label="Day Low"    value={`$${fmt(data.dayLow)}`}    />
          <Stat label="Day High"   value={`$${fmt(data.dayHigh)}`}   />
          <Stat label="Prev Close" value={`$${fmt(data.prevClose)}`} />
        </div>

        {/* ── Footer ── */}
        <div className="mt-3 flex items-center justify-between text-[10px] text-slate-700">
          <span>5-minute candles · {N_CANDLES} periods</span>
          <span className="font-mono">
            Updated {new Date(data.lastUpdated).toLocaleTimeString('en-US',
              { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
          </span>
        </div>
      </div>
    </section>
  );
}
