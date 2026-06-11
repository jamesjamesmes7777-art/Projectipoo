import { Shield, FileSearch } from 'lucide-react';
import { Link } from 'wouter';
import { useLang, type LangCode } from '../context/LangContext';

const LANGS: LangCode[] = ['en', 'el', 'it', 'de', 'es'];

export default function Header() {
  const { lang, setLang, t } = useLang();

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md border-b border-white/5"
      style={{ background: 'rgba(0,0,0,0.9)' }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3">
        {/* Logo */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
            <span className="text-white font-black text-xs tracking-tight">OTX</span>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-white font-bold text-lg tracking-tight">{t.header.brand}</span>
            <span className="text-slate-500 text-xs font-medium hidden sm:inline">{t.header.brand_sub}</span>
          </div>
        </div>

        {/* Center Pills */}
        <div className="hidden md:flex items-center gap-2 flex-1 justify-center">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/25 text-cyan-400 text-xs font-semibold tracking-wide">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            {t.header.pill_allocation}
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-800/50 border border-slate-700/40 text-slate-300 text-xs font-medium">
            <Shield className="w-3 h-3 text-emerald-400" />
            {t.header.pill_fca}
          </div>
        </div>

        {/* Right: Language selector + CTA */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {/* Language toggle */}
          <div className="hidden sm:flex items-center gap-0.5 p-1 rounded-lg bg-slate-900/80 border border-slate-800/60">
            {LANGS.map(code => (
              <button
                key={code}
                onClick={() => setLang(code)}
                className={`px-2 py-1 rounded-md text-[11px] font-bold uppercase tracking-wide transition-all duration-150 ${
                  lang === code
                    ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                    : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                {code}
              </button>
            ))}
          </div>

          {/* Mobile language selector (compact) */}
          <div className="flex sm:hidden items-center gap-0.5 p-0.5 rounded-md bg-slate-900/80 border border-slate-800/60">
            {LANGS.map(code => (
              <button
                key={code}
                onClick={() => setLang(code)}
                className={`px-1.5 py-0.5 rounded text-[10px] font-bold uppercase transition-all ${
                  lang === code ? 'bg-cyan-500/20 text-cyan-400' : 'text-slate-600 hover:text-slate-400'
                }`}
              >
                {code}
              </button>
            ))}
          </div>

          <Link
            href="/verify"
            className="btn-outline px-3 py-2 rounded-lg border border-slate-700 hover:border-cyan-500/40 text-slate-300 hover:text-white text-sm font-semibold tracking-wide whitespace-nowrap flex items-center gap-1.5 transition-all"
          >
            <FileSearch className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Verify</span>
          </Link>

          <button
            className="btn-primary px-4 py-2 rounded-lg text-white text-sm font-semibold tracking-wide whitespace-nowrap"
          >
            {t.header.btn_secure}
          </button>
        </div>
      </div>
    </header>
  );
}
