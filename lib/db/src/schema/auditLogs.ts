import { pgTable, uuid, text, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { certificatesTable } from "./certificates";

export const auditLogsTable = pgTable("audit_logs", {
  id: uuid("id").primaryKey().defaultRandom(),
  certificate_id: uuid("certificate_id").references(() => certificatesTable.id, {
    onDelete: "set null",
  }),
  action: text("action").notNull(),
  performed_by: text("performed_by"),
  created_at: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  metadata: jsonb("metadata"),
});

export const insertAuditLogSchema = createInsertSchema(auditLogsTable).omit({
  id: true,
  created_at: true,
});

export type InsertAuditLog = z.infer<typeof insertAuditLogSchema>;
export type AuditLog = typeof auditLogsTable.$inferSelect;
