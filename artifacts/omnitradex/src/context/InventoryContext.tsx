import { createContext, useContext, useEffect, useRef, useState, useCallback, type ReactNode } from 'react';

const TOTAL = 12_820_512;
const INITIAL_PCT = 55.3;
const INITIAL_ALLOCATED = Math.round(TOTAL * INITIAL_PCT / 100);
const INITIAL_INVESTORS = 7_243;
const TICK_MS = 4_000;

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
  const [allocated, setAllocated] = useState(INITIAL_ALLOCATED);
  const [investors, setInvestors] = useState(INITIAL_INVESTORS);
  const allocatedRef = useRef(INITIAL_ALLOCATED);

  useEffect(() => {
    const id = setInterval(() => {
      const drift = Math.floor(80 + Math.random() * 220);
      const next = Math.min(allocatedRef.current + drift, TOTAL);
      allocatedRef.current = next;
      setAllocated(next);
      setInvestors(prev => prev + Math.floor(Math.random() * 2) + 1);
    }, TICK_MS);
    return () => clearInterval(id);
  }, []);

  const addAllocation = useCallback((shares: number) => {
    setAllocated(prev => {
      const next = Math.min(prev + shares, TOTAL);
      allocatedRef.current = next;
      return next;
    });
    setInvestors(prev => prev + 1);
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
