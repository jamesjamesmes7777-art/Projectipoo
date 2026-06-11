import { AlertTriangle } from 'lucide-react';
import { useLang } from '../context/LangContext';

export default function LaunchBanner() {
  const { t } = useLang();

  return (
    <div
      className="w-full border-b border-amber-500/20 relative overflow-hidden"
      style={{ background: 'linear-gradient(90deg, rgba(120,53,15,0.25) 0%, rgba(146,64,14,0.18) 50%, rgba(120,53,15,0.25) 100%)' }}
    >
      {/* Ambient scan shimmer */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'linear-gradient(90deg, transparent 0%, rgba(251,191,36,0.04) 50%, transparent 100%)',
          backgroundSize: '200% 100%',
          animation: 'shimmer 4s linear infinite',
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 relative">
        <div className="flex items-start sm:items-center gap-3">
          {/* Badge */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-500/15 border border-amber-500/30 text-amber-400 text-[10px] font-black uppercase tracking-widest whitespace-nowrap flex-shrink-0">
            <AlertTriangle className="w-3 h-3" />
            NOTICE
          </div>

          {/* Launch date highlight */}
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold uppercase tracking-widest whitespace-nowrap flex-shrink-0">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            12/06/2026
          </div>

          {/* Banner text */}
          <p className="text-amber-200/80 text-xs leading-relaxed font-medium">
            {t.alerts.launch_banner}
          </p>
        </div>
      </div>
    </div>
  );
}
