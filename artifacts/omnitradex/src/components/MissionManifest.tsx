import { useState, useEffect, useRef } from 'react';
import { Rocket, Satellite, Globe2, ArrowUpRight } from 'lucide-react';
import { useLang } from '../context/LangContext';
import falconStill from '../assets/spacex/falcon9-launch.png';
import starlinkImg from '../assets/spacex/starlink-constellation.png';
import starshipStill from '../assets/spacex/starship.png';

const MISSION_PHOTOS = [falconStill, starlinkImg, starshipStill];

/* ── Blueprint SVGs ─────────────────────────────────────────────────────────── */

function FalconBlueprint() {
  return (
    <svg viewBox="0 0 160 200" fill="none" xmlns="http://www.w3.org/2000/svg"
      className="absolute bottom-0 right-0 w-36 h-44 opacity-[0.12] pointer-events-none select-none" aria-hidden="true">
      <rect x="70" y="20" width="20" height="140" rx="4" stroke="#60a5fa" strokeWidth="0.8" />
      <rect x="40" y="40" width="18" height="110" rx="4" stroke="#60a5fa" strokeWidth="0.8" />
      <rect x="102" y="40" width="18" height="110" rx="4" stroke="#60a5fa" strokeWidth="0.8" />
      <path d="M70 20 Q80 2 90 20" stroke="#60a5fa" strokeWidth="0.8" />
      <ellipse cx="80" cy="162" rx="8" ry="4" stroke="#60a5fa" strokeWidth="0.6" />
      <ellipse cx="49" cy="152" rx="7" ry="3.5" stroke="#60a5fa" strokeWidth="0.6" />
      <ellipse cx="111" cy="152" rx="7" ry="3.5" stroke="#60a5fa" strokeWidth="0.6" />
      <rect x="36" y="55" width="8" height="10" rx="1" stroke="#60a5fa" strokeWidth="0.5" />
      <rect x="116" y="55" width="8" height="10" rx="1" stroke="#60a5fa" strokeWidth="0.5" />
      <line x1="70" y1="70" x2="90" y2="70" stroke="#60a5fa" strokeWidth="0.5" strokeDasharray="3 2" />
      <circle cx="80" cy="90" r="2" stroke="#60a5fa" strokeWidth="0.5" />
      <line x1="76" y1="90" x2="84" y2="90" stroke="#60a5fa" strokeWidth="0.4" />
      <line x1="80" y1="86" x2="80" y2="94" stroke="#60a5fa" strokeWidth="0.4" />
    </svg>
  );
}

function StarlinkBlueprint() {
  return (
    <svg viewBox="0 0 160 160" fill="none" xmlns="http://www.w3.org/2000/svg"
      className="absolute bottom-2 right-0 w-36 h-36 opacity-[0.1] pointer-events-none select-none" aria-hidden="true">
      <ellipse cx="80" cy="80" rx="60" ry="25" stroke="#22d3ee" strokeWidth="0.6" />
      <ellipse cx="80" cy="80" rx="60" ry="25" stroke="#22d3ee" strokeWidth="0.4" transform="rotate(60 80 80)" />
      <ellipse cx="80" cy="80" rx="60" ry="25" stroke="#22d3ee" strokeWidth="0.4" transform="rotate(120 80 80)" />
      <circle cx="80" cy="80" r="18" stroke="#22d3ee" strokeWidth="0.7" />
      {[0,45,90,135,180,225,270,315].map((deg, i) => {
        const rad = (deg * Math.PI) / 180;
        const x = 80 + 60 * Math.cos(rad);
        const y = 80 + 25 * Math.sin(rad);
        return <circle key={i} cx={x} cy={y} r="2.5" stroke="#22d3ee" strokeWidth="0.5" />;
      })}
      <line x1="80" y1="40" x2="70" y2="40" stroke="#22d3ee" strokeWidth="0.8" />
      <line x1="80" y1="40" x2="90" y2="40" stroke="#22d3ee" strokeWidth="0.8" />
    </svg>
  );
}

function StarshipBlueprint() {
  return (
    <svg viewBox="0 0 120 220" fill="none" xmlns="http://www.w3.org/2000/svg"
      className="absolute bottom-0 right-2 w-28 h-48 opacity-[0.1] pointer-events-none select-none" aria-hidden="true">
      <path d="M45 100 Q60 15 75 100" stroke="#a78bfa" strokeWidth="0.8" />
      <rect x="45" y="100" width="30" height="55" rx="2" stroke="#a78bfa" strokeWidth="0.7" />
      <path d="M45 115 L30 135 L45 140" stroke="#a78bfa" strokeWidth="0.6" />
      <path d="M75 115 L90 135 L75 140" stroke="#a78bfa" strokeWidth="0.6" />
      <ellipse cx="55" cy="157" rx="4.5" ry="2.5" stroke="#a78bfa" strokeWidth="0.6" />
      <ellipse cx="65" cy="157" rx="4.5" ry="2.5" stroke="#a78bfa" strokeWidth="0.6" />
      <rect x="43" y="158" width="34" height="45" rx="2" stroke="#a78bfa" strokeWidth="0.7" />
      {[-10,-3,4,11].map((offset) => (
        <ellipse key={offset} cx={60 + offset} cy={205} rx="3" ry="1.5" stroke="#a78bfa" strokeWidth="0.5" />
      ))}
    </svg>
  );
}

function IgnitionOverlay() {
  return (
    <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
      style={{ background: 'radial-gradient(ellipse 70% 50% at 50% 100%, rgba(251,113,22,0.2) 0%, rgba(234,88,12,0.08) 40%, transparent 70%)' }}>
      <div className="absolute bottom-0 left-0 right-0 h-16 opacity-0 group-hover:opacity-100 transition-opacity duration-700"
        style={{ background: 'radial-gradient(ellipse 60% 80% at 50% 100%, rgba(251,146,60,0.28) 0%, rgba(234,88,12,0.12) 50%, transparent 80%)' }} />
    </div>
  );
}

const BLUEPRINTS = [FalconBlueprint, StarlinkBlueprint, StarshipBlueprint] as const;

const STYLES = [
  {
    icon: <Rocket className="w-6 h-6" />,
    gradient: 'from-[rgba(37,99,235,0.18)] to-[rgba(8,145,178,0.06)]',
    borderBase: 'rgba(59,130,246,0.18)',
    borderHover: 'rgba(96,165,250,0.45)',
    iconBg: 'bg-blue-500/15 text-blue-400',
    glowHover: 'rgba(59,130,246,0.14)',
    accentColor: '#60a5fa',
    tag: 'OPERATIONAL',
    tagColor: 'text-blue-400 border-blue-500/30 bg-blue-500/8',
  },
  {
    icon: <Satellite className="w-6 h-6" />,
    gradient: 'from-[rgba(8,145,178,0.18)] to-[rgba(13,148,136,0.06)]',
    borderBase: 'rgba(6,182,212,0.18)',
    borderHover: 'rgba(34,211,238,0.5)',
    iconBg: 'bg-cyan-500/15 text-cyan-400',
    glowHover: 'rgba(6,182,212,0.14)',
    accentColor: '#22d3ee',
    tag: 'EXPANDING',
    tagColor: 'text-cyan-400 border-cyan-500/30 bg-cyan-500/8',
  },
  {
    icon: <Globe2 className="w-6 h-6" />,
    gradient: 'from-[rgba(109,40,217,0.18)] to-[rgba(147,51,234,0.06)]',
    borderBase: 'rgba(139,92,246,0.18)',
    borderHover: 'rgba(167,139,250,0.5)',
    iconBg: 'bg-violet-500/15 text-violet-400',
    glowHover: 'rgba(139,92,246,0.14)',
    accentColor: '#a78bfa',
    tag: 'NEXT-GEN',
    tagColor: 'text-violet-400 border-violet-500/30 bg-violet-500/8',
  },
];

/* ── Mission stat bar ──────────────────────────────────────────────────────── */
function StatBar({ label, value, pct, color }: { label: string; value: string; pct: number; color: string }) {
  const [animated, setAnimated] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setAnimated(true); obs.disconnect(); }
    }, { threshold: 0.4 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <div ref={ref} className="mb-3">
      <div className="flex justify-between text-[11px] mb-1.5">
        <span className="text-slate-500 font-medium uppercase tracking-widest">{label}</span>
        <span className="font-bold" style={{ color }}>{value}</span>
      </div>
      <div className="h-1 bg-slate-800/80 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-1000 ease-out"
          style={{ width: animated ? `${pct}%` : '0%', background: color, boxShadow: `0 0 6px ${color}` }}
        />
      </div>
    </div>
  );
}

export default function MissionManifest() {
  const [hovered, setHovered] = useState<number | null>(null);
  const { t } = useLang();

  const missions = [
    {
      name: t.mission.falcon_name,
      stat1: t.mission.falcon_stat1,
      stat2: t.mission.falcon_stat2,
      desc: t.mission.falcon_desc,
      bars: [
        { label: 'Reliability', value: '99.2%', pct: 99 },
        { label: 'Reuse rate', value: '84%', pct: 84 },
      ],
    },
    {
      name: t.mission.starlink_name,
      stat1: t.mission.starlink_stat1,
      stat2: t.mission.starlink_stat2,
      desc: t.mission.starlink_desc,
      bars: [
        { label: 'Coverage', value: '72 countries', pct: 72 },
        { label: 'Active sats', value: '6,800+', pct: 88 },
      ],
    },
    {
      name: t.mission.starship_name,
      stat1: t.mission.starship_stat1,
      stat2: t.mission.starship_stat2,
      desc: t.mission.starship_desc,
      bars: [
        { label: 'Payload (LEO)', value: '150 t', pct: 95 },
        { label: 'Test flights', value: '8 complete', pct: 80 },
      ],
    },
  ];

  return (
    <section className="py-20 bg-[#000] bg-tech-grid relative">
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-transparent to-black/70 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <p className="text-cyan-400 text-xs font-bold uppercase tracking-widest mb-3">{t.mission.section_label}</p>
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight mb-4">{t.mission.title}</h2>
          <p className="text-slate-500 max-w-xl mx-auto text-base leading-relaxed">{t.mission.subtitle}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {missions.map((m, idx) => {
            const style = STYLES[idx];
            const isHov = hovered === idx;
            const Blueprint = BLUEPRINTS[idx];
            const photo = MISSION_PHOTOS[idx];
            return (
              <div
                key={idx}
                className={`relative rounded-2xl bg-gradient-to-br ${style.gradient} overflow-hidden group cursor-default`}
                style={{
                  border: `1px solid ${isHov ? style.borderHover : style.borderBase}`,
                  boxShadow: isHov
                    ? `0 0 50px ${style.glowHover}, 0 8px 40px rgba(0,0,0,0.7)`
                    : '0 4px 24px rgba(0,0,0,0.55)',
                  transform: isHov ? 'scale(1.025) translateY(-3px)' : 'scale(1) translateY(0)',
                  transition: 'all 0.35s cubic-bezier(0.22, 1, 0.36, 1)',
                  backdropFilter: 'blur(10px)',
                }}
                onMouseEnter={() => setHovered(idx)}
                onMouseLeave={() => setHovered(null)}
              >
                {/* Photo header */}
                <div className="relative h-44 overflow-hidden">
                  <img
                    src={photo}
                    alt={m.name}
                    className="w-full h-full object-cover transition-transform duration-700"
                    style={{ transform: isHov ? 'scale(1.08)' : 'scale(1.02)' }}
                  />
                  <div className="absolute inset-0" style={{
                    background: `linear-gradient(180deg, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.7) 100%)`,
                  }} />
                  {/* Mission tag */}
                  <div className="absolute top-3 left-3">
                    <span className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${style.tagColor}`}>
                      {style.tag}
                    </span>
                  </div>
                  {/* Stat overlay */}
                  <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between">
                    <div>
                      <p className="text-white font-black text-lg leading-tight">{m.stat1}</p>
                      <p className="text-slate-300 text-xs">{m.stat2}</p>
                    </div>
                    <div className={`w-9 h-9 rounded-xl ${style.iconBg} flex items-center justify-center`}
                      style={{ boxShadow: isHov ? `0 0 20px ${style.glowHover}` : 'none', transition: 'box-shadow 0.3s' }}>
                      {style.icon}
                    </div>
                  </div>
                </div>

                {/* Corner lines */}
                <div className="absolute top-0 left-0 right-0 h-px"
                  style={{ background: `linear-gradient(90deg, transparent, ${style.borderHover}, transparent)`, opacity: isHov ? 0.8 : 0.25, transition: 'opacity 0.3s' }} />
                <div className="absolute top-3 left-3 w-4 h-4 border-t border-l" style={{ borderColor: isHov ? style.borderHover : 'transparent', transition: 'border-color 0.3s' }} />
                <div className="absolute bottom-3 right-3 w-4 h-4 border-b border-r" style={{ borderColor: isHov ? style.borderHover : 'transparent', transition: 'border-color 0.3s' }} />

                <Blueprint />
                <IgnitionOverlay />

                {/* Card body */}
                <div className="relative z-10 p-6 pt-5">
                  <h3 className="text-white font-black text-xl mb-3">{m.name}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed mb-5">{m.desc}</p>

                  <div className="border-t border-white/6 pt-4">
                    {m.bars.map(bar => (
                      <StatBar key={bar.label} label={bar.label} value={bar.value} pct={bar.pct} color={style.accentColor} />
                    ))}
                  </div>

                  <button
                    className="mt-4 w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-all duration-300"
                    style={{
                      background: isHov ? `${style.accentColor}18` : 'rgba(255,255,255,0.04)',
                      border: `1px solid ${isHov ? style.borderHover : style.borderBase}`,
                      color: isHov ? style.accentColor : '#64748b',
                    }}
                  >
                    Mission Details
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
