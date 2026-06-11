import { ShieldCheck, Zap, ArrowRight, Lock } from 'lucide-react';
import { useLang } from '../context/LangContext';

function OrbitalMap() {
  return (
    <svg
      viewBox="0 0 480 480"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="absolute -bottom-10 -right-10 w-72 h-72 sm:w-96 sm:h-96 pointer-events-none select-none"
      style={{ opacity: 0.055 }}
      aria-hidden="true"
    >
      <path d="M50 420 Q180 40 430 100" stroke="#10b981" strokeWidth="1.2" strokeDasharray="6 4" />
      <circle cx="300" cy="180" r="4" stroke="#10b981" strokeWidth="1" />
      <circle cx="200" cy="280" r="3" stroke="#10b981" strokeWidth="0.8" />
      <circle cx="380" cy="130" r="3.5" stroke="#10b981" strokeWidth="1" />
      <ellipse cx="240" cy="240" rx="200" ry="80" stroke="#10b981" strokeWidth="0.7" />
      <ellipse cx="240" cy="240" rx="200" ry="80" stroke="#10b981" strokeWidth="0.5" transform="rotate(40 240 240)" />
      <ellipse cx="240" cy="240" rx="200" ry="80" stroke="#10b981" strokeWidth="0.5" transform="rotate(-40 240 240)" />
      <ellipse cx="240" cy="240" rx="140" ry="55" stroke="#10b981" strokeWidth="0.5" />
      <ellipse cx="240" cy="240" rx="80" ry="30" stroke="#10b981" strokeWidth="0.6" />
      <circle cx="240" cy="240" r="42" stroke="#10b981" strokeWidth="1" fill="rgba(16,185,129,0.05)" />
      <line x1="40" y1="240" x2="440" y2="240" stroke="#10b981" strokeWidth="0.4" strokeDasharray="3 5" />
      <line x1="240" y1="40" x2="240" y2="440" stroke="#10b981" strokeWidth="0.4" strokeDasharray="3 5" />
      <path d="M30 30 L30 60 M30 30 L60 30" stroke="#10b981" strokeWidth="1" />
      <path d="M450 30 L450 60 M450 30 L420 30" stroke="#10b981" strokeWidth="1" />
      <path d="M30 450 L30 420 M30 450 L60 450" stroke="#10b981" strokeWidth="1" />
      <path d="M450 450 L450 420 M450 450 L420 450" stroke="#10b981" strokeWidth="1" />
      {[30,80,140,200,260,320,380,430].map((x, i) => (
        <circle key={i} cx={x} cy={240 + Math.sin(x * 0.05) * 40} r="1.5" fill="#10b981" opacity="0.6" />
      ))}
    </svg>
  );
}

export default function InvestmentParams() {
  const { t } = useLang();

  const parameters = [
    { label: t.investment.entry_label, value: t.investment.entry_value, sub: t.investment.entry_sub },
    { label: t.investment.min_label, value: t.investment.min_value, sub: t.investment.min_sub },
    { label: t.investment.exit_label, value: t.investment.exit_value, sub: t.investment.exit_sub },
    { label: t.investment.fee_label, value: t.investment.fee_value, sub: t.investment.fee_sub },
  ];

  const guaranteeFeatures = [
    {
      icon: <ShieldCheck className="w-5 h-5 text-emerald-400" />,
      title: t.investment.guarantee_1_title,
      desc: t.investment.guarantee_1_desc,
    },
    {
      icon: (
        <svg className="w-5 h-5 text-amber-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
          <polyline points="16 7 22 7 22 13" />
        </svg>
      ),
      title: t.investment.guarantee_2_title,
      desc: t.investment.guarantee_2_desc,
    },
    {
      icon: <Zap className="w-5 h-5 text-cyan-400" />,
      title: t.investment.guarantee_3_title,
      desc: t.investment.guarantee_3_desc,
    },
  ];

  return (
    <section className="py-20 bg-[#000]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <p className="text-cyan-400 text-xs font-bold uppercase tracking-widest mb-3">{t.investment.section_label}</p>
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">{t.investment.title}</h2>
        </div>

        {/* Parameters */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {parameters.map((p) => (
            <div key={p.label} className="glass-card rounded-2xl p-6 text-center">
              <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-3">{p.label}</p>
              <p className="text-white font-black text-2xl sm:text-3xl tracking-tight mb-1">{p.value}</p>
              <p className="text-slate-500 text-xs">{p.sub}</p>
            </div>
          ))}
        </div>

        {/* Guarantee Box */}
        <div
          className="relative rounded-3xl overflow-hidden border border-emerald-500/18"
          style={{ background: 'linear-gradient(135deg, rgba(6,78,59,0.14) 0%, rgba(11,15,25,0.92) 40%, rgba(4,13,26,0.95) 100%)' }}
        >
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-500/40 to-transparent" />
          <OrbitalMap />
          <div className="absolute inset-0 bg-tech-grid opacity-40 pointer-events-none" />

          <div className="relative p-8 sm:p-12">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/12 border border-emerald-500/20 flex items-center justify-center flex-shrink-0"
                style={{ boxShadow: '0 0 20px rgba(16,185,129,0.15)' }}>
                <Lock className="w-6 h-6 text-emerald-400" />
              </div>
              <div>
                <h3 className="text-white font-black text-2xl sm:text-3xl tracking-tight mb-3">
                  {t.investment.guarantee_title}
                </h3>
                <p className="text-slate-400 text-base leading-relaxed max-w-3xl">
                  {t.investment.guarantee_body}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
              {guaranteeFeatures.map((f) => (
                <div
                  key={f.title}
                  className="rounded-xl bg-black/40 border border-slate-800/60 p-5 hover:border-emerald-500/20 hover:bg-emerald-900/8 transition-all duration-200 backdrop-blur-sm"
                >
                  <div className="flex items-center gap-2 mb-3">
                    {f.icon}
                    <span className="text-white font-bold text-sm">{f.title}</span>
                  </div>
                  <p className="text-slate-500 text-sm leading-relaxed">{f.desc}</p>
                </div>
              ))}
            </div>

            <div className="mt-8 pt-6 border-t border-slate-800/40">
              <p className="text-slate-700 text-xs leading-relaxed flex items-start gap-2">
                <ArrowRight className="w-3 h-3 text-slate-700 mt-0.5 flex-shrink-0" />
                {t.investment.guarantee_footnote}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
