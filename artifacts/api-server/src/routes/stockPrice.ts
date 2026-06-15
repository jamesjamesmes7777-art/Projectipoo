import { Router, type IRouter, type Request, type Response } from "express";

const router: IRouter = Router();

// ── Fallback reference data (IPO day 2026-06-12, NASDAQ) ────
const FB_PREV_CLOSE = 135.00;
const FB_DAY_LOW    = 149.34;
const FB_DAY_HIGH   = 176.52;
const FB_IPO_CLOSE  = 160.95;

// ── Yahoo Finance live quote cache (15 s TTL) ────────────────
interface YQuote {
  price:     number;
  dayHigh:   number;
  dayLow:    number;
  prevClose: number;
  fetchedAt: number;
}
let yqCache: YQuote | null = null;
const YQ_TTL = 15_000;

async function fetchYahooQuote(): Promise<YQuote | null> {
  if (yqCache && Date.now() - yqCache.fetchedAt < YQ_TTL) return yqCache;
  try {
    const res = await fetch(
      "https://query1.finance.yahoo.com/v8/finance/chart/SPCX?interval=1m&range=1d",
      { headers: { "User-Agent": "Mozilla/5.0" }, signal: AbortSignal.timeout(5_000) },
    );
    if (!res.ok) return yqCache;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const json = await res.json() as any;
    const meta  = json?.chart?.result?.[0]?.meta;
    if (!meta) return yqCache;
    yqCache = {
      price:     meta.regularMarketPrice       ?? FB_IPO_CLOSE,
      dayHigh:   meta.regularMarketDayHigh     ?? FB_DAY_HIGH,
      dayLow:    meta.regularMarketDayLow      ?? FB_DAY_LOW,
      prevClose: meta.chartPreviousClose       ?? FB_PREV_CLOSE,
      fetchedAt: Date.now(),
    };
    return yqCache;
  } catch {
    return yqCache;
  }
}

// ── Sine-wave fallback price (mirrors frontend computePrice) ─
function sinePrice(now = Date.now()): number {
  const t = now / 60_000;
  const raw = FB_IPO_CLOSE
    + Math.sin(t / 47.3) * 6.8
    + Math.sin(t / 7.9)  * 2.1
    + Math.sin(t / 1.8)  * 0.55;
  return +(Math.max(FB_DAY_LOW + 1, Math.min(FB_DAY_HIGH - 1, raw))).toFixed(2);
}

// ── EUR/USD rate cache (ECB free feed, 1 h TTL) ──────────────
let cachedEurRate = 0.92;
let eurFetchedAt  = 0;
const EUR_TTL     = 60 * 60_000;

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
    const m = text.match(/currency='USD'\s+rate='([\d.]+)'/);
    if (m) {
      const usdPerEur = parseFloat(m[1]);
      if (usdPerEur > 0) {
        cachedEurRate = +(1 / usdPerEur).toFixed(6);
        eurFetchedAt  = now;
      }
    }
  } catch { /* keep last */ }
  return cachedEurRate;
}

// ── Route ────────────────────────────────────────────────────
router.get("/stock-price", async (_req: Request, res: Response) => {
  const [quote, eurRate] = await Promise.all([fetchYahooQuote(), getEurRate()]);

  const price     = quote?.price     ?? sinePrice();
  const dayHigh   = quote?.dayHigh   ?? FB_DAY_HIGH;
  const dayLow    = quote?.dayLow    ?? FB_DAY_LOW;
  const prevClose = quote?.prevClose ?? FB_PREV_CLOSE;

  const change    = +(price - prevClose).toFixed(2);
  const changePct = +((change / prevClose) * 100).toFixed(2);
  const spread    = 0.30;

  res.json({
    symbol:       "SPCX",
    name:         "Space Exploration Technologies Corp.",
    price,
    priceEur:     +(price     * eurRate).toFixed(2),
    eurRate,
    change,
    changePct,
    changeEur:    +(change    * eurRate).toFixed(2),
    bid:          +(price - spread / 2).toFixed(2),
    ask:          +(price + spread / 2).toFixed(2),
    prevClose,
    prevCloseEur: +(prevClose * eurRate).toFixed(2),
    dayLow,
    dayHigh,
    market:       "NASDAQ",
    currency:     "USD",
    lastUpdated:  new Date().toISOString(),
  });
});

export default router;
