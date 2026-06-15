import { useState, useEffect, useRef, useCallback } from 'react';
import { Copy, Check, BarChart3, Info, ArrowUp, ArrowDown, RefreshCw } from 'lucide-react';
import { useLang } from '../context/LangContext';

/* ── Types ─────────────────────────────────────────────────────────────────── */
interface Bid {
  id: string;
  region: string;
  shares: number;
  bid: number;
  premium: string;
  premiumVal: number;
}

/* ── Data pools ─────────────────────────────────────────────────────────────── */
const BASE_PRICE = 117;
const REFRESH_INTERVAL = 30;

const CITIES: [string, string][] = [
  ['Athens', 'GR'], ['Thessaloniki', 'GR'], ['London', 'UK'], ['Edinburgh', 'UK'],
  ['Paris', 'FR'], ['Nice', 'FR'], ['Lyon', 'FR'], ['Milan', 'IT'], ['Rome', 'IT'],
  ['Turin', 'IT'], ['Naples', 'IT'], ['Madrid', 'ES'], ['Barcelona', 'ES'],
  ['Valencia', 'ES'], ['Berlin', 'DE'], ['Munich', 'DE'], ['Hamburg', 'DE'],
  ['Frankfurt', 'DE'], ['Vienna', 'AT'], ['Zurich', 'CH'], ['Geneva', 'CH'],
  ['Amsterdam', 'NL'], ['Rotterdam', 'NL'], ['Brussels', 'BE'], ['Antwerp', 'BE'],
  ['Copenhagen', 'DK'], ['Oslo', 'NO'], ['Stockholm', 'SE'], ['Helsinki', 'FI'],
  ['Dublin', 'IE'], ['Lisbon', 'PT'], ['Warsaw', 'PL'], ['Prague', 'CZ'],
  ['Budapest', 'HU'], ['Bucharest', 'RO'], ['Luxembourg', 'LU'], ['Valletta', 'MT'],
  ['Nicosia', 'CY'], ['Sofia', 'BG'], ['Zagreb', 'HR'], ['Ljubljana', 'SI'],
  ['Bratislava', 'SK'], ['Vilnius', 'LT'], ['Riga', 'LV'], ['Tallinn', 'EE'],
];

const SHARE_LOTS = [
  100, 125, 150, 175, 200, 225, 250, 275, 300, 325, 350, 400, 450, 475,
  500, 550, 600, 650, 700, 725, 750, 800, 850, 875, 950, 975, 1000, 1075,
  1100, 1200, 1275, 1375, 1400, 1500, 1525, 1650, 1675, 1750, 1800,
];

/* ── Bid generator ──────────────────────────────────────────────────────────── */
function rng(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const PRICE_MIN = 168;
const PRICE_MAX = 316;

function makeBid(price: number, usedIds: Set<string>, cityIdx: number): Bid {
  let id: string;
  do { id = `BID-${rng(1000, 9999)}`; } while (usedIds.has(id));
  usedIds.add(id);
  const [city, cc] = CITIES[cityIdx];
  const shares = SHARE_LOTS[rng(0, SHARE_LOTS.length - 1)];
  const premiumVal = parseFloat(((price / BASE_PRICE - 1) * 100).toFixed(1));
  const premium = `+${premiumVal.toFixed(1)}%`;
  return { id, region: `${city}, ${cc}`, shares, bid: price, premium, premiumVal };
}

function generateBids(): Bid[] {
  const count = rng(38, 52);
  const priceSet = new Set<number>();
  while (priceSet.size < count) {
    priceSet.add(rng(PRICE_MIN, PRICE_MAX));
  }
  const prices = [...priceSet].sort((a, b) => b - a);

  const usedIds = new Set<string>();
  const usedCityIdxs: number[] = [];

  return prices.map(price => {
    // Prefer not repeating cities until we run out
    let cityIdx: number;
    if (usedCityIdxs.length < CITIES.length) {
      do { cityIdx = rng(0, CITIES.length - 1); } while (usedCityIdxs.includes(cityIdx) && usedCityIdxs.length < CITIES.length - 1);
    } else {
      cityIdx = rng(0, CITIES.length - 1);
    }
    usedCityIdxs.push(cityIdx);
    return makeBid(price, usedIds, cityIdx);
  });
}

/* ── Partial refresh: keep most bids, regenerate a minority ──────────────────── */
function partialRefresh(prev: RowState[]): RowState[] {
  if (prev.length === 0) return toRows(generateBids(), true);

  // Shuffle indices, keep ~65% of existing bids unchanged ("staying" bids)
  const idxs = prev.map((_, i) => i);
  for (let i = idxs.length - 1; i > 0; i--) {
    const j = rng(0, i);
    [idxs[i], idxs[j]] = [idxs[j], idxs[i]];
  }
  const keepCount = Math.max(8, Math.floor(prev.length * 0.65));
  const keepSet = new Set(idxs.slice(0, keepCount));

  const kept: RowState[] = prev
    .filter((_, i) => keepSet.has(i))
    .map(r => ({ bid: r.bid, flashing: false, movement: null, entering: false }));

  const replaceCount = prev.length - kept.length;
  const usedPrices = new Set(kept.map(r => r.bid.bid));
  const usedIds = new Set(kept.map(r => r.bid.id));

  const fresh: RowState[] = [];
  let guard = 0;
  while (fresh.length < replaceCount && guard < 1000) {
    guard++;
    const price = rng(PRICE_MIN, PRICE_MAX);
    if (usedPrices.has(price)) continue;
    usedPrices.add(price);
    const cityIdx = rng(0, CITIES.length - 1);
    fresh.push({ bid: makeBid(price, usedIds, cityIdx), flashing: false, movement: null, entering: true });
  }

  return [...kept, ...fresh].sort((a, b) => b.bid.bid - a.bid.bid);
}

/* ── Helpers ────────────────────────────────────────────────────────────────── */
function getPremiumColor(val: number) {
  if (val >= 100) return { text: 'text-emerald-400', badge: 'bg-emerald-500/12 border-emerald-500/25' };
  if (val >= 70)  return { text: 'text-emerald-500', badge: 'bg-emerald-500/8 border-emerald-500/15' };
  if (val >= 40)  return { text: 'text-teal-400',    badge: 'bg-teal-500/8 border-teal-500/15' };
  return              { text: 'text-slate-400',    badge: 'bg-slate-800/50 border-slate-700/30' };
}

function CopyButton({ id, copyLabel, copiedLabel }: { id: string; copyLabel: string; copiedLabel: string }) {
  const [copied, setCopied] = useState(false);
  function handleCopy() {
    navigator.clipboard.writeText(id).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }
  return (
    <button
      onClick={handleCopy}
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
        copied
          ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/25'
          : 'bg-slate-900/80 text-slate-400 border border-slate-800 hover:border-cyan-500/30 hover:text-cyan-400'
      }`}
    >
      {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
      {copied ? copiedLabel : copyLabel}
    </button>
  );
}

/* ── Countdown ring ─────────────────────────────────────────────────────────── */
function CountdownRing({ seconds, total }: { seconds: number; total: number }) {
  const r = 14;
  const circ = 2 * Math.PI * r;
  const progress = (seconds / total) * circ;
  return (
    <svg width="36" height="36" viewBox="0 0 36 36" className="-rotate-90">
      <circle cx="18" cy="18" r={r} fill="none" stroke="rgba(34,211,238,0.1)" strokeWidth="2.5" />
      <circle
        cx="18" cy="18" r={r} fill="none"
        stroke="rgba(34,211,238,0.7)" strokeWidth="2.5"
        strokeDasharray={circ}
        strokeDashoffset={circ - progress}
        strokeLinecap="round"
        style={{ transition: 'stroke-dashoffset 0.9s linear' }}
      />
      <text x="18" y="18" textAnchor="middle" dominantBaseline="central"
        className="rotate-90" style={{ fontSize: 9, fill: 'rgba(34,211,238,0.9)', fontWeight: 700, transform: 'rotate(90deg)', transformOrigin: '50% 50%' }}>
        {seconds}s
      </text>
    </svg>
  );
}

/* ── Row state ──────────────────────────────────────────────────────────────── */
interface RowState { bid: Bid; flashing: boolean; movement: 'up' | 'down' | null; entering: boolean; }

function toRows(bids: Bid[], entering = false): RowState[] {
  return bids.map(bid => ({ bid, flashing: false, movement: null, entering }));
}

/* ── Main component ──────────────────────────────────────────────────────────── */
export default function DemandBoard() {
  const { t } = useLang();
  const [rows, setRows] = useState<RowState[]>(() => toRows(generateBids()));
  const [countdown, setCountdown] = useState(REFRESH_INTERVAL);
  const [refreshing, setRefreshing] = useState(false);

  const flashTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const shiftTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  const totalShares = rows.reduce((s, r) => s + r.bid.shares, 0);
  const totalCommitted = rows.reduce((s, r) => s + r.bid.shares * r.bid.bid, 0);

  /* live tick: flash a few rows, and nudge some prices for a real-time feel */
  const scheduleFlash = useCallback(() => {
    flashTimer.current = setTimeout(() => {
      const nudge = Math.random() < 0.6;
      setRows(prev => {
        if (prev.length === 0) return prev;
        const count = Math.min(rng(1, 3), prev.length);
        const indices = new Set<number>();
        while (indices.size < count) indices.add(rng(0, prev.length - 1));
        let next = prev.map((r, i) => {
          if (!indices.has(i)) return r;
          if (!nudge) return { ...r, flashing: true };
          const delta = rng(-3, 3);
          const np = Math.min(PRICE_MAX, Math.max(PRICE_MIN, r.bid.bid + delta));
          const premiumVal = parseFloat(((np / BASE_PRICE - 1) * 100).toFixed(1));
          return {
            ...r,
            flashing: true,
            movement: (np > r.bid.bid ? 'up' : np < r.bid.bid ? 'down' : null) as 'up' | 'down' | null,
            bid: { ...r.bid, bid: np, premiumVal, premium: `+${premiumVal.toFixed(1)}%` },
          };
        });
        if (nudge) next = [...next].sort((a, b) => b.bid.bid - a.bid.bid);
        return next;
      });
      setTimeout(() => setRows(prev => prev.map(r => ({ ...r, flashing: false, movement: null }))), 1600);
      scheduleFlash();
    }, rng(4000, 8000));
  }, []);

  /* micro-shift swap adjacent rows */
  const scheduleShift = useCallback(() => {
    shiftTimer.current = setTimeout(() => {
      setRows(prev => {
        if (prev.length < 3) return prev;
        const idx = rng(1, prev.length - 3);
        const next = [...prev];
        const tmp = next[idx];
        next[idx] = { ...next[idx + 1], movement: 'down' };
        next[idx + 1] = { ...tmp, movement: 'up' };
        return next;
      });
      setTimeout(() => setRows(prev => prev.map(r => ({ ...r, movement: null }))), 800);
      scheduleShift();
    }, rng(15000, 25000));
  }, []);

  useEffect(() => {
    scheduleFlash();
    scheduleShift();
    return () => { clearTimeout(flashTimer.current); clearTimeout(shiftTimer.current); };
  }, [scheduleFlash, scheduleShift]);

  /* 30-second full refresh */
  useEffect(() => {
    const tick = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          // Trigger refresh
          setRefreshing(true);
          setTimeout(() => {
            // Keep most bids, regenerate a minority — re-sorted by price
            setRows(prev => partialRefresh(prev));
            // Remove entering flag after animation completes
            setTimeout(() => setRows(prev => prev.map(r => ({ ...r, entering: false }))), 800);
            setRefreshing(false);
          }, 300);
          return REFRESH_INTERVAL;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(tick);
  }, []);

  return (
    <section id="demand-board" className="py-20 bg-[#000] bg-tech-grid relative">
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/60 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <p className="text-cyan-400 text-xs font-bold uppercase tracking-widest mb-3">{t.demand.section_label}</p>
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight mb-4">{t.demand.title}</h2>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="glass-card rounded-xl p-5 text-center">
            <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-2">{t.demand.total_volume}</p>
            <p className="text-white font-black text-xl sm:text-2xl tabular-nums">
              {totalShares.toLocaleString('en-US')}
              <span className="text-slate-500 text-sm font-medium ml-1.5">{t.demand.shares_sought}</span>
            </p>
          </div>
          <div className="glass-card rounded-xl p-5 text-center">
            <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-2">{t.demand.total_committed}</p>
            <p className="text-cyan-400 font-black text-xl sm:text-2xl tabular-nums">
              €{(totalCommitted / 1_000_000).toFixed(2)}M
              <span className="text-slate-500 text-sm font-medium ml-1.5">{t.demand.bid_value}</span>
            </p>
          </div>
        </div>

        {/* Instruction bar */}
        <div className="flex items-start gap-3 px-5 py-4 rounded-xl bg-slate-900/50 border border-slate-800/80 mb-6 backdrop-blur-sm">
          <Info className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
          <p className="text-slate-400 text-sm leading-relaxed">
            <span className="text-slate-200 font-semibold">{t.demand.instruction_title}</span>{' '}
            {t.demand.instruction_body}
          </p>
        </div>

        {/* Table */}
        <div className="glass-card rounded-2xl overflow-hidden">

          {/* Table header bar */}
          <div className="flex items-center gap-3 px-6 py-4 border-b border-slate-800/50">
            <BarChart3 className="w-4 h-4 text-cyan-400" />
            <span className="text-slate-300 font-semibold text-sm">
              {rows.length} {t.demand.active_orders}
            </span>

            {/* refresh indicator */}
            <div className="ml-auto flex items-center gap-3">
              {refreshing && (
                <div className="flex items-center gap-1.5 text-xs text-cyan-400">
                  <RefreshCw className="w-3 h-3 animate-spin" />
                  <span className="font-semibold uppercase tracking-widest text-[10px]">{t.demand.refreshing}</span>
                </div>
              )}
              {!refreshing && (
                <div className="flex items-center gap-2">
                  <span className="text-slate-600 text-[10px] uppercase tracking-widest font-semibold hidden sm:block">
                    {t.demand.next_update}
                  </span>
                  <CountdownRing seconds={countdown} total={REFRESH_INTERVAL} />
                </div>
              )}
              <div className="flex items-center gap-1.5 text-xs text-slate-500 border-l border-slate-800 pl-3">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                {t.demand.live}
              </div>
            </div>
          </div>

          <div
            className="overflow-x-auto max-h-[620px] overflow-y-auto transition-opacity duration-300"
            style={{ opacity: refreshing ? 0.3 : 1 }}
          >
            <table className="w-full text-sm border-collapse">
              <thead className="sticky top-0 z-10 backdrop-blur-md" style={{ background: 'rgba(4,13,26,0.96)' }}>
                <tr className="border-b border-slate-800/60">
                  <th className="text-left text-slate-500 text-xs font-semibold uppercase tracking-wider py-3 px-4">{t.demand.col_buyer}</th>
                  <th className="text-left text-slate-500 text-xs font-semibold uppercase tracking-wider py-3 px-4">{t.demand.col_region}</th>
                  <th className="text-right text-slate-500 text-xs font-semibold uppercase tracking-wider py-3 px-4">{t.demand.col_shares}</th>
                  <th className="text-right text-slate-500 text-xs font-semibold uppercase tracking-wider py-3 px-4">{t.demand.col_bid}</th>
                  <th className="text-right text-slate-500 text-xs font-semibold uppercase tracking-wider py-3 px-4">{t.demand.col_premium}</th>
                  <th className="py-3 px-4" />
                </tr>
              </thead>
              <tbody>
                {rows.map(({ bid, flashing, movement, entering }, i) => {
                  const { text: premText, badge: premBadge } = getPremiumColor(bid.premiumVal);
                  return (
                    <tr
                      key={bid.id}
                      className={`border-b border-slate-800/25 hover:bg-slate-800/15 transition-all ${flashing ? 'row-active' : ''} ${i % 2 !== 0 ? 'bg-slate-900/8' : ''}`}
                      style={{
                        transform: movement === 'up'
                          ? 'translateY(-2px)'
                          : movement === 'down' ? 'translateY(2px)' : 'translateY(0)',
                        opacity: entering ? 0 : 1,
                        animation: entering ? `rowEnter 0.4s ease ${i * 18}ms forwards` : undefined,
                        transition: movement ? 'transform 0.35s ease' : 'opacity 0.3s ease',
                      }}
                    >
                      <td className="py-2.5 px-4">
                        <div className="flex items-center gap-1.5">
                          {movement === 'up' && <ArrowUp className="w-3 h-3 text-emerald-400 flex-shrink-0" />}
                          {movement === 'down' && <ArrowDown className="w-3 h-3 text-slate-600 flex-shrink-0" />}
                          <span className="text-slate-200 font-mono font-semibold text-xs">{bid.id}</span>
                        </div>
                      </td>
                      <td className="py-2.5 px-4">
                        <span className="text-slate-500 text-xs">{bid.region}</span>
                      </td>
                      <td className="py-2.5 px-4 text-right">
                        <span className="text-slate-300 font-semibold tabular-nums text-xs">
                          {bid.shares.toLocaleString('en-US')}
                        </span>
                      </td>
                      <td className="py-2.5 px-4 text-right">
                        <span className="text-white font-bold tabular-nums">€{bid.bid}</span>
                      </td>
                      <td className="py-2.5 px-4 text-right">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs border font-bold tabular-nums ${premText} ${premBadge}`}>
                          {bid.premium}
                        </span>
                      </td>
                      <td className="py-2.5 px-4 text-right">
                        <CopyButton id={bid.id} copyLabel={t.demand.copy_id} copiedLabel={t.demand.copied} />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}
