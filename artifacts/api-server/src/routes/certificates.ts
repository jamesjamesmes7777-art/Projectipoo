import { Router, type IRouter, type Request, type Response } from "express";
import { db, certificatesTable } from "@workspace/db";
import { insertCertificateSchema, updateCertificateSchema } from "@workspace/db";
import { eq, desc } from "drizzle-orm";
import { z } from "zod/v4";
import { requireAdmin } from "../middlewares/requireAdmin";
import { logAction } from "../lib/audit";

const router: IRouter = Router();

const approvalStatusSchema = z.enum([
  "DRAFT",
  "PENDING",
  "APPROVED",
  "REJECTED",
  "REVOKED",
]);

// Public: look up a certificate by reference number. Only APPROVED certificates
// are exposed publicly; anything else is treated as not found.
router.get(
  "/certificates/verify/:ref",
  async (req: Request, res: Response): Promise<void> => {
    const ref = String(req.params.ref).trim();
    const [cert] = await db
      .select()
      .from(certificatesTable)
      .where(eq(certificatesTable.reference_number, ref));

    if (!cert || cert.approval_status !== "APPROVED") {
      res.json({ certificate: null });
      return;
    }
    res.json({ certificate: cert });
  },
);

// Admin: list all certificates.
router.get(
  "/certificates",
  requireAdmin,
  async (_req: Request, res: Response): Promise<void> => {
    const rows = await db
      .select()
      .from(certificatesTable)
      .orderBy(desc(certificatesTable.created_at));
    res.json({ certificates: rows });
  },
);

// Admin: create a certificate.
router.post(
  "/certificates",
  requireAdmin,
  async (req: Request, res: Response): Promise<void> => {
    const parsed = insertCertificateSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: z.treeifyError(parsed.error) });
      return;
    }

    const userId = req.user!.id;
    const [cert] = await db
      .insert(certificatesTable)
      .values({ ...parsed.data, created_by: userId })
      .returning();

    await logAction(cert.id, "CREATED", userId, {
      holder_name: cert.holder_name,
    });
    res.status(201).json({ certificate: cert });
  },
);

// Admin: update a certificate.
router.patch(
  "/certificates/:id",
  requireAdmin,
  async (req: Request, res: Response): Promise<void> => {
    const parsed = updateCertificateSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: z.treeifyError(parsed.error) });
      return;
    }

    const [cert] = await db
      .update(certificatesTable)
      .set(parsed.data)
      .where(eq(certificatesTable.id, String(req.params.id)))
      .returning();

    if (!cert) {
      res.status(404).json({ error: "Certificate not found" });
      return;
    }

    await logAction(cert.id, "UPDATED", req.user!.id, parsed.data);
    res.json({ certificate: cert });
  },
);

// Admin: set approval status.
router.post(
  "/certificates/:id/approval",
  requireAdmin,
  async (req: Request, res: Response): Promise<void> => {
    const parsed = z
      .object({ status: approvalStatusSchema })
      .safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: z.treeifyError(parsed.error) });
      return;
    }

    const userId = req.user!.id;
    const now = new Date();
    const updates: Record<string, unknown> = {
      approval_status: parsed.data.status,
    };
    if (parsed.data.status === "APPROVED") {
      updates.approved_by = userId;
      updates.approved_at = now;
      // The certificate's issue date is generated at the moment of approval.
      updates.issue_date = now.toISOString().slice(0, 10);
    }

    const [cert] = await db
      .update(certificatesTable)
      .set(updates)
      .where(eq(certificatesTable.id, String(req.params.id)))
      .returning();

    if (!cert) {
      res.status(404).json({ error: "Certificate not found" });
      return;
    }

    await logAction(cert.id, parsed.data.status, userId, {});
    res.json({ certificate: cert });
  },
);

// Admin: delete a certificate.
router.delete(
  "/certificates/:id",
  requireAdmin,
  async (req: Request, res: Response): Promise<void> => {
    const id = String(req.params.id);
    const [cert] = await db
      .delete(certificatesTable)
      .where(eq(certificatesTable.id, id))
      .returning();

    if (!cert) {
      res.status(404).json({ error: "Certificate not found" });
      return;
    }

    await logAction(null, "DELETED", req.user!.id, {
      certificate_id: cert.id,
      reference_number: cert.reference_number,
    });
    res.json({ success: true });
  },
);

export default router;
