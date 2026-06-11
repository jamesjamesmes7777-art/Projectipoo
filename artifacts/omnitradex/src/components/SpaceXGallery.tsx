import { useState, useEffect, useRef } from 'react';
import { ExternalLink, Play } from 'lucide-react';

const GALLERY = [
  {
    img: 'https://images.pexels.com/photos/586063/pexels-photo-586063.jpeg?auto=compress&cs=tinysrgb&w=900&q=80',
    title: 'Falcon 9 Night Launch',
    sub: 'T+0:00 · Kennedy Space Center',
    span: 'col-span-2 row-span-2',
    hasVideo: true,
  },
  {
    img: 'https://images.pexels.com/photos/2150/sky-space-dark-galaxy.jpg?auto=compress&cs=tinysrgb&w=900&q=80',
    title: 'Deep Space Operations',
    sub: 'Starlink Mega-Constellation',
    span: 'col-span-1 row-span-1',
    hasVideo: false,
  },
  {
    img: 'https://images.pexels.com/photos/87651/earth-blue-planet-globe-planet-87651.jpeg?auto=compress&cs=tinysrgb&w=900&q=80',
    title: 'Earth from Orbit',
    sub: 'Dragon Crew · ISS Approach',
    span: 'col-span-1 row-span-1',
    hasVideo: false,
  },
  {
    img: 'https://images.pexels.com/photos/1169754/pexels-photo-1169754.jpeg?auto=compress&cs=tinysrgb&w=900&q=80',
    title: 'Milky Way · Launch Window',
    sub: 'Booster Recovery · LZ-1',
    span: 'col-span-1 row-span-1',
    hasVideo: false,
  },
  {
    img: 'https://images.pexels.com/photos/39896/space-station-moon-astronaut-starry-sky-39896.jpeg?auto=compress&cs=tinysrgb&w=900&q=80',
    title: 'Orbital Station',
    sub: 'Dragon Docking · 400km Altitude',
    span: 'col-span-1 row-span-1',
    hasVideo: false,
  },
  {
    img: 'https://images.pexels.com/photos/2166/flight-sky-earth-space.jpg?auto=compress&cs=tinysrgb&w=900&q=80',
    title: 'Starship Ascent',
    sub: 'IFT-8 · Full Stack Integration',
    span: 'col-span-2 row-span-1',
    hasVideo: true,
  },
];

interface GalleryCardProps {
  item: typeof GALLERY[0];
  index: number;
}

function GalleryCard({ item, index }: GalleryCardProps) {
  const [visible, setVisible] = useState(false);
  const [hovered, setHovered] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setVisible(true); obs.disconnect(); }
    }, { threshold: 0.15 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`relative overflow-hidden rounded-2xl cursor-pointer group ${item.span}`}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0) scale(1)' : 'translateY(24px) scale(0.97)',
        transition: `opacity 0.65s ease ${index * 80}ms, transform 0.65s cubic-bezier(0.22,1,0.36,1) ${index * 80}ms`,
        minHeight: 200,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Photo */}
      <img
        src={item.img}
        alt={item.title}
        className="absolute inset-0 w-full h-full object-cover"
        style={{
          transform: hovered ? 'scale(1.07)' : 'scale(1.02)',
          transition: 'transform 0.7s cubic-bezier(0.22,1,0.36,1)',
        }}
      />

      {/* Base gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

      {/* Hover overlay */}
      <div
        className="absolute inset-0 transition-opacity duration-400"
        style={{
          opacity: hovered ? 1 : 0,
          background: 'linear-gradient(135deg, rgba(6,182,212,0.15) 0%, rgba(37,99,235,0.1) 100%)',
        }}
      />

      {/* Scan line effect on hover */}
      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-300"
        style={{
          opacity: hovered ? 1 : 0,
          background: 'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(34,211,238,0.02) 3px, rgba(34,211,238,0.02) 4px)',
        }}
      />

      {/* Border glow */}
      <div
        className="absolute inset-0 rounded-2xl transition-all duration-400 pointer-events-none"
        style={{
          border: `1px solid ${hovered ? 'rgba(34,211,238,0.4)' : 'rgba(34,211,238,0.1)'}`,
          boxShadow: hovered ? 'inset 0 0 30px rgba(34,211,238,0.08), 0 0 30px rgba(34,211,238,0.12)' : 'none',
        }}
      />

      {/* Play button for video items */}
      {item.hasVideo && (
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transition-all duration-400"
          style={{
            opacity: hovered ? 1 : 0.5,
            transform: `translate(-50%, -50%) scale(${hovered ? 1.1 : 1})`,
          }}
        >
          <div className="w-14 h-14 rounded-full border-2 border-white/60 bg-black/40 backdrop-blur-sm flex items-center justify-center"
            style={{ boxShadow: '0 0 30px rgba(34,211,238,0.3)' }}>
            <Play className="w-5 h-5 text-white fill-white ml-0.5" />
          </div>
        </div>
      )}

      {/* Corner bracket */}
      <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <ExternalLink className="w-4 h-4 text-cyan-400" />
      </div>

      {/* Caption */}
      <div
        className="absolute bottom-0 left-0 right-0 p-4 transition-transform duration-400"
        style={{ transform: hovered ? 'translateY(0)' : 'translateY(4px)' }}
      >
        <p className="text-white font-bold text-sm leading-tight mb-1">{item.title}</p>
        <p className="text-slate-400 text-xs font-medium">{item.sub}</p>
      </div>
    </div>
  );
}

/* ── Mission achievement strip ─────────────────────────────────────────────── */
const ACHIEVEMENTS = [
  { num: '350+', label: 'Falcon 9 Launches' },
  { num: '6,800+', label: 'Starlink Satellites' },
  { num: '99.2%', label: 'Mission Success' },
  { num: '$350B+', label: 'Estimated Valuation' },
  { num: '30+', label: 'Booster Reflights' },
  { num: '2', label: 'Active Launchpads' },
];

function AchievementStrip() {
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
      className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-px bg-slate-800/40 rounded-2xl overflow-hidden border border-slate-800/60 mb-12"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(16px)',
        transition: 'opacity 0.6s ease, transform 0.6s ease',
      }}
    >
      {ACHIEVEMENTS.map((a, i) => (
        <div key={i} className="bg-black/80 px-4 py-5 text-center hover:bg-slate-900/80 transition-colors">
          <p className="text-cyan-400 font-black text-xl sm:text-2xl tabular-nums tracking-tight">{a.num}</p>
          <p className="text-slate-600 text-[10px] uppercase tracking-widest mt-1 font-semibold">{a.label}</p>
        </div>
      ))}
    </div>
  );
}

export default function SpaceXGallery() {
  return (
    <section className="py-20 bg-black relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-tech-grid opacity-50 pointer-events-none" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] pointer-events-none"
        style={{ background: 'radial-gradient(ellipse, rgba(6,182,212,0.04) 0%, transparent 70%)' }} />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section header */}
        <div className="text-center mb-12">
          <p className="text-cyan-400 text-xs font-bold uppercase tracking-widest mb-3">SpaceX · Mission Portfolio</p>
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight mb-4">
            The Archive of{' '}
            <span className="text-gradient-cyan">Human Ambition</span>
          </h2>
          <p className="text-slate-500 max-w-xl mx-auto text-base leading-relaxed">
            A decade of SpaceX innovation — from first flight to the world's most ambitious space program, now open for private investment.
          </p>
        </div>

        {/* Achievement strip */}
        <AchievementStrip />

        {/* Photo grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 auto-rows-[200px]">
          {GALLERY.map((item, i) => (
            <GalleryCard key={i} item={item} index={i} />
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-10 flex items-center justify-center">
          <div className="flex items-center gap-3 px-6 py-3 rounded-2xl bg-black/60 border border-slate-800/80 backdrop-blur-md text-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-slate-400">SpaceX IPO target:</span>
            <span className="text-white font-bold">Q4 2026</span>
            <span className="text-slate-700 mx-1">·</span>
            <span className="text-cyan-400 font-semibold">Allocation window open</span>
          </div>
        </div>
      </div>
    </section>
  );
}
