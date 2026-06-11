import { type Request, type Response, type NextFunction } from "express";
import { db, adminsTable } from "@workspace/db";
import { eq, sql } from "drizzle-orm";

// Bootstrap lock key (arbitrary constant) used to serialize the
// "first authenticated user becomes admin" critical section.
const ADMIN_BOOTSTRAP_LOCK = 727274;

export async function ensureAdminAccess(
  userId: string,
  email: string | null,
): Promise<boolean> {
  const existing = await db
    .select()
    .from(adminsTable)
    .where(eq(adminsTable.id, userId));
  if (existing.length > 0) return true;

  // Serialize bootstrap attempts with a transaction-scoped advisory lock so
  // exactly one admin can ever be created, and authorization always reflects
  // actual membership.
  return await db.transaction(async (tx) => {
    await tx.execute(sql`SELECT pg_advisory_xact_lock(${ADMIN_BOOTSTRAP_LOCK})`);

    const [{ count }] = await tx
      .select({ count: sql<number>`count(*)::int` })
      .from(adminsTable);

    if (count === 0) {
      await tx
        .insert(adminsTable)
        .values({ id: userId, email, role: "admin" })
        .onConflictDoNothing();
      return true;
    }

    const [row] = await tx
      .select()
      .from(adminsTable)
      .where(eq(adminsTable.id, userId));
    return !!row;
  });
}

export async function requireAdmin(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  if (!req.isAuthenticated()) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  const ok = await ensureAdminAccess(req.user.id, req.user.email ?? null);
  if (!ok) {
    res.status(403).json({ error: "Forbidden" });
    return;
  }
  next();
}
