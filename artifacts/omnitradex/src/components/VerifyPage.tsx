import { useState, useRef, useEffect, Fragment } from 'react';
import { Search, AlertCircle, Download, CheckCircle, ArrowLeft } from 'lucide-react';
import { useRoute, Link } from 'wouter';
import CertificateView from './CertificateView';
import { getCertificateByRef } from '../lib/certificates';
import { generateQRDataUrl, exportCertificatePDF } from '../lib/pdfExport';
import { useLang, type LangCode } from '../context/LangContext';
import type { Certificate } from '../lib/types';

const LANGS: LangCode[] = ['en', 'el', 'it', 'de', 'es'];

export default function VerifyPage() {
  const { t, lang, setLang } = useLang();
  const [, params] = useRoute('/verify/:ref');
  const [input, setInput] = useState(params?.ref ?? '');
  const [cert, setCert] = useState<Certificate | null>(null);
  const [status, setStatus] = useState<'idle' | 'loading' | 'found' | 'notfound'>('idle');
  const [qrUrl, setQrUrl] = useState<string>('');
  const [exporting, setExporting] = useState(false);
  const [exportError, setExportError] = useState<string | null>(null);
  const certRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (params?.ref) {
      setInput(params.ref);
      runSearch(params.ref);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params?.ref]);

  async function runSearch(ref: string) {
    if (!ref.trim()) return;
    setStatus('loading');
    const result = await getCertificateByRef(ref);
    if (result && result.approval_status === 'APPROVED') {
      setCert(result);
      setStatus('found');
      const qr = await generateQRDataUrl(`${window.location.origin}/verify/${result.reference_number}`);
      setQrUrl(qr);
    } else {
      setCert(null);
      setStatus('notfound');
    }
  }

  async function handleExport() {
    if (!certRef.current || !cert) return;
    setExporting(true);
    setExportError(null);
    try {
      await exportCertificatePDF(certRef.current, `certificate-${cert.reference_number}.pdf`);
    } catch (err) {
      setExportError(err instanceof Error ? err.message : t.verify.export_failed);
    } finally {
      setExporting(false);
    }
  }

  return (
    <div className="min-h-screen" style={{ background: '#000811' }}>
      {/* Header */}
      <div style={{ borderBottom: '1px solid rgba(34,211,238,0.1)', background: 'rgba(4,12,28,0.95)' }} className="sticky top-0 z-50 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm">
            <ArrowLeft className="w-4 h-4" />
            {t.verify.back}
          </Link>
          <div className="flex items-center gap-3 ml-4">
            <div className="w-7 h-7 rounded-md bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
              <span className="text-white font-black text-[10px]">OTX</span>
            </div>
            <span className="text-white font-bold text-sm tracking-tight">{t.verify.header_title}</span>
          </div>

          {/* Language toggle */}
          <div className="ml-auto flex items-center gap-0.5 p-0.5 sm:p-1 rounded-lg bg-slate-900/80 border border-slate-800/60">
            {LANGS.map(code => (
              <button
                key={code}
                onClick={() => setLang(code)}
                className={`px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-md text-[10px] sm:text-[11px] font-bold uppercase tracking-wide transition-all duration-150 ${
                  lang === code
                    ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                    : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                {code}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-16">
        {/* Search section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-cyan-500/25 bg-cyan-500/5 text-cyan-400 text-xs font-semibold tracking-widest uppercase mb-6">
            <CheckCircle className="w-3.5 h-3.5" />
            {t.verify.badge}
          </div>
          <h1 className="text-4xl font-black text-white mb-4 tracking-tight">{t.verify.title}</h1>
          <p className="text-slate-400 text-sm max-w-md mx-auto leading-relaxed">
            {t.verify.subtitle}
          </p>
        </div>

        {/* Search form */}
        <div className="max-w-lg mx-auto mb-12">
          <div className="relative flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && runSearch(input)}
                placeholder={t.verify.placeholder}
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-900/80 border border-slate-700/60 text-white placeholder-slate-600 text-sm focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/30 transition-all"
              />
            </div>
            <button
              onClick={() => runSearch(input)}
              disabled={status === 'loading'}
              className="px-6 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-sm transition-all disabled:opacity-50 whitespace-nowrap"
            >
              {status === 'loading' ? t.verify.searching : t.verify.btn_verify}
            </button>
          </div>
        </div>

        {/* Not found */}
        {status === 'notfound' && (
          <div className="max-w-md mx-auto rounded-2xl border border-red-500/20 bg-red-500/5 p-8 text-center">
            <AlertCircle className="w-10 h-10 text-red-400 mx-auto mb-4" />
            <h3 className="text-white font-bold text-lg mb-2">{t.verify.notfound_title}</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              {t.verify.notfound_body.split('{ref}').map((part, i) => (
                <Fragment key={i}>
                  {i > 0 && <strong className="text-white">{input}</strong>}
                  {part}
                </Fragment>
              ))}
            </p>
          </div>
        )}

        {/* Found */}
        {status === 'found' && cert && (
          <div>
            {/* Toolbar: verified badge + download */}
            <div className="flex items-center justify-center gap-3 mb-8 flex-wrap">
              <div className="flex items-center gap-2 px-4 py-2 rounded-full border border-emerald-500/30 bg-emerald-500/8 text-emerald-400 text-sm font-semibold">
                <CheckCircle className="w-4 h-4" />
                {t.verify.verified}
              </div>

              <button
                onClick={handleExport}
                disabled={exporting}
                className="flex items-center gap-2 px-4 py-2 rounded-full border border-slate-600 hover:border-cyan-500/40 text-slate-300 hover:text-white text-sm font-semibold transition-all disabled:opacity-50"
              >
                <Download className="w-4 h-4" />
                {exporting ? t.verify.exporting : t.verify.download_pdf}
              </button>
            </div>

            {/* Export error */}
            {exportError && (
              <p className="text-center text-red-400 text-xs mb-4">{exportError}</p>
            )}

            {/* Certificate — scaled to fit screen */}
            <div className="flex justify-center">
              <div style={{
                width: Math.round(793 * 0.75),
                height: Math.round(1122 * 0.75),
                overflow: 'hidden',
                flexShrink: 0,
              }}>
                <div style={{ transform: 'scale(0.75)', transformOrigin: 'top left', width: 793 }}>
                  <CertificateView ref={certRef} cert={cert} qrDataUrl={qrUrl} language={lang} />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
