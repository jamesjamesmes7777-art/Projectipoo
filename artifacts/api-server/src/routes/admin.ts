import { Router, type IRouter, type Request, type Response } from "express";
import { db, auditLogsTable } from "@workspace/db";
import { desc, eq } from "drizzle-orm";
import { ensureAdminAccess, requireAdmin } from "../middlewares/requireAdmin";

const router: IRouter = Router();

// Returns the current user along with whether they have admin access.
// The first authenticated user is bootstrapped as the initial admin.
router.get("/admin/me", async (req: Request, res: Response): Promise<void> => {
  if (!req.isAuthenticated()) {
    res.json({ user: null, isAdmin: false });
    return;
  }
  const isAdmin = await ensureAdminAccess(req.user.id, req.user.email ?? null);
  res.json({ user: req.user, isAdmin });
});

// Admin: list audit logs, optionally filtered by certificate.
router.get(
  "/audit-logs",
  requireAdmin,
  async (req: Request, res: Response): Promise<void> => {
    const certificateId =
      typeof req.query.certificate_id === "string"
        ? req.query.certificate_id
        : undefined;

    const rows = certificateId
      ? await db
          .select()
          .from(auditLogsTable)
          .where(eq(auditLogsTable.certificate_id, certificateId))
          .orderBy(desc(auditLogsTable.created_at))
          .limit(200)
      : await db
          .select()
          .from(auditLogsTable)
          .orderBy(desc(auditLogsTable.created_at))
          .limit(200);

    res.json({ auditLogs: rows });
  },
);

export default router;
