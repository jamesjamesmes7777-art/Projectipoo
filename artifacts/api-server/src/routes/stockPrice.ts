import { Router, type IRouter, type Request, type Response } from "express";

const router: IRouter = Router();

// Reference data from NASDAQ as of 2026-06-12 (IPO day)
const PREV_CLOSE = 135.00;   // pre-IPO reference price
const DAY_LOW    = 149.34;
const DAY_HIGH   = 176.52;
const IPO_CLOSE  = 160.95;   // first-day closing price

function getStockPrice(now = Date.now()) {
  const t = now / 60_000; // minutes since epoch
  // Deterministic sine waves — same value for every visitor at the same time
  const slowWave  = Math.sin(t / 47.3) * 6.8;   // ~47-min cycle ±$6.8
  const fastWave  = Math.sin(t / 7.9)  * 2.1;   // ~8-min cycle  ±$2.1
  const microWave = Math.sin(t / 1.8)  * 0.55;  // ~2-min cycle  ±$0.55
  // Anchor oscillation around IPO close, clamped inside day range
  const raw = IPO_CLOSE + slowWave + fastWave + microWave;
  const price = +(Math.max(DAY_LOW + 1, Math.min(DAY_HIGH - 1, raw))).toFixed(2);

  const change    = +(price - PREV_CLOSE).toFixed(2);
  const changePct = +((change / PREV_CLOSE) * 100).toFixed(2);
  const spread    = 0.30;
  const bid       = +(price - spread / 2).toFixed(2);
  const ask       = +(price + spread / 2).toFixed(2);

  return {
    symbol: "SPCX",
    name: "Space Exploration Technologies Corp.",
    price,
    change,
    changePct,
    bid,
    ask,
    prevClose: PREV_CLOSE,
    dayLow: DAY_LOW,
    dayHigh: DAY_HIGH,
    market: "NASDAQ",
    currency: "USD",
    lastUpdated: new Date(now).toISOString(),
  };
}

router.get("/stock-price", (_req: Request, res: Response) => {
  res.json(getStockPrice());
});

export default router;
