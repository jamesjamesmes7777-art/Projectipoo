import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from 'react';

const TOTAL = 12_820_512;

// Fixed timeline — same on every device at the same moment
const START_TIME       = new Date('2026-06-12T00:00:00').getTime(); // local midnight launch day
const START_ALLOCATED  = 7_900_219;
const START_INVESTORS  = 7_243;
const DEADLINE         = new Date('2026-06-19T22:54:00').getTime(); // local time
const DEADLINE_INVESTORS = 8_850;

const TICK_MS = 30_000;

function getAllocated(now = Date.now()): number {
  if (now >= DEADLINE) return TOTAL;
  if (now <= START_TIME) return START_ALLOCATED;
  const t = (now - START_TIME) / (DEADLINE - START_TIME);
  return Math.round(START_ALLOCATED + t * (TOTAL - START_ALLOCATED));
}

function getInvestors(now = Date.now()): number {
  if (now >= DEADLINE) return DEADLINE_INVESTORS;
  if (now <= START_TIME) return START_INVESTORS;
  const t = (now - START_TIME) / (DEADLINE - START_TIME);
  return Math.round(START_INVESTORS + t * (DEADLINE_INVESTORS - START_INVESTORS));
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
  const [allocated, setAllocated] = useState(() => getAllocated());
  const [investors, setInvestors] = useState(() => getInvestors());
  const [bonus, setBonus] = useState(0); // extra from real allocations this session

  useEffect(() => {
    const id = setInterval(() => {
      setAllocated(getAllocated());
      setInvestors(getInvestors());
    }, TICK_MS);
    return () => clearInterval(id);
  }, []);

  const addAllocation = useCallback((shares: number) => {
    setBonus(prev => prev + shares);
    setInvestors(prev => prev + 1);
  }, []);

  const effectiveAllocated = Math.min(allocated + bonus, TOTAL);
  const available = TOTAL - effectiveAllocated;
  const pct = (effectiveAllocated / TOTAL) * 100;

  return (
    <InventoryContext.Provider value={{
      total: TOTAL,
      allocated: effectiveAllocated,
      available,
      investors,
      pct,
      addAllocation,
    }}>
      {children}
    </InventoryContext.Provider>
  );
}

export function useInventory(): InventoryState {
  const ctx = useContext(InventoryContext);
  if (!ctx) throw new Error('useInventory must be used inside InventoryProvider');
  return ctx;
}
