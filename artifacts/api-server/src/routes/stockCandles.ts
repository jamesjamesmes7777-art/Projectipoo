import { Router, type IRouter, type Request, type Response } from "express";

const router: IRouter = Router();

interface Candle {
  time:   number;
  open:   number;
  high:   number;
  low:    number;
  close:  number;
  volume: number;
}

let candleCache: { candles: Candle[]; fetchedAt: number } | null = null;
const CANDLE_TTL = 60_000;

async function fetchCandles(): Promise<Candle[]> {
  if (candleCache && Date.now() - candleCache.fetchedAt < CANDLE_TTL) {
    return candleCache.candles;
  }
  try {
    const res = await fetch(
      "https://query1.finance.yahoo.com/v8/finance/chart/SPCX?interval=5m&range=1d",
      { headers: { "User-Agent": "Mozilla/5.0" }, signal: AbortSignal.timeout(6_000) },
    );
    if (!res.ok) throw new Error(`Yahoo HTTP ${res.status}`);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const json    = await res.json() as any;
    const result  = json?.chart?.result?.[0];
    if (!result)  throw new Error("no result");

    const timestamps: number[]  = result.timestamp ?? [];
    const quote                  = result.indicators?.quote?.[0] ?? {};
    const opens:  (number|null)[] = quote.open   ?? [];
    const highs:  (number|null)[] = quote.high   ?? [];
    const lows:   (number|null)[] = quote.low    ?? [];
    const closes: (number|null)[] = quote.close  ?? [];
    const vols:   (number|null)[] = quote.volume ?? [];

    const candles: Candle[] = [];
    for (let i = 0; i < timestamps.length; i++) {
      const o = opens[i], h = highs[i], l = lows[i], c = closes[i];
      if (o == null || h == null || l == null || c == null) continue;
      candles.push({
        time:   timestamps[i] * 1000,
        open:   +o.toFixed(2),
        high:   +h.toFixed(2),
        low:    +l.toFixed(2),
        close:  +c.toFixed(2),
        volume: vols[i] ?? 0,
      });
    }

    if (candles.length > 0) {
      candleCache = { candles, fetchedAt: Date.now() };
    }
    return candles;
  } catch {
    return candleCache?.candles ?? [];
  }
}

router.get("/stock-candles", async (_req: Request, res: Response) => {
  const candles = await fetchCandles();
  res.json({ candles });
});

export default router;
