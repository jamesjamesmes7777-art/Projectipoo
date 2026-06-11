import { forwardRef } from 'react';
import { CheckCircle2 } from 'lucide-react';
import type { Certificate } from '../lib/types';
import { getCertStrings, fmtDate } from '../lib/certI18n';
const signatureImg = new URL('../assets/signature-hickman.png', import.meta.url).href;
const sealImg = new URL('../assets/Seal_no_BG-removebg-preview.png', import.meta.url).href;

const CANVAS_W = 793;
const CANVAS_H = 1122;

interface Props {
  cert: Certificate;
  qrDataUrl?: string;
  language?: string;
}

const CertificateView = forwardRef<HTMLDivElement, Props>(({ cert, qrDataUrl, language }, ref) => {
  const lang = language ?? cert.language ?? 'en';
  const t = getCertStrings(lang);
  const total = `€${Number(cert.total_consideration).toLocaleString()}`;
  const price = `€${Number(cert.allocation_price).toFixed(0)}`;
  const issueDate = fmtDate(cert.issue_date, t.dateLocale);
  const dir = t.rtl ? 'rtl' : 'ltr';

  return (
    <div
      ref={ref}
      dir={dir}
      style={{
        width: CANVAS_W, height: CANVAS_H,
        position: 'relative', overflow: 'hidden',
        background: '#061326', flexShrink: 0,
        fontFamily: "'Inter', system-ui, sans-serif",
        direction: dir,
      }}
    >
      {/* ── Background layers ── */}
      <svg style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none' }}
        viewBox={`0 0 ${CANVAS_W} ${CANVAS_H}`} width={CANVAS_W} height={CANVAS_H}>
        <defs>
          <radialGradient id="bg-grad-cv" cx="28%" cy="52%" r="72%">
            <stop offset="0%" stopColor="#0D2245" />
            <stop offset="100%" stopColor="#040E1E" />
          </radialGradient>
        </defs>
        <rect width={CANVAS_W} height={CANVAS_H} fill="url(#bg-grad-cv)" />
        {/* Primary concentric rings */}
        {[60,115,172,230,290,352,415,480,545,612,680,748,818].map((r, i) => (
          <circle key={r} cx="200" cy="590" r={r} fill="none"
            stroke="rgba(34,211,238,1)" strokeWidth="0.65"
            opacity={Math.max(0.02, 0.16 - i * 0.012)} />
        ))}
        {/* Secondary accent rings bottom-right */}
        {[45,95,148,205].map((r, i) => (
          <circle key={'br'+r} cx="720" cy="940" r={r} fill="none"
            stroke="rgba(34,211,238,1)" strokeWidth="0.5"
            opacity={Math.max(0.015, 0.065 - i * 0.012)} />
        ))}
        {/* Dot matrix overlay */}
        <defs>
          <pattern id="dotgrid-cv" x="0" y="0" width="24" height="24" patternUnits="userSpaceOnUse">
            <circle cx="1" cy="1" r="0.9" fill="rgba(34,211,238,0.22)" />
          </pattern>
        </defs>
        <rect width={CANVAS_W} height={CANVAS_H} fill="url(#dotgrid-cv)" opacity="0.045" />
        {/* Decorative outer frame lines */}
        <rect x="12" y="12" width={CANVAS_W-24} height={CANVAS_H-24}
          fill="none" stroke="rgba(34,211,238,0.18)" strokeWidth="1" />
        <rect x="16" y="16" width={CANVAS_W-32} height={CANVAS_H-32}
          fill="none" stroke="rgba(34,211,238,0.07)" strokeWidth="0.5" />
        {/* Corner ornaments */}
        {([[14,14],[CANVAS_W-14,14],[14,CANVAS_H-14],[CANVAS_W-14,CANVAS_H-14]] as [number,number][]).map(([cx,cy], i) => (
          <g key={i} transform={`translate(${cx},${cy})`}>
            <circle r="3.5" fill="none" stroke="rgba(34,211,238,0.5)" strokeWidth="1" />
            <circle r="1.2" fill="rgba(34,211,238,0.7)" />
          </g>
        ))}
      </svg>

      {/* ── Content ── */}
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', zIndex: 10 }}>

        {/* ════ HEADER ════ */}
        <div style={{
          flexShrink: 0, padding: '22px 32px 18px',
          borderBottom: '1px solid rgba(34,211,238,0.15)',
          background: 'rgba(4,10,24,0.55)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', flexDirection: t.rtl ? 'row-reverse' : 'row' }}>
            {/* OTX Hexagon */}
            <div style={{ position: 'relative', flexShrink: 0, width: 80, height: 92 }}>
              <svg viewBox="0 0 88 100" width="80" height="92">
                <polygon points="44,3 83,25 83,75 44,97 5,75 5,25"
                  fill="rgba(34,211,238,0.06)" stroke="rgba(34,211,238,0.7)" strokeWidth="1.6" />
                <polygon points="44,11 75,29 75,71 44,89 13,71 13,29"
                  fill="none" stroke="rgba(34,211,238,0.22)" strokeWidth="0.8" />
              </svg>
              <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ color: 'rgba(34,211,238,0.94)', fontWeight: 900, fontSize: 20, letterSpacing: '-0.5px' }}>OTX</span>
              </div>
            </div>

            <div style={{ flexShrink: 0, width: 1, height: 68, background: 'rgba(34,211,238,0.2)', margin: '0 22px' }} />

            {/* Title block */}
            <div style={{ flex: 1, textAlign: t.rtl ? 'right' : 'left' }}>
              <p style={{ color: 'rgba(183,196,214,0.75)', fontSize: 9.5, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.22em', marginBottom: 5 }}>
                {t.registry}
              </p>
              <h1 style={{ color: '#ffffff', fontSize: 38, fontWeight: 900, textTransform: 'uppercase', lineHeight: 1.05, letterSpacing: '-0.5px', margin: 0 }}>
                {t.certTitle1}<br />{t.certTitle2}
              </h1>
              <div style={{ marginTop: 9, display: 'flex', alignItems: 'center', gap: 10, flexDirection: t.rtl ? 'row-reverse' : 'row' }}>
                <div style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                  padding: '4px 12px', borderRadius: 20,
                  border: '1px solid rgba(50,230,255,0.52)',
                  background: 'rgba(50,230,255,0.07)',
                  boxShadow: '0 0 10px rgba(50,230,255,0.18)',
                }}>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'rgba(50,230,255,1)', boxShadow: '0 0 6px rgba(50,230,255,0.85)', flexShrink: 0 }} />
                  <span style={{ color: 'rgba(50,230,255,0.95)', fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.18em' }}>
                    {t.verifiedBadge}
                  </span>
                </div>
                <div style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                  padding: '4px 12px', borderRadius: 20,
                  border: '1px solid rgba(87,212,106,0.35)',
                  background: 'rgba(87,212,106,0.06)',
                }}>
                  <CheckCircle2 style={{ width: 10, height: 10, color: 'rgba(87,212,106,0.9)' }} />
                  <span style={{ color: 'rgba(87,212,106,0.9)', fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.14em' }}>
                    {cert.status}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ════ BODY ════ */}
        <div style={{ flex: 1, display: 'flex', gap: 20, padding: '22px 28px 16px', minHeight: 0, flexDirection: t.rtl ? 'row-reverse' : 'row' }}>

          {/* ── LEFT COLUMN ── */}
          <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', textAlign: t.rtl ? 'right' : 'left' }}>

            <div>
            {/* Certify intro */}
            <p style={{ color: 'rgba(183,196,214,0.65)', fontSize: 12, letterSpacing: '0.04em', marginBottom: 4 }}>
              {t.certifyIntro}
            </p>

            {/* Holder name */}
            <p style={{
              fontFamily: "'BillyMoney', 'Cormorant Garamond', Georgia, serif",
              fontWeight: 400,
              fontSize: 52, color: '#ffffff', lineHeight: 1.1, marginBottom: 10,
              letterSpacing: '0.01em',
              textShadow: '0 2px 20px rgba(255,255,255,0.08)',
            }}>
              {cert.holder_name}
            </p>

            {/* Thin decorative rule under name */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <div style={{ flex: 1, height: 1, background: 'linear-gradient(to right, rgba(50,230,255,0.4), rgba(50,230,255,0.05))' }} />
              <div style={{ width: 5, height: 5, borderRadius: '50%', background: 'rgba(50,230,255,0.5)', flexShrink: 0 }} />
            </div>

            {/* Body text */}
            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13.5, lineHeight: 2.0, maxWidth: 330 }}>
              {t.holderBody(cert.holder_name, cert.shares, cert.security_name, cert.security_code)}
            </p>

            {/* Key stats mini-strip */}
            <div style={{
              marginTop: 22,
              display: 'grid', gridTemplateColumns: '1fr 1fr 1fr',
              border: '1px solid rgba(50,230,255,0.2)',
              background: 'rgba(10,24,48,0.5)',
            }}>
              {[
                { label: cert.security_code, sub: cert.security_name },
                { label: price, sub: t.allocationPrice },
                { label: issueDate.replace(/(\d+)\s(\w+)\s(\d{4})/, '$2 $3'), sub: t.dateOfIssue },
              ].map((s, i) => (
                <div key={i} style={{
                  padding: '13px 10px', textAlign: 'center',
                  borderRight: i < 2 ? '1px solid rgba(50,230,255,0.15)' : undefined,
                }}>
                  <p style={{ color: 'rgba(50,230,255,0.9)', fontSize: 12.5, fontWeight: 800, letterSpacing: '0.04em' }}>{s.label}</p>
                  <p style={{ color: 'rgba(183,196,214,0.5)', fontSize: 8.5, textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: 3 }}>{s.sub}</p>
                </div>
              ))}
            </div>

            </div>

            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            {/* Ornamental divider */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '4px 0 16px' }}>
              <div style={{ flex: 1, height: 1, background: 'linear-gradient(to right, rgba(50,230,255,0.0), rgba(50,230,255,0.3))' }} />
              <svg width="40" height="12" viewBox="0 0 40 12">
                <polygon points="20,1 23,5 20,9 17,5" fill="none" stroke="rgba(50,230,255,0.55)" strokeWidth="0.8" />
                <line x1="0" y1="6" x2="14" y2="6" stroke="rgba(50,230,255,0.3)" strokeWidth="0.7" />
                <line x1="26" y1="6" x2="40" y2="6" stroke="rgba(50,230,255,0.3)" strokeWidth="0.7" />
              </svg>
              <div style={{ flex: 1, height: 1, background: 'linear-gradient(to left, rgba(50,230,255,0.0), rgba(50,230,255,0.3))' }} />
            </div>

            {/* SHARES HELD */}
            <div style={{ textAlign: 'center' }}>
              <div style={{ marginBottom: 16 }}>
                <p style={{ color: 'rgba(183,196,214,0.55)', fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.16em', marginBottom: 4 }}>
                  {t.certNo}
                </p>
                <p style={{ color: 'rgba(255,255,255,0.92)', fontSize: 22, fontWeight: 700, fontFamily: 'monospace', letterSpacing: '0.04em', direction: 'ltr' }}>
                  {cert.certificate_number}
                </p>
              </div>
              <p style={{
                color: 'rgba(255,255,255,0.92)', fontSize: 13, fontWeight: 800,
                textTransform: 'uppercase', letterSpacing: '0.3em', marginBottom: 0,
              }}>
                {t.sharesHeld}
              </p>
              <p style={{
                fontSize: 168, fontWeight: 900, fontStyle: 'italic',
                lineHeight: 0.9, color: 'rgba(50,230,255,1)',
                textShadow: '0 0 50px rgba(50,230,255,0.7), 0 0 100px rgba(50,230,255,0.32)',
                letterSpacing: '-6px', margin: 0,
              }}>
                {cert.shares}
              </p>
            </div>
            </div>
          </div>

          {/* ── RIGHT COLUMN ── */}
          <div style={{ flexShrink: 0, width: 316, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: 12 }}>

            {/* Data grid */}
            <div style={{ border: '1px solid rgba(50,230,255,0.35)', background: 'rgba(8,20,44,0.65)', flex: 1, display: 'flex', flexDirection: 'column' }}>
              <GridRow label={t.registeredHolder} value={cert.holder_name} br rtl={t.rtl} />
              <GridRow label={t.allocationRef} value={cert.reference_number} cyan divider rtl={t.rtl} />
              <GridRow label={t.registeredAddress} value={cert.registered_address ?? '—'} br divider rtl={t.rtl} />
              <GridRow label={t.security} value={`${cert.security_name} (${cert.security_code})\n${t.securitySub}`} divider rtl={t.rtl} />
              <GridRow label={t.allocationPrice} value={price} br divider rtl={t.rtl} />
              <GridRow label={t.totalConsideration} value={total} cyan divider rtl={t.rtl} />
              <GridRow label={t.dateOfIssue} value={issueDate} br divider rtl={t.rtl} />
              <GridRow label={t.status} value={cert.status} green rtl={t.rtl} />
            </div>

            {/* Auth panel */}
            <div style={{ border: '1px solid rgba(50,230,255,0.35)', background: 'rgba(8,20,44,0.65)', padding: '10px 12px' }}>
              {/* Cert number + badge */}
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8, marginBottom: 7, flexDirection: t.rtl ? 'row-reverse' : 'row' }}>
                <div style={{ textAlign: t.rtl ? 'right' : 'left' }}>
                  <p style={{ color: 'rgba(183,196,214,0.4)', fontSize: 8.5, marginBottom: 2 }}>{t.certNo}</p>
                  <p style={{ color: '#ffffff', fontSize: 11, fontWeight: 700, fontFamily: 'monospace', direction: 'ltr' }}>
                    {cert.certificate_number}
                  </p>
                </div>
                <div style={{
                  flexShrink: 0, display: 'inline-flex', alignItems: 'center', gap: 5,
                  padding: '4px 9px', borderRadius: 20,
                  border: '1px solid rgba(87,212,106,0.5)',
                  background: 'rgba(87,212,106,0.09)',
                  boxShadow: '0 0 8px rgba(87,212,106,0.15)',
                }}>
                  <CheckCircle2 style={{ width: 10, height: 10, color: 'rgba(87,212,106,1)' }} />
                  <span style={{ color: 'rgba(87,212,106,1)', fontSize: 8.5, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                    {t.authenticated}
                  </span>
                </div>
              </div>

              {/* Integrity hash + QR */}
              <div style={{ display: 'flex', gap: 9, flexDirection: t.rtl ? 'row-reverse' : 'row' }}>
                <div style={{ flex: 1, textAlign: t.rtl ? 'right' : 'left' }}>
                  <p style={{ color: 'rgba(183,196,214,0.4)', fontSize: 8, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 3 }}>
                    {t.integrityHash}
                  </p>
                  <p style={{ color: 'rgba(255,255,255,0.72)', fontSize: 8.5, fontFamily: 'monospace', wordBreak: 'break-all', lineHeight: 1.5, marginBottom: 6, direction: 'ltr', textAlign: 'left' }}>
                    {cert.integrity_hash}
                  </p>
                  <p style={{ color: 'rgba(183,196,214,0.42)', fontSize: 8.5, lineHeight: 1.6 }}>
                    {t.authBody(null)}
                  </p>
                </div>
                {qrDataUrl && (
                  <div style={{ flexShrink: 0, width: 58, height: 58, background: '#fff', padding: 3, alignSelf: 'flex-start', border: '1px solid rgba(50,230,255,0.15)' }}>
                    <img src={qrDataUrl} alt="QR" style={{ width: '100%', height: '100%' }} />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ════ SIGNATURE BAND ════ */}
        <div style={{
          flexShrink: 0,
          background: 'linear-gradient(180deg, #061326 0%, #040E1F 100%)',
          borderTop: '1px solid rgba(34,211,238,0.2)',
          padding: '16px 34px 20px',
        }}>
          {/* Ornamental divider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
            <div style={{ flex: 1, height: 1, background: 'linear-gradient(to right, rgba(50,230,255,0.0), rgba(50,230,255,0.3))' }} />
            <svg width="40" height="12" viewBox="0 0 40 12">
              <polygon points="20,1 23,5 20,9 17,5" fill="none" stroke="rgba(50,230,255,0.55)" strokeWidth="0.8" />
              <line x1="0" y1="6" x2="14" y2="6" stroke="rgba(50,230,255,0.3)" strokeWidth="0.7" />
              <line x1="26" y1="6" x2="40" y2="6" stroke="rgba(50,230,255,0.3)" strokeWidth="0.7" />
            </svg>
            <div style={{ flex: 1, height: 1, background: 'linear-gradient(to left, rgba(50,230,255,0.0), rgba(50,230,255,0.3))' }} />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 18, flexDirection: t.rtl ? 'row-reverse' : 'row' }}>
            {/* Signature block */}
            <div style={{ textAlign: t.rtl ? 'right' : 'left', flexShrink: 0 }}>
              <div style={{
                display: 'inline-block', background: '#fff', padding: '8px 14px',
                border: '1px solid rgba(50,230,255,0.3)',
                outline: '1px solid rgba(50,230,255,0.16)', outlineOffset: 3,
                boxShadow: '0 6px 22px rgba(0,0,0,0.4)', marginBottom: 11,
              }}>
                <img
                  src={signatureImg}
                  alt="Signature"
                  style={{ width: 200, height: 'auto', objectFit: 'contain', display: 'block' }}
                />
              </div>
              <p style={{
                color: 'rgba(50,230,255,0.9)', fontSize: 8.5, fontWeight: 800,
                textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: 7,
              }}>
                {t.authorisedSig}
              </p>
              <div style={{ color: '#ffffff', fontSize: 9.5, lineHeight: 1.75 }}>
                <p><span style={{ color: 'rgba(255,255,255,0.55)', display: 'inline-block', minWidth: 36, fontSize: 8.5, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{t.nameLabel}</span> Mr. Simon Mark Hickman</p>
                <p><span style={{ color: 'rgba(255,255,255,0.55)', display: 'inline-block', minWidth: 36, fontSize: 8.5, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{t.titleLabel}</span> Chief Executive, Omni Wealth Ltd</p>
                <p><span style={{ color: 'rgba(255,255,255,0.55)', display: 'inline-block', minWidth: 36, fontSize: 8.5, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{t.dateLabel}</span> {issueDate}</p>
              </div>
            </div>

            {/* Center authentication emblem */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 9 }}>
              <div style={{
                position: 'relative', width: 88, height: 88,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                borderRadius: '50%',
                border: '1.5px solid rgba(50,230,255,0.45)',
                background: 'rgba(8,20,44,0.5)',
                boxShadow: 'inset 0 0 0 4px rgba(8,20,44,0.55), 0 0 20px rgba(34,211,238,0.12)',
              }}>
                <div style={{ position: 'absolute', inset: 6, borderRadius: '50%', border: '1px dashed rgba(50,230,255,0.28)' }} />
                <CheckCircle2 size={32} color="rgba(50,230,255,0.9)" strokeWidth={1.6} />
              </div>
              <p style={{ color: 'rgba(50,230,255,0.7)', fontSize: 8, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.24em', textAlign: 'center' }}>
                {t.authenticated}
              </p>
            </div>

            {/* Seal */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, flexShrink: 0 }}>
              <div style={{
                background: '#fff', padding: 8,
                border: '1px solid rgba(50,230,255,0.3)',
                outline: '1px solid rgba(50,230,255,0.16)', outlineOffset: 3,
                boxShadow: '0 6px 22px rgba(0,0,0,0.4)', display: 'flex',
              }}>
                <img
                  src={sealImg}
                  alt="Official Seal"
                  style={{ width: 124, height: 124, objectFit: 'contain', display: 'block' }}
                />
              </div>
              <p style={{
                color: 'rgba(50,230,255,0.7)', fontSize: 8, fontWeight: 700,
                textTransform: 'uppercase', letterSpacing: '0.24em',
              }}>
                {t.officialSeal}
              </p>
            </div>
          </div>
        </div>

        {/* ════ FOOTER STRIP ════ */}
        <div style={{
          flexShrink: 0,
          background: '#040E1E',
          borderTop: '1px solid rgba(34,211,238,0.12)',
          padding: '5px 28px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          flexDirection: t.rtl ? 'row-reverse' : 'row',
        }}>
          <p style={{ color: 'rgba(183,196,214,0.32)', fontSize: 7.5, textTransform: 'uppercase', letterSpacing: '0.14em' }}>
            OmniTradeX Pre-IPO Securities Registry &bull; omnitradex.com
          </p>
          <p style={{ color: 'rgba(183,196,214,0.32)', fontSize: 7.5, fontFamily: 'monospace', letterSpacing: '0.05em' }}>
            {cert.reference_number}
          </p>
        </div>

      </div>
    </div>
  );
});

CertificateView.displayName = 'CertificateView';
export default CertificateView;

// ── Grid row ──────────────────────────────────────────────────────────────────

function GridRow({ label, value, br, cyan, green, divider, rtl }: {
  label: string; value: string;
  br?: boolean; cyan?: boolean; green?: boolean; divider?: boolean; rtl?: boolean;
}) {
  return (
    <div style={{
      flex: 1,
      display: 'grid', gridTemplateColumns: '1fr 1fr', alignItems: 'center',
      borderBottom: divider ? '1px solid rgba(50,230,255,0.18)' : undefined,
      direction: rtl ? 'rtl' : 'ltr',
    }}>
      <div style={{
        borderRight: !rtl && br ? '1px solid rgba(50,230,255,0.18)' : undefined,
        borderLeft: rtl && br ? '1px solid rgba(50,230,255,0.18)' : undefined,
        padding: '13px 10px', height: '100%', display: 'flex', alignItems: 'center',
      }}>
        <p style={{ color: 'rgba(183,196,214,0.45)', fontSize: 8, textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600 }}>
          {label}
        </p>
      </div>
      <div style={{ padding: '13px 10px', height: '100%', display: 'flex', alignItems: 'center' }}>
        <p style={{
          fontSize: 11.5, fontWeight: 700, lineHeight: 1.35, whiteSpace: 'pre-line',
          color: cyan ? 'rgba(50,230,255,1)' : green ? 'rgba(87,212,106,1)' : '#ffffff',
        }}>
          {value}
        </p>
      </div>
    </div>
  );
}
