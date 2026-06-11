import { db, auditLogsTable } from "@workspace/db";

export async function logAction(
  certificateId: string | null,
  action: string,
  performedBy: string | null,
  metadata: Record<string, unknown> = {},
): Promise<void> {
  await db.insert(auditLogsTable).values({
    certificate_id: certificateId,
    action,
    performed_by: performedBy,
    metadata,
  });
}
