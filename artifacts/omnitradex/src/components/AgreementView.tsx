import React, { forwardRef } from 'react';
import type { Certificate } from '../lib/types';

interface Props {
  agreement: Certificate;
}

function fmt(n: number | null | undefined, decimals = 2): string {
  if (n == null) return '—';
  return n.toLocaleString('en-EU', { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
}

function fmtDate(d: string | null | undefined): string {
  if (!d) return new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' });
  return new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' });
}

const SectionTitle = ({ number, title }: { number: string; title: string }) => (
  <div className="flex items-center gap-3 mb-4">
    <div className="w-7 h-7 rounded-full bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center flex-shrink-0">
      <span className="text-xs font-bold text-cyan-400">{number}</span>
    </div>
    <h3 className="text-sm font-bold text-white uppercase tracking-widest">{title}</h3>
    <div className="flex-1 h-px bg-gradient-to-r from-cyan-500/30 to-transparent" />
  </div>
);

const DataRow = ({ label, value, accent }: { label: string; value: React.ReactNode; accent?: boolean }) => (
  <div className="flex justify-between items-center py-2 border-b border-white/5 last:border-0">
    <span className="text-xs text-slate-400">{label}</span>
    <span className={`text-sm font-semibold ${accent ? 'text-cyan-400' : 'text-white'}`}>{value}</span>
  </div>
);

const AgreementView = forwardRef<HTMLDivElement, Props>(function AgreementView({ agreement }, ref) {
  const issueDate = fmtDate(agreement.agreement_generated_at ?? agreement.issue_date);

  const shares = agreement.shares;
  const entryPrice = agreement.entry_price ?? 117;
  const salePrice = agreement.sale_price ?? 306;
  const bonusAmount = agreement.institutional_bonus_amount ?? 0;
  const clientCash = shares * entryPrice;
  const totalInvestment = agreement.total_investment ?? (clientCash + bonusAmount);
  const grossPayout = agreement.gross_payout ?? (shares * salePrice);
  const grossProfit = agreement.gross_profit ?? (grossPayout - totalInvestment);
  const performanceFee = agreement.performance_fee ?? (grossProfit * 0.17);
  const netProfit = agreement.net_profit ?? (grossProfit - performanceFee);
  const totalDisbursed = agreement.total_disbursed ?? (totalInvestment + netProfit);
  const netReturnPct = agreement.net_return_pct ?? (totalInvestment > 0 ? (netProfit / totalInvestment) * 100 : 0);

  return (
    <div
      ref={ref}
      style={{ width: '794px', minHeight: '1123px', fontFamily: "'Inter', 'Segoe UI', sans-serif", background: '#060f1e', color: '#fff' }}
    >
      {/* Top accent bar */}
      <div style={{ height: '4px', background: 'linear-gradient(90deg, #06b6d4, #3b82f6, #06b6d4)' }} />

      <div style={{ padding: '40px' }}>
        {/* HEADER */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px', marginBottom: '16px' }}>
            <div style={{ flex: 1, height: '1px', background: 'linear-gradient(90deg, transparent, rgba(6,182,212,0.4))' }} />
            <div style={{ width: '48px', height: '48px', background: 'rgba(6,182,212,0.1)', border: '1px solid rgba(6,182,212,0.3)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ color: '#22d3ee', fontWeight: 900, fontSize: '18px' }}>OW</span>
            </div>
            <div style={{ flex: 1, height: '1px', background: 'linear-gradient(270deg, transparent, rgba(6,182,212,0.4))' }} />
          </div>
          <p style={{ fontSize: '11px', color: '#64748b', letterSpacing: '0.3em', textTransform: 'uppercase', margin: '0 0 8px' }}>OMNI WEALTH LTD</p>
          <h1 style={{ fontSize: '22px', fontWeight: 900, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#fff', margin: '0 0 4px' }}>Investment & Execution</h1>
          <h1 style={{ fontSize: '22px', fontWeight: 900, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#22d3ee', margin: '0 0 16px' }}>Settlement Agreement</h1>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ height: '1px', width: '60px', background: 'rgba(255,255,255,0.1)' }} />
            <span style={{ fontSize: '11px', color: '#64748b', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '20px', padding: '3px 14px', letterSpacing: '0.2em' }}>CONFIDENTIAL</span>
            <div style={{ height: '1px', width: '60px', background: 'rgba(255,255,255,0.1)' }} />
          </div>
          <div style={{ marginTop: '12px', display: 'flex', justifyContent: 'center', gap: '24px', fontSize: '12px', color: '#64748b' }}>
            <span>Date: <span style={{ color: '#cbd5e1' }}>{issueDate}</span></span>
            <span>Ref: <span style={{ color: '#cbd5e1', fontFamily: 'monospace' }}>{agreement.reference_number}</span></span>
            <span>WL#: <span style={{ color: '#22d3ee', fontFamily: 'monospace', fontWeight: 700 }}>{agreement.waiting_list_number}</span></span>
          </div>
        </div>

        {/* PREAMBLE: 2-column */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '32px' }}>
          {/* Firm Details */}
          <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '20px' }}>
            <div style={{ fontSize: '11px', color: '#22d3ee', textTransform: 'uppercase', letterSpacing: '0.15em', fontWeight: 600, marginBottom: '12px' }}>Executing Firm</div>
            {[
              ['Firm Name', 'OMNI WEALTH LTD'],
              ['Representative', 'Simon Mark Hickman'],
              ['Title', 'Chief Executive Officer'],
              ['Banking Partner', agreement.banking_partner ?? 'Piraeus Bank S.A.'],
              ...(agreement.verified_buyer_id ? [['Verified Buyer', agreement.verified_buyer_id]] : []),
            ].map(([k, v]) => (
              <div key={k} style={{ fontSize: '13px', marginBottom: '6px' }}>
                <span style={{ color: '#94a3b8' }}>{k}: </span><span style={{ color: '#fff', fontWeight: 600 }}>{v}</span>
              </div>
            ))}
          </div>

          {/* Client Details */}
          <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '20px' }}>
            <div style={{ fontSize: '11px', color: '#22d3ee', textTransform: 'uppercase', letterSpacing: '0.15em', fontWeight: 600, marginBottom: '12px' }}>Client Details</div>
            {[
              ['Full Name', agreement.holder_name],
              ...(agreement.registered_address ? [['Address', agreement.registered_address]] : []),
              ...(agreement.email ? [['Email', agreement.email]] : []),
              ...(agreement.national_id ? [['ID / Passport', agreement.national_id]] : []),
              ...(agreement.afm_tin ? [['AFM / TIN', agreement.afm_tin]] : []),
            ].map(([k, v]) => (
              <div key={k} style={{ fontSize: '13px', marginBottom: '6px' }}>
                <span style={{ color: '#94a3b8' }}>{k}: </span><span style={{ color: '#fff', fontWeight: 600, fontFamily: k === 'AFM / TIN' || k === 'ID / Passport' ? 'monospace' : undefined }}>{v}</span>
              </div>
            ))}
          </div>
        </div>

        {/* SECTION 1: Capital Structure */}
        <div style={{ marginBottom: '32px' }}>
          <SectionTitle number="1" title="Capital Structure" />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '12px' }}>
            <div style={{ background: 'rgba(59,130,246,0.05)', border: '1px solid rgba(59,130,246,0.2)', borderRadius: '12px', padding: '20px' }}>
              <div style={{ fontSize: '11px', color: '#60a5fa', textTransform: 'uppercase', letterSpacing: '0.15em', fontWeight: 600, marginBottom: '8px' }}>Client Cash Contribution</div>
              <div style={{ fontSize: '28px', fontWeight: 900, color: '#fff', marginBottom: '4px' }}>€{fmt(clientCash)}</div>
              <div style={{ fontSize: '12px', color: '#94a3b8' }}>{shares.toLocaleString()} shares × €{fmt(entryPrice)} entry price</div>
            </div>
            <div style={{ background: 'rgba(16,185,129,0.05)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: '12px', padding: '20px' }}>
              <div style={{ fontSize: '11px', color: '#34d399', textTransform: 'uppercase', letterSpacing: '0.15em', fontWeight: 600, marginBottom: '8px' }}>Institutional Bonus Credit</div>
              <div style={{ fontSize: '28px', fontWeight: 900, color: '#34d399', marginBottom: '4px' }}>€{fmt(bonusAmount)}</div>
              <div style={{ fontSize: '12px', color: '#94a3b8' }}>via {agreement.banking_partner ?? 'Piraeus Bank S.A.'}</div>
            </div>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '13px', color: '#94a3b8' }}>Total Capital Investment (Combined)</span>
            <span style={{ fontSize: '20px', fontWeight: 900, color: '#fff' }}>€{fmt(totalInvestment)}</span>
          </div>
        </div>

        {/* SECTION 2: Asset Parameters Table */}
        <div style={{ marginBottom: '32px' }}>
          <SectionTitle number="2" title="Asset Parameters" />
          <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                  {['Parameter', 'Value', 'Details'].map(h => (
                    <th key={h} style={{ textAlign: 'left', padding: '12px 16px', fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  [agreement.security_name ?? 'SpaceX', `${agreement.security_name ?? 'SpaceX'}-IPO Block`, `Code: ${agreement.security_code ?? 'SPCX'}`, false],
                  ['Shares Allocated', shares.toLocaleString(), 'Verified block allocation', false],
                  ['Entry Price per Share', `€${fmt(entryPrice)}`, 'Acquisition cost basis', false],
                  ['Locked Verified Offer Execution Price', `€${fmt(salePrice)}`, 'Binding locked price', true],
                ].map(([param, value, detail, highlight], i) => (
                  <tr key={i} style={{ borderBottom: i < 3 ? '1px solid rgba(255,255,255,0.05)' : undefined, background: highlight ? 'rgba(6,182,212,0.05)' : undefined }}>
                    <td style={{ padding: '12px 16px', color: '#cbd5e1' }}>{param}</td>
                    <td style={{ padding: '12px 16px', color: highlight ? '#22d3ee' : '#fff', fontWeight: 700, fontFamily: 'monospace', fontSize: highlight ? '15px' : '13px' }}>{value}</td>
                    <td style={{ padding: '12px 16px', color: '#64748b' }}>{detail}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* SECTION 3: Financial Distribution */}
        <div style={{ marginBottom: '32px' }}>
          <SectionTitle number="3" title="Financial Distribution" />
          <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '20px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              {[
                ['Projected Gross Payout', `€${fmt(grossPayout)}`, false],
                ['Gross Profit', `€${fmt(grossProfit)}`, false],
                ['Firm Performance Fee (17%)', `€${fmt(performanceFee)}`, false],
                ['Net Client Profit', `€${fmt(netProfit)}`, true],
              ].map(([label, value, accent]) => (
                <div key={String(label)} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <span style={{ fontSize: '12px', color: '#94a3b8' }}>{label}</span>
                  <span style={{ fontSize: '13px', fontWeight: 700, color: accent ? '#22d3ee' : '#fff' }}>{value}</span>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '16px', background: 'linear-gradient(135deg, rgba(6,182,212,0.1), rgba(16,185,129,0.1))', border: '1px solid rgba(6,182,212,0.2)', borderRadius: '12px', padding: '20px' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: '4px' }}>Total Disbursed to Client</div>
                <div style={{ fontSize: '28px', fontWeight: 900, color: '#fff' }}>€{fmt(totalDisbursed)}</div>
              </div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(16,185,129,0.2)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: '20px', padding: '6px 16px' }}>
                <span style={{ color: '#34d399', fontWeight: 900, fontSize: '18px' }}>+{fmt(netReturnPct, 1)}%</span>
                <span style={{ fontSize: '11px', color: '#34d399', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Net Return</span>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 4: Timeline */}
        <div style={{ marginBottom: '32px' }}>
          <SectionTitle number="4" title="Procedural Timeline" />
          <div style={{ background: 'rgba(245,158,11,0.05)', border: '1px solid rgba(245,158,11,0.2)', borderRadius: '12px', padding: '20px', display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
            <div style={{ width: '40px', height: '40px', background: 'rgba(245,158,11,0.2)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fbbf24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
              </svg>
            </div>
            <div>
              <div style={{ fontSize: '13px', fontWeight: 700, color: '#fbbf24', marginBottom: '8px' }}>2–3 WEEKS MAXIMUM — BINDING PROCEDURAL TIMELINE</div>
              <p style={{ fontSize: '12px', color: '#94a3b8', lineHeight: 1.6, margin: 0 }}>
                The execution, settlement, and disbursement of all proceeds under this agreement shall be completed within a binding maximum period of <strong style={{ color: '#fff' }}>two (2) to three (3) weeks</strong> from the date of this agreement's authorization and execution by both parties. This timeline is contractually binding and non-negotiable absent extraordinary circumstances beyond the control of the executing firm.
              </p>
            </div>
          </div>
        </div>

        {/* SECTION 5: Signatures */}
        <div style={{ marginBottom: '24px' }}>
          <SectionTitle number="5" title="Digital Signature" />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
            {/* Firm */}
            <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '20px' }}>
              <div style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: '12px' }}>Authorized Signatory — Firm</div>
              <div style={{ height: '60px', display: 'flex', alignItems: 'flex-end', paddingBottom: '8px', borderBottom: '1px solid rgba(255,255,255,0.2)', marginBottom: '12px' }}>
                <span style={{ color: '#cbd5e1', fontSize: '20px', fontStyle: 'italic', fontFamily: 'Georgia, serif', fontWeight: 300, letterSpacing: '0.03em' }}>Simon Mark Hickman</span>
              </div>
              <div style={{ fontSize: '13px', color: '#fff', fontWeight: 600 }}>Simon Mark Hickman</div>
              <div style={{ fontSize: '12px', color: '#94a3b8' }}>Chief Executive Officer</div>
              <div style={{ fontSize: '12px', color: '#94a3b8' }}>OMNI WEALTH LTD</div>
              <div style={{ fontSize: '11px', color: '#64748b', marginTop: '8px' }}>{issueDate}</div>
            </div>

            {/* Client */}
            <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '20px' }}>
              <div style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: '12px' }}>Client Acknowledgement</div>
              <div style={{ height: '60px', display: 'flex', alignItems: 'flex-end', paddingBottom: '8px', borderBottom: '1px dashed rgba(255,255,255,0.2)', marginBottom: '12px' }}>
                <span style={{ fontSize: '12px', color: '#475569', fontStyle: 'italic' }}>Signature</span>
              </div>
              <div style={{ fontSize: '13px', color: '#fff', fontWeight: 600 }}>{agreement.holder_name}</div>
              {agreement.national_id && <div style={{ fontSize: '12px', color: '#94a3b8' }}>ID: {agreement.national_id}</div>}
              {agreement.afm_tin && <div style={{ fontSize: '12px', color: '#94a3b8' }}>AFM/TIN: {agreement.afm_tin}</div>}
              <div style={{ fontSize: '11px', color: '#64748b', marginTop: '8px' }}>Date: _______________</div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{ textAlign: 'center', paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
          <p style={{ fontSize: '11px', color: '#475569', margin: '0 0 4px' }}>
            This document is generated and authorized by OMNI WEALTH LTD. Waiting List Reference: <span style={{ fontFamily: 'monospace', color: '#64748b' }}>{agreement.waiting_list_number}</span>
          </p>
          <p style={{ fontSize: '11px', color: '#334155', margin: 0 }}>OMNI WEALTH LTD — Pre-IPO Investment & Settlement Platform — {new Date().getFullYear()}</p>
        </div>
      </div>

      {/* Bottom accent bar */}
      <div style={{ height: '4px', background: 'linear-gradient(90deg, #06b6d4, #3b82f6, #06b6d4)' }} />
    </div>
  );
});

export default AgreementView;
