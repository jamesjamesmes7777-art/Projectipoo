import { Router, type IRouter, type Request, type Response } from "express";

const router: IRouter = Router();

const BASE_PRICE = 370.0;
const PREV_CLOSE = 358.5;

function getStockPrice(now = Date.now()) {
  const t = now / 60_000; // minutes since epoch
  // Two deterministic sine waves so the price moves realistically
  const slowWave = Math.sin(t / 53.7) * 9.2;  // ~54-min cycle ±$9.2
  const fastWave = Math.sin(t / 8.1) * 2.4;   // ~8-min cycle  ±$2.4
  const microWave = Math.sin(t / 1.7) * 0.6;  // ~2-min cycle  ±$0.6
  const price = +(BASE_PRICE + slowWave + fastWave + microWave).toFixed(2);

  const change = +(price - PREV_CLOSE).toFixed(2);
  const changePct = +((change / PREV_CLOSE) * 100).toFixed(2);
  const spread = 0.30;
  const bid = +(price - spread / 2).toFixed(2);
  const ask = +(price + spread / 2).toFixed(2);

  // Daily range anchored to current price
  const dayLow = +(price - 4.8 - Math.abs(slowWave) * 0.3).toFixed(2);
  const dayHigh = +(price + 3.5 + Math.abs(slowWave) * 0.2).toFixed(2);

  return {
    symbol: "SPCX",
    name: "Space Exploration Technologies Corp.",
    price,
    change,
    changePct,
    bid,
    ask,
    prevClose: PREV_CLOSE,
    dayLow,
    dayHigh,
    market: "OTC Private Markets",
    currency: "USD",
    lastUpdated: new Date(now).toISOString(),
  };
}

router.get("/stock-price", (_req: Request, res: Response) => {
  res.json(getStockPrice());
});

export default router;
