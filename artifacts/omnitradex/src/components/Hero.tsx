import { useState, useEffect, useRef } from 'react';
import { TrendingUp, ChevronRight, CalendarDays, Rocket } from 'lucide-react';
import StarField from './StarField';
import { useLang } from '../context/LangContext';
import { useAllocation } from './AllocationModal';

const HERO_BG = 'https://images.pexels.com/photos/586063/pexels-photo-586063.jpeg?auto=compress&cs=tinysrgb&w=1920&q=80';

function getTimeUntil(target: Date) {
  const now = new Date();
  const diff = target.getTime() - now.getTime();
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
    minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
    seconds: Math.floor((diff % (1000 * 60)) / 1000),
  };
}

function pad(n: number) {
  return String(n).padStart(2, '0');
}

function FlipDigit({ ch }: { ch: string }) {
  const [display, setDisplay] = useState(ch);
  const [key, setKey] = useState(0);
  const prev = useRef(ch);

  useEffect(() => {
    if (ch !== prev.current) {
      prev.current = ch;
      setKey(k => k + 1);
      setDisplay(ch);
    }
  }, [ch]);

  return (
    <span className="digit-clip" style={{ width: '0.62em' }}>
      <span key={key} className="digit-inner">{display}</span>
    </span>
  );
}

function FlipNumber({ value }: { value: number }) {
  const s = pad(value);
  return (
    <span className="font-black tabular-nums tracking-tight text-white" style={{ fontSize: 'inherit' }}>
      {s.split('').map((ch, i) => <FlipDigit key={i} ch={ch} />)}
    </span>
  );
}

function CountdownUnit({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <div
        className="relative glass-card rounded-xl px-4 sm:px-7 py-3 sm:py-5 min-w-[72px] sm:min-w-[96px] text-center overflow-hidden holo-corners"
        style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)' }}
      >
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/5 to-transparent pointer-events-none" />
        <FlipNumber value={value} />
      </div>
      <span className="mt-2.5 text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">{label}</span>
    </div>
  );
}

/* ── Live mission ticker ───────────────────────────────────────────────────── */
const TICKER_ITEMS = [
  'Falcon 9 Booster B1067 · 25 flights',
  'Starship IFT-8 · Full mission success',
  'Starlink Group 12-14 · Deployed',
  'Dragon CRS-32 · ISS docking confirmed',
  'SpaceX valuation · $350B+',
  'Starlink active satellites · 6,800+',
];

function MissionTicker() {
  const [idx, setIdx] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    const id = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setIdx(i => (i + 1) % TICKER_ITEMS.length);
        setFade(true);
      }, 350);
    }, 3200);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="flex items-center gap-3 px-4 py-2 rounded-full bg-black/60 border border-slate-800/80 backdrop-blur-md text-[11px] max-w-sm mx-auto mb-8">
      <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/25 text-cyan-400 font-black uppercase tracking-widest whitespace-nowrap text-[9px]">
        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
        LIVE
      </div>
      <span
        className="text-slate-400 font-medium transition-opacity duration-300"
        style={{ opacity: fade ? 1 : 0 }}
      >
        {TICKER_ITEMS[idx]}
      </span>
    </div>
  );
}

/* ── Animated Rocket silhouette ────────────────────────────────────────────── */
function RocketSilhouette() {
  return (
    <div
      className="absolute right-4 xl:right-16 bottom-0 z-10 pointer-events-none select-none hidden lg:block"
      style={{ animation: 'rocketFloat 8s ease-in-out infinite' }}
    >
      {/* Engine glow */}
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-20 rounded-full"
        style={{
          height: 120,
          background: 'radial-gradient(ellipse at 50% 100%, rgba(251,146,60,0.55) 0%, rgba(234,88,12,0.25) 40%, transparent 70%)',
          animation: 'thrustPulse 0.12s ease-in-out infinite alternate',
          filter: 'blur(4px)',
        }}
      />
      {/* Thrust cone */}
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2"
        style={{
          width: 0,
          height: 0,
          borderLeft: '14px solid transparent',
          borderRight: '14px solid transparent',
          borderTop: '60px solid rgba(251,191,36,0.18)',
          filter: 'blur(2px)',
          animation: 'thrustPulse 0.08s ease-in-out infinite alternate',
        }}
      />
      {/* Rocket body SVG */}
      <svg width="80" height="280" viewBox="0 0 80 280" fill="none" xmlns="http://www.w3.org/2000/svg"
        style={{ opacity: 0.55, filter: 'drop-shadow(0 0 8px rgba(34,211,238,0.3))' }}
      >
        {/* Main body */}
        <rect x="28" y="60" width="24" height="160" rx="4" fill="rgba(148,163,184,0.4)" stroke="rgba(34,211,238,0.4)" strokeWidth="0.8" />
        {/* Nose cone */}
        <path d="M28 60 Q40 5 52 60Z" fill="rgba(148,163,184,0.45)" stroke="rgba(34,211,238,0.4)" strokeWidth="0.8" />
        {/* Left fin */}
        <path d="M28 180 L8 230 L28 220Z" fill="rgba(100,116,139,0.5)" stroke="rgba(34,211,238,0.3)" strokeWidth="0.7" />
        {/* Right fin */}
        <path d="M52 180 L72 230 L52 220Z" fill="rgba(100,116,139,0.5)" stroke="rgba(34,211,238,0.3)" strokeWidth="0.7" />
        {/* Engine cluster */}
        <ellipse cx="34" cy="222" rx="5" ry="3" fill="rgba(251,146,60,0.5)" />
        <ellipse cx="46" cy="222" rx="5" ry="3" fill="rgba(251,146,60,0.5)" />
        {/* Grid fins */}
        <rect x="20" y="90" width="8" height="14" rx="1" fill="none" stroke="rgba(34,211,238,0.3)" strokeWidth="0.7" />
        <rect x="52" y="90" width="8" height="14" rx="1" fill="none" stroke="rgba(34,211,238,0.3)" strokeWidth="0.7" />
        {/* Interstage line */}
        <line x1="28" y1="140" x2="52" y2="140" stroke="rgba(34,211,238,0.2)" strokeWidth="0.6" strokeDasharray="3 2" />
        {/* Logo area */}
        <rect x="33" y="155" width="14" height="8" rx="1" fill="none" stroke="rgba(34,211,238,0.25)" strokeWidth="0.5" />
        {/* Vapour trail */}
        <ellipse cx="40" cy="248" rx="10" ry="4" fill="rgba(148,163,184,0.12)" />
        <ellipse cx="40" cy="260" rx="7" ry="3" fill="rgba(148,163,184,0.07)" />
        <ellipse cx="40" cy="270" rx="5" ry="2" fill="rgba(148,163,184,0.04)" />
      </svg>
    </div>
  );
}

/* ── Orbital ring decoration ───────────────────────────────────────────────── */
function OrbitalRing() {
  return (
    <div className="absolute left-0 right-0 top-0 bottom-0 overflow-hidden pointer-events-none select-none">
      <div
        className="absolute"
        style={{
          width: 600, height: 600,
          left: '50%', top: '40%',
          transform: 'translate(-50%, -50%)',
          borderRadius: '50%',
          border: '1px solid rgba(34,211,238,0.04)',
          animation: 'orbitSpin 60s linear infinite',
        }}
      >
        {/* Satellite dot */}
        <div style={{
          position: 'absolute', top: 0, left: '50%', transform: 'translate(-50%, -50%)',
          width: 6, height: 6, borderRadius: '50%',
          background: 'rgba(34,211,238,0.6)',
          boxShadow: '0 0 8px rgba(34,211,238,0.8)',
        }} />
      </div>
      <div
        className="absolute"
        style={{
          width: 900, height: 450,
          left: '50%', top: '50%',
          transform: 'translate(-50%, -50%) rotateX(70deg)',
          borderRadius: '50%',
          border: '1px solid rgba(34,211,238,0.03)',
        }}
      />
    </div>
  );
}

export default function Hero() {
  const target = new Date('2026-12-09T09:30:00-05:00');
  const [time, setTime] = useState(() => getTimeUntil(target));
  const { t } = useLang();
  const { open: openAllocation } = useAllocation();

  useEffect(() => {
    const interval = setInterval(() => setTime(getTimeUntil(target)), 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section
      id="allocation"
      className="relative min-h-screen flex items-center justify-center pt-16 overflow-hidden"
    >
      {/* ── SpaceX photo background ── */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `url(${HERO_BG})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center 35%',
          animation: 'slowZoom 30s ease-in-out infinite alternate',
        }}
      />
      {/* Dark overlay gradient */}
      <div className="absolute inset-0 z-1" style={{
        background: 'linear-gradient(180deg, rgba(0,0,0,0.88) 0%, rgba(0,5,18,0.82) 40%, rgba(0,0,0,0.92) 100%)',
      }} />
      {/* Radial glow from center */}
      <div className="absolute inset-0 z-1 pointer-events-none" style={{
        background: 'radial-gradient(ellipse 70% 50% at 50% 25%, rgba(7,25,60,0.55) 0%, transparent 70%)',
      }} />

      <StarField />
      <OrbitalRing />
      <div className="absolute inset-0 bg-tech-grid opacity-70 pointer-events-none z-2" />
      <div className="absolute bottom-0 left-0 right-0 h-[30%] bg-gradient-to-t from-black/90 to-transparent z-2 pointer-events-none" />

      {/* ── Animated rocket silhouette ── */}
      <RocketSilhouette />

      {/* ── Content ── */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">

        {/* Mission ticker */}
        <MissionTicker />

        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/25 text-amber-400 text-xs font-bold tracking-widest uppercase mb-6 animate-fade-in backdrop-blur-sm">
          <CalendarDays className="w-3.5 h-3.5" />
          {t.hero.badge}
        </div>

        {/* Headline */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-black text-white leading-[1.05] tracking-tight mb-6 animate-fade-in" style={{ animationDelay: '0.1s', animationFillMode: 'both' }}>
          {t.hero.title_1}{' '}
          <span className="text-gradient-cyan">{t.hero.title_highlight}</span>
          <br className="hidden sm:block" />{' '}
          {t.hero.title_2}
        </h1>

        <p className="text-slate-400 text-lg sm:text-xl max-w-2xl mx-auto mb-12 leading-relaxed animate-fade-in" style={{ animationDelay: '0.2s', animationFillMode: 'both' }}>
          {t.hero.subtitle}
        </p>

        {/* Countdown */}
        <div className="mb-12 animate-fade-in" style={{ animationDelay: '0.3s', animationFillMode: 'both' }}>
          <p className="text-slate-600 text-[10px] font-bold uppercase tracking-[0.25em] mb-5">
            {t.hero.countdown_label}
          </p>
          <div className="flex items-start justify-center gap-2 sm:gap-4">
            <CountdownUnit value={time.days} label={t.hero.days} />
            <div className="text-cyan-500/40 font-black mt-3 sm:mt-5 text-2xl sm:text-3xl select-none">:</div>
            <CountdownUnit value={time.hours} label={t.hero.hours} />
            <div className="text-cyan-500/40 font-black mt-3 sm:mt-5 text-2xl sm:text-3xl select-none">:</div>
            <CountdownUnit value={time.minutes} label={t.hero.minutes} />
            <div className="text-cyan-500/40 font-black mt-3 sm:mt-5 text-2xl sm:text-3xl select-none">:</div>
            <CountdownUnit value={time.seconds} label={t.hero.seconds} />
          </div>
        </div>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in" style={{ animationDelay: '0.4s', animationFillMode: 'both' }}>
          <button
            onClick={openAllocation}
            className="btn-primary w-full sm:w-auto px-8 py-4 rounded-xl text-white font-bold text-base tracking-wide flex items-center justify-center gap-2"
          >
            <TrendingUp className="w-5 h-5" />
            {t.hero.cta_primary}
            <ChevronRight className="w-4 h-4" />
          </button>
          <a
            href="#demand-board"
            className="btn-outline w-full sm:w-auto px-8 py-4 rounded-xl text-slate-300 font-semibold text-base border border-slate-700 hover:border-cyan-500/40 hover:text-white hover:shadow-[0_0_20px_rgba(34,211,238,0.1)]"
          >
            {t.hero.cta_secondary}
          </a>
        </div>

        {/* Trust indicators */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-5 text-[11px] text-slate-600 font-medium animate-fade-in" style={{ animationDelay: '0.5s', animationFillMode: 'both' }}>
          {[t.hero.trust_fca, t.hero.trust_segregated, t.hero.trust_buyback, t.hero.trust_kyc].map(item => (
            <span key={item} className="flex items-center gap-1.5">
              <span className="w-1 h-1 rounded-full bg-emerald-500/80" />
              {item}
            </span>
          ))}
        </div>

        {/* SpaceX stock indicator strip */}
        <div className="mt-10 inline-flex items-center gap-6 px-6 py-3 rounded-2xl bg-black/50 border border-slate-800/70 backdrop-blur-md text-xs animate-fade-in" style={{ animationDelay: '0.6s', animationFillMode: 'both' }}>
          <div className="flex items-center gap-2">
            <Rocket className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-slate-500 uppercase tracking-widest text-[10px]">SpX</span>
          </div>
          <div className="w-px h-4 bg-slate-800" />
          <div className="flex items-center gap-1.5">
            <span className="text-white font-black">$195.00</span>
            <span className="text-emerald-400 font-bold">+2.34%</span>
          </div>
          <div className="w-px h-4 bg-slate-800" />
          <span className="text-slate-600">Pre-IPO · OTC</span>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent pointer-events-none z-10" />
    </section>
  );
}
