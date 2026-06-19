import { Router, type IRouter, type Request, type Response } from "express";
import { db, certificatesTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { z } from "zod/v4";
import { requireAdmin } from "../middlewares/requireAdmin";
import { logAction } from "../lib/audit";

const router: IRouter = Router();

const agreementConfigSchema = z.object({
  national_id: z.string().trim().max(100).optional(),
  afm_tin: z.string().trim().max(100).optional(),
  banking_partner: z.string().trim().max(200).optional(),
  institutional_bonus_amount: z.number().min(0).optional(),
  entry_price: z.number().positive().optional(),
  sale_price: z.number().positive().optional(),
  verified_buyer_id: z.string().trim().max(200).optional(),
  shares_override: z.number().int().positive().optional(),
});

// Public: look up an agreement by waiting list number.
router.get(
  "/agreements/waiting-list/:wlNumber",
  async (req: Request, res: Response): Promise<void> => {
    const wlNumber = String(req.params.wlNumber).trim().toUpperCase();
    const [cert] = await db
      .select()
      .from(certificatesTable)
      .where(eq(certificatesTable.waiting_list_number, wlNumber));

    if (!cert || cert.agreement_status !== "Generated") {
      res.json({ agreement: null });
      return;
    }
    res.json({ agreement: cert });
  },
);

// Admin: generate/freeze agreement for a certificate.
router.post(
  "/agreements/:id/generate",
  requireAdmin,
  async (req: Request, res: Response): Promise<void> => {
    const parsed = agreementConfigSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: z.treeifyError(parsed.error) });
      return;
    }

    const id = String(req.params.id);
    const [existing] = await db
      .select()
      .from(certificatesTable)
      .where(eq(certificatesTable.id, id));

    if (!existing) {
      res.status(404).json({ error: "Certificate not found" });
      return;
    }

    const data = parsed.data;
    const shares = data.shares_override ?? existing.shares;
    const entryPrice = data.entry_price ?? existing.entry_price ?? 117;
    const salePrice = data.sale_price ?? existing.sale_price ?? 306;
    const bonusAmount = data.institutional_bonus_amount ?? existing.institutional_bonus_amount ?? 0;

    const clientCash = shares * entryPrice;
    const totalInvestment = clientCash + bonusAmount;
    const grossPayout = shares * salePrice;
    const grossProfit = grossPayout - totalInvestment;
    const performanceFee = grossProfit * 0.17;
    const netProfit = grossProfit - performanceFee;
    const totalDisbursed = totalInvestment + netProfit;
    const netReturnPct = totalInvestment > 0 ? (netProfit / totalInvestment) * 100 : 0;

    const waitingListNumber = existing.waiting_list_number
      ?? ("WL-" + Math.random().toString(36).slice(2, 10).toUpperCase());

    const updates: Record<string, unknown> = {
      national_id: data.national_id ?? existing.national_id,
      afm_tin: data.afm_tin ?? existing.afm_tin,
      banking_partner: data.banking_partner ?? existing.banking_partner ?? "Piraeus Bank S.A.",
      institutional_bonus_amount: bonusAmount,
      entry_price: entryPrice,
      sale_price: salePrice,
      verified_buyer_id: data.verified_buyer_id ?? existing.verified_buyer_id,
      shares: shares,
      total_investment: totalInvestment,
      gross_payout: grossPayout,
      gross_profit: grossProfit,
      performance_fee: performanceFee,
      net_profit: netProfit,
      total_disbursed: totalDisbursed,
      net_return_pct: netReturnPct,
      agreement_status: "Generated",
      agreement_generated_at: new Date(),
      waiting_list_number: waitingListNumber,
    };

    const [cert] = await db
      .update(certificatesTable)
      .set(updates)
      .where(eq(certificatesTable.id, id))
      .returning();

    if (!cert) {
      res.status(404).json({ error: "Certificate not found" });
      return;
    }

    await logAction(cert.id, "UPDATED", req.user!.id, {
      action: "AGREEMENT_GENERATED",
      waiting_list_number: waitingListNumber,
    });

    res.json({ certificate: cert });
  },
);

export default router;
