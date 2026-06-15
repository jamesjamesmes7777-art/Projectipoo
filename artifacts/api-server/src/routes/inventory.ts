import { Router, type IRouter, type Request, type Response } from "express";

const router: IRouter = Router();

const TOTAL = 17_820_512; // original 12,820,512 + 5,000,000 additional acquisition
const START_ALLOCATED = 7_900_219;
const START_INVESTORS = 7_243;
const DEADLINE_INVESTORS = 8_850;

// Fixed UTC timestamps — identical result on every server and every client
const START_MS = new Date("2026-06-11T21:00:00Z").getTime(); // midnight UTC+3 on Jun 12
const DEADLINE_MS = new Date("2026-06-19T19:54:00Z").getTime(); // 22:54 UTC+3 on Jun 19

function lerp(from: number, to: number, t: number) {
  return Math.round(from + (to - from) * Math.max(0, Math.min(1, t)));
}

function getInventory(now = Date.now()) {
  const t = (now - START_MS) / (DEADLINE_MS - START_MS);
  const allocated = lerp(START_ALLOCATED, TOTAL, t);
  const investors = lerp(START_INVESTORS, DEADLINE_INVESTORS, t);
  const available = TOTAL - allocated;
  const pct = (allocated / TOTAL) * 100;
  return { total: TOTAL, allocated, available, investors, pct };
}

router.get("/inventory", (_req: Request, res: Response) => {
  res.json(getInventory());
});

export default router;
