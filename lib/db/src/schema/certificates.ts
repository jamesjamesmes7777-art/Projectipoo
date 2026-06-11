import {
  pgTable,
  uuid,
  text,
  integer,
  doublePrecision,
  date,
  timestamp,
  check,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const certificatesTable = pgTable("certificates", {
  id: uuid("id").primaryKey().defaultRandom(),
  reference_number: text("reference_number").notNull().unique(),
  holder_name: text("holder_name").notNull(),
  registered_address: text("registered_address"),
  security_name: text("security_name").notNull().default("SpaceX"),
  security_code: text("security_code").notNull().default("SPCX"),
  shares: integer("shares").notNull(),
  allocation_price: doublePrecision("allocation_price").notNull(),
  total_consideration: doublePrecision("total_consideration").notNull(),
  issue_date: date("issue_date", { mode: "string" }).notNull(),
  certificate_number: text("certificate_number").notNull().unique(),
  integrity_hash: text("integrity_hash").notNull(),
  status: text("status").notNull().default("Settled • Verified"),
  approval_status: text("approval_status").notNull().default("DRAFT"),
  language: text("language").notNull().default("en"),
  account_manager: text("account_manager"),
  approved_by: text("approved_by"),
  approved_at: timestamp("approved_at", { withTimezone: true }),
  created_by: text("created_by"),
  created_at: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updated_at: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
  qr_url: text("qr_url"),
  pdf_url: text("pdf_url"),
}, (table) => [
  check(
    "certificates_approval_status_check",
    sql`${table.approval_status} IN ('DRAFT','PENDING','APPROVED','REJECTED','REVOKED')`,
  ),
]);

export const insertCertificateSchema = createInsertSchema(certificatesTable).omit({
  id: true,
  created_at: true,
  updated_at: true,
});

export const updateCertificateSchema = insertCertificateSchema.partial();

export type InsertCertificate = z.infer<typeof insertCertificateSchema>;
export type UpdateCertificate = z.infer<typeof updateCertificateSchema>;
export type Certificate = typeof certificatesTable.$inferSelect;
