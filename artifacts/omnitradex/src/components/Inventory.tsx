import { useEffect, useRef, useState } from 'react';
import { Users, TrendingUp, Package } from 'lucide-react';
import { useLang } from '../context/LangContext';
import { useInventoryTicker } from '../hooks/useInventoryTicker';
import { useCountUp } from '../hooks/useCountUp';

function AnimatedCard({
  label,
  target,
  suffix,
  accent = 'text-white',
  icon,
  delay = 0,
  fmtNum,
}: {
  label: string;
  target: number;
  suffix?: string;
  accent?: string;
  icon: React.ReactNode;
  delay?: number;
  fmtNum: (n: number) => string;
}) {
  const [started, setStarted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setStarted(true); obs.disconnect(); }
    }, { threshold: 0.3 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  const value = useCountUp(started ? target : 0, 1500, delay);

  return (
    <div
      ref={ref}
      className="glass-card rounded-2xl p-5 flex flex-col gap-3 holo-corners min-w-0"
      style={{
        opacity: started ? 1 : 0,
        transform: started ? 'translateY(0)' : 'translateY(10px)',
        transition: `opacity 0.5s ease ${delay}ms, transform 0.5s ease ${delay}ms`,
      }}
    >
      <div className="flex items-start justify-between gap-2">
        <p className="text-slate-500 text-[11px] font-semibold uppercase tracking-wider leading-tight">{label}</p>
        <div className="w-7 h-7 rounded-lg bg-slate-800/60 flex items-center justify-center text-slate-400 flex-shrink-0">
          {icon}
        </div>
      </div>
      <div>
        <p className={`text-2xl sm:text-3xl font-black tabular-nums tracking-tight ${accent} leading-none`}>
          {fmtNum(value)}
        </p>
        {suffix && <p className="mt-1 text-xs text-slate-500 font-medium">{suffix}</p>}
      </div>
    </div>
  );
}

function StaticCard({
  label,
  value,
  suffix,
  accent = 'text-white',
  icon,
  delay = 0,
}: {
  label: string;
  value: string;
  suffix?: string;
  accent?: string;
  icon: React.ReactNode;
  delay?: number;
}) {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setVisible(true); obs.disconnect(); }
    }, { threshold: 0.3 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className="glass-card rounded-2xl p-5 flex flex-col gap-3 holo-corners min-w-0"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(10px)',
        transition: `opacity 0.5s ease ${delay}ms, transform 0.5s ease ${delay}ms`,
      }}
    >
      <div className="flex items-start justify-between gap-2">
        <p className="text-slate-500 text-[11px] font-semibold uppercase tracking-wider leading-tight">{label}</p>
        <div className="w-7 h-7 rounded-lg bg-slate-800/60 flex items-center justify-center text-slate-400 flex-shrink-0">
          {icon}
        </div>
      </div>
      <div>
        <p className={`text-2xl sm:text-3xl font-black tabular-nums tracking-tight ${accent} leading-none`}>{value}</p>
        {suffix && <p className="mt-1 text-xs text-slate-500 font-medium">{suffix}</p>}
      </div>
    </div>
  );
}

export default function Inventory() {
  const { t, fmtNum } = useLang();
  const { total, allocated, available, investors, pct } = useInventoryTicker();

  const allocatedPct = pct.toFixed(2);
  const availablePct = (100 - pct).toFixed(2);

  return (
    <section className="py-20 relative bg-[#000] bg-tech-grid">
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/60 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="flex items-center gap-4 mb-10">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-slate-800 to-transparent" />
          <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-black/80 border border-slate-800 text-slate-400 text-xs font-semibold uppercase tracking-widest whitespace-nowrap backdrop-blur-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            {t.inventory.section_label}
          </div>
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-slate-800 to-transparent" />
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8 overflow-hidden">
          <AnimatedCard
            label={t.inventory.um_shares}
            target={total}
            suffix={t.inventory.spcx_shares}
            accent="text-white"
            icon={<Package className="w-3.5 h-3.5" />}
            delay={0}
            fmtNum={fmtNum}
          />
          <StaticCard
            label={t.inventory.alloc_shares}
            value={fmtNum(allocated)}
            suffix={`${allocatedPct}% ${t.inventory.p_allocated.toLowerCase()}`}
            accent="text-emerald-400"
            icon={<TrendingUp className="w-3.5 h-3.5" />}
            delay={100}
          />
          <AnimatedCard
            label={t.inventory.avail_shares}
            target={available}
            suffix={`${availablePct}% ${t.inventory.p_remaining}`}
            accent="text-cyan-400"
            icon={<Package className="w-3.5 h-3.5" />}
            delay={200}
            fmtNum={fmtNum}
          />
          <StaticCard
            label={t.inventory.active_inv}
            value={fmtNum(investors)}
            suffix={t.inventory.institutional_buyers}
            accent="text-emerald-400"
            icon={<Users className="w-3.5 h-3.5" />}
            delay={300}
          />
        </div>

        {/* Allocation Progress */}
        <div className="glass-card rounded-2xl p-6">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
            <p className="text-slate-400 text-sm font-semibold">{t.inventory.progress_title}</p>
            <div className="flex items-center gap-4 text-xs">
              <span className="flex items-center gap-1.5 text-slate-400 font-semibold">
                <span className="w-2.5 h-2.5 rounded-sm bg-cyan-500/70" />
                {t.inventory.p_allocated} — {allocatedPct}%
              </span>
              <span className="flex items-center gap-1.5 text-slate-600">
                <span className="w-2.5 h-2.5 rounded-sm bg-slate-800 border border-slate-700" />
                {availablePct}% {t.inventory.p_remaining}
              </span>
            </div>
          </div>
          <div className="h-2.5 bg-slate-900 rounded-full overflow-hidden relative">
            <div
              className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full transition-all duration-700"
              style={{ width: `${pct}%` }}
            />
            <div className="absolute inset-0 progress-laser rounded-full" />
          </div>
          <div className="mt-3 flex items-center justify-between text-xs text-slate-700">
            <span>{fmtNum(allocated)} {t.inventory.p_allocated.toLowerCase()}</span>
            <span className="text-slate-500 font-medium">{fmtNum(total)} {t.inventory.total}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
