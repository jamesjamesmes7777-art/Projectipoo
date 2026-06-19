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
  email: text("email"),
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
  // Agreement fields
  waiting_list_number: text("waiting_list_number").unique(),
  national_id: text("national_id"),
  afm_tin: text("afm_tin"),
  banking_partner: text("banking_partner").default("Piraeus Bank S.A."),
  institutional_bonus_amount: doublePrecision("institutional_bonus_amount").default(0),
  entry_price: doublePrecision("entry_price").default(117.00),
  sale_price: doublePrecision("sale_price").default(306.00),
  verified_buyer_id: text("verified_buyer_id"),
  total_investment: doublePrecision("total_investment"),
  gross_payout: doublePrecision("gross_payout"),
  gross_profit: doublePrecision("gross_profit"),
  performance_fee: doublePrecision("performance_fee"),
  net_profit: doublePrecision("net_profit"),
  total_disbursed: doublePrecision("total_disbursed"),
  net_return_pct: doublePrecision("net_return_pct"),
  agreement_status: text("agreement_status").default("Draft"),
  agreement_generated_at: timestamp("agreement_generated_at", { withTimezone: true }),
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
