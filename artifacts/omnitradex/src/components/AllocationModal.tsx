import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from 'react';
import { X, CheckCircle2, Loader2, ShieldCheck, Copy } from 'lucide-react';
import { useLang, type LangCode } from '../context/LangContext';
import { requestAllocation } from '../lib/certificates';

const PRICE_PER_SHARE = 117;
const MIN_SHARES = 87;

interface AllocStrings {
  title: string;
  subtitle: string;
  name: string;
  email: string;
  shares: string;
  address: string;
  priceNote: string;
  total: string;
  submit: string;
  submitting: string;
  successTitle: string;
  successBody: string;
  refLabel: string;
  refNote: string;
  done: string;
  err: string;
  minErr: string;
}

const STRINGS: Record<LangCode, AllocStrings> = {
  en: {
    title: 'Secure Your Allocation',
    subtitle:
      'Reserve your SpaceX (SPCX) pre-IPO allocation. Every request is reviewed and confirmed by our team before it is issued.',
    name: 'Full name',
    email: 'Email address',
    shares: 'Number of shares',
    address: 'Registered address',
    priceNote: `€${PRICE_PER_SHARE} per share · minimum ${MIN_SHARES} shares`,
    total: 'Total consideration',
    submit: 'Submit Request',
    submitting: 'Submitting…',
    successTitle: 'Request Received',
    successBody:
      'Your allocation request is pending review. Our team will verify and confirm it shortly.',
    refLabel: 'Your reference number',
    refNote: 'Keep this reference to track your allocation.',
    done: 'Done',
    err: 'Something went wrong. Please try again.',
    minErr: `A minimum of ${MIN_SHARES} shares is required.`,
  },
  el: {
    title: 'Εξασφαλίστε την Κατανομή σας',
    subtitle:
      'Δεσμεύστε την κατανομή SpaceX (SPCX) πριν την IPO. Κάθε αίτημα ελέγχεται και επιβεβαιώνεται από την ομάδα μας πριν εκδοθεί.',
    name: 'Ονοματεπώνυμο',
    email: 'Διεύθυνση email',
    shares: 'Αριθμός μετοχών',
    address: 'Διεύθυνση κατοικίας',
    priceNote: `€${PRICE_PER_SHARE} ανά μετοχή · ελάχιστο ${MIN_SHARES} μετοχές`,
    total: 'Συνολικό αντίτιμο',
    submit: 'Υποβολή Αιτήματος',
    submitting: 'Υποβολή…',
    successTitle: 'Το Αίτημα Ελήφθη',
    successBody:
      'Το αίτημα κατανομής σας εκκρεμεί προς έλεγχο. Η ομάδα μας θα το επαληθεύσει και θα το επιβεβαιώσει σύντομα.',
    refLabel: 'Ο αριθμός αναφοράς σας',
    refNote: 'Κρατήστε αυτή την αναφορά για να παρακολουθείτε την κατανομή σας.',
    done: 'Τέλος',
    err: 'Κάτι πήγε στραβά. Δοκιμάστε ξανά.',
    minErr: `Απαιτείται ελάχιστο ${MIN_SHARES} μετοχών.`,
  },
  it: {
    title: 'Assicura la tua Allocazione',
    subtitle:
      'Prenota la tua allocazione SpaceX (SPCX) pre-IPO. Ogni richiesta viene esaminata e confermata dal nostro team prima dell’emissione.',
    name: 'Nome completo',
    email: 'Indirizzo email',
    shares: 'Numero di azioni',
    address: 'Indirizzo di residenza',
    priceNote: `€${PRICE_PER_SHARE} per azione · minimo ${MIN_SHARES} azioni`,
    total: 'Controvalore totale',
    submit: 'Invia Richiesta',
    submitting: 'Invio…',
    successTitle: 'Richiesta Ricevuta',
    successBody:
      'La tua richiesta di allocazione è in attesa di revisione. Il nostro team la verificherà e confermerà a breve.',
    refLabel: 'Il tuo numero di riferimento',
    refNote: 'Conserva questo riferimento per tracciare la tua allocazione.',
    done: 'Fatto',
    err: 'Qualcosa è andato storto. Riprova.',
    minErr: `È richiesto un minimo di ${MIN_SHARES} azioni.`,
  },
  de: {
    title: 'Sichern Sie Ihre Allokation',
    subtitle:
      'Reservieren Sie Ihre SpaceX (SPCX) Pre-IPO-Allokation. Jede Anfrage wird von unserem Team geprüft und bestätigt, bevor sie ausgestellt wird.',
    name: 'Vollständiger Name',
    email: 'E-Mail-Adresse',
    shares: 'Anzahl der Aktien',
    address: 'Gemeldete Adresse',
    priceNote: `€${PRICE_PER_SHARE} pro Aktie · mindestens ${MIN_SHARES} Aktien`,
    total: 'Gesamtbetrag',
    submit: 'Anfrage Senden',
    submitting: 'Senden…',
    successTitle: 'Anfrage Erhalten',
    successBody:
      'Ihre Allokationsanfrage wird derzeit geprüft. Unser Team wird sie in Kürze verifizieren und bestätigen.',
    refLabel: 'Ihre Referenznummer',
    refNote: 'Bewahren Sie diese Referenz auf, um Ihre Allokation zu verfolgen.',
    done: 'Fertig',
    err: 'Etwas ist schiefgelaufen. Bitte versuchen Sie es erneut.',
    minErr: `Es sind mindestens ${MIN_SHARES} Aktien erforderlich.`,
  },
  es: {
    title: 'Asegure su Asignación',
    subtitle:
      'Reserve su asignación de SpaceX (SPCX) pre-IPO. Cada solicitud es revisada y confirmada por nuestro equipo antes de su emisión.',
    name: 'Nombre completo',
    email: 'Correo electrónico',
    shares: 'Número de acciones',
    address: 'Dirección registrada',
    priceNote: `€${PRICE_PER_SHARE} por acción · mínimo ${MIN_SHARES} acciones`,
    total: 'Contraprestación total',
    submit: 'Enviar Solicitud',
    submitting: 'Enviando…',
    successTitle: 'Solicitud Recibida',
    successBody:
      'Su solicitud de asignación está pendiente de revisión. Nuestro equipo la verificará y confirmará en breve.',
    refLabel: 'Su número de referencia',
    refNote: 'Guarde esta referencia para hacer seguimiento de su asignación.',
    done: 'Listo',
    err: 'Algo salió mal. Inténtelo de nuevo.',
    minErr: `Se requiere un mínimo de ${MIN_SHARES} acciones.`,
  },
};

interface AllocationContextType {
  open: () => void;
}

const AllocationContext = createContext<AllocationContextType | null>(null);

export function useAllocation(): AllocationContextType {
  const ctx = useContext(AllocationContext);
  if (!ctx) throw new Error('useAllocation must be used inside AllocationProvider');
  return ctx;
}

function fmtEur(n: number): string {
  return new Intl.NumberFormat('en-IE', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(n);
}

export function AllocationProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);

  return (
    <AllocationContext.Provider value={{ open }}>
      {children}
      {isOpen && <AllocationModal onClose={close} />}
    </AllocationContext.Provider>
  );
}

function AllocationModal({ onClose }: { onClose: () => void }) {
  const { lang } = useLang();
  const s = STRINGS[lang] ?? STRINGS.en;

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [shares, setShares] = useState<string>(String(MIN_SHARES));
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reference, setReference] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const sharesNum = Number.parseInt(shares, 10) || 0;
  const total = sharesNum * PRICE_PER_SHARE;
  const valid =
    name.trim().length > 0 &&
    /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email.trim()) &&
    address.trim().length > 0 &&
    sharesNum >= MIN_SHARES;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!valid || submitting) return;
    setSubmitting(true);
    setError(null);
    try {
      const ref = await requestAllocation({
        holder_name: name.trim(),
        email: email.trim(),
        registered_address: address.trim(),
        shares: sharesNum,
        language: lang,
      });
      setReference(ref);
    } catch {
      setError(s.err);
    } finally {
      setSubmitting(false);
    }
  }

  async function copyRef() {
    if (!reference) return;
    try {
      await navigator.clipboard.writeText(reference);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard unavailable */
    }
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
    >
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />

      <div
        className="relative w-full max-w-md max-h-[90vh] overflow-y-auto rounded-2xl border border-cyan-500/20 shadow-2xl"
        style={{
          background:
            'linear-gradient(180deg, #08152b 0%, #050d1c 100%)',
        }}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-500 hover:text-white transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {reference ? (
          <div className="p-8 text-center">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10 border border-emerald-500/30">
              <CheckCircle2 className="w-8 h-8 text-emerald-400" />
            </div>
            <h2 className="text-xl font-bold text-white mb-2">{s.successTitle}</h2>
            <p className="text-slate-400 text-sm leading-relaxed mb-6">
              {s.successBody}
            </p>

            <div className="rounded-xl border border-cyan-500/25 bg-cyan-500/5 px-4 py-4 mb-3">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-cyan-400/80 mb-2">
                {s.refLabel}
              </p>
              <div className="flex items-center justify-center gap-2">
                <span className="font-mono text-lg font-bold text-white tracking-wide">
                  {reference}
                </span>
                <button
                  onClick={copyRef}
                  className="text-slate-400 hover:text-cyan-400 transition-colors"
                  aria-label="Copy reference"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
              {copied && (
                <p className="text-[10px] text-emerald-400 mt-1.5">✓</p>
              )}
            </div>
            <p className="text-slate-600 text-xs mb-6">{s.refNote}</p>

            <button
              onClick={onClose}
              className="btn-primary w-full px-6 py-3 rounded-xl text-white font-bold text-sm tracking-wide"
            >
              {s.done}
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-7">
            <div className="flex items-center gap-2.5 mb-1.5">
              <ShieldCheck className="w-5 h-5 text-cyan-400" />
              <h2 className="text-xl font-bold text-white">{s.title}</h2>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed mb-6">
              {s.subtitle}
            </p>

            <div className="space-y-4">
              <Field label={s.name}>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="alloc-input"
                  autoComplete="name"
                />
              </Field>

              <Field label={s.email}>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="alloc-input"
                  autoComplete="email"
                />
              </Field>

              <Field label={s.shares}>
                <input
                  type="number"
                  min={MIN_SHARES}
                  step={1}
                  value={shares}
                  onChange={(e) => setShares(e.target.value)}
                  required
                  className="alloc-input"
                />
                <p className="text-[11px] text-slate-500 mt-1.5">{s.priceNote}</p>
              </Field>

              <Field label={s.address}>
                <textarea
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  required
                  rows={2}
                  className="alloc-input resize-none"
                  autoComplete="street-address"
                />
              </Field>
            </div>

            <div className="mt-5 flex items-center justify-between rounded-xl border border-slate-700/50 bg-slate-900/40 px-4 py-3">
              <span className="text-xs font-medium uppercase tracking-wider text-slate-500">
                {s.total}
              </span>
              <span className="text-lg font-bold text-cyan-400 tabular-nums">
                {fmtEur(total)}
              </span>
            </div>

            {error && (
              <p className="mt-4 text-sm text-rose-400 text-center">{error}</p>
            )}

            <button
              type="submit"
              disabled={!valid || submitting}
              className="btn-primary mt-5 w-full px-6 py-3.5 rounded-xl text-white font-bold text-sm tracking-wide flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  {s.submitting}
                </>
              ) : (
                s.submit
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[11px] font-bold uppercase tracking-[0.12em] text-slate-400">
        {label}
      </span>
      {children}
    </label>
  );
}
