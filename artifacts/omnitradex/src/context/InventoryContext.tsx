import { createContext, useContext, useEffect, useRef, useState, useCallback, type ReactNode } from 'react';

const TOTAL = 12_820_512;
const INITIAL_ALLOCATED = Math.round(TOTAL * 0.6162); // ~7,900,219
const INITIAL_INVESTORS = 7_243;
const TICK_MS = 30_000;
const DEADLINE = new Date('2026-06-19T22:54:00').getTime(); // local time
const LS_KEY = 'otx_inventory_v2'; // v2 clears any old persisted baseline

interface Persisted { allocated: number; investors: number }

function load(): Persisted {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (raw) {
      const p = JSON.parse(raw) as Persisted;
      if (
        typeof p.allocated === 'number' && typeof p.investors === 'number' &&
        p.allocated >= INITIAL_ALLOCATED && p.allocated <= TOTAL &&
        p.investors >= INITIAL_INVESTORS
      ) return p;
    }
  } catch { /* ignore */ }
  return { allocated: INITIAL_ALLOCATED, investors: INITIAL_INVESTORS };
}

function persist(allocated: number, investors: number) {
  try { localStorage.setItem(LS_KEY, JSON.stringify({ allocated, investors })); } catch { /* ignore */ }
}

/** Per-tick drift sized so allocated reaches TOTAL exactly by the deadline. */
function tickDrift(currentAllocated: number): number {
  const now = Date.now();
  const msLeft = DEADLINE - now;
  if (msLeft <= 0) return TOTAL - currentAllocated;
  const remaining = TOTAL - currentAllocated;
  if (remaining <= 0) return 0;
  const ticksLeft = Math.max(1, msLeft / TICK_MS);
  const jitter = 1 + (Math.random() * 0.3 - 0.15); // ±15 %
  return Math.max(1, Math.round((remaining / ticksLeft) * jitter));
}

export interface InventoryState {
  total: number;
  allocated: number;
  available: number;
  investors: number;
  pct: number;
  addAllocation: (shares: number) => void;
}

const InventoryContext = createContext<InventoryState | null>(null);

export function InventoryProvider({ children }: { children: ReactNode }) {
  const init = load();
  const [allocated, setAllocated] = useState(init.allocated);
  const [investors, setInvestors] = useState(init.investors);
  const allocatedRef = useRef(init.allocated);
  const investorsRef = useRef(init.investors);

  useEffect(() => {
    const id = setInterval(() => {
      const drift = tickDrift(allocatedRef.current);
      const nextAlloc = Math.min(allocatedRef.current + drift, TOTAL);
      const nextInv = investorsRef.current + Math.floor(Math.random() * 2) + 1;
      allocatedRef.current = nextAlloc;
      investorsRef.current = nextInv;
      setAllocated(nextAlloc);
      setInvestors(nextInv);
      persist(nextAlloc, nextInv);
    }, TICK_MS);
    return () => clearInterval(id);
  }, []);

  const addAllocation = useCallback((shares: number) => {
    setAllocated(prev => {
      const next = Math.min(prev + shares, TOTAL);
      allocatedRef.current = next;
      persist(next, investorsRef.current);
      return next;
    });
    setInvestors(prev => {
      const next = prev + 1;
      investorsRef.current = next;
      persist(allocatedRef.current, next);
      return next;
    });
  }, []);

  const available = TOTAL - allocated;
  const pct = (allocated / TOTAL) * 100;

  return (
    <InventoryContext.Provider value={{ total: TOTAL, allocated, available, investors, pct, addAllocation }}>
      {children}
    </InventoryContext.Provider>
  );
}

export function useInventory(): InventoryState {
  const ctx = useContext(InventoryContext);
  if (!ctx) throw new Error('useInventory must be used inside InventoryProvider');
  return ctx;
}
