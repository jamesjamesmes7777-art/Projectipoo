import { useState, useEffect, useRef } from 'react';
import {
  Plus, LogOut, Search, FileText, Download, CheckCircle, XCircle,
  RotateCcw, Trash2, Eye, Clock, ChevronRight, ShieldCheck, AlertTriangle, Filter
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import {
  getAllCertificates, createCertificate, updateCertificate,
  setApprovalStatus, deleteCertificate, getAuditLogs,
} from '../lib/certificates';
import { generateQRDataUrl, exportCertificatePDF } from '../lib/pdfExport';
import type { Certificate, AuditLog, ApprovalStatus } from '../lib/types';
import CertificateForm from './CertificateForm';
import CertificateView from './CertificateView';

const STATUS_COLOR: Record<ApprovalStatus, string> = {
  DRAFT:    'text-slate-400 bg-slate-800 border-slate-700',
  PENDING:  'text-amber-400 bg-amber-500/10 border-amber-500/30',
  APPROVED: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
  REJECTED: 'text-red-400 bg-red-500/10 border-red-500/30',
  REVOKED:  'text-orange-400 bg-orange-500/10 border-orange-500/30',
};

type View = 'list' | 'preview' | 'audit';

export default function AdminDashboard() {
  const [certs, setCerts] = useState<Certificate[]>([]);
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [view, setView] = useState<View>('list');
  const [selected, setSelected] = useState<Certificate | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editTarget, setEditTarget] = useState<Certificate | undefined>();
  const [qrUrl, setQrUrl] = useState('');
  const [exporting, setExporting] = useState(false);
  const certRef = useRef<HTMLDivElement>(null);

  async function load() {
    const [c, l] = await Promise.all([getAllCertificates(), getAuditLogs()]);
    setCerts(c);
    setLogs(l);
  }

  useEffect(() => { load(); }, []);

  async function handlePreview(cert: Certificate) {
    setSelected(cert);
    setView('preview');
    const qr = await generateQRDataUrl(`${window.location.origin}/verify/${cert.reference_number}`);
    setQrUrl(qr);
  }

  async function handleStatusChange(cert: Certificate, status: ApprovalStatus) {
    await setApprovalStatus(cert.id, status);
    await load();
    if (selected?.id === cert.id) setSelected(s => s ? { ...s, approval_status: status } : s);
  }

  async function handleDelete(cert: Certificate) {
    if (!confirm(`Delete certificate ${cert.reference_number}? This cannot be undone.`)) return;
    await deleteCertificate(cert.id);
    await load();
    if (selected?.id === cert.id) { setSelected(null); setView('list'); }
  }

  async function handleExport() {
    if (!certRef.current || !selected) return;
    setExporting(true);
    try {
      await exportCertificatePDF(certRef.current, `cert-${selected.reference_number}.pdf`);
    } finally {
      setExporting(false);
    }
  }

  const filtered = certs.filter(c => {
    const matchSearch = !search ||
      c.holder_name.toLowerCase().includes(search.toLowerCase()) ||
      c.reference_number.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === 'ALL' || c.approval_status === filterStatus;
    return matchSearch && matchStatus;
  });

  const stats = {
    total: certs.length,
    approved: certs.filter(c => c.approval_status === 'APPROVED').length,
    pending: certs.filter(c => c.approval_status === 'PENDING').length,
    draft: certs.filter(c => c.approval_status === 'DRAFT').length,
  };

  return (
    <div className="min-h-screen flex" style={{ background: '#020810' }}>
      {/* Sidebar */}
      <aside className="w-60 flex-shrink-0 border-r border-slate-800/60 flex flex-col" style={{ background: 'rgba(4,12,28,0.95)' }}>
        <div className="px-5 py-6 border-b border-slate-800/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
              <span className="text-white font-black text-xs">OTX</span>
            </div>
            <div>
              <p className="text-white font-bold text-sm tracking-tight">OmniTradeX</p>
              <p className="text-slate-600 text-[10px]">Admin Portal</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-3 space-y-1">
          {([
            ['list', FileText, 'Certificates'],
            ['audit', Clock, 'Audit Log'],
          ] as [View, React.ElementType, string][]).map(([v, Icon, label]) => (
            <button key={v} onClick={() => setView(v)}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                view === v ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20' : 'text-slate-500 hover:text-slate-200 hover:bg-slate-800/40'
              }`}>
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </nav>

        <div className="p-3 border-t border-slate-800/60">
          <button
            onClick={() => supabase.auth.signOut()}
            className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/5 text-sm font-medium transition-all"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">

        {/* ── CERTIFICATES LIST ── */}
        {(view === 'list' || view === 'preview') && (
          <>
            {/* Topbar */}
            <div className="flex-shrink-0 border-b border-slate-800/50 px-6 py-4 flex items-center gap-4" style={{ background: 'rgba(4,12,28,0.7)' }}>
              <h1 className="text-white font-bold text-lg flex-1">Certificates</h1>
              <button
                onClick={() => { setEditTarget(undefined); setShowForm(true); }}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-sm transition-all"
              >
                <Plus className="w-4 h-4" />
                New Certificate
              </button>
            </div>

            <div className="flex-1 flex overflow-hidden">
              {/* Left: list */}
              <div className={`flex flex-col border-r border-slate-800/50 ${view === 'preview' ? 'w-80 flex-shrink-0' : 'flex-1'}`}>

                {/* Stats */}
                {view === 'list' && (
                  <div className="flex-shrink-0 px-6 py-4 grid grid-cols-4 gap-3 border-b border-slate-800/40">
                    {[
                      { label: 'Total', value: stats.total, color: 'text-white' },
                      { label: 'Approved', value: stats.approved, color: 'text-emerald-400' },
                      { label: 'Pending', value: stats.pending, color: 'text-amber-400' },
                      { label: 'Draft', value: stats.draft, color: 'text-slate-400' },
                    ].map(s => (
                      <div key={s.label} className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/40 text-center">
                        <p className={`text-2xl font-black ${s.color}`}>{s.value}</p>
                        <p className="text-slate-600 text-xs font-medium mt-0.5">{s.label}</p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Search + filter */}
                <div className="flex-shrink-0 px-4 py-3 flex gap-2 border-b border-slate-800/40">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-600" />
                    <input value={search} onChange={e => setSearch(e.target.value)}
                      placeholder="Search name or reference…"
                      className="w-full pl-9 pr-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-white text-sm placeholder-slate-700 focus:outline-none focus:border-cyan-500/40 transition-all" />
                  </div>
                  <div className="relative">
                    <Filter className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-600" />
                    <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
                      className="pl-7 pr-2 py-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 text-sm focus:outline-none focus:border-cyan-500/40 transition-all appearance-none">
                      <option value="ALL">All</option>
                      {['DRAFT','PENDING','APPROVED','REJECTED','REVOKED'].map(s => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Certificate rows */}
                <div className="flex-1 overflow-y-auto">
                  {filtered.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-48 text-slate-600">
                      <FileText className="w-8 h-8 mb-3 opacity-30" />
                      <p className="text-sm">No certificates found</p>
                    </div>
                  ) : filtered.map(cert => (
                    <div
                      key={cert.id}
                      className={`px-4 py-3.5 border-b border-slate-800/40 cursor-pointer hover:bg-slate-800/30 transition-all ${selected?.id === cert.id ? 'bg-slate-800/40' : ''}`}
                      onClick={() => handlePreview(cert)}
                    >
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <p className="text-white text-sm font-semibold truncate">{cert.holder_name}</p>
                        <span className={`flex-shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-full border ${STATUS_COLOR[cert.approval_status]}`}>
                          {cert.approval_status}
                        </span>
                      </div>
                      <p className="text-slate-500 text-xs font-mono">{cert.reference_number}</p>
                      <div className="flex items-center gap-3 mt-1">
                        <p className="text-slate-600 text-xs">{cert.shares} shares · €{Number(cert.total_consideration).toLocaleString()}</p>
                        <ChevronRight className="w-3 h-3 text-slate-700 ml-auto" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right: preview panel */}
              {view === 'preview' && selected && (
                <div className="flex-1 flex flex-col overflow-hidden">
                  {/* Preview toolbar */}
                  <div className="flex-shrink-0 px-5 py-3 border-b border-slate-800/50 flex items-center gap-2 flex-wrap" style={{ background: 'rgba(4,12,28,0.7)' }}>
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${STATUS_COLOR[selected.approval_status]}`}>
                      {selected.approval_status}
                    </span>
                    <div className="flex-1" />

                    {selected.approval_status === 'DRAFT' && (
                      <ActionBtn icon={ShieldCheck} label="Submit" color="amber"
                        onClick={() => handleStatusChange(selected, 'PENDING')} />
                    )}
                    {selected.approval_status === 'PENDING' && (<>
                      <ActionBtn icon={CheckCircle} label="Approve" color="emerald"
                        onClick={() => handleStatusChange(selected, 'APPROVED')} />
                      <ActionBtn icon={XCircle} label="Reject" color="red"
                        onClick={() => handleStatusChange(selected, 'REJECTED')} />
                    </>)}
                    {selected.approval_status === 'APPROVED' && (
                      <ActionBtn icon={RotateCcw} label="Revoke" color="orange"
                        onClick={() => handleStatusChange(selected, 'REVOKED')} />
                    )}
                    {(selected.approval_status === 'REJECTED' || selected.approval_status === 'REVOKED') && (
                      <ActionBtn icon={ShieldCheck} label="Re-submit" color="amber"
                        onClick={() => handleStatusChange(selected, 'PENDING')} />
                    )}

                    <button onClick={() => { setEditTarget(selected); setShowForm(true); }}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-700 hover:border-cyan-500/40 text-slate-300 hover:text-white text-xs font-semibold transition-all">
                      <Eye className="w-3.5 h-3.5" />
                      Edit
                    </button>
                    <button onClick={handleExport} disabled={exporting}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-700 hover:border-cyan-500/40 text-slate-300 hover:text-white text-xs font-semibold transition-all disabled:opacity-50">
                      <Download className="w-3.5 h-3.5" />
                      {exporting ? 'Exporting…' : 'PDF'}
                    </button>
                    <button onClick={() => handleDelete(selected)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-red-500/20 hover:border-red-500/50 text-red-400 text-xs font-semibold transition-all">
                      <Trash2 className="w-3.5 h-3.5" />
                      Delete
                    </button>
                  </div>

                  {/* Certificate preview */}
                  <div className="flex-1 overflow-auto flex items-start justify-center p-8" style={{ background: '#020810' }}>
                    <div style={{ transform: 'scale(0.68)', transformOrigin: 'top center', width: 793, marginBottom: -360 }}>
                      <CertificateView ref={certRef} cert={selected} qrDataUrl={qrUrl} />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </>
        )}

        {/* ── AUDIT LOG ── */}
        {view === 'audit' && (
          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="flex-shrink-0 border-b border-slate-800/50 px-6 py-4" style={{ background: 'rgba(4,12,28,0.7)' }}>
              <h1 className="text-white font-bold text-lg">Audit Log</h1>
            </div>
            <div className="flex-1 overflow-y-auto p-6">
              {logs.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-48 text-slate-600">
                  <Clock className="w-8 h-8 mb-3 opacity-30" />
                  <p className="text-sm">No audit events yet</p>
                </div>
              ) : (
                <div className="space-y-2 max-w-3xl">
                  {logs.map(log => (
                    <div key={log.id} className="flex items-start gap-4 px-4 py-3 rounded-xl bg-slate-900/50 border border-slate-800/40">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center">
                        <ActionIcon action={log.action} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-white text-sm font-semibold">{log.action}</span>
                          {log.certificate_id && (
                            <span className="text-slate-500 text-xs font-mono truncate">{log.certificate_id.slice(0, 8)}</span>
                          )}
                        </div>
                        <p className="text-slate-600 text-xs mt-0.5">
                          {new Date(log.created_at).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Certificate Form Modal */}
      {showForm && (
        <CertificateForm
          initial={editTarget}
          onSave={async data => {
            if (editTarget?.id) {
              await updateCertificate(editTarget.id, data);
            } else {
              await createCertificate(data);
            }
            setShowForm(false);
            await load();
          }}
          onCancel={() => setShowForm(false)}
        />
      )}
    </div>
  );
}

function ActionBtn({ icon: Icon, label, color, onClick }: {
  icon: React.ElementType; label: string; color: string; onClick: () => void;
}) {
  const colors: Record<string, string> = {
    emerald: 'border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10',
    red: 'border-red-500/30 text-red-400 hover:bg-red-500/10',
    amber: 'border-amber-500/30 text-amber-400 hover:bg-amber-500/10',
    orange: 'border-orange-500/30 text-orange-400 hover:bg-orange-500/10',
  };
  return (
    <button onClick={onClick}
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all ${colors[color]}`}>
      <Icon className="w-3.5 h-3.5" />
      {label}
    </button>
  );
}

function ActionIcon({ action }: { action: string }) {
  if (action === 'APPROVED') return <CheckCircle className="w-4 h-4 text-emerald-400" />;
  if (action === 'REJECTED') return <XCircle className="w-4 h-4 text-red-400" />;
  if (action === 'REVOKED')  return <RotateCcw className="w-4 h-4 text-orange-400" />;
  if (action === 'DELETED')  return <Trash2 className="w-4 h-4 text-red-400" />;
  if (action === 'PENDING')  return <AlertTriangle className="w-4 h-4 text-amber-400" />;
  return <FileText className="w-4 h-4 text-slate-400" />;
}
