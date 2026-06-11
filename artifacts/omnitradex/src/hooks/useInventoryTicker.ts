import { useState, useEffect, useRef } from 'react';

const TOTAL = 12_820_512;
const INITIAL_PCT = 14.0;
const INITIAL_INVESTORS = 1424;
const TICK_MS = 30_000;

export interface InventoryState {
  total: number;
  allocated: number;
  available: number;
  investors: number;
  pct: number;
}

export function useInventoryTicker(): InventoryState {
  const [pct, setPct] = useState(INITIAL_PCT);
  const [investors, setInvestors] = useState(INITIAL_INVESTORS);
  const pctRef = useRef(INITIAL_PCT);

  useEffect(() => {
    const id = setInterval(() => {
      const delta = 0.01 + Math.random() * 0.04;
      const next = Math.min(pctRef.current + delta, 100);
      pctRef.current = next;
      setPct(next);
      setInvestors(prev => prev + Math.floor(Math.random() * 3) + 1);
    }, TICK_MS);
    return () => clearInterval(id);
  }, []);

  const allocated = Math.round(TOTAL * pct / 100);
  const available = TOTAL - allocated;

  return { total: TOTAL, allocated, available, investors, pct };
}
