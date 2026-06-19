import React, { useState } from 'react';
import type { Certificate, AgreementConfig } from '../lib/types';
import { generateAgreement } from '../lib/certificates';

interface Props {
  cert: Certificate;
  onGenerated: (updated: Certificate) => void;
  onClose: () => void;
}

function fmt(n: number | null | undefined, decimals = 2): string {
  if (n == null) return '—';
  return n.toLocaleString('en-EU', { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
}

export default function AgreementGenerator({ cert, onGenerated, onClose }: Props) {
  const [shares, setShares] = useState(String(cert.shares));
  const [entryPrice, setEntryPrice] = useState(String(cert.entry_price ?? 117));
  const [salePrice, setSalePrice] = useState(String(cert.sale_price ?? 306));
  const [bonusAmount, setBonusAmount] = useState(String(cert.institutional_bonus_amount ?? 0));
  const [bankingPartner, setBankingPartner] = useState(cert.banking_partner ?? 'Piraeus Bank S.A.');
  const [nationalId, setNationalId] = useState(cert.national_id ?? '');
  const [afmTin, setAfmTin] = useState(cert.afm_tin ?? '');
  const [verifiedBuyerId, setVerifiedBuyerId] = useState(cert.verified_buyer_id ?? '');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sharesNum = parseFloat(shares) || 0;
  const entryNum = parseFloat(entryPrice) || 0;
  const saleNum = parseFloat(salePrice) || 0;
  const bonusNum = parseFloat(bonusAmount) || 0;

  const clientCash = sharesNum * entryNum;
  const totalInvestment = clientCash + bonusNum;
  const grossPayout = sharesNum * saleNum;
  const grossProfit = grossPayout - totalInvestment;
  const performanceFee = grossProfit * 0.17;
  const netProfit = grossProfit - performanceFee;
  const totalDisbursed = totalInvestment + netProfit;
  const netReturnPct = totalInvestment > 0 ? (netProfit / totalInvestment) * 100 : 0;

  async function handleGenerate() {
    setSaving(true);
    setError(null);
    try {
      const config: AgreementConfig = {
        national_id: nationalId || undefined,
        afm_tin: afmTin || undefined,
        banking_partner: bankingPartner || undefined,
        institutional_bonus_amount: bonusNum,
        entry_price: entryNum,
        sale_price: saleNum,
        verified_buyer_id: verifiedBuyerId || undefined,
        shares_override: sharesNum > 0 ? sharesNum : undefined,
      };
      const updated = await generateAgreement(cert.id, config);
      onGenerated(updated);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to generate agreement');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="w-full max-w-3xl bg-[#0b1628] border border-white/10 rounded-2xl shadow-2xl overflow-y-auto max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/10 bg-gradient-to-r from-[#0d1f3c] to-[#0b1628]">
          <div>
            <h2 className="text-lg font-bold text-white tracking-wide">Agreement Configuration & Overrides</h2>
            <p className="text-xs text-slate-400 mt-0.5">{cert.holder_name} — {cert.reference_number}</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors text-2xl leading-none w-8 h-8 flex items-center justify-center">&times;</button>
        </div>

        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* LEFT: Input Fields */}
          <div className="space-y-4">
            <h3 className="text-xs font-semibold text-cyan-400 uppercase tracking-widest mb-3">Client Compliance Fields</h3>

            <div>
              <label className="block text-xs text-slate-400 mb-1">National ID / Passport Number</label>
              <input
                value={nationalId}
                onChange={e => setNationalId(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500/60"
                placeholder="e.g. AK123456"
              />
            </div>

            <div>
              <label className="block text-xs text-slate-400 mb-1">AFM / TIN (Greek Tax ID)</label>
              <input
                value={afmTin}
                onChange={e => setAfmTin(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500/60"
                placeholder="e.g. 123456789"
              />
            </div>

            <div>
              <label className="block text-xs text-slate-400 mb-1">Banking Partner</label>
              <input
                value={bankingPartner}
                onChange={e => setBankingPartner(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500/60"
                placeholder="Piraeus Bank S.A."
              />
            </div>

            <div>
              <label className="block text-xs text-slate-400 mb-1">ID / Name of Verified Buyer</label>
              <input
                value={verifiedBuyerId}
                onChange={e => setVerifiedBuyerId(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500/60"
                placeholder="e.g. Institutional Block Buyer"
              />
            </div>

            <h3 className="text-xs font-semibold text-cyan-400 uppercase tracking-widest pt-2 mb-3">Asset Allocation Variables</h3>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-slate-400 mb-1">Number of Shares</label>
                <input
                  type="number"
                  value={shares}
                  onChange={e => setShares(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500/60"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">Stock Bonus Amount (€)</label>
                <input
                  type="number"
                  value={bonusAmount}
                  onChange={e => setBonusAmount(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500/60"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">Entry Price per Stock (€)</label>
                <input
                  type="number"
                  step="0.01"
                  value={entryPrice}
                  onChange={e => setEntryPrice(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500/60"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">Locked Execution Price (€)</label>
                <input
                  type="number"
                  step="0.01"
                  value={salePrice}
                  onChange={e => setSalePrice(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500/60"
                />
              </div>
            </div>
          </div>

          {/* RIGHT: Live Calculation Preview */}
          <div className="space-y-2">
            <h3 className="text-xs font-semibold text-cyan-400 uppercase tracking-widest mb-3">Live Calculation Preview</h3>

            <div className="bg-white/3 border border-white/8 rounded-xl p-4 space-y-1">
              <div className="flex justify-between text-xs text-slate-500 pb-2 border-b border-white/5 mb-2">
                <span>Client Cash ({sharesNum} × €{entryNum})</span>
                <span className="text-slate-300 font-mono">€{fmt(clientCash)}</span>
              </div>
              <div className="flex justify-between text-xs text-slate-500 pb-2 border-b border-white/5 mb-2">
                <span>Institutional Bonus ({bankingPartner})</span>
                <span className="text-slate-300 font-mono">€{fmt(bonusNum)}</span>
              </div>
              {[
                ['Total Capital Investment', fmt(totalInvestment), false],
                ['Projected Gross Payout', fmt(grossPayout), false],
                ['Gross Profit', fmt(grossProfit), false],
                ['Firm Performance Fee (17%)', fmt(performanceFee), false],
                ['Net Client Profit', fmt(netProfit), false],
                ['Total Disbursed to Client', fmt(totalDisbursed), true],
              ].map(([label, value, highlight]) => (
                <div key={String(label)} className={`flex justify-between items-center py-2 px-3 rounded ${highlight ? 'bg-cyan-500/10 border border-cyan-500/20' : 'border-b border-white/5'}`}>
                  <span className="text-xs text-slate-400">{label}</span>
                  <span className={`text-sm font-semibold font-mono ${highlight ? 'text-cyan-400' : 'text-white'}`}>€{value}</span>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-3 bg-white/5 rounded-xl p-4">
              <div className="text-center flex-1">
                <div className="text-xs text-slate-400 mb-1">Net Return</div>
                <div className="text-2xl font-bold text-emerald-400">+{fmt(netReturnPct, 1)}%</div>
              </div>
              <div className="h-12 w-px bg-white/10" />
              <div className="text-center flex-1">
                <div className="text-xs text-slate-400 mb-1">Final Disbursement</div>
                <div className="text-xl font-bold text-cyan-400">€{fmt(totalDisbursed)}</div>
              </div>
            </div>

            <div className="text-xs text-slate-500 bg-amber-500/5 border border-amber-500/20 rounded-lg p-3">
              <span className="text-amber-400 font-semibold">Timeline:</span> 2–3 Weeks Maximum (Binding Procedural)
            </div>

            {cert.agreement_status === 'Generated' && cert.waiting_list_number && (
              <div className="text-xs bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-3">
                <span className="text-emerald-400 font-semibold">Previously Generated</span>
                <div className="text-slate-300 mt-1">WL#: <span className="font-mono text-white">{cert.waiting_list_number}</span></div>
              </div>
            )}
          </div>
        </div>

        {error && (
          <div className="mx-6 mb-4 bg-red-500/10 border border-red-500/30 rounded-lg p-3 text-sm text-red-400">{error}</div>
        )}

        <div className="flex justify-end gap-3 px-6 pb-6">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:text-white border border-white/10 hover:border-white/20 transition-all"
          >
            Cancel
          </button>
          <button
            onClick={handleGenerate}
            disabled={saving || sharesNum <= 0 || entryNum <= 0 || saleNum <= 0}
            className="px-6 py-2.5 rounded-xl text-sm font-semibold bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-cyan-900/30"
          >
            {saving ? 'Generating...' : 'Freeze & Authorize Document'}
          </button>
        </div>
      </div>
    </div>
  );
}
