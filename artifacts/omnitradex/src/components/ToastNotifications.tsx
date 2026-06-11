import { useState, useEffect, useCallback } from 'react';
import { X } from 'lucide-react';
import { useLang } from '../context/LangContext';
import { useInventory } from '../context/InventoryContext';

const NOTIFICATIONS = [
  { name: 'Sebastian N.', city: 'Valencia, ES', shares: 1175 },
  { name: 'Marco V.', city: 'Milan, IT', shares: 350 },
  { name: 'Hannah K.', city: 'Munich, DE', shares: 522 },
  { name: 'Pierre L.', city: 'Paris, FR', shares: 250 },
  { name: 'Andreas M.', city: 'Athens, GR', shares: 87 },
  { name: 'Sophia R.', city: 'Vienna, AT', shares: 174 },
  { name: 'Lars E.', city: 'Oslo, NO', shares: 609 },
  { name: 'Isabel F.', city: 'Barcelona, ES', shares: 261 },
  { name: 'Thomas B.', city: 'Brussels, BE', shares: 435 },
  { name: 'Giulia C.', city: 'Rome, IT', shares: 696 },
  { name: 'Nadia P.', city: 'Copenhagen, DK', shares: 348 },
  { name: 'Erik S.', city: 'Stockholm, SE', shares: 870 },
];

interface Toast {
  id: number;
  name: string;
  city: string;
  shares: number;
}

let toastCounter = 0;

export default function ToastNotifications() {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const { t } = useLang();
  const { addAllocation } = useInventory();

  const dismiss = useCallback((id: number) => {
    setToasts((prev) => prev.filter((item) => item.id !== id));
  }, []);

  useEffect(() => {
    let index = 0;

    const show = () => {
      const n = NOTIFICATIONS[index % NOTIFICATIONS.length];
      index++;
      const id = ++toastCounter;
      setToasts((prev) => [...prev.slice(-2), { id, ...n }]);
      addAllocation(n.shares);
      setTimeout(() => dismiss(id), 5000);
    };

    const first = setTimeout(show, 3000);

    let timeout: ReturnType<typeof setTimeout>;
    const schedule = () => {
      const delay = 8000 + Math.random() * 6000;
      timeout = setTimeout(() => {
        show();
        schedule();
      }, delay);
    };
    const initSchedule = setTimeout(schedule, 3000);

    return () => {
      clearTimeout(first);
      clearTimeout(initSchedule);
      clearTimeout(timeout);
    };
  }, [dismiss]);

  return (
    <div className="fixed bottom-4 left-4 z-50 flex flex-col gap-2 pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="pointer-events-auto animate-slide-up bg-navy-800/95 backdrop-blur-md border border-slate-700/60 rounded-xl shadow-2xl shadow-black/40 px-4 py-3 flex items-start gap-3 max-w-xs w-full"
        >
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center flex-shrink-0 text-white text-xs font-bold">
            {toast.name[0]}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white text-sm font-semibold leading-tight">
              {toast.name}
              <span className="text-slate-400 font-normal"> — {toast.city}</span>
            </p>
            <p className="text-emerald-400 text-xs font-semibold mt-0.5">
              {t.toast.secured} {toast.shares.toLocaleString('en-US')} {t.toast.shares_at}
            </p>
          </div>
          <button
            onClick={() => dismiss(toast.id)}
            className="text-slate-600 hover:text-slate-400 flex-shrink-0 transition-colors mt-0.5"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
}
