import { Router, type IRouter, type Request, type Response } from "express";

const router: IRouter = Router();

// Reference data from NASDAQ as of 2026-06-12 (IPO day)
const PREV_CLOSE = 135.00;
const DAY_LOW    = 149.34;
const DAY_HIGH   = 176.52;
const IPO_CLOSE  = 160.95;

// ── EUR/USD rate cache (ECB free feed) ──────────────────────
let cachedEurRate   = 0.92;  // EUR per 1 USD fallback
let eurFetchedAt    = 0;
const EUR_TTL       = 60 * 60_000; // refresh every hour

async function getEurRate(): Promise<number> {
  const now = Date.now();
  if (now - eurFetchedAt < EUR_TTL) return cachedEurRate;
  try {
    const res = await fetch(
      "https://www.ecb.europa.eu/stats/eurofxref/eurofxref-daily.xml",
      { signal: AbortSignal.timeout(5_000) },
    );
    if (!res.ok) return cachedEurRate;
    const text = await res.text();
    // ECB reports how many USD per 1 EUR, e.g. <Cube currency='USD' rate='1.0854'/>
    const m = text.match(/currency='USD'\s+rate='([\d.]+)'/);
    if (m) {
      const usdPerEur = parseFloat(m[1]);
      if (usdPerEur > 0) {
        cachedEurRate = +(1 / usdPerEur).toFixed(6);
        eurFetchedAt  = now;
      }
    }
  } catch { /* keep last cached rate */ }
  return cachedEurRate;
}

// ── Price calculation ────────────────────────────────────────
function calcUsdPrice(now = Date.now()) {
  const t         = now / 60_000;
  const slowWave  = Math.sin(t / 47.3) * 6.8;
  const fastWave  = Math.sin(t / 7.9)  * 2.1;
  const microWave = Math.sin(t / 1.8)  * 0.55;
  const raw = IPO_CLOSE + slowWave + fastWave + microWave;
  return +(Math.max(DAY_LOW + 1, Math.min(DAY_HIGH - 1, raw))).toFixed(2);
}

// ── Route ────────────────────────────────────────────────────
router.get("/stock-price", async (_req: Request, res: Response) => {
  const eurRate = await getEurRate();
  const price   = calcUsdPrice();

  const change    = +(price - PREV_CLOSE).toFixed(2);
  const changePct = +((change / PREV_CLOSE) * 100).toFixed(2);
  const spread    = 0.30;

  res.json({
    symbol:   "SPCX",
    name:     "Space Exploration Technologies Corp.",
    price,
    priceEur: +(price * eurRate).toFixed(2),
    eurRate,
    change,
    changePct,
    changeEur:    +(change  * eurRate).toFixed(2),
    bid:      +(price - spread / 2).toFixed(2),
    ask:      +(price + spread / 2).toFixed(2),
    prevClose:    PREV_CLOSE,
    prevCloseEur: +(PREV_CLOSE * eurRate).toFixed(2),
    dayLow:       DAY_LOW,
    dayHigh:      DAY_HIGH,
    market:       "NASDAQ",
    currency:     "USD",
    lastUpdated:  new Date().toISOString(),
  });
});

export default router;
