import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from 'react';

const TOTAL = 17_820_512; // original 12,820,512 + 5,000,000 additional acquisition

export interface InventoryState {
  total: number;
  allocated: number;
  available: number;
  investors: number;
  pct: number;
  addAllocation: (shares: number) => void;
}

interface ServerInventory {
  total: number;
  allocated: number;
  available: number;
  investors: number;
  pct: number;
}

const TICK_MS = 30_000;

async function fetchInventory(): Promise<ServerInventory | null> {
  try {
    const res = await fetch('/api/inventory');
    if (!res.ok) return null;
    return res.json() as Promise<ServerInventory>;
  } catch {
    return null;
  }
}

const InventoryContext = createContext<InventoryState | null>(null);

export function InventoryProvider({ children }: { children: ReactNode }) {
  const [base, setBase] = useState<ServerInventory>({
    total: TOTAL,
    allocated: 0,
    available: TOTAL,
    investors: 0,
    pct: 0,
  });
  const [bonus, setBonus] = useState(0);      // shares added via real allocations
  const [invBonus, setInvBonus] = useState(0); // investors added via real allocations

  // Load on mount and poll every 30 s
  useEffect(() => {
    let cancelled = false;

    async function refresh() {
      const data = await fetchInventory();
      if (data && !cancelled) setBase(data);
    }

    refresh();
    const id = setInterval(refresh, TICK_MS);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, []);

  const addAllocation = useCallback((shares: number) => {
    setBonus(prev => prev + shares);
    setInvBonus(prev => prev + 1);
  }, []);

  const allocated = Math.min(base.allocated + bonus, TOTAL);
  const available = TOTAL - allocated;
  const pct = (allocated / TOTAL) * 100;
  const investors = base.investors + invBonus;

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
