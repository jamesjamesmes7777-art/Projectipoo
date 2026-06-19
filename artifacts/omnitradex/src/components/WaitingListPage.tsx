import React, { useState, useRef, useEffect } from 'react';
import { useRoute, useLocation } from 'wouter';
import type { Certificate } from '../lib/types';
import { getAgreementByWaitingListNumber } from '../lib/certificates';
import AgreementView from './AgreementView';
import { exportCertificatePDF } from '../lib/pdfExport';

export default function WaitingListPage() {
  const [, params] = useRoute('/agreement/:wlNumber');
  const urlWlNumber = params?.wlNumber;
  const [, navigate] = useLocation();

  const [input, setInput] = useState(urlWlNumber ?? '');
  const [agreement, setAgreement] = useState<Certificate | null>(null);
  const [status, setStatus] = useState<'idle' | 'loading' | 'found' | 'notfound'>('idle');
  const [exporting, setExporting] = useState(false);
  const viewRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (urlWlNumber) {
      setInput(urlWlNumber);
      handleLookup(urlWlNumber);
    }
  }, [urlWlNumber]);

  async function handleLookup(wl?: string) {
    const query = (wl ?? input).trim().toUpperCase();
    if (!query) return;
    setStatus('loading');
    setAgreement(null);
    try {
      const result = await getAgreementByWaitingListNumber(query);
      if (result) {
        setAgreement(result);
        setStatus('found');
      } else {
        setStatus('notfound');
      }
    } catch {
      setStatus('notfound');
    }
  }

  async function handleDownload() {
    if (!viewRef.current || !agreement) return;
    setExporting(true);
    try {
      await exportCertificatePDF(viewRef.current, `agreement-${agreement.waiting_list_number ?? 'download'}.pdf`);
    } finally {
      setExporting(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#060f1e] text-white">
      {/* Header */}
      <div className="border-b border-white/10 bg-[#0b1628]">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <button onClick={() => navigate('/')} className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Portal
          </button>
          <div className="text-center">
            <div className="text-xs text-slate-500 uppercase tracking-widest">OMNI WEALTH LTD</div>
            <div className="text-sm font-bold text-white">Client Agreement Portal</div>
          </div>
          <div className="w-24" />
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-12">
        {/* Lookup Form */}
        {status !== 'found' && (
          <div className="max-w-lg mx-auto">
            <div className="text-center mb-10">
              <div className="w-16 h-16 bg-cyan-500/10 border border-cyan-500/30 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-white mb-2">Investment Agreement Portal</h1>
              <p className="text-slate-400 text-sm">Enter your Waiting List Number to access your authorized settlement agreement.</p>
            </div>

            <div className="bg-white/3 border border-white/10 rounded-2xl p-8">
              <label className="block text-xs text-slate-400 uppercase tracking-widest mb-2">Your Waiting List Number</label>
              <div className="flex gap-3">
                <input
                  type="text"
                  value={input}
                  onChange={e => setInput(e.target.value.toUpperCase())}
                  onKeyDown={e => e.key === 'Enter' && handleLookup()}
                  placeholder="e.g. WL-A1B2C3D4"
                  className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500/60 font-mono text-sm"
                  autoFocus
                />
                <button
                  onClick={() => handleLookup()}
                  disabled={status === 'loading' || !input.trim()}
                  className="px-6 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-sm font-semibold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  {status === 'loading' ? (
                    <span className="flex items-center gap-2">
                      <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Searching...
                    </span>
                  ) : 'Access Agreement'}
                </button>
              </div>

              {status === 'notfound' && (
                <div className="mt-4 bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex items-start gap-3">
                  <svg className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <div>
                    <p className="text-sm text-red-400 font-semibold">Agreement Not Found</p>
                    <p className="text-xs text-slate-400 mt-1">
                      No authorized agreement was found for <span className="font-mono text-white">{input}</span>. Please verify the number is correct or contact your account manager.
                    </p>
                  </div>
                </div>
              )}

              <div className="mt-6 pt-5 border-t border-white/5 text-xs text-slate-500 text-center">
                Your Waiting List Number was provided upon allocation approval. It begins with "WL-".
              </div>
            </div>
          </div>
        )}

        {/* Agreement Found */}
        {status === 'found' && agreement && (
          <div>
            <div className="flex items-center justify-between mb-6 bg-white/3 border border-emerald-500/20 rounded-xl px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-emerald-500/20 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <div className="text-sm font-semibold text-white">Agreement Found & Authorized</div>
                  <div className="text-xs text-slate-400">WL# <span className="font-mono text-cyan-400">{agreement.waiting_list_number}</span> — <span className="text-slate-300">{agreement.holder_name}</span></div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => { setStatus('idle'); setAgreement(null); }}
                  className="px-4 py-2 text-sm text-slate-400 hover:text-white border border-white/10 hover:border-white/20 rounded-xl transition-all"
                >
                  New Search
                </button>
                <button
                  onClick={handleDownload}
                  disabled={exporting}
                  className="flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-sm font-semibold rounded-xl disabled:opacity-50 transition-all"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  {exporting ? 'Exporting...' : 'Download as PDF'}
                </button>
              </div>
            </div>

            <div className="flex justify-center">
              <div className="shadow-2xl shadow-black/50 rounded-lg overflow-hidden">
                <AgreementView ref={viewRef} agreement={agreement} />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
