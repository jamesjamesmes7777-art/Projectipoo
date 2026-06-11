import { ShieldCheck, Landmark, Users, FileSearch } from 'lucide-react';
import { useLang } from '../context/LangContext';

export default function Footer() {
  const { t } = useLang();

  const compliance = [
    { icon: <ShieldCheck className="w-5 h-5 text-emerald-400" />, title: t.footer.fca_title, desc: t.footer.fca_desc },
    { icon: <Landmark className="w-5 h-5 text-cyan-400" />, title: t.footer.segregated_title, desc: t.footer.segregated_desc },
    { icon: <Users className="w-5 h-5 text-blue-400" />, title: t.footer.custody_title, desc: t.footer.custody_desc },
    { icon: <FileSearch className="w-5 h-5 text-violet-400" />, title: t.footer.kyc_title, desc: t.footer.kyc_desc },
  ];

  const links = [t.footer.link_spa, t.footer.link_privacy, t.footer.link_terms, t.footer.link_risk];

  return (
    <footer className="border-t border-slate-800/30 bg-[#000]">
      {/* Trust Banner */}
      <div className="border-b border-slate-800/30 py-6" style={{ background: 'rgba(11,15,25,0.6)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-slate-400 text-sm leading-relaxed max-w-3xl mx-auto">
            <span className="text-slate-200 font-semibold">{t.footer.trust_title}</span>{' '}
            {t.footer.trust_body}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Compliance grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-16">
          {compliance.map((c) => (
            <div key={c.title} className="glass-card rounded-xl p-5">
              <div className="flex items-center gap-2 mb-3">
                {c.icon}
                <span className="text-white font-semibold text-sm">{c.title}</span>
              </div>
              <p className="text-slate-500 text-xs leading-relaxed">{c.desc}</p>
            </div>
          ))}
        </div>

        {/* Corp info */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-12">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
                <span className="text-white font-black text-xs tracking-tight">OTX</span>
              </div>
              <div>
                <p className="text-white font-bold">OmniTradeX</p>
                <p className="text-slate-500 text-xs">{t.footer.entity_services}</p>
              </div>
            </div>
            <p className="text-slate-500 text-xs leading-relaxed mb-3">
              <span className="text-slate-400">Omni Wealth Ltd</span> · {t.footer.entity_services}
            </p>
            <div className="text-slate-600 text-xs space-y-1">
              <p>FRN · 955451 &nbsp;|&nbsp; RCN · 12858155 &nbsp;|&nbsp; Authorised · 23/07/2021 &nbsp;|&nbsp; Regulator · FCA (UK)</p>
              <p>12 Endeavour Square, London, E20 1JN, United Kingdom</p>
            </div>
          </div>

          <div>
            <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-4">{t.footer.legal}</p>
            <div className="flex flex-wrap gap-3">
              {links.map((link) => (
                <a
                  key={link}
                  href="#"
                  className="text-slate-500 hover:text-slate-300 text-xs font-medium transition-colors"
                >
                  {link}
                </a>
              ))}
            </div>
          </div>
        </div>

      </div>
    </footer>
  );
}
