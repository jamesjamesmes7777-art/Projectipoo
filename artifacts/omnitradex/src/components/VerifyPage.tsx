import { useState, useRef, useEffect } from 'react';
import { Search, AlertCircle, Download, CheckCircle, ArrowLeft, Globe } from 'lucide-react';
import { useRoute, Link } from 'wouter';
import CertificateView from './CertificateView';
import { getCertificateByRef } from '../lib/certificates';
import { generateQRDataUrl, exportCertificatePDF } from '../lib/pdfExport';
import { CERT_LANGS, type CertLang } from '../lib/certI18n';
import type { Certificate } from '../lib/types';

export default function VerifyPage() {
  const [, params] = useRoute('/verify/:ref');
  const [input, setInput] = useState(params?.ref ?? '');
  const [cert, setCert] = useState<Certificate | null>(null);
  const [status, setStatus] = useState<'idle' | 'loading' | 'found' | 'notfound'>('idle');
  const [qrUrl, setQrUrl] = useState<string>('');
  const [exporting, setExporting] = useState(false);
  const [selectedLang, setSelectedLang] = useState<CertLang>('en');
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
      setSelectedLang((result.language as CertLang) ?? 'en');
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
    try {
      await exportCertificatePDF(certRef.current, `certificate-${cert.reference_number}.pdf`);
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
            Back
          </Link>
          <div className="flex items-center gap-3 ml-4">
            <div className="w-7 h-7 rounded-md bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
              <span className="text-white font-black text-[10px]">OTX</span>
            </div>
            <span className="text-white font-bold text-sm tracking-tight">Certificate Verification</span>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-16">
        {/* Search section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-cyan-500/25 bg-cyan-500/5 text-cyan-400 text-xs font-semibold tracking-widest uppercase mb-6">
            <CheckCircle className="w-3.5 h-3.5" />
            Secure Certificate Registry
          </div>
          <h1 className="text-4xl font-black text-white mb-4 tracking-tight">Verify Certificate</h1>
          <p className="text-slate-400 text-sm max-w-md mx-auto leading-relaxed">
            Enter a certificate reference number to verify its authenticity and view the full document.
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
                placeholder="e.g. OW-1602-3810"
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-900/80 border border-slate-700/60 text-white placeholder-slate-600 text-sm focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/30 transition-all"
              />
            </div>
            <button
              onClick={() => runSearch(input)}
              disabled={status === 'loading'}
              className="px-6 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-sm transition-all disabled:opacity-50 whitespace-nowrap"
            >
              {status === 'loading' ? 'Searching…' : 'Verify'}
            </button>
          </div>
        </div>

        {/* Not found */}
        {status === 'notfound' && (
          <div className="max-w-md mx-auto rounded-2xl border border-red-500/20 bg-red-500/5 p-8 text-center">
            <AlertCircle className="w-10 h-10 text-red-400 mx-auto mb-4" />
            <h3 className="text-white font-bold text-lg mb-2">Certificate Not Available</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              No approved certificate found for reference <strong className="text-white">{input}</strong>.
              The certificate may not exist, is awaiting approval, or has been revoked.
            </p>
          </div>
        )}

        {/* Found */}
        {status === 'found' && cert && (
          <div>
            {/* Toolbar: verified badge + language picker + download */}
            <div className="flex items-center justify-center gap-3 mb-8 flex-wrap">
              <div className="flex items-center gap-2 px-4 py-2 rounded-full border border-emerald-500/30 bg-emerald-500/8 text-emerald-400 text-sm font-semibold">
                <CheckCircle className="w-4 h-4" />
                Certificate Verified
              </div>

              {/* Language selector */}
              <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-900/80 border border-slate-700/50">
                <Globe className="w-3.5 h-3.5 text-slate-500 ml-2" />
                {CERT_LANGS.map(l => (
                  <button
                    key={l.code}
                    onClick={() => setSelectedLang(l.code)}
                    title={l.label}
                    className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      selectedLang === l.code
                        ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/25'
                        : 'text-slate-500 hover:text-slate-300'
                    }`}
                  >
                    <span className="text-sm leading-none">{l.flag}</span>
                    <span className="hidden sm:inline">{l.code.toUpperCase()}</span>
                  </button>
                ))}
              </div>

              <button
                onClick={handleExport}
                disabled={exporting}
                className="flex items-center gap-2 px-4 py-2 rounded-full border border-slate-600 hover:border-cyan-500/40 text-slate-300 hover:text-white text-sm font-semibold transition-all disabled:opacity-50"
              >
                <Download className="w-4 h-4" />
                {exporting ? 'Exporting…' : 'Download PDF'}
              </button>
            </div>

            {/* Language label */}
            <p className="text-center text-slate-600 text-xs mb-6">
              Viewing in {CERT_LANGS.find(l => l.code === selectedLang)?.label}
            </p>

            {/* Certificate — scaled to fit screen */}
            <div className="flex justify-center">
              <div style={{
                width: Math.round(793 * 0.75),
                height: Math.round(1122 * 0.75),
                overflow: 'hidden',
                flexShrink: 0,
              }}>
                <div style={{ transform: 'scale(0.75)', transformOrigin: 'top left', width: 793 }}>
                  <CertificateView ref={certRef} cert={cert} qrDataUrl={qrUrl} language={selectedLang} />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
