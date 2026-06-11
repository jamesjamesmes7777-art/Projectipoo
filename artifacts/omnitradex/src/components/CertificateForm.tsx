import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import type { Certificate } from '../lib/types';
import { generateCertificateNumber, generateIntegrityHash } from '../lib/certificates';

interface Props {
  initial?: Partial<Certificate>;
  onSave: (data: Omit<Certificate, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  onCancel: () => void;
}

const EMPTY: Omit<Certificate, 'id' | 'created_at' | 'updated_at'> = {
  reference_number: '',
  holder_name: '',
  registered_address: '',
  security_name: 'SpaceX',
  security_code: 'SPCX',
  shares: 87,
  allocation_price: 117,
  total_consideration: 10179,
  issue_date: new Date().toISOString().slice(0, 10),
  certificate_number: '',
  integrity_hash: '',
  status: 'Settled • Verified',
  approval_status: 'DRAFT',
  language: 'en',
  account_manager: '',
  approved_by: null,
  approved_at: null,
  created_by: null,
  qr_url: null,
  pdf_url: null,
};

export default function CertificateForm({ initial, onSave, onCancel }: Props) {
  const [form, setForm] = useState<Omit<Certificate, 'id' | 'created_at' | 'updated_at'>>({
    ...EMPTY, ...initial,
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const set = (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const val = e.target.type === 'number' ? Number(e.target.value) : e.target.value;
    setForm(f => {
      const updated = { ...f, [field]: val };
      if (field === 'shares' || field === 'allocation_price') {
        updated.total_consideration = Number(updated.shares) * Number(updated.allocation_price);
      }
      return updated;
    });
  };

  useEffect(() => {
    if (!form.certificate_number && form.reference_number) {
      setForm(f => ({ ...f, certificate_number: generateCertificateNumber(f.reference_number) }));
    }
  }, [form.reference_number, form.certificate_number]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setSaving(true);
    try {
      const hash = form.integrity_hash || generateIntegrityHash(form.reference_number, form.holder_name, form.shares);
      await onSave({ ...form, integrity_hash: hash });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Save failed');
    } finally {
      setSaving(false);
    }
  }

  const F = ({ label, name, type = 'text', required }: { label: string; name: keyof typeof form; type?: string; required?: boolean }) => (
    <div>
      <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-1.5">{label}</label>
      <input
        type={type}
        value={String(form[name] ?? '')}
        onChange={set(name)}
        required={required}
        step={type === 'number' ? 'any' : undefined}
        className="w-full px-3 py-2.5 rounded-lg bg-slate-900 border border-slate-700/60 text-white text-sm focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20 transition-all"
      />
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-10 pb-6 px-4 overflow-y-auto" style={{ background: 'rgba(0,0,0,0.85)' }}>
      <div className="w-full max-w-2xl rounded-2xl border border-slate-700/50 bg-slate-950 shadow-2xl">
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-800">
          <h2 className="text-white font-bold text-lg">{initial?.id ? 'Edit Certificate' : 'New Certificate'}</h2>
          <button onClick={onCancel} className="text-slate-500 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <F label="Reference Number" name="reference_number" required />
            <F label="Certificate Number" name="certificate_number" />
            <F label="Holder Name" name="holder_name" required />
            <F label="Registered Address" name="registered_address" />
            <F label="Security Name" name="security_name" required />
            <F label="Security Code" name="security_code" required />
            <F label="Shares" name="shares" type="number" required />
            <F label="Allocation Price (€)" name="allocation_price" type="number" required />
            <F label="Total Consideration (€)" name="total_consideration" type="number" required />
            <F label="Issue Date" name="issue_date" type="date" required />
            <F label="Account Manager" name="account_manager" />
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-1.5">Language</label>
              <select value={form.language} onChange={set('language')}
                className="w-full px-3 py-2.5 rounded-lg bg-slate-900 border border-slate-700/60 text-white text-sm focus:outline-none focus:border-cyan-500/50 transition-all">
                {['en','el','fr','de','es','it','ar'].map(l => <option key={l} value={l}>{l.toUpperCase()}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-1.5">Integrity Hash</label>
            <input value={form.integrity_hash} onChange={set('integrity_hash')}
              placeholder="Auto-generated if left blank"
              className="w-full px-3 py-2.5 rounded-lg bg-slate-900 border border-slate-700/60 text-white text-sm font-mono focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20 transition-all" />
          </div>

          {error && (
            <p className="text-red-400 text-sm bg-red-500/8 border border-red-500/20 rounded-lg px-4 py-2.5">{error}</p>
          )}

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onCancel}
              className="flex-1 py-2.5 rounded-lg border border-slate-700 text-slate-300 hover:text-white text-sm font-semibold transition-all">
              Cancel
            </button>
            <button type="submit" disabled={saving}
              className="flex-1 py-2.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-sm transition-all disabled:opacity-50">
              {saving ? 'Saving…' : 'Save Certificate'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
